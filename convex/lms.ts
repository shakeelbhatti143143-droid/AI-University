import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * ----------------------------------------------------------------------------
 * LMS HELPERS: AUTHENTICATION & ACCESS CONTROL
 * ----------------------------------------------------------------------------
 */

async function resolveUser(ctx: any, args: { token?: string; email?: string; userId?: any }) {
  let user: any = null;

  if (args.token) {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q: any) => q.eq("token", args.token!))
      .first();
    if (session && session.expiresAt > Date.now()) {
      user = await ctx.db.get(session.userId);
    }
  }

  if (!user && args.email) {
    user = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", args.email!.toLowerCase()))
      .first();

    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_universityEmail", (q: any) => q.eq("universityEmail", args.email!.toLowerCase()))
        .first();
    }
  }

  if (!user && args.userId) {
    try {
      user = await ctx.db.get(args.userId);
    } catch {
      // not a direct ID
    }
  }

  return user;
}

function normalizeRole(role?: string): "student" | "teacher" | "admin" {
  const r = (role || "").toLowerCase();
  if (r === "admin" || r === "super_admin") return "admin";
  if (r === "faculty" || r === "teacher") return "teacher";
  return "student";
}

/**
 * Verifies that a student is strictly enrolled in the specified course.
 * Returns the approved enrollment record or throws an error.
 */
async function verifyStudentEnrollment(ctx: any, user: any, courseCodeOrId: string) {
  if (!user) {
    throw new Error("Authentication required.");
  }
  const role = normalizeRole(user.role);
  if (role === "admin" || role === "teacher") {
    // Teachers and Admins bypass student enrollment checks
    return true;
  }

  const studentKeys = new Set<string>();
  if (user._id) studentKeys.add(String(user._id));
  if (user.enrollmentId) studentKeys.add(user.enrollmentId);

  const allRegistrations = await ctx.db.query("courseRegistrations").collect();
  const isEnrolled = allRegistrations.some(
    (r: any) =>
      r.status === "Approved" &&
      (r.courseCode.toLowerCase() === courseCodeOrId.toLowerCase() ||
        r.courseId === courseCodeOrId) &&
      (studentKeys.has(r.studentId) ||
        studentKeys.has(r.enrollmentId) ||
        (r.studentEmail &&
          (r.studentEmail.toLowerCase() === user.email?.toLowerCase() ||
            r.studentEmail.toLowerCase() === user.universityEmail?.toLowerCase())))
  );

  if (!isEnrolled) {
    throw new Error(`Access Denied: You are not enrolled in course "${courseCodeOrId}".`);
  }
  return true;
}

/**
 * Verifies that a teacher is assigned to the specified course.
 */
async function verifyTeacherAssignment(ctx: any, user: any, courseCodeOrId: string) {
  if (!user) {
    throw new Error("Authentication required.");
  }
  const role = normalizeRole(user.role);
  const allCourses = await ctx.db.query("courses").collect();
  const course = allCourses.find(
    (c: any) =>
      String(c._id) === courseCodeOrId ||
      c.code.toLowerCase() === courseCodeOrId.toLowerCase()
  );

  if (!course) {
    throw new Error("Course not found.");
  }

  if (role === "admin") {
    return course; // Admins have university-wide governance rights
  }
  if (role !== "teacher") {
    throw new Error("Access Denied: Only faculty instructors can manage this course.");
  }

  const facultyProfile = await ctx.db
    .query("faculty")
    .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
    .first();

  const isAssigned =
    course.facultyId === String(user._id) ||
    (facultyProfile && course.facultyId === String(facultyProfile._id)) ||
    (course.instructorId && (course.instructorId === String(user._id) || (facultyProfile && course.instructorId === String(facultyProfile._id)))) ||
    (course.facultyName &&
      (course.facultyName.toLowerCase() === user.name?.toLowerCase() ||
        (facultyProfile && course.facultyName.toLowerCase() === facultyProfile.fullName?.toLowerCase())));

  // If no courses have been explicitly assigned yet, allow department faculty preview assignment
  if (!isAssigned) {
    throw new Error(`Access Denied: You are not assigned as instructor for course "${course.name} (${course.code})".`);
  }

  return course;
}


/**
 * Helper to record audit events in `auditLogs`
 */
async function recordAudit(ctx: any, user: any, actionType: any, details: string, entityAffected?: string) {
  try {
    await ctx.db.insert("auditLogs", {
      adminId: user?._id ? String(user._id) : "system",
      adminName: user?.name || "System",
      adminEmail: user?.universityEmail || user?.email || "system@iqra.edu.pk",
      actionType,
      module: "LMS",
      details,
      entityAffected,
      timestamp: Date.now(),
    });
  } catch (e) {
    console.warn("Could not log LMS audit:", e);
  }
}

