"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  Plus,
  Trash2,
  Edit,
  Search,
  ShieldAlert,
  User,
  BookOpen,
  X,
} from "lucide-react";
import {
  AdminAttendanceLog,
  AdminStudent,
  AdminCourse,
} from "@/lib/admin-data";

interface AdminAttendanceSectionProps {
  logs: AdminAttendanceLog[];
  students: AdminStudent[];
  courses: AdminCourse[];
  onAddLog: (log: Omit<AdminAttendanceLog, "id">) => void;
  onDeleteLog: (id: string) => void;
}

export const AdminAttendanceSection: React.FC<AdminAttendanceSectionProps> = ({
  logs,
  students,
  courses,
  onAddLog,
  onDeleteLog,
}) => {
  const [courseFilter, setCourseFilter] = useState("All");
  const [isRecordOpen, setIsRecordOpen] = useState(false);

  // New Log Form
  const [newDate, setNewDate] = useState("09-Sep-2026");
  const [newCourseCode, setNewCourseCode] = useState(courses[0]?.code || "CS-401");
  const [newSection, setNewSection] = useState("CS-6A");
  const [newTopic, setNewTopic] = useState("");
  const [newPresent, setNewPresent] = useState(36);
  const [newAbsent, setNewAbsent] = useState(2);
  const [newLate, setNewLate] = useState(1);
  const [newExcused, setNewExcused] = useState(0);

  // Students on low attendance (<75%)
  const lowAttendanceStudents = students.filter((s) => s.attendancePercentage < 75);

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const crs = courses.find((c) => c.code === newCourseCode);

    onAddLog({
      date: newDate,
      courseCode: newCourseCode,
      courseTitle: crs?.title || "Academic Lecture",
      instructor: crs?.instructor || "Faculty Member",
      section: newSection,
      topic: newTopic || "Regular Scheduled Lecture Session",
      presentCount: newPresent,
      absentCount: newAbsent,
      lateCount: newLate,
      excusedCount: newExcused,
      totalStudents: newPresent + newAbsent + newLate + newExcused,
    });

    setIsRecordOpen(false);
    setNewTopic("");
  };

  const filteredLogs = logs.filter((l) => {
    if (courseFilter !== "All" && l.courseCode !== courseFilter) return false;
    return true;
  });

  const handleExportAttendance = () => {
    const headers = "Date,Course Code,Course Title,Instructor,Section,Topic,Present,Absent,Late,Total\n";
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.date}","${l.courseCode}","${l.courseTitle}","${l.instructor}","${l.section}","${l.topic}",${l.presentCount},${l.absentCount},${l.lateCount},${l.totalStudents}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `IU_Attendance_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Institutional Attendance Monitoring
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">HEC 75% Threshold Engine</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Attendance Administration & Records
          </h2>
          <p className="text-xs text-slate-500">
            Log lecture presence, monitor students below attendance threshold, and issue exam clearance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportAttendance}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Attendance Report</span>
          </button>

          <button
            onClick={() => setIsRecordOpen(true)}
            className="px-4 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-iqra-gold-400" />
            <span>Record Lecture Attendance</span>
          </button>
        </div>
      </div>

      {/* Critical Highlight: Students Below 75% HEC Minimum */}
      {lowAttendanceStudents.length > 0 && (
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <h4 className="font-bold text-rose-900 text-sm">
                  Students Ineligible for Final Examination (&lt; 75% Attendance)
                </h4>
                <p className="text-[11px] text-rose-800">
                  {lowAttendanceStudents.length} students currently fail the HEC 75% mandatory threshold.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white">
              Exam Admit Slip Blocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowAttendanceStudents.map((std) => (
              <div
                key={std.id}
                className="p-3 rounded-2xl bg-white border border-rose-200/80 shadow-xs flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900 text-xs">{std.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{std.studentId} • {std.program}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black font-mono text-rose-600 block">
                    {std.attendancePercentage}%
                  </span>
                  <span className="text-[9px] font-bold text-rose-700 uppercase">Warning Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Logs Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Lecture Attendance Logs ({filteredLogs.length})
            </h3>
            <p className="text-[11px] text-slate-500">Official RFID and portal lecture markings</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
            >
              <option value="All">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.code}>{c.code} - {c.title.slice(0, 24)}...</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Date</th>
                <th className="pb-3 font-bold">Course & Section</th>
                <th className="pb-3 font-bold">Instructor</th>
                <th className="pb-3 font-bold">Topic Delivered</th>
                <th className="pb-3 font-bold text-center">Present / Absent / Late</th>
                <th className="pb-3 font-bold text-center">Attendance %</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const percent = Math.round((log.presentCount / (log.totalStudents || log.totalEnrolled || 1)) * 100);

                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-bold text-slate-800">{log.date}</td>

                    <td className="py-3">
                      <span className="font-mono font-bold text-iqra-blue-700 block">{log.courseCode}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Section {log.section}</span>
                    </td>

                    <td className="py-3 text-slate-700">{log.instructor}</td>

                    <td className="py-3 text-slate-800 font-medium max-w-[200px] truncate">
                      {log.topic}
                    </td>

                    <td className="py-3 text-center">
                      <span className="font-mono font-bold text-emerald-700">{log.presentCount} P</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span className="font-mono font-bold text-rose-600">{log.absentCount} A</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span className="font-mono font-bold text-amber-600">{log.lateCount} L</span>
                    </td>

                    <td className="py-3 text-center">
                      <span className="font-mono font-bold text-slate-900">{percent}%</span>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Attendance Modal */}
      {isRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-heading text-white">Record Lecture Attendance</h3>
                <p className="text-xs text-blue-200">Institutional Faculty Ledger</p>
              </div>
              <button
                onClick={() => setIsRecordOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Course</label>
                  <select
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Lecture Topic Delivered</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus & Raft Protocol"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-700 uppercase">Present</label>
                  <input
                    type="number"
                    value={newPresent}
                    onChange={(e) => setNewPresent(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-rose-700 uppercase">Absent</label>
                  <input
                    type="number"
                    value={newAbsent}
                    onChange={(e) => setNewAbsent(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-700 uppercase">Late</label>
                  <input
                    type="number"
                    value={newLate}
                    onChange={(e) => setNewLate(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold"
                >
                  Record Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
