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

interface AdminReportsSectionProps {
  auditLogs: AuditLog[];
}

export const AdminReportsSection: React.FC<AdminReportsSectionProps> = ({ auditLogs }) => {
  const [selectedReport, setSelectedReport] = useState("all");

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
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800 uppercase flex items-center gap-1">
              <FileSpreadsheet className="w-3 h-3" />
              Institutional Audit & Governance
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Chak Shehzad, Islamabad</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Reports, Compliance & System Audit Trail
          </h2>
          <p className="text-xs text-slate-500">
            Generate HEC-certified transcripts, attendance rosters, and review chronological administrative actions.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-iqra-blue-500/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded-full font-bold uppercase bg-blue-50 text-iqra-blue-700 border border-blue-100">
                  {rep.category}
                </span>
                <span className="text-slate-400 font-medium">{rep.generatedDate}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{rep.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{rep.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">{rep.format}</span>
              <button
                onClick={() => handleDownload(rep.title)}
                className="px-3.5 py-1.5 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-iqra-gold-400" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Administrative Audit Trail */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Administrative Audit Logs & Mutation History ({auditLogs.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Immutable chronological log of all administrator actions performed in this session
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Timestamp</th>
                <th className="pb-3 font-bold">Module</th>
                <th className="pb-3 font-bold">Action Type</th>
                <th className="pb-3 font-bold">Details</th>
                <th className="pb-3 font-bold text-right">Executor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3 font-bold text-slate-800">{log.module}</td>

                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.actionType === "approve"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.actionType === "reject" || log.actionType === "delete"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {log.actionType}
                    </span>
                  </td>

                  <td className="py-3 text-slate-700 max-w-md leading-snug font-medium">
                    {log.details}
                  </td>

                  <td className="py-3 text-right font-bold text-slate-800 whitespace-nowrap">
                    {log.adminName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
