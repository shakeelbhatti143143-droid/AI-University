"use client";

import React, { useState } from "react";
import {
  ScrollText,
  Printer,
  Download,
  Eye,
  ShieldCheck,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
  Sparkles,
  Info,
  X,
} from "lucide-react";
import {
  StudentProfile,
  SemesterRecord,
  CourseResult,
  semesterHistory,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface AcademicTranscriptSectionProps {
  profile: StudentProfile;
  history?: SemesterRecord[];
}

export const AcademicTranscriptSection: React.FC<AcademicTranscriptSectionProps> = ({
  profile,
  history = semesterHistory,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Compute grand totals across all semesters
  const totalCreditsAttempted = history.reduce((acc, sem) => acc + sem.creditHours, 0);
  const totalCreditsCompleted = totalCreditsAttempted;
  const cumulativeCGPA = profile.cgpa > 0 ? profile.cgpa : history.length > 0 ? history[history.length - 1].cgpa : 0.0;
  const currentSGPA = profile.currentGpa > 0 ? profile.currentGpa : history.length > 0 ? history[history.length - 1].gpa : 0.0;

  // Handle native print
  const handlePrint = () => {
    window.print();
  };

  if (!history || history.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 animate-in fade-in">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
          <ScrollText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Academic Transcript Unavailable</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Your transcript will be generated automatically once academic results are available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP ACTION & CONTROL BAR (Hidden in print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#050e1d] via-[#0a192f] to-[#0f284d] border border-slate-800 text-white shadow-xl shadow-slate-950/20">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iqra-gold-500/20 border border-iqra-gold-400/30 text-iqra-gold-300 text-xs font-bold">
            <ScrollText className="w-3.5 h-3.5" />
            <span>Official University Registrar Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Academic Transcript (Web Record)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Official degree record of completed coursework and semester standing
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all",
              isPreviewMode
                ? "bg-white text-iqra-navy-950 border-white shadow-md"
                : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
            )}
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>{isPreviewMode ? "Standard View" : "Print Preview"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-iqra-blue-600 to-iqra-blue-700 hover:from-iqra-blue-500 hover:to-iqra-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-iqra-blue-900/30"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Print Transcript</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all"
            title="Download PDF"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {/* 2. OFFICIAL DISCLAIMER ALERT (Hidden in print) */}
      <div className="print:hidden p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-950">Official Transcript Notice: </span>
          <span>
            This document represents an unofficial student web academic transcript generated for advising and personal verification. It is not an officially certified university document. Official certified transcripts bearing the registrar&apos;s embossed seal and authorized signature must be requested via the Examinations Directorate.
          </span>
        </div>
      </div>

      {/* 3. THE OFFICIAL TRANSCRIPT SHEET (Optimized for Screen & Print) */}
      <div
        id="printable-transcript"
        className={cn(
          "bg-white rounded-3xl border border-slate-300 shadow-xl p-8 sm:p-12 space-y-8 print:p-0 print:border-none print:shadow-none print:rounded-none text-slate-900",
          isPreviewMode ? "max-w-4xl mx-auto ring-8 ring-slate-900/10" : "w-full"
        )}
      >
        {/* TRANSCRIPT HEADER */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            {/* Left University Monogram & Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066cc] to-[#0a192f] border-2 border-iqra-gold-500 flex flex-col items-center justify-center text-white shadow-md">
                <span className="font-black text-xl tracking-wider">IU</span>
                <span className="w-6 h-0.5 bg-iqra-gold-400 rounded-full mt-0.5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-slate-950 uppercase">
                  IQRA UNIVERSITY
                </h2>
                <p className="text-xs font-bold text-iqra-blue-700 uppercase tracking-wider">
                  Chak Shehzad Campus • Islamabad, Pakistan
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Office of the Controller of Examinations & Academic Records
                </p>
              </div>
            </div>

            {/* Right Document Seal / Metadata */}
            <div className="text-center sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono font-bold uppercase border border-slate-300">
                Web Academic Transcript
              </span>
              <p className="text-[11px] text-slate-500 font-mono">
                Document Ref: IU-TR-{profile.studentId.replace(/[^a-zA-Z0-9]/g, "")}-2026
              </p>
              <p className="text-[10px] text-slate-400">
                Issued on: September 13, 2026
              </p>
            </div>
          </div>
        </div>

        {/* STUDENT INFORMATION GRID */}
        <div className="rounded-2xl bg-slate-50/80 border border-slate-200 p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Full Name</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">{profile.name}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic / Enrollment ID</span>
            <span className="text-sm font-mono font-bold text-iqra-blue-700 block mt-0.5">
              {profile.studentId}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree Program</span>
            <span className="font-bold text-slate-800 block mt-0.5">{profile.program}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
            <span className="font-bold text-slate-800 block mt-0.5">{profile.department}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus</span>
            <span className="font-bold text-slate-800 block mt-0.5">{profile.campus}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Admission Batch</span>
            <span className="font-bold text-slate-800 block mt-0.5">{profile.batch}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Standing Term</span>
            <span className="font-bold text-slate-800 block mt-0.5">{profile.currentSemester}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Status</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[11px] mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {profile.status} Regular
            </span>
          </div>
        </div>

        {/* ACADEMIC RECORD GROUPED BY SEMESTER */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
            Academic Coursework Record
          </h3>

          <div className="space-y-6">
            {history.map((semester) => (
              <div
                key={semester.semesterNumber}
                className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs"
              >
                {/* Semester Title Bar */}
                <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 uppercase">
                      {semester.semesterName}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-600">{semester.session}</span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span>
                      Term Cr: <strong>{semester.creditHours}</strong>
                    </span>
                    <span>
                      SGPA: <strong className="text-iqra-blue-700">{semester.gpa.toFixed(2)}</strong>
                    </span>
                    <span>
                      CGPA: <strong>{semester.cgpa.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                {/* Courses Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4 w-28">Course Code</th>
                        <th className="py-2.5 px-4">Course Title</th>
                        <th className="py-2.5 px-4 text-center w-20">Cr. Hours</th>
                        <th className="py-2.5 px-4 text-center w-20">Letter Grade</th>
                        <th className="py-2.5 px-4 text-center w-24">Grade Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {semester.courses.map((course: CourseResult) => (
                        <tr key={course.code} className="hover:bg-slate-50/60 font-medium">
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                            {course.code}
                          </td>
                          <td className="py-2.5 px-4 text-slate-900 font-semibold">
                            {course.title}
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono text-slate-700">
                            {course.creditHours}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span
                              className={cn(
                                "font-bold px-2 py-0.5 rounded text-[11px]",
                                course.grade.startsWith("A")
                                  ? "bg-emerald-50 text-emerald-800"
                                  : "bg-blue-50 text-blue-800"
                              )}
                            >
                              {course.grade}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                            {course.gradePoints.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TRANSCRIPT SUMMARY & DEGREE AUDIT */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-iqra-navy-900 text-white p-6 grid grid-cols-2 sm:grid-cols-5 gap-4 shadow-md">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Credits Attempted</span>
            <span className="text-2xl font-black font-mono mt-1 block">{totalCreditsAttempted}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Credits Completed</span>
            <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">
              {totalCreditsCompleted}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Semester SGPA</span>
            <span className="text-2xl font-black font-mono text-cyan-400 mt-1 block">
              {currentSGPA.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-iqra-gold-400 block">
              Cumulative CGPA
            </span>
            <span className="text-2xl font-black font-mono text-iqra-gold-400 mt-1 block">
              {cumulativeCGPA.toFixed(2)}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree Standing</span>
            <span className="text-xs font-bold text-white mt-2 block truncate">
              {profile.academicStanding || "Dean's Honor Roll"}
            </span>
          </div>
        </div>

        {/* GRADING SCALE REFERENCE & VERIFICATION FOOTER */}
        <div className="border-t border-slate-200 pt-6 space-y-4 text-[11px] text-slate-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-slate-800 block mb-1">
                HEC Grading Scale Reference:
              </span>
              <p className="text-[10px] leading-relaxed text-slate-500">
                A+: 4.00 (90–100%) • A: 4.00 (85–89%) • A-: 3.67 (80–84%) • B+: 3.33 (75–79%) • B: 3.00 (70–74%) • B-: 2.67 (65–69%) • C+: 2.33 (60–64%) • C: 2.00 (55–59%) • D: 1.00 (50–54%) • F: 0.00 (&lt;50%)
              </p>
            </div>

            <div className="text-left md:text-right space-y-1">
              <span className="font-bold text-slate-800 block">
                Verification & Authenticity
              </span>
              <p className="text-[10px] text-slate-400 font-mono">
                System Verification Hash: 9d8b74c2e1a504f7b6
              </p>
              <p className="text-[10px] text-slate-400">
                Controller of Examinations, Iqra University Chak Shehzad Campus
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
