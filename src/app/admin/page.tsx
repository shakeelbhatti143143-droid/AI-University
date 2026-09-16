"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AccessDenied } from "@/components/admin/AccessDenied";

import {
  AdminStudent,
  AdminCourse,
  RegistrationPeriod,
  RegistrationRequest,
  AdminScheduleSlot,
  AdminAttendanceLog,
  AdminAssignment,
  AdminSubmission,
  AuditLog,
  initialRegistrationPeriod,
} from "@/lib/admin-data";

import { AdminDashboardOverview } from "@/components/admin/sections/AdminDashboardOverview";
import { AdminStudentsSection } from "@/components/admin/sections/AdminStudentsSection";
import { AdminFacultySection } from "@/components/admin/sections/AdminFacultySection";
import { AdminDepartmentsProgramsSection } from "@/components/admin/sections/AdminDepartmentsProgramsSection";
import { AdminCoursesSection } from "@/components/admin/sections/AdminCoursesSection";
import { AdminRegistrationSection } from "@/components/admin/sections/AdminRegistrationSection";
import { AdminScheduleSection } from "@/components/admin/sections/AdminScheduleSection";
import { AdminAttendanceSection } from "@/components/admin/sections/AdminAttendanceSection";
import { AdminAssignmentsSection } from "@/components/admin/sections/AdminAssignmentsSection";
import { AdminExaminationsSection } from "@/components/admin/sections/AdminExaminationsSection";
import { AdminResultsGradesSection } from "@/components/admin/sections/AdminResultsGradesSection";
import { AdminAcademicRecordsSection } from "@/components/admin/sections/AdminAcademicRecordsSection";
import { AdminCommunicationSection } from "@/components/admin/sections/AdminCommunicationSection";
import { AdminAiManagementSection } from "@/components/admin/sections/AdminAiManagementSection";
import { AdminAiAcademicAssistantSection } from "@/components/admin/sections/AdminAiAcademicAssistantSection";
import { AdminSystemSection } from "@/components/admin/sections/AdminSystemSection";
import { AdminProfileSection } from "@/components/admin/sections/AdminProfileSection";
import { AdminPendingApplicationsSection } from "@/components/admin/sections/AdminPendingApplicationsSection";
import { AdminVideosSection } from "@/components/admin/sections/AdminVideosSection";
import { AdminWebsiteManagementSection } from "@/components/admin/sections/AdminWebsiteManagementSection";

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

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    router.push(`/admin?tab=${tab}`);
  };

  // -------------------------------------------------------------
  // Live Convex Data Stores
  // -------------------------------------------------------------
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [scheduleSlots, setScheduleSlots] = useState<AdminScheduleSlot[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AdminAttendanceLog[]>([]);
  const [assignments, setAssignments] = useState<AdminAssignment[]>([]);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [examinations, setExaminations] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [administrators, setAdministrators] = useState<any[]>([]);
  const [registrationPeriod, setRegistrationPeriod] = useState<RegistrationPeriod>(initialRegistrationPeriod);

  // Load all live database records from Convex
  const refreshAllData = useCallback(async () => {
    try {
      const client = getConvexClient();
      if (!client || !isConvexConfigured) return;

      // Pending applications
      try {
        const pending = await client.query(api.applications.getPendingApplications, {});
        if (pending) setPendingApplicationsCount(pending.length);
      } catch (e) {
        console.warn("Could not fetch pending applications:", e);
      }

      // Students
      try {
        const stList = await client.query(api.academicManagement.getStudentsList, {});
        if (stList) {
          setStudents(
            stList.map((s) => ({
              id: s.id,
              studentId: s.studentId,
              name: s.name,
              email: s.email,
              phone: "+92 51 111 264 264",
              program: s.program,
              department: s.department,
              campus: s.campus,
              batch: s.batch,
              semester: s.semester,
              semesterNumber: s.semesterNumber,
              status: s.status,
              cgpa: s.cgpa,
              currentGpa: s.currentGpa,
              completedCreditHours: s.completedCreditHours,
              totalCreditHours: s.totalCreditHours,
              remainingCreditHours: s.remainingCreditHours,
              academicStanding: s.cgpa >= 3.5 ? "Dean's Honor Roll" : "Good Standing",
              attendancePercentage: 95,
              warningsCount: s.cgpa > 0 && s.cgpa < 2.0 ? 1 : 0,
              enrolledCourseCodes: s.enrolledCourseCodes,
              enrollmentDate: new Date(s.createdAt).toLocaleDateString(),
              emergencyContact: "+92 300 5551234",
              cnic: "61101-1234567-1",
            }))
          );
        }
      } catch (e) {
        console.warn("Could not fetch students list:", e);
      }

      // Faculty
      try {
        const fac = await client.query(api.academicManagement.getFacultyMembers, {});
        if (fac) setFacultyList(fac);
      } catch (e) {
        console.warn("Could not fetch faculty list:", e);
      }

      // Departments & Programs
      try {
        const depts = await client.query(api.academicManagement.getDepartments, {});
        if (depts) setDepartments(depts);
        const progs = await client.query(api.academicManagement.getAcademicPrograms, {});
        if (progs) setPrograms(progs);
      } catch (e) {
        console.warn("Could not fetch depts & progs:", e);
      }

      // Courses
      try {
        const crs = await client.query(api.academicManagement.getCourses, {});
        if (crs) {
          setCourses(
            crs.map((c) => ({
              id: c._id,
              code: c.code,
              title: c.name,
              department: c.department,
              departmentId: (c as any).departmentId,
              program: (c as any).program,
              programId: (c as any).programId,
              creditHours: c.creditHours,
              semester: c.semester,
              instructor: c.facultyName || "TBA",
              instructorId: (c as any).instructorId || (c as any).facultyId,
              instructorEmail: `${(c.facultyName || "faculty").toLowerCase().replace(/[^a-z]/g, "")}@isb.iqra.edu.pk`,
              enrolledCount: 0,
              capacity: 45,
              status: c.status,
              schedule: "Mon, Wed • 10:00 AM - 11:30 AM",
              classroom: "Lab 204",
              building: "Computing Department",
              attendanceRate: 92,
              assignmentCount: 3,
              prerequisites: c.prerequisites,
              description: c.description,
            }))
          );
        }
      } catch (e) {
        console.warn("Could not fetch courses:", e);
      }

      // Course Sections
      try {
        const sec = await client.query(api.academicManagement.getCourseSections, {});
        if (sec) setSections(sec);
      } catch (e) {
        console.warn("Could not fetch sections:", e);
      }

      // Registration Requests
      try {
        const reqs = await client.query(api.academicManagement.getRegistrationRequests, {});
        if (reqs) {
          setRegistrationRequests(
            reqs.map((r: any) => ({
              id: r._id,
              studentId: r.enrollmentId || r.studentId,
              studentName: r.studentName,
              studentEmail: r.studentEmail,
              department: r.department || "Academic Department",
              program: r.program || "Degree Program",
              semester: r.semesterNumber || parseInt(String(r.semester).replace(/[^0-9]/g, ""), 10) || 1,
              cgpa: 3.5,
              courseId: r.courseId,
              courseCode: r.courseCode,
              courseTitle: r.courseTitle,
              creditHours: r.creditHours,
              section: "A",
              type: "Add",
              reason: "Regular Course Registration",
              status: r.status as any,
              requestedAt: new Date(r.registeredAt).toLocaleDateString(),
              reviewedBy: r.reviewedBy,
              reviewedAt: r.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString() : undefined,
              remarks: r.remarks,
            }))
          );
        }
      } catch (e) {
        console.warn("Could not fetch registration requests:", e);
      }

      // Class Schedules
      try {
        const sch = await client.query(api.academicManagement.getClassSchedules, {});
        if (sch) {
          setScheduleSlots(
            sch.map((s) => ({
              id: s._id,
              courseCode: s.courseCode,
              courseTitle: s.courseTitle,
              instructor: s.facultyName,
              day: s.day as any,
              startTime: s.startTime,
              endTime: s.endTime,
              classroom: s.room,
              building: s.building,
              section: s.section,
              type: s.type,
            }))
          );
        }
      } catch (e) {
        console.warn("Could not fetch schedules:", e);
      }

      // Assignments
      try {
        const asgs = await client.query(api.academicManagement.getAssignments, {});
        if (asgs) {
          setAssignments(
            asgs.map((a) => ({
              id: a._id,
              title: a.title,
              courseCode: a.courseCode,
              courseTitle: a.courseTitle,
              instructor: a.facultyName,
              dueDate: a.dueDate,
              dueTime: a.dueTime,
              totalMarks: a.totalMarks,
              status: a.status,
              weightage: a.weightage,
              description: a.description,
            }))
          );
        }
      } catch (e) {
        console.warn("Could not fetch assignments:", e);
      }

      // Examinations
      try {
        const exms = await client.query(api.academicManagement.getExaminations, {});
        if (exms) setExaminations(exms);
      } catch (e) {
        console.warn("Could not fetch examinations:", e);
      }

      // Academic Results
      try {
        const rslts = await client.query(api.academicManagement.getAcademicResults, {});
        if (rslts) setResults(rslts);
      } catch (e) {
        console.warn("Could not fetch results:", e);
      }

      // Announcements
      try {
        const anns = await client.query(api.academicManagement.getAnnouncements, {});
        if (anns) setAnnouncements(anns);
      } catch (e) {
        console.warn("Could not fetch announcements:", e);
      }

      // Audit Logs
      try {
        const logs = await client.query(api.academicManagement.getAuditLogs, {});
        if (logs) {
          setAuditLogs(
            logs.map((l) => ({
              id: l._id,
              timestamp: new Date(l.timestamp).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              adminName: l.adminName,
              adminEmail: l.adminEmail,
              actionType: l.actionType as any,
              module: l.module,
              details: l.details,
            }))
          );
        }
      } catch (e) {
        console.warn("Could not fetch audit logs:", e);
      }

      // Administrators
      try {
        const adms = await client.query(api.academicManagement.getAdministratorsList, {});
        if (adms) setAdministrators(adms);
      } catch (e) {
        console.warn("Could not fetch administrators:", e);
      }
    } catch (err) {
      console.warn("Failed to load admin data:", err);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
    const interval = setInterval(refreshAllData, 8000);
    return () => clearInterval(interval);
  }, [refreshAllData]);

  // -------------------------------------------------------------
  // Role-Based Access Control Guard
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
  // CRUD Action Handlers (Calling Live Convex Backend)
  // -------------------------------------------------------------
  const handleCreateFaculty = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      const result = await client.mutation(api.academicManagement.createFacultyMemberWithAccount, {
        ...data,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
      return result;
    }
  };

  const handleResetFacultyPassword = async (facultyId: string, newPassword: string) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.adminResetFacultyPassword, {
        facultyId: facultyId as any,
        newPassword,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleEditFaculty = async (facultyId: string, data: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateFacultyMember, {
        facultyId: facultyId as any,
        ...data,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleDeleteFaculty = async (facultyId: string) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.deleteFacultyMember, {
        facultyId: facultyId as any,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleAssignFacultyToCourse = async (courseId: string, facultyId: string, facultyName: string) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.assignFacultyToCourse, {
        courseId: courseId as any,
        facultyId,
        facultyName,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleUpdateFacultyStatus = async (facultyId: string, status: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateFacultyStatus, {
        facultyId: facultyId as any,
        status,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleCreateDepartment = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.createDepartment, data);
      await refreshAllData();
    }
  };

  const handleCreateProgram = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.createAcademicProgram, data);
      await refreshAllData();
    }
  };

  const handleAddCourse = async (newCourseData: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.createCourse, {
        code: newCourseData.code,
        name: newCourseData.title || newCourseData.name,
        description: newCourseData.description || "Foundational subject.",
        creditHours: newCourseData.creditHours || 3,
        department: newCourseData.department,
        departmentId: newCourseData.departmentId,
        program: newCourseData.program,
        programId: newCourseData.programId,
        degreeProgramId: newCourseData.degreeProgramId || newCourseData.programId,
        semester: newCourseData.semester || 1,
        prerequisites: newCourseData.prerequisites || [],
        facultyId: newCourseData.facultyId || newCourseData.instructorId,
        instructorId: newCourseData.instructorId,
        facultyName: newCourseData.instructor || newCourseData.facultyName,
        status: newCourseData.status || "Active",
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleUpdateCourse = async (courseId: string, updatedData: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateCourse, {
        courseId: courseId as any,
        code: updatedData.code,
        name: updatedData.title || updatedData.name,
        description: updatedData.description,
        creditHours: updatedData.creditHours,
        department: updatedData.department,
        departmentId: updatedData.departmentId,
        program: updatedData.program,
        programId: updatedData.programId,
        degreeProgramId: updatedData.degreeProgramId || updatedData.programId,
        semester: updatedData.semester,
        instructorId: updatedData.instructorId,
        facultyId: updatedData.facultyId || updatedData.instructorId,
        facultyName: updatedData.instructor || updatedData.facultyName,
        status: updatedData.status,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.deleteCourse, {
        courseId: courseId as any,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleApproveRegistration = async (requestId: string) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateRegistrationStatus, {
        registrationId: requestId as any,
        decision: "Approved",
        remarks: "Approved by Registrar Office",
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleRejectRegistration = async (requestId: string) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateRegistrationStatus, {
        registrationId: requestId as any,
        decision: "Rejected",
        remarks: "Rejected by Administration",
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleCreateExamination = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.createExamination, data);
      await refreshAllData();
    }
  };

  const handleSaveResult = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.saveAcademicResult, data);
      await refreshAllData();
    }
  };

  const handleUpdateResultStatus = async (resultId: string, status: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateResultPublishStatus, {
        resultId: resultId as any,
        status,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleCreateAnnouncement = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.createAnnouncement, data);
      await refreshAllData();
    }
  };

  const handleUpdateAnnouncement = async (data: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateAnnouncement, data);
      await refreshAllData();
    }
  };

  const handleUpdateAnnouncementStatus = async (
    id: string,
    status: "Published" | "Draft" | "Archived"
  ) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateAnnouncementStatus, {
        id: id as any,
        status,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleUpdateAnnouncementVisibility = async (
    id: string,
    visibility: "PUBLIC" | "INTERNAL"
  ) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateAnnouncementVisibility, {
        id: id as any,
        visibility,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleToggleAnnouncementFeatured = async (id: string, isFeatured: boolean) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.toggleAnnouncementFeatured, {
        id: id as any,
        isFeatured,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.deleteAnnouncement, {
        id: id as any,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  const handleUpdateAccountStatus = async (userId: string, status: any) => {
    const client = getConvexClient();
    if (client) {
      await client.mutation(api.academicManagement.updateUserAccountStatus, {
        userId: userId as any,
        status,
        adminName: user.name,
        adminEmail: user.email,
      });
      await refreshAllData();
    }
  };

  // Prepare student academic records for transcript section
  const studentAcademicRecords = students.map((st) => {
    const stResults = results.filter((r) => r.studentId === st.id && r.status === "Published");
    let tqp = 0;
    let tch = 0;
    stResults.forEach((r) => {
      tqp += r.gradePoints * r.creditHours;
      tch += r.creditHours;
    });
    const cgpa = tch > 0 ? Number((tqp / tch).toFixed(2)) : 0.0;

    return {
      id: st.id,
      name: st.name,
      studentId: st.studentId,
      email: st.email,
      department: st.department,
      program: st.program,
      cgpa,
      completedCredits: tch,
      results: stResults.map((r) => ({
        courseCode: r.courseCode,
        courseTitle: r.courseTitle,
        creditHours: r.creditHours,
        grade: r.grade,
        gradePoints: r.gradePoints,
        totalMarks: r.totalMarks,
        percentage: r.percentage,
        status: r.grade !== "F" ? "Passed" : "Failed",
        semester: r.semester,
      })),
    };
  });

  const pendingRegistrationsCount = registrationRequests.filter((r) => r.status === "Pending").length;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-row overflow-x-hidden selection:bg-iqra-blue-600 selection:text-white">
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        pendingApplicationsCount={pendingApplicationsCount}
        pendingRegistrationsCount={pendingRegistrationsCount}
        onLogout={logout}
      />

      {/* 2. Main Workplace Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <AdminHeader
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={logout}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* DASHBOARD */}
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

          {/* PEOPLE */}
          {activeTab === "students" && (
            <AdminStudentsSection
              students={students}
              searchFilter={globalSearch}
              onAddStudent={() => {}}
              onUpdateStudent={() => {}}
              onDeleteStudent={() => {}}
            />
          )}

          {activeTab === "faculty" && (
            <AdminFacultySection
              facultyList={facultyList}
              departments={departments}
              courses={courses}
              onCreateFaculty={handleCreateFaculty}
              onUpdateStatus={handleUpdateFacultyStatus}
              onResetPassword={handleResetFacultyPassword}
              onEditFaculty={handleEditFaculty}
              onDeleteFaculty={handleDeleteFaculty}
              onAssignCourse={handleAssignFacultyToCourse}
            />
          )}

          {activeTab === "administrators" && (
            <AdminSystemSection
              initialTab="user-management"
              auditLogs={auditLogs}
              administrators={administrators}
              onUpdateAccountStatus={handleUpdateAccountStatus}
            />
          )}

          {activeTab === "applications" && <AdminPendingApplicationsSection />}
          {activeTab === "videos" && <AdminVideosSection />}

          {/* ACADEMICS */}
          {activeTab === "departments" && (
            <AdminDepartmentsProgramsSection
              initialTab="departments"
              departments={departments}
              programs={programs}
              onCreateDepartment={handleCreateDepartment}
              onCreateProgram={handleCreateProgram}
            />
          )}

          {activeTab === "programs" && (
            <AdminDepartmentsProgramsSection
              initialTab="programs"
              departments={departments}
              programs={programs}
              onCreateDepartment={handleCreateDepartment}
              onCreateProgram={handleCreateProgram}
            />
          )}

          {(activeTab === "courses" || activeTab === "course-sections" || activeTab === "academics") && (
            <AdminCoursesSection
              courses={courses}
              students={students}
              departments={departments}
              programs={programs}
              facultyList={facultyList}
              searchFilter={globalSearch}
              onAddCourse={handleAddCourse}
              onUpdateCourse={handleUpdateCourse}
              onDeleteCourse={handleDeleteCourse}
              onNavigateTab={handleTabChange}
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === "registration" && (
            <AdminRegistrationSection
              period={registrationPeriod}
              requests={registrationRequests}
              courses={courses}
              students={students}
              onTogglePeriod={() => {}}
              onApproveRequest={handleApproveRegistration}
              onRejectRequest={handleRejectRegistration}
              onManualRegister={() => {}}
              onDropStudent={() => {}}
            />
          )}

          {activeTab === "schedule" && (
            <AdminScheduleSection
              slots={scheduleSlots}
              courses={courses}
              onAddSlot={() => {}}
              onUpdateSlot={() => {}}
              onDeleteSlot={() => {}}
            />
          )}

          {activeTab === "attendance" && (
            <AdminAttendanceSection
              logs={attendanceLogs}
              students={students}
              courses={courses}
              onAddLog={() => {}}
              onDeleteLog={() => {}}
            />
          )}

          {activeTab === "assignments" && (
            <AdminAssignmentsSection
              assignments={assignments}
              submissions={submissions}
              courses={courses}
              onAddAssignment={() => {}}
              onUpdateAssignment={() => {}}
              onDeleteAssignment={() => {}}
              onUpdateSubmission={() => {}}
              onDeleteSubmission={() => {}}
            />
          )}

          {/* EXAMINATIONS */}
          {(activeTab === "exams" || activeTab === "exam-schedule" || activeTab === "exam-rooms") && (
            <AdminExaminationsSection
              examinations={examinations}
              courses={courses}
              onCreateExamination={handleCreateExamination}
            />
          )}

          {activeTab === "results" && (
            <AdminResultsGradesSection
              results={results}
              students={students}
              courses={courses}
              onSaveResult={handleSaveResult}
              onUpdateStatus={handleUpdateResultStatus}
            />
          )}

          {/* ACADEMIC RECORDS */}
          {activeTab === "progression" && (
            <AdminAcademicRecordsSection
              initialTab="progression"
              students={studentAcademicRecords}
            />
          )}

          {activeTab === "transcripts" && (
            <AdminAcademicRecordsSection
              initialTab="transcripts"
              students={studentAcademicRecords}
            />
          )}

          {activeTab === "gpa-cgpa" && (
            <AdminAcademicRecordsSection
              initialTab="gpa-cgpa"
              students={studentAcademicRecords}
            />
          )}

          {activeTab === "reports" && (
            <AdminAcademicRecordsSection
              initialTab="reports"
              students={studentAcademicRecords}
            />
          )}

          {/* COMMUNICATION */}
          {(activeTab === "announcements" || activeTab === "notifications") && (
            <AdminCommunicationSection
              initialTab={activeTab === "notifications" ? "notifications" : "announcements"}
              announcements={announcements}
              onCreateAnnouncement={handleCreateAnnouncement}
              onUpdateAnnouncement={handleUpdateAnnouncement}
              onUpdateStatus={handleUpdateAnnouncementStatus}
              onUpdateVisibility={handleUpdateAnnouncementVisibility}
              onToggleFeatured={handleToggleAnnouncementFeatured}
              onDeleteAnnouncement={handleDeleteAnnouncement}
            />
          )}

          {/* AI & LEARNING */}
          {activeTab === "ai-academic-assistant" && (
            <AdminAiAcademicAssistantSection
              existingDepartments={departments}
              existingPrograms={programs}
              existingCourses={courses}
              onRefreshData={refreshAllData}
              onNavigateTab={handleTabChange}
            />
          )}

          {(activeTab === "ai-assistant" ||
            activeTab === "ai-planner" ||
            activeTab === "ai-analytics") && (
            <AdminAiManagementSection
              coursesCount={courses.length}
              examsCount={examinations.length}
              assignmentsCount={assignments.length}
            />
          )}

          {/* SYSTEM */}
          {activeTab === "user-management" && (
            <AdminSystemSection
              initialTab="user-management"
              auditLogs={auditLogs}
              administrators={administrators}
              onUpdateAccountStatus={handleUpdateAccountStatus}
            />
          )}

          {activeTab === "security" && (
            <AdminSystemSection
              initialTab="security"
              auditLogs={auditLogs}
              administrators={administrators}
              onUpdateAccountStatus={handleUpdateAccountStatus}
            />
          )}

          {activeTab === "audit-logs" && (
            <AdminSystemSection
              initialTab="audit-logs"
              auditLogs={auditLogs}
              administrators={administrators}
              onUpdateAccountStatus={handleUpdateAccountStatus}
            />
          )}

          {activeTab === "settings" && (
            <AdminSystemSection
              initialTab="settings"
              auditLogs={auditLogs}
              administrators={administrators}
              onUpdateAccountStatus={handleUpdateAccountStatus}
            />
          )}

          {activeTab === "profile" && <AdminProfileSection />}

          {/* UNIVERSITY WEBSITE MANAGEMENT */}
          {activeTab === "website-posts" && (
            <AdminWebsiteManagementSection initialTab="posts" />
          )}

          {activeTab === "website-events" && (
            <AdminWebsiteManagementSection initialTab="events" />
          )}

          {activeTab === "website-gallery" && (
            <AdminWebsiteManagementSection initialTab="gallery" />
          )}

          {activeTab === "website-fees" && (
            <AdminWebsiteManagementSection initialTab="fees" />
          )}

          {activeTab === "website-facilities" && (
            <AdminWebsiteManagementSection initialTab="facilities" />
          )}

          {activeTab === "website-location" && (
            <AdminWebsiteManagementSection initialTab="location" />
          )}

          {activeTab === "website-profile" && (
            <AdminWebsiteManagementSection initialTab="profile" />
          )}

          {activeTab === "videos" && <AdminVideosSection />}
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
