"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Filter,
  FileText,
  Printer,
  Calendar,
  Layers,
} from "lucide-react";
import { AuditLog } from "@/lib/admin-data";
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
} from "@/components/admin/credential";

interface AdminReportsSectionProps {
  auditLogs: AuditLog[];
}

export const AdminReportsSection: React.FC<AdminReportsSectionProps> = ({ auditLogs }) => {
  const reportsList = [
    {
      id: "rep-1",
      title: "Semester Academic Standing & Performance Audit",
      description: "Complete grade point average distribution, Dean's honor roll candidates, and academic probation list for Fall 2026.",
      category: "Academic",
      generatedDate: "09-Sep-2026",
      format: "PDF & CSV",
    },
    {
      id: "rep-2",
      title: "HEC 75% Attendance Compliance Roster",
      description: "Official examination clearance list identifying students eligible vs disqualified based on terminal attendance criteria.",
      category: "Compliance",
      generatedDate: "08-Sep-2026",
      format: "PDF",
    },
    {
      id: "rep-3",
      title: "Course Registration & Capacity Saturation Ledger",
      description: "Breakdown of all 48 course offerings, seat utilization, add/drop statistics, and waiting list demands.",
      category: "Enrollment",
      generatedDate: "07-Sep-2026",
      format: "Excel / CSV",
    },
    {
      id: "rep-4",
      title: "Faculty Coursework & Assessment Timeline",
      description: "Assignment submission rates, pending grading queues, and midterm exam hall allocations.",
      category: "Faculty",
      generatedDate: "05-Sep-2026",
      format: "PDF",
    },
  ];

  const handleDownload = (title: string) => {
    alert(`Generating institutional report: "${title}"...\nFormat: PDF / CSV\nDispatched to download folder.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <CredentialCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#8a8272] flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#8a8272]" />
                Institutional Audit & Governance
              </span>
              <span className="text-xs text-[#4a4335]">•</span>
              <span className="text-xs font-semibold text-[#8a8272]">Chak Shehzad, Islamabad</span>
            </div>
            <h2 className="text-2xl font-serif font-medium text-[#F2EEE4] tracking-tight">
              Reports, Compliance & System Audit Trail
            </h2>
            <p className="text-xs text-[#8a8272] mt-1">
              Generate HEC-certified transcripts, attendance rosters, and review chronological administrative actions.
            </p>
          </div>
        </div>
      </CredentialCard>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((rep) => (
          <CredentialCard key={rep.id}>
            <CredentialHeader
              eyebrow={rep.category}
              referenceId={rep.generatedDate}
            />
            <CredentialTitle
              title={rep.title}
              subheading={`Format: ${rep.format}`}
            />
            <p className="text-xs text-[#8a8272] leading-relaxed my-3">
              {rep.description}
            </p>
            <CredentialFooter
              status={{ label: "Ready to export", state: "neutral" }}
              primaryAction={{
                label: "Download Report",
                onClick: () => handleDownload(rep.title),
              }}
            />
          </CredentialCard>
        ))}
      </div>

      {/* Full Administrative Audit Trail */}
      <CredentialCard>
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#4a4335]">
          <Activity className="w-5 h-5 text-[#8a8272]" />
          <div>
            <h3 className="text-sm font-serif font-medium text-[#F2EEE4]">
              Administrative Audit Logs & Mutation History ({auditLogs.length})
            </h3>
            <p className="text-[11px] text-[#8a8272]">
              Immutable chronological log of all administrator actions performed in this session
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[6px] border border-[#4a4335]">
          <table className="w-full text-left text-xs text-[#D8D3C6]">
            <thead>
              <tr className="border-b border-[#4a4335] bg-[#0e0d0b] text-[#8a8272] font-mono uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 text-right">Executor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4a4335]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#23201b]/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[#8a8272] text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#D8D3C6]">{log.module}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono">
                      <span
                        className={`w-[7px] h-[7px] rounded-full ${
                          log.actionType === "approve"
                            ? "bg-[#7DAE7A]"
                            : log.actionType === "reject" || log.actionType === "delete"
                            ? "bg-[#E27878]"
                            : "bg-[#B8963E]"
                        }`}
                      />
                      <span className="uppercase text-[#D8D3C6]">{log.actionType}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#8a8272] max-w-md leading-snug">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 text-right font-serif text-[#F2EEE4] whitespace-nowrap">
                    {log.adminName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CredentialCard>
    </div>
  );
};



