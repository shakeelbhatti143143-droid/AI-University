"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  X,
  Send,
  Download,
  BookOpen,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FacultyAssignmentsSectionProps {
  assignments: any[];
  submissions: any[];
  courses: any[];
  facultyName: string;
  onCreateAssignment: (data: any) => Promise<any>;
  onGradeSubmission: (data: any) => Promise<any>;
}

export const FacultyAssignmentsSection: React.FC<FacultyAssignmentsSectionProps> = ({
  assignments,
  submissions,
  courses,
  facultyName,
  onCreateAssignment,
  onGradeSubmission,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"assignments" | "submissions">("assignments");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<any | null>(null);
  const [obtainedMarks, setObtainedMarks] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Assignment Form State
  const defaultCourse = courses && courses.length > 0 ? courses[0] : null;
  const [formData, setFormData] = useState({
    title: "",
    courseId: defaultCourse?._id || "",
    courseCode: defaultCourse?.code || "",
    courseTitle: defaultCourse?.name || "",
    section: "A",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dueTime: "11:59 PM",
    totalMarks: 20,
    weightage: "10%",
    description: "",
  });

  // Keep form course in sync when courses array loads or updates
  useEffect(() => {
    if (courses && courses.length > 0) {
      const exists = courses.some((c) => c._id === formData.courseId);
      if (!exists) {
        setFormData((prev) => ({
          ...prev,
          courseId: courses[0]._id,
          courseCode: courses[0].code,
          courseTitle: courses[0].name,
        }));
      }
    }
  }, [courses, formData.courseId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setIsSubmitting(true);
      const targetCourse =
        courses.find((c) => c._id === formData.courseId) ||
        courses.find((c) => c.code === formData.courseCode) ||
        courses[0];

      if (!targetCourse) {
        alert("Please select an assigned course for the assignment.");
        return;
      }

      await onCreateAssignment({
        title: formData.title.trim(),
        courseId: targetCourse._id,
        courseCode: targetCourse.code,
        courseTitle: targetCourse.name,
        section: formData.section,
        facultyName,
        description: formData.description.trim() || "Complete the assigned tasks.",
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        totalMarks: Number(formData.totalMarks),
        weightage: formData.weightage,
      });

      setIsCreateModalOpen(false);
      setSuccessMessage(`Assignment "${formData.title}" published successfully.`);
      const resetCourse = courses && courses.length > 0 ? courses[0] : null;
      setFormData({
        title: "",
        courseId: resetCourse?._id || "",
        courseCode: resetCourse?.code || "",
        courseTitle: resetCourse?.name || "",
        section: "A",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        dueTime: "11:59 PM",
        totalMarks: 20,
        weightage: "10%",
        description: "",
      });
    } catch (err: any) {
      alert(err.message || "Failed to create assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      setIsSubmitting(true);
      await onGradeSubmission({
        submissionId: gradingSubmission._id,
        obtainedMarks: Number(obtainedMarks),
        feedback: feedback.trim(),
        facultyName,
      });

      setGradingSubmission(null);
      setSuccessMessage(
        `Marks recorded (${obtainedMarks}/${gradingSubmission.maxMarks}) for ${gradingSubmission.studentName}.`
      );
    } catch (err: any) {
      alert(err.message || "Failed to submit marks.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Continuous Assessment
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Coursework</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Assignments & Submissions Grading
          </h2>
          <p className="text-xs text-slate-500">
            Publish coursework deliverables, evaluate student project submissions, and provide academic feedback.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 self-start sm:self-auto transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">{successMessage}</p>
        </div>
      )}

      {/* SUB-TABS: ASSIGNMENTS VS SUBMISSIONS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab("assignments")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all",
            activeSubTab === "assignments"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          Active Assignments ({assignments.length})
        </button>
        <button
          onClick={() => setActiveSubTab("submissions")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all",
            activeSubTab === "submissions"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          Student Submissions ({submissions.length})
        </button>
      </div>

      {/* ASSIGNMENTS VIEW */}
      {activeSubTab === "assignments" && (
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No assignments created yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click "New Assignment" to publish coursework questions, lab manuals, and deliverables.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((asg) => (
                <div
                  key={asg._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-blue-50 text-blue-700">
                        {asg.courseCode}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                        {asg.status || "Active"}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {asg.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {asg.description}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Due Date:</span>
                        <span className="font-semibold text-slate-800">
                          {asg.dueDate} ({asg.dueTime})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Total Marks:</span>
                        <span className="font-bold text-slate-900">{asg.totalMarks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Grade Weightage:</span>
                        <span className="font-semibold text-blue-700">{asg.weightage}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveSubTab("submissions")}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors text-center"
                  >
                    View Submissions
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBMISSIONS VIEW */}
      {activeSubTab === "submissions" && (
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
              <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No submissions uploaded yet</h3>
              <p className="text-xs text-slate-500">
                When students upload assignment solutions, they will appear here for grading.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-3.5">Student</th>
                      <th className="px-6 py-3.5">File Solution</th>
                      <th className="px-6 py-3.5">Submitted On</th>
                      <th className="px-6 py-3.5">Marks</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Evaluation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {submissions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="font-bold text-slate-900">{sub.studentName}</div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {sub.enrollmentId || sub.studentId}
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="font-mono text-blue-600 text-[11px] font-semibold">
                            {sub.fileName || "solution_document.pdf"}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-slate-500">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3.5 font-bold">
                          {sub.obtainedMarks !== undefined ? (
                            <span className="text-emerald-700">
                              {sub.obtainedMarks} / {sub.maxMarks}
                            </span>
                          ) : (
                            <span className="text-slate-400">— / {sub.maxMarks}</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase",
                              sub.status === "Graded"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            )}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setGradingSubmission(sub);
                              setObtainedMarks(sub.obtainedMarks ?? 15);
                              setFeedback(sub.feedback || "Good work and complete implementation.");
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-xs"
                          >
                            {sub.status === "Graded" ? "Update Grade" : "Grade Now"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black font-heading text-slate-900">
                  Publish New Assignment
                </h3>
                <p className="text-xs text-slate-500">
                  Deliver coursework questions and milestones to students.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Lab 04: Dynamic Programming & Knapsack Optimization"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course</label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const c = courses.find((crs) => crs._id === selectedId || crs.code === selectedId);
                      if (c) {
                        setFormData({
                          ...formData,
                          courseId: c._id,
                          courseCode: c.code,
                          courseTitle: c.name,
                        });
                      }
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c._id || c.code} value={c._id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="All">All Sections</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Submission Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="text"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grade Weightage</label>
                  <input
                    type="text"
                    value={formData.weightage}
                    onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                    placeholder="e.g. 10%"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Questions</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Instructions for students, submission format, and problem statements..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing..." : "Publish Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADING MODAL */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black font-heading text-slate-900">
                  Grade Submission
                </h3>
                <p className="text-xs text-slate-500">{gradingSubmission.studentName}</p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Obtained Marks (Max: {gradingSubmission.maxMarks})
                </label>
                <input
                  type="number"
                  min={0}
                  max={gradingSubmission.maxMarks}
                  required
                  value={obtainedMarks}
                  onChange={(e) => setObtainedMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructor Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Constructive feedback for the student..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Evaluation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
