"use client";

import React, { useState, useMemo } from "react";
import {
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Download,
  Printer,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  Info,
  X,
  FileSpreadsheet,
  ArrowUpRight,
  Percent,
} from "lucide-react";
import {
  SemesterResultRecord,
  CourseResult,
  semesterResultsData,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface ResultsGradesSectionProps {
  resultsData?: SemesterResultRecord[];
}

export const ResultsGradesSection: React.FC<ResultsGradesSectionProps> = ({
  resultsData = semesterResultsData,
}) => {
  // Active semester selection
  const [selectedSemesterIdx, setSelectedSemesterIdx] = useState<number>(0);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<CourseResult | null>(null);

  const activeSemester = resultsData[selectedSemesterIdx] || resultsData[0];

  // Grade Distribution computation across the selected semester or all semesters
  const gradeDistribution = useMemo(() => {
    const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];
    const counts: Record<string, number> = {};
    grades.forEach((g) => (counts[g] = 0));

    if (activeSemester?.courses) {
      activeSemester.courses.forEach((c) => {
        if (counts[c.grade] !== undefined) {
          counts[c.grade]++;
        } else {
          // Normalise variant
          counts[c.grade] = (counts[c.grade] || 0) + 1;
        }
      });
    }

    const maxCount = Math.max(...Object.values(counts), 1);
    return { grades, counts, maxCount };
  }, [activeSemester]);

  if (!resultsData || resultsData.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 animate-in fade-in">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Results Published</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Your results will appear here after they are approved and published.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#050e1d] via-[#0a192f] to-[#0f284d] border border-slate-800 text-white shadow-xl shadow-slate-950/20">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Academic Performance & Grade Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Semester Examination Results & Grades
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Chak Shehzad Campus, Islamabad • HEC Four-Point Relative Grading System
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Result Sheet</span>
          </button>
        </div>
      </div>

      {/* 2. SEMESTER SELECTOR PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-2xl bg-white border border-slate-200/90 shadow-xs custom-scrollbar">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 shrink-0">
          Select Term:
        </span>
        {resultsData.map((sem, idx) => (
          <button
            key={sem.semesterNumber}
            onClick={() => setSelectedSemesterIdx(idx)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2",
              selectedSemesterIdx === idx
                ? "bg-iqra-navy-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <span>{sem.semesterName}</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-mono",
                selectedSemesterIdx === idx
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              GPA: {sem.gpa.toFixed(2)}
            </span>
          </button>
        ))}
      </div>

      {/* 3. SEMESTER SUMMARY STAT CARDS (7 METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Semester GPA</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-heading text-iqra-blue-700">
              {activeSemester.gpa.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">
            SGPA Achieved
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative CGPA</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-heading text-slate-900">
              {activeSemester.cgpa.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">/ 4.00</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            Cumulative Record
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Credit Hours</span>
          <span className="text-2xl font-black font-heading text-slate-900 block mt-1">
            {activeSemester.creditHours}
          </span>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            Enrolled Credits
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Marks</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-heading text-slate-900">
              {activeSemester.totalMarks}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">/ 500</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            Aggregate Marks
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Average %</span>
          <span className="text-2xl font-black font-heading text-emerald-600 block mt-1">
            {activeSemester.averagePercentage.toFixed(1)}%
          </span>
          <span className="text-[10px] text-emerald-700 font-medium block mt-1">
            Class Distinction
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Courses Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-black text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeSemester.coursesCompleted}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-base font-black text-slate-400">
              {activeSemester.coursesFailed} F
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            100% Passed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Standing</span>
          <span className="text-xs font-black text-iqra-gold-600 block mt-2 truncate">
            {activeSemester.academicStanding}
          </span>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            Merit Standing
          </span>
        </div>
      </div>

      {/* 4. COURSE RESULTS DATA TABLE */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Course-wise Evaluation & Grade Points
            </h3>
            <p className="text-xs text-slate-500">
              Showing official results for {activeSemester.semesterName} ({activeSemester.session})
            </p>
          </div>
          <span className="text-xs text-slate-500 italic">
            Click any course to inspect assessment marks breakdown
          </span>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Course Code</th>
                <th className="py-3.5 px-4">Course Title</th>
                <th className="py-3.5 px-4 text-center">Cr. Hrs</th>
                <th className="py-3.5 px-4 text-center">Marks</th>
                <th className="py-3.5 px-4 text-center">Percentage</th>
                <th className="py-3.5 px-4 text-center">Letter Grade</th>
                <th className="py-3.5 px-4 text-center">Grade Points</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {activeSemester.courses.map((course) => (
                <tr
                  key={course.code}
                  onClick={() => setSelectedCourseForModal(course)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-iqra-blue-700 whitespace-nowrap">
                    {course.code}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <div className="group-hover:text-iqra-blue-700 transition-colors">
                      {course.title}
                    </div>
                    {course.instructor && (
                      <span className="text-[11px] text-slate-400 font-normal block">
                        {course.instructor}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                    {course.creditHours}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {course.marks}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-semibold text-slate-700">
                      {course.percentage}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={cn(
                        "inline-block px-2.5 py-0.5 rounded-md font-bold text-xs",
                        course.grade.startsWith("A")
                          ? "bg-emerald-100 text-emerald-800"
                          : course.grade.startsWith("B")
                          ? "bg-blue-100 text-blue-800"
                          : course.grade.startsWith("C")
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      )}
                    >
                      {course.grade}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {course.gradePoints.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {course.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button className="text-iqra-blue-600 hover:text-iqra-blue-800 font-bold inline-flex items-center gap-1 group-hover:underline">
                      <span>Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. VISUAL GRADE DISTRIBUTION CHART */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Grade Distribution Profile ({activeSemester.semesterName})
            </h3>
            <p className="text-xs text-slate-500">
              Frequency breakdown across all course letter grades
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-iqra-blue-600" />
            <span>Course Frequency</span>
          </div>
        </div>

        {/* SVG / Bar Distribution */}
        <div className="pt-6 pb-2">
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-200 relative">
            {gradeDistribution.grades.map((grade) => {
              const count = gradeDistribution.counts[grade] || 0;
              const heightPercent = count > 0 ? (count / gradeDistribution.maxCount) * 85 + 15 : 4;

              return (
                <div key={grade} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-iqra-navy-950 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md pointer-events-none whitespace-nowrap z-20">
                    Grade {grade}: {count} {count === 1 ? "Course" : "Courses"}
                  </div>

                  <span className="text-[11px] font-bold font-mono text-slate-700">
                    {count > 0 ? count : ""}
                  </span>

                  <div className="w-full max-w-[38px] h-full flex items-end">
                    <div
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-300",
                        count > 0
                          ? grade.startsWith("A")
                            ? "bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:brightness-110"
                            : grade.startsWith("B")
                            ? "bg-gradient-to-t from-iqra-blue-600 to-cyan-400 group-hover:brightness-110"
                            : "bg-gradient-to-t from-amber-500 to-amber-400"
                          : "bg-slate-100"
                      )}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-bold mt-1",
                      count > 0 ? "text-slate-900" : "text-slate-400"
                    )}
                  >
                    {grade}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. COURSE MARKS BREAKDOWN MODAL */}
      {selectedCourseForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-100 text-iqra-blue-800">
                    {selectedCourseForModal.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {selectedCourseForModal.creditHours} Credit Hours
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Grade {selectedCourseForModal.grade} ({selectedCourseForModal.gradePoints.toFixed(2)} GP)
                  </span>
                </div>
                <h3 className="text-xl font-black font-heading text-slate-900">
                  {selectedCourseForModal.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedCourseForModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Marks & Percentage Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Total Aggregate Score
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black font-heading text-white">
                    {selectedCourseForModal.marks}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">/ 100 Marks</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  Final Letter Grade
                </span>
                <span className="text-3xl font-black font-heading text-emerald-400">
                  {selectedCourseForModal.grade}
                </span>
              </div>
            </div>

            {/* Assessment Component Breakdown Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-iqra-blue-600" />
                <span>Continuous Assessment Breakdown</span>
              </h4>

              <div className="space-y-2 text-xs">
                {/* Assignments */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Assignments & Case Studies</span>
                    <span className="text-[10px] text-slate-400">
                      Weightage: {selectedCourseForModal.breakdown.assignments.weightage}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-slate-900">
                      {selectedCourseForModal.breakdown.assignments.obtained} / {selectedCourseForModal.breakdown.assignments.total}
                    </span>
                    <span className="text-[10px] text-emerald-600 block font-semibold">
                      {Math.round((selectedCourseForModal.breakdown.assignments.obtained / selectedCourseForModal.breakdown.assignments.total) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Quizzes */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Quizzes & Surprise Tests</span>
                    <span className="text-[10px] text-slate-400">
                      Weightage: {selectedCourseForModal.breakdown.quizzes.weightage}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-slate-900">
                      {selectedCourseForModal.breakdown.quizzes.obtained} / {selectedCourseForModal.breakdown.quizzes.total}
                    </span>
                    <span className="text-[10px] text-emerald-600 block font-semibold">
                      {Math.round((selectedCourseForModal.breakdown.quizzes.obtained / selectedCourseForModal.breakdown.quizzes.total) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Midterm Exam */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Midterm Examination</span>
                    <span className="text-[10px] text-slate-400">
                      Weightage: {selectedCourseForModal.breakdown.midterm.weightage}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-slate-900">
                      {selectedCourseForModal.breakdown.midterm.obtained} / {selectedCourseForModal.breakdown.midterm.total}
                    </span>
                    <span className="text-[10px] text-emerald-600 block font-semibold">
                      {Math.round((selectedCourseForModal.breakdown.midterm.obtained / selectedCourseForModal.breakdown.midterm.total) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Final Exam */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Final Terminal Examination</span>
                    <span className="text-[10px] text-slate-400">
                      Weightage: {selectedCourseForModal.breakdown.final.weightage}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-slate-900">
                      {selectedCourseForModal.breakdown.final.obtained} / {selectedCourseForModal.breakdown.final.total}
                    </span>
                    <span className="text-[10px] text-emerald-600 block font-semibold">
                      {Math.round((selectedCourseForModal.breakdown.final.obtained / selectedCourseForModal.breakdown.final.total) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Attendance Contribution */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Attendance & Class Participation</span>
                    <span className="text-[10px] text-slate-400">
                      Weightage: {selectedCourseForModal.breakdown.attendance.weightage}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-slate-900">
                      {selectedCourseForModal.breakdown.attendance.obtained} / {selectedCourseForModal.breakdown.attendance.total}
                    </span>
                    <span className="text-[10px] text-emerald-600 block font-semibold">100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Close Button */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCourseForModal(null)}
                className="px-5 py-2 rounded-xl bg-iqra-navy-900 text-white font-bold text-xs hover:bg-iqra-navy-800 transition-colors"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