/**
 * ----------------------------------------------------------------------------
 * STUDENT LECTURE QUERIES & MUTATIONS
 * ----------------------------------------------------------------------------
 */

/**
 * Get all courses for the enrolled student organized course-wise with lecture counts,
 * new lecture notification count, and completion progress.
 */
export const getStudentCoursesWithLectures = query({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) return [];

    const studentKeys = new Set<string>();
    if (user._id) studentKeys.add(String(user._id));
    if (user.enrollmentId) studentKeys.add(user.enrollmentId);

    // 1. Get approved course registrations for this student
    const allRegistrations = await ctx.db.query("courseRegistrations").collect();
    const approvedRegistrations = allRegistrations.filter(
      (r: any) =>
        r.status === "Approved" &&
        (studentKeys.has(r.studentId) ||
          studentKeys.has(r.enrollmentId) ||
          (r.studentEmail &&
            (r.studentEmail.toLowerCase() === user.email?.toLowerCase() ||
              r.studentEmail.toLowerCase() === user.universityEmail?.toLowerCase())))
    );

    const approvedCodes = new Set(approvedRegistrations.map((r) => r.courseCode.toUpperCase()));

    // 2. Fetch all published lectures
    const allLectures = await ctx.db
      .query("lectures")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // 3. Fetch student's lecture progress records
    const allProgress = await ctx.db
      .query("lectureProgress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const progressMap = new Map<string, any>();
    for (const p of allProgress) {
      progressMap.set(String(p.lectureId), p);
    }

    // 4. Fetch all courses for metadata
    const allCourses = await ctx.db.query("courses").collect();

    // 5. Build course-wise sections
    const results = [];

    for (const reg of approvedRegistrations) {
      const code = reg.courseCode.toUpperCase();
      const courseMeta = allCourses.find((c) => c.code.toUpperCase() === code);

      const courseLectures = allLectures.filter(
        (l) => l.courseCode.toUpperCase() === code || l.courseId === reg.courseId
      );

      // Sort by lectureNumber ascending
      courseLectures.sort((a, b) => a.lectureNumber - b.lectureNumber);

      let completedCount = 0;
      let newCount = 0;

      for (const lec of courseLectures) {
        const prog = progressMap.get(String(lec._id));
        if (prog && prog.completed) {
          completedCount++;
        } else if (!prog || prog.progress < 5) {
          newCount++;
        }
      }

      const totalLectures = courseLectures.length;
      const progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

      results.push({
        courseId: reg.courseId || (courseMeta ? String(courseMeta._id) : code),
        courseCode: code,
        courseTitle: reg.courseTitle || courseMeta?.name || code,
        teacherName: courseMeta?.facultyName || "Faculty Instructor",
        creditHours: reg.creditHours || courseMeta?.creditHours || 3,
        department: courseMeta?.department || "Department of Computing & Artificial Intelligence",
        semester: reg.semester || "Semester 1",
        totalLectures,
        completedLectures: completedCount,
        newLecturesCount: newCount,
        progressPercent,
      });
    }

    return results;
  },
});

/**
 * Get lectures for a specific course with full lecture details, video stream URLs,
 * resources, and student watch progress. (Strictly verifies enrollment)
 */
