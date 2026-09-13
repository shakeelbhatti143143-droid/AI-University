"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Filter,
  ShieldCheck,
  TrendingUp,
  Info,
} from "lucide-react";
import { EnrolledCourse, attendanceHistory, AttendanceRecord } from "@/lib/dashboard-data";

interface AttendanceSectionProps {
  courses: EnrolledCourse[];
  attendanceRecords?: AttendanceRecord[];
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  courses,
  attendanceRecords = attendanceHistory,
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("All");

  // Statistics calculation across enrolled courses
  const totalAttended = courses.reduce((acc, c) => acc + c.attendedLectures, 0);
  const totalConducted = courses.reduce((acc, c) => acc + c.totalLectures, 0);
  const overallPercentage = totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(1) : "100.0";

  // Dynamic breakdown from real attendance logs
  const presentCount = attendanceRecords.filter((r) => r.status === "Present").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "Absent").length;
  const lateCount = attendanceRecords.filter((r) => r.status === "Late").length;

  const filteredHistory = attendanceRecords.filter((rec) => {
    if (selectedCourseFilter === "All") return true;
    return rec.courseCode === selectedCourseFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Overall Metric Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Good Standing Record
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">Fall 2026 Academic Term</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
              Attendance & Eligibility Portal
            </h2>
            <p className="text-xs text-slate-500">
              Chak Shehzad Campus, Islamabad • Minimum 75% HEC attendance mandatory for examination admit slip
            </p>
          </div>

          {/* Big Attendance % Pill */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-iqra-navy-950 to-iqra-navy-900 text-white shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Overall Attendance
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-heading text-white">
                  {overallPercentage}%
                </span>
                <span className="text-xs text-emerald-400 font-bold">Eligible</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Attendance Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Lectures Held
            </span>
            <span className="text-2xl font-black font-heading text-slate-900">{totalConducted}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Across 6 Enrolled Subjects</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Present Classes
            </span>
            <span className="text-2xl font-black font-heading text-emerald-800">{presentCount}</span>
            <span className="text-[10px] text-emerald-600 block mt-1">91.1% on-time attendance</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Absent Days
            </span>
            <span className="text-2xl font-black font-heading text-rose-800">{absentCount}</span>
            <span className="text-[10px] text-rose-600 block mt-1">Leaves accounted</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Late Marks
            </span>
            <span className="text-2xl font-black font-heading text-amber-800">{lateCount}</span>
            <span className="text-[10px] text-amber-600 block mt-1">&lt;10 mins arrival</span>
          </div>
        </div>
      </div>

      {/* HEC ATTENDANCE WARNING & COMPLIANCE BANNER */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900">
            HEC Policy Notice: 75% Minimum Attendance Requirement
          </h4>
          <p className="leading-relaxed text-[11px] text-amber-800">
            As mandated by the Higher Education Commission (HEC) and Iqra University academic regulations, students falling below 75% attendance in any individual subject are disqualified from taking the terminal/final examination in that course.
          </p>
        </div>
      </div>

      {/* COURSE-WISE ATTENDANCE BREAKDOWN CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Course-wise Attendance Breakdown</h3>
          <span className="text-xs text-slate-400">Detailed subject percentage & safety margin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const isWarning = course.attendancePercentage < 80;
            const isCritical = course.attendancePercentage < 75;
            // Safety margin: how many more classes can be missed before falling below 75%
            const maxMissable = Math.max(0, Math.floor(course.attendedLectures - course.totalLectures * 0.75));

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-iqra-navy-900 text-white">
                    {course.code}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      isCritical
                        ? "bg-rose-100 text-rose-800"
                        : isWarning
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {course.attendancePercentage}%
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Instructor: {course.instructor.name}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Attended Lectures:</span>
                    <span className="font-bold">
                      {course.attendedLectures} / {course.totalLectures}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical
                          ? "bg-rose-500"
                          : isWarning
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${course.attendancePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Safety buffer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Margin to 75% limit:</span>
                  <span className="font-bold text-slate-800">
                    Can miss {maxMissable} more lectures
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED ATTENDANCE HISTORY LOG TABLE */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Attendance Log & Lecture History</h3>
            <p className="text-[11px] text-slate-500">Automated RFID / faculty portal attendance markings</p>
          </div>

          {/* Filter by course */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} - {c.title.slice(0, 20)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Date & Time</th>
                <th className="pb-3 font-bold">Course</th>
                <th className="pb-3 font-bold">Lecture Topic / Notes</th>
                <th className="pb-3 font-bold text-right">Marked Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                    No individual lecture attendance logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3">
                    <span className="font-bold text-slate-800 block">{rec.date}</span>
                    <span className="text-[10px] text-slate-400">{rec.time}</span>
                  </td>

                  <td className="py-3">
                    <span className="font-mono font-bold text-iqra-blue-700 block">{rec.courseCode}</span>
                    <span className="text-[11px] text-slate-600">{rec.courseTitle}</span>
                  </td>

                  <td className="py-3 text-slate-700 font-medium">{rec.topic}</td>

                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        rec.status === "Present"
                          ? "bg-emerald-100 text-emerald-800"
                          : rec.status === "Late"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {rec.status === "Present" && <CheckCircle2 className="w-3 h-3" />}
                      {rec.status === "Late" && <Clock className="w-3 h-3" />}
                      {rec.status === "Absent" && <XCircle className="w-3 h-3" />}
                      {rec.status}
                    </span>
                  </td>
                </tr>
              )))
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
