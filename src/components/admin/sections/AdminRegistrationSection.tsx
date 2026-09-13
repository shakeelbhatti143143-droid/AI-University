"use client";

import React, { useState } from "react";
import {
  FolderPlus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Filter,
  UserCheck,
  BookOpen,
  X,
} from "lucide-react";
import {
  RegistrationPeriod,
  RegistrationRequest,
  AdminCourse,
  AdminStudent,
} from "@/lib/admin-data";

interface AdminRegistrationSectionProps {
  period: RegistrationPeriod;
  requests: RegistrationRequest[];
  courses: AdminCourse[];
  students: AdminStudent[];
  onTogglePeriod: (isOpen: boolean) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onManualRegister: (studentId: string, courseCode: string, section: string) => void;
  onDropStudent: (studentId: string, courseCode: string) => void;
}

export const AdminRegistrationSection: React.FC<AdminRegistrationSectionProps> = ({
  period,
  requests,
  courses,
  students,
  onTogglePeriod,
  onApproveRequest,
  onRejectRequest,
  onManualRegister,
  onDropStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Manual enrollment modal
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.studentId || "");
  const [selectedCourseCode, setSelectedCourseCode] = useState(courses[0]?.code || "");
  const [selectedSection, setSelectedSection] = useState("CS-6A");

  // Statistics
  const totalRequests = requests.length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;
  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const fullCourses = courses.filter((c) => c.enrolledCount >= c.capacity);
  const availableCourses = courses.filter((c) => c.enrolledCount < c.capacity);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onManualRegister(selectedStudentId, selectedCourseCode, selectedSection);
    setIsManualOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Registration Period Controller Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                  period.isOpen
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    period.isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                {period.isOpen ? "Registration Window Open" : "Registration Closed"}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">{period.session}</span>
            </div>

            <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
              Course Registration Administration
            </h2>

            <p className="text-xs text-slate-500">
              Active Window: <strong>{period.startDate} to {period.endDate}</strong> • Max Credit Limit: <strong>{period.maxCreditHours} Cr. Hrs</strong>
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTogglePeriod(!period.isOpen)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                period.isOpen
                  ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {period.isOpen ? <ToggleRight className="w-5 h-5 text-rose-600" /> : <ToggleLeft className="w-5 h-5" />}
              <span>{period.isOpen ? "Close Registration Window" : "Open Registration Window"}</span>
            </button>

            <button
              onClick={() => setIsManualOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-iqra-gold-400" />
              <span>Manually Register Student</span>
            </button>
          </div>
        </div>

        {/* Registration Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total Requests</span>
            <span className="text-2xl font-black font-heading text-slate-900">{totalRequests}</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Pending Review</span>
            <span className="text-2xl font-black font-heading text-amber-700">{pendingCount}</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Approved</span>
            <span className="text-2xl font-black font-heading text-emerald-700">{approvedCount}</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/60">
            <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">Capacity Saturated</span>
            <span className="text-2xl font-black font-heading text-rose-700">
              {fullCourses.length} Full Courses
            </span>
          </div>
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Registration Requests & Approval Queue ({filteredRequests.length})
            </h3>
            <p className="text-[11px] text-slate-500">Review student prerequisite compliance and authorize seats</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Search request..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs w-48"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Student Name & ID</th>
                <th className="pb-3 font-bold">Requested Course</th>
                <th className="pb-3 font-bold text-center">Credit Hours</th>
                <th className="pb-3 font-bold text-center">Section</th>
                <th className="pb-3 font-bold">Requested Timestamp</th>
                <th className="pb-3 font-bold text-center">Status</th>
                <th className="pb-3 font-bold text-right">Admin Decisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3">
                    <span className="font-bold text-slate-900 block">{req.studentName}</span>
                    <span className="font-mono text-[10px] text-slate-500 block">{req.studentId}</span>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {req.department && (
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                          {req.department}
                        </span>
                      )}
                      {req.program && (
                        <span className="text-[10px] text-iqra-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                          {req.program}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded">
                        Sem {req.semester || 1}
                      </span>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className="font-mono font-bold text-iqra-blue-700 block">{req.courseCode}</span>
                    <span className="text-[11px] text-slate-600">{req.courseTitle}</span>
                  </td>

                  <td className="py-3 text-center font-mono font-bold text-slate-800">
                    {req.creditHours} Cr
                  </td>

                  <td className="py-3 text-center font-bold text-slate-700">
                    {req.section}
                  </td>

                  <td className="py-3 text-[11px] text-slate-500">
                    {req.requestedAt}
                  </td>

                  <td className="py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {req.status === "Approved" && <CheckCircle2 className="w-3 h-3" />}
                      {req.status === "Pending" && <Clock className="w-3 h-3" />}
                      {req.status === "Rejected" && <XCircle className="w-3 h-3" />}
                      <span>{req.status}</span>
                    </span>
                  </td>

                  <td className="py-3 text-right">
                    {req.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onApproveRequest(req.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectRequest(req.id)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Decided</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Registration Modal */}
      {isManualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-heading text-white">Manual Course Enrollment</h3>
                <p className="text-xs text-blue-200">Administrator Direct Course Assignment</p>
              </div>
              <button
                onClick={() => setIsManualOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.studentId}>
                      {s.studentId} — {s.name} ({s.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Select Course to Enroll</label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.code} — {c.title} ({c.enrolledCount}/{c.capacity} Enrolled)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  <option value="CS-6A">Section CS-6A</option>
                  <option value="CS-6B">Section CS-6B</option>
                  <option value="SE-7A">Section SE-7A</option>
                  <option value="AI-4A">Section AI-4A</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold"
                >
                  Confirm Manual Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
