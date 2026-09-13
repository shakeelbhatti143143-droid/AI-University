"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  History,
  Settings,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  actionType: "create" | "update" | "delete" | "status_change" | "approve" | "reject" | "publish" | "unpublish";
  module: string;
  details: string;
}

interface Administrator {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  createdAt: number;
}

interface AdminSystemSectionProps {
  initialTab?: "user-management" | "security" | "audit-logs" | "settings";
  auditLogs: AuditLog[];
  administrators: Administrator[];
  onUpdateAccountStatus: (userId: string, status: "active" | "suspended") => Promise<void>;
}

export const AdminSystemSection: React.FC<AdminSystemSectionProps> = ({
  initialTab = "audit-logs",
  auditLogs,
  administrators,
  onUpdateAccountStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "user-management" | "security" | "audit-logs" | "settings"
  >(initialTab);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-700" />
              Institutional Governance
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Security & Auditing Engine</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            System Administration & Audit Logs
          </h2>
          <p className="text-xs text-slate-500">
            Monitor administrative audit trails, manage user permissions, and maintain role-based access control.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab("audit-logs")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "audit-logs"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <History className="w-3.5 h-3.5 text-iqra-blue-600" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("user-management")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "user-management"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Administrators ({administrators.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("security")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "security"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>RBAC Roles</span>
          </button>

          <button
            onClick={() => setActiveSubTab("settings")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "settings"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Settings className="w-3.5 h-3.5 text-slate-600" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. AUDIT LOGS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "audit-logs" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black font-heading text-slate-900 uppercase tracking-wider">
                Immutable Administrative Activity Log
              </h3>
              <p className="text-xs text-slate-500">
                All course creation, mark publishing, and status changes are permanently recorded.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No audit records matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Administrator</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Event Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{log.adminName}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                            log.actionType === "publish" || log.actionType === "approve"
                              ? "bg-emerald-100 text-emerald-800"
                              : log.actionType === "create"
                                ? "bg-blue-100 text-blue-800"
                                : log.actionType === "reject" || log.actionType === "delete"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-100 text-slate-700"
                          )}
                        >
                          {log.actionType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{log.module}</td>
                      <td className="py-2.5 px-3 text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ADMINISTRATORS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "user-management" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-black font-heading text-slate-900 uppercase tracking-wider">
            Authorized System Administrators
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {administrators.map((a) => (
              <div
                key={a.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900">{a.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-iqra-gold-400 text-slate-950">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 font-mono mt-0.5">{a.email}</p>
                  <p className="text-xs text-slate-500 mt-1">{a.department}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Clearance
                  </span>
                  <span className="text-slate-400">Full System Access</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ROLES & PERMISSIONS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "security" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 inline-block">
              SUPER_ADMIN
            </span>
            <h4 className="text-base font-bold text-slate-900">System Super Admin</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unrestricted access to user management, database audit logs, system configuration, and campus wide broadcasting.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 inline-block">
              ADMIN
            </span>
            <h4 className="text-base font-bold text-slate-900">Campus Registrar</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Manages course catalogs, registration add/drop approvals, examination rosters, and officially publishes student marks.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-900 inline-block">
              FACULTY
            </span>
            <h4 className="text-base font-bold text-slate-900">Faculty Instructor</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Records classroom attendance, issues course assignments, and submits student examination evaluations for administrative review.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 inline-block">
              STUDENT
            </span>
            <h4 className="text-base font-bold text-slate-900">Enrolled Student</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Registers for offered courses, accesses timetable schedules, submits digital assignments, and views published transcripts.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "settings" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 max-w-xl">
          <h3 className="text-sm font-black font-heading text-slate-900 uppercase tracking-wider">
            Campus Configuration
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Campus Title</label>
              <input
                type="text"
                readOnly
                value="Iqra University, Chak Shehzad Campus, Islamabad"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Active Academic Term</label>
              <input
                type="text"
                readOnly
                value="Fall 2026 Academic Session"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Database Cloud Cluster</label>
              <input
                type="text"
                readOnly
                value="Convex Enterprise Backend (small-lobster-75)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
