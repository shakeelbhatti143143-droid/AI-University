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
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
} from "@/components/admin/credential";

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
      <CredentialCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#8a8272] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8a8272]" />
                Institutional Governance
              </span>
              <span className="text-xs text-[#4a4335]">•</span>
              <span className="text-xs font-semibold text-[#8a8272]">Security & Auditing Engine</span>
            </div>
            <h2 className="text-2xl font-serif font-medium text-[#F2EEE4] tracking-tight">
              System Administration & Audit Logs
            </h2>
            <p className="text-xs text-[#8a8272] mt-1">
              Monitor administrative audit trails, manage user permissions, and maintain role-based access control.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-[#0e0d0b] p-1 rounded-[6px] border border-[#4a4335] self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab("audit-logs")}
              className={cn(
                "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5",
                activeSubTab === "audit-logs"
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335] font-semibold"
                  : "text-[#8a8272] hover:text-[#F2EEE4]"
              )}
            >
              <History className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>Audit Logs ({auditLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("user-management")}
              className={cn(
                "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5",
                activeSubTab === "user-management"
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335] font-semibold"
                  : "text-[#8a8272] hover:text-[#F2EEE4]"
              )}
            >
              <Users className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>Administrators ({administrators.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("security")}
              className={cn(
                "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5",
                activeSubTab === "security"
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335] font-semibold"
                  : "text-[#8a8272] hover:text-[#F2EEE4]"
              )}
            >
              <Lock className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>RBAC Roles</span>
            </button>

            <button
              onClick={() => setActiveSubTab("settings")}
              className={cn(
                "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5",
                activeSubTab === "settings"
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335] font-semibold"
                  : "text-[#8a8272] hover:text-[#F2EEE4]"
              )}
            >
              <Settings className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </CredentialCard>

      {/* ------------------------------------------------------------- */}
      {/* 1. AUDIT LOGS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "audit-logs" && (
        <CredentialCard>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-serif font-medium text-[#F2EEE4] tracking-wide">
                Immutable Administrative Activity Log
              </h3>
              <p className="text-xs text-[#8a8272]">
                All course creation, mark publishing, and status changes are permanently recorded.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#8a8272] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#C9A25B]"
              />
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8a8272]">
              No audit records matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[6px] border border-[#4a4335]">
              <table className="w-full text-left text-xs text-[#D8D3C6]">
                <thead className="bg-[#0e0d0b] text-[10px] uppercase font-mono tracking-wider text-[#8a8272] border-b border-[#4a4335]">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Administrator</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Event Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4a4335]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#23201b]/50">
                      <td className="py-2.5 px-3 text-[#8a8272] font-mono text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3 font-serif text-[#F2EEE4]">{log.adminName}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono">
                          <span
                            className={cn(
                              "w-[7px] h-[7px] rounded-full",
                              log.actionType === "publish" || log.actionType === "approve"
                                ? "bg-[#7DAE7A]"
                                : log.actionType === "reject" || log.actionType === "delete"
                                ? "bg-[#E27878]"
                                : "bg-[#B8963E]"
                            )}
                          />
                          <span className="uppercase text-[#D8D3C6]">{log.actionType}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#D8D3C6]">{log.module}</td>
                      <td className="py-2.5 px-3 text-[#8a8272]">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CredentialCard>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ADMINISTRATORS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "user-management" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {administrators.map((a) => (
            <CredentialCard key={a.id}>
              <CredentialHeader
                eyebrow="ADMINISTRATOR"
                referenceId={a.role || "SUPER_ADMIN"}
              />
              <CredentialTitle
                title={a.name}
                subheading={a.department || "Institutional Administration"}
              />
              <CredentialDetailList>
                <CredentialDetailRow label="Official Email" value={a.email} isLink />
                <CredentialDetailRow label="Authority Role" value={a.role || "Super Admin"} />
                <CredentialDetailRow
                  label="Clearance Status"
                  value={a.status === "suspended" ? "Suspended" : "Active Clearance"}
                />
              </CredentialDetailList>
              <CredentialFooter
                status={{
                  label: a.status === "suspended" ? "Suspended" : "Active Clearance",
                  state: a.status === "suspended" ? "danger" : "success",
                }}
                primaryAction={{
                  label: a.status === "suspended" ? "Restore Clearance" : "Suspend Access",
                  onClick: () =>
                    onUpdateAccountStatus(
                      a.id,
                      a.status === "suspended" ? "active" : "suspended"
                    ),
                }}
              />
            </CredentialCard>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ROLES & PERMISSIONS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "security" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CredentialCard>
            <CredentialHeader eyebrow="SECURITY TIER 1" referenceId="SUPER_ADMIN" />
            <CredentialTitle
              title="System Super Admin"
              subheading="Campus-wide root authority"
            />
            <p className="text-xs text-[#8a8272] leading-relaxed my-3">
              Unrestricted access to user management, database audit logs, system configuration, and campus wide broadcasting.
            </p>
            <CredentialFooter
              status={{ label: "Active Role", state: "neutral" }}
            />
          </CredentialCard>

          <CredentialCard>
            <CredentialHeader eyebrow="SECURITY TIER 2" referenceId="ADMIN" />
            <CredentialTitle
              title="Campus Registrar"
              subheading="Academic records governance"
            />
            <p className="text-xs text-[#8a8272] leading-relaxed my-3">
              Manages course catalogs, registration add/drop approvals, examination rosters, and officially publishes student marks.
            </p>
            <CredentialFooter
              status={{ label: "Active Role", state: "neutral" }}
            />
          </CredentialCard>

          <CredentialCard>
            <CredentialHeader eyebrow="SECURITY TIER 3" referenceId="FACULTY" />
            <CredentialTitle
              title="Faculty Instructor"
              subheading="Classroom & coursework"
            />
            <p className="text-xs text-[#8a8272] leading-relaxed my-3">
              Records classroom attendance, issues course assignments, and submits student examination evaluations for administrative review.
            </p>
            <CredentialFooter
              status={{ label: "Active Role", state: "neutral" }}
            />
          </CredentialCard>

          <CredentialCard>
            <CredentialHeader eyebrow="SECURITY TIER 4" referenceId="STUDENT" />
            <CredentialTitle
              title="Enrolled Student"
              subheading="Academic portal clearance"
            />
            <p className="text-xs text-[#8a8272] leading-relaxed my-3">
              Registers for offered courses, accesses timetable schedules, submits digital assignments, and views published transcripts.
            </p>
            <CredentialFooter
              status={{ label: "Active Role", state: "neutral" }}
            />
          </CredentialCard>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "settings" && (
        <CredentialCard className="max-w-xl">
          <CredentialHeader eyebrow="CONFIGURATION" referenceId="ISB-CAMPUS" />
          <CredentialTitle
            title="Campus Configuration"
            subheading="Chak Shehzad Institutional Node"
          />
          <div className="space-y-4 text-xs mt-4">
            <div>
              <label className="block font-medium text-[#8a8272] mb-1">Campus Title</label>
              <input
                type="text"
                readOnly
                value="Iqra University, Chak Shehzad Campus, Islamabad"
                className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] text-[#F2EEE4]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#8a8272] mb-1">Active Academic Term</label>
              <input
                type="text"
                readOnly
                value="Fall 2026 Academic Session"
                className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] text-[#F2EEE4]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#8a8272] mb-1">Database Cloud Cluster</label>
              <input
                type="text"
                readOnly
                value="Convex Enterprise Backend (small-lobster-75)"
                className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] font-mono text-[#D8D3C6]"
              />
            </div>
          </div>
          <CredentialFooter
            status={{ label: "Production Online", state: "success" }}
          />
        </CredentialCard>
      )}
    </div>
  );
};