export const getStudentCourseLectures = query({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
    courseId: v.string(),
    courseCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) {
      throw new Error("Authentication required.");
    }

    // Resolve course code
    let courseCode = args.courseCode;
    let courseTitle = "";
    let teacherName = "";
    let creditHours = 3;

    const allCourses = await ctx.db.query("courses").collect();
    const course = allCourses.find(
      (c) =>
        String(c._id) === args.courseId ||
        c.code.toLowerCase() === args.courseId.toLowerCase() ||
        (courseCode && c.code.toLowerCase() === courseCode.toLowerCase())
    );

    if (course) {
      courseCode = course.code;
      courseTitle = course.name;
      teacherName = course.facultyName || "Faculty Instructor";
      creditHours = course.creditHours;
    } else if (courseCode) {
      courseTitle = courseCode;
    } else {
      courseCode = args.courseId;
      courseTitle = args.courseId;
    }

    // Verify enrollment
    await verifyStudentEnrollment(ctx, user, courseCode);

    // Fetch published lectures for this course
    const lectures = await ctx.db
      .query("lectures")
      .withIndex("by_courseCode_and_status", (q) =>
        q.eq("courseCode", courseCode!).eq("status", "published")
      )
      .collect();

    lectures.sort((a, b) => a.lectureNumber - b.lectureNumber);

    // Fetch resources and progress
    const allResources = await ctx.db.query("lectureResources").collect();
    const allProgress = await ctx.db
      .query("lectureProgress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const progressMap = new Map<string, any>();
    for (const p of allProgress) {
      progressMap.set(String(p.lectureId), p);
    }

    // Resolve URLs and map lectures
    const resolvedLectures = await Promise.all(
      lectures.map(async (lec) => {
        let videoUrl = lec.videoUrl;
        if (lec.videoStorageId) {
          try {
            const resolved = await ctx.storage.getUrl(lec.videoStorageId);
            if (resolved) videoUrl = resolved;
          } catch (e) {
            // ignore
          }
        }

        let thumbnailUrl = lec.thumbnailUrl;
        if (lec.thumbnailStorageId) {
          try {
            const resolved = await ctx.storage.getUrl(lec.thumbnailStorageId);
            if (resolved) thumbnailUrl = resolved;
          } catch (e) {
            // ignore
          }
        }

        const resources = allResources.filter((r) => r.lectureId === lec._id);
        const resolvedResources = await Promise.all(
          resources.map(async (res) => {
            let resUrl = res.url;
            if (res.storageId) {
              const rUrl = await ctx.storage.getUrl(res.storageId);
              if (rUrl) resUrl = rUrl;
            }
            return {
              id: String(res._id),
              name: res.name,
              url: resUrl,
              fileType: res.fileType,
              fileSize: res.fileSize,
            };
          })
        );

        const prog = progressMap.get(String(lec._id));
        const isCompleted = prog?.completed || false;
        const progressPercent = prog?.progress || 0;
        const lastPosition = prog?.lastPosition || 0;
        const isNew = !prog || (progressPercent < 5 && !isCompleted);

        return {
          id: String(lec._id),
          courseId: lec.courseId,
          courseCode: lec.courseCode,
          courseTitle: lec.courseTitle || courseTitle,
          teacherName: lec.teacherName || teacherName,
          title: lec.title,
          description: lec.description,
          lectureNumber: lec.lectureNumber,
          videoUrl: videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // reliable fallback stream
          thumbnailUrl,
          duration: lec.duration || "45 minutes",
          durationMinutes: lec.durationMinutes || 45,
          publishedAt: lec.publishedAt || lec.createdAt,
          createdAt: lec.createdAt,
          status: isCompleted ? "COMPLETED" : isNew ? "NEW" : "IN_PROGRESS",
          progressPercent,
          lastPosition,
          isCompleted,
          isNew,
          resources: resolvedResources,
        };
      })
    );

    const completedCount = resolvedLectures.filter((l) => l.isCompleted).length;
    const totalCount = resolvedLectures.length;
    const courseProgressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      course: {
        id: args.courseId,
        code: courseCode,
        title: courseTitle,
        teacherName,
        creditHours,
        totalLectures: totalCount,
        completedLectures: completedCount,
        progressPercent: courseProgressPercent,
      },
      lectures: resolvedLectures,
    };
  },
});

/**
 * Save video player watch progress (lastPosition in seconds, progress percentage, completion status).
 */
export const saveLectureProgress = mutation({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
    lectureId: v.id("lectures"),
    progress: v.number(), // 0 - 100
    lastPosition: v.number(), // seconds
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) {
      throw new Error("Authentication required.");
    }

    const lecture = await ctx.db.get(args.lectureId);
    if (!lecture) {
      throw new Error("Lecture not found.");
    }

    // Verify enrollment
    await verifyStudentEnrollment(ctx, user, lecture.courseCode);

    const studentId = user.enrollmentId || String(user._id);
    const shouldComplete = args.completed || args.progress >= 90;
    const now = Date.now();

    // Check if progress already exists
    const existing = await ctx.db
      .query("lectureProgress")
      .withIndex("by_student_and_lecture", (q) =>
        q.eq("studentId", studentId).eq("lectureId", args.lectureId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        progress: Math.max(existing.progress, Math.min(100, Math.round(args.progress))),
        lastPosition: args.lastPosition,
        completed: existing.completed || shouldComplete,
        completedAt: shouldComplete ? (existing.completedAt || now) : existing.completedAt,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("lectureProgress", {
        userId: user._id,
        studentId,
        lectureId: args.lectureId,
        courseId: lecture.courseId,
        courseCode: lecture.courseCode,
        progress: Math.min(100, Math.round(args.progress)),
        lastPosition: args.lastPosition,
        completed: shouldComplete,
        completedAt: shouldComplete ? now : undefined,
        updatedAt: now,
      });
    }

    // Mark any corresponding lecture notification as read
    const notifs = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const n of notifs) {
      if (n.lectureId === String(args.lectureId) && !n.read) {
        await ctx.db.patch(n._id, { read: true });
      }
    }

    return { success: true, completed: shouldComplete };
  },
});

/**
 * Reactive Badge Counts for Student Sidebar:
 * - Unread / New lectures across all enrolled courses
 * - Upcoming / Live online classes for enrolled courses
 */
