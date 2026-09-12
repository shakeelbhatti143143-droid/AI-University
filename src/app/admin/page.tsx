"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AccessDenied } from "@/components/admin/AccessDenied";

import {
  initialAdminStudents,
  initialAdminCourses,
  initialRegistrationPeriod,
  initialRegistrationRequests,
  initialAdminSchedule,
  initialAdminAttendanceLogs,
  initialAdminAssignments,
  initialAdminSubmissions,
  initialAuditLogs,
  AdminStudent,
  AdminCourse,
  RegistrationPeriod,
  RegistrationRequest,
  AdminScheduleSlot,
  AdminAttendanceLog,
  AdminAssignment,
  AdminSubmission,
  AuditLog,
} from "@/lib/admin-data";

import { AdminDashboardOverview } from "@/components/admin/sections/AdminDashboardOverview";
import { AdminStudentsSection } from "@/components/admin/sections/AdminStudentsSection";
import { AdminCoursesSection } from "@/components/admin/sections/AdminCoursesSection";
import { AdminRegistrationSection } from "@/components/admin/sections/AdminRegistrationSection";
import { AdminScheduleSection } from "@/components/admin/sections/AdminScheduleSection";
import { AdminAttendanceSection } from "@/components/admin/sections/AdminAttendanceSection";
import { AdminAssignmentsSection } from "@/components/admin/sections/AdminAssignmentsSection";
import { AdminProfileSection } from "@/components/admin/sections/AdminProfileSection";
import { AdminReportsSection } from "@/components/admin/sections/AdminReportsSection";
import { AdminPendingApplicationsSection } from "@/components/admin/sections/AdminPendingApplicationsSection";
import { AdminVideosSection } from "@/components/admin/sections/AdminVideosSection";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";
import { Loader2 } from "lucide-react";

