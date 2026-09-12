"use client";

import React, { useState, useEffect, Suspense } from "react";
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
import { CourseDetailsModal } from "@/components/dashboard/modals/CourseDetailsModal";
import { EditProfileModal } from "@/components/dashboard/modals/EditProfileModal";
import { SubmitAssignmentModal } from "@/components/dashboard/modals/SubmitAssignmentModal";
import { ViewAssignmentModal } from "@/components/dashboard/modals/ViewAssignmentModal";
import {
  initialStudentProfile,
  initialEnrolledCourses,
  initialAvailableCourses,
  initialAssignments,
  upcomingExaminations,
  recentAnnouncements,
  recentAcademicActivities,
  StudentProfile,
  EnrolledCourse,
  AvailableCourse,
  Assignment,
} from "@/lib/dashboard-data";
import { useAuth } from "@/lib/auth-context";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  // Tab State
  const initialTab = (searchParams?.get("tab") as DashboardTab) || "dashboard";
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  // Sync tab with URL without full reload
  const handleSelectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    window.history.pushState(null, "", `/dashboard?tab=${tab}`);
  };

  // Redirect applicant to status page if they haven't been approved yet
  useEffect(() => {
    if (user && user.role === "applicant") {
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

  // Load real student data and application details from Convex
  useEffect(() => {
    const loadStudentData = async () => {
      if (!user) return;
      try {
        const client = getConvexClient();
        if (client && isConvexConfigured) {
          const app = await client.query(api.applications.getMyApplication, {
            userId: user.id as any,
          });
          if (app) {
            setProfile((prev) => ({
              ...prev,
              name: app.personalInformation?.fullName || user.name,
              email: user.universityEmail || app.generatedUniversityEmail || user.email,
              personalEmail: app.personalInformation?.email || user.personalEmail || "",
              phone: app.personalInformation?.phone || "",
              cnic: app.personalInformation?.cnic || "",
              studentId: user.enrollmentId || app.applicationId,
              program: app.academicInformation?.degreeApplyingFor || app.programPreferences?.firstChoice || "BS Computer Science",
              status: app.status === "Approved" ? "Active" : "Probation",
            }));
          }
        }
      } catch (e) {
        console.warn("Failed to load student data from Convex:", e);
      }
    };
    loadStudentData();
  }, [user]);

  // Courses & Registration State
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>(initialEnrolledCourses);
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>(initialAvailableCourses);

  // Assignments State
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);

  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals State
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<EnrolledCourse | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [assignmentForSubmit, setAssignmentForSubmit] = useState<Assignment | null>(null);
  const [assignmentForView, setAssignmentForView] = useState<Assignment | null>(null);

  // Course Registration Action (Add course)
  const handleRegisterCourse = (courseToAdd: AvailableCourse) => {
    const newEnrolled: EnrolledCourse = {
      id: `enr_${courseToAdd.id}`,
      code: courseToAdd.code,
      title: courseToAdd.title,
      creditHours: courseToAdd.creditHours,
      instructor: {
        name: courseToAdd.instructor,
        designation: "Faculty Member",
        email: `${courseToAdd.instructor.toLowerCase().replace(/[^a-z]/g, "")}@isb.iqra.edu.pk`,
        office: "Faculty Block B",
      },
      section: "CS-6A",
      progress: 0,
      attendancePercentage: 100,
      attendedLectures: 0,
      totalLectures: 32,
      pendingAssignments: 0,
      totalAssignments: 4,
      currentGrade: "N/A",
      gradeStatus: "Good",
      schedule: courseToAdd.schedule,
      classroom: "Academic Hall 3",
      building: "Academic Block B",
      syllabus: ["Course Introduction & Objectives", "Fundamental Theories", "Applied Project Milestone"],
    };

    setEnrolledCourses((prev) => [...prev, newEnrolled]);
    setAvailableCourses((prev) =>
      prev.map((c) => (c.id === courseToAdd.id ? { ...c, availableSeats: c.availableSeats - 1 } : c))
    );
  };

  // Course Drop Action
  const handleDropCourse = (courseId: string) => {
    setEnrolledCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  // Assignment Submit Action
  const handleSubmitAssignment = (assignmentId: string, fileName: string) => {
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === assignmentId
          ? {
              ...asg,
              status: "Submitted",
              fileName,
              submittedAt: "Just now (Digital Portal)",
            }
          : asg
      )
    );
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
          announcements={recentAnnouncements}
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
              examinations={upcomingExaminations}
              announcements={recentAnnouncements}
              activities={recentAcademicActivities}
              onNavigateTab={handleSelectTab}
              onOpenCourse={(c) => setSelectedCourseForModal(c)}
              onOpenSubmitAssignment={(a) => setAssignmentForSubmit(a)}
            />
          )}

          {activeTab === "profile" && (
            <MyProfileSection
              profile={profile}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
            />
          )}

          {activeTab === "academics" && (
            <AcademicOverviewSection profile={profile} />
          )}

          {activeTab === "courses" && (
            <MyCoursesSection
              courses={enrolledCourses}
              onOpenCourseModal={(c) => setSelectedCourseForModal(c)}
              searchFilter={searchQuery}
            />
          )}

          {activeTab === "registration" && (
            <CourseRegistrationSection
              availableCourses={availableCourses}
              enrolledCourses={enrolledCourses}
              onRegisterCourse={handleRegisterCourse}
              onDropCourse={handleDropCourse}
            />
          )}

          {activeTab === "schedule" && (
            <ClassScheduleSection />
          )}

          {activeTab === "attendance" && (
            <AttendanceSection courses={enrolledCourses} />
          )}

          {activeTab === "assignments" && (
            <AssignmentsSection
              assignments={assignments}
              onOpenSubmitModal={(a) => setAssignmentForSubmit(a)}
              onOpenViewModal={(a) => setAssignmentForView(a)}
              searchFilter={searchQuery}
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
