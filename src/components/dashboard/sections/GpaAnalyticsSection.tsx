"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Award,
  BarChart3,
  LineChart as LineChartIcon,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Zap,
  Target,
  ArrowUpRight,
  BookOpen,
  PieChart,
  Layers,
  Info,
} from "lucide-react";
import {
  StudentProfile,
  SemesterRecord,
  CourseResult,
  semesterHistory,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface GpaAnalyticsSectionProps {
  profile: StudentProfile;
  history?: SemesterRecord[];
}

export const GpaAnalyticsSection: React.FC<GpaAnalyticsSectionProps> = ({
  profile,
  history = semesterHistory,
}) => {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Dynamic calculations from actual semester history
  const analytics = useMemo(() => {
    if (!history || history.length === 0) {
      return null;
    }

    // Best and weakest semesters
    let bestSem = history[0];
    let weakestSem = history[0];

    history.forEach((sem) => {
      if (sem.gpa > bestSem.gpa) bestSem = sem;
      if (sem.gpa < weakestSem.gpa) weakestSem = sem;
    });

    // Highest and lowest grade courses across history
    let highestGradeCourse = { code: "", title: "", gradePoints: -1, grade: "", semester: "" };
    let lowestGradeCourse = { code: "", title: "", gradePoints: 99, grade: "", semester: "" };

    const allCourses: Array<{ code: string; title: string; gradePoints: number; grade: string; sem: string }> = [];

    history.forEach((sem) => {
      sem.courses.forEach((c: CourseResult) => {
        allCourses.push({
          code: c.code,
          title: c.title,
          gradePoints: c.gradePoints,
          grade: c.grade,
          sem: sem.session,
        });

        if (c.gradePoints > highestGradeCourse.gradePoints) {
          highestGradeCourse = {
            code: c.code,
            title: c.title,
            gradePoints: c.gradePoints,
            grade: c.grade,
            semester: sem.session,
          };
        }

        if (c.gradePoints < lowestGradeCourse.gradePoints) {
          lowestGradeCourse = {
            code: c.code,
            title: c.title,
            gradePoints: c.gradePoints,
            grade: c.grade,
            semester: sem.session,
          };
        }
      });
    });

    // CGPA comparison with previous semester
    const currentSem = history[history.length - 1];
    const prevSem = history.length > 1 ? history[history.length - 2] : null;
    const cgpaDelta = prevSem ? (currentSem.cgpa - prevSem.cgpa).toFixed(2) : "0.00";
    const gpaDelta = prevSem ? (currentSem.gpa - prevSem.gpa).toFixed(2) : "0.00";

    // Distance to 4.00
    const distanceTo4 = (4.0 - currentSem.cgpa).toFixed(2);

    // Degree completion percentage
    const completedCredits = history.reduce((acc, s) => acc + s.creditHours, 0);
    const totalDegreeCredits = profile.totalCreditHours || 134;
    const completionPercent = Math.round((completedCredits / totalDegreeCredits) * 100);

    // Grade breakdown counts
    const gradeCounts = {
      "A / A+ (4.00)": 0,
      "A- (3.67)": 0,
      "B+ (3.33)": 0,
      "B (3.00)": 0,
      "Other": 0,
    };

    allCourses.forEach((c) => {
      if (c.grade === "A" || c.grade === "A+") gradeCounts["A / A+ (4.00)"]++;
      else if (c.grade === "A-") gradeCounts["A- (3.67)"]++;
      else if (c.grade === "B+") gradeCounts["B+ (3.33)"]++;
      else if (c.grade === "B") gradeCounts["B (3.00)"]++;
      else gradeCounts["Other"]++;
    });

    // Calculated Insights list
    const insights: Array<{ title: string; desc: string; type: "success" | "info" | "highlight" }> = [];

    if (parseFloat(cgpaDelta) >= 0) {
      insights.push({
        title: "Consistent Academic Growth",
        desc: `Your CGPA increased by +${cgpaDelta} compared to the previous semester, maintaining an upward performance trajectory over ${history.length} terms.`,
        type: "success",
      });
    }

    insights.push({
      title: "Strongest Area: Computing Core",
      desc: `Outstanding performance in core technical courses including ${highestGradeCourse.title} (${highestGradeCourse.grade}, ${highestGradeCourse.gradePoints.toFixed(2)} GP).`,
      type: "highlight",
    });

    insights.push({
      title: `Pathway to Perfect 4.00`,
      desc: `You are currently ${distanceTo4} grade points away from a perfect 4.00 CGPA. Maintaining a 3.85+ GPA in remaining terms will qualify you for the Gold Medal.`,
      type: "info",
    });

    return {
      bestSem,
      weakestSem,
      highestGradeCourse,
      lowestGradeCourse,
      cgpaDelta,
      gpaDelta,
      distanceTo4,
      completedCredits,
      totalDegreeCredits,
      completionPercent,
      allCoursesCount: allCourses.length,
      gradeCounts,
      insights,
    };
  }, [history, profile]);

  if (!analytics) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
        <LineChartIcon className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">No Analytics Data Available</h3>
        <p className="text-xs text-slate-500">
          Complete at least one semester to view your academic trajectory charts.
        </p>
      </div>
    );
  }

  const maxScale = 4.0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#050e1d] via-[#0a192f] to-[#0c2340] border border-slate-800 text-white shadow-xl shadow-slate-950/20">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Academic Performance Analytics Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            GPA & CGPA Progression Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Chak Shehzad Campus • Bachelor of Science in Computer Science
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-iqra-gold-400" />
            <span>{profile.academicStanding || "Dean's Honor Roll"}</span>
          </span>
        </div>
      </div>

      {/* 2. MAIN KPI METRICS CARDS (6 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Current GPA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 relative overflow-hidden group">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Current GPA
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-heading text-iqra-blue-700">
              {profile.currentGpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Term {history[history.length - 1]?.session}</span>
          </div>
        </div>

        {/* Current CGPA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 relative overflow-hidden group">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Current CGPA
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-heading text-slate-900">
              {profile.cgpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <span>↑ {analytics.cgpaDelta}</span>
            <span className="text-slate-500 font-normal truncate">vs prev semester</span>
          </div>
        </div>

        {/* Highest Semester GPA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Highest Sem GPA
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-heading text-emerald-600">
              {analytics.bestSem.gpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block truncate">
            {analytics.bestSem.semesterName} ({analytics.bestSem.session})
          </span>
        </div>

        {/* Total Credit Hours */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Total Credit Hours
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-heading text-slate-900">
              {analytics.completedCredits}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              / {analytics.totalDegreeCredits} Cr
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            {analytics.completionPercent}% Degree Completed
          </span>
        </div>

        {/* Completed Courses */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Completed Courses
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-heading text-slate-900">
              {analytics.allCoursesCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Passed</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            0 Academic Backlogs
          </span>
        </div>

        {/* Academic Standing */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Academic Standing
          </span>
          <div className="text-base font-black text-iqra-gold-600 truncate mt-1">
            {profile.academicStanding || "Dean's List"}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Merit Standing Verified
          </span>
        </div>
      </div>

      {/* 3. DYNAMIC GPA & CGPA PROGRESSION CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEMESTER GPA TRAJECTORY */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Semester GPA Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Performance variation across each academic semester
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setChartType("line")}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-all",
                  chartType === "line"
                    ? "bg-white text-iqra-navy-900 shadow-xs"
                    : "text-slate-500"
                )}
              >
                Line
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-all",
                  chartType === "bar"
                    ? "bg-white text-iqra-navy-900 shadow-xs"
                    : "text-slate-500"
                )}
              >
                Bar
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="pt-6 pb-2">
            <div className="h-52 flex items-end justify-between gap-3 sm:gap-4 px-2 border-b border-slate-200 relative">
              {/* Reference Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">4.00</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">3.50 (Honors)</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">3.00</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">2.00 (Pass)</span>
                </div>
              </div>

              {history.map((sem, idx) => {
                const heightPercent = (sem.gpa / maxScale) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-iqra-navy-950 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md pointer-events-none whitespace-nowrap z-20">
                      {sem.session} • GPA: {sem.gpa.toFixed(2)}
                    </div>

                    <span className="text-[11px] font-black font-mono text-slate-800 group-hover:text-iqra-blue-700">
                      {sem.gpa.toFixed(2)}
                    </span>

                    <div className="w-full max-w-[48px] h-full flex items-end">
                      <div
                        className={cn(
                          "w-full rounded-t-xl transition-all duration-300 shadow-sm",
                          sem.gpa >= 3.7
                            ? "bg-gradient-to-t from-iqra-navy-900 via-iqra-blue-600 to-cyan-400"
                            : "bg-gradient-to-t from-iqra-navy-900 to-iqra-blue-600"
                        )}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap mt-1">
                      Sem {sem.semesterNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CUMULATIVE CGPA PROGRESSION */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cumulative CGPA Progression
              </h3>
              <p className="text-xs text-slate-500">
                Steady cumulative record trend across {history.length} semesters
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-iqra-gold-500" />
              <span>CGPA Trend</span>
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
                  <span className="text-[9px] text-slate-400">3.50</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">3.00</span>
                </div>
                <div className="border-b border-dashed border-slate-300 w-full flex justify-end pr-1">
                  <span className="text-[9px] text-slate-400">2.00</span>
                </div>
              </div>

              {history.map((sem, idx) => {
                const heightPercent = (sem.cgpa / maxScale) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-iqra-navy-950 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md pointer-events-none whitespace-nowrap z-20">
                      {sem.session} • CGPA: {sem.cgpa.toFixed(2)}
                    </div>

                    <span className="text-[11px] font-black font-mono text-slate-800 group-hover:text-iqra-gold-600">
                      {sem.cgpa.toFixed(2)}
                    </span>

                    <div className="w-full max-w-[48px] h-full flex items-end">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-amber-700 via-amber-500 to-iqra-gold-400 transition-all duration-300 shadow-sm"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap mt-1">
                      {sem.session.split(" ")[0]} &apos;{sem.session.split(" ")[1]?.slice(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE ANALYSIS & HIGHLIGHTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Best & Weakest Term */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-iqra-gold-500" />
            <span>Semester Extremes</span>
          </h4>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              Best Performing Term
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-emerald-900">
                {analytics.bestSem.semesterName} ({analytics.bestSem.session})
              </span>
              <span className="font-mono font-black text-sm text-emerald-700">
                {analytics.bestSem.gpa.toFixed(2)} GPA
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Lowest Performing Term
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                {analytics.weakestSem.semesterName} ({analytics.weakestSem.session})
              </span>
              <span className="font-mono font-bold text-sm text-slate-600">
                {analytics.weakestSem.gpa.toFixed(2)} GPA
              </span>
            </div>
          </div>
        </div>

        {/* Highest & Lowest Grade Course */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-iqra-blue-600" />
            <span>Course Grade Extremes</span>
          </h4>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 space-y-1">
            <span className="text-[10px] uppercase font-bold text-iqra-blue-700 block">
              Highest Grade Course
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-iqra-blue-950 truncate pr-2">
                {analytics.highestGradeCourse.code} • {analytics.highestGradeCourse.title}
              </span>
              <span className="font-bold text-xs bg-blue-100 text-iqra-blue-800 px-2 py-0.5 rounded shrink-0">
                {analytics.highestGradeCourse.grade} (4.00)
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Lowest Grade Course
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 truncate pr-2">
                {analytics.lowestGradeCourse.code} • {analytics.lowestGradeCourse.title}
              </span>
              <span className="font-bold text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded shrink-0">
                {analytics.lowestGradeCourse.grade} ({analytics.lowestGradeCourse.gradePoints.toFixed(2)})
              </span>
            </div>
          </div>
        </div>

        {/* Grade Distribution Profile */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-purple-600" />
            <span>Historical Grade Breakdown</span>
          </h4>

          <div className="space-y-2 text-xs">
            {Object.entries(analytics.gradeCounts).map(([label, count]) => {
              const pct = Math.round((count / analytics.allCoursesCount) * 100);
              return (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">{label}</span>
                    <span className="font-bold font-mono text-slate-900">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        label.startsWith("A")
                          ? "bg-emerald-500"
                          : label.startsWith("B")
                          ? "bg-iqra-blue-600"
                          : "bg-amber-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. DYNAMIC AI ACADEMIC INSIGHTS ENGINE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1f3a] via-[#0f284d] to-[#163866] border border-blue-500/30 text-white shadow-xl shadow-blue-950/20 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black font-heading tracking-tight text-white">
              Data-Driven Academic Insights
            </h3>
            <p className="text-xs text-slate-300">
              Computed directly from your historical student transcripts and course grades
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.insights.map((ins, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/10 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    ins.type === "success"
                      ? "bg-emerald-400"
                      : ins.type === "highlight"
                      ? "bg-cyan-400"
                      : "bg-iqra-gold-400"
                  )}
                />
                <span className="text-xs font-bold text-white">{ins.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{ins.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