export const getStudentBadgeCounts = query({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) {
      return { newLecturesCount: 0, upcomingClassesCount: 0, liveClassesCount: 0, totalBadge: 0 };
    }

    const studentKeys = new Set<string>();
    if (user._id) studentKeys.add(String(user._id));
    if (user.enrollmentId) studentKeys.add(user.enrollmentId);

    // Enrolled course codes
    const allRegistrations = await ctx.db.query("courseRegistrations").collect();
    const approvedCodes = new Set(
      allRegistrations
        .filter(
          (r: any) =>
            r.status === "Approved" &&
            (studentKeys.has(r.studentId) ||
              studentKeys.has(r.enrollmentId) ||
              (r.studentEmail &&
                (r.studentEmail.toLowerCase() === user.email?.toLowerCase() ||
                  r.studentEmail.toLowerCase() === user.universityEmail?.toLowerCase())))
        )
        .map((r) => r.courseCode.toUpperCase())
    );

    if (approvedCodes.size === 0) {
      return { newLecturesCount: 0, upcomingClassesCount: 0, liveClassesCount: 0, totalBadge: 0 };
    }

    // 1. Calculate new lectures
    const allLectures = await ctx.db
      .query("lectures")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const enrolledLectures = allLectures.filter((l) =>
      approvedCodes.has(l.courseCode.toUpperCase())
    );

    const allProgress = await ctx.db
      .query("lectureProgress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const completedLectureIds = new Set(
      allProgress.filter((p) => p.completed).map((p) => String(p.lectureId))
    );

    // Also count lectures viewed (progress > 5%)
    const viewedLectureIds = new Set(
      allProgress.filter((p) => p.progress >= 5).map((p) => String(p.lectureId))
    );

    const newLectures = enrolledLectures.filter(
      (l) => !completedLectureIds.has(String(l._id)) && !viewedLectureIds.has(String(l._id))
    );

    return {
      newLecturesCount: newLectures.length,
      upcomingClassesCount: 0,
      liveClassesCount: 0,
      totalBadge: newLectures.length,
    };
  },
});

/**
 * ----------------------------------------------------------------------------
 * TEACHER (FACULTY) LECTURE MANAGEMENT
 * ----------------------------------------------------------------------------
 */

/**
 * Get assigned courses for teacher with lecture counts and metrics
 */
export const getTeacherCoursesWithStats = query({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) return [];

    const role = normalizeRole(user.role);
    if (role === "student") {
      throw new Error("Access Denied: Teacher portal is restricted.");
    }

    const allCourses = await ctx.db.query("courses").collect();
    const facultyProfile = await ctx.db
      .query("faculty")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    const teacherName = facultyProfile?.fullName || user.name;
    const teacherId = String(user._id);

    let assignedCourses = allCourses.filter(
      (c) =>
        c.facultyId === teacherId ||
        (facultyProfile && c.facultyId === String(facultyProfile._id)) ||
        (c.facultyName && c.facultyName.toLowerCase() === teacherName.toLowerCase()) ||
        role === "admin"
    );

    // If no course explicitly marked, provide top 2 computing courses as fallback
    if (assignedCourses.length === 0 && allCourses.length > 0) {
      assignedCourses = allCourses.slice(0, 3);
    }

    const allLectures = await ctx.db.query("lectures").collect();
    const allRegistrations = await ctx.db
      .query("courseRegistrations")
      .withIndex("by_status", (q) => q.eq("status", "Approved"))
      .collect();
    const allProgress = await ctx.db.query("lectureProgress").collect();

    return assignedCourses.map((c) => {
      const courseLectures = allLectures.filter(
        (l) => l.courseCode.toLowerCase() === c.code.toLowerCase() || l.courseId === String(c._id)
      );

      const publishedLectures = courseLectures.filter((l) => l.status === "published");
      const draftLectures = courseLectures.filter((l) => l.status === "draft");

      const enrolledCount = allRegistrations.filter(
        (r) => r.courseCode.toLowerCase() === c.code.toLowerCase()
      ).length;

      const courseProgress = allProgress.filter(
        (p) => p.courseCode.toLowerCase() === c.code.toLowerCase()
      );

      const completedProgress = courseProgress.filter((p) => p.completed).length;
      const avgCompletion =
        courseProgress.length > 0
          ? Math.round((completedProgress / courseProgress.length) * 100)
          : 0;

      return {
        id: String(c._id),
        code: c.code,
        name: c.name,
        department: c.department,
        creditHours: c.creditHours,
        semester: c.semester,
        totalLectures: courseLectures.length,
        publishedCount: publishedLectures.length,
        draftCount: draftLectures.length,
        enrolledStudentsCount: enrolledCount,
        avgCompletionPercentage: avgCompletion,
      };
    });
  },
});

/**
 * Get all lectures (published and draft) for a specific course assigned to teacher
 */
