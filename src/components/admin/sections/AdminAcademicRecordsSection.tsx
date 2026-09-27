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
<<<<<<< Updated upstream
  GraduationCap,
  Lock,
  Unlock,
  Clock,
  AlertCircle,
  Filter,
  X,
  ChevronRight,
=======
  QrCode,
  ExternalLink,
  AlertTriangle,
  Send,
  Check,
>>>>>>> Stashed changes
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
<<<<<<< Updated upstream
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
=======
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
  CredentialButton,
  CredentialModal,
} from "@/components/admin/credential";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
  initialTab?: "transcripts" | "gpa-cgpa" | "reports" | "progression";
=======
  initialTab?: "transcripts" | "gpa-cgpa" | "reports" | "early-warning";
>>>>>>> Stashed changes
  students: StudentAcademicRecord[];
}

export const AdminAcademicRecordsSection: React.FC<AdminAcademicRecordsSectionProps> = ({
  initialTab = "transcripts",
  students,
}) => {
<<<<<<< Updated upstream
  const [activeSubTab, setActiveSubTab] = useState<
    "transcripts" | "gpa-cgpa" | "reports" | "progression"
  >(initialTab);
=======
  const [activeSubTab, setActiveSubTab] = useState<"transcripts" | "gpa-cgpa" | "reports" | "early-warning">(
    initialTab
  );
>>>>>>> Stashed changes
  const [searchQuery, setSearchQuery] = useState("");
  const [progressionFilterDepartment, setProgressionFilterDepartment] = useState("All");
  const [progressionFilterStatus, setProgressionFilterStatus] = useState("All");
  const [auditStudentDetail, setAuditStudentDetail] = useState<any | null>(null);

  const [selectedStudent, setSelectedStudent] = useState<StudentAcademicRecord | null>(
    students[0] || null
  );
  const [atRiskModalStudent, setAtRiskModalStudent] = useState<StudentAcademicRecord | null>(null);
  const [aiNoticeSentId, setAiNoticeSentId] = useState<string | null>(null);

  // Live institutional academic progression data from Convex
  const liveProgressionOverview = useQuery(
    api.academicManagement.getAdminAcademicProgressionOverview,
    {}
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
      <CredentialCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#8a8272] flex items-center gap-1">
                <ScrollText className="w-3.5 h-3.5 text-[#8a8272]" />
                University Registrar Records
              </span>
              <span className="text-xs text-[#4a4335]">•</span>
              <span className="text-xs font-semibold text-[#8a8272]">Official Graduation & Standing</span>
            </div>
            <h2 className="text-2xl font-serif font-medium text-[#F2EEE4] tracking-tight">
              Transcripts, GPA & Academic Reports
            </h2>
            <p className="text-xs text-[#8a8272] mt-1">
              Official verifiable web transcripts, cumulative GPA distributions, and departmental performance reports.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-[#1D1B18] p-1 rounded-[6px] border border-[#4a4335] self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab("transcripts")}
              className={cn(
                "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5",
                activeSubTab === "transcripts"
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335] font-semibold"
                  : "text-[#8a8272] hover:text-[#F2EEE4]"
              )}
            >
              <ScrollText className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>Transcripts</span>
            </button>

            <button
              onClick={() => setActiveSubTab("gpa-cgpa")}
              className={cn(
                "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5",
                activeSubTab === "gpa-cgpa"
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335] font-semibold"
                  : "text-[#8a8272] hover:text-[#F2EEE4]"
              )}
            >
              <Award className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>GPA & CGPA</span>
            </button>

            <button
              onClick={() => setActiveSubTab("reports")}
              className={cn(
                "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5",
                activeSubTab === "reports"
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335] font-semibold"
                  : "text-[#8a8272] hover:text-[#F2EEE4]"
              )}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>Academic Reports</span>
            </button>

            <button
              onClick={() => setActiveSubTab("early-warning")}
              className={cn(
                "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5",
                activeSubTab === "early-warning"
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335] font-semibold"
                  : "text-[#8a8272] hover:text-[#F2EEE4]"
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#B8963E]" />
              <span>At-Risk Early Warning</span>
            </button>
          </div>
<<<<<<< Updated upstream
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Transcripts, GPA & Academic Progression
          </h2>
          <p className="text-xs text-slate-500">
            Official verifiable web transcripts, cumulative GPA distributions, automatic semester progression audits, and institutional reports.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setActiveSubTab("progression")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "progression"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Academic Progression</span>
          </button>

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
=======
        </div>
      </CredentialCard>
>>>>>>> Stashed changes

      {/* ------------------------------------------------------------- */}
      {/* 0. ACADEMIC PROGRESSION AUDIT ROSTER (REGISTRAR OVERVIEW) */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "progression" && (() => {
        const rawList = liveProgressionOverview || [];
        const filteredProgression = rawList.filter((item: any) => {
          const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesDept =
            progressionFilterDepartment === "All" || item.department === progressionFilterDepartment;

          const matchesStatus =
            progressionFilterStatus === "All" ||
            (progressionFilterStatus === "Passed" && item.semesterStatus.includes("Passed")) ||
            (progressionFilterStatus === "InProgress" && item.semesterStatus.includes("In Progress")) ||
            (progressionFilterStatus === "Failed" && item.semesterStatus.includes("Failed")) ||
            (progressionFilterStatus === "Available" && item.semesterStatus.includes("Available"));

          return matchesSearch && matchesDept && matchesStatus;
        });

        const passedStudentsCount = rawList.filter((s: any) => s.semesterStatus.includes("Passed")).length;
        const inProgressStudentsCount = rawList.filter((s: any) => s.semesterStatus.includes("In Progress")).length;
        const failedStudentsCount = rawList.filter((s: any) => s.semesterStatus.includes("Failed")).length;
        const availableStudentsCount = rawList.filter((s: any) => s.semesterStatus.includes("Available")).length;

        return (
          <div className="space-y-6">
            {/* Top 4 Institutional Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Enrolled Students Monitored
                </span>
                <span className="text-3xl font-black font-heading text-slate-900">
                  {rawList.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Real-time Progression Roster</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-1">
                  Passed Current Semester
                </span>
                <span className="text-3xl font-black font-heading text-emerald-700">
                  {passedStudentsCount}
                </span>
                <span className="text-[10px] text-emerald-600 block mt-1">Next Semester Unlocked ✓</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-amber-600 block mb-1">
                  Semester In Progress
                </span>
                <span className="text-3xl font-black font-heading text-amber-700">
                  {inProgressStudentsCount}
                </span>
                <span className="text-[10px] text-amber-600 block mt-1">Pending Exam Marks / Approval</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-rose-600 block mb-1">
                  Academic Retake Required
                </span>
                <span className="text-3xl font-black font-heading text-rose-700">
                  {failedStudentsCount}
                </span>
                <span className="text-[10px] text-rose-600 block mt-1">Failed Courses Pending Repeat</span>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student name, ID, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <select
                    value={progressionFilterStatus}
                    onChange={(e) => setProgressionFilterStatus(e.target.value)}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Passed">Passed (Unlocked)</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Failed">Failed Courses</option>
                    <option value="Available">Available for Registration</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Institutional Progression Master Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black font-heading text-slate-900 uppercase tracking-wider">
                    Student Academic Progression Ledger ({filteredProgression.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live automatic academic standing, prerequisite unlock eligibility, and degree completion audit.
                  </p>
                </div>
              </div>

              {filteredProgression.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-600">No student progression records match this query.</p>
                  <p className="text-[11px] text-slate-400">Progression records update dynamically as faculty marks are approved and published.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Program & Dept</th>
                        <th className="py-3 px-3 text-center">Level</th>
                        <th className="py-3 px-3 text-center">Passed Sem</th>
                        <th className="py-3 px-3 text-center">GPA / CGPA</th>
                        <th className="py-3 px-3 text-center">Earned Cr</th>
                        <th className="py-3 px-4">Degree Progress</th>
                        <th className="py-3 px-3 text-center">Semester Status</th>
                        <th className="py-3 px-3 text-center">Next Eligible</th>
                        <th className="py-3 px-4 text-center">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredProgression.map((s: any) => {
                        const isPassed = s.semesterStatus.includes("Passed");
                        const isFailed = s.semesterStatus.includes("Failed");
                        const isInProgress = s.semesterStatus.includes("In Progress");

                        return (
                          <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 block">{s.name}</span>
                              <span className="text-[10px] font-mono text-slate-400">{s.studentId}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-800 block text-[11px]">{s.program}</span>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">{s.department}</span>
                            </td>

                            <td className="py-3 px-3 text-center font-bold text-slate-800">
                              Sem {s.currentSemester}
                            </td>

                            <td className="py-3 px-3 text-center">
                              {s.completedSemester !== "None" ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200/60">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  {s.completedSemester}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">None</span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-center">
                              <div className="font-bold font-mono text-iqra-blue-700">
                                {s.cgpa > 0 ? s.cgpa.toFixed(2) : "0.00"}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                GPA: {s.currentGpa > 0 ? s.currentGpa.toFixed(2) : "0.00"}
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                              {s.completedCreditHours} <span className="text-slate-400 font-normal">/ {s.totalDegreeCredits}</span>
                            </td>

                            <td className="py-3 px-4 min-w-[130px]">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                                <span>{s.academicProgress}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-iqra-blue-600 to-emerald-500"
                                  style={{ width: `${Math.min(100, s.academicProgress)}%` }}
                                />
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isPassed
                                    ? "bg-emerald-100 text-emerald-800"
                                    : isFailed
                                    ? "bg-rose-100 text-rose-800"
                                    : isInProgress
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                {isFailed && <AlertCircle className="w-3 h-3 text-rose-600" />}
                                {isInProgress && <Clock className="w-3 h-3 text-amber-600" />}
                                <span>{s.semesterStatus}</span>
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span className="font-bold text-slate-800 block text-xs">
                                Sem {s.nextEligibleSemester}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                {s.registrationStatus}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => setAuditStudentDetail(s)}
                                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-iqra-navy-900 hover:text-white text-slate-800 text-[11px] font-bold transition-all"
                              >
                                View Roadmap
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Student Audit Detail Modal Dialog */}
            {auditStudentDetail && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-iqra-gold-600">
                        Academic Progression Audit
                      </span>
                      <h3 className="text-lg font-black font-heading text-slate-900">
                        {auditStudentDetail.name} ({auditStudentDetail.studentId})
                      </h3>
                      <p className="text-xs text-slate-500">
                        {auditStudentDetail.program} • {auditStudentDetail.department}
                      </p>
                    </div>
                    <button
                      onClick={() => setAuditStudentDetail(null)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">CGPA</span>
                      <span className="text-xl font-black font-heading text-iqra-blue-700">
                        {auditStudentDetail.cgpa > 0 ? auditStudentDetail.cgpa.toFixed(2) : "0.00"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Earned Credits</span>
                      <span className="text-xl font-black font-heading text-slate-900">
                        {auditStudentDetail.completedCreditHours} / {auditStudentDetail.totalDegreeCredits}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Eligible</span>
                      <span className="text-sm font-black text-emerald-700 mt-1 block">
                        Semester {auditStudentDetail.nextEligibleSemester}
                      </span>
                    </div>
                  </div>

                  {/* Semesters 1 to 8 Audit Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Curriculum Semesters Breakdown (1 to 8)
                    </h4>
                    <div className="space-y-2">
                      {auditStudentDetail.semesters?.map((sem: any) => (
                        <div
                          key={sem.semesterNumber}
                          className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">
                              Semester {sem.semesterNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sem.status === "Passed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : sem.status === "Failed Courses"
                                  ? "bg-rose-100 text-rose-800"
                                  : sem.status === "In Progress"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {sem.statusLabel}
                            </span>
                          </div>

                          {sem.courses && sem.courses.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                              {sem.courses.map((c: any, i: number) => (
                                <div
                                  key={i}
                                  className="p-2 rounded-xl bg-white border border-slate-200/80 text-[11px] flex items-center justify-between"
                                >
                                  <span className="font-mono font-bold text-slate-800">{c.code}</span>
                                  <span className="text-slate-600 truncate max-w-[120px] mx-2">{c.title}</span>
                                  <span className="font-bold text-emerald-700 shrink-0">
                                    {c.grade} ({c.gradePoints.toFixed(2)})
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ------------------------------------------------------------- */}
      {/* 1. TRANSCRIPTS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "transcripts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Selector */}
          <CredentialCard>
            <CredentialHeader eyebrow="REGISTRATION" referenceId="RECORDS" />
            <h3 className="text-xs font-serif font-medium text-[#F2EEE4] mb-3">
              Select Enrolled Student
            </h3>
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-[#8a8272] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#1D1B18] border border-[#4a4335] rounded-[6px] text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#C9A25B]"
              />
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <p className="text-xs text-[#8a8272] p-4 text-center">No students available</p>
              ) : (
                filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className={cn(
                      "w-full text-left p-3 rounded-[6px] transition-all text-xs border",
                      selectedStudent?.id === s.id
                        ? "bg-[#23201b] border-[#4a4335] text-[#F2EEE4]"
                        : "bg-[#1D1B18] border-[#4a4335] hover:border-[#8a8272] text-[#D8D3C6]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate block font-serif font-medium">{s.name}</span>
                      <span className="text-[10px] font-mono text-[#D8D3C6]">
                        {s.studentId}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8a8272] block mt-1">
                      CGPA: {s.cgpa.toFixed(2)} • {s.completedCredits} Cr. Hrs
                    </span>
                  </button>
                ))
              )}
            </div>
          </CredentialCard>

          {/* Official Transcript Sheet */}
          <CredentialCard className="lg:col-span-2">
            {!selectedStudent ? (
              <div className="p-12 text-center text-[#8a8272] text-xs">
                No student selected for transcript preview.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#4a4335] pb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#8a8272] block">
                      Official University Web Transcript
                    </span>
                    <h3 className="text-xl font-serif font-medium text-[#F2EEE4] mt-0.5">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-xs text-[#8a8272] mt-0.5">
                      Enrollment: <strong className="font-mono text-[#D8D3C6]">{selectedStudent.studentId}</strong> • {selectedStudent.program}
                    </p>
                  </div>

                  <CredentialButton
                    variant="secondary"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    <span>Print Transcript</span>
                  </CredentialButton>
                </div>

                {/* Academic Metrics Summary */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] text-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8a8272] block">
                      Cumulative CGPA
                    </span>
                    <span className="text-2xl font-serif text-[#F2EEE4]">
                      {selectedStudent.cgpa.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8a8272] block">
                      Credit Hours Completed
                    </span>
                    <span className="text-2xl font-serif text-[#F2EEE4]">
                      {selectedStudent.completedCredits}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8a8272] block">
                      Academic Standing
                    </span>
                    <span className="text-xs font-medium text-[#7DAE7A] block mt-1">
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
                  <h4 className="text-xs font-serif font-medium text-[#F2EEE4] uppercase tracking-wider mb-2">
                    Published Semester Grades
                  </h4>

                  {selectedStudent.results.length === 0 ? (
                    <div className="p-8 text-center rounded-[6px] bg-[#1D1B18] border border-[#4a4335] text-xs text-[#8a8272]">
                      No results published for this student yet. Transcript records generate automatically when grades are published.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-[6px] border border-[#4a4335]">
                      <table className="w-full text-left text-xs text-[#D8D3C6]">
                        <thead className="bg-[#1D1B18] text-[10px] uppercase font-mono text-[#8a8272] border-b border-[#4a4335]">
                          <tr>
                            <th className="py-2.5 px-3">Code</th>
                            <th className="py-2.5 px-3">Course Title</th>
                            <th className="py-2.5 px-3 text-center">Credits</th>
                            <th className="py-2.5 px-3 text-center">Marks</th>
                            <th className="py-2.5 px-3 text-center">Grade</th>
                            <th className="py-2.5 px-3 text-center">Grade Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#4a4335]">
                          {selectedStudent.results.map((r, i) => (
                            <tr key={i} className="hover:bg-[#23201b]/50">
                              <td className="py-2.5 px-3 font-mono text-[#D8D3C6]">{r.courseCode}</td>
                              <td className="py-2.5 px-3">{r.courseTitle}</td>
                              <td className="py-2.5 px-3 text-center">{r.creditHours}</td>
                              <td className="py-2.5 px-3 text-center">{r.totalMarks}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-[#F2EEE4]">
                                {r.grade}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-[#8a8272]">
                                {r.gradePoints.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Cryptographic Verification Seal & QR Authenticator */}
                <div className="p-4 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[6px] bg-[#23201b] border border-[#4a4335] flex items-center justify-center text-[#D8D3C6] shrink-0 p-2">
                      <QrCode className="w-8 h-8 text-[#D8D3C6]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7DAE7A] flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-[#7DAE7A]" />
                          HEC-Attested Digital Credential
                        </span>
                        <span className="text-xs text-[#4a4335]">•</span>
                        <span className="text-[10px] font-mono text-[#8a8272]">
                          ID: IU-DEG-2026-{selectedStudent.studentId}
                        </span>
                      </div>
                      <p className="text-xs text-[#F2EEE4] font-medium mt-0.5">
                        Tamper-evident verification token active on public registry
                      </p>
                      <p className="text-[10px] text-[#8a8272] mt-0.5">
                        Authenticated via SHA-256 registrar cryptographic digest
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/verify/IU-DEG-2026-${selectedStudent.studentId}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-[6px] border border-[#4a4335] text-xs font-semibold text-[#F2EEE4] hover:bg-white/5 transition-colors select-none shrink-0"
                  >
                    <span>Verify Online Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#8a8272]" />
                  </Link>
                </div>
              </div>
            )}
          </CredentialCard>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. GPA & CGPA ANALYTICS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "gpa-cgpa" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <CredentialCard>
              <span className="text-[10px] font-mono uppercase text-[#8a8272] block mb-1">
                Institutional Average CGPA
              </span>
              <span className="text-3xl font-serif text-[#F2EEE4]">
                {avgCgpa > 0 ? avgCgpa.toFixed(2) : "N/A"}
              </span>
              <span className="text-[10px] text-[#8a8272] block mt-1">Across all students</span>
            </CredentialCard>

            <CredentialCard>
              <span className="text-[10px] font-mono uppercase text-[#7DAE7A] block mb-1">
                Dean's Honor Roll (≥3.50)
              </span>
              <span className="text-3xl font-serif text-[#7DAE7A]">
                {honorRollCount}
              </span>
              <span className="text-[10px] text-[#8a8272] block mt-1">Exceptional Standing</span>
            </CredentialCard>

            <CredentialCard>
              <span className="text-[10px] font-mono uppercase text-[#E27878] block mb-1">
                Academic Warnings (&lt;2.00)
              </span>
              <span className="text-3xl font-serif text-[#E27878]">{warningCount}</span>
              <span className="text-[10px] text-[#8a8272] block mt-1">Intervention Required</span>
            </CredentialCard>

            <CredentialCard>
              <span className="text-[10px] font-mono uppercase text-[#8a8272] block mb-1">
                Grading Formula
              </span>
              <span className="text-sm font-serif text-[#F2EEE4] mt-1 block">
                HEC Quality Points
              </span>
              <span className="text-[10px] text-[#8a8272] font-mono block">∑(GP × CH) ÷ ∑(CH)</span>
            </CredentialCard>
          </div>

          <CredentialCard>
            <CredentialHeader eyebrow="ACADEMIC ROSTER" referenceId="FALL 2026" />
            <h3 className="text-sm font-serif font-medium text-[#F2EEE4] uppercase tracking-wider mb-4">
              Student CGPA Roster
            </h3>

            {students.length === 0 ? (
              <p className="text-xs text-[#8a8272] text-center py-8">No student records available yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-[6px] border border-[#4a4335]">
                <table className="w-full text-left text-xs text-[#D8D3C6]">
                  <thead className="bg-[#1D1B18] text-[10px] uppercase font-mono text-[#8a8272] border-b border-[#4a4335]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Program</th>
                      <th className="py-3 px-4 text-center">CGPA</th>
                      <th className="py-3 px-4 text-center">Credit Hours</th>
                      <th className="py-3 px-4 text-center">Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4a4335]">
                    {students.map((s) => (
                      <tr key={s.id} className="hover:bg-[#23201b]/50">
                        <td className="py-3 px-4">
                          <span className="font-serif text-[#F2EEE4] block">{s.name}</span>
                          <span className="text-[10px] font-mono text-[#D8D3C6]">{s.studentId}</span>
                        </td>
                        <td className="py-3 px-4 text-[#8a8272]">{s.program}</td>
                        <td className="py-3 px-4 text-center font-serif text-[#D8D3C6] text-base">
                          {s.cgpa > 0 ? s.cgpa.toFixed(2) : "0.00"}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-[#8a8272]">{s.completedCredits}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono">
                            <span
                              className={cn(
                                "w-[7px] h-[7px] rounded-full",
                                s.cgpa >= 3.5
                                  ? "bg-[#7DAE7A]"
                                  : s.cgpa >= 2.0
                                  ? "bg-[#8a8272]"
                                  : "bg-[#E27878]"
                              )}
                            />
                            <span className="text-[#D8D3C6]">
                              {s.cgpa >= 3.5
                                ? "Honor Roll"
                                : s.cgpa >= 2.0
                                ? "Good Standing"
                                : "Warning"}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CredentialCard>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ACADEMIC REPORTS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "reports" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CredentialCard>
            <CredentialHeader eyebrow="REPORT" referenceId="ACADEMIC" />
            <CredentialTitle
              title="Student Performance Report"
              subheading="Credit & GPA Completion"
            />
            <p className="text-xs text-[#8a8272] leading-relaxed my-3">
              Consolidated departmental report containing credit completion rates, average GPAs, and graduation eligibility audit.
            </p>
            <CredentialFooter
              status={{ label: "Ready", state: "neutral" }}
              primaryAction={{
                label: "Export Report",
                onClick: () => window.print(),
              }}
            />
          </CredentialCard>

          <CredentialCard>
            <CredentialHeader eyebrow="REPORT" referenceId="EXAMINATION" />
            <CredentialTitle
              title="Pass / Fail Statistics"
              subheading="Midterm & Final Terminals"
            />
            <p className="text-xs text-[#8a8272] leading-relaxed my-3">
              Subject-wise pass vs failure analytics across Midterm and Final examination terminals for Fall 2026.
            </p>
            <CredentialFooter
              status={{ label: "Ready", state: "neutral" }}
              primaryAction={{
                label: "Generate Summary",
                onClick: () => window.print(),
              }}
            />
          </CredentialCard>

          <CredentialCard>
            <CredentialHeader eyebrow="REPORT" referenceId="COMPLIANCE" />
            <CredentialTitle
              title="HEC Compliance & Attendance"
              subheading="75% Threshold Clearance"
            />
            <p className="text-xs text-[#8a8272] leading-relaxed my-3">
              Examination eligibility audit verifying minimum 75% classroom attendance threshold across all departments.
            </p>
            <CredentialFooter
              status={{ label: "Ready", state: "neutral" }}
              primaryAction={{
                label: "Audit Eligibility",
                onClick: () => window.print(),
              }}
            />
          </CredentialCard>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. AT-RISK EARLY WARNING & INTERVENTION ENGINE */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "early-warning" && (
        <div className="space-y-6">
          {/* Risk Level Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CredentialCard>
              <div className="flex items-center justify-between text-xs font-semibold text-[#E27878] mb-1">
                <span>Critical Risk Tier</span>
                <AlertTriangle className="w-4 h-4 text-[#E27878]" />
              </div>
              <div className="text-3xl font-serif text-[#F2EEE4]">
                {students.filter((s) => s.cgpa < 2.0 || s.results.some((r) => r.grade === "F")).length}
              </div>
              <div className="text-[11px] text-[#8a8272] mt-0.5">
                CGPA &lt; 2.0 or terminal course failure
              </div>
            </CredentialCard>

            <CredentialCard>
              <div className="flex items-center justify-between text-xs font-semibold text-[#B8963E] mb-1">
                <span>Moderate Risk (Watchlist)</span>
                <TrendingUp className="w-4 h-4 text-[#B8963E]" />
              </div>
              <div className="text-3xl font-serif text-[#F2EEE4]">
                {students.filter((s) => s.cgpa >= 2.0 && s.cgpa < 2.6).length}
              </div>
              <div className="text-[11px] text-[#8a8272] mt-0.5">
                CGPA 2.0 - 2.59 or marginal course scores
              </div>
            </CredentialCard>

            <CredentialCard>
              <div className="flex items-center justify-between text-xs font-semibold text-[#7DAE7A] mb-1">
                <span>Satisfactory & Good Standing</span>
                <CheckCircle2 className="w-4 h-4 text-[#7DAE7A]" />
              </div>
              <div className="text-3xl font-serif text-[#F2EEE4]">
                {students.filter((s) => s.cgpa >= 2.6).length}
              </div>
              <div className="text-[11px] text-[#8a8272] mt-0.5">
                Academic standing compliant with HEC
              </div>
            </CredentialCard>
          </div>

          {/* At-Risk Students Table */}
          <CredentialCard>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4a4335]">
              <div>
                <h3 className="text-base font-serif font-medium text-[#F2EEE4]">
                  At-Risk Student Diagnostic Roster ({students.length})
                </h3>
                <p className="text-xs text-[#8a8272] mt-0.5">
                  Early detection indicators analyzed from cumulative GPA, course terminal results, and attendance records
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#8a8272] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter student name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] pl-9 pr-3 py-1.5 text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#4a4335]"
                />
              </div>
            </div>

            <div className="overflow-x-auto mt-4 rounded-[6px] border border-[#4a4335]">
              <table className="w-full text-left text-xs text-[#D8D3C6]">
                <thead className="bg-[#0e0d0b] text-[10px] uppercase font-mono text-[#8a8272] border-b border-[#4a4335]">
                  <tr>
                    <th className="py-2.5 px-3">Student Candidate</th>
                    <th className="py-2.5 px-3">Program & Dept</th>
                    <th className="py-2.5 px-3 text-center">CGPA</th>
                    <th className="py-2.5 px-3">Primary Risk Triggers</th>
                    <th className="py-2.5 px-3 text-center">Risk Tier</th>
                    <th className="py-2.5 px-3 text-right">Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4a4335]">
                  {filteredStudents.map((s) => {
                    const isCritical = s.cgpa < 2.0 || s.results.some((r) => r.grade === "F");
                    const isModerate = !isCritical && s.cgpa < 2.6;
                    const riskTier = isCritical ? "Critical" : isModerate ? "Moderate" : "Low";
                    const hasNotice = aiNoticeSentId === s.id;

                    const triggers: string[] = [];
                    if (s.cgpa < 2.0) triggers.push("Sub-2.0 CGPA");
                    if (s.cgpa >= 2.0 && s.cgpa < 2.5) triggers.push("Marginal CGPA");
                    if (s.results.some((r) => r.grade === "F")) triggers.push("Course F Grade");
                    if (s.results.some((r) => r.percentage < 60)) triggers.push("Quiz Average < 60%");
                    if (triggers.length === 0) triggers.push("Normal Pace");

                    return (
                      <tr key={s.id} className="hover:bg-[#23201b]/50 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-serif font-medium text-[#F2EEE4]">{s.name}</p>
                          <p className="text-[10px] font-mono text-[#8a8272]">{s.studentId}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-[#D8D3C6]">{s.program}</p>
                          <p className="text-[10px] text-[#8a8272]">{s.department}</p>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-[#F2EEE4]">
                          {s.cgpa.toFixed(2)}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {triggers.map((t, idx) => (
                              <span
                                key={idx}
                                className={`text-[10px] px-2 py-0.5 rounded-[4px] border font-mono ${
                                  isCritical
                                    ? "bg-rose-950/20 text-[#E27878] border-[#E27878]/30"
                                    : isModerate
                                      ? "bg-amber-950/20 text-[#B8963E] border-[#B8963E]/30"
                                      : "bg-emerald-950/20 text-[#7DAE7A] border-[#7DAE7A]/30"
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-medium ${
                              isCritical
                                ? "text-[#E27878]"
                                : isModerate
                                  ? "text-[#B8963E]"
                                  : "text-[#7DAE7A]"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isCritical
                                  ? "bg-[#E27878]"
                                  : isModerate
                                    ? "bg-[#B8963E]"
                                    : "bg-[#7DAE7A]"
                              }`}
                            />
                            {riskTier}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setAtRiskModalStudent(s)}
                              className="h-[28px] px-2.5 rounded-[4px] border border-[#4a4335] text-[11px] font-medium text-[#F2EEE4] hover:bg-white/5 transition-colors inline-flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-[#8a8272]" />
                              <span>AI Remediation</span>
                            </button>
                            <button
                              onClick={() => setAiNoticeSentId(s.id)}
                              disabled={hasNotice}
                              className={`h-[28px] px-2.5 rounded-[4px] border text-[11px] font-medium transition-colors inline-flex items-center gap-1 ${
                                hasNotice
                                  ? "border-[#7DAE7A]/40 text-[#7DAE7A] bg-emerald-950/20"
                                  : "border-[#4a4335] text-[#D8D3C6] hover:bg-white/5"
                              }`}
                            >
                              {hasNotice ? (
                                <>
                                  <Check className="w-3 h-3 text-[#7DAE7A]" />
                                  <span>Dispatched</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3" />
                                  <span>Send Warning</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CredentialCard>
        </div>
      )}

      {/* AI Academic Remediation Modal */}
      {atRiskModalStudent && (
        <CredentialModal
          isOpen={true}
          onClose={() => setAtRiskModalStudent(null)}
          title="AI Academic Intervention & Remediation Blueprint"
          eyebrow="EARLY WARNING ADVISORY"
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335] flex items-center justify-between">
              <div>
                <p className="font-serif text-sm font-medium text-[#F2EEE4]">
                  {atRiskModalStudent.name}
                </p>
                <p className="text-[11px] font-mono text-[#8a8272]">
                  {atRiskModalStudent.studentId} • {atRiskModalStudent.program}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#8a8272] block">Current CGPA</span>
                <span className="text-base font-serif font-bold text-[#F2EEE4]">
                  {atRiskModalStudent.cgpa.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-serif font-medium text-[#F2EEE4] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8a8272]" />
                Institutional AI Remedial Strategy
              </h4>
              <div className="p-3.5 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] space-y-2.5 text-[#D8D3C6] leading-relaxed">
                <p>
                  Based on recent terminal examinations and coursework velocity, the Academic Advisory Engine recommends a 4-week structured recovery schedule:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#8a8272]">
                  <li>
                    <strong className="text-[#D8D3C6]">Mandatory Faculty Mentorship:</strong> 2 hours/week dedicated office hours with department advisor.
                  </li>
                  <li>
                    <strong className="text-[#D8D3C6]">Peer Tutoring Pairing:</strong> Partner student with Dean&apos;s Honor Roll peer for prerequisite review.
                  </li>
                  <li>
                    <strong className="text-[#D8D3C6]">Midterm Re-Evaluation:</strong> Schedule compensatory quiz retake to restore continuous assessment marks.
                  </li>
                  <li>
                    <strong className="text-[#D8D3C6]">Bi-Weekly Progress Audit:</strong> Automated check-ins via student dashboard planner.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#4a4335]">
              <CredentialButton
                variant="secondary"
                onClick={() => setAtRiskModalStudent(null)}
              >
                Close Blueprint
              </CredentialButton>
              <CredentialButton
                variant="primary"
                onClick={() => {
                  setAiNoticeSentId(atRiskModalStudent.id);
                  setAtRiskModalStudent(null);
                }}
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Assign & Dispatch Plan
              </CredentialButton>
            </div>
          </div>
        </CredentialModal>
      )}
    </div>
  );
};



