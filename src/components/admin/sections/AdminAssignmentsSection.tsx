"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Eye,
  Clock,
  Award,
} from "lucide-react";
import {
  AdminAssignment,
  AdminSubmission,
  AdminCourse,
} from "@/lib/admin-data";
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
  CredentialModal,
  CredentialInput,
  CredentialSelect,
  CredentialButton,
  CredentialFilterBar,
} from "@/components/admin/credential";

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
  const [searchQuery, setSearchQuery] = useState("");
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
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.courseCode.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div
        className="relative overflow-hidden p-6 rounded-[10px] border flex flex-col md:flex-row md:items-center justify-between gap-4 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
        style={{
          backgroundColor: "var(--card-bg, #1D1B18)",
          borderColor: "var(--card-border, #4a4335)",
          borderRadius: "var(--radius-card, 10px)",
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted, #8a8272)" }}
            >
              Curricular Deliverables & LMS
            </span>
            <span style={{ color: "var(--text-muted, #8a8272)" }}>•</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              Fall 2026 Academic Catalog
            </span>
          </div>
          <h2
            className="font-serif text-[26px] font-[500] leading-tight tracking-tight"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            Assignment Repository & Submissions
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            Publish course tasks, review student turned-in deliverables, and perform administrative grade audits.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98] shrink-0"
          style={{
            borderColor: "var(--accent-gold, #C9A25B)",
            color: "var(--accent-gold, #C9A25B)",
            backgroundColor: "transparent",
            borderRadius: "var(--radius-control, 6px)",
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <CredentialFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search assignments by title or course code..."
      >
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="h-[36px] px-3 bg-[#1D1B18] border border-[#4a4335] rounded-[6px] text-xs text-[#D8D3C6] focus:outline-none focus:border-[#C9A25B]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
            color: "var(--text-value, #D8D3C6)",
            borderRadius: "var(--radius-control, 6px)",
          }}
        >
          <option value="All">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.code}>{c.code} — {c.title.slice(0, 24)}...</option>
          ))}
        </select>
      </CredentialFilterBar>

      {/* Assignments Grid */}
      {filteredAssignments.length === 0 ? (
        <div
          className="relative overflow-hidden p-12 text-center rounded-[10px] border space-y-3 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
            borderRadius: "var(--radius-card, 10px)",
          }}
        >
          <div
            className="w-12 h-12 rounded-[8px] border flex items-center justify-center mx-auto"
            style={{
              borderColor: "var(--card-border, #4a4335)",
              color: "var(--text-muted, #8a8272)",
            }}
          >
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-[20px] font-[500]" style={{ color: "var(--text-heading, #F2EEE4)" }}>
            No assignments found
          </h3>
          <p className="text-xs max-w-sm mx-auto" style={{ color: "var(--text-muted, #8a8272)" }}>
            No assignments match your active search or course filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAssignments.map((asg) => {
            const submissionRate = Math.round(((asg.submissionsCount ?? asg.totalSubmissions ?? 0) / (asg.totalEnrolled || 1)) * 100);

            return (
              <CredentialCard key={asg.id}>
                <CredentialHeader
                  eyebrow={`${asg.weightage} OF FINAL GRADE`}
                  referenceId={asg.courseCode}
                />

                <CredentialTitle
                  title={asg.title}
                  subheading={`Instructor: ${asg.instructor}`}
                  hasDivider
                />

                <CredentialDetailList className="flex-1">
                  <CredentialDetailRow
                    label="Submission Deadline"
                    value={`${asg.dueDate} (${asg.dueTime})`}
                  />
                  <CredentialDetailRow
                    label="Maximum Marks"
                    value={`${asg.totalMarks} Marks`}
                  />
                  <CredentialDetailRow
                    label="Turn-in Rate"
                    value={`${asg.submissionsCount} / ${asg.totalEnrolled} (${submissionRate}%)`}
                  />
                </CredentialDetailList>

                <CredentialFooter
                  status={{
                    label: asg.isPublished ? "Published to LMS" : "Draft Mode",
                    state: asg.isPublished ? "success" : "neutral",
                  }}
                  primaryAction={{
                    label: `Inspect Submissions (${asg.submissionsCount})`,
                    onClick: () => setSelectedAssignmentForReview(asg),
                  }}
                  secondaryActions={[
                    {
                      label: asg.isPublished ? "Unpublish Assignment" : "Publish to LMS",
                      onClick: () => onUpdateAssignment(asg.id, { isPublished: !asg.isPublished }),
                    },
                    {
                      label: "Delete Assignment",
                      icon: <Trash2 className="w-3.5 h-3.5" />,
                      isDestructive: true,
                      onClick: () => onDeleteAssignment(asg.id),
                    },
                  ]}
                />
              </CredentialCard>
            );
          })}
        </div>
      )}

      {/* 1. INSPECT SUBMISSIONS MODAL */}
      {selectedAssignmentForReview && (
        <CredentialModal
          isOpen={Boolean(selectedAssignmentForReview)}
          onClose={() => setSelectedAssignmentForReview(null)}
          eyebrow={`CODE: ${selectedAssignmentForReview.courseCode} • ${selectedAssignmentForReview.totalMarks} MARKS`}
          title={selectedAssignmentForReview.title}
          description="Student Deliverables & Administrative Grade Review"
          maxWidth="3xl"
          footer={
            <CredentialButton
              variant="primary"
              onClick={() => setSelectedAssignmentForReview(null)}
            >
              Close Submissions
            </CredentialButton>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className="border-b text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{
                    borderColor: "var(--card-border, #4a4335)",
                    color: "var(--text-muted, #8a8272)",
                  }}
                >
                  <th className="pb-3 font-medium">Student Name & ID</th>
                  <th className="pb-3 font-medium">Delivered File</th>
                  <th className="pb-3 font-medium">Submitted</th>
                  <th className="pb-3 font-medium text-center">Marks</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ borderColor: "var(--card-border, #4a4335)" }}
              >
                {submissions
                  .filter((sub) => sub.courseCode === selectedAssignmentForReview.courseCode)
                  .map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3">
                        <span className="font-medium block leading-tight" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                          {sub.studentName}
                        </span>
                        <span className="font-mono text-[10px]" style={{ color: "var(--text-muted, #8a8272)" }}>
                          {sub.studentId}
                        </span>
                      </td>

                      <td className="py-3 font-mono truncate max-w-[150px]" style={{ color: "var(--text-value, #D8D3C6)" }}>
                        {sub.fileName}
                      </td>

                      <td className="py-3 text-[11px] font-mono" style={{ color: "var(--text-muted, #8a8272)" }}>
                        {sub.submittedAt}
                      </td>

                      <td className="py-3 text-center font-mono font-medium">
                        {sub.marksAwarded !== undefined ? (
                          <span style={{ color: "var(--status-success, #7DAE7A)" }}>
                            {sub.marksAwarded} / {sub.maxMarks}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted, #8a8272)" }}>Pending</span>
                        )}
                      </td>

                      <td className="py-3 text-center">
                        <span
                          className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border"
                          style={{
                            borderColor: "var(--card-border, #4a4335)",
                            color: sub.status === "Graded" ? "var(--status-success, #7DAE7A)" : "var(--text-muted, #8a8272)",
                          }}
                        >
                          {sub.status}
                        </span>
                      </td>

                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setGradeModalSubmission(sub);
                              setEditMarks(sub.marksAwarded || 15);
                              setEditFeedback(sub.instructorFeedback || "Approved by Registrar.");
                            }}
                            className="h-[28px] px-2.5 rounded-[4px] border text-[11px] font-medium transition-colors hover:bg-white/5"
                            style={{
                              borderColor: "var(--card-border, #4a4335)",
                              color: "var(--text-value, #D8D3C6)",
                            }}
                          >
                            Grade
                          </button>
                          <button
                            onClick={() => onDeleteSubmission(sub.id)}
                            className="w-[28px] h-[28px] rounded-[4px] border flex items-center justify-center transition-colors hover:bg-white/5"
                            style={{
                              borderColor: "var(--card-border, #4a4335)",
                              color: "var(--status-danger, #E27878)",
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CredentialModal>
      )}

      {/* 2. GRADE OVERRIDE MODAL */}
      {gradeModalSubmission && (
        <CredentialModal
          isOpen={Boolean(gradeModalSubmission)}
          onClose={() => setGradeModalSubmission(null)}
          eyebrow="GRADE AUDIT"
          title={`Grade: ${gradeModalSubmission.studentName}`}
          description={`Coursework evaluation for ${gradeModalSubmission.studentId}`}
          maxWidth="md"
          footer={
            <>
              <CredentialButton
                variant="secondary"
                onClick={() => setGradeModalSubmission(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="primary"
                onClick={handleSaveGrade}
              >
                Confirm Grade Override
              </CredentialButton>
            </>
          }
        >
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <CredentialInput
              label={`Awarded Marks (Maximum: ${gradeModalSubmission.maxMarks})`}
              type="number"
              step="0.5"
              min="0"
              max={gradeModalSubmission.maxMarks}
              value={editMarks}
              onChange={(e) => setEditMarks(parseFloat(e.target.value) || 0)}
              required
            />

            <div className="space-y-1.5">
              <label
                className="block text-[12px] font-medium leading-none select-none"
                style={{ color: "var(--text-muted, #8a8272)" }}
              >
                Administrator Remarks / Rubric Feedback
              </label>
              <textarea
                rows={3}
                value={editFeedback}
                onChange={(e) => setEditFeedback(e.target.value)}
                className="w-full p-3 text-[13px] rounded-[6px] border transition-colors focus:outline-none focus:border-[#C9A25B]"
                style={{
                  backgroundColor: "var(--card-bg, #1D1B18)",
                  borderColor: "var(--card-border, #4a4335)",
                  color: "var(--text-value, #D8D3C6)",
                  borderRadius: "var(--radius-control, 6px)",
                }}
              />
            </div>
          </form>
        </CredentialModal>
      )}

      {/* 3. CREATE ASSIGNMENT MODAL */}
      <CredentialModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        eyebrow="LMS REPOSITORY"
        title="Create University Assignment"
        description="Publish a coursework assignment to the student LMS portal."
        maxWidth="lg"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              onClick={handleCreateSubmit}
            >
              Publish to LMS Portal
            </CredentialButton>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <CredentialInput
            label="Assignment Title *"
            placeholder="e.g. Distributed Consensus Implementation"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <CredentialSelect
            label="Select Course *"
            value={newCourseCode}
            onChange={(e) => setNewCourseCode(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.code}>{c.code} — {c.title}</option>
            ))}
          </CredentialSelect>

          <div className="grid grid-cols-2 gap-3">
            <CredentialInput
              label="Due Date *"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              required
            />
            <CredentialInput
              label="Due Time *"
              value={newDueTime}
              onChange={(e) => setNewDueTime(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CredentialInput
              label="Total Marks *"
              type="number"
              value={newTotalMarks}
              onChange={(e) => setNewTotalMarks(parseInt(e.target.value) || 20)}
              required
            />
            <CredentialInput
              label="Weightage *"
              value={newWeightage}
              onChange={(e) => setNewWeightage(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-[12px] font-medium leading-none select-none"
              style={{ color: "var(--text-muted, #8a8272)" }}
            >
              Instructions & Rubric Guidelines
            </label>
            <textarea
              rows={3}
              value={newInstructions}
              onChange={(e) => setNewInstructions(e.target.value)}
              placeholder="Submission instructions, rubric criteria..."
              className="w-full p-3 text-[13px] rounded-[6px] border transition-colors focus:outline-none focus:border-[#C9A25B]"
              style={{
                backgroundColor: "var(--card-bg, #1D1B18)",
                borderColor: "var(--card-border, #4a4335)",
                color: "var(--text-value, #D8D3C6)",
                borderRadius: "var(--radius-control, 6px)",
              }}
            />
          </div>
        </form>
      </CredentialModal>
    </div>
  );
};