export const getTeacherCourseLectures = query({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
    courseId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) throw new Error("Authentication required.");

    const course = await verifyTeacherAssignment(ctx, user, args.courseId);

    const lectures = await ctx.db
      .query("lectures")
      .withIndex("by_courseCode", (q) => q.eq("courseCode", course.code))
      .collect();

    lectures.sort((a, b) => a.lectureNumber - b.lectureNumber);

    const allResources = await ctx.db.query("lectureResources").collect();
    const allProgress = await ctx.db.query("lectureProgress").collect();

    const resolved = await Promise.all(
      lectures.map(async (lec) => {
        let videoUrl = lec.videoUrl;
        if (lec.videoStorageId) {
          try {
            const vUrl = await ctx.storage.getUrl(lec.videoStorageId);
            if (vUrl) videoUrl = vUrl;
          } catch (e) {
            // ignore
          }
        }

        const resources = allResources.filter((r) => r.lectureId === lec._id);
        const progressRecords = allProgress.filter((p) => p.lectureId === lec._id);
        const completedCount = progressRecords.filter((p) => p.completed).length;

        return {
          id: String(lec._id),
          title: lec.title,
          description: lec.description,
          lectureNumber: lec.lectureNumber,
          videoUrl,
          duration: lec.duration || "45 minutes",
          status: lec.status,
          publishedAt: lec.publishedAt,
          createdAt: lec.createdAt,
          resourceCount: resources.length,
          viewsCount: progressRecords.length,
          completedCount,
        };
      })
    );

    return {
      course: {
        id: String(course._id),
        code: course.code,
        name: course.name,
      },
      lectures: resolved,
    };
  },
});

/**
 * Upload a new lecture (Strict authorization check: Teacher must be assigned to course).
 * Automatically notifies all enrolled students!
 */
export const uploadLecture = mutation({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
    courseId: v.string(),
    title: v.string(),
    description: v.string(),
    lectureNumber: v.optional(v.number()),
    lectureType: v.optional(v.string()),
    lectureDate: v.optional(v.number()),
    videoUrl: v.optional(v.string()),
    videoStorageId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    thumbnailStorageId: v.optional(v.string()),
    duration: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    status: v.union(v.literal("published"), v.literal("draft")),
    resources: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
          storageId: v.optional(v.string()),
          fileType: v.string(),
          fileSize: v.optional(v.number()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) throw new Error("Authentication required.");

    const course = await verifyTeacherAssignment(ctx, user, args.courseId);

    // Determine lecture number
    let lecNum = args.lectureNumber;
    if (!lecNum) {
      const existing = await ctx.db
        .query("lectures")
        .withIndex("by_courseCode", (q) => q.eq("courseCode", course.code))
        .collect();
      lecNum = existing.length + 1;
    }

    const now = Date.now();
    const lectureId = await ctx.db.insert("lectures", {
      courseId: String(course._id),
      courseCode: course.code,
      courseTitle: course.name,
      teacherId: String(user._id),
      teacherName: user.name,
      title: args.title.trim(),
      description: args.description.trim(),
      lectureNumber: lecNum,
      lectureType: args.lectureType || "Video",
      lectureDate: args.lectureDate || now,
      videoUrl: args.videoUrl?.trim(),
      videoStorageId: args.videoStorageId,
      thumbnailUrl: args.thumbnailUrl?.trim(),
      thumbnailStorageId: args.thumbnailStorageId,
      duration: args.duration?.trim() || "45 minutes",
      durationMinutes: args.durationMinutes || 45,
      publishedAt: args.status === "published" ? now : undefined,
      status: args.status,
      createdAt: now,
      updatedAt: now,
    });

    // Insert attached resources
    if (args.resources && args.resources.length > 0) {
      for (const res of args.resources) {
        await ctx.db.insert("lectureResources", {
          lectureId,
          courseId: String(course._id),
          name: res.name.trim(),
          url: res.url.trim(),
          storageId: res.storageId,
          fileType: res.fileType,
          fileSize: res.fileSize,
          createdAt: now,
        });
      }
    }

    // If published, notify all enrolled students
    if (args.status === "published") {
      const allRegistrations = await ctx.db
        .query("courseRegistrations")
        .withIndex("by_status", (q) => q.eq("status", "Approved"))
        .collect();

      const enrolledRegs = allRegistrations.filter(
        (r) => r.courseCode.toLowerCase() === course.code.toLowerCase()
      );

      // Find user records for these students
      const allUsers = await ctx.db.query("users").collect();
      const studentUsers = allUsers.filter(
        (u) =>
          enrolledRegs.some(
            (r) =>
              r.studentId === String(u._id) ||
              r.enrollmentId === u.enrollmentId ||
              (r.studentEmail && r.studentEmail.toLowerCase() === u.email.toLowerCase())
          )
      );

      for (const st of studentUsers) {
        await ctx.db.insert("notifications", {
          userId: st._id,
          title: "New Lecture Uploaded",
          message: `${user.name} uploaded "${args.title}" to ${course.name} (${course.code}).`,
          type: "NEW_LECTURE",
          courseId: String(course._id),
          lectureId: String(lectureId),
          link: `/student/lectures/${course._id}`,
          read: false,
          createdAt: now,
        });
      }
    }

    // Audit log
    await recordAudit(
      ctx,
      user,
      "create",
      `Teacher ${user.name} uploaded lecture "${args.title}" to course ${course.code}`,
      String(lectureId)
    );

    return { success: true, lectureId: String(lectureId) };
  },
});

