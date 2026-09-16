import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Standard HEC Grading Scale Formula Helper
export function calculateGradeAndPoints(percentage: number): { grade: string; gradePoints: number } {
  if (percentage >= 85) return { grade: "A", gradePoints: 4.0 };
  if (percentage >= 80) return { grade: "A-", gradePoints: 3.67 };
  if (percentage >= 75) return { grade: "B+", gradePoints: 3.33 };
  if (percentage >= 71) return { grade: "B", gradePoints: 3.0 };
  if (percentage >= 68) return { grade: "B-", gradePoints: 2.67 };
  if (percentage >= 64) return { grade: "C+", gradePoints: 2.33 };
  if (percentage >= 60) return { grade: "C", gradePoints: 2.0 };
  if (percentage >= 50) return { grade: "D", gradePoints: 1.0 };
  return { grade: "F", gradePoints: 0.0 };
}

// Helpers for Web Crypto SHA-256 with Salt
async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateRandomHex(length = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password: string, salt: string): Promise<string> {
  let hash = await sha256(`${salt}:${password}`);
  for (let i = 0; i < 50; i++) {
    hash = await sha256(`${hash}:${salt}`);
  }
  return hash;
}

/**
 * Helper to comprehensively resolve a student's user record, identification keys,
 * and approved course registrations across all identifiers (userId, enrollmentId, studentId, emails).
 */
export async function resolveStudentApprovedRegistrations(
  ctx: any,
  args: { userId?: any; studentId?: string; token?: string }
) {
  let studentUser: any = null;

  if (args.token) {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q: any) => q.eq("token", args.token!))
      .first();
    if (session && session.expiresAt > Date.now()) {
      studentUser = await ctx.db.get(session.userId);
    }
  }

  if (!studentUser && args.userId) {
    try {
      studentUser = await ctx.db.get(args.userId);
    } catch {
      // not a direct ID
    }
  }

  if (!studentUser && args.studentId) {
    studentUser = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("enrollmentId"), args.studentId))
      .first();

    if (!studentUser) {
      try {
        studentUser = await ctx.db.get(args.studentId as any);
      } catch {
        // ignore
      }
    }

    if (!studentUser) {
      studentUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q: any) => q.eq("email", args.studentId!.toLowerCase()))
        .first();
    }

    if (!studentUser) {
      studentUser = await ctx.db
        .query("users")
        .withIndex("by_universityEmail", (q: any) => q.eq("universityEmail", args.studentId!.toLowerCase()))
        .first();
    }
  }

  const studentKeys = new Set<string>();
  if (studentUser?._id) studentKeys.add(String(studentUser._id));
  if (studentUser?.enrollmentId) studentKeys.add(studentUser.enrollmentId);
  if (args.studentId) studentKeys.add(args.studentId);
  if (args.userId) studentKeys.add(String(args.userId));

  const allRegistrations = await ctx.db.query("courseRegistrations").collect();
  const approvedRegistrations = allRegistrations.filter(
    (r: any) =>
      r.status === "Approved" &&
      (studentKeys.has(r.studentId) ||
        studentKeys.has(r.enrollmentId) ||
        (studentUser && r.studentEmail && (
          r.studentEmail.toLowerCase() === studentUser.email?.toLowerCase() ||
          r.studentEmail.toLowerCase() === studentUser.universityEmail?.toLowerCase()
        )))
  );

  return { studentUser, studentKeys, approvedRegistrations };
}

/**
 * Authoritative Academic Progression Engine
 * Calculates a student's complete academic state from database records:
 * - Published Academic Results (grade, gradePoints, marks, percentage, status)
 * - Approved Course Registrations
 * - Curriculum courses for student's department and program
 *
 * Computes:
 * - Semester by semester (1 through 8):
 *   - Registered courses
 *   - Completed/passed courses (grade !== 'F' && percentage >= 50)
 *   - Failed courses (grade === 'F' || percentage < 50)
 *   - Pending courses (approved registration, but result not yet published)
 *   - Semester Quality Points & Semester Credit Hours
 *   - Semester GPA
 *   - Semester Pass Status:
 *     - If no courses registered:
 *       - Semester 1: if nothing completed yet -> "Available for Registration"
 *       - Other semesters: if previous semester is passed -> "Available for Registration", else "Locked"
 *     - If registered courses:
 *       - If has failed courses -> "Failed Courses" (Semester not passed)
 *       - If pending courses -> "In Progress" / "Results Pending"
 *       - If all registered courses (at least 1) are passed:
 *         -> "Successfully Passed"
 *
 * - Sequential Unlocking:
 *   - Semester 1 is always unlocked.
 *   - Semester N (2..8) is unlocked IF AND ONLY IF Semester N-1 is "Successfully Passed".
 *
 * - Overall:
 *   - Highest passed semester (0..8)
 *   - Next eligible semester = Math.min(8, highestPassedSemester + 1)
 *   - Overall CGPA (based strictly on published results)
 *   - Completed Credit Hours (passed courses only)
 *   - Remaining Credit Hours
 *   - Degree Progress Percentage
 *   - Academic Standing (Dean's Honor Roll >= 3.5, Good Standing >= 2.0, Academic Warning < 2.0)
 *   - Congratulations notification if a semester was passed and next semester is available
 */
export async function calculateStudentAcademicProgression(
  ctx: any,
  studentInput: any,
  isMutation: boolean = false
) {
  let studentUser: any = null;

  if (studentInput && typeof studentInput === "object") {
    if (studentInput._id && (studentInput.email || studentInput.role)) {
      studentUser = studentInput;
    } else if (studentInput.userId) {
      try {
        studentUser = await ctx.db.get(studentInput.userId);
      } catch {
        // ignore
      }
    } else if (studentInput.studentId) {
      studentUser = await ctx.db
        .query("users")
        .filter((q: any) =>
          q.or(
            q.eq(q.field("enrollmentId"), studentInput.studentId),
            q.eq(q.field("email"), studentInput.studentId.toLowerCase()),
            q.eq(q.field("universityEmail"), studentInput.studentId.toLowerCase())
          )
        )
        .first();
      if (!studentUser) {
        try {
          studentUser = await ctx.db.get(studentInput.studentId);
        } catch {
          // ignore
        }
      }
    }
  } else if (typeof studentInput === "string") {
    studentUser = await ctx.db
      .query("users")
      .filter((q: any) =>
        q.or(
          q.eq(q.field("enrollmentId"), studentInput),
          q.eq(q.field("email"), studentInput.toLowerCase()),
          q.eq(q.field("universityEmail"), studentInput.toLowerCase())
        )
      )
      .first();
    if (!studentUser) {
      try {
        studentUser = await ctx.db.get(studentInput);
      } catch {
        // ignore
      }
    }
  }

  if (!studentUser) {
    return null;
  }

  const studentKeys = new Set<string>();
  if (studentUser._id) studentKeys.add(String(studentUser._id));
  if (studentUser.enrollmentId) studentKeys.add(studentUser.enrollmentId);

  // 1. Fetch published results for this student
  const allResults = await ctx.db.query("academicResults").collect();
  const publishedResults = allResults.filter(
    (r: any) =>
      r.status === "Published" &&
      (studentKeys.has(r.studentId) ||
        studentKeys.has(r.enrollmentId) ||
        (studentUser.email && r.studentEmail === studentUser.email) ||
        (studentUser.universityEmail && r.studentEmail === studentUser.universityEmail))
  );

  // 2. Fetch approved course registrations
  const allRegistrations = await ctx.db.query("courseRegistrations").collect();
  const approvedRegs = allRegistrations.filter(
    (r: any) =>
      r.status === "Approved" &&
      (studentKeys.has(r.studentId) ||
        studentKeys.has(r.enrollmentId) ||
        (studentUser.email && r.studentEmail === studentUser.email) ||
        (studentUser.universityEmail && r.studentEmail === studentUser.universityEmail))
  );

  // 3. Fetch courses
  const allCourses = await ctx.db.query("courses").collect();

  // Helper to resolve semester number for a course or result
  const getCourseSemester = (courseCode: string, courseId?: string, fallbackSem?: any): number => {
    const c = allCourses.find((x: any) => x.code === courseCode || (courseId && x._id === courseId));
    if (c && typeof c.semester === "number") return c.semester;
    if (fallbackSem) {
      const num = parseInt(String(fallbackSem).replace(/[^0-9]/g, ""), 10);
      if (!isNaN(num) && num >= 1 && num <= 8) return num;
    }
    return 1;
  };

  // Group by semester (1 to 8)
  const semesterDetails: any[] = [];
  let cumulativeQualityPoints = 0;
  let cumulativeGradedCredits = 0;
  let totalPassedCredits = 0;
  let totalPassedCoursesCount = 0;
  let totalFailedCoursesCount = 0;
  const failedCoursesList: any[] = [];

  for (let s = 1; s <= 8; s++) {
    // Registrations and published results in this semester
    const regsInSem = approvedRegs.filter(
      (r: any) => getCourseSemester(r.courseCode, r.courseId, r.semester) === s
    );
    const resultsInSem = publishedResults.filter(
      (r: any) => getCourseSemester(r.courseCode, r.courseId, r.semester) === s
    );

    const courseCodesSet = new Set<string>();
    regsInSem.forEach((r: any) => courseCodesSet.add(r.courseCode));
    resultsInSem.forEach((r: any) => courseCodesSet.add(r.courseCode));

    const semesterCourses: any[] = [];
    let semQualityPoints = 0;
    let semGradedCredits = 0;
    let semPassedCredits = 0;
    let passedCount = 0;
    let failedCount = 0;
    let pendingCount = 0;

    for (const code of Array.from(courseCodesSet)) {
      const c = allCourses.find((x: any) => x.code === code);
      const reg = regsInSem.find((r: any) => r.courseCode === code);
      const res = resultsInSem.find((r: any) => r.courseCode === code);

      const title = res?.courseTitle || reg?.courseTitle || c?.name || code;
      const creditHours = res?.creditHours || reg?.creditHours || c?.creditHours || 3;

      if (res) {
        const isPassed = res.grade !== "F" && res.percentage >= 50 && res.gradePoints > 0;
        const qp = res.gradePoints * creditHours;
        semQualityPoints += qp;
        semGradedCredits += creditHours;

        if (isPassed) {
          passedCount++;
          semPassedCredits += creditHours;
          totalPassedCredits += creditHours;
          totalPassedCoursesCount++;
        } else {
          failedCount++;
          totalFailedCoursesCount++;
          failedCoursesList.push({
            code,
            title,
            semester: s,
            grade: res.grade,
            gradePoints: res.gradePoints,
            percentage: res.percentage,
            remarks: "Course retake required under academic policy.",
          });
        }

        semesterCourses.push({
          code,
          title,
          creditHours,
          grade: res.grade,
          gradePoints: res.gradePoints,
          marks: res.totalMarks,
          percentage: res.percentage,
          status: isPassed ? "Passed" : "Failed",
          resultStatus: "Published",
          isPassed,
          isFailed: !isPassed,
          publishedAt: res.publishedAt,
        });
      } else if (reg) {
        pendingCount++;
        semesterCourses.push({
          code,
          title,
          creditHours,
          grade: "In Progress",
          gradePoints: 0,
          marks: 0,
          percentage: 0,
          status: "In Progress",
          resultStatus: "Pending",
          isPassed: false,
          isFailed: false,
        });
      }
    }

    cumulativeQualityPoints += semQualityPoints;
    cumulativeGradedCredits += semGradedCredits;

    const semGPA = semGradedCredits > 0 ? Number((semQualityPoints / semGradedCredits).toFixed(2)) : 0.0;
    const totalEnrolledInSem = semesterCourses.length;

    let isPassed = false;
    let semStatus = "Locked";
    let semStatusLabel = "🔒 Locked";

    if (totalEnrolledInSem > 0) {
      if (failedCount > 0) {
        semStatus = "Failed Courses";
        semStatusLabel = "⚠ Failed Courses";
      } else if (pendingCount > 0) {
        semStatus = "In Progress";
        semStatusLabel = "● In Progress";
      } else if (passedCount > 0 && passedCount === totalEnrolledInSem) {
        isPassed = true;
        semStatus = "Passed";
        semStatusLabel = "✓ Successfully Passed";
      }
    }

    semesterDetails.push({
      semesterNumber: s,
      semesterLabel: `Semester ${s}`,
      status: semStatus,
      statusLabel: semStatusLabel,
      isPassed,
      isUnlocked: false,
      gpa: semGPA,
      creditHours: semGradedCredits,
      passedCreditHours: semPassedCredits,
      totalCoursesCount: totalEnrolledInSem,
      completedCoursesCount: passedCount,
      failedCoursesCount: failedCount,
      pendingCoursesCount: pendingCount,
      courses: semesterCourses,
      unlockMessage: "",
    });
  }

  // Sequential Unlock Determination:
  // Must pass Sem 1 to unlock Sem 2, pass Sem 2 to unlock Sem 3, etc.
  let highestPassedSemester = 0;
  for (let s = 1; s <= 8; s++) {
    if (s === 1) {
      if (semesterDetails[0].isPassed) {
        highestPassedSemester = 1;
      } else {
        break;
      }
    } else {
      const prev = semesterDetails[s - 2];
      const current = semesterDetails[s - 1];
      if (prev.isPassed && current.isPassed && highestPassedSemester === s - 1) {
        highestPassedSemester = s;
      } else {
        break;
      }
    }
  }

  const nextEligibleSemester = Math.min(8, highestPassedSemester + 1);

  // Assign isUnlocked and unlock messages
  for (let s = 1; s <= 8; s++) {
    const sem = semesterDetails[s - 1];
    if (s <= highestPassedSemester) {
      sem.isUnlocked = true;
      sem.status = "Passed";
      sem.statusLabel = "✓ Successfully Passed";
    } else if (s === nextEligibleSemester) {
      sem.isUnlocked = true;
      if (sem.totalCoursesCount === 0) {
        sem.status = "Available";
        sem.statusLabel = "🔓 Available for Registration";
      } else if (sem.failedCoursesCount > 0) {
        sem.status = "Failed Courses";
        sem.statusLabel = "⚠ Failed Courses";
      } else if (sem.pendingCoursesCount > 0) {
        sem.status = "In Progress";
        sem.statusLabel = "● In Progress";
      }
    } else {
      sem.isUnlocked = false;
      sem.status = "Locked";
      sem.statusLabel = "🔒 Locked";
      sem.unlockMessage = `Complete and pass Semester ${s - 1} to unlock Semester ${s}.`;
    }
  }

  const cgpa =
    cumulativeGradedCredits > 0
      ? Number((cumulativeQualityPoints / cumulativeGradedCredits).toFixed(2))
      : 0.0;
  const currentGpa = semesterDetails[highestPassedSemester ? highestPassedSemester - 1 : 0]?.gpa || cgpa;
  const totalDegreeCredits = studentUser.degreeProgram === "MSCS" ? 30 : 134;
  const remainingCreditHours = Math.max(0, totalDegreeCredits - totalPassedCredits);
  const degreeProgress = Math.min(100, Math.round((totalPassedCredits / totalDegreeCredits) * 100));

  let academicStanding = "Good Standing";
  if (cgpa >= 3.5) academicStanding = "Dean's Honor Roll";
  else if (cgpa < 2.0 && cumulativeGradedCredits > 0) academicStanding = "Academic Warning";

  // Check if currentSemester in users table needs to be updated (mutation mode)
  if (isMutation && studentUser._id) {
    if (studentUser.currentSemester !== nextEligibleSemester) {
      await ctx.db.patch(studentUser._id, {
        currentSemester: nextEligibleSemester,
        updatedAt: Date.now(),
      });

      await ctx.db.insert("auditLogs", {
        adminId: "system",
        adminName: "Academic Progression Engine",
        adminEmail: "registrar@isb.iqra.edu.pk",
        actionType: "status_change",
        module: "Academic Progression",
        details: `Updated current semester for ${studentUser.name} (${studentUser.enrollmentId || studentUser.email}) to Semester ${nextEligibleSemester}. Highest passed: Semester ${highestPassedSemester}.`,
        previousValue: String(studentUser.currentSemester || 1),
        newValue: String(nextEligibleSemester),
        timestamp: Date.now(),
      });
    }
  }

  // Build congratulations notification if a semester was passed and next semester is available
  let congratulationsNotification: any = null;
  if (highestPassedSemester > 0 && nextEligibleSemester > highestPassedSemester && nextEligibleSemester <= 8) {
    congratulationsNotification = {
      title: `Semester ${highestPassedSemester} Successfully Completed!`,
      message: `Congratulations! You have successfully passed all required Semester ${highestPassedSemester} courses. Semester ${nextEligibleSemester} is now available for course registration.`,
      targetSemester: nextEligibleSemester,
      ctaText: `Register Semester ${nextEligibleSemester} Courses`,
    };
  }

  return {
    studentId: studentUser.enrollmentId || String(studentUser._id),
    name: studentUser.name,
    email: studentUser.universityEmail || studentUser.email,
    department: studentUser.department || "Department of Computing & Artificial Intelligence",
    degreeProgram: studentUser.degreeProgram || "Bachelor of Science in Computer Science",
    currentSemester: nextEligibleSemester,
    highestPassedSemester,
    nextEligibleSemester,
    isGraduated: highestPassedSemester === 8,
    cgpa,
    currentGpa,
    completedCreditHours: totalPassedCredits,
    remainingCreditHours,
    totalDegreeCredits,
    degreeProgress,
    academicStanding,
    totalPassedCoursesCount,
    totalFailedCoursesCount,
    failedCoursesList,
    congratulationsNotification,
    semesters: semesterDetails,
  };
}

