"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar, DashboardTab } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DashboardOverview } from "@/components/dashboard/sections/DashboardOverview";
import { MyProfileSection } from "@/components/dashboard/sections/MyProfileSection";
import { AcademicOverviewSection } from "@/components/dashboard/sections/AcademicOverviewSection";
import { MyCoursesSection } from "@/components/dashboard/sections/MyCoursesSection";
import { CourseRegistrationSection } from "@/components/dashboard/sections/CourseRegistrationSection";
import { ClassScheduleSection } from "@/components/dashboard/sections/ClassScheduleSection";
import { AttendanceSection } from "@/components/dashboard/sections/AttendanceSection";
import { AssignmentsSection } from "@/components/dashboard/sections/AssignmentsSection";
import { ExaminationsSection } from "@/components/dashboard/sections/ExaminationsSection";
import { ResultsGradesSection } from "@/components/dashboard/sections/ResultsGradesSection";
import { AcademicTranscriptSection } from "@/components/dashboard/sections/AcademicTranscriptSection";
import { GpaAnalyticsSection } from "@/components/dashboard/sections/GpaAnalyticsSection";
import { AiAssistantSection } from "@/components/dashboard/sections/AiAssistantSection";
import { AiStudyPlannerSection } from "@/components/dashboard/sections/AiStudyPlannerSection";
import { CourseDetailsModal } from "@/components/dashboard/modals/CourseDetailsModal";
import { EditProfileModal } from "@/components/dashboard/modals/EditProfileModal";
import { SubmitAssignmentModal } from "@/components/dashboard/modals/SubmitAssignmentModal";
import { ViewAssignmentModal } from "@/components/dashboard/modals/ViewAssignmentModal";
import {
  initialStudentProfile,
  initialEnrolledCourses,
  initialAvailableCourses,
  initialAssignments,
  StudentProfile,
  EnrolledCourse,
  AvailableCourse,
  Assignment,
  Examination,
  Announcement,
  ScheduleSlot,
  AttendanceRecord,
  SemesterResultRecord,
  AcademicActivity,
} from "@/lib/dashboard-data";
import { useAuth } from "@/lib/auth-context";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, refreshUser } = useAuth();

  // Tab State
  const initialTab = (searchParams?.get("tab") as DashboardTab) || "dashboard";
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  // Sync tab with URL without full reload
  const handleSelectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    window.history.pushState(null, "", `/dashboard?tab=${tab}`);
  };

  // Redirect users to their dedicated portals based on role
  useEffect(() => {
    if (!user) return;
    const role = (user.role || "").toLowerCase();
    if (role === "faculty" || role === "teacher") {
      router.push("/faculty/dashboard");
    } else if (role === "admin" || role === "super_admin") {
      router.push("/admin");
    } else if (role === "applicant") {
      router.push("/status");
    }
  }, [user, router]);

  // Profile State scoped to logged in student
  const [profile, setProfile] = useState<StudentProfile>(() => {
    return {
      ...initialStudentProfile,
      name: user?.name || "Student",
      email: user?.universityEmail || user?.email || "",
      studentId: user?.enrollmentId || "Pending",
    };
  });

  // Database-backed Live State Arrays
  const [selectedSemester, setSelectedSemester] = useState<number>(() => user?.currentSemester || 1);
  const [registrationRequests, setRegistrationRequests] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>(initialEnrolledCourses);
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>(initialAvailableCourses);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classSchedule, setClassSchedule] = useState<ScheduleSlot[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [semesterResults, setSemesterResults] = useState<SemesterResultRecord[]>([]);
  const [activities, setActivities] = useState<AcademicActivity[]>([]);

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals State
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<EnrolledCourse | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [assignmentForSubmit, setAssignmentForSubmit] = useState<Assignment | null>(null);
  const [assignmentForView, setAssignmentForView] = useState<Assignment | null>(null);

  const studentKey = user?.enrollmentId || user?.id || "student";

  // Reactive Convex subscription for student assignments: automatically updates in real-time when faculty creates/grades an assignment!
  const liveAssignments = useQuery(
    api.academicManagement.getStudentAssignments,
    user
      ? {
          userId: user.id as any,
          studentId: studentKey,
        }
      : "skip"
  );

  // Reactive Convex subscription for student academic progression: updates immediately upon result publishing!
  const liveProgression = useQuery(
    api.academicManagement.getStudentAcademicProgression,
    user
      ? {
          userId: user.id as any,
          studentId: studentKey,
        }
      : "skip"
  );

  useEffect(() => {
    if (liveAssignments) {
      setAssignments(liveAssignments as Assignment[]);
    }
  }, [liveAssignments]);

  useEffect(() => {
    if (liveProgression) {
      setProfile((prev) => ({
        ...prev,
        cgpa: liveProgression.cgpa,
        currentGpa: liveProgression.currentGpa,
        completedCreditHours: liveProgression.completedCreditHours,
        remainingCreditHours: liveProgression.remainingCreditHours,
        totalCreditHours: liveProgression.totalDegreeCredits || prev.totalCreditHours,
        academicStanding: liveProgression.academicStanding,
        currentSemester: `Semester ${liveProgression.currentSemester || 1}`,
      }));
    }
  }, [liveProgression]);

  // Unified loader for student data & live academic records from Convex
  const loadAcademicData = useCallback(async () => {
    if (!user) return;
    try {
      const client = getConvexClient();
      if (!client || !isConvexConfigured) return;

      // Ensure foundational courses (CS-101..105, CS-111..115) exist in the database for Semester 1 & 2
      try {
        await client.mutation(api.academicManagement.ensureFoundationalSemesterCourses, {});
      } catch (e) {
        // non-blocking
      }

      const studentKey = user.enrollmentId || user.id || "student";

      // 1. Load application & student profile
      try {
        const app = await client.query(api.applications.getMyApplication, {
          userId: user.id as any,
        });
        const freshUser = await client.query(api.users.getUserById, {
          userId: user.id as any,
        });
        const photoUrl = freshUser?.profilePhoto || user.profilePhoto || "";

        if (app) {
          setProfile((prev) => ({
            ...prev,
            avatarUrl: photoUrl || prev.avatarUrl,
            name: app.personalInformation?.fullName || user.name,
            email: user.universityEmail || app.generatedUniversityEmail || user.email,
            personalEmail: app.personalInformation?.email || user.personalEmail || "",
            phone: app.personalInformation?.phone || "",
            cnic: app.personalInformation?.cnic || "",
            studentId: user.enrollmentId || app.applicationId,
            program: app.academicInformation?.degreeApplyingFor || app.programPreferences?.firstChoice || "BS Computer Science",
            status: app.status === "Approved" ? "Active" : "Probation",
          }));
        } else if (photoUrl) {
          setProfile((prev) => ({
            ...prev,
            avatarUrl: photoUrl,
          }));
        }
      } catch (e) {
        console.warn("Could not query application:", e);
      }

      // 2. Load student's courses dynamically from Convex backend based on Department & Program
      try {
        const liveCourses = await client.query(api.academicManagement.getStudentCourses, {
          userId: user.id as any,
          studentId: studentKey,
        });
        if (liveCourses) {
          setEnrolledCourses(liveCourses as unknown as EnrolledCourse[]);
        }
      } catch (e) {
        console.warn("Could not query student courses:", e);
      }

      // 3. Load allowed courses for course registration strictly authorized for this student's Department + Program + Semester
      try {
        const studentAllowedCourses = await client.query(api.academicManagement.getStudentAvailableCourses, {
          userId: user.id as any,
          studentId: studentKey,
          semester: selectedSemester,
        });
        if (studentAllowedCourses) {
          const mapped: AvailableCourse[] = studentAllowedCourses.map((c: any) => {
            const capacity = c.capacity || 45;
            const enrolled = c.enrolledCount || 0;
            return {
              id: c.id || c._id,
              code: c.code,
              title: c.title,
              department: c.department,
              departmentId: c.departmentId,
              program: c.program,
              creditHours: c.creditHours,
              semester: c.semester,
              instructor: c.instructor || "Faculty Member",
              instructorDesignation: c.instructorDesignation || "Faculty Member",
              prerequisites: c.prerequisites || [],
              description: c.description || "",
              availableSeats: Math.max(0, capacity - enrolled),
              totalSeats: capacity,
              schedule: c.schedule || "TBA",
              classroom: c.classroom || "Room 201",
              category: "Core",
              registrationStatus: c.registrationStatus || "None",
              registrationId: c.registrationId,
              registrationRemarks: c.registrationRemarks,
              registeredAt: c.registeredAt,
              isEnrolled: c.isEnrolled,
              isPending: c.isPending,
              isRejected: c.isRejected,
            };
          });
          setAvailableCourses(mapped);
        }
      } catch (e) {
        console.warn("Could not query student available courses:", e);
      }

      // 3b. Load student's registration requests
      try {
        const reqs = await client.query(api.academicManagement.getStudentRegistrationRequests, {
          userId: user.id as any,
          studentId: studentKey,
        });
        if (reqs) {
          setRegistrationRequests(reqs);
        }
      } catch (e) {
        console.warn("Could not query student registration requests:", e);
      }

      // 4. Load class schedule
      try {
        const sch = await client.query(api.academicManagement.getStudentClassSchedule, {
          userId: user.id as any,
          studentId: studentKey,
        });
        if (sch) {
          setClassSchedule(
            sch.map((s) => ({
              id: s._id,
              day: s.day as any,
              startTime: s.startTime,
              endTime: s.endTime,
              courseCode: s.courseCode,
              courseTitle: s.courseTitle,
              instructor: s.facultyName,
              classroom: s.room,
              building: s.building,
              type: s.type,
            }))
          );
        }
      } catch (e) {
        console.warn("Could not query schedule:", e);
      }

      // 5. Load attendance records
      try {
        const att = await client.query(api.academicManagement.getStudentAttendanceRecords, {
          userId: user.id as any,
          studentId: studentKey,
        });
        if (att) {
          setAttendanceRecords(
            att.map((a) => ({
              id: a._id,
              date: a.date,
              time: a.time,
              courseCode: a.courseCode,
              courseTitle: a.courseCode,
              status: a.status,
              topic: a.topic || "Class Lecture Session",
            }))
          );
        }
      } catch (e) {
        console.warn("Could not query attendance records:", e);
      }

      // 6. Load assignments
      try {
        const asgs = await client.query(api.academicManagement.getStudentAssignments, {
          userId: user.id as any,
          studentId: studentKey,
        });
        if (asgs) {
          setAssignments(asgs as Assignment[]);
        }
      } catch (e) {
        console.warn("Could not query student assignments:", e);
      }

      // 7. Load examinations
      try {
        const exams = await client.query(api.academicManagement.getStudentExaminations, {
          userId: user.id as any,
          studentId: studentKey,
        });
        if (exams) {
          setExaminations(exams as Examination[]);
        }
      } catch (e) {
        console.warn("Could not query examinations:", e);
      }

      // 8. Load published results & compute true GPA/CGPA
      try {
        const pubResults = await client.query(api.academicManagement.getStudentPublishedResults, {
          studentId: studentKey,
        });
        if (pubResults && pubResults.length > 0) {
          setSemesterResults(pubResults as SemesterResultRecord[]);
          const latestSem = pubResults[pubResults.length - 1];
          const totalEarnedCr = pubResults.reduce((acc, sem) => acc + sem.creditHours, 0);

          setProfile((prev) => ({
            ...prev,
            cgpa: latestSem.cgpa,
            currentGpa: latestSem.gpa,
            completedCreditHours: totalEarnedCr,
            remainingCreditHours: Math.max(0, (prev.totalCreditHours || 134) - totalEarnedCr),
            academicStanding: latestSem.academicStanding,
          }));
        } else {
          setSemesterResults([]);
          setProfile((prev) => ({
            ...prev,
            cgpa: 0.0,
            currentGpa: 0.0,
            completedCreditHours: 0,
            remainingCreditHours: prev.totalCreditHours || 134,
            academicStanding: "Enrolled",
          }));
        }
      } catch (e) {
        console.warn("Could not query published results:", e);
      }

      // 9. Load announcements
      try {
        const anc = await client.query(api.academicManagement.getAnnouncements, {});
        if (anc) {
          setAnnouncements(
            anc.map((a) => ({
              id: a._id,
              title: a.title,
              date: a.publishDate,
              sender: a.sender,
              category: (a.category as any) || "Academic",
              content: a.message,
              isUrgent: a.priority === "Urgent" || a.priority === "High",
            }))
          );
        }
      } catch (e) {
        console.warn("Could not query announcements:", e);
      }
    } catch (e) {
      console.error("General error loading academic data:", e);
    }
  }, [user, selectedSemester]);

  useEffect(() => {
    loadAcademicData();
  }, [loadAcademicData]);

  // Course Registration Action (Real database mutation)
  const handleRegisterCourse = async (courseToAdd: AvailableCourse) => {
    try {
      const client = getConvexClient();
      const studentKey = profile.studentId || user?.enrollmentId || user?.id || "student";

      if (client && isConvexConfigured) {
        await client.mutation(api.academicManagement.submitCourseRegistration, {
          studentId: studentKey,
          studentName: profile.name,
          studentEmail: profile.email,
          enrollmentId: user?.enrollmentId || profile.studentId || "Pending",
          courseId: courseToAdd.id,
          courseCode: courseToAdd.code,
          courseTitle: courseToAdd.title,
          creditHours: courseToAdd.creditHours,
          semester: `Semester ${courseToAdd.semester || selectedSemester || 1}`,
        });
        await loadAcademicData();
      }
    } catch (err: any) {
      console.error("Course registration failed:", err);
      throw err;
    }
  };

  // Course Drop Action
  const handleDropCourse = async (courseId: string) => {
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        await client.mutation(api.academicManagement.dropCourseRegistration, {
          registrationId: courseId as any,
          adminName: profile.name,
          adminEmail: profile.email,
        });
        await loadAcademicData();
      }
    } catch (err: any) {
      console.error("Course drop failed:", err);
    }
  };

  // Assignment Submit Action
  const handleSubmitAssignment = async (assignmentId: string, fileName: string) => {
    try {
      const client = getConvexClient();
      const studentKey = profile.studentId || user?.enrollmentId || user?.id || "student";

      if (client && isConvexConfigured) {
        await client.mutation(api.academicManagement.submitAssignmentSolution, {
          assignmentId: assignmentId as any,
          studentId: studentKey,
          studentName: profile.name,
          enrollmentId: user?.enrollmentId || profile.studentId || "Pending",
          fileUrl: `portal/submissions/${fileName}`,
          fileName,
          notes: "Submitted via Iqra University Student Portal",
        });
        await loadAcademicData();
      }
    } catch (err: any) {
      console.error("Assignment submission failed:", err);
    }
  };

  // Profile Photo Upload Action
  const handleUploadProfilePhoto = async (file: File): Promise<string> => {
    try {
      if (!user) throw new Error("You must be logged in to upload a profile photo.");
      const client = getConvexClient();
      if (!client || !isConvexConfigured) throw new Error("Convex connection not configured.");

      // 1. Generate secure upload URL from Convex
      const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {});

      // 2. Upload file to Convex Storage
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image file to storage.");
      }

      const { storageId } = await res.json();

      // 3. Resolve public/view URL for this document
      const photoUrl = await client.query(api.storage.getDocumentUrl, { storageId });
      if (!photoUrl) {
        throw new Error("Failed to retrieve document URL for uploaded photo.");
      }

      // 4. Update the user record in Convex
      await client.mutation(api.users.updateProfilePhoto, {
        userId: user.id as any,
        storageId,
        photoUrl,
      });

      // 5. Update local profile state and refresh session
      setProfile((prev) => ({
        ...prev,
        avatarUrl: photoUrl,
      }));
      await refreshUser();
      return photoUrl;
    } catch (err: any) {
      console.error("Profile photo upload failed:", err);
      throw err;
    }
  };

  // Profile Save Action
  const handleSaveProfile = (updatedFields: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // Logout action
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const pendingAssignmentsCount = assignments.filter((a) => a.status === "Pending" || a.status === "Upcoming").length;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-row overflow-x-hidden selection:bg-iqra-blue-600 selection:text-white">
      {/* 1. LEFT SIDEBAR (EXACTLY 8 SECTIONS) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        profile={profile}
        pendingAssignmentsCount={pendingAssignmentsCount}
        registeredCoursesCount={enrolledCourses.length}
        onLogout={handleLogout}
      />

      {/* 2. MAIN VIEW CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          profile={profile}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          announcements={announcements}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
        />

        {/* Dynamic Section Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DashboardOverview
              profile={profile}
              courses={enrolledCourses}
              assignments={assignments}
              examinations={examinations}
              announcements={announcements}
              activities={activities}
              onNavigateTab={handleSelectTab}
              onOpenCourse={(c) => setSelectedCourseForModal(c)}
              onOpenSubmitAssignment={(a) => setAssignmentForSubmit(a)}
            />
          )}

          {activeTab === "profile" && (
            <MyProfileSection
              profile={profile}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onUploadPhoto={handleUploadProfilePhoto}
            />
          )}

          {activeTab === "academics" && (
            <AcademicOverviewSection
              profile={profile}
              history={semesterResults}
              progression={liveProgression as any}
            />
          )}

          {activeTab === "courses" && (
            <MyCoursesSection
              courses={enrolledCourses}
              onOpenCourseModal={(c) => setSelectedCourseForModal(c)}
              searchFilter={searchQuery}
              onNavigateTab={handleSelectTab}
            />
          )}

          {activeTab === "registration" && (
            <CourseRegistrationSection
              availableCourses={availableCourses}
              enrolledCourses={enrolledCourses}
              registrationRequests={registrationRequests}
              onRegisterCourse={handleRegisterCourse}
              onDropCourse={handleDropCourse}
              departmentName={user?.department}
              programName={user?.degreeProgram || profile.program}
              currentSemester={user?.currentSemester || 1}
              selectedSemester={selectedSemester}
              onSelectSemester={(sem) => setSelectedSemester(sem)}
              progression={liveProgression as any}
            />
          )}

          {activeTab === "schedule" && (
            <ClassScheduleSection schedule={classSchedule} />
          )}

          {activeTab === "attendance" && (
            <AttendanceSection courses={enrolledCourses} attendanceRecords={attendanceRecords} />
          )}

          {activeTab === "assignments" && (
            <AssignmentsSection
              assignments={assignments}
              onOpenSubmitModal={(a) => setAssignmentForSubmit(a)}
              onOpenViewModal={(a) => setAssignmentForView(a)}
              searchFilter={searchQuery}
            />
          )}

          {activeTab === "examinations" && (
            <ExaminationsSection examinations={examinations} />
          )}

          {activeTab === "results" && (
            <ResultsGradesSection resultsData={semesterResults} />
          )}

          {activeTab === "transcript" && (
            <AcademicTranscriptSection profile={profile} history={semesterResults} />
          )}

          {activeTab === "analytics" && (
            <GpaAnalyticsSection profile={profile} history={semesterResults} />
          )}

          {activeTab === "ai-assistant" && (
            <AiAssistantSection
              profile={profile}
              courses={enrolledCourses}
              examinations={examinations}
              assignments={assignments}
            />
          )}

          {activeTab === "study-planner" && (
            <AiStudyPlannerSection
              enrolledCourses={enrolledCourses}
              upcomingExaminations={examinations}
              assignments={assignments}
            />
          )}
        </main>
      </div>

      {/* 3. INTERACTIVE MODALS */}
      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        profile={profile}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
        onUploadPhoto={handleUploadProfilePhoto}
      />

      {/* Submit Assignment Modal */}
      <SubmitAssignmentModal
        assignment={assignmentForSubmit}
        isOpen={!!assignmentForSubmit}
        onClose={() => setAssignmentForSubmit(null)}
        onSubmit={handleSubmitAssignment}
      />

      {/* View Assignment Rubric Modal */}
      <ViewAssignmentModal
        assignment={assignmentForView}
        isOpen={!!assignmentForView}
        onClose={() => setAssignmentForView(null)}
        onOpenSubmit={(a) => {
          setAssignmentForView(null);
          setAssignmentForSubmit(a);
        }}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] text-slate-800">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-iqra-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Loading Iqra University Student Portal...
            </p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