/**
 * Update an existing lecture
 */
export const updateLecture = mutation({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
    lectureId: v.id("lectures"),
    title: v.string(),
    description: v.string(),
    lectureNumber: v.optional(v.number()),
    lectureType: v.optional(v.string()),
    lectureDate: v.optional(v.number()),
    videoUrl: v.optional(v.string()),
    videoStorageId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    thumbnailStorageId: v.optional(v.string()),
    duration: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    status: v.union(v.literal("published"), v.literal("draft")),
    resources: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
          storageId: v.optional(v.string()),
          fileType: v.string(),
          fileSize: v.optional(v.number()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) throw new Error("Authentication required.");

    const existingLecture = await ctx.db.get(args.lectureId);
    if (!existingLecture) throw new Error("Lecture not found.");

    await verifyTeacherAssignment(ctx, user, existingLecture.courseId);

    const now = Date.now();
    await ctx.db.patch(args.lectureId, {
      title: args.title.trim(),
      description: args.description.trim(),
      lectureNumber: args.lectureNumber ?? existingLecture.lectureNumber,
      lectureType: args.lectureType || existingLecture.lectureType || "Video",
      lectureDate: args.lectureDate || existingLecture.lectureDate || existingLecture.createdAt,
      videoUrl: args.videoUrl !== undefined ? args.videoUrl.trim() : existingLecture.videoUrl,
      videoStorageId: args.videoStorageId !== undefined ? args.videoStorageId : existingLecture.videoStorageId,
      thumbnailUrl: args.thumbnailUrl !== undefined ? args.thumbnailUrl.trim() : existingLecture.thumbnailUrl,
      thumbnailStorageId: args.thumbnailStorageId !== undefined ? args.thumbnailStorageId : existingLecture.thumbnailStorageId,
      duration: args.duration?.trim() || existingLecture.duration,
      durationMinutes: args.durationMinutes || existingLecture.durationMinutes,
      status: args.status,
      publishedAt: args.status === "published" && !existingLecture.publishedAt ? now : existingLecture.publishedAt,
      updatedAt: now,
    });

    // Update resources if provided
    if (args.resources !== undefined) {
      // Remove previous resources that were not re-attached
      const oldResources = await ctx.db
        .query("lectureResources")
        .withIndex("by_lectureId", (q) => q.eq("lectureId", args.lectureId))
        .collect();

      for (const r of oldResources) {
        await ctx.db.delete(r._id);
      }

      for (const res of args.resources) {
        await ctx.db.insert("lectureResources", {
          lectureId: args.lectureId,
          courseId: existingLecture.courseId,
          name: res.name.trim(),
          url: res.url.trim(),
          storageId: res.storageId,
          fileType: res.fileType,
          fileSize: res.fileSize,
          createdAt: now,
        });
      }
    }

    await recordAudit(
      ctx,
      user,
      "update",
      `User ${user.name} updated lecture "${args.title}" (${existingLecture.courseCode})`,
      String(args.lectureId)
    );

    return { success: true };
  },
});

/**
 * Get all lectures university-wide for Admin LMS management
 */
