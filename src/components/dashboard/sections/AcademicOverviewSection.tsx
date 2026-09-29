"use client";

import React from "react";
import Link from "next/link";
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
  AlertCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { StudentProfile, SemesterRecord, semesterHistory, StudentProgressionData } from "@/lib/dashboard-data";
import { calculateScholarship } from "@/lib/scholarship";

interface AcademicOverviewSectionProps {
  profile: StudentProfile;
  history?: SemesterRecord[];
  progression?: StudentProgressionData | null;
}

export const AcademicOverviewSection: React.FC<AcademicOverviewSectionProps> = ({
  profile,
  history = semesterHistory,
  progression,
}) => {
  const effectiveCgpa = progression?.cgpa !== undefined ? progression.cgpa : profile.cgpa;
  const effectiveCurrentGpa = progression?.currentGpa !== undefined ? progression.currentGpa : profile.currentGpa;
  const effectiveCompletedCredits = progression?.completedCreditHours !== undefined ? progression.completedCreditHours : profile.completedCreditHours;
  const effectiveTotalCredits = progression?.totalDegreeCredits || profile.totalCreditHours || 134;
  const effectiveRemainingCredits = progression?.remainingCreditHours !== undefined ? progression.remainingCreditHours : Math.max(0, effectiveTotalCredits - effectiveCompletedCredits);
  const effectiveProgressPercent = progression?.degreeProgress !== undefined ? progression.degreeProgress : Math.round((effectiveCompletedCredits / effectiveTotalCredits) * 100);
  const effectiveStanding = progression?.academicStanding || profile.academicStanding;
  const currentSemNumber = progression?.currentSemester || 1;

  // Highest GPA for chart scaling (4.00 max)
  const maxScale = 4.0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Academic Standing Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-iqra-navy-950 via-iqra-navy-900 to-iqra-blue-900 text-white p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iqra-gold-500/20 border border-iqra-gold-400/30 text-iqra-gold-300 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{effectiveStanding}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Academic Performance Audit
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Official degree audit for {progression?.degreeProgram || profile.program}. Minimum CGPA of 2.00 required for degree award; currently maintaining <strong>{effectiveCgpa.toFixed(2)} CGPA</strong>.
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

      {/* Failed Courses Warning Alert if Any */}
      {progression?.failedCoursesList && progression.failedCoursesList.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <span className="text-xs font-black text-rose-900 uppercase tracking-wide">
                Academic Retake Required ({progression.failedCoursesList.length} Failed Course{progression.failedCoursesList.length > 1 ? "s" : ""})
              </span>
              <p className="text-xs text-rose-800 mt-0.5">
                {progression.failedCoursesList.map((f) => `${f.code}: ${f.title} (Grade ${f.grade})`).join(" • ")}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase bg-rose-200 text-rose-900 shrink-0">
            Prerequisite Incomplete
          </span>
        </div>
      )}

      {/* 4 Overview Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Cumulative CGPA
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {effectiveCgpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {effectiveCgpa >= 3.5 ? "Dean's Honor Roll" : effectiveCgpa >= 2.0 ? "Good Standing" : "Academic Probation"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Semester GPA (Sem {currentSemNumber})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-iqra-blue-700">
              {effectiveCurrentGpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            Active Semester Academic Performance
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Completed Credit Hours
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {effectiveCompletedCredits}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ {effectiveTotalCredits} Cr</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2">
            {effectiveRemainingCredits} Credit Hours remaining
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Degree Completion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {effectiveProgressPercent}%
            </span>
            <span className="text-xs text-slate-400 font-semibold">Progress</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            {effectiveProgressPercent >= 100 ? "Eligible for Graduation" : "Sequential Progression Active"}
          </p>
        </div>
      </div>

      {/* INSTITUTIONAL MERIT SCHOLARSHIP CARD */}
      {(() => {
        const sch = calculateScholarship(effectiveCgpa);
        return (
          <div
            className={`p-6 sm:p-7 rounded-3xl border shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              sch.isEligible
                ? "bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60 border-emerald-300"
                : "bg-white border-slate-200/90"
            }`}
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    sch.isEligible
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Merit-Based Scholarship</span>
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  Published CGPA: {effectiveCgpa.toFixed(2)}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900">
                {sch.isEligible
                  ? `Tuition Support Entitlement: ${sch.percentage}% (${sch.tier})`
                  : "Currently Not Eligible for Merit Scholarship"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {sch.explanation}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Award Discount
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-black font-heading ${
                    sch.isEligible ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {sch.percentage}%
                </span>
              </div>

              <Link
                href="/explore/scholarships"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0b1f3a] hover:bg-[#122b4e] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>View Criteria</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );
      })()}

      {/* DEGREE PROGRESS TRACKER */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Undergraduate Degree Progress Tracker</h3>
            <p className="text-[11px] text-slate-500">
              {progression?.degreeProgram || profile.program} curriculum roadmap ({effectiveCompletedCredits} of {effectiveTotalCredits} credit hours passed)
            </p>
          </div>
          <span className="text-xs font-bold text-iqra-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            {effectiveProgressPercent}% Completed
          </span>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-iqra-blue-600 via-iqra-blue-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${Math.min(100, effectiveProgressPercent)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            {progression?.semesters && progression.semesters.length > 0 ? (
              progression.semesters.slice(0, 4).map((s) => (
                <div key={s.semesterNumber} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    Semester {s.semesterNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {s.completedCoursesCount} / {Math.max(s.totalCoursesCount, 5)} Courses
                  </span>
                  <span
                    className={`text-[10px] block mt-0.5 font-semibold ${
                      s.status === "Passed"
                        ? "text-emerald-600"
                        : s.status === "In Progress"
                        ? "text-amber-600"
                        : s.status === "Available"
                        ? "text-blue-600"
                        : "text-slate-400"
                    }`}
                  >
                    {s.statusLabel}
                  </span>
                </div>
              ))
            ) : (
              <>
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
              </>
            )}
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
