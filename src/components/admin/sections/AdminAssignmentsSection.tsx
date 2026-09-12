"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Award,
  Calendar,
  X,
  User,
  BookOpen,
} from "lucide-react";
import {
  AdminAssignment,
  AdminSubmission,
  AdminCourse,
} from "@/lib/admin-data";

interface AdminAssignmentsSectionProps {
  assignments: AdminAssignment[];
  submissions: AdminSubmission[];
  courses: AdminCourse[];
  onAddAssignment: (assignment: Omit<AdminAssignment, "id">) => void;
  onUpdateAssignment: (id: string, updated: Partial<AdminAssignment>) => void;
  onDeleteAssignment: (id: string) => void;
  onUpdateSubmission: (submissionId: string, updated: Partial<AdminSubmission>) => void;
  onDeleteSubmission: (submissionId: string) => void;
}

export const AdminAssignmentsSection: React.FC<AdminAssignmentsSectionProps> = ({
  assignments,
  submissions,
  courses,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onUpdateSubmission,
  onDeleteSubmission,
}) => {
  const [courseFilter, setCourseFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState<AdminAssignment | null>(null);
  const [gradeModalSubmission, setGradeModalSubmission] = useState<AdminSubmission | null>(null);

  // New assignment form state
  const [newTitle, setNewTitle] = useState("");
  const [newCourseCode, setNewCourseCode] = useState(courses[0]?.code || "CS-401");
  const [newDueDate, setNewDueDate] = useState("20-Sep-2026");
  const [newDueTime, setNewDueTime] = useState("11:59 PM");
  const [newTotalMarks, setNewTotalMarks] = useState(20);
  const [newWeightage, setNewWeightage] = useState("10%");
  const [newInstructions, setNewInstructions] = useState("");

  // Grade edit form
  const [editMarks, setEditMarks] = useState<number>(0);
  const [editFeedback, setEditFeedback] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const crs = courses.find((c) => c.code === newCourseCode);

    onAddAssignment({
      title: newTitle,
      courseCode: newCourseCode,
      courseTitle: crs?.title || "Academic Course",
      instructor: crs?.instructor || "Course Instructor",
      issueDate: "09-Sep-2026",
      dueDate: newDueDate,
      dueTime: newDueTime,
      totalMarks: newTotalMarks,
      weightage: newWeightage,
      isPublished: true,
      submissionsCount: 0,
      totalEnrolled: crs?.enrolledCount || 40,
      submissionType: "PDF/Code Archive",
      instructions: newInstructions || "Follow standard HEC report guidelines and clean code practices.",
    });

    setIsCreateOpen(false);
    setNewTitle("");
    setNewInstructions("");
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeModalSubmission) return;

    onUpdateSubmission(gradeModalSubmission.id, {
      marksAwarded: editMarks,
      instructorFeedback: editFeedback,
      status: "Graded",
    });

    setGradeModalSubmission(null);
  };

  const filteredAssignments = assignments.filter((a) => {
    if (courseFilter !== "All" && a.courseCode !== courseFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase flex items-center gap-1">
              <FileText className="w-3 h-3" />
              University Coursework Management
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Total Tasks: {assignments.length}</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Assignments & Submissions Central
          </h2>
          <p className="text-xs text-slate-500">
            Publish coursework, inspect student submissions, override marks, and review rubric evaluations.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-iqra-gold-400" />
          <span>Create & Publish Assignment</span>
        </button>
      </div>

      {/* Course filter toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter by Course:</span>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.code}>{c.code} — {c.title.slice(0, 24)}...</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-slate-400">
          Showing {filteredAssignments.length} Assignments
        </span>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAssignments.map((asg) => {
          const submissionRate = Math.round(((asg.submissionsCount ?? asg.totalSubmissions ?? 0) / (asg.totalEnrolled || 1)) * 100);

          return (
            <div
              key={asg.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-iqra-blue-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-iqra-navy-900 text-white">
                      {asg.courseCode}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {asg.weightage} of Final Grade
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      asg.isPublished
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {asg.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{asg.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instructor: {asg.instructor}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5 text-rose-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Due: {asg.dueDate} ({asg.dueTime})</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Award className="w-3.5 h-3.5 text-iqra-gold-600 shrink-0" />
                    <span>Maximum Marks: <strong>{asg.totalMarks}</strong></span>
                  </p>
                </div>

                {/* Submissions progress */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Student Turn-in Rate:</span>
                    <span className="font-bold text-slate-800">
                      {asg.submissionsCount} / {asg.totalEnrolled} Submissions ({submissionRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-iqra-blue-600"
                      style={{ width: `${submissionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedAssignmentForReview(asg)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-iqra-blue-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Submissions ({asg.submissionsCount})</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateAssignment(asg.id, { isPublished: !asg.isPublished })}
                    className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-600"
                  >
                    {asg.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={() => onDeleteAssignment(asg.id)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                    title="Delete assignment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. INSPECT SUBMISSIONS MODAL & MARKS OVERRIDE */}
      {/* ========================================================= */}
      {selectedAssignmentForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-white/20 text-white">
                    {selectedAssignmentForReview.courseCode}
                  </span>
                  <span className="text-xs text-iqra-gold-400 font-semibold">
                    {selectedAssignmentForReview.totalMarks} Total Marks
                  </span>
                </div>
                <h3 className="text-lg font-black font-heading text-white">
                  {selectedAssignmentForReview.title}
                </h3>
                <p className="text-xs text-blue-200">Student Submissions & Administrative Grade Overrides</p>
              </div>
              <button
                onClick={() => setSelectedAssignmentForReview(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-bold">Student Name & ID</th>
                      <th className="pb-3 font-bold">Submitted File</th>
                      <th className="pb-3 font-bold">Submission Timestamp</th>
                      <th className="pb-3 font-bold text-center">Marks Awarded</th>
                      <th className="pb-3 font-bold text-center">Status</th>
                      <th className="pb-3 font-bold text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions
                      .filter((sub) => sub.courseCode === selectedAssignmentForReview.courseCode)
                      .map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/70">
                          <td className="py-3">
                            <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                            <span className="font-mono text-[10px] text-slate-500">{sub.studentId}</span>
                          </td>

                          <td className="py-3 font-mono text-slate-700 truncate max-w-[150px]">
                            {sub.fileName}
                          </td>

                          <td className="py-3 text-[11px] text-slate-500">{sub.submittedAt}</td>

                          <td className="py-3 text-center font-mono font-bold text-slate-900">
                            {sub.marksAwarded !== undefined ? (
                              <span className="text-emerald-700">{sub.marksAwarded} / {sub.maxMarks}</span>
                            ) : (
                              <span className="text-slate-400">Not Graded</span>
                            )}
                          </td>

                          <td className="py-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                sub.status === "Graded"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : sub.status === "Late"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>

                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setGradeModalSubmission(sub);
                                  setEditMarks(sub.marksAwarded || 15);
                                  setEditFeedback(sub.instructorFeedback || "Approved by Registrar.");
                                }}
                                className="px-2.5 py-1 rounded-lg bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold text-[10px]"
                              >
                                Modify Grade
                              </button>
                              <button
                                onClick={() => onDeleteSubmission(sub.id)}
                                className="p-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                                title="Delete submission"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedAssignmentForReview(null)}
                className="px-5 py-2 rounded-xl bg-iqra-navy-900 text-white text-xs font-bold"
              >
                Close Submissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. GRADE OVERRIDE MODAL */}
      {/* ========================================================= */}
      {gradeModalSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Administrative Grade Override</h3>
                <p className="text-xs text-slate-500">{gradeModalSubmission.studentName} ({gradeModalSubmission.studentId})</p>
              </div>
              <button onClick={() => setGradeModalSubmission(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Awarded Marks (Max: {gradeModalSubmission.maxMarks})</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={gradeModalSubmission.maxMarks}
                  value={editMarks}
                  onChange={(e) => setEditMarks(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Administrator Remarks / Feedback</label>
                <textarea
                  rows={3}
                  value={editFeedback}
                  onChange={(e) => setEditFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradeModalSubmission(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold"
                >
                  Confirm Grade Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CREATE ASSIGNMENT MODAL */}
      {/* ========================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-heading text-white">Create University Assignment</h3>
                <p className="text-xs text-blue-200">Centralized Coursework Repository</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-3.5 text-xs overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus Implementation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Select Course</label>
                <select
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.code}>{c.code} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Due Time</label>
                  <input
                    type="text"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Total Marks</label>
                  <input
                    type="number"
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Weightage</label>
                  <input
                    type="text"
                    value={newWeightage}
                    onChange={(e) => setNewWeightage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Instructions & Guidelines</label>
                <textarea
                  rows={3}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="Submission instructions, rubric criteria..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold"
                >
                  Publish to LMS Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