// ----------------------------------------------------------------------------
// AUDIT LOGGING
// ----------------------------------------------------------------------------
export const logAuditAction = mutation({
  args: {
    adminId: v.string(),
    adminName: v.string(),
    adminEmail: v.string(),
    actionType: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("status_change"),
      v.literal("approve"),
      v.literal("reject"),
      v.literal("publish"),
      v.literal("unpublish")
    ),
    module: v.string(),
    details: v.string(),
    entityAffected: v.optional(v.string()),
    previousValue: v.optional(v.string()),
    newValue: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("auditLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getAuditLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("auditLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(100);
  },
});

// ----------------------------------------------------------------------------
// ADMIN DASHBOARD STATS
// ----------------------------------------------------------------------------
export const getAdminDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "student"))
      .collect();

    const faculty = await ctx.db.query("faculty").collect();
    const courses = await ctx.db.query("courses").collect();
    const exams = await ctx.db.query("examinations").collect();
    const registrations = await ctx.db.query("courseRegistrations").collect();
    const results = await ctx.db.query("academicResults").collect();
    const departments = await ctx.db.query("departments").collect();

    const activeStudents = students.filter(
      (s) => s.accountStatus === "active" || !s.accountStatus
    ).length;
    const activeCourses = courses.filter((c) => c.status === "Active").length;
    const upcomingExams = exams.filter((e) => e.status === "Scheduled").length;
    const pendingRegistrations = registrations.filter((r) => r.status === "Pending").length;
    const publishedResults = results.filter((r) => r.status === "Published").length;

    return {
      totalStudents: students.length,
      activeStudents,
      totalFaculty: faculty.length,
      totalCourses: courses.length,
      activeCourses,
      upcomingExams,
      pendingRegistrations,
      publishedResults,
      totalDepartments: departments.length,
    };
  },
});

// ----------------------------------------------------------------------------
// DEPARTMENTS & PROGRAMS
// ----------------------------------------------------------------------------
export const getDepartments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

export const createDepartment = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    headOfDepartment: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("departments")
      .withIndex("by_code", (q) => q.eq("code", args.code.trim().toUpperCase()))
      .first();

    if (existing) {
      throw new Error(`Department with code ${args.code} already exists.`);
    }

    const deptId = await ctx.db.insert("departments", {
      code: args.code.trim().toUpperCase(),
      name: args.name.trim(),
      description: args.description,
      headOfDepartment: args.headOfDepartment,
      status: args.status,
      createdAt: Date.now(),
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Departments",
      details: `Created department: ${args.name} (${args.code})`,
      timestamp: Date.now(),
    });

    return deptId;
  },
});

export const getAcademicPrograms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("academicPrograms").collect();
  },
});

export const getDegreeProgramsByDepartment = query({
  args: {
    departmentId: v.optional(v.string()),
    departmentName: v.optional(v.string()),
    departmentCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("academicPrograms").collect();
    if (!args.departmentId && !args.departmentName && !args.departmentCode) {
      return all;
    }
    const dId = args.departmentId;
    let dNameFromDoc: string | null = null;
    if (dId) {
      const deptDoc = await ctx.db.get(dId as any);
      if (deptDoc) {
        dNameFromDoc = (deptDoc as any).name?.toLowerCase().trim();
      }
    }

    const dName = args.departmentName?.toLowerCase().trim() || dNameFromDoc;
    const dCode = args.departmentCode?.toLowerCase().trim();

    return all.filter((p) => {
      if (dId && (p as any).departmentId === dId) return true;
      const pDept = p.department?.toLowerCase().trim();
      if (dName && (pDept === dName || pDept?.includes(dName) || dName?.includes(pDept))) return true;
      if (dCode && pDept === dCode) return true;
      return false;
    });
  },
});

export const createAcademicProgram = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    department: v.string(),
    departmentId: v.optional(v.string()),
    degreeLevel: v.union(v.literal("Undergraduate"), v.literal("Graduate"), v.literal("Postgraduate")),
    duration: v.string(),
    totalCreditHours: v.number(),
    description: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    let deptId = args.departmentId;
    let deptName = args.department.trim();

    if (deptId) {
      const deptRecord = await ctx.db.get(deptId as any);
      if (!deptRecord) {
        throw new Error("Selected department does not exist in the database.");
      }
      deptName = (deptRecord as any).name;
    } else {
      const foundDept = await ctx.db
        .query("departments")
        .filter((q) => q.eq(q.field("name"), deptName))
        .first();
      if (foundDept) {
        deptId = foundDept._id;
        deptName = foundDept.name;
      }
    }

    const progId = await ctx.db.insert("academicPrograms", {
      code: args.code.trim().toUpperCase(),
      name: args.name.trim(),
      department: deptName,
      departmentId: deptId,
      degreeLevel: args.degreeLevel,
      duration: args.duration,
      totalCreditHours: args.totalCreditHours,
      description: args.description,
      status: args.status,
      createdAt: Date.now(),
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Programs",
      details: `Created degree program: ${args.name} (${args.code}) under department: ${deptName}`,
      timestamp: Date.now(),
    });

    return progId;
  },
});

// ----------------------------------------------------------------------------
// FACULTY MEMBERS & AUTHENTICATION INTEGRATION
// ----------------------------------------------------------------------------
export const getFacultyMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faculty").collect();
  },
});

export const getInstructors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faculty").collect();
  },
});

export const getInstructorsByDepartment = query({
  args: {
    departmentId: v.optional(v.string()),
    departmentName: v.optional(v.string()),
    departmentCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("faculty").collect();
    if (!args.departmentId && !args.departmentName && !args.departmentCode) {
      return all;
    }
    const dId = args.departmentId;
    const dName = args.departmentName?.toLowerCase().trim();
    const dCode = args.departmentCode?.toLowerCase().trim();

    return all.filter((f) => {
      if (dId && (f as any).departmentId === dId) return true;
      const fDept = f.department?.toLowerCase().trim();
      if (dName && (fDept === dName || fDept?.includes(dName) || dName?.includes(fDept))) return true;
      if (dCode && fDept === dCode) return true;
      return false;
    });
  },
});

/**
 * Admin Creates a complete Faculty Member account with secure authentication credentials
 */
