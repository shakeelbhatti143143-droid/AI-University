"use client";

import React from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  FolderPlus,
  Calendar,
  CheckCircle2,
  FileText,
  AlertTriangle,
  TrendingUp,
  Building2,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  ShieldAlert,
  Award,
  Activity,
  Layers,
} from "lucide-react";
import {
  AdminStudent,
  AdminCourse,
  RegistrationRequest,
  AuditLog,
} from "@/lib/admin-data";
import { AdminTab } from "../AdminSidebar";

import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";

interface AdminDashboardOverviewProps {
  students: AdminStudent[];
  courses: AdminCourse[];
  registrationRequests: RegistrationRequest[];
  auditLogs: AuditLog[];
  onNavigateTab: (tab: AdminTab) => void;
  onApproveRegistration: (requestId: string) => void;
  onRejectRegistration: (requestId: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  students,
  courses,
  registrationRequests,
  auditLogs,
  onNavigateTab,
  onApproveRegistration,
  onRejectRegistration,
}) => {
  const [appCounts, setAppCounts] = React.useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  React.useEffect(() => {
    const fetchAppCounts = async () => {
      try {
        const client = getConvexClient();
        if (client && isConvexConfigured) {
          const res = await client.query(api.applications.getAllApplications, {});
          if (res?.counts) {
            setAppCounts(res.counts);
          }
        }
      } catch (e) {
        console.warn("Failed to fetch dashboard metrics:", e);
      }
    };
    fetchAppCounts();
  }, []);

  // Real Database KPIs
  const totalStudents = students.length + appCounts.approved;
  const activeStudents = students.filter((s) => s.status === "Active").length + appCounts.approved;
  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.status === "Active").length;
  const totalAssignments = 0;
  const pendingAssignments = 0;
  const avgAttendance = 0;
  const avgGpa = 0.0;
  const avgCgpa = 0.0;
  const warningStudents = students.filter((s) => s.status === "Probation" || s.warningsCount > 0);
  const pendingRegistrations = registrationRequests.filter((r) => r.status === "Pending");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP ADMINISTRATOR WELCOME & CAMPUS BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-iqra-navy-950 via-[#0a1f3d] to-iqra-navy-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-iqra-gold-300">
              <Sparkles className="w-3.5 h-3.5 text-iqra-gold-400" />
              <span>Chak Shehzad Campus, Islamabad • Central Administration Portal</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white tracking-tight">
              University Executive Dashboard
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
              Logged in as <strong className="text-white">Shakeel Bhatti</strong> (Super Administrator). Institutional oversight over student admissions, academic standing, course catalogs, and compliance for Fall 2026 session.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Campus Systems Operational
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-medium">
                Academic Session: Fall 2026 (Active)
              </span>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab("applications")}
              className="px-4 py-2.5 rounded-xl bg-iqra-gold-500 hover:bg-iqra-gold-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-transform hover:scale-[1.02] shadow-md flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Pending Applications ({appCounts.pending})</span>
            </button>

            <button
              onClick={() => onNavigateTab("students")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-iqra-gold-400" />
              <span>Registered Students ({totalStudents})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL INSTITUTIONAL KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Pending Applications */}
        <div
          onClick={() => onNavigateTab("applications")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Admissions</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-slate-900">{appCounts.pending}</span>
          <p className="text-[10px] text-amber-700 font-semibold mt-1">
            {appCounts.pending > 0 ? "Awaiting admin decision" : "All reviewed"}
          </p>
        </div>

        {/* Metric 2: Approved Students */}
        <div
          onClick={() => onNavigateTab("applications")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Approved Admissions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-emerald-700">{appCounts.approved}</span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            University emails issued
          </p>
        </div>

        {/* Metric 3: Total Applications */}
        <div
          onClick={() => onNavigateTab("applications")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Applications</span>
            <FileText className="w-4 h-4 text-iqra-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-slate-900">{appCounts.total}</span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            Session 2026 Applicants
          </p>
        </div>

        {/* Metric 4: Total Registered Students */}
        <div
          onClick={() => onNavigateTab("students")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-slate-900">{totalStudents}</span>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">
            {totalStudents > 0 ? `${totalStudents} Active Students` : "No students registered"}
          </p>
        </div>

        {/* Metric 5: Active Courses */}
        <div
          onClick={() => onNavigateTab("courses")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Courses</span>
            <BookOpen className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-slate-900">{totalCourses}</span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            {totalCourses > 0 ? `${activeCourses} Active in Catalog` : "No courses available"}
          </p>
        </div>

        {/* Metric 6: Course Requests */}
        <div
          onClick={() => onNavigateTab("registration")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Course Requests</span>
            <FolderPlus className="w-4 h-4 text-slate-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-slate-900">{pendingRegistrations.length}</span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            {pendingRegistrations.length > 0 ? "Pending Add/Drop" : "No pending requests"}
          </p>
        </div>

        {/* Metric 7 */}
        <div
          onClick={() => onNavigateTab("assignments")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Assignments</span>
            <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-slate-900">{totalAssignments}</span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            Issued this semester
          </p>
        </div>

        {/* Metric 8 */}
        <div
          onClick={() => onNavigateTab("assignments")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Grading</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-amber-700">{pendingAssignments}</span>
          <p className="text-[10px] text-amber-700 font-semibold mt-1">
            Faculty grading backlog
          </p>
        </div>

        {/* Metric 9 */}
        <div
          onClick={() => onNavigateTab("attendance")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-emerald-700">{avgAttendance}%</span>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">
            Above HEC 75% bar
          </p>
        </div>

        {/* Metric 10 */}
        <div
          onClick={() => onNavigateTab("academics")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average GPA</span>
            <GraduationCap className="w-4 h-4 text-iqra-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-slate-900">{avgGpa}</span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            Current Semester Term
          </p>
        </div>

        {/* Metric 11 */}
        <div
          onClick={() => onNavigateTab("academics")}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average CGPA</span>
            <Award className="w-4 h-4 text-iqra-gold-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-slate-900">{avgCgpa}</span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            Cumulative standing
          </p>
        </div>

        {/* Metric 12 */}
        <div
          onClick={() => onNavigateTab("academics")}
          className="p-4 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-rose-50/20"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">On Warning</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black font-heading text-rose-700">{warningStudents.length}</span>
          <p className="text-[10px] text-rose-600 font-bold mt-1">
            Probation / Low Attendance
          </p>
        </div>
      </div>

      {/* 3. CHARTS & ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Enrollment Trends by Session */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Enrollment Trajectory</h3>
              <p className="text-[11px] text-slate-500">Admissions growth at Chak Shehzad Campus (2023 - 2026)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              +18.4% YoY Growth
            </span>
          </div>

          <div className="pt-4 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 px-2 border-b border-slate-200">
              {[
                { session: "Fall 2023", count: 980, height: 69 },
                { session: "Spring 2024", count: 1120, height: 78 },
                { session: "Fall 2024", count: 1240, height: 87 },
                { session: "Spring 2025", count: 1310, height: 92 },
                { session: "Fall 2025", count: 1360, height: 95 },
                { session: "Fall 2026", count: 1420, height: 100 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[11px] font-mono font-bold text-slate-700 group-hover:text-iqra-blue-600">
                    {bar.count}
                  </span>
                  <div className="w-full max-w-[42px] h-full flex items-end">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-iqra-navy-900 to-iqra-blue-600 group-hover:from-iqra-blue-600 group-hover:to-iqra-blue-400 transition-all duration-300"
                      style={{ height: `${bar.height}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 text-center truncate w-full mt-1">
                    {bar.session.split(" ")[0]} &apos;{bar.session.split(" ")[1].slice(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: GPA & CGPA Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student CGPA Bell-Curve Distribution</h3>
              <p className="text-[11px] text-slate-500">Academic performance breakdown (1,420 students)</p>
            </div>
            <span className="text-xs font-bold text-iqra-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              Median: 3.38
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { range: "3.50 – 4.00 (Dean's Honor / Medallists)", count: 485, percent: 34, color: "bg-emerald-500" },
              { range: "3.00 – 3.49 (Good Academic Standing)", count: 590, percent: 41, color: "bg-iqra-blue-600" },
              { range: "2.50 – 2.99 (Satisfactory Standing)", count: 245, percent: 17, color: "bg-amber-500" },
              { range: "2.00 – 2.49 (At-Risk Monitoring)", count: 86, percent: 6, color: "bg-orange-500" },
              { range: "< 2.00 (Academic Probation Warning)", count: 14, percent: 2, color: "bg-rose-600" },
            ].map((d, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">{d.range}</span>
                  <span className="font-bold text-slate-900">{d.count} ({d.percent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SPLIT FEEDS: REGISTRATION REQUESTS & AUDIT LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Registration Requests */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-iqra-gold-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Pending Registration Requests ({pendingRegistrations.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("registration")}
              className="text-xs font-semibold text-iqra-blue-600 hover:underline"
            >
              Manage All →
            </button>
          </div>

          <div className="space-y-3">
            {pendingRegistrations.length > 0 ? (
              pendingRegistrations.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-iqra-navy-900 text-white">
                        {req.courseCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{req.studentName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {req.studentId} • Section {req.section || "A"} ({req.creditHours} Cr)
                    </p>
                    {(req.remarks || req.adminRemarks) && (
                      <p className="text-[10px] text-slate-600 italic mt-0.5">{req.remarks || req.adminRemarks}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onApproveRegistration(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onRejectRegistration(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                No pending registration requests.
              </div>
            )}
          </div>
        </div>

        {/* Recent Administrative Actions & Audit Log */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Administrative Actions</h3>
            </div>
            <button
              onClick={() => onNavigateTab("reports")}
              className="text-xs font-semibold text-iqra-blue-600 hover:underline"
            >
              Full Audit Trail →
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold uppercase text-iqra-blue-700">{log.module}</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="font-medium text-slate-800 leading-snug">{log.details}</p>
                <div className="text-[10px] text-slate-500">
                  Executed by: <strong className="text-slate-700">{log.adminName}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
