"use client";

import React, { useState } from "react";
import {
  ScrollText,
  Award,
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  Building2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentAcademicRecord {
  id: string;
  name: string;
  studentId: string;
  email: string;
  department: string;
  program: string;
  cgpa: number;
  completedCredits: number;
  results: Array<{
    courseCode: string;
    courseTitle: string;
    creditHours: number;
    grade: string;
    gradePoints: number;
    totalMarks: number;
    percentage: number;
    status: string;
    semester: string;
  }>;
}

interface AdminAcademicRecordsSectionProps {
  initialTab?: "transcripts" | "gpa-cgpa" | "reports";
  students: StudentAcademicRecord[];
}

export const AdminAcademicRecordsSection: React.FC<AdminAcademicRecordsSectionProps> = ({
  initialTab = "transcripts",
  students,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"transcripts" | "gpa-cgpa" | "reports">(
    initialTab
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentAcademicRecord | null>(
    students[0] || null
  );

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate institutional analytics
  const totalStudents = students.length;
  const avgCgpa =
    totalStudents > 0
      ? Number((students.reduce((acc, s) => acc + s.cgpa, 0) / totalStudents).toFixed(2))
      : 0.0;
  const honorRollCount = students.filter((s) => s.cgpa >= 3.5).length;
  const warningCount = students.filter((s) => s.cgpa > 0 && s.cgpa < 2.0).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase flex items-center gap-1">
              <ScrollText className="w-3 h-3 text-amber-700" />
              University Registrar Records
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Official Graduation & Standing</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Transcripts, GPA & Academic Reports
          </h2>
          <p className="text-xs text-slate-500">
            Official verifiable web transcripts, cumulative GPA distributions, and departmental performance reports.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab("transcripts")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "transcripts"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <ScrollText className="w-3.5 h-3.5 text-iqra-blue-600" />
            <span>Transcripts</span>
          </button>

          <button
            onClick={() => setActiveSubTab("gpa-cgpa")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "gpa-cgpa"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>GPA & CGPA</span>
          </button>

          <button
            onClick={() => setActiveSubTab("reports")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "reports"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
            <span>Academic Reports</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. TRANSCRIPTS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "transcripts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Selector */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Select Enrolled Student
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar">
              {filteredStudents.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 text-center">No students available</p>
              ) : (
                filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className={cn(
                      "w-full text-left p-3 rounded-2xl transition-all text-xs border",
                      selectedStudent?.id === s.id
                        ? "bg-iqra-blue-50/80 border-iqra-blue-200 text-iqra-blue-950 font-bold"
                        : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate block font-bold">{s.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-normal">
                        {s.studentId}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                      CGPA: {s.cgpa.toFixed(2)} • {s.completedCredits} Cr. Hrs
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Official Transcript Sheet */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            {!selectedStudent ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No student selected for transcript preview.
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-iqra-gold-600 tracking-wider">
                      Official University Web Transcript
                    </span>
                    <h3 className="text-xl font-black font-heading text-slate-900">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enrollment: <strong className="font-mono text-slate-800">{selectedStudent.studentId}</strong> • {selectedStudent.program}
                    </p>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Transcript</span>
                  </button>
                </div>

                {/* Academic Metrics Summary */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Cumulative CGPA
                    </span>
                    <span className="text-2xl font-black font-heading text-iqra-blue-700">
                      {selectedStudent.cgpa.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Credit Hours Completed
                    </span>
                    <span className="text-2xl font-black font-heading text-slate-900">
                      {selectedStudent.completedCredits}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Academic Standing
                    </span>
                    <span className="text-xs font-bold text-emerald-600 block mt-1">
                      {selectedStudent.cgpa >= 3.5
                        ? "Dean's Honor Roll"
                        : selectedStudent.cgpa >= 2.0
                          ? "Good Standing"
                          : "Probation"}
                    </span>
                  </div>
                </div>

                {/* Published Course Grades */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Published Semester Grades
                  </h4>

                  {selectedStudent.results.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                      No results published for this student yet. Transcript records generate automatically when grades are published.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Code</th>
                            <th className="py-2.5 px-3">Course Title</th>
                            <th className="py-2.5 px-3 text-center">Credits</th>
                            <th className="py-2.5 px-3 text-center">Marks</th>
                            <th className="py-2.5 px-3 text-center">Grade</th>
                            <th className="py-2.5 px-3 text-center">Grade Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {selectedStudent.results.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 font-mono font-bold">{r.courseCode}</td>
                              <td className="py-2.5 px-3">{r.courseTitle}</td>
                              <td className="py-2.5 px-3 text-center">{r.creditHours}</td>
                              <td className="py-2.5 px-3 text-center">{r.totalMarks}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-iqra-blue-700">
                                {r.grade}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold">
                                {r.gradePoints.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. GPA & CGPA ANALYTICS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "gpa-cgpa" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Institutional Average CGPA
              </span>
              <span className="text-3xl font-black font-heading text-slate-900">
                {avgCgpa > 0 ? avgCgpa.toFixed(2) : "N/A"}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Across all students</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-1">
                Dean's Honor Roll (≥3.50)
              </span>
              <span className="text-3xl font-black font-heading text-emerald-700">
                {honorRollCount}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-1">Exceptional Standing</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-rose-600 block mb-1">
                Academic Warnings (&lt;2.00)
              </span>
              <span className="text-3xl font-black font-heading text-rose-700">{warningCount}</span>
              <span className="text-[10px] text-rose-600 block mt-1">Intervention Required</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Grading Formula
              </span>
              <span className="text-sm font-bold text-slate-800 mt-1 block">
                HEC Quality Points
              </span>
              <span className="text-[10px] text-slate-500 block">∑(GP × CH) ÷ ∑(CH)</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4">
            <h3 className="text-sm font-black font-heading text-slate-900 uppercase tracking-wider">
              Student CGPA Roster
            </h3>

            {students.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No student records available yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Program</th>
                      <th className="py-3 px-4 text-center">CGPA</th>
                      <th className="py-3 px-4 text-center">Credit Hours</th>
                      <th className="py-3 px-4 text-center">Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {students.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{s.studentId}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{s.program}</td>
                        <td className="py-3 px-4 text-center font-bold text-base text-iqra-blue-700">
                          {s.cgpa > 0 ? s.cgpa.toFixed(2) : "0.00"}
                        </td>
                        <td className="py-3 px-4 text-center font-mono">{s.completedCredits}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                              s.cgpa >= 3.5
                                ? "bg-emerald-100 text-emerald-800"
                                : s.cgpa >= 2.0
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-rose-100 text-rose-800"
                            )}
                          >
                            {s.cgpa >= 3.5
                              ? "Honor Roll"
                              : s.cgpa >= 2.0
                                ? "Good Standing"
                                : "Warning"}
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
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ACADEMIC REPORTS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "reports" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">Student Performance Report</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consolidated departmental report containing credit completion rates, average GPAs, and graduation eligibility audit.
            </p>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white text-xs font-bold"
            >
              Export Report
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">Pass / Fail Statistics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Subject-wise pass vs failure analytics across Midterm and Final examination terminals for Fall 2026.
            </p>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
            >
              Generate Summary
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">HEC Compliance & Attendance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Examination eligibility audit verifying minimum 75% classroom attendance threshold across all departments.
            </p>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
            >
              Audit Eligibility
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
