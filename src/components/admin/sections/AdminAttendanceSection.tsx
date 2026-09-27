"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Download,
  Plus,
  Trash2,
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
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
  CredentialModal,
  CredentialInput,
  CredentialSelect,
  CredentialButton,
  CredentialFilterBar,
} from "@/components/admin/credential";

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
      {/* Header Banner */}
      <div
        className="relative overflow-hidden p-6 rounded-[10px] border flex flex-col md:flex-row md:items-center justify-between gap-4 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
        style={{
          backgroundColor: "var(--card-bg, #1D1B18)",
          borderColor: "var(--card-border, #4a4335)",
          borderRadius: "var(--radius-card, 10px)",
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted, #8a8272)" }}
            >
              Institutional Attendance Monitoring
            </span>
            <span style={{ color: "var(--text-muted, #8a8272)" }}>•</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              HEC 75% Threshold Engine
            </span>
          </div>
          <h2
            className="font-serif text-[26px] font-[500] leading-tight tracking-tight"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            Attendance Administration & Records
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            Log lecture attendance, monitor students falling below HEC minimums, and audit attendance histories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportAttendance}
            className="h-[36px] px-3.5 rounded-[6px] border text-xs font-semibold flex items-center gap-1.5 transition-colors hover:bg-white/5 active:scale-[0.98]"
            style={{
              borderColor: "var(--card-border, #4a4335)",
              color: "var(--text-muted, #8a8272)",
            }}
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => setIsRecordOpen(true)}
            className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98]"
            style={{
              borderColor: "var(--accent-gold, #C9A25B)",
              color: "var(--accent-gold, #C9A25B)",
              backgroundColor: "transparent",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Record Attendance</span>
          </button>
        </div>
      </div>

      {/* Critical Highlight: Students Below 75% */}
      {lowAttendanceStudents.length > 0 && (
        <div
          className="relative overflow-hidden p-5 rounded-[10px] border space-y-3 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#E27878]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--status-danger, #E27878)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" style={{ color: "var(--status-danger, #E27878)" }} />
              <div>
                <h4 className="font-semibold text-xs" style={{ color: "var(--status-danger, #E27878)" }}>
                  Students Below HEC Mandatory Minimum (&lt; 75% Attendance)
                </h4>
                <p className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
                  {lowAttendanceStudents.length} students currently risk examination disqualification.
                </p>
              </div>
            </div>
            <span
              className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border"
              style={{
                borderColor: "var(--status-danger, #E27878)",
                color: "var(--status-danger, #E27878)",
              }}
            >
              Admit Blocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowAttendanceStudents.map((std) => (
              <div
                key={std.id}
                className="p-3 rounded-[6px] border flex items-center justify-between"
                style={{
                  backgroundColor: "var(--card-bg, #1D1B18)",
                  borderColor: "var(--card-border, #4a4335)",
                }}
              >
                <div>
                  <p className="font-medium text-xs" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                    {std.name}
                  </p>
                  <p className="text-[10px] font-mono" style={{ color: "var(--text-muted, #8a8272)" }}>
                    {std.studentId} • {std.program}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold block" style={{ color: "var(--status-danger, #E27878)" }}>
                    {std.attendancePercentage}%
                  </span>
                  <span className="text-[9px] font-mono uppercase" style={{ color: "var(--text-muted, #8a8272)" }}>
                    Warning
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Logs Table */}
      <div
        className="relative overflow-hidden p-6 rounded-[10px] border space-y-4 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
        style={{
          backgroundColor: "var(--card-bg, #1D1B18)",
          borderColor: "var(--card-border, #4a4335)",
          borderRadius: "var(--radius-card, 10px)",
        }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b"
          style={{ borderColor: "var(--card-border, #4a4335)" }}
        >
          <div>
            <h3 className="font-serif text-[18px] font-[500]" style={{ color: "var(--text-heading, #F2EEE4)" }}>
              Lecture Attendance Logs ({filteredLogs.length})
            </h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              Official RFID and portal lecture attendance entries
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: "var(--text-muted, #8a8272)" }}>Filter Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="h-[32px] px-2.5 bg-[#1D1B18] border border-[#4a4335] rounded-[6px] text-xs text-[#D8D3C6] focus:outline-none focus:border-[#C9A25B]"
              style={{
                backgroundColor: "var(--card-bg, #1D1B18)",
                borderColor: "var(--card-border, #4a4335)",
              }}
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
              <tr
                className="border-b text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  borderColor: "var(--card-border, #4a4335)",
                  color: "var(--text-muted, #8a8272)",
                }}
              >
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Course & Section</th>
                <th className="pb-3 font-medium">Instructor</th>
                <th className="pb-3 font-medium">Topic Delivered</th>
                <th className="pb-3 font-medium text-center">Present / Absent</th>
                <th className="pb-3 font-medium text-center">Attendance %</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--card-border, #4a4335)" }}
            >
              {filteredLogs.map((log) => {
                const percent = Math.round((log.presentCount / (log.totalStudents || log.totalEnrolled || 1)) * 100);

                return (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-mono" style={{ color: "var(--text-value, #D8D3C6)" }}>
                      {log.date}
                    </td>

                    <td className="py-3">
                      <span className="font-mono font-medium block" style={{ color: "var(--text-value, #D8D3C6)" }}>
                        {log.courseCode}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--text-muted, #8a8272)" }}>
                        Section {log.section}
                      </span>
                    </td>

                    <td className="py-3" style={{ color: "var(--text-value, #D8D3C6)" }}>
                      {log.instructor}
                    </td>

                    <td className="py-3 truncate max-w-[200px]" style={{ color: "var(--text-value, #D8D3C6)" }}>
                      {log.topic}
                    </td>

                    <td className="py-3 text-center font-mono" style={{ color: "var(--text-value, #D8D3C6)" }}>
                      <span style={{ color: "var(--status-success, #7DAE7A)" }}>{log.presentCount}</span> / <span style={{ color: "var(--status-danger, #E27878)" }}>{log.absentCount}</span>
                    </td>

                    <td className="py-3 text-center">
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{
                          color:
                            percent < 75
                              ? "var(--status-danger, #E27878)"
                              : "var(--status-success, #7DAE7A)",
                        }}
                      >
                        {percent}%
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="w-[28px] h-[28px] rounded-[4px] border inline-flex items-center justify-center transition-colors hover:bg-white/5"
                        style={{
                          borderColor: "var(--card-border, #4a4335)",
                          color: "var(--status-danger, #E27878)",
                        }}
                        title="Delete Attendance Record"
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

      {/* RECORD ATTENDANCE MODAL */}
      <CredentialModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
        eyebrow="LECTURE AUDIT"
        title="Record Lecture Attendance"
        description="Log student headcounts and sync lecture topics to course history."
        maxWidth="lg"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsRecordOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              onClick={handleRecordSubmit}
            >
              Submit Attendance Entry
            </CredentialButton>
          </>
        }
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <CredentialInput
              label="Lecture Date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
            <CredentialSelect
              label="Course"
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} — {c.title}
                </option>
              ))}
            </CredentialSelect>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CredentialInput
              label="Section"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              required
            />
            <CredentialInput
              label="Topic Delivered"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g. Graph Traversal Algorithms"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <CredentialInput
              label="Present"
              type="number"
              value={newPresent}
              onChange={(e) => setNewPresent(parseInt(e.target.value) || 0)}
            />
            <CredentialInput
              label="Absent"
              type="number"
              value={newAbsent}
              onChange={(e) => setNewAbsent(parseInt(e.target.value) || 0)}
            />
            <CredentialInput
              label="Late"
              type="number"
              value={newLate}
              onChange={(e) => setNewLate(parseInt(e.target.value) || 0)}
            />
            <CredentialInput
              label="Excused"
              type="number"
              value={newExcused}
              onChange={(e) => setNewExcused(parseInt(e.target.value) || 0)}
            />
          </div>
        </form>
      </CredentialModal>
    </div>
  );
};