function AdminPortalContent() {
  const { user, logout, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active navigation tab & layout state
  const tabParam = (searchParams.get("tab") as AdminTab) || "dashboard";
  const [activeTab, setActiveTab] = useState<AdminTab>(tabParam);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // Synchronize tab state with URL query parameter
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    router.push(`/admin?tab=${tab}`);
  };

  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);

  // Fetch live pending applications count from Convex
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const client = getConvexClient();
        if (client && isConvexConfigured) {
          const pending = await client.query(api.applications.getPendingApplications, {});
          if (pending) {
            setPendingApplicationsCount(pending.length);
          }
        }
      } catch (err) {
        console.warn("Could not fetch pending count:", err);
      }
    };
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 10000);
    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // Central State Data Stores (Live in-memory state with CRUD)
  // -------------------------------------------------------------
  const [students, setStudents] = useState<AdminStudent[]>(initialAdminStudents);
  const [courses, setCourses] = useState<AdminCourse[]>(initialAdminCourses);
  const [registrationPeriod, setRegistrationPeriod] = useState<RegistrationPeriod>(initialRegistrationPeriod);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>(initialRegistrationRequests);
  const [scheduleSlots, setScheduleSlots] = useState<AdminScheduleSlot[]>(initialAdminSchedule);
  const [attendanceLogs, setAttendanceLogs] = useState<AdminAttendanceLog[]>(initialAdminAttendanceLogs);
  const [assignments, setAssignments] = useState<AdminAssignment[]>(initialAdminAssignments);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>(initialAdminSubmissions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Helper to append audit logs
  const logAuditAction = (
    actionType: "create" | "update" | "delete" | "status_change" | "approve" | "reject",
    module: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      adminName: user?.name || "Shakeel Bhatti",
      adminEmail: user?.email || "shakeelbhatti143143@gmail.com",
      actionType,
      module,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // -------------------------------------------------------------
  // Role-Based Access Control (RBAC) Guard
  // -------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-iqra-gold-400 mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-400">
          Verifying Administrative Clearance...
        </p>
      </div>
    );
  }

  // Strictly block unauthorized students or unauthenticated users
  if (!user || user.role !== "admin") {
    return (
      <AccessDenied
        userRole={user?.role}
        userEmail={user?.email}
        onLogout={logout}
      />
    );
  }

  // -------------------------------------------------------------
  // CRUD Action Handlers
  // -------------------------------------------------------------

  // Students CRUD
  const handleAddStudent = (newStudentData: Omit<AdminStudent, "id">) => {
    const newStudent: AdminStudent = {
      ...newStudentData,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    logAuditAction("create", "Student Records", `Enrolled new student: ${newStudent.name} (${newStudent.studentId})`);
  };

  const handleUpdateStudent = (id: string, updated: Partial<AdminStudent>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    const st = students.find((s) => s.id === id);
    logAuditAction("update", "Student Records", `Updated profile/records for student ${st?.name || id}`);
  };

  const handleDeleteStudent = (id: string) => {
    const st = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (st) {
      logAuditAction("delete", "Student Records", `Removed student: ${st.name} (${st.studentId})`);
    }
  };

  // Courses CRUD
  const handleAddCourse = (newCourseData: Omit<AdminCourse, "id">) => {
    const newCourse: AdminCourse = {
      ...newCourseData,
      id: `crs-${Date.now()}`,
    };
    setCourses((prev) => [newCourse, ...prev]);
    logAuditAction("create", "Course Management", `Created course: ${newCourse.code} - ${newCourse.title}`);
  };

  const handleUpdateCourse = (id: string, updated: Partial<AdminCourse>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    const crs = courses.find((c) => c.id === id);
    logAuditAction("update", "Course Management", `Updated syllabus/instructor for ${crs?.code || id}`);
  };

  const handleDeleteCourse = (id: string) => {
    const crs = courses.find((c) => c.id === id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    if (crs) {
      logAuditAction("delete", "Course Management", `Decommissioned course: ${crs.code} - ${crs.title}`);
    }
  };

  // Course Registration Handlers
  const handleToggleRegistrationPeriod = (isOpen: boolean) => {
    setRegistrationPeriod((prev) => ({
      ...prev,
      isOpen,
    }));
    logAuditAction(
      "status_change",
      "Registration Controller",
      `Registration portal ${isOpen ? "OPENED" : "CLOSED"} for ${registrationPeriod.session}`
    );
  };

  const handleApproveRegistration = (requestId: string) => {
    const req = registrationRequests.find((r) => r.id === requestId);
    setRegistrationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "Approved" } : r))
    );
    if (req) {
      logAuditAction(
        "approve",
        "Course Registration",
        `Approved registration for ${req.studentName} (${req.studentId}) in ${req.courseCode}`
      );
    }
  };

  const handleRejectRegistration = (requestId: string) => {
    const req = registrationRequests.find((r) => r.id === requestId);
    setRegistrationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "Rejected" } : r))
    );
    if (req) {
      logAuditAction(
        "reject",
        "Course Registration",
        `Rejected registration for ${req.studentName} (${req.studentId}) in ${req.courseCode}`
      );
    }
  };

  const handleManualRegister = (studentId: string, courseCode: string, section: string) => {
    const student = students.find((s) => s.id === studentId || s.studentId === studentId);
    const course = courses.find((c) => c.code === courseCode);
    if (student && course) {
      setRegistrationRequests((prev) => [
        {
          id: `req-${Date.now()}`,
          studentId: student.studentId,
          studentName: student.name,
          courseCode: course.code,
          courseTitle: course.title,
          creditHours: course.creditHours,
          section,
          requestedAt: new Date().toLocaleDateString("en-GB"),
          status: "Approved",
          remarks: "Administrative direct enrollment by Shakeel Bhatti",
        },
        ...prev,
      ]);
      logAuditAction(
        "approve",
        "Course Registration",
        `Direct administrative enrollment for ${student.name} in ${course.code} (Section ${section})`
      );
    }
  };

  const handleDropStudent = (studentId: string, courseCode: string) => {
    setRegistrationRequests((prev) =>
      prev.filter((r) => !(r.studentId === studentId && r.courseCode === courseCode))
    );
    logAuditAction("delete", "Course Registration", `Dropped ${studentId} from ${courseCode}`);
  };

  // Schedule Handlers
  const handleAddScheduleSlot = (slotData: Omit<AdminScheduleSlot, "id">) => {
    const newSlot: AdminScheduleSlot = {
      ...slotData,
      id: `sch-${Date.now()}`,
    };
    setScheduleSlots((prev) => [...prev, newSlot]);
    logAuditAction(
      "create",
      "Schedule & Timetable",
      `Allocated slot: ${newSlot.courseCode} on ${newSlot.day} (${newSlot.startTime} - ${newSlot.endTime}) in ${newSlot.classroom}`
    );
  };

  const handleUpdateScheduleSlot = (id: string, updated: Partial<AdminScheduleSlot>) => {
    setScheduleSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    logAuditAction("update", "Schedule & Timetable", `Updated slot schedule for slot ID ${id}`);
  };

  const handleDeleteScheduleSlot = (id: string) => {
    const slot = scheduleSlots.find((s) => s.id === id);
    setScheduleSlots((prev) => prev.filter((s) => s.id !== id));
    if (slot) {
      logAuditAction(
        "delete",
        "Schedule & Timetable",
        `De-allocated slot: ${slot.courseCode} on ${slot.day} in ${slot.classroom}`
      );
    }
  };

  // Attendance Handlers
  const handleAddAttendanceLog = (logData: Omit<AdminAttendanceLog, "id">) => {
    const newLog: AdminAttendanceLog = {
      ...logData,
      id: `attl-${Date.now()}`,
    };
    setAttendanceLogs((prev) => [newLog, ...prev]);
    logAuditAction(
      "create",
      "Attendance Management",
      `Recorded lecture attendance for ${newLog.courseCode} (${newLog.presentCount} present, ${newLog.absentCount} absent)`
    );
  };

  const handleDeleteAttendanceLog = (id: string) => {
    const log = attendanceLogs.find((l) => l.id === id);
    setAttendanceLogs((prev) => prev.filter((l) => l.id !== id));
    if (log) {
      logAuditAction(
        "delete",
        "Attendance Management",
        `Removed lecture record #${id} for ${log.courseCode}`
      );
    }
  };

  // Assignments Handlers
  const handleAddAssignment = (asgData: Omit<AdminAssignment, "id">) => {
    const newAsg: AdminAssignment = {
      ...asgData,
      id: `adm-asg-${Date.now()}`,
    };
    setAssignments((prev) => [newAsg, ...prev]);
    logAuditAction("create", "Assignments", `Published assignment: "${newAsg.title}" for ${newAsg.courseCode}`);
  };

  const handleUpdateAssignment = (id: string, updated: Partial<AdminAssignment>) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
    const asg = assignments.find((a) => a.id === id);
    logAuditAction("update", "Assignments", `Updated assignment criteria for ${asg?.title || id}`);
  };

  const handleDeleteAssignment = (id: string) => {
    const asg = assignments.find((a) => a.id === id);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    if (asg) {
      logAuditAction("delete", "Assignments", `Removed assignment: "${asg.title}"`);
    }
  };

  const handleUpdateSubmission = (submissionId: string, updated: Partial<AdminSubmission>) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, ...updated } : s))
    );
    const sub = submissions.find((s) => s.id === submissionId);
    logAuditAction(
      "update",
      "Grade Override",
      `Modified evaluation/grade for submission by ${sub?.studentName || submissionId}`
    );
  };

  const handleDeleteSubmission = (submissionId: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    logAuditAction("delete", "Submissions", `Removed submission record #${submissionId}`);
  };

  // Badge counters
  const pendingRegistrationsCount = registrationRequests.filter((r) => r.status === "Pending").length;
  const warningsCount = students.filter((s) => s.warningsCount > 0 || s.status === "Probation").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-iqra-gold-500/20 selection:text-iqra-gold-200">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        pendingApplicationsCount={pendingApplicationsCount}
        pendingRegistrationsCount={pendingRegistrationsCount}
        warningsCount={warningsCount}
        onLogout={logout}
      />

      {/* Main Administrative Workplace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Sticky Executive Admin Header */}
        <AdminHeader
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={logout}
        />

        {/* Dynamic Section Router View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === "dashboard" && (
            <AdminDashboardOverview
              students={students}
              courses={courses}
              registrationRequests={registrationRequests}
              auditLogs={auditLogs}
              onNavigateTab={handleTabChange}
              onApproveRegistration={handleApproveRegistration}
              onRejectRegistration={handleRejectRegistration}
            />
          )}

          {activeTab === "applications" && (
            <AdminPendingApplicationsSection />
          )}

          {activeTab === "videos" && (
            <AdminVideosSection />
          )}

          {(activeTab === "students" || activeTab === "academics") && (
            <AdminStudentsSection
              students={students}
              searchFilter={globalSearch}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {activeTab === "courses" && (
            <AdminCoursesSection
              courses={courses}
              students={students}
              searchFilter={globalSearch}
              onAddCourse={handleAddCourse}
              onUpdateCourse={handleUpdateCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === "registration" && (
            <AdminRegistrationSection
              period={registrationPeriod}
              requests={registrationRequests}
              courses={courses}
              students={students}
              onTogglePeriod={handleToggleRegistrationPeriod}
              onApproveRequest={handleApproveRegistration}
              onRejectRequest={handleRejectRegistration}
              onManualRegister={handleManualRegister}
              onDropStudent={handleDropStudent}
            />
          )}

          {activeTab === "schedule" && (
            <AdminScheduleSection
              slots={scheduleSlots}
              courses={courses}
              onAddSlot={handleAddScheduleSlot}
              onUpdateSlot={handleUpdateScheduleSlot}
              onDeleteSlot={handleDeleteScheduleSlot}
            />
          )}

          {activeTab === "attendance" && (
            <AdminAttendanceSection
              logs={attendanceLogs}
              students={students}
              courses={courses}
              onAddLog={handleAddAttendanceLog}
              onDeleteLog={handleDeleteAttendanceLog}
            />
          )}

          {activeTab === "assignments" && (
            <AdminAssignmentsSection
              assignments={assignments}
              submissions={submissions}
              courses={courses}
              onAddAssignment={handleAddAssignment}
              onUpdateAssignment={handleUpdateAssignment}
              onDeleteAssignment={handleDeleteAssignment}
              onUpdateSubmission={handleUpdateSubmission}
              onDeleteSubmission={handleDeleteSubmission}
            />
          )}

          {(activeTab === "profile" || activeTab === "security") && (
            <AdminProfileSection />
          )}

          {activeTab === "reports" && (
            <AdminReportsSection auditLogs={auditLogs} />
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Institutional System Settings</h2>
                <p className="text-sm text-slate-400 mb-6">
                  Configure global academic parameters, grading curves, HEC threshold criteria, and automated notifications for Iqra University Chak Shehzad campus.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <h3 className="text-sm font-semibold text-white mb-1">HEC Attendance Policy</h3>
                    <p className="text-xs text-slate-400 mb-3">Strict 75% minimum attendance requirement before semester final exam debarment.</p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Enforced (75% Minimum)
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <h3 className="text-sm font-semibold text-white mb-1">Academic Warning Cutoff</h3>
                    <p className="text-xs text-slate-400 mb-3">Undergraduate CGPA threshold triggering automatic academic probation notice.</p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      CGPA &lt; 2.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick controller for registration window */}
              <AdminRegistrationSection
                period={registrationPeriod}
                requests={registrationRequests}
                courses={courses}
                students={students}
                onTogglePeriod={handleToggleRegistrationPeriod}
                onApproveRequest={handleApproveRegistration}
                onRejectRequest={handleRejectRegistration}
                onManualRegister={handleManualRegister}
                onDropStudent={handleDropStudent}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <Loader2 className="w-10 h-10 animate-spin text-iqra-gold-400 mb-4" />
          <p className="text-sm font-semibold tracking-wide text-slate-400">
            Loading Iqra University Administration Portal...
          </p>
        </div>
      }
    >
      <AdminPortalContent />
    </Suspense>
  );
}
