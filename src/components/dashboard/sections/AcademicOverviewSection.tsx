"use client";

import React from "react";
import {
  GraduationCap,
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
  Download,
  ShieldCheck,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { StudentProfile, SemesterRecord, semesterHistory } from "@/lib/dashboard-data";

interface AcademicOverviewSectionProps {
  profile: StudentProfile;
  history?: SemesterRecord[];
}

export const AcademicOverviewSection: React.FC<AcademicOverviewSectionProps> = ({
  profile,
  history = semesterHistory,
}) => {
  const progressPercent = Math.round((profile.completedCreditHours / profile.totalCreditHours) * 100);

  // Highest GPA for chart scaling (4.00 max)
  const maxScale = 4.0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Academic Standing Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-iqra-navy-950 via-iqra-navy-900 to-iqra-blue-900 text-white p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iqra-gold-500/20 border border-iqra-gold-400/30 text-iqra-gold-300 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{profile.academicStanding}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Academic Performance Audit
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Official degree audit for Bachelor of Science in Computer Science. Minimum CGPA of 2.00 required for degree award; currently maintaining <strong>{profile.cgpa.toFixed(2)} CGPA</strong>.
          </p>
        </div>

        {/* Download Transcript Mock Action */}
        <button
          onClick={() => alert("Downloading official Unofficial Academic Transcript PDF...")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all"
        >
          <Download className="w-4 h-4 text-iqra-gold-400" />
          <span>Download Unofficial Transcript</span>
        </button>
      </div>

      {/* 4 Overview Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Cumulative CGPA
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {profile.cgpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +0.04 from previous semester
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Semester GPA (Sem 6)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-iqra-blue-700">
              {profile.currentGpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            Highest semester performance to date
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Completed Credit Hours
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {profile.completedCreditHours}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ {profile.totalCreditHours} Cr</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2">
            {profile.remainingCreditHours} Credit Hours remaining
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Degree Completion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {progressPercent}%
            </span>
            <span className="text-xs text-slate-400 font-semibold">Progress</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            On track for Spring 2027 Graduation
          </p>
        </div>
      </div>

      {/* DEGREE PROGRESS TRACKER */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Undergraduate Degree Progress Tracker</h3>
            <p className="text-[11px] text-slate-500">
              BS Computer Science curriculum roadmap ({profile.completedCreditHours} of {profile.totalCreditHours} credit hours passed)
            </p>
          </div>
          <span className="text-xs font-bold text-iqra-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            {progressPercent}% Completed
          </span>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-iqra-blue-600 via-iqra-blue-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Computing Core</span>
              <span className="text-xs font-bold text-slate-800">39 / 39 Cr (100%)</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Completed</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">CS Domain Electives</span>
              <span className="text-xs font-bold text-slate-800">21 / 33 Cr (63%)</span>
              <span className="text-[10px] text-iqra-blue-600 block mt-0.5">In Progress</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">General / Humanities</span>
              <span className="text-xs font-bold text-slate-800">22 / 24 Cr (91%)</span>
              <span className="text-[10px] text-iqra-blue-600 block mt-0.5">In Progress</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Final Year Project</span>
              <span className="text-xs font-bold text-slate-800">6 / 6 Cr (Upcoming)</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Sem 7 & Sem 8</span>
            </div>
          </div>
        </div>
      </div>

      {/* GPA TREND CHART & SEMESTER PERFORMANCE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester GPA Trend Interactive Bar & Value Chart */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Semester GPA Progression</h3>
              <p className="text-[11px] text-slate-500">Term-by-term GPA trajectory (Max: 4.00)</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded bg-iqra-blue-600" />
              <span className="text-[11px] text-slate-600 font-medium">Semester GPA</span>
            </div>
          </div>

          {/* Visual CSS Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-52 flex items-end justify-between gap-3 sm:gap-4 px-2 border-b border-slate-200 relative">
              {/* Reference Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">4.00</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">3.00</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">2.00</span>
                </div>
              </div>

              {history.map((item, idx) => {
                const heightPercent = (item.gpa / maxScale) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-iqra-navy-950 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md pointer-events-none whitespace-nowrap z-20">
                      GPA: {item.gpa.toFixed(2)} ({item.session})
                    </div>

                    <span className="text-[11px] font-black font-mono text-slate-700 group-hover:text-iqra-blue-600">
                      {item.gpa.toFixed(2)}
                    </span>

                    <div className="w-full max-w-[48px] h-full flex items-end">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-iqra-navy-900 to-iqra-blue-600 group-hover:from-iqra-blue-600 group-hover:to-iqra-blue-400 transition-all duration-300 shadow-sm"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap mt-1">
                      Sem {item.semesterNumber || idx + 1}
                    </span>
                  </div>
                );
              })}
              {history.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  No semester records published yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cumulative CGPA Trend Chart */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cumulative CGPA Trend</h3>
              <p className="text-[11px] text-slate-500">Progressive standing over academic sessions</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded bg-iqra-gold-500" />
              <span className="text-[11px] text-slate-600 font-medium">Cumulative CGPA</span>
            </div>
          </div>

          <div className="pt-6 pb-2">
            <div className="h-52 flex items-end justify-between gap-3 sm:gap-4 px-2 border-b border-slate-200 relative">
              {/* Reference Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">4.00</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">3.00</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">2.00</span>
                </div>
              </div>

              {history.map((item, idx) => {
                const heightPercent = (item.cgpa / maxScale) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-iqra-navy-950 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md pointer-events-none whitespace-nowrap z-20">
                      CGPA: {item.cgpa.toFixed(2)} ({item.session})
                    </div>

                    <span className="text-[11px] font-black font-mono text-slate-700 group-hover:text-iqra-gold-600">
                      {item.cgpa.toFixed(2)}
                    </span>

                    <div className="w-full max-w-[48px] h-full flex items-end">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-iqra-navy-900 via-iqra-gold-600 to-iqra-gold-400 group-hover:brightness-110 transition-all duration-300 shadow-sm"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap mt-1">
                      Sem {item.semesterNumber || idx + 1}
                    </span>
                  </div>
                );
              })}
              {history.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  No cumulative records published yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEMESTER-BY-SEMESTER DETAILED PERFORMANCE HISTORY TABLE */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Official Semester Performance Transcript</h3>
            <p className="text-[11px] text-slate-500">Iqra University Chak Shehzad Academic Records</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {history.length > 0 ? `${history.length} Semesters Recorded` : "Current Term in Progress"}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500">
            Official semester-by-semester grades will be cataloged here once approved by the Controller of Examinations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Academic Session</th>
                  <th className="pb-3 font-bold">Semester</th>
                  <th className="pb-3 font-bold text-center">Credit Hours</th>
                  <th className="pb-3 font-bold text-center">Semester GPA</th>
                  <th className="pb-3 font-bold text-center">Cumulative CGPA</th>
                  <th className="pb-3 font-bold text-right">Academic Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-bold text-slate-800">{item.session}</td>
                    <td className="py-3 font-medium text-slate-600">{item.semesterName}</td>
                    <td className="py-3 text-center font-mono font-semibold text-slate-700">{item.creditHours} Cr</td>
                    <td className="py-3 text-center font-mono font-bold text-iqra-blue-700">{item.gpa.toFixed(2)}</td>
                    <td className="py-3 text-center font-mono font-bold text-slate-900">{item.cgpa.toFixed(2)}</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/50">
                        <Award className="w-3 h-3 text-iqra-gold-500" />
                        {item.academicStanding}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