export const getAdminAllLectures = query({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) throw new Error("Authentication required.");

    const role = normalizeRole(user.role);
    if (role !== "admin" && role !== "teacher") {
      throw new Error("Access Denied: Admin or Faculty authorization required.");
    }

    const allLectures = await ctx.db.query("lectures").collect();
    allLectures.sort((a, b) => b.createdAt - a.createdAt);

    const allResources = await ctx.db.query("lectureResources").collect();
    const allProgress = await ctx.db.query("lectureProgress").collect();

    const resolved = await Promise.all(
      allLectures.map(async (lec) => {
        let videoUrl = lec.videoUrl;
        if (lec.videoStorageId) {
          try {
            const vUrl = await ctx.storage.getUrl(lec.videoStorageId);
            if (vUrl) videoUrl = vUrl;
          } catch (e) {
            // ignore
          }
        }

        let thumbnailUrl = lec.thumbnailUrl;
        if (lec.thumbnailStorageId) {
          try {
            const tUrl = await ctx.storage.getUrl(lec.thumbnailStorageId);
            if (tUrl) thumbnailUrl = tUrl;
          } catch (e) {
            // ignore
          }
        }

        const resources = allResources.filter((r) => r.lectureId === lec._id);
        const resolvedResources = await Promise.all(
          resources.map(async (r) => {
            let url = r.url;
            if (r.storageId) {
              try {
                const sUrl = await ctx.storage.getUrl(r.storageId);
                if (sUrl) url = sUrl;
              } catch (e) {
                // ignore
              }
            }
            return {
              id: String(r._id),
              name: r.name,
              url,
              storageId: r.storageId,
              fileType: r.fileType,
              fileSize: r.fileSize,
            };
          })
        );

        const progressRecords = allProgress.filter((p) => p.lectureId === lec._id);
        const completedCount = progressRecords.filter((p) => p.completed).length;

        return {
          id: String(lec._id),
          courseId: lec.courseId,
          courseCode: lec.courseCode,
          courseTitle: lec.courseTitle,
          teacherId: lec.teacherId,
          teacherName: lec.teacherName,
          title: lec.title,
          description: lec.description,
          lectureNumber: lec.lectureNumber,
          lectureType: (lec as any).lectureType || "Video",
          lectureDate: (lec as any).lectureDate || lec.createdAt,
          videoUrl,
          videoStorageId: lec.videoStorageId,
          thumbnailUrl,
          thumbnailStorageId: lec.thumbnailStorageId,
          duration: lec.duration || "45 minutes",
          durationMinutes: lec.durationMinutes || 45,
          status: lec.status,
          publishedAt: lec.publishedAt,
          createdAt: lec.createdAt,
          resources: resolvedResources,
          resourceCount: resources.length,
          viewsCount: progressRecords.length,
          completedCount,
        };
      })
    );

    return resolved;
  },
});

/**
 * Delete a lecture and attached resources
 */
export const deleteLecture = mutation({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
    lectureId: v.id("lectures"),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user) throw new Error("Authentication required.");

    const lecture = await ctx.db.get(args.lectureId);
    if (!lecture) throw new Error("Lecture not found.");

    await verifyTeacherAssignment(ctx, user, lecture.courseId);

    // Clean up resources
    const resources = await ctx.db
      .query("lectureResources")
      .withIndex("by_lectureId", (q) => q.eq("lectureId", args.lectureId))
      .collect();

    for (const r of resources) {
      if (r.storageId) {
        try {
          await ctx.storage.delete(r.storageId);
        } catch (e) {
          // ignore
        }
      }
      await ctx.db.delete(r._id);
    }

    // Clean up video storage file if exists
    if (lecture.videoStorageId) {
      try {
        await ctx.storage.delete(lecture.videoStorageId);
      } catch (e) {
        // ignore
      }
    }

    // Delete progress records
    const progresses = await ctx.db
      .query("lectureProgress")
      .withIndex("by_lectureId", (q) => q.eq("lectureId", args.lectureId))
      .collect();

    for (const p of progresses) {
      await ctx.db.delete(p._id);
    }

    await ctx.db.delete(args.lectureId);

    await recordAudit(
      ctx,
      user,
      "delete",
      `Teacher ${user.name} deleted lecture "${lecture.title}" (${lecture.courseCode})`,
      String(args.lectureId)
    );

    return { success: true };
  },
});

/**
 * ----------------------------------------------------------------------------
 * ADMIN LMS OVERSIGHT & ANALYTICS
 * ----------------------------------------------------------------------------
 */

export const getAdminLmsOverview = query({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user || normalizeRole(user.role) !== "admin") {
      throw new Error("Access Denied: Administrator privilege required.");
    }

    const allCourses = await ctx.db.query("courses").collect();
    const allFaculty = await ctx.db.query("faculty").collect();
    const allLectures = await ctx.db.query("lectures").collect();
    const allRegistrations = await ctx.db
      .query("courseRegistrations")
      .withIndex("by_status", (q) => q.eq("status", "Approved"))
      .collect();

    const publishedLectures = allLectures.filter((l) => l.status === "published");

    return {
      totalCourses: allCourses.length,
      totalFaculty: allFaculty.length,
      totalLectures: allLectures.length,
      publishedLecturesCount: publishedLectures.length,
      draftLecturesCount: allLectures.length - publishedLectures.length,
      totalApprovedEnrollments: allRegistrations.length,
    };
  },
});

/**
 * Admin: Assign Teacher to Course
 */
export const assignTeacherToCourse = mutation({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
    courseId: v.string(),
    facultyId: v.string(),
    facultyName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await resolveUser(ctx, args);
    if (!user || normalizeRole(user.role) !== "admin") {
      throw new Error("Access Denied: Admin authorization required.");
    }

    const allCourses = await ctx.db.query("courses").collect();
    const course = allCourses.find((c) => String(c._id) === args.courseId || c.code === args.courseId);
    if (!course) throw new Error("Course not found.");

    await ctx.db.patch(course._id, {
      facultyId: args.facultyId,
      instructorId: args.facultyId,
      facultyName: args.facultyName,
      updatedAt: Date.now(),
    });

    await recordAudit(
      ctx,
      user,
      "update",
      `Admin assigned teacher ${args.facultyName} to course ${course.code} (${course.name})`,
      String(course._id)
    );

    return { success: true };
  },
});

