"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { FacultySidebar, FacultyTab } from "@/components/faculty/FacultySidebar";
import { FacultyHeader } from "@/components/faculty/FacultyHeader";
import { FacultyOverviewSection } from "@/components/faculty/sections/FacultyOverviewSection";
import { FacultyCoursesSection } from "@/components/faculty/sections/FacultyCoursesSection";
import { FacultyScheduleSection } from "@/components/faculty/sections/FacultyScheduleSection";
import { FacultyStudentsSection } from "@/components/faculty/sections/FacultyStudentsSection";
import { FacultyAttendanceSection } from "@/components/faculty/sections/FacultyAttendanceSection";
import { FacultyAssignmentsSection } from "@/components/faculty/sections/FacultyAssignmentsSection";
import { FacultyExaminationsSection } from "@/components/faculty/sections/FacultyExaminationsSection";
import { FacultyResultsSection } from "@/components/faculty/sections/FacultyResultsSection";
import { FacultyAnnouncementsSection } from "@/components/faculty/sections/FacultyAnnouncementsSection";
import { FacultyResourcesSection } from "@/components/faculty/sections/FacultyResourcesSection";
import { FacultySettingsSection } from "@/components/faculty/sections/FacultySettingsSection";
import { Shield, Sparkles } from "lucide-react";

const FACULTY_TABS = new Set<FacultyTab>([
  "overview", "courses", "schedule", "students", "attendance", "assignments",
  "exams", "results", "announcements", "resources", "settings",
]);

function isFacultyTab(value: string | null): value is FacultyTab {
  return value !== null && FACULTY_TABS.has(value as FacultyTab);
}

function FacultyDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, isLoading: isAuthLoading, logout } = useAuth();

  const tabParam = searchParams.get("tab");
  const activeTab: FacultyTab = isFacultyTab(tabParam) ? tabParam : "overview";
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Live Convex Data State
  const [facultyData, setFacultyData] = useState<any>({
    faculty: {
      fullName: user?.name || "Faculty Member",
      email: user?.universityEmail || user?.email || "faculty@iqra.edu.pk",
      employeeId: "FAC-2026-1042",
      department: user?.department || "Department of Computing & Artificial Intelligence",
      designation: "Assistant Professor",
      phone: "+92 51 111 264 264",
      officeLocation: "Faculty Block B, Office 201",
      officeHours: "Mon-Thu 11:00 AM - 01:00 PM",
      status: "Active",
      specialization: "Artificial Intelligence & Distributed Systems",
      qualification: "Ph.D. in Computer Science",
    },
    courses: [],
    sections: [],
    schedules: [],
    students: [],
    attendance: [],
    assignments: [],
    submissions: [],
    examinations: [],
    results: [],
    announcements: [],
  });

  // Sync tab with URL parameter
  const handleSelectTab = (tab: FacultyTab) => {
    router.push(`/faculty/dashboard?tab=${tab}`);
  };

  // Role-Based Route Guard
  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const role = (user.role || "").toLowerCase();
    if (role === "admin" || role === "super_admin") {
      router.replace("/admin");
      return;
    }
    if (role !== "faculty" && role !== "teacher") {
      router.replace("/login");
      return;
    }
  }, [user, isAuthLoading, router]);

  // Fetch Live Faculty Dashboard Data from Convex
  const refreshFacultyData = async () => {
    try {
      const client = getConvexClient();
      if (client) {
        const liveData = await client.query(api.academicManagement.getFacultyDashboardData, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
        });

        if (liveData) {
          setFacultyData(liveData);
        }
      }
    } catch (err) {
      console.warn("Could not fetch live faculty data:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user) {
      refreshFacultyData();
    }
  }, [user, token, isAuthLoading]);

  // Live Mutation Handlers
  const handleRecordAttendance = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      const res = await client.mutation(api.academicManagement.facultyRecordAttendance, data);
      await refreshFacultyData();
      return res;
    }
  };

  const handleCreateAssignment = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      const res = await client.mutation(api.academicManagement.facultyCreateAssignment, data);
      await refreshFacultyData();
      return res;
    }
  };

  const handleGradeSubmission = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      const res = await client.mutation(api.academicManagement.facultyGradeSubmission, data);
      await refreshFacultyData();
      return res;
    }
  };

  const handleSaveResult = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      const res = await client.mutation(api.academicManagement.facultySaveStudentResult, data);
      await refreshFacultyData();
      return res;
    }
  };

  const handlePostAnnouncement = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      const res = await client.mutation(api.academicManagement.facultyPostAnnouncement, data);
      await refreshFacultyData();
      return res;
    }
  };

  const isFaculty = ["faculty", "teacher"].includes((user?.role || "").toLowerCase());
  if (isAuthLoading || !user || !isFaculty || (isDataLoading && !facultyData.faculty.fullName)) {
    return (
      <div className="min-h-screen bg-[#0B1528] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 animate-spin">
          <div className="w-full h-full bg-[#0B1528] rounded-[14px] flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <div className="text-sm font-bold tracking-wider uppercase text-slate-300">
          Loading Faculty Portal...
        </div>
      </div>
    );
  }

  const tabTitles: Record<FacultyTab, string> = {
    overview: "Faculty Dashboard Overview",
    courses: "My Assigned Courses",
    schedule: "Class Timetable & Schedule",
    students: "Enrolled Student Roster",
    attendance: "Class Attendance Register",
    assignments: "Coursework & Evaluation",
    exams: "Examinations & Date Sheet",
    results: "Academic Results & Marks Entry",
    announcements: "Notices & Announcements",
    resources: "Teaching Resources & Policy",
    settings: "Faculty Settings & Password",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR NAVIGATION */}
      <FacultySidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        facultyName={facultyData.faculty.fullName}
        designation={facultyData.faculty.designation}
        department={facultyData.faculty.department}
        onLogout={logout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* MAIN VIEWPORT */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* TOP HEADER */}
        <FacultyHeader
          facultyName={facultyData.faculty.fullName}
          designation={facultyData.faculty.designation}
          department={facultyData.faculty.department}
          universityEmail={facultyData.faculty.email}
          activeTabTitle={tabTitles[activeTab]}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={logout}
          announcementsCount={facultyData.announcements?.length || 0}
        />

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <FacultyOverviewSection
              faculty={facultyData.faculty}
              courses={facultyData.courses}
              sections={facultyData.sections}
              schedules={facultyData.schedules}
              students={facultyData.students}
              assignments={facultyData.assignments}
              submissions={facultyData.submissions}
              announcements={facultyData.announcements}
              onNavigateTab={handleSelectTab}
            />
          )}

          {activeTab === "courses" && (
            <FacultyCoursesSection
              courses={facultyData.courses}
              sections={facultyData.sections}
              onNavigateTab={handleSelectTab}
            />
          )}

          {activeTab === "schedule" && (
            <FacultyScheduleSection schedules={facultyData.schedules} />
          )}

          {activeTab === "students" && (
            <FacultyStudentsSection
              students={facultyData.students}
              courses={facultyData.courses}
            />
          )}

          {activeTab === "attendance" && (
            <FacultyAttendanceSection
              courses={facultyData.courses}
              sections={facultyData.sections}
              students={facultyData.students}
              attendanceRecords={facultyData.attendance}
              facultyName={facultyData.faculty.fullName}
              onRecordAttendance={handleRecordAttendance}
            />
          )}

          {activeTab === "assignments" && (
            <FacultyAssignmentsSection
              assignments={facultyData.assignments}
              submissions={facultyData.submissions}
              courses={facultyData.courses}
              facultyName={facultyData.faculty.fullName}
              onCreateAssignment={handleCreateAssignment}
              onGradeSubmission={handleGradeSubmission}
            />
          )}

          {activeTab === "exams" && (
            <FacultyExaminationsSection examinations={facultyData.examinations} />
          )}

          {activeTab === "results" && (
            <FacultyResultsSection
              courses={facultyData.courses}
              students={facultyData.students}
              results={facultyData.results}
              facultyName={facultyData.faculty.fullName}
              onSaveResult={handleSaveResult}
            />
          )}

          {activeTab === "announcements" && (
            <FacultyAnnouncementsSection
              announcements={facultyData.announcements}
              courses={facultyData.courses}
              facultyName={facultyData.faculty.fullName}
              department={facultyData.faculty.department}
              onPostAnnouncement={handlePostAnnouncement}
            />
          )}

          {activeTab === "resources" && <FacultyResourcesSection />}

          {activeTab === "settings" && (
            <FacultySettingsSection faculty={facultyData.faculty} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function FacultyDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1528] flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
          Initializing Faculty Portal...
        </div>
      }
    >
      <FacultyDashboardContent />
    </Suspense>
  );
}
