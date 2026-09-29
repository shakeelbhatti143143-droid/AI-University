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
  Layers,
} from "lucide-react";
import { EnrolledCourse, attendanceHistory, AttendanceRecord } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

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
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1528] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 uppercase flex items-center gap-1 border border-emerald-300 dark:border-emerald-800/40">
                <ShieldCheck className="w-3 h-3" />
                Good Standing Record
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Fall 2026 Academic Term</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
              Attendance & Eligibility Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Islamabad Central Campus • Minimum 75% HEC attendance mandatory for terminal examination clearance
            </p>
          </div>

          {/* Big Attendance % Pill */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#060D1A] to-[#0D1F3C] text-white shadow-md border border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Overall Attendance
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-heading text-white font-mono">
                  {overallPercentage}%
                </span>
                <span className="text-xs text-emerald-400 font-bold">Eligible</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Attendance Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Lectures Held
            </span>
            <span className="text-2xl font-black font-heading text-slate-900 dark:text-white font-mono">{totalConducted}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Across Enrolled Courses</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Present Classes
            </span>
            <span className="text-2xl font-black font-heading text-emerald-800 dark:text-emerald-300 font-mono">{presentCount}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1">On-time attendance</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Absent Days
            </span>
            <span className="text-2xl font-black font-heading text-rose-800 dark:text-rose-300 font-mono">{absentCount}</span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 block mt-1">Leaves accounted</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Late Marks
            </span>
            <span className="text-2xl font-black font-heading text-amber-800 dark:text-amber-300 font-mono">{lateCount}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-1">Late arrivals</span>
          </div>
        </div>
      </div>

      {/* HEC ATTENDANCE WARNING & COMPLIANCE BANNER */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/50 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900 dark:text-amber-300">
            HEC Academic Regulation: 75% Minimum Attendance Requirement
          </h4>
          <p className="leading-relaxed text-[11px] text-amber-800 dark:text-amber-300/80">
            As mandated by Higher Education Commission (HEC) and university regulations, students falling below 75% total attendance in any individual subject are disqualified from taking the final examination.
          </p>
        </div>
      </div>

      {/* 2. COURSE-WISE ATTENDANCE BREAKDOWN CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Course-wise Attendance Breakdown</h3>
          <span className="text-xs text-slate-400">Detailed subject percentage & safety margin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const isWarning = course.attendancePercentage < 80;
            const isCritical = course.attendancePercentage < 75;
            const maxMissable = Math.max(0, Math.floor(course.attendedLectures - course.totalLectures * 0.75));

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-800">
                    {course.code}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      isCritical
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        : isWarning
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    }`}
                  >
                    {course.attendancePercentage}%
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    Instructor: {course.instructor.name}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span>Attended Lectures:</span>
                    <span className="font-bold text-slate-800 dark:text-white font-mono">
                      {course.attendedLectures} / {course.totalLectures}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
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
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400">Margin to 75% limit:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Can miss {maxMissable} more lectures
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. LECTURE ATTENDANCE LOG TABLE */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1528] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Attendance Log & Lecture History</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Automated RFID / faculty portal attendance markings</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Date & Time</th>
                <th className="pb-3 font-bold">Course</th>
                <th className="pb-3 font-bold">Lecture Topic / Notes</th>
                <th className="pb-3 font-bold text-right">Marked Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                    No individual lecture attendance logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3">
                      <span className="font-bold text-slate-800 dark:text-white block">{rec.date}</span>
                      <span className="text-[10px] text-slate-400">{rec.time}</span>
                    </td>

                    <td className="py-3">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{rec.courseCode}</span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">{rec.courseTitle}</span>
                    </td>

                    <td className="py-3 text-slate-700 dark:text-slate-300 font-medium">{rec.topic}</td>

                    <td className="py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rec.status === "Present"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : rec.status === "Late"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400"
                        }`}
                      >
                        {rec.status === "Present" && <CheckCircle2 className="w-3 h-3" />}
                        {rec.status === "Late" && <Clock className="w-3 h-3" />}
                        {rec.status === "Absent" && <XCircle className="w-3 h-3" />}
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