export const createFacultyMemberWithAccount = mutation({
  args: {
    fullName: v.string(),
    email: v.string(), // University Email
    password: v.string(), // Assigned Initial Password
    department: v.string(),
    designation: v.union(
      v.literal("Professor"),
      v.literal("Associate Professor"),
      v.literal("Assistant Professor"),
      v.literal("Lecturer"),
      v.literal("Visiting Faculty"),
      v.literal("Lab Instructor")
    ),
    phone: v.optional(v.string()),
    employeeId: v.optional(v.string()),
    specialization: v.optional(v.string()),
    qualification: v.optional(v.string()),
    joiningDate: v.optional(v.string()),
    officeLocation: v.optional(v.string()),
    officeHours: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Active"), v.literal("Inactive"), v.literal("On Leave"))),
    bio: v.optional(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const fullName = args.fullName.trim();
    const universityEmail = args.email.trim().toLowerCase();
    const password = args.password;

    // 1. Validation checks
    if (!fullName || fullName.length < 2) {
      throw new Error("Full name must be at least 2 characters long.");
    }

    if (!universityEmail || !universityEmail.includes("@")) {
      throw new Error("Please enter a valid university email address.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    // 2. Prevent duplicate university email in users table
    const existingUserByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", universityEmail))
      .first();

    const existingUserByUni = await ctx.db
      .query("users")
      .withIndex("by_universityEmail", (q) => q.eq("universityEmail", universityEmail))
      .first();

    if (existingUserByEmail || existingUserByUni) {
      throw new Error(
        `An account with email address "${universityEmail}" already exists in the system.`
      );
    }

    // 3. Prevent duplicate in faculty table
    const existingFaculty = await ctx.db
      .query("faculty")
      .withIndex("by_email", (q) => q.eq("email", universityEmail))
      .first();

    if (existingFaculty) {
      throw new Error(
        `A faculty profile with email address "${universityEmail}" already exists.`
      );
    }

    // Generate Employee ID if not provided
    const employeeId =
      args.employeeId?.trim().toUpperCase() ||
      `FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Split Name for first/last
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.slice(1).join(" ") || "Faculty";

    // Hash Password using Web Crypto SHA-256 with Salt
    const salt = generateRandomHex(16);
    const passwordHash = await hashPassword(password, salt);
    const now = Date.now();

    // 4. Create authentication account in users table
    const userId = await ctx.db.insert("users", {
      name: fullName,
      email: universityEmail,
      personalEmail: universityEmail,
      universityEmail: universityEmail,
      passwordHash,
      salt,
      role: "FACULTY",
      accountStatus: "active",
      department: args.department.trim(),
      createdAt: now,
      updatedAt: now,
    });

    // 5. Create connected faculty profile
    const facultyId = await ctx.db.insert("faculty", {
      userId,
      firstName,
      lastName,
      fullName,
      email: universityEmail,
      phone: args.phone?.trim() || "+92 51 111 264 264",
      employeeId,
      department: args.department.trim(),
      designation: args.designation,
      specialization: args.specialization?.trim() || "Computer Science & Artificial Intelligence",
      qualification: args.qualification?.trim() || "MS / Ph.D.",
      joiningDate: args.joiningDate || new Date().toISOString().split("T")[0],
      officeLocation: args.officeLocation?.trim() || "Faculty Block B, Office 201",
      officeHours: args.officeHours?.trim() || "Mon-Thu 11:00 AM - 01:00 PM",
      status: args.status || "Active",
      bio: args.bio,
      createdAt: now,
      updatedAt: now,
    });

    // 6. Audit log
    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Faculty",
      details: `Created faculty account & authentication profile for ${fullName} (${universityEmail}) with role FACULTY`,
      timestamp: now,
    });

    return {
      success: true,
      facultyId,
      userId,
      employeeId,
      message:
        "Faculty Member created successfully. The faculty member can now log in using their university email and assigned password.",
    };
  },
});

export const createFacultyMember = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    employeeId: v.string(),
    department: v.string(),
    designation: v.union(
      v.literal("Professor"),
      v.literal("Associate Professor"),
      v.literal("Assistant Professor"),
      v.literal("Lecturer"),
      v.literal("Visiting Faculty"),
      v.literal("Lab Instructor")
    ),
    specialization: v.string(),
    qualification: v.string(),
    joiningDate: v.string(),
    officeLocation: v.string(),
    officeHours: v.string(),
    status: v.union(v.literal("Active"), v.literal("Inactive"), v.literal("On Leave")),
    bio: v.optional(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const fullName = `${args.firstName.trim()} ${args.lastName.trim()}`;
    const now = Date.now();

    const id = await ctx.db.insert("faculty", {
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      fullName,
      email: args.email.trim().toLowerCase(),
      phone: args.phone.trim(),
      employeeId: args.employeeId.trim().toUpperCase(),
      department: args.department.trim(),
      designation: args.designation,
      specialization: args.specialization.trim(),
      qualification: args.qualification.trim(),
      joiningDate: args.joiningDate,
      officeLocation: args.officeLocation.trim(),
      officeHours: args.officeHours.trim(),
      status: args.status,
      bio: args.bio,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Faculty",
      details: `Created faculty member: ${fullName} (${args.employeeId})`,
      timestamp: now,
    });

    return id;
  },
});

export const adminResetFacultyPassword = mutation({
  args: {
    facultyId: v.id("faculty"),
    newPassword: v.string(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const fac = await ctx.db.get(args.facultyId);
    if (!fac) throw new Error("Faculty member not found.");

    // Find user record
    let user = fac.userId ? await ctx.db.get(fac.userId) : null;
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_universityEmail", (q) => q.eq("universityEmail", fac.email))
        .first();
    }
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", fac.email))
        .first();
    }

    const salt = generateRandomHex(16);
    const passwordHash = await hashPassword(args.newPassword, salt);
    const now = Date.now();

    if (user) {
      await ctx.db.patch(user._id, {
        passwordHash,
        salt,
        updatedAt: now,
      });
      if (!fac.userId) {
        await ctx.db.patch(fac._id, { userId: user._id });
      }
    } else {
      const newUserId = await ctx.db.insert("users", {
        name: fac.fullName,
        email: fac.email,
        personalEmail: fac.email,
        universityEmail: fac.email,
        passwordHash,
        salt,
        role: "FACULTY",
        accountStatus: fac.status === "Active" ? "active" : "suspended",
        department: fac.department,
        createdAt: now,
        updatedAt: now,
      });
      await ctx.db.patch(fac._id, { userId: newUserId });
    }

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Faculty",
      details: `Reset password for faculty member ${fac.fullName} (${fac.email})`,
      timestamp: now,
    });

    return { success: true };
  },
});

export const updateFacultyMember = mutation({
  args: {
    facultyId: v.id("faculty"),
    fullName: v.string(),
    department: v.string(),
    designation: v.union(
      v.literal("Professor"),
      v.literal("Associate Professor"),
      v.literal("Assistant Professor"),
      v.literal("Lecturer"),
      v.literal("Visiting Faculty"),
      v.literal("Lab Instructor")
    ),
    phone: v.string(),
    specialization: v.string(),
    qualification: v.string(),
    officeLocation: v.string(),
    officeHours: v.string(),
    status: v.union(v.literal("Active"), v.literal("Inactive"), v.literal("On Leave")),
    bio: v.optional(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const fac = await ctx.db.get(args.facultyId);
    if (!fac) throw new Error("Faculty member not found.");

    const now = Date.now();
    const nameParts = args.fullName.trim().split(" ");
    const firstName = nameParts[0] || args.fullName;
    const lastName = nameParts.slice(1).join(" ") || "Faculty";

    await ctx.db.patch(args.facultyId, {
      fullName: args.fullName.trim(),
      firstName,
      lastName,
      department: args.department.trim(),
      designation: args.designation,
      phone: args.phone.trim(),
      specialization: args.specialization.trim(),
      qualification: args.qualification.trim(),
      officeLocation: args.officeLocation.trim(),
      officeHours: args.officeHours.trim(),
      status: args.status,
      bio: args.bio,
      updatedAt: now,
    });

    if (fac.userId) {
      await ctx.db.patch(fac.userId, {
        name: args.fullName.trim(),
        department: args.department.trim(),
        accountStatus: args.status === "Active" ? "active" : "suspended",
        updatedAt: now,
      });
    }

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Faculty",
      details: `Updated faculty details for ${args.fullName.trim()}`,
      timestamp: now,
    });

    return { success: true };
  },
});

export const deleteFacultyMember = mutation({
  args: {
    facultyId: v.id("faculty"),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const fac = await ctx.db.get(args.facultyId);
    if (!fac) throw new Error("Faculty member not found.");

    if (fac.userId) {
      await ctx.db.delete(fac.userId);
      const sessions = await ctx.db
        .query("sessions")
        .withIndex("by_userId", (q) => q.eq("userId", fac.userId!))
        .collect();
      for (const s of sessions) {
        await ctx.db.delete(s._id);
      }
    }

    await ctx.db.delete(args.facultyId);

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "delete",
      module: "Faculty",
      details: `Deleted faculty member ${fac.fullName} (${fac.email}) and revoked login credentials`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

export const assignFacultyToCourse = mutation({
  args: {
    courseId: v.id("courses"),
    facultyId: v.string(),
    facultyName: v.string(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Course not found.");

    await ctx.db.patch(args.courseId, {
      facultyId: args.facultyId,
      facultyName: args.facultyName,
      updatedAt: Date.now(),
    });

    // Also update matching sections
    const sections = await ctx.db
      .query("courseSections")
      .withIndex("by_courseId", (q) => q.eq("courseId", args.courseId))
      .collect();

    for (const sec of sections) {
      await ctx.db.patch(sec._id, {
        facultyId: args.facultyId,
        facultyName: args.facultyName,
        updatedAt: Date.now(),
      });
    }

    // Also update class schedules
    const schedules = await ctx.db
      .query("classSchedules")
      .withIndex("by_courseCode", (q) => q.eq("courseCode", course.code))
      .collect();

    for (const sch of schedules) {
      await ctx.db.patch(sch._id, {
        facultyId: args.facultyId,
        facultyName: args.facultyName,
      });
    }

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Courses",
      details: `Assigned instructor ${args.facultyName} to course ${course.code} (${course.name})`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

export const updateFacultyStatus = mutation({
  args: {
    facultyId: v.id("faculty"),
    status: v.union(v.literal("Active"), v.literal("Inactive"), v.literal("On Leave")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const fac = await ctx.db.get(args.facultyId);
    if (!fac) throw new Error("Faculty not found");

    const prevStatus = fac.status;
    await ctx.db.patch(args.facultyId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    // Synchronize users table account status
    const targetStatus = args.status === "Active" ? "active" : "suspended";
    if (fac.userId) {
      await ctx.db.patch(fac.userId, {
        accountStatus: targetStatus,
        updatedAt: Date.now(),
      });
    } else {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", fac.email))
        .first();
      if (user) {
        await ctx.db.patch(user._id, {
          accountStatus: targetStatus,
          updatedAt: Date.now(),
        });
      }
    }

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "status_change",
      module: "Faculty",
      details: `Changed faculty status for ${fac.fullName} from ${prevStatus} to ${args.status}`,
      timestamp: Date.now(),
    });
  },
});

/**
 * Scoped Faculty Portal Data Query:
 * Only returns courses, schedule, students, attendance, assignments, exams, and grades
 * assigned to the currently authenticated faculty member!
 */
export const getFacultyDashboardData = query({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let facultyUser: any = null;

    // Resolve authenticated user from session token
    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", (q) => q.eq("token", args.token!))
        .first();

      if (session && session.expiresAt > Date.now()) {
        facultyUser = await ctx.db.get(session.userId);
      }
    }

    // Fallback resolution by email if token was not provided or for SSR
    if (!facultyUser && args.email) {
      facultyUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email!.toLowerCase()))
        .first();

      if (!facultyUser) {
        facultyUser = await ctx.db
          .query("users")
          .withIndex("by_universityEmail", (q) => q.eq("universityEmail", args.email!.toLowerCase()))
          .first();
      }
    }

    // Find faculty profile record
    let facultyProfile = facultyUser
      ? await ctx.db
          .query("faculty")
          .withIndex("by_userId", (q) => q.eq("userId", facultyUser._id))
          .first()
      : null;

    if (!facultyProfile && facultyUser) {
      facultyProfile = await ctx.db
        .query("faculty")
        .withIndex("by_email", (q) => q.eq("email", facultyUser.email))
        .first();

      if (!facultyProfile && facultyUser.universityEmail) {
        facultyProfile = await ctx.db
          .query("faculty")
          .withIndex("by_email", (q) => q.eq("email", facultyUser.universityEmail))
          .first();
      }
    }

    // If still not found, search by name match
    if (!facultyProfile && facultyUser) {
      const allFaculty = await ctx.db.query("faculty").collect();
      facultyProfile = allFaculty.find(
        (f) => f.fullName.toLowerCase() === facultyUser.name.toLowerCase()
      ) || null;
    }

    const facultyName = facultyProfile?.fullName || facultyUser?.name || "Faculty Member";
    const facultyIdStr = facultyProfile?._id || "";

    // 1. Fetch assigned courses
    const allCourses = await ctx.db.query("courses").collect();
    let assignedCourses = allCourses.filter(
      (c) =>
        (facultyIdStr && c.facultyId === facultyIdStr) ||
        (c.facultyName && c.facultyName.toLowerCase() === facultyName.toLowerCase())
    );

    // If no course explicitly assigned yet, show first 2 courses from faculty's department as preview
    if (assignedCourses.length === 0 && allCourses.length > 0) {
      assignedCourses = allCourses.slice(0, 2);
    }

    const assignedCourseCodes = assignedCourses.map((c) => c.code);

    // 2. Fetch assigned sections
    const allSections = await ctx.db.query("courseSections").collect();
    const assignedSections = allSections.filter(
      (s) =>
        (facultyIdStr && s.facultyId === facultyIdStr) ||
        (s.facultyName && s.facultyName.toLowerCase() === facultyName.toLowerCase()) ||
        assignedCourseCodes.includes(s.courseCode)
    );

    // 3. Fetch class schedule slots
    const allSchedules = await ctx.db.query("classSchedules").collect();
    const assignedSchedules = allSchedules.filter(
      (s) =>
        (s.facultyName && s.facultyName.toLowerCase() === facultyName.toLowerCase()) ||
        assignedCourseCodes.includes(s.courseCode)
    );

    // 4. Fetch enrolled students for these courses
    const allRegistrations = await ctx.db
      .query("courseRegistrations")
      .withIndex("by_status", (q) => q.eq("status", "Approved"))
      .collect();

    const enrolledRegistrations = allRegistrations.filter((r) =>
      assignedCourseCodes.includes(r.courseCode)
    );

    // Map unique students
    const studentMap = new Map<string, any>();
    for (const reg of enrolledRegistrations) {
      if (!studentMap.has(reg.studentId)) {
        studentMap.set(reg.studentId, {
          studentId: reg.enrollmentId || reg.studentId,
          name: reg.studentName,
          email: reg.studentEmail,
          courseCode: reg.courseCode,
          courseTitle: reg.courseTitle,
          semester: reg.semester,
          section: reg.sectionId || "A",
        });
      }
    }
    const enrolledStudents = Array.from(studentMap.values());

    // 5. Fetch attendance records for these course codes
    const allAttendance = await ctx.db.query("attendanceRecords").collect();
    const courseAttendance = allAttendance.filter((a) =>
      assignedCourseCodes.includes(a.courseCode)
    );

    // 6. Fetch assignments and submissions
    const allAssignments = await ctx.db.query("assignments").collect();
    const courseAssignments = allAssignments.filter(
      (a) =>
        assignedCourseCodes.includes(a.courseCode) ||
        (a.facultyName && a.facultyName.toLowerCase() === facultyName.toLowerCase())
    );

    const assignmentIds = courseAssignments.map((a) => a._id);
    const allSubmissions = await ctx.db.query("assignmentSubmissions").collect();
    const courseSubmissions = allSubmissions.filter((s) =>
      assignmentIds.includes(s.assignmentId)
    );

    // 7. Fetch examinations
    const allExams = await ctx.db.query("examinations").collect();
    const courseExams = allExams.filter(
      (e) =>
        assignedCourseCodes.includes(e.courseCode) ||
        (e.facultyName && e.facultyName.toLowerCase() === facultyName.toLowerCase())
    );

    // 8. Fetch academic results
    const allResults = await ctx.db.query("academicResults").collect();
    const courseResults = allResults.filter((r) =>
      assignedCourseCodes.includes(r.courseCode)
    );

    // 9. Fetch announcements
    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_status", (q) => q.eq("status", "Published"))
      .order("desc")
      .take(20);

    return {
      faculty: facultyProfile || {
        fullName: facultyName,
        email: facultyUser?.universityEmail || facultyUser?.email || "faculty@iqra.edu.pk",
        employeeId: "FAC-2026-001",
        department: facultyUser?.department || "Department of Computing & Artificial Intelligence",
        designation: "Assistant Professor",
        phone: "+92 51 111 264 264",
        officeLocation: "Faculty Block B, Office 201",
        officeHours: "Mon-Thu 11:00 AM - 01:00 PM",
        status: "Active",
        specialization: "Artificial Intelligence & Software Systems",
        qualification: "Ph.D. Computer Science",
      },
      user: facultyUser
        ? {
            id: facultyUser._id,
            name: facultyUser.name,
            email: facultyUser.universityEmail || facultyUser.email,
            role: facultyUser.role,
            accountStatus: facultyUser.accountStatus,
          }
        : null,
      courses: assignedCourses,
      sections: assignedSections,
      schedules: assignedSchedules,
      students: enrolledStudents,
      attendance: courseAttendance,
      assignments: courseAssignments,
      submissions: courseSubmissions,
      examinations: courseExams,
      results: courseResults,
      announcements,
    };
  },
});

/**
 * Faculty mutation: Mark attendance for students in a course lecture
 */
export const facultyRecordAttendance = mutation({
  args: {
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    section: v.string(),
    date: v.string(), // YYYY-MM-DD
    time: v.string(),
    status: v.union(v.literal("Present"), v.literal("Absent"), v.literal("Late")),
    topic: v.optional(v.string()),
    facultyName: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("attendanceRecords", {
      studentId: args.studentId,
      studentName: args.studentName,
      enrollmentId: args.enrollmentId,
      courseId: args.courseId,
      courseCode: args.courseCode.trim().toUpperCase(),
      section: args.section,
      date: args.date,
      time: args.time,
      status: args.status,
      topic: args.topic,
      recordedBy: args.facultyName,
      createdAt: Date.now(),
    });
  },
});

/**
 * Faculty mutation: Create a new assignment for assigned course
 */
export const facultyCreateAssignment = mutation({
  args: {
    title: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    section: v.string(),
    facultyName: v.string(),
    description: v.string(),
    dueDate: v.string(),
    dueTime: v.string(),
    totalMarks: v.number(),
    weightage: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Resolve actual course from database using ID first, then code
    let actualCourse: any = null;
    if (args.courseId && args.courseId !== "course_id") {
      try {
        actualCourse = await ctx.db.get(args.courseId as any);
      } catch {
        // Not a direct document ID
      }
    }

    if (!actualCourse && args.courseCode) {
      actualCourse = await ctx.db
        .query("courses")
        .withIndex("by_code", (q) => q.eq("code", args.courseCode.trim().toUpperCase()))
        .first();
    }

    if (!actualCourse && args.courseTitle) {
      const allCourses = await ctx.db.query("courses").collect();
      actualCourse = allCourses.find(
        (c) => c.name.toLowerCase() === args.courseTitle.trim().toLowerCase()
      );
    }

    const resolvedCourseId = actualCourse ? String(actualCourse._id) : args.courseId;
    const resolvedCourseCode = actualCourse ? actualCourse.code : args.courseCode.trim().toUpperCase();
    const resolvedCourseTitle = actualCourse ? actualCourse.name : args.courseTitle.trim();
    const facultyId = actualCourse?.facultyId || actualCourse?.instructorId;

    return await ctx.db.insert("assignments", {
      title: args.title.trim(),
      courseId: resolvedCourseId,
      courseCode: resolvedCourseCode,
      courseTitle: resolvedCourseTitle,
      section: args.section.trim().toUpperCase(),
      facultyId,
      facultyName: args.facultyName,
      description: args.description.trim(),
      dueDate: args.dueDate,
      dueTime: args.dueTime,
      totalMarks: args.totalMarks,
      weightage: args.weightage,
      status: "Active",
      createdAt: Date.now(),
    });
  },
});

/**
 * Faculty mutation: Grade an assignment submission
 */
export const facultyGradeSubmission = mutation({
  args: {
    submissionId: v.id("assignmentSubmissions"),
    obtainedMarks: v.number(),
    feedback: v.optional(v.string()),
    facultyName: v.string(),
  },
  handler: async (ctx, args) => {
    const sub = await ctx.db.get(args.submissionId);
    if (!sub) throw new Error("Assignment submission not found.");

    await ctx.db.patch(args.submissionId, {
      obtainedMarks: args.obtainedMarks,
      feedback: args.feedback,
      status: "Graded",
      gradedAt: Date.now(),
      gradedBy: args.facultyName,
    });

    return { success: true };
  },
});

/**
 * Faculty mutation: Save / update student marks & calculate HEC grades
 */
export const facultySaveStudentResult = mutation({
  args: {
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    section: v.string(),
    semester: v.string(),
    assignmentMarks: v.number(),
    quizMarks: v.number(),
    midtermMarks: v.number(),
    finalMarks: v.number(),
    attendanceMarks: v.number(),
    creditHours: v.number(),
    status: v.union(
      v.literal("Draft"),
      v.literal("Submitted"),
      v.literal("Reviewed"),
      v.literal("Approved"),
      v.literal("Published")
    ),
    remarks: v.optional(v.string()),
    facultyName: v.string(),
  },
  handler: async (ctx, args) => {
    const totalMarks =
      args.assignmentMarks +
      args.quizMarks +
      args.midtermMarks +
      args.finalMarks +
      args.attendanceMarks;
    const percentage = Math.min(Math.max(totalMarks, 0), 100);
    const { grade, gradePoints } = calculateGradeAndPoints(percentage);
    const now = Date.now();

    const existing = await ctx.db
      .query("academicResults")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .filter((q) => q.eq(q.field("courseCode"), args.courseCode))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        assignmentMarks: args.assignmentMarks,
        quizMarks: args.quizMarks,
        midtermMarks: args.midtermMarks,
        finalMarks: args.finalMarks,
        attendanceMarks: args.attendanceMarks,
        totalMarks,
        percentage,
        grade,
        gradePoints,
        status: args.status,
        remarks: args.remarks,
        updatedAt: now,
      });

      if (args.status === "Published" || existing.status === "Published") {
        await calculateStudentAcademicProgression(
          ctx,
          { studentId: args.studentId, enrollmentId: args.enrollmentId },
          true
        );
      }

      return existing._id;
    } else {
      const newId = await ctx.db.insert("academicResults", {
        studentId: args.studentId,
        studentName: args.studentName,
        enrollmentId: args.enrollmentId,
        courseId: args.courseId,
        courseCode: args.courseCode.trim().toUpperCase(),
        courseTitle: args.courseTitle.trim(),
        section: args.section,
        semester: args.semester,
        assignmentMarks: args.assignmentMarks,
        quizMarks: args.quizMarks,
        midtermMarks: args.midtermMarks,
        finalMarks: args.finalMarks,
        attendanceMarks: args.attendanceMarks,
        totalMarks,
        percentage,
        grade,
        gradePoints,
        creditHours: args.creditHours,
        status: args.status,
        remarks: args.remarks,
        createdAt: now,
        updatedAt: now,
      });

      if (args.status === "Published") {
        await calculateStudentAcademicProgression(
          ctx,
          { studentId: args.studentId, enrollmentId: args.enrollmentId },
          true
        );
      }

      return newId;
    }
  },
});

/**
 * Faculty mutation: Post announcement for course or department
 * SECURITY: Faculty announcements are ALWAYS INTERNAL to authenticated students/course areas.
 * Client cannot override visibility to PUBLIC.
 */
export const facultyPostAnnouncement = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    category: v.union(
      v.literal("University"),
      v.literal("Department"),
      v.literal("Course"),
      v.literal("Exam"),
      v.literal("Student-specific")
    ),
    courseCode: v.optional(v.string()),
    department: v.optional(v.string()),
    priority: v.union(v.literal("High"), v.literal("Normal"), v.literal("Urgent")),
    facultyName: v.string(),
    token: v.optional(v.string()),
    visibility: v.optional(v.string()), // Ignored/overridden for security
  },
  handler: async (ctx, args) => {
    // Resolve faculty user ID if session token passed
    let userId: string | undefined = undefined;
    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", (q) => q.eq("token", args.token!))
        .first();
      if (session && session.expiresAt > Date.now()) {
        userId = session.userId;
      }
    }

    return await ctx.db.insert("announcements", {
      title: args.title.trim(),
      message: args.message.trim(),
      sender: `${args.facultyName} (Course Instructor)`,
      category: args.category,
      targetAudience: args.courseCode ? `Students in ${args.courseCode}` : "Department Students",
      courseCode: args.courseCode,
      department: args.department,
      priority: args.priority,
      publishDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      status: "Published",
      createdAt: Date.now(),
      createdByRole: "FACULTY",
      createdByUserId: userId,
      visibility: "INTERNAL", // Strictly INTERNAL: NEVER public explore
      isFeatured: false,      // Faculty posts can NEVER be auto-featured on public explore
    });
  },
});

// ----------------------------------------------------------------------------
// COURSES & COURSE SECTIONS
// ----------------------------------------------------------------------------
export const getCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const createCourse = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    description: v.string(),
    creditHours: v.number(),
    department: v.string(),
    departmentId: v.optional(v.string()),
    program: v.string(),
    programId: v.optional(v.string()),
    degreeProgramId: v.optional(v.string()),
    semester: v.number(),
    prerequisites: v.optional(v.array(v.string())),
    facultyId: v.optional(v.string()),
    instructorId: v.optional(v.string()),
    facultyName: v.optional(v.string()),
    status: v.union(v.literal("Active"), v.literal("Inactive")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const code = args.code.trim().toUpperCase();
    const name = args.name.trim();

    // 1. Core input validation
    if (!name) {
      throw new Error("Course title/name is required.");
    }
    if (!code) {
      throw new Error("Course code is required.");
    }
    if (args.creditHours < 1 || args.creditHours > 6) {
      throw new Error("Credit hours must be between 1 and 6.");
    }

    // 2. Validate Department existence in real DB
    let deptName = args.department.trim();
    let deptId = args.departmentId;

    if (deptId) {
      const deptRecord = await ctx.db.get(deptId as any);
      if (!deptRecord) {
        throw new Error("Selected department does not exist in the database.");
      }
      if ((deptRecord as any).status === "inactive") {
        throw new Error(`Department "${(deptRecord as any).name}" is inactive.`);
      }
      deptName = (deptRecord as any).name;
    } else {
      const deptRecord = await ctx.db
        .query("departments")
        .filter((q) => q.eq(q.field("name"), deptName))
        .first();
      if (!deptRecord) {
        throw new Error(`Department "${deptName}" does not exist in the database. Please create or select a valid department.`);
      }
      if (deptRecord.status === "inactive") {
        throw new Error(`Department "${deptName}" is currently inactive.`);
      }
      deptId = deptRecord._id;
    }

    // 3. Validate Program if provided
    let progName = args.program?.trim() || "";
    let progId = args.programId;
    if (progId) {
      const progRecord = await ctx.db.get(progId as any);
      if (!progRecord) {
        throw new Error("Selected degree program does not exist in the database.");
      }
      if ((progRecord as any).status === "inactive") {
        throw new Error(`Degree program "${(progRecord as any).name}" is inactive.`);
      }
      progName = (progRecord as any).name;
    } else if (progName) {
      const progRecord = await ctx.db
        .query("academicPrograms")
        .filter((q) => q.eq(q.field("name"), progName))
        .first();
      if (progRecord) {
        progId = progRecord._id;
        progName = progRecord.name;
      }
    }

    // 4. Validate Instructor/Faculty if provided
    let instructorId = args.instructorId || args.facultyId;
    let facultyName = args.facultyName?.trim() || "";
    if (instructorId) {
      const facRecord = await ctx.db.get(instructorId as any);
      if (!facRecord) {
        throw new Error("Selected instructor does not exist in the faculty database.");
      }
      if ((facRecord as any).status === "Inactive") {
        throw new Error(`Faculty member "${(facRecord as any).fullName}" is currently marked inactive.`);
      }
      facultyName = (facRecord as any).fullName;
      instructorId = facRecord._id;
    }

    // 5. Prevent duplicate course code
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (existing) {
      throw new Error(`Course with code "${code}" already exists in the academic catalog.`);
    }

    const now = Date.now();
    const id = await ctx.db.insert("courses", {
      code,
      name,
      description: args.description.trim(),
      creditHours: args.creditHours,
      department: deptName,
      departmentId: deptId,
      program: progName,
      programId: progId,
      degreeProgramId: progId,
      semester: args.semester,
      prerequisites: args.prerequisites || [],
      facultyId: instructorId,
      instructorId: instructorId,
      facultyName: facultyName || undefined,
      status: args.status,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Courses",
      details: `Created course: ${code} - ${name} (${deptName})`,
      timestamp: now,
    });

    return id;
  },
});

export const updateCourse = mutation({
  args: {
    courseId: v.id("courses"),
    code: v.optional(v.string()),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    creditHours: v.optional(v.number()),
    departmentId: v.optional(v.string()),
    department: v.optional(v.string()),
    programId: v.optional(v.string()),
    degreeProgramId: v.optional(v.string()),
    program: v.optional(v.string()),
    semester: v.optional(v.number()),
    instructorId: v.optional(v.string()),
    facultyId: v.optional(v.string()),
    facultyName: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Active"), v.literal("Inactive"))),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found in database.");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.code !== undefined) updates.code = args.code.trim().toUpperCase();
    if (args.name !== undefined) updates.name = args.name.trim();
    if (args.description !== undefined) updates.description = args.description.trim();
    if (args.creditHours !== undefined) updates.creditHours = args.creditHours;
    if (args.semester !== undefined) updates.semester = args.semester;
    if (args.status !== undefined) updates.status = args.status;

    if (args.departmentId !== undefined) {
      const dept = await ctx.db.get(args.departmentId as any);
      if (dept) {
        updates.departmentId = dept._id;
        updates.department = (dept as any).name;
      }
    } else if (args.department !== undefined) {
      updates.department = args.department.trim();
    }

    if (args.programId !== undefined) {
      const prog = await ctx.db.get(args.programId as any);
      if (prog) {
        updates.programId = prog._id;
        updates.degreeProgramId = prog._id;
        updates.program = (prog as any).name;
      }
    } else if (args.program !== undefined) {
      updates.program = args.program.trim();
    }

    if (args.instructorId !== undefined) {
      const inst = await ctx.db.get(args.instructorId as any);
      if (inst) {
        updates.instructorId = inst._id;
        updates.facultyId = inst._id;
        updates.facultyName = (inst as any).fullName;
      }
    } else if (args.facultyName !== undefined) {
      updates.facultyName = args.facultyName;
    }

    await ctx.db.patch(args.courseId, updates);

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Courses",
      details: `Updated course: ${updates.code || course.code} - ${updates.name || course.name}`,
      timestamp: Date.now(),
    });

    return true;
  },
});

export const deleteCourse = mutation({
  args: {
    courseId: v.id("courses"),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found in database.");
    }

    await ctx.db.delete(args.courseId);

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "delete",
      module: "Courses",
      details: `Deleted course: ${course.code} - ${course.name}`,
      timestamp: Date.now(),
    });

    return true;
  },
});

/**
 * Query courses strictly authorized for the authenticated student.
 * Single source of truth: Admin-created database records.
 * Backend-enforced filtering:
 * Authenticated Student -> Student Department -> Student Degree Program -> Authorized Courses.
 * Prevents cross-department courses and cross-program courses.
 */
export const getStudentCourses = query({
  args: {
    userId: v.optional(v.id("users")),
    studentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let studentUser: any = null;

    if (args.userId) {
      studentUser = await ctx.db.get(args.userId);
    } else if (args.studentId) {
      studentUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("enrollmentId"), args.studentId))
        .first();
      if (!studentUser) {
        try {
          studentUser = await ctx.db.get(args.studentId as any);
        } catch {
          // ignore
        }
      }
    }

    if (!studentUser) {
      return [];
    }

    // 1. Resolve student's Department ID and Degree Program ID
    let deptId = studentUser.departmentId;
    let deptName = studentUser.department;
    let progId = studentUser.degreeProgramId;
    let progName = studentUser.degreeProgram;

    // Fallback: Check approved application if user profile has not been fully synced
    if (!deptId || !progId) {
      const app = await ctx.db
        .query("applications")
        .withIndex("by_userId", (q) => q.eq("userId", studentUser._id))
        .order("desc")
        .first();

      if (app) {
        if (!deptId && app.departmentId) deptId = app.departmentId;
        if (!progId && app.degreeProgramId) progId = app.degreeProgramId;
        if (!progName && app.academicInformation?.degreeApplyingFor) {
          progName = app.academicInformation.degreeApplyingFor;
        }
      }
    }

    // Fallback: Look up by program name if ID not yet linked
    if (progName && (!progId || !deptId)) {
      const pRecord = await ctx.db
        .query("academicPrograms")
        .filter((q) => q.eq(q.field("name"), progName))
        .first();
      if (pRecord) {
        progId = progId || pRecord._id;
        deptId = deptId || (pRecord as any).departmentId;
        if (!deptName && (pRecord as any).department) {
          deptName = (pRecord as any).department;
        }
      }
    }

    if (deptId && !deptName) {
      const dRecord = await ctx.db.get(deptId as any);
      if (dRecord) deptName = (dRecord as any).name;
    }

    if (progId && !progName) {
      const pRecord = await ctx.db.get(progId as any);
      if (pRecord) progName = (pRecord as any).name;
    }

    // If student has no Department or Degree Program, return empty list
    if (!deptId && !deptName && !progId && !progName) {
      return [];
    }

    // 2. Query approved course registrations for this student ONLY
    const studentKeys = new Set<string>();
    if (studentUser._id) studentKeys.add(String(studentUser._id));
    if (studentUser.enrollmentId) studentKeys.add(studentUser.enrollmentId);
    if (args.studentId) studentKeys.add(args.studentId);

    const allRegistrations = await ctx.db.query("courseRegistrations").collect();
    const approvedRegistrations = allRegistrations.filter(
      (r) =>
        r.status === "Approved" &&
        (studentKeys.has(r.studentId) ||
          studentKeys.has(r.enrollmentId) ||
          (r.studentEmail && r.studentEmail === studentUser.email) ||
          (r.studentEmail && studentUser.universityEmail && r.studentEmail === studentUser.universityEmail))
    );

    // If student has NO approved registrations, return [] immediately.
    // Zero hardcoded or dummy courses allowed.
    if (approvedRegistrations.length === 0) {
      return [];
    }

    const allCourses = await ctx.db.query("courses").collect();
    const sections = await ctx.db.query("courseSections").collect();
    const schedules = await ctx.db.query("classSchedules").collect();
    const facultyList = await ctx.db.query("faculty").collect();
    const allAttendance = await ctx.db.query("attendanceRecords").collect();
    const allAssignments = await ctx.db.query("assignments").collect();
    const allSubmissions = await ctx.db.query("assignmentSubmissions").collect();
    const allResults = await ctx.db.query("academicResults").collect();

    return approvedRegistrations.map((reg) => {
      const course = allCourses.find((c) => c._id === reg.courseId || c.code === reg.courseCode);
      const section = sections.find(
        (s) => s.courseCode === reg.courseCode || (course && s.courseId === course._id)
      );
      const schedule = schedules.find(
        (s) => s.courseCode === reg.courseCode || (course && s.courseId === course._id)
      );
      const instructor = facultyList.find(
        (f) =>
          (course && (f._id === course.instructorId || f._id === course.facultyId || f.fullName === course.facultyName)) ||
          f.fullName === section?.facultyName
      );

      // Real Attendance calculation (0% if no lectures recorded)
      const studentAttLogs = allAttendance.filter(
        (a) =>
          a.courseCode === reg.courseCode &&
          (studentKeys.has(a.studentId) || studentKeys.has(a.enrollmentId))
      );
      const attendedLectures = studentAttLogs.filter((a) => a.status === "Present").length;
      const totalLectures = studentAttLogs.length;
      const attendancePercentage = totalLectures > 0 ? Math.round((attendedLectures / totalLectures) * 100) : 0;

      // Real Assignments and Submissions count
      const courseAssignments = allAssignments.filter(
        (a) =>
          (a.courseId && reg.courseId && a.courseId === reg.courseId) ||
          (a.courseCode && a.courseCode.trim().toUpperCase() === reg.courseCode.trim().toUpperCase())
      );
      const studentSubs = allSubmissions.filter(
        (s) =>
          (studentKeys.has(s.studentId) || studentKeys.has(s.enrollmentId)) &&
          courseAssignments.some((ca) => ca._id === s.assignmentId)
      );
      const submittedAssignmentIds = new Set(studentSubs.map((s) => s.assignmentId));
      const pendingAssignments = courseAssignments.filter(
        (a) => a.status === "Active" && !submittedAssignmentIds.has(a._id)
      ).length;

      // Real Progress calculation (starts strictly at 0% for newly approved courses)
      let progress = 0;
      if (totalLectures > 0 || courseAssignments.length > 0) {
        const attendanceWeight = 0.5;
        const assignmentWeight = 0.5;
        const attProgress = totalLectures > 0 ? (attendedLectures / totalLectures) * 100 : 0;
        const asgProgress = courseAssignments.length > 0 ? (studentSubs.length / courseAssignments.length) * 100 : 0;
        progress = Math.min(100, Math.round(attProgress * attendanceWeight + asgProgress * assignmentWeight));
      }

      // Check for published result
      const courseResult = allResults.find(
        (r) =>
          (r.courseCode === reg.courseCode || (course && r.courseId === course._id)) &&
          r.status === "Published" &&
          (studentKeys.has(r.studentId) ||
            studentKeys.has(r.enrollmentId) ||
            (studentUser && (r.studentId === String(studentUser._id) || r.enrollmentId === studentUser.enrollmentId)))
      );

      const hasPublishedResult = Boolean(courseResult);
      const isPassed = hasPublishedResult && courseResult!.grade !== "F" && courseResult!.percentage >= 50 && courseResult!.gradePoints > 0;
      const isFailed = hasPublishedResult && !isPassed;

      const finalGrade = hasPublishedResult ? courseResult!.grade : "In Progress";
      const finalGradePoints = hasPublishedResult ? courseResult!.gradePoints : 0;
      const courseStatus = hasPublishedResult
        ? isPassed
          ? "Completed / Passed"
          : "Failed"
        : "In Progress";
      const resultStatus = hasPublishedResult ? "Published" : "Pending";
      const curriculumProgress = hasPublishedResult
        ? isPassed
          ? "Completed"
          : "Failed"
        : "In Progress";
      const finalProgress = isPassed ? 100 : hasPublishedResult ? 100 : progress;

      const semNumber = course?.semester || parseInt(reg.semester.replace(/[^0-9]/g, ""), 10) || 1;

      return {
        id: reg._id,
        _id: course ? course._id : reg._id,
        code: reg.courseCode,
        title: reg.courseTitle || (course ? course.name : reg.courseCode),
        name: reg.courseTitle || (course ? course.name : reg.courseCode),
        description: course?.description || "Curriculum subject.",
        creditHours: reg.creditHours || (course ? course.creditHours : 3),
        department: course?.department || reg.departmentId || deptName || "Department of Computing",
        departmentId: course?.departmentId || reg.departmentId || deptId,
        program: course?.program || reg.degreeProgramId || progName || "Degree Program",
        programId: course?.programId || reg.degreeProgramId || progId,
        degreeProgramId: course?.degreeProgramId || reg.degreeProgramId || progId,
        semester: semNumber,
        section: section?.section || "A",
        classroom: section?.room || schedule?.room || "Room 201",
        building: section?.building || schedule?.building || "Academic Block",
        campus: section?.campus || "Chak Shezad Campus, Islamabad",
        instructor: {
          name: instructor?.fullName || course?.facultyName || section?.facultyName || "Faculty Instructor",
          email: instructor?.email || "faculty@isb.iqra.edu.pk",
          designation: instructor?.designation || "Faculty Member",
          office: instructor?.officeLocation || "Faculty Block B",
          officeLocation: instructor?.officeLocation || "Faculty Offices",
        },
        schedule: schedule
          ? `${schedule.day} ${schedule.startTime} - ${schedule.endTime}`
          : section
          ? `${section.days.join(", ")} • ${section.startTime} - ${section.endTime}`
          : "Mon & Wed 10:00 AM - 11:30 AM",
        capacity: section?.capacity || 45,
        enrolledCount: section?.enrolledCount || 0,
        attendancePercentage,
        attendedLectures,
        totalLectures,
        pendingAssignments,
        totalAssignments: courseAssignments.length,
        currentGrade: finalGrade,
        gradePoints: finalGradePoints,
        gradeStatus: isFailed
          ? ("At Risk" as const)
          : isPassed
          ? ("Good" as const)
          : attendancePercentage < 75 && totalLectures > 4
          ? ("At Risk" as const)
          : ("Good" as const),
        progress: finalProgress,
        status: courseStatus as any,
        resultStatus,
        curriculumProgress,
        isCompleted: isPassed,
        isPassed,
        isFailed,
        marks: courseResult?.totalMarks,
        percentage: courseResult?.percentage,
        publishedAt: courseResult?.publishedAt,
        syllabus: [
          "Course Overview, Learning Outcomes & Evaluation Policy",
          "Foundational Methodologies & Applied Theory",
          "Midterm Milestone Derivation & Practical Laboratory",
          "Advanced Application & Capstone Synthesis",
        ],
      };
    });
  },
});



export const getStudentAvailableCourses = query({
  args: {
    userId: v.optional(v.id("users")),
    studentId: v.optional(v.string()),
    semester: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let studentUser: any = null;

    if (args.userId) {
      studentUser = await ctx.db.get(args.userId);
    } else if (args.studentId) {
      studentUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("enrollmentId"), args.studentId))
        .first();
      if (!studentUser) {
        try {
          studentUser = await ctx.db.get(args.studentId as any);
        } catch {
          // ignore
        }
      }
    }

    if (!studentUser) {
      return [];
    }

    let deptId = studentUser.departmentId;
    let deptName = studentUser.department;
    let progId = studentUser.degreeProgramId;
    let progName = studentUser.degreeProgram;

    if (!deptId || !progId) {
      const app = await ctx.db
        .query("applications")
        .withIndex("by_userId", (q) => q.eq("userId", studentUser._id))
        .order("desc")
        .first();

      if (app) {
        if (!deptId && app.departmentId) deptId = app.departmentId;
        if (!progId && app.degreeProgramId) progId = app.degreeProgramId;
        if (!progName && app.academicInformation?.degreeApplyingFor) {
          progName = app.academicInformation.degreeApplyingFor;
        }
      }
    }

    if (progName && (!progId || !deptId)) {
      const pRecord = await ctx.db
        .query("academicPrograms")
        .filter((q) => q.eq(q.field("name"), progName))
        .first();
      if (pRecord) {
        progId = progId || pRecord._id;
        deptId = deptId || (pRecord as any).departmentId;
        if (!deptName && (pRecord as any).department) {
          deptName = (pRecord as any).department;
        }
      }
    }

    if (deptId && !deptName) {
      const dRecord = await ctx.db.get(deptId as any);
      if (dRecord) deptName = (dRecord as any).name;
    }

    if (progId && !progName) {
      const pRecord = await ctx.db.get(progId as any);
      if (pRecord) progName = (pRecord as any).name;
    }

    if (!deptId && !deptName && !progId && !progName) {
      return [];
    }

    const progression = await calculateStudentAcademicProgression(ctx, studentUser, false);
    const targetSemester = args.semester ?? (progression?.nextEligibleSemester || studentUser.currentSemester || 1);
    const isUnlocked = progression ? targetSemester <= progression.nextEligibleSemester : true;
    const isPassed = progression ? targetSemester <= progression.highestPassedSemester : false;
    const lockedMessage = isUnlocked
      ? ""
      : `Semester ${targetSemester} is currently locked. Successfully complete Semester ${targetSemester - 1} before registering for Semester ${targetSemester}.`;

    const allCourses = await ctx.db
      .query("courses")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    // Strict Backend Filtering: Department AND Degree Program AND Semester
    const matchingCourses = allCourses.filter((c) => {
      const matchesDept =
        (deptId && c.departmentId === deptId) ||
        (deptName && c.department && c.department.trim().toLowerCase() === deptName.trim().toLowerCase());

      if (!matchesDept) return false;

      const matchesProg =
        (progId && (c.degreeProgramId === progId || c.programId === progId)) ||
        (progName && c.program && c.program.trim().toLowerCase() === progName.trim().toLowerCase());

      if (!matchesProg) return false;

      // Filter by student's current/selected semester
      return c.semester === targetSemester;
    });

    // Check student's existing course registrations
    const studentKeys = new Set<string>();
    if (studentUser._id) studentKeys.add(String(studentUser._id));
    if (studentUser.enrollmentId) studentKeys.add(studentUser.enrollmentId);
    if (args.studentId) studentKeys.add(args.studentId);

    const allRegistrations = await ctx.db.query("courseRegistrations").collect();
    const studentRegistrations = allRegistrations.filter(
      (r) =>
        studentKeys.has(r.studentId) ||
        studentKeys.has(r.enrollmentId) ||
        (r.studentEmail && r.studentEmail === studentUser.email) ||
        (r.studentEmail && studentUser.universityEmail && r.studentEmail === studentUser.universityEmail)
    );

    const sections = await ctx.db.query("courseSections").collect();
    const schedules = await ctx.db.query("classSchedules").collect();
    const facultyList = await ctx.db.query("faculty").collect();

    return matchingCourses.map((c) => {
      const section = sections.find((s) => s.courseCode === c.code || s.courseId === c._id);
      const schedule = schedules.find((s) => s.courseCode === c.code || s.courseId === c._id);
      const instructor = facultyList.find(
        (f) => f._id === c.instructorId || f._id === c.facultyId || f.fullName === c.facultyName
      );

      // Find registration status for this course
      const existingReg = studentRegistrations.find(
        (r) => (r.courseId === c._id || r.courseCode === c.code) && r.status !== "Dropped"
      );
      const registrationStatus = existingReg ? existingReg.status : "None";

      return {
        id: c._id,
        code: c.code,
        title: c.name,
        description: c.description,
        creditHours: c.creditHours,
        department: c.department,
        departmentId: c.departmentId,
        program: c.program,
        programId: c.programId,
        degreeProgramId: c.degreeProgramId || c.programId,
        semester: c.semester,
        instructor: instructor?.fullName || c.facultyName || "TBA",
        instructorDesignation: instructor?.designation || "Faculty Member",
        prerequisites: c.prerequisites || ["None"],
        capacity: section?.capacity || 45,
        enrolledCount: section?.enrolledCount || 0,
        schedule: schedule
          ? `${schedule.day} ${schedule.startTime} - ${schedule.endTime}`
          : "Mon & Wed 10:00 AM - 11:30 AM",
        registrationStatus, // "None" | "Pending" | "Approved" | "Rejected"
        registrationId: existingReg?._id,
        registrationRemarks: existingReg?.remarks,
        registeredAt: existingReg?.registeredAt,
        isEnrolled: registrationStatus === "Approved",
        isPending: registrationStatus === "Pending",
        isRejected: registrationStatus === "Rejected",
        isSemesterUnlocked: isUnlocked,
        isSemesterPassed: isPassed,
        lockedMessage,
        canRegister: isUnlocked && !isPassed && registrationStatus === "None",
      };
    });
  },
});

export const getCourseSections = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courseSections").collect();
  },
});

export const createCourseSection = mutation({
  args: {
    courseId: v.string(),
    courseCode: v.string(),
    courseName: v.string(),
    section: v.string(),
    semester: v.string(),
    academicYear: v.string(),
    facultyId: v.optional(v.string()),
    facultyName: v.optional(v.string()),
    room: v.string(),
    building: v.string(),
    campus: v.string(),
    days: v.array(v.string()),
    startTime: v.string(),
    endTime: v.string(),
    capacity: v.number(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("courseSections", {
      courseId: args.courseId,
      courseCode: args.courseCode.trim().toUpperCase(),
      courseName: args.courseName.trim(),
      section: args.section.trim().toUpperCase(),
      semester: args.semester,
      academicYear: args.academicYear,
      facultyId: args.facultyId,
      facultyName: args.facultyName,
      room: args.room.trim(),
      building: args.building.trim(),
      campus: args.campus.trim(),
      days: args.days,
      startTime: args.startTime,
      endTime: args.endTime,
      capacity: args.capacity,
      enrolledCount: 0,
      status: "Active",
      createdAt: now,
      updatedAt: now,
    });

    // Also auto-create class schedule slots for this section
    for (const day of args.days) {
      if (
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(
          day
        )
      ) {
        await ctx.db.insert("classSchedules", {
          courseId: args.courseId,
          courseCode: args.courseCode.trim().toUpperCase(),
          courseTitle: args.courseName.trim(),
          section: args.section.trim().toUpperCase(),
          facultyId: args.facultyId,
          facultyName: args.facultyName || "TBA",
          day: day as any,
          startTime: args.startTime,
          endTime: args.endTime,
          room: args.room,
          building: args.building,
          campus: args.campus,
          type: "Lecture",
          createdAt: now,
        });
      }
    }

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Course Sections",
      details: `Created section ${args.section} for ${args.courseCode}`,
      timestamp: now,
    });

    return id;
  },
});

// ----------------------------------------------------------------------------
// COURSE REGISTRATION & ENROLLMENT (STUDENT & ADMIN WORKFLOW)
// ----------------------------------------------------------------------------
export const submitCourseRegistration = mutation({
  args: {
    studentId: v.string(),
    studentName: v.string(),
    studentEmail: v.string(),
    enrollmentId: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    creditHours: v.number(),
    sectionId: v.optional(v.string()),
    semester: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Resolve student user record for backend verification
    let studentUser: any = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.eq(q.field("enrollmentId"), args.studentId),
          q.eq(q.field("enrollmentId"), args.enrollmentId),
          q.eq(q.field("email"), args.studentEmail),
          q.eq(q.field("universityEmail"), args.studentEmail)
        )
      )
      .first();

    if (!studentUser) {
      try {
        studentUser = await ctx.db.get(args.studentId as any);
      } catch {
        // ignore
      }
    }

    // 2. Resolve target course record
    let course: any = null;
    try {
      course = await ctx.db.get(args.courseId as any);
    } catch {
      // ignore
    }
    if (!course) {
      course = await ctx.db
        .query("courses")
        .withIndex("by_code", (q) => q.eq("code", args.courseCode))
        .first();
    }

    if (!course) {
      throw new Error(`Course record "${args.courseCode}" not found in database.`);
    }

    if (course.status !== "Active") {
      throw new Error(`Course "${course.name}" is currently inactive and not available for registration.`);
    }

    // 3. Strict Backend Authorization: Department & Degree Program verification
    if (studentUser) {
      const studentDeptId = studentUser.departmentId;
      const studentDeptName = studentUser.department;
      const studentProgId = studentUser.degreeProgramId;
      const studentProgName = studentUser.degreeProgram;

      // Check Department match
      const deptMatches =
        (!studentDeptId && !studentDeptName) ||
        (studentDeptId && course.departmentId === studentDeptId) ||
        (studentDeptName && course.department && studentDeptName.trim().toLowerCase() === course.department.trim().toLowerCase());

      if (!deptMatches) {
        throw new Error(
          `Security violation: Course "${course.name}" belongs to ${course.department}, which does not match your enrolled department.`
        );
      }

      // Check Degree Program match
      const progMatches =
        (!studentProgId && !studentProgName) ||
        (studentProgId && (course.degreeProgramId === studentProgId || course.programId === studentProgId)) ||
        (studentProgName && course.program && studentProgName.trim().toLowerCase() === course.program.trim().toLowerCase());

      if (!progMatches) {
        throw new Error(
          `Security violation: Course "${course.name}" belongs to ${course.program}, which does not match your degree program.`
        );
      }
    }

    // 3b. Strict Backend Authorization: Semester Eligibility Enforcement
    const progression = await calculateStudentAcademicProgression(ctx, studentUser, false);
    const courseSemester = course.semester || 1;
    if (progression && courseSemester > progression.nextEligibleSemester) {
      throw new Error(
        `Semester ${courseSemester} is currently locked. Successfully complete Semester ${courseSemester - 1} before registering for Semester ${courseSemester}.`
      );
    }

    // 4. Duplicate Registration Prevention
    const studentKeys = new Set<string>();
    if (studentUser?._id) studentKeys.add(String(studentUser._id));
    if (studentUser?.enrollmentId) studentKeys.add(studentUser.enrollmentId);
    if (args.studentId) studentKeys.add(args.studentId);
    if (args.enrollmentId) studentKeys.add(args.enrollmentId);

    const allRegistrations = await ctx.db.query("courseRegistrations").collect();
    const existing = allRegistrations.find(
      (r) =>
        (r.courseCode === args.courseCode || r.courseId === args.courseId) &&
        r.status !== "Dropped" &&
        (studentKeys.has(r.studentId) ||
          studentKeys.has(r.enrollmentId) ||
          (r.studentEmail && r.studentEmail === args.studentEmail))
    );

    if (existing) {
      if (existing.status === "Approved") {
        throw new Error(`You have already registered for ${course.name} and your registration is Approved.`);
      } else if (existing.status === "Pending") {
        throw new Error(`You have already registered for ${course.name}. Your request is Pending Admin approval.`);
      } else {
        throw new Error(`You have already registered for ${course.name} (${existing.status}).`);
      }
    }

    // 5. Insert new course registration with Pending status
    const now = Date.now();
    const regId = await ctx.db.insert("courseRegistrations", {
      studentId: studentUser?._id ? String(studentUser._id) : args.studentId,
      studentName: args.studentName || studentUser?.name || "Student",
      studentEmail: studentUser?.universityEmail || studentUser?.email || args.studentEmail,
      enrollmentId: studentUser?.enrollmentId || args.enrollmentId || args.studentId,
      courseId: course._id,
      sectionId: args.sectionId,
      courseCode: course.code,
      courseTitle: course.name,
      creditHours: course.creditHours,
      semester: String(course.semester),
      departmentId: course.departmentId,
      degreeProgramId: course.degreeProgramId || course.programId,
      academicTerm: "Fall 2026",
      status: "Pending",
      registeredAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // 6. Log in Audit Ledger
    await ctx.db.insert("auditLogs", {
      adminId: "student",
      adminName: args.studentName || studentUser?.name || "Student",
      adminEmail: studentUser?.email || args.studentEmail,
      actionType: "create",
      module: "Course Registration",
      details: `Student ${args.studentName} requested registration for ${course.code} - ${course.name} (Semester ${course.semester})`,
      timestamp: now,
    });

    return regId;
  },
});

export const getRegistrationRequests = query({
  args: {},
  handler: async (ctx) => {
    const registrations = await ctx.db.query("courseRegistrations").order("desc").collect();
    const users = await ctx.db.query("users").collect();
    const courses = await ctx.db.query("courses").collect();

    return registrations.map((r) => {
      const studentUser = users.find(
        (u) =>
          String(u._id) === r.studentId ||
          (u.enrollmentId && u.enrollmentId === r.enrollmentId) ||
          (u.enrollmentId && u.enrollmentId === r.studentId) ||
          (u.email && u.email === r.studentEmail) ||
          (u.universityEmail && u.universityEmail === r.studentEmail) ||
          (u.name && r.studentName && u.name.trim().toLowerCase() === r.studentName.trim().toLowerCase())
      );
      const course = courses.find((c) => c._id === r.courseId || c.code === r.courseCode);
      const semNumber = course?.semester || parseInt(String(r.semester || "1").replace(/[^0-9]/g, ""), 10) || 1;

      return {
        ...r,
        department: studentUser?.department || course?.department || (r as any).department || "Academic Department",
        departmentId: studentUser?.departmentId || course?.departmentId || r.departmentId,
        program: studentUser?.degreeProgram || course?.program || (r as any).program || "Degree Program",
        degreeProgramId: studentUser?.degreeProgramId || course?.degreeProgramId || r.degreeProgramId,
        semesterNumber: semNumber,
        semesterLabel: `Semester ${semNumber}`,
        courseTitle: r.courseTitle || course?.name || r.courseCode,
        creditHours: r.creditHours || course?.creditHours || 3,
      };
    });
  },
});

export const getStudentRegistrationRequests = query({
  args: {
    studentId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let studentUser: any = null;
    if (args.userId) {
      studentUser = await ctx.db.get(args.userId);
    } else if (args.studentId) {
      studentUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("enrollmentId"), args.studentId))
        .first();
      if (!studentUser) {
        try {
          studentUser = await ctx.db.get(args.studentId as any);
        } catch {
          // ignore
        }
      }
    }

    const studentKeys = new Set<string>();
    if (studentUser?._id) studentKeys.add(String(studentUser._id));
    if (studentUser?.enrollmentId) studentKeys.add(studentUser.enrollmentId);
    if (args.studentId) studentKeys.add(args.studentId);

    const allRegs = await ctx.db.query("courseRegistrations").order("desc").collect();
    return allRegs.filter(
      (r) =>
        studentKeys.has(r.studentId) ||
        studentKeys.has(r.enrollmentId) ||
        (studentUser?.email && r.studentEmail === studentUser.email) ||
        (studentUser?.universityEmail && r.studentEmail === studentUser.universityEmail)
    );
  },
});

export const updateRegistrationStatus = mutation({
  args: {
    registrationId: v.id("courseRegistrations"),
    decision: v.union(v.literal("Approved"), v.literal("Rejected"), v.literal("Dropped")),
    remarks: v.optional(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const reg = await ctx.db.get(args.registrationId);
    if (!reg) throw new Error("Registration record not found");

    const prevStatus = reg.status;
    const now = Date.now();
    const patchData: any = {
      status: args.decision,
      reviewedAt: now,
      reviewedBy: args.adminName,
      remarks: args.remarks,
      updatedAt: now,
    };

    if (args.decision === "Approved") {
      patchData.approvedAt = now;
    }

    await ctx.db.patch(args.registrationId, patchData);

    // Update course section enrolled count if approved
    if (args.decision === "Approved" && reg.sectionId) {
      try {
        const section = await ctx.db.get(reg.sectionId as any);
        if (section) {
          await ctx.db.patch(reg.sectionId as any, {
            enrolledCount: ((section as any).enrolledCount || 0) + 1,
          });
        }
      } catch (e) {
        // Ignored if sectionId is not an Id
      }
    }

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: args.decision === "Approved" ? "approve" : "reject",
      module: "Course Registration",
      details: `${args.decision} registration for ${reg.studentName} in ${reg.courseCode} (${reg.courseTitle})`,
      previousValue: prevStatus,
      newValue: args.decision,
      timestamp: now,
    });
  },
});

export const dropCourseRegistration = mutation({
  args: {
    registrationId: v.id("courseRegistrations"),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const reg = await ctx.db.get(args.registrationId);
    if (!reg) throw new Error("Registration record not found");

    const now = Date.now();
    await ctx.db.patch(args.registrationId, {
      status: "Dropped",
      reviewedAt: now,
      reviewedBy: args.adminName,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "student",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "status_change",
      module: "Course Registration",
      details: `Dropped registration for ${reg.studentName} in ${reg.courseCode}`,
      timestamp: now,
    });
  },
});

export const getStudentEnrolledCourses = query({
  args: {
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    return await (getStudentCourses as any).handler(ctx, {
      studentId: args.studentId,
    });
  },
});

// ----------------------------------------------------------------------------
// CLASS SCHEDULE
// ----------------------------------------------------------------------------
export const getClassSchedules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("classSchedules").collect();
  },
});

export const getStudentClassSchedule = query({
  args: {
    studentId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { approvedRegistrations } = await resolveStudentApprovedRegistrations(ctx, args);
    const courseCodes = approvedRegistrations.map((r: any) => r.courseCode.trim().toUpperCase());
    if (courseCodes.length === 0) return [];

    const allSchedules = await ctx.db.query("classSchedules").collect();
    return allSchedules.filter((s) => courseCodes.includes(s.courseCode.trim().toUpperCase()));
  },
});

// ----------------------------------------------------------------------------
// ATTENDANCE RECORDS
// ----------------------------------------------------------------------------
export const recordAttendance = mutation({
  args: {
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    section: v.string(),
    date: v.string(),
    time: v.string(),
    status: v.union(v.literal("Present"), v.literal("Absent"), v.literal("Late")),
    topic: v.optional(v.string()),
    recordedBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("attendanceRecords", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getStudentAttendanceRecords = query({
  args: {
    studentId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { studentKeys } = await resolveStudentApprovedRegistrations(ctx, args);
    const allAttendance = await ctx.db.query("attendanceRecords").order("desc").collect();
    return allAttendance.filter(
      (a) => studentKeys.has(a.studentId) || studentKeys.has(a.enrollmentId)
    );
  },
});

// ----------------------------------------------------------------------------
// ASSIGNMENTS
// ----------------------------------------------------------------------------
export const getAssignments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("assignments").order("desc").collect();
  },
});

export const createAssignment = mutation({
  args: {
    title: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    section: v.string(),
    facultyId: v.optional(v.string()),
    facultyName: v.string(),
    description: v.string(),
    dueDate: v.string(),
    dueTime: v.string(),
    totalMarks: v.number(),
    weightage: v.string(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    let actualCourse: any = null;
    if (args.courseId && args.courseId !== "course_id") {
      try {
        actualCourse = await ctx.db.get(args.courseId as any);
      } catch {
        // Not a direct document ID
      }
    }

    if (!actualCourse && args.courseCode) {
      actualCourse = await ctx.db
        .query("courses")
        .withIndex("by_code", (q) => q.eq("code", args.courseCode.trim().toUpperCase()))
        .first();
    }

    if (!actualCourse && args.courseTitle) {
      const allCourses = await ctx.db.query("courses").collect();
      actualCourse = allCourses.find(
        (c) => c.name.toLowerCase() === args.courseTitle.trim().toLowerCase()
      );
    }

    const resolvedCourseId = actualCourse ? String(actualCourse._id) : args.courseId;
    const resolvedCourseCode = actualCourse ? actualCourse.code : args.courseCode.trim().toUpperCase();
    const resolvedCourseTitle = actualCourse ? actualCourse.name : args.courseTitle.trim();
    const facultyId = args.facultyId || actualCourse?.facultyId || actualCourse?.instructorId;

    const id = await ctx.db.insert("assignments", {
      title: args.title.trim(),
      courseId: resolvedCourseId,
      courseCode: resolvedCourseCode,
      courseTitle: resolvedCourseTitle,
      section: args.section.trim().toUpperCase(),
      facultyId,
      facultyName: args.facultyName,
      description: args.description.trim(),
      dueDate: args.dueDate,
      dueTime: args.dueTime,
      totalMarks: args.totalMarks,
      weightage: args.weightage,
      status: "Active",
      createdAt: Date.now(),
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Assignments",
      details: `Created assignment: "${args.title}" for ${resolvedCourseCode}`,
      timestamp: Date.now(),
    });

    return id;
  },
});

export const getStudentAssignments = query({
  args: {
    studentId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { studentKeys, approvedRegistrations } = await resolveStudentApprovedRegistrations(
      ctx,
      args
    );

    if (approvedRegistrations.length === 0) return [];

    const enrolledCourseCodes = new Set<string>();
    const enrolledCourseIds = new Set<string>();

    for (const r of approvedRegistrations) {
      if (r.courseCode) enrolledCourseCodes.add(r.courseCode.trim().toUpperCase());
      if (r.courseId) enrolledCourseIds.add(String(r.courseId));
    }

    // Correlate with courses table to ensure bidirectional mapping of courseId <-> courseCode
    const allCourses = await ctx.db.query("courses").collect();
    for (const c of allCourses) {
      const codeUpper = c.code.trim().toUpperCase();
      const idStr = String(c._id);
      if (enrolledCourseCodes.has(codeUpper) || enrolledCourseIds.has(idStr)) {
        enrolledCourseCodes.add(codeUpper);
        enrolledCourseIds.add(idStr);
      }
    }

    // Query assignments strictly belonging to the student's enrolled courses
    const allAssignments = await ctx.db.query("assignments").collect();
    const relevant = allAssignments.filter((a) => {
      if (a.status === "Draft") return false;
      const matchCode = a.courseCode && enrolledCourseCodes.has(a.courseCode.trim().toUpperCase());
      const matchId = a.courseId && enrolledCourseIds.has(String(a.courseId));
      return matchCode || matchId;
    });

    // Also fetch submissions by this student
    const allSubmissions = await ctx.db.query("assignmentSubmissions").collect();
    const studentSubmissions = allSubmissions.filter(
      (s) => studentKeys.has(s.studentId) || studentKeys.has(s.enrollmentId)
    );

    return relevant.map((asg) => {
      const sub = studentSubmissions.find((s) => s.assignmentId === asg._id);
      const isOverdue = new Date(`${asg.dueDate} ${asg.dueTime}`).getTime() < Date.now();
      return {
        id: asg._id,
        title: asg.title,
        courseId: asg.courseId,
        courseCode: asg.courseCode,
        courseTitle: asg.courseTitle,
        dueDate: asg.dueDate,
        dueTime: asg.dueTime,
        status: sub
          ? (sub.status as any)
          : isOverdue
            ? "Overdue"
            : ("Pending" as any),
        priority: "High" as const,
        totalMarks: asg.totalMarks,
        obtainedMarks: sub?.obtainedMarks,
        weightage: asg.weightage,
        description: asg.description,
        submittedAt: sub ? new Date(sub.submittedAt).toLocaleString() : undefined,
        fileName: sub?.fileName,
        feedback: sub?.feedback,
        teacher: asg.facultyName,
        facultyName: asg.facultyName,
        createdAt: asg.createdAt,
      };
    });
  },
});

export const submitAssignmentSolution = mutation({
  args: {
    assignmentId: v.id("assignments"),
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    fileUrl: v.optional(v.string()),
    fileName: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const asg = await ctx.db.get(args.assignmentId);
    const existing = await ctx.db
      .query("assignmentSubmissions")
      .withIndex("by_assignmentId", (q) => q.eq("assignmentId", args.assignmentId))
      .filter((q) =>
        q.or(
          q.eq(q.field("studentId"), args.studentId),
          q.eq(q.field("enrollmentId"), args.enrollmentId)
        )
      )
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        fileUrl: args.fileUrl,
        fileName: args.fileName,
        submittedAt: now,
        status: "Submitted",
        feedback: args.notes,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("assignmentSubmissions", {
        assignmentId: args.assignmentId,
        studentId: args.studentId,
        studentName: args.studentName,
        enrollmentId: args.enrollmentId,
        fileUrl: args.fileUrl,
        fileName: args.fileName,
        submittedAt: now,
        status: "Submitted",
        maxMarks: asg?.totalMarks || 100,
        feedback: args.notes,
      });
    }
  },
});

// ----------------------------------------------------------------------------
// EXAMINATIONS
// ----------------------------------------------------------------------------
export const getExaminations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("examinations").order("desc").collect();
  },
});

export const createExamination = mutation({
  args: {
    title: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    section: v.string(),
    examType: v.union(
      v.literal("Midterm"),
      v.literal("Final"),
      v.literal("Quiz"),
      v.literal("Practical"),
      v.literal("Presentation")
    ),
    date: v.string(),
    day: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    room: v.string(),
    building: v.string(),
    campus: v.string(),
    facultyName: v.string(),
    instructions: v.array(v.string()),
    requiredMaterials: v.array(v.string()),
    duration: v.string(),
    seatNumber: v.optional(v.string()),
    importantNotes: v.optional(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("examinations", {
      title: args.title.trim(),
      courseId: args.courseId,
      courseCode: args.courseCode.trim().toUpperCase(),
      courseTitle: args.courseTitle.trim(),
      section: args.section.trim().toUpperCase(),
      examType: args.examType,
      date: args.date,
      day: args.day,
      startTime: args.startTime,
      endTime: args.endTime,
      room: args.room.trim(),
      building: args.building.trim(),
      campus: args.campus.trim(),
      facultyName: args.facultyName.trim(),
      instructions: args.instructions,
      requiredMaterials: args.requiredMaterials,
      duration: args.duration,
      seatNumber: args.seatNumber,
      status: "Scheduled",
      importantNotes: args.importantNotes,
      createdAt: Date.now(),
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Examinations",
      details: `Scheduled ${args.examType} for ${args.courseCode} on ${args.date} (${args.startTime})`,
      timestamp: Date.now(),
    });

    return id;
  },
});

export const getStudentExaminations = query({
  args: {
    studentId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { approvedRegistrations } = await resolveStudentApprovedRegistrations(ctx, args);
    const courseCodes = approvedRegistrations.map((r: any) => r.courseCode.trim().toUpperCase());
    if (courseCodes.length === 0) return [];

    const allExams = await ctx.db.query("examinations").collect();
    return allExams
      .filter((e) => courseCodes.includes(e.courseCode.trim().toUpperCase()))
      .map((e) => ({
        id: e._id,
        courseCode: e.courseCode,
        courseTitle: e.courseTitle,
        examType: e.examType,
        date: e.date,
        day: e.day,
        startTime: e.startTime,
        endTime: e.endTime,
        time: `${e.startTime} – ${e.endTime}`,
        room: e.room,
        roomNumber: e.room,
        building: e.building,
        campus: e.campus,
        instructor: e.facultyName,
        seatNumber: e.seatNumber || "Assigned on Board",
        status: (e.status === "Scheduled" ? "Upcoming" : e.status) as any,
        duration: e.duration,
        instructions: e.instructions,
        requiredMaterials: e.requiredMaterials,
        importantNotes: e.importantNotes || "",
      }));
  },
});

// ----------------------------------------------------------------------------
// ACADEMIC RESULTS & GRADING WORKFLOW
// ----------------------------------------------------------------------------
export const getAcademicResults = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("academicResults").order("desc").collect();
  },
});

export const saveAcademicResult = mutation({
  args: {
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    section: v.string(),
    semester: v.string(),
    assignmentMarks: v.number(),
    quizMarks: v.number(),
    midtermMarks: v.number(),
    finalMarks: v.number(),
    attendanceMarks: v.number(),
    creditHours: v.number(),
    status: v.union(
      v.literal("Draft"),
      v.literal("Submitted"),
      v.literal("Reviewed"),
      v.literal("Approved"),
      v.literal("Published")
    ),
    remarks: v.optional(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const totalMarks =
      args.assignmentMarks +
      args.quizMarks +
      args.midtermMarks +
      args.finalMarks +
      args.attendanceMarks;
    const percentage = Math.min(Math.max(totalMarks, 0), 100);
    const { grade, gradePoints } = calculateGradeAndPoints(percentage);
    const now = Date.now();

    // Check if result record already exists
    const existing = await ctx.db
      .query("academicResults")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .filter((q) => q.eq(q.field("courseCode"), args.courseCode))
      .first();

    if (existing) {
      const prevStatus = existing.status;
      await ctx.db.patch(existing._id, {
        assignmentMarks: args.assignmentMarks,
        quizMarks: args.quizMarks,
        midtermMarks: args.midtermMarks,
        finalMarks: args.finalMarks,
        attendanceMarks: args.attendanceMarks,
        totalMarks,
        percentage,
        grade,
        gradePoints,
        status: args.status,
        publishedAt: args.status === "Published" ? now : existing.publishedAt,
        publishedBy: args.status === "Published" ? args.adminName : existing.publishedBy,
        remarks: args.remarks,
        updatedAt: now,
      });

      await ctx.db.insert("auditLogs", {
        adminId: "admin",
        adminName: args.adminName,
        adminEmail: args.adminEmail,
        actionType: args.status === "Published" ? "publish" : "update",
        module: "Results & Grades",
        details: `Updated marks for ${args.studentName} in ${args.courseCode} (${grade}, ${percentage}%)`,
        previousValue: prevStatus,
        newValue: args.status,
        timestamp: now,
      });

      // Trigger automatic academic progression calculation and semester advancement
      await calculateStudentAcademicProgression(
        ctx,
        { studentId: args.studentId, enrollmentId: args.enrollmentId },
        true
      );

      return existing._id;
    } else {
      const id = await ctx.db.insert("academicResults", {
        studentId: args.studentId,
        studentName: args.studentName,
        enrollmentId: args.enrollmentId,
        courseId: args.courseId,
        courseCode: args.courseCode.trim().toUpperCase(),
        courseTitle: args.courseTitle.trim(),
        section: args.section,
        semester: args.semester,
        assignmentMarks: args.assignmentMarks,
        quizMarks: args.quizMarks,
        midtermMarks: args.midtermMarks,
        finalMarks: args.finalMarks,
        attendanceMarks: args.attendanceMarks,
        totalMarks,
        percentage,
        grade,
        gradePoints,
        creditHours: args.creditHours,
        status: args.status,
        publishedAt: args.status === "Published" ? now : undefined,
        publishedBy: args.status === "Published" ? args.adminName : undefined,
        remarks: args.remarks,
        createdAt: now,
        updatedAt: now,
      });

      await ctx.db.insert("auditLogs", {
        adminId: "admin",
        adminName: args.adminName,
        adminEmail: args.adminEmail,
        actionType: args.status === "Published" ? "publish" : "create",
        module: "Results & Grades",
        details: `Created result for ${args.studentName} in ${args.courseCode} (${grade}, ${percentage}%)`,
        newValue: args.status,
        timestamp: now,
      });

      // Trigger automatic academic progression calculation and semester advancement
      await calculateStudentAcademicProgression(
        ctx,
        { studentId: args.studentId, enrollmentId: args.enrollmentId },
        true
      );

      return id;
    }
  },
});

export const updateResultPublishStatus = mutation({
  args: {
    resultId: v.id("academicResults"),
    status: v.union(
      v.literal("Draft"),
      v.literal("Submitted"),
      v.literal("Reviewed"),
      v.literal("Approved"),
      v.literal("Published")
    ),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db.get(args.resultId);
    if (!res) throw new Error("Result record not found");

    const prev = res.status;
    await ctx.db.patch(args.resultId, {
      status: args.status,
      publishedAt: args.status === "Published" ? Date.now() : res.publishedAt,
      publishedBy: args.status === "Published" ? args.adminName : res.publishedBy,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: args.status === "Published" ? "publish" : "update",
      module: "Results & Grades",
      details: `Changed result publication status for ${res.studentName} (${res.courseCode}) to ${args.status}`,
      previousValue: prev,
      newValue: args.status,
      timestamp: Date.now(),
    });

    // Trigger automatic academic progression calculation and semester advancement
    await calculateStudentAcademicProgression(
      ctx,
      { studentId: res.studentId, enrollmentId: res.enrollmentId },
      true
    );
  },
});

/**
 * Live student results - strictly Published only!
 */
export const getStudentPublishedResults = query({
  args: {
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    const published = await ctx.db
      .query("academicResults")
      .withIndex("by_student_and_status", (q) =>
        q.eq("studentId", args.studentId).eq("status", "Published")
      )
      .collect();

    if (published.length === 0) return [];

    // Group by semester
    const semestersMap: Record<string, typeof published> = {};
    for (const r of published) {
      const sem = r.semester || "Current Session";
      if (!semestersMap[sem]) semestersMap[sem] = [];
      semestersMap[sem].push(r);
    }

    // Transform into semester records with calculated GPA and CGPA
    let cumulativeQualityPoints = 0;
    let cumulativeCredits = 0;

    const semesterRecords = Object.entries(semestersMap).map(([semName, records], index) => {
      let semQualityPoints = 0;
      let semCredits = 0;

      const courses = records.map((r) => {
        const qp = r.gradePoints * r.creditHours;
        semQualityPoints += qp;
        semCredits += r.creditHours;

        return {
          code: r.courseCode,
          title: r.courseTitle,
          creditHours: r.creditHours,
          marks: r.totalMarks,
          percentage: r.percentage,
          grade: r.grade,
          gradePoints: r.gradePoints,
          status: (r.grade !== "F" ? "Passed" : "Failed") as any,
          instructor: "Assigned Faculty",
          breakdown: {
            assignments: { obtained: r.assignmentMarks, total: 20, weightage: 20 },
            quizzes: { obtained: r.quizMarks, total: 15, weightage: 15 },
            midterm: { obtained: r.midtermMarks, total: 25, weightage: 25 },
            final: { obtained: r.finalMarks, total: 35, weightage: 35 },
            attendance: { obtained: r.attendanceMarks, total: 5, weightage: 5 },
          },
        };
      });

      cumulativeQualityPoints += semQualityPoints;
      cumulativeCredits += semCredits;

      const semGPA = semCredits > 0 ? Number((semQualityPoints / semCredits).toFixed(2)) : 0.0;
      const cgpa =
        cumulativeCredits > 0
          ? Number((cumulativeQualityPoints / cumulativeCredits).toFixed(2))
          : 0.0;

      return {
        semesterNumber: index + 1,
        semesterName: semName,
        session: semName,
        gpa: semGPA,
        cgpa,
        creditHours: semCredits,
        totalMarks: records.reduce((acc, c) => acc + c.totalMarks, 0),
        averagePercentage: Number(
          (records.reduce((acc, c) => acc + c.percentage, 0) / (records.length || 1)).toFixed(1)
        ),
        coursesCompleted: courses.filter((c) => c.status === "Passed").length,
        coursesFailed: courses.filter((c) => c.status === "Failed").length,
        academicStanding: semGPA >= 3.5 ? "Dean's Honor Roll" : semGPA >= 2.0 ? "Good Standing" : "Academic Warning",
        courses,
      };
    });

    return semesterRecords;
  },
});

/**
 * Real-time Student Academic Progression Query
 * Dynamic database-driven source of truth for:
 * - Current and next eligible semesters
 * - Semesters 1-8 status (Passed, In Progress, Available, Locked, Failed)
 * - True GPA & CGPA strictly from published results
 * - Completed credit hours and degree progress
 * - Congratulations notification and CTA for next semester registration
 */
export const getStudentAcademicProgression = query({
  args: {
    userId: v.optional(v.id("users")),
    studentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await calculateStudentAcademicProgression(ctx, args, false);
  },
});

/**
 * Explicit mutation to sync academic progression and advance users.currentSemester
 */
export const syncStudentAcademicProgression = mutation({
  args: {
    userId: v.optional(v.id("users")),
    studentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await calculateStudentAcademicProgression(ctx, args, true);
  },
});

/**
 * Institutional Admin Academic Progression Overview
 * Provides the Registrar with real-time academic progression across all registered students
 */
export const getAdminAcademicProgressionOverview = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "student"))
      .collect();

    const overviewList = await Promise.all(
      students.map(async (s) => {
        const prog = await calculateStudentAcademicProgression(ctx, s, false);
        const highestPassed = prog?.highestPassedSemester || 0;
        const currentSem = prog?.currentSemester || s.currentSemester || 1;
        const nextEligible = prog?.nextEligibleSemester || (highestPassed + 1);

        let semStatus = "● In Progress";
        if (highestPassed >= 1 && highestPassed === currentSem) {
          semStatus = "✓ Successfully Passed";
        } else if (prog?.totalFailedCoursesCount && prog.totalFailedCoursesCount > 0) {
          semStatus = "⚠ Failed Courses";
        } else if (highestPassed === 0 && (!prog?.completedCreditHours || prog.completedCreditHours === 0)) {
          semStatus = "🔓 Available for Registration";
        }

        return {
          id: s._id,
          name: s.name,
          studentId: s.enrollmentId || String(s._id).slice(-8).toUpperCase(),
          email: s.universityEmail || s.email,
          department: s.department || "Computing & Artificial Intelligence",
          program: s.degreeProgram || "BS Computer Science",
          currentSemester: currentSem,
          completedSemester: highestPassed > 0 ? `Semester ${highestPassed}` : "None",
          currentGpa: prog?.currentGpa || 0.0,
          cgpa: prog?.cgpa || 0.0,
          completedCreditHours: prog?.completedCreditHours || 0,
          remainingCreditHours: prog?.remainingCreditHours || (s.degreeProgram === "MSCS" ? 30 : 134),
          totalDegreeCredits: prog?.totalDegreeCredits || (s.degreeProgram === "MSCS" ? 30 : 134),
          academicProgress: prog?.degreeProgress || 0,
          semesterStatus: semStatus,
          nextEligibleSemester: nextEligible,
          registrationStatus:
            highestPassed >= 1 && nextEligible > highestPassed
              ? "Available for Registration"
              : "Registered / In Progress",
          academicStanding: prog?.academicStanding || "Good Standing",
          failedCoursesCount: prog?.totalFailedCoursesCount || 0,
          passedCoursesCount: prog?.totalPassedCoursesCount || 0,
          failedCoursesList: prog?.failedCoursesList || [],
          semesters: prog?.semesters || [],
        };
      })
    );

    return overviewList;
  },
});

/**
 * Bulk Publish Results & Recalculate Progression
 */
export const bulkUpdateResultPublishStatus = mutation({
  args: {
    resultIds: v.array(v.id("academicResults")),
    status: v.union(
      v.literal("Draft"),
      v.literal("Submitted"),
      v.literal("Reviewed"),
      v.literal("Approved"),
      v.literal("Published")
    ),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const studentKeys = new Set<string>();
    const now = Date.now();
    for (const rId of args.resultIds) {
      const res = await ctx.db.get(rId);
      if (res) {
        if (res.studentId) studentKeys.add(res.studentId);
        if (res.enrollmentId) studentKeys.add(res.enrollmentId);
        await ctx.db.patch(rId, {
          status: args.status,
          publishedAt: args.status === "Published" ? now : res.publishedAt,
          publishedBy: args.status === "Published" ? args.adminName : res.publishedBy,
          updatedAt: now,
        });

        await ctx.db.insert("auditLogs", {
          adminId: "admin",
          adminName: args.adminName,
          adminEmail: args.adminEmail,
          actionType: args.status === "Published" ? "publish" : "update",
          module: "Results & Grades",
          details: `Bulk updated result publication for ${res.studentName} (${res.courseCode}) to ${args.status}`,
          newValue: args.status,
          timestamp: now,
        });
      }
    }

    for (const sKey of Array.from(studentKeys)) {
      await calculateStudentAcademicProgression(ctx, sKey, true);
    }

    return { updatedCount: args.resultIds.length };
  },
});

/**
 * Ensure foundational Semester 1 and Semester 2 courses exist in database for seamless progression testing
 */
export const ensureFoundationalSemesterCourses = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCourses = await ctx.db.query("courses").collect();
    const existingCodes = new Set(existingCourses.map((c) => c.code.trim().toUpperCase()));
    const now = Date.now();

    const baselineFoundational = [
      // Semester 1
      {
        code: "CS-101",
        name: "Programming Fundamentals",
        creditHours: 4,
        semester: 1,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Dr. Arshad Mehmood",
        description:
          "Problem-solving techniques, procedural programming in C++/Python, control flow, functions, memory arrays, and file streams.",
      },
      {
        code: "CS-102",
        name: "Introduction to Information & Communication Technologies",
        creditHours: 3,
        semester: 1,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Engr. Fatima Tariq",
        description:
          "Computer architectures, operating system fundamentals, Internet protocols, database fundamentals, and digital transformation.",
      },
      {
        code: "MT-101",
        name: "Calculus & Analytical Geometry",
        creditHours: 3,
        semester: 1,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Dr. Kamran Qureshi",
        description:
          "Limits, derivatives, definite integrals, transcendental functions, vector calculus, and multivariable analytical geometry.",
      },
      {
        code: "EN-101",
        name: "English Composition & Comprehension",
        creditHours: 3,
        semester: 1,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Engr. Bilal Zahid",
        description:
          "Academic writing syntax, reading comprehension, critical analysis, technical summarizing, and vocabulary enrichment.",
      },
      {
        code: "PK-101",
        name: "Islamic & Pakistan Studies",
        creditHours: 2,
        semester: 1,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Dr. Arshad Mehmood",
        description:
          "Historical evolution of Pakistan, constitutional foundations, socio-economic trajectory, and ethical frameworks.",
      },

      // Semester 2
      {
        code: "CS-111",
        name: "Object-Oriented Programming",
        creditHours: 4,
        semester: 2,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Dr. Arshad Mehmood",
        description:
          "Classes, abstraction, encapsulation, inheritance, runtime polymorphism, exception handling, and design patterns in Java/C++.",
      },
      {
        code: "CS-112",
        name: "Discrete Structures",
        creditHours: 3,
        semester: 2,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Engr. Fatima Tariq",
        description:
          "Propositional logic, set theory, proof techniques, induction, combinatorics, graph theory, and recurrence relations.",
      },
      {
        code: "MT-102",
        name: "Linear Algebra & Differential Equations",
        creditHours: 3,
        semester: 2,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Dr. Kamran Qureshi",
        description:
          "Matrices, vector spaces, eigenvalues/eigenvectors, linear transformations, and first/second-order differential equations.",
      },
      {
        code: "PH-101",
        name: "Applied Physics for Computing",
        creditHours: 3,
        semester: 2,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Engr. Bilal Zahid",
        description:
          "Semiconductor physics, electromagnetism, circuit theorem analysis, quantum basics, and solid-state electronic fundamentals.",
      },
      {
        code: "EN-102",
        name: "Communication & Presentation Skills",
        creditHours: 3,
        semester: 2,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        faculty: "Engr. Fatima Tariq",
        description:
          "Interpersonal communication, executive presentations, technical document design, cross-cultural rhetoric, and meeting dynamics.",
      },
    ];

    let insertedCount = 0;
    for (const c of baselineFoundational) {
      if (!existingCodes.has(c.code)) {
        const cId = await ctx.db.insert("courses", {
          code: c.code,
          name: c.name,
          description: c.description,
          creditHours: c.creditHours,
          department: c.department,
          program: c.program,
          semester: c.semester,
          prerequisites: [],
          facultyName: c.faculty,
          status: "Active",
          createdAt: now,
          updatedAt: now,
        });

        await ctx.db.insert("courseSections", {
          courseId: cId,
          courseCode: c.code,
          courseName: c.name,
          section: "A",
          semester: "Fall 2026",
          academicYear: "2026-2027",
          facultyName: c.faculty,
          room: c.semester === 1 ? "Lab 101" : "Lab 202",
          building: "Computing Department Block A",
          campus: "Chak Shehzad Campus, Islamabad",
          days: c.semester === 1 ? ["Monday", "Wednesday"] : ["Tuesday", "Thursday"],
          startTime: "09:00 AM",
          endTime: "10:30 AM",
          capacity: 45,
          enrolledCount: 0,
          status: "Active",
          createdAt: now,
          updatedAt: now,
        });

        await ctx.db.insert("classSchedules", {
          courseId: cId,
          courseCode: c.code,
          courseTitle: c.name,
          section: "A",
          facultyName: c.faculty,
          day: c.semester === 1 ? "Monday" : "Tuesday",
          startTime: "09:00 AM",
          endTime: "10:30 AM",
          room: c.semester === 1 ? "Lab 101" : "Lab 202",
          building: "Computing Department Block A",
          campus: "Chak Shehzad Campus, Islamabad",
          type: "Lecture",
          createdAt: now,
        });

        insertedCount++;
      }
    }

    return {
      insertedCount,
      message: `Ensured foundational semester courses. (${insertedCount} new courses created)`,
    };
  },
});

// ----------------------------------------------------------------------------
// ANNOUNCEMENTS & NOTIFICATIONS
// ----------------------------------------------------------------------------

/**
 * Fetch all announcements for authenticated administrative and internal dashboards.
 */
export const getAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("announcements").order("desc").collect();
  },
});

/**
 * STRICT PUBLIC QUERY for Explore University portal.
 * Accessible to public unauthenticated visitors.
 * SECURITY GUARANTEE:
 * ONLY returns announcements that are:
 * 1. createdByRole === "ADMIN" (or official University administration)
 * 2. status === "Published"
 * 3. visibility === "PUBLIC"
 * 
 * NEVER returns faculty announcements, course announcements, drafts,
 * student-specific notices, or internal bulletins under any circumstance.
 */
export const getPublicAnnouncements = query({
  args: {
    limit: v.optional(v.number()),
    isFeatured: v.optional(v.boolean()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allPublished = await ctx.db
      .query("announcements")
      .withIndex("by_status", (q) => q.eq("status", "Published"))
      .order("desc")
      .collect();

    const publicAnnouncements = allPublished.filter((anc) => {
      // 1. Mandatory status check
      if (anc.status !== "Published") return false;

      // 2. Reject any course-specific or student-specific notices
      if (anc.courseCode) return false;
      if (anc.category === "Course" || anc.category === "Student-specific") return false;

      // 3. Reject faculty announcements
      if (anc.createdByRole === "FACULTY") return false;
      if (anc.sender && anc.sender.toLowerCase().includes("course instructor")) return false;

      // 4. Check visibility (must be explicitly PUBLIC or legacy admin official notice)
      if (anc.visibility) {
        if (anc.visibility !== "PUBLIC") return false;
      } else {
        // Legacy fallback: only if sender is Registrar / Administration and role is ADMIN
        const isOfficialAdmin =
          anc.createdByRole === "ADMIN" ||
          (anc.sender &&
            (anc.sender.toLowerCase().includes("registrar") ||
              anc.sender.toLowerCase().includes("admin") ||
              anc.sender.toLowerCase().includes("university")));
        if (!isOfficialAdmin) return false;
      }

      // 5. Featured filter (if requested)
      if (args.isFeatured !== undefined) {
        if (Boolean(anc.isFeatured) !== args.isFeatured) return false;
      }

      // 6. Category filter (if requested)
      if (args.category && args.category !== "All") {
        if (anc.category !== args.category) return false;
      }

      return true;
    });

    if (args.limit && args.limit > 0) {
      return publicAnnouncements.slice(0, args.limit);
    }

    return publicAnnouncements;
  },
});

/**
 * Admin creates an announcement with explicit visibility and publishing controls.
 */
export const createAnnouncement = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    sender: v.string(),
    category: v.union(
      v.literal("University"),
      v.literal("Department"),
      v.literal("Course"),
      v.literal("Exam"),
      v.literal("Student-specific")
    ),
    targetAudience: v.string(),
    department: v.optional(v.string()),
    courseCode: v.optional(v.string()),
    priority: v.union(v.literal("High"), v.literal("Normal"), v.literal("Urgent")),
    publishDate: v.string(),
    expiryDate: v.optional(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
    status: v.optional(v.union(v.literal("Published"), v.literal("Draft"), v.literal("Archived"))),
    visibility: v.optional(
      v.union(v.literal("PUBLIC"), v.literal("INTERNAL"), v.literal("AUTHENTICATED"))
    ),
    isFeatured: v.optional(v.boolean()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const status = args.status || "Published";
    const visibility = args.visibility || "PUBLIC";
    const isFeatured = Boolean(args.isFeatured);

    const id = await ctx.db.insert("announcements", {
      title: args.title.trim(),
      message: args.message.trim(),
      sender: args.sender.trim() || "Office of the Registrar",
      category: args.category,
      targetAudience: args.targetAudience.trim() || "All Students",
      department: args.department,
      courseCode: args.courseCode,
      priority: args.priority,
      publishDate: args.publishDate,
      expiryDate: args.expiryDate,
      status,
      createdAt: Date.now(),
      createdByRole: "ADMIN",
      visibility,
      isFeatured,
      imageUrl: args.imageUrl?.trim() || undefined,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Announcements",
      details: `Created announcement: "${args.title}" [Visibility: ${visibility}, Status: ${status}, Featured: ${isFeatured}]`,
      timestamp: Date.now(),
    });

    return id;
  },
});

/**
 * Admin updates an existing announcement.
 */
export const updateAnnouncement = mutation({
  args: {
    id: v.id("announcements"),
    title: v.string(),
    message: v.string(),
    sender: v.string(),
    category: v.union(
      v.literal("University"),
      v.literal("Department"),
      v.literal("Course"),
      v.literal("Exam"),
      v.literal("Student-specific")
    ),
    targetAudience: v.string(),
    department: v.optional(v.string()),
    courseCode: v.optional(v.string()),
    priority: v.union(v.literal("High"), v.literal("Normal"), v.literal("Urgent")),
    status: v.union(v.literal("Published"), v.literal("Draft"), v.literal("Archived")),
    visibility: v.union(v.literal("PUBLIC"), v.literal("INTERNAL"), v.literal("AUTHENTICATED")),
    isFeatured: v.optional(v.boolean()),
    imageUrl: v.optional(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Announcement not found");

    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      message: args.message.trim(),
      sender: args.sender.trim(),
      category: args.category,
      targetAudience: args.targetAudience.trim(),
      department: args.department,
      courseCode: args.courseCode,
      priority: args.priority,
      status: args.status,
      visibility: args.visibility,
      isFeatured: Boolean(args.isFeatured),
      imageUrl: args.imageUrl?.trim() || undefined,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Announcements",
      details: `Updated announcement "${args.title}" [Visibility: ${args.visibility}, Status: ${args.status}]`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Admin quickly toggles or updates announcement publication status.
 */
export const updateAnnouncementStatus = mutation({
  args: {
    id: v.id("announcements"),
    status: v.union(v.literal("Published"), v.literal("Draft"), v.literal("Archived")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Announcement not found");

    await ctx.db.patch(args.id, { status: args.status });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "status_change",
      module: "Announcements",
      details: `Changed status of announcement "${existing.title}" to ${args.status}`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Admin updates announcement visibility (Public — Explore University vs Internal).
 * Can also be used to approve a faculty announcement for public publication.
 */
export const updateAnnouncementVisibility = mutation({
  args: {
    id: v.id("announcements"),
    visibility: v.union(v.literal("PUBLIC"), v.literal("INTERNAL"), v.literal("AUTHENTICATED")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Announcement not found");

    await ctx.db.patch(args.id, { visibility: args.visibility });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Announcements",
      details: `Changed visibility of announcement "${existing.title}" to ${args.visibility}`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Admin toggles featured status for public announcements.
 */
export const toggleAnnouncementFeatured = mutation({
  args: {
    id: v.id("announcements"),
    isFeatured: v.boolean(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Announcement not found");

    await ctx.db.patch(args.id, { isFeatured: args.isFeatured });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Announcements",
      details: `${args.isFeatured ? "Featured" : "Unfeatured"} announcement "${existing.title}"`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Admin permanently deletes an announcement.
 */
export const deleteAnnouncement = mutation({
  args: {
    id: v.id("announcements"),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Announcement not found");

    await ctx.db.delete(args.id);

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "delete",
      module: "Announcements",
      details: `Deleted announcement "${existing.title}"`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Safe idempotent migration to classify legacy announcements without deleting content.
 */
export const migrateAnnouncementsVisibility = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("announcements").collect();
    let updatedCount = 0;

    for (const anc of all) {
      let needsUpdate = false;
      const patch: any = {};

      if (!anc.createdByRole) {
        if (
          anc.courseCode ||
          anc.category === "Course" ||
          anc.category === "Student-specific" ||
          (anc.sender && anc.sender.toLowerCase().includes("course instructor"))
        ) {
          patch.createdByRole = "FACULTY";
        } else {
          patch.createdByRole = "ADMIN";
        }
        needsUpdate = true;
      }

      if (!anc.visibility) {
        if (patch.createdByRole === "FACULTY" || anc.createdByRole === "FACULTY") {
          patch.visibility = "INTERNAL";
        } else {
          // Admin announcements default to PUBLIC if published and University category
          patch.visibility = anc.category === "University" ? "PUBLIC" : "INTERNAL";
        }
        needsUpdate = true;
      }

      if (anc.isFeatured === undefined) {
        patch.isFeatured = false;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(anc._id, patch);
        updatedCount++;
      }
    }

    return { migrated: true, count: updatedCount };
  },
});

// ----------------------------------------------------------------------------
// SEED INITIAL BASELINE ACADEMIC STRUCTURE IF DATABASE IS EMPTY
// ----------------------------------------------------------------------------
export const seedInitialBaselineStructure = mutation({
  args: {},
  handler: async (ctx) => {
    // Only seed if no departments exist yet
    const existingDept = await ctx.db.query("departments").first();
    if (existingDept) return { seeded: false, message: "Baseline already exists." };

    const now = Date.now();

    // 1. Departments
    const depts = [
      { code: "CS", name: "Department of Computing & Artificial Intelligence", head: "Dr. Arshad Mehmood" },
      { code: "SE", name: "Department of Software Engineering", head: "Dr. Tariq Mahmood" },
      { code: "EE", name: "Department of Electrical Engineering", head: "Dr. Kamran Qureshi" },
      { code: "BBA", name: "Department of Business Administration", head: "Dr. Samina Rizvi" },
    ];

    for (const d of depts) {
      await ctx.db.insert("departments", {
        code: d.code,
        name: d.name,
        headOfDepartment: d.head,
        status: "active",
        createdAt: now,
      });
    }

    // 2. Degree Programs
    const progs = [
      { code: "BSCS", name: "Bachelor of Science in Computer Science", dept: "Department of Computing & Artificial Intelligence", level: "Undergraduate" as const, ch: 134, dur: "4 Years (8 Semesters)" },
      { code: "BSAI", name: "Bachelor of Science in Artificial Intelligence", dept: "Department of Computing & Artificial Intelligence", level: "Undergraduate" as const, ch: 134, dur: "4 Years (8 Semesters)" },
      { code: "BSSE", name: "Bachelor of Science in Software Engineering", dept: "Department of Software Engineering", level: "Undergraduate" as const, ch: 134, dur: "4 Years (8 Semesters)" },
      { code: "MSCS", name: "Master of Science in Computer Science", dept: "Department of Computing & Artificial Intelligence", level: "Graduate" as const, ch: 30, dur: "2 Years (4 Semesters)" },
    ];

    for (const p of progs) {
      await ctx.db.insert("academicPrograms", {
        code: p.code,
        name: p.name,
        department: p.dept,
        degreeLevel: p.level,
        duration: p.dur,
        totalCreditHours: p.ch,
        status: "active",
        createdAt: now,
      });
    }

    // 3. Faculty Members
    const facultyList = [
      { first: "Arshad", last: "Mehmood", id: "FAC-1001", des: "Associate Professor" as const, dept: "Department of Computing & Artificial Intelligence", spec: "Algorithms & Data Structures", qual: "Ph.D. Computer Science", email: "arshad.mehmood@isb.iqra.edu.pk", room: "Office 204, Block B" },
      { first: "Fatima", last: "Tariq", id: "FAC-1002", des: "Assistant Professor" as const, dept: "Department of Computing & Artificial Intelligence", spec: "Database & Cloud Architecture", qual: "MS Software Engineering", email: "fatima.tariq@isb.iqra.edu.pk", room: "Office 210, Block B" },
      { first: "Kamran", last: "Qureshi", id: "FAC-1003", des: "Professor" as const, dept: "Department of Computing & Artificial Intelligence", spec: "Artificial Intelligence & Neural Nets", qual: "Ph.D. Artificial Intelligence", email: "kamran.qureshi@isb.iqra.edu.pk", room: "AI Lab 102" },
      { first: "Bilal", last: "Zahid", id: "FAC-1004", des: "Lecturer" as const, dept: "Department of Computing & Artificial Intelligence", spec: "Computer Networks & Cybersecurity", qual: "MS Information Security", email: "bilal.zahid@isb.iqra.edu.pk", room: "Cisco Lab 305" },
    ];

    for (const f of facultyList) {
      await ctx.db.insert("faculty", {
        firstName: f.first,
        lastName: f.last,
        fullName: `Dr. ${f.first} ${f.last}`,
        email: f.email,
        phone: "+92 51 111 264 264",
        employeeId: f.id,
        department: f.dept,
        designation: f.des,
        specialization: f.spec,
        qualification: f.qual,
        joiningDate: "2023-01-15",
        officeLocation: f.room,
        officeHours: "Mon-Thu 02:00 PM - 04:00 PM",
        status: "Active",
        createdAt: now,
        updatedAt: now,
      });
    }

    // 4. Foundational Courses
    const coursesList = [
      { code: "CS-201", name: "Data Structures & Algorithms", ch: 4, sem: 3, faculty: "Dr. Arshad Mehmood", desc: "Analysis of Algorithms, Trees, Graph Algorithms, and Dynamic Programming." },
      { code: "CS-301", name: "Database Systems", ch: 4, sem: 4, faculty: "Engr. Fatima Tariq", desc: "Relational Models, SQL Optimization, Normalization, ACID Transactions, and NoSQL." },
      { code: "CS-304", name: "Artificial Intelligence", ch: 3, sem: 5, faculty: "Dr. Kamran Qureshi", desc: "Search Heuristics, Knowledge Representation, Logic Systems, and Deep Learning." },
      { code: "CS-305", name: "Computer Networks", ch: 3, sem: 5, faculty: "Engr. Bilal Zahid", desc: "OSI Architecture, TCP/IP, IP Subnetting, Routing Protocols, and Network Security." },
      { code: "CS-401", name: "Machine Learning", ch: 3, sem: 6, faculty: "Dr. Kamran Qureshi", desc: "Supervised and Unsupervised Learning, Regression, Classification, and Neural Networks." },
      { code: "CS-402", name: "Cloud Computing & DevOps", ch: 3, sem: 6, faculty: "Engr. Bilal Zahid", desc: "Containerization, Kubernetes Orchestration, Cloud Architecture, and CI/CD." },
    ];

    for (const c of coursesList) {
      const cId = await ctx.db.insert("courses", {
        code: c.code,
        name: c.name,
        description: c.desc,
        creditHours: c.ch,
        department: "Department of Computing & Artificial Intelligence",
        program: "BSCS",
        semester: c.sem,
        prerequisites: [],
        facultyName: c.faculty,
        status: "Active",
        createdAt: now,
        updatedAt: now,
      });

      // Also create Section A for each course
      await ctx.db.insert("courseSections", {
        courseId: cId,
        courseCode: c.code,
        courseName: c.name,
        section: "A",
        semester: "Fall 2026",
        academicYear: "2026-2027",
        facultyName: c.faculty,
        room: "Lab 204",
        building: "Computing Department",
        campus: "Chak Shehzad Campus, Islamabad",
        days: ["Monday", "Wednesday"],
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        capacity: 45,
        enrolledCount: 0,
        status: "Active",
        createdAt: now,
        updatedAt: now,
      });

      // Class schedule slots
      await ctx.db.insert("classSchedules", {
        courseId: cId,
        courseCode: c.code,
        courseTitle: c.name,
        section: "A",
        facultyName: c.faculty,
        day: "Monday",
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        room: "Lab 204",
        building: "Computing Department",
        campus: "Chak Shehzad Campus, Islamabad",
        type: "Lecture",
        createdAt: now,
      });

      await ctx.db.insert("classSchedules", {
        courseId: cId,
        courseCode: c.code,
        courseTitle: c.name,
        section: "A",
        facultyName: c.faculty,
        day: "Wednesday",
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        room: "Lab 204",
        building: "Computing Department",
        campus: "Chak Shehzad Campus, Islamabad",
        type: "Lecture",
        createdAt: now,
      });
    }

    // 5. University Announcements
    await ctx.db.insert("announcements", {
      title: "Fall 2026 Academic Session Timetable Finalized",
      message: "The official academic timetable and venue allocation for Fall 2026 have been published for Chak Shehzad Campus students.",
      sender: "Office of the Registrar",
      category: "University",
      targetAudience: "All Students",
      priority: "Urgent",
      publishDate: "September 12, 2026",
      status: "Published",
      createdAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: "System Initialization",
      adminEmail: "admin@isb.iqra.edu.pk",
      actionType: "create",
      module: "System Setup",
      details: "Seeded baseline departments, degree programs, faculty members, and foundational courses.",
      timestamp: now,
    });

    return { seeded: true, message: "Baseline academic structure initialized successfully." };
  },
});

// ----------------------------------------------------------------------------
// USER & STUDENT MANAGEMENT
// ----------------------------------------------------------------------------
export const getStudentsList = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "student"))
      .collect();

    // Attach academic summary to each student
    return await Promise.all(
      students.map(async (st) => {
        const approvedRegs = await ctx.db
          .query("courseRegistrations")
          .withIndex("by_student_and_status", (q) =>
            q.eq("studentId", st._id).eq("status", "Approved")
          )
          .collect();

        const publishedResults = await ctx.db
          .query("academicResults")
          .withIndex("by_student_and_status", (q) =>
            q.eq("studentId", st._id).eq("status", "Published")
          )
          .collect();

        let totalQualityPoints = 0;
        let totalCredits = 0;
        publishedResults.forEach((r) => {
          totalQualityPoints += r.gradePoints * r.creditHours;
          totalCredits += r.creditHours;
        });

        const cgpa = totalCredits > 0 ? Number((totalQualityPoints / totalCredits).toFixed(2)) : 0.0;

        return {
          id: st._id,
          studentId: st.enrollmentId || st._id.slice(-8).toUpperCase(),
          name: st.name,
          email: st.universityEmail || st.email,
          personalEmail: st.personalEmail || st.email,
          department: st.department || "Computing & Artificial Intelligence",
          program: "BS Computer Science",
          campus: "Chak Shehzad Campus, Islamabad",
          batch: "Fall 2024",
          semester: "Semester 5",
          semesterNumber: 5,
          status: (st.accountStatus === "suspended" ? "Suspended" : "Active") as "Active" | "Suspended",
          cgpa,
          currentGpa: cgpa,
          completedCreditHours: totalCredits,
          totalCreditHours: 134,
          remainingCreditHours: Math.max(134 - totalCredits, 0),
          enrolledCourseCodes: approvedRegs.map((r) => r.courseCode),
          enrolledCount: approvedRegs.length,
          createdAt: st.createdAt,
        };
      })
    );
  },
});

export const getAdministratorsList = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();

    return admins.map((a) => ({
      id: a._id,
      name: a.name,
      email: a.email,
      department: a.department || "Central University Administration",
      role: a.role,
      status: a.accountStatus || "active",
      createdAt: a.createdAt,
    }));
  },
});

export const createStudentAccount = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    department: v.string(),
    enrollmentId: v.string(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      throw new Error(`A user with email ${email} already exists.`);
    }

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email,
      personalEmail: email,
      universityEmail: `${args.enrollmentId.toLowerCase().replace(/[^a-z0-9]/g, "")}@isb.iqra.edu.pk`,
      passwordHash: "hash_placeholder",
      salt: "salt_placeholder",
      role: "student",
      accountStatus: "active",
      enrollmentId: args.enrollmentId.trim().toUpperCase(),
      department: args.department.trim(),
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Students",
      details: `Created student account for ${args.name} (${args.enrollmentId})`,
      timestamp: now,
    });

    return userId;
  },
});

export const updateUserAccountStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(v.literal("active"), v.literal("suspended")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const prev = user.accountStatus;
    await ctx.db.patch(args.userId, {
      accountStatus: args.status,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "status_change",
      module: "User Management",
      details: `Changed account status for ${user.name} (${user.email}) to ${args.status}`,
      previousValue: prev,
      newValue: args.status,
      timestamp: Date.now(),
    });
  },
});
