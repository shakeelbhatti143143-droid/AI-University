"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Award,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  X,
  AlertTriangle,
  Lock,
  Unlock,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface AcademicResult {
  _id: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  semester: string;
  assignmentMarks: number;
  quizMarks: number;
  midtermMarks: number;
  finalMarks: number;
  attendanceMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gradePoints: number;
  creditHours: number;
  status: "Draft" | "Submitted" | "Reviewed" | "Approved" | "Published";
  publishedAt?: number;
  publishedBy?: string;
  remarks?: string;
  createdAt: number;
  updatedAt: number;
}

interface AdminResultsGradesSectionProps {
  results: AcademicResult[];
  students: Array<{ id: string; name: string; studentId: string; email: string }>;
  courses: Array<{ code: string; title: string; creditHours: number }>;
  onSaveResult: (data: any) => Promise<void>;
  onUpdateStatus: (resultId: string, status: AcademicResult["status"]) => Promise<void>;
}

export const AdminResultsGradesSection: React.FC<AdminResultsGradesSectionProps> = ({
  results,
  students,
  courses,
  onSaveResult,
  onUpdateStatus,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Marks Entry
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || "",
    studentName: students[0]?.name || "",
    enrollmentId: students[0]?.studentId || "",
    courseCode: courses[0]?.code || "CS-201",
    courseTitle: courses[0]?.title || "Data Structures & Algorithms",
    creditHours: courses[0]?.creditHours || 4,
    section: "A",
    semester: "Fall 2026",
    assignmentMarks: 18,
    quizMarks: 14,
    midtermMarks: 22,
    finalMarks: 32,
    attendanceMarks: 5,
    status: "Draft" as const,
    remarks: "",
  });

  // Calculate live preview in modal
  const previewTotal =
    formData.assignmentMarks +
    formData.quizMarks +
    formData.midtermMarks +
    formData.finalMarks +
    formData.attendanceMarks;
  const previewPct = Math.min(Math.max(previewTotal, 0), 100);

  const getPreviewGrade = (pct: number) => {
    if (pct >= 85) return { grade: "A", gp: 4.0 };
    if (pct >= 80) return { grade: "A-", gp: 3.67 };
    if (pct >= 75) return { grade: "B+", gp: 3.33 };
    if (pct >= 71) return { grade: "B", gp: 3.0 };
    if (pct >= 68) return { grade: "B-", gp: 2.67 };
    if (pct >= 64) return { grade: "C+", gp: 2.33 };
    if (pct >= 60) return { grade: "C", gp: 2.0 };
    if (pct >= 50) return { grade: "D", gp: 1.0 };
    return { grade: "F", gp: 0.0 };
  };

  const previewScale = getPreviewGrade(previewPct);

  const handleStudentSelect = (sId: string) => {
    const s = students.find((x) => x.id === sId);
    if (s) {
      setFormData((prev) => ({
        ...prev,
        studentId: s.id,
        studentName: s.name,
        enrollmentId: s.studentId,
      }));
    }
  };

  const handleCourseSelect = (code: string) => {
    const c = courses.find((x) => x.code === code);
    if (c) {
      setFormData((prev) => ({
        ...prev,
        courseCode: c.code,
        courseTitle: c.title,
        creditHours: c.creditHours,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.courseCode) {
      alert("Please select student and course.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSaveResult({
        ...formData,
        courseId: formData.courseCode,
        adminName: user?.name || "Administrator",
        adminEmail: user?.email || "admin@isb.iqra.edu.pk",
      });
      setIsEntryModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save marks.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.enrollmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesCourse = courseFilter === "All" || r.courseCode === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-600" />
              Official Grading Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Iqra University Registrar</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Results Entry & Grade Publishing
          </h2>
          <p className="text-xs text-slate-500">
            Enter terminal marks, compute HEC quality points, and publish approved grades to Student Portals & Transcripts.
          </p>
        </div>

        <button
          onClick={() => setIsEntryModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 self-start md:self-auto transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Enter Student Marks</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, enrollment ID, course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Workflow States</option>
            <option value="Draft">Draft (Hidden)</option>
            <option value="Submitted">Submitted</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Approved">Approved</option>
            <option value="Published">Published (Live)</option>
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredResults.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No results found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No academic results have been entered yet. Click 'Enter Student Marks' to evaluate students.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4 text-center">Score Breakdown</th>
                  <th className="py-3 px-4 text-center">Total / %</th>
                  <th className="py-3 px-4 text-center">Grade (GP)</th>
                  <th className="py-3 px-4 text-center">Workflow State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{r.studentName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{r.enrollmentId}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block font-mono">{r.courseCode}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                        {r.courseTitle}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-600 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
                        <span>Asg:{r.assignmentMarks}</span>
                        <span>•</span>
                        <span>Qz:{r.quizMarks}</span>
                        <span>•</span>
                        <span>Mid:{r.midtermMarks}</span>
                        <span>•</span>
                        <span>Fin:{r.finalMarks}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-black text-slate-900 block">{r.totalMarks} / 100</span>
                      <span className="text-[10px] text-slate-500">{r.percentage}%</span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          "inline-block px-2.5 py-0.5 rounded text-[11px] font-black uppercase",
                          r.grade === "A" || r.grade === "A-"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.grade.startsWith("B")
                              ? "bg-blue-100 text-blue-800"
                              : r.grade === "F"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {r.grade} ({r.gradePoints} GP)
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                          r.status === "Published"
                            ? "bg-emerald-500 text-white font-black"
                            : r.status === "Approved"
                              ? "bg-blue-100 text-blue-800"
                              : r.status === "Reviewed"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {r.status !== "Published" ? (
                        <button
                          onClick={() => onUpdateStatus(r._id, "Published")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 ml-auto"
                          title="Publish Result to Student Portal & Transcript"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Publish</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus(r._id, "Draft")}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs ml-auto"
                          title="Unpublish to Draft"
                        >
                          Unpublish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MARKS ENTRY MODAL */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black font-heading text-slate-900">
                  Enter Academic Evaluation
                </h3>
                <p className="text-xs text-slate-500">
                  Total marks, percentage, grade letter and grade points will compute automatically.
                </p>
              </div>
              <button
                onClick={() => setIsEntryModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Student *</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Course *</label>
                  <select
                    value={formData.courseCode}
                    onChange={(e) => handleCourseSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Marks Inputs */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Asg (20)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={formData.assignmentMarks}
                      onChange={(e) =>
                        setFormData({ ...formData, assignmentMarks: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Quiz (15)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={formData.quizMarks}
                      onChange={(e) =>
                        setFormData({ ...formData, quizMarks: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Midterm (25)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={formData.midtermMarks}
                      onChange={(e) =>
                        setFormData({ ...formData, midtermMarks: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Final (35)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={35}
                      value={formData.finalMarks}
                      onChange={(e) =>
                        setFormData({ ...formData, finalMarks: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Att (5)</label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={formData.attendanceMarks}
                      onChange={(e) =>
                        setFormData({ ...formData, attendanceMarks: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>

                {/* Real-time Calculation Display */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Total Calculated
                    </span>
                    <span className="text-xl font-black text-white">{previewTotal} / 100</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Assigned Grade
                    </span>
                    <span className="text-xl font-black text-iqra-gold-400">
                      {previewScale.grade} ({previewScale.gp} GP)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="Draft">Draft (Private, not visible to student)</option>
                  <option value="Submitted">Submitted (For departmental review)</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Approved">Approved (Ready for publishing)</option>
                  <option value="Published">Published (Immediately visible to student)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving Marks..." : "Save Academic Result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