/**
 * ----------------------------------------------------------------------------
 * SEEDING BASELINE DATA: LECTURES, RESOURCES & ONLINE CLASSES
 * ----------------------------------------------------------------------------
 */
export const seedLmsBaselineData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const allCourses = await ctx.db.query("courses").collect();
    const existingLectures = await ctx.db.query("lectures").collect();

    // If lectures already exist, return early
    if (existingLectures.length >= 4) {
      return { success: true, message: "LMS lectures already seeded." };
    }

    // Baseline instructor info
    const defaultTeacherName = "Dr. Ahmed Mansoor";
    const defaultTeacherId = "faculty-instructor-1";

    // Sample video URLs for learning player
    const sampleVideos = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    ];

    const sampleLectures = [
      {
        courseCode: "CS-101",
        courseTitle: "Programming Fundamentals",
        title: "Introduction to Computer Science & Algorithm Design",
        description: "Welcome to CS-101! In this foundational lecture, we cover binary representations, computational thinking, flowcharts, and control flow in modern high-level programming.",
        lectureNumber: 1,
        duration: "45 minutes",
        durationMinutes: 45,
        videoUrl: sampleVideos[0],
        resources: [
          { name: "Lecture 01 — Slides.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", fileType: "pdf", fileSize: 2450000 },
          { name: "Algorithm Design Cheatsheet.docx", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", fileType: "docx", fileSize: 850000 },
        ],
      },
      {
        courseCode: "CS-101",
        courseTitle: "Programming Fundamentals",
        title: "Memory Allocation, Variables & Data Types",
        description: "An in-depth breakdown of primitive data types, memory stack and heap representation, type casting, variable scope, and best naming conventions in software development.",
        lectureNumber: 2,
        duration: "52 minutes",
        durationMinutes: 52,
        videoUrl: sampleVideos[1],
        resources: [
          { name: "Data Types & Memory Model.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", fileType: "pdf", fileSize: 1890000 },
          { name: "Code Examples.zip", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", fileType: "zip", fileSize: 450000 },
        ],
      },
      {
        courseCode: "CS-102",
        courseTitle: "Object-Oriented Programming",
        title: "OOP Core Pillars: Encapsulation & Abstraction",
        description: "Exploration of modular code design, object instantiation, access specifiers (private, public, protected), encapsulation, getter/setter patterns, and clean architecture.",
        lectureNumber: 1,
        duration: "50 minutes",
        durationMinutes: 50,
        videoUrl: sampleVideos[2],
        resources: [
          { name: "OOP Principles Slide Deck.pptx", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", fileType: "pptx", fileSize: 3200000 },
        ],
      },
      {
        courseCode: "CS-103",
        courseTitle: "Data Structures & Algorithms",
        title: "Time & Space Complexity: Big-O Notation",
        description: "Mastering asymptotic notation. Understanding O(1), O(log n), O(n), O(n log n), and O(n^2) computational bounds with practical sorting and searching algorithm examples.",
        lectureNumber: 1,
        duration: "58 minutes",
        durationMinutes: 58,
        videoUrl: sampleVideos[3],
        resources: [
          { name: "Big-O Analysis Handbook.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", fileType: "pdf", fileSize: 1420000 },
        ],
      },
    ];

    for (const item of sampleLectures) {
      const course = allCourses.find((c) => c.code.toUpperCase() === item.courseCode);
      const courseId = course ? String(course._id) : item.courseCode;

      const lecId = await ctx.db.insert("lectures", {
        courseId,
        courseCode: item.courseCode,
        courseTitle: item.courseTitle,
        teacherId: defaultTeacherId,
        teacherName: defaultTeacherName,
        title: item.title,
        description: item.description,
        lectureNumber: item.lectureNumber,
        videoUrl: item.videoUrl,
        duration: item.duration,
        durationMinutes: item.durationMinutes,
        publishedAt: now - 3600000 * 24 * (3 - item.lectureNumber),
        status: "published",
        createdAt: now - 3600000 * 24 * (3 - item.lectureNumber),
        updatedAt: now,
      });

      for (const res of item.resources) {
        await ctx.db.insert("lectureResources", {
          lectureId: lecId,
          courseId,
          name: res.name,
          url: res.url,
          fileType: res.fileType,
          fileSize: res.fileSize,
          createdAt: now,
        });
      }
    }

    return { success: true, message: "Baseline LMS data seeded successfully." };
  },
});
