"use client";

import React from "react";
import {
  Users,
  BookOpen,
  FolderPlus,
  CheckCircle2,
  FileText,
  Clock,
  Activity,
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

  const totalStudents = students.length + appCounts.approved;
  const activeCourses = courses.filter((c) => c.status === "Active").length;
  const totalCourses = courses.length;
  const pendingRegistrations = registrationRequests.filter((r) => r.status === "Pending");

  const kpiCards = [
    {
      label: "Pending Admissions",
      value: appCounts.pending,
      sub: appCounts.pending > 0 ? "Awaiting decision" : "All reviewed",
      icon: Clock,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      tab: "applications" as AdminTab,
    },
    {
      label: "Approved",
      value: appCounts.approved,
      sub: "Admitted candidates",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      tab: "applications" as AdminTab,
    },
    {
      label: "Total Applicants",
      value: appCounts.total,
      sub: "Session 2026",
      icon: FileText,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      tab: "applications" as AdminTab,
    },
    {
      label: "Total Students",
      value: totalStudents,
      sub: `${totalStudents} Active Students`,
      icon: Users,
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      tab: "students" as AdminTab,
    },
    {
      label: "Active Courses",
      value: totalCourses,
      sub: `${activeCourses} In Catalog`,
      icon: BookOpen,
      iconColor: "text-cyan-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      tab: "courses" as AdminTab,
    },
    {
      label: "Add/Drop Requests",
      value: pendingRegistrations.length,
      sub: pendingRegistrations.length > 0 ? "Pending action" : "Zero pending",
      icon: FolderPlus,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      tab: "registration" as AdminTab,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Chak Shehzad Campus, Islamabad • Central Administration Portal
          </div>
          <h2 className="font-black text-[26px] sm:text-[32px] leading-tight tracking-tight text-white">
            University Executive Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Institutional oversight for student admissions, academic standing, course offerings, and compliance for the Fall 2026 academic term.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 font-mono text-emerald-400 text-[11px]">
              <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 animate-pulse shrink-0" />
              Systems Operational
            </span>
            <span className="px-2.5 py-1 rounded-lg border border-white/20 bg-white/5 font-mono text-slate-300 text-[11px]">
              Session: Fall 2026 Active
            </span>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab("applications")}
            className="h-[36px] px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-2 transition-colors"
          >
            <Clock className="w-4 h-4 text-amber-300" />
            <span>Pending Admissions ({appCounts.pending})</span>
          </button>

          <button
            onClick={() => onNavigateTab("students")}
            className="h-[36px] px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-2 transition-colors"
          >
            <Users className="w-4 h-4 text-blue-300" />
            <span>Registered Students ({totalStudents})</span>
          </button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={() => onNavigateTab(card.tab)}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 leading-tight">
                  {card.label}
                </span>
                <div className={`w-7 h-7 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                </div>
              </div>
              <span className="text-[28px] font-black leading-none text-slate-800 block">
                {card.value}
              </span>
              <p className="text-[10px] font-mono mt-1.5 text-slate-400">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Enrollment Trends */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-[17px] text-slate-800">Student Enrollment Trajectory</h3>
              <p className="text-[11px] text-slate-400">Chak Shehzad Campus Session Admissions (2023 – 2026)</p>
            </div>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50">
              +18.4% YoY Growth
            </span>
          </div>

          <div className="pt-2 pb-1">
            <div className="h-44 flex items-end justify-between gap-2 px-1 border-b border-slate-100">
              {[
                { session: "Fall '23", count: 980, height: 69 },
                { session: "Spr '24", count: 1120, height: 78 },
                { session: "Fall '24", count: 1240, height: 87 },
                { session: "Spr '25", count: 1310, height: 92 },
                { session: "Fall '25", count: 1360, height: 95 },
                { session: "Fall '26", count: 1420, height: 100 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-mono font-medium text-slate-400 group-hover:text-slate-700 transition-colors">
                    {bar.count}
                  </span>
                  <div className="w-full max-w-[42px] h-full flex items-end">
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${bar.height}%`,
                        backgroundColor: idx === 5 ? "#2563eb" : "#e2e8f0",
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-center text-slate-400 mt-1">{bar.session}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: CGPA Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-[17px] text-slate-800">CGPA Bell-Curve Distribution</h3>
              <p className="text-[11px] text-slate-400">Active Student Academic Audit (1,420 students)</p>
            </div>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50">
              Median: 3.38
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { range: "3.50 – 4.00 (Dean's Honor / Medallists)", count: 485, percent: 34, color: "#16a34a" },
              { range: "3.00 – 3.49 (Good Academic Standing)", count: 590, percent: 41, color: "#2563eb" },
              { range: "2.50 – 2.99 (Satisfactory Standing)", count: 245, percent: 17, color: "#94a3b8" },
              { range: "2.00 – 2.49 (At-Risk Monitoring)", count: 86, percent: 6, color: "#f59e0b" },
              { range: "< 2.00 (Academic Probation Warning)", count: 14, percent: 2, color: "#dc2626" },
            ].map((d, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{d.range}</span>
                  <span className="font-mono font-bold text-slate-700">{d.count} ({d.percent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${d.percent}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SPLIT FEEDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Registration Requests */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-[17px] text-slate-800">
                Registration Requests ({pendingRegistrations.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("registration")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Manage All →
            </button>
          </div>

          <div className="space-y-3">
            {pendingRegistrations.length > 0 ? (
              pendingRegistrations.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                        {req.courseCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">{req.studentName}</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400">
                      {req.studentId} • Sec {req.section || "A"} ({req.creditHours} Cr)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onApproveRegistration(req.id)}
                      className="h-[28px] px-3 text-[11px] font-bold rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onRejectRegistration(req.id)}
                      className="h-[28px] px-3 text-[11px] font-bold rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-400 rounded-xl bg-slate-50 border border-slate-100">
                No pending registration requests.
              </div>
            )}
          </div>
        </div>

        {/* Administrative Audit Feed */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-[17px] text-slate-800">Administrative Audit Trail</h3>
            </div>
            <button
              onClick={() => onNavigateTab("reports")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Full Audit Trail →
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold uppercase tracking-wider text-slate-600">{log.module}</span>
                  <span className="font-mono text-slate-400">{log.timestamp}</span>
                </div>
                <p className="leading-snug text-slate-700">{log.details}</p>
                <div className="text-[10px] text-slate-400">
                  Executed by: <strong className="text-slate-600">{log.adminName}</strong>
                </div>
              </div>
            ))}

            {auditLogs.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400 rounded-xl bg-slate-50 border border-slate-100">
                No audit log entries yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
