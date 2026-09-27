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
  Lock,
  Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
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

  const previewTotal =
    formData.assignmentMarks +
    formData.quizMarks +
    formData.midtermMarks +
    formData.finalMarks +
    formData.attendanceMarks;

  const calculateGradeScale = (total: number) => {
    if (total >= 85) return { grade: "A", gp: 4.0 };
    if (total >= 80) return { grade: "A-", gp: 3.67 };
    if (total >= 75) return { grade: "B+", gp: 3.33 };
    if (total >= 70) return { grade: "B", gp: 3.0 };
    if (total >= 65) return { grade: "B-", gp: 2.67 };
    if (total >= 60) return { grade: "C+", gp: 2.33 };
    if (total >= 55) return { grade: "C", gp: 2.0 };
    if (total >= 50) return { grade: "D", gp: 1.0 };
    return { grade: "F", gp: 0.0 };
  };

  const previewScale = calculateGradeScale(previewTotal);

  const handleStudentSelect = (enrollmentId: string) => {
    const s = students.find((x) => x.studentId === enrollmentId);
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
        creditHours: c.creditHours || 4,
      }));
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              Official Grading Engine
            </span>
            <span style={{ color: "var(--text-muted, #8a8272)" }}>•</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              Iqra University Registrar
            </span>
          </div>
          <h2
            className="font-serif text-[26px] font-[500] leading-tight tracking-tight"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            Results Entry & Grade Publishing
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            Enter terminal marks, compute HEC quality points, and publish approved grades to Student Transcripts.
          </p>
        </div>

        <button
          onClick={() => setIsEntryModalOpen(true)}
          className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98] shrink-0"
          style={{
            borderColor: "var(--accent-gold, #C9A25B)",
            color: "var(--accent-gold, #C9A25B)",
            backgroundColor: "transparent",
            borderRadius: "var(--radius-control, 6px)",
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Enter Student Marks</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <CredentialFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by student name, enrollment ID, course code..."
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[36px] px-3 bg-[#1D1B18] border border-[#4a4335] rounded-[6px] text-xs text-[#D8D3C6] focus:outline-none focus:border-[#C9A25B]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
            color: "var(--text-value, #D8D3C6)",
            borderRadius: "var(--radius-control, 6px)",
          }}
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
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </select>
      </CredentialFilterBar>

      {/* Results Table */}
      <div
        className="relative overflow-hidden p-6 rounded-[10px] border space-y-4 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
        style={{
          backgroundColor: "var(--card-bg, #1D1B18)",
          borderColor: "var(--card-border, #4a4335)",
          borderRadius: "var(--radius-card, 10px)",
        }}
      >
        <div
          className="flex items-center justify-between pb-3 border-b"
          style={{ borderColor: "var(--card-border, #4a4335)" }}
        >
          <h3 className="font-serif text-[18px] font-[500]" style={{ color: "var(--text-heading, #F2EEE4)" }}>
            Academic Records & Grading Ledger ({filteredResults.length})
          </h3>
          <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
            Terminal Score Allocations
          </span>
        </div>

        {filteredResults.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div
              className="w-12 h-12 rounded-[8px] border flex items-center justify-center mx-auto"
              style={{
                borderColor: "var(--card-border, #4a4335)",
                color: "var(--text-muted, #8a8272)",
              }}
            >
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-[20px] font-[500]" style={{ color: "var(--text-heading, #F2EEE4)" }}>
              No results found
            </h3>
            <p className="text-xs max-w-sm mx-auto" style={{ color: "var(--text-muted, #8a8272)" }}>
              No academic results have been entered yet. Click 'Enter Student Marks' to evaluate students.
            </p>
          </div>
        ) : (
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
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium text-center">Score Breakdown</th>
                  <th className="pb-3 font-medium text-center">Total / %</th>
                  <th className="pb-3 font-medium text-center">Grade (GP)</th>
                  <th className="pb-3 font-medium text-center">Workflow State</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ borderColor: "var(--card-border, #4a4335)" }}
              >
                {filteredResults.map((r) => (
                  <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3">
                      <span className="font-medium block leading-tight" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                        {r.studentName}
                      </span>
                      <span className="font-mono text-[10px]" style={{ color: "var(--text-muted, #8a8272)" }}>
                        {r.enrollmentId}
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="font-mono font-medium block" style={{ color: "var(--text-value, #D8D3C6)" }}>
                        {r.courseCode}
                      </span>
                      <span className="text-[10px] truncate max-w-[180px] block" style={{ color: "var(--text-muted, #8a8272)" }}>
                        {r.courseTitle}
                      </span>
                    </td>

                    <td className="py-3 text-center">
                      <div
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-[4px] border"
                        style={{
                          borderColor: "var(--card-border, #4a4335)",
                          color: "var(--text-value, #D8D3C6)",
                        }}
                      >
                        <span>Asg:{r.assignmentMarks}</span>
                        <span>•</span>
                        <span>Qz:{r.quizMarks}</span>
                        <span>•</span>
                        <span>Mid:{r.midtermMarks}</span>
                        <span>•</span>
                        <span>Fin:{r.finalMarks}</span>
                      </div>
                    </td>

                    <td className="py-3 text-center font-mono">
                      <span className="font-bold" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                        {r.totalMarks}
                      </span>
                      <span className="text-[10px] ml-1" style={{ color: "var(--text-muted, #8a8272)" }}>
                        ({r.percentage}%)
                      </span>
                    </td>

                    <td className="py-3 text-center">
                      <span
                        className="font-mono text-xs font-semibold px-2 py-0.5 rounded border"
                        style={{
                          borderColor: "var(--card-border, #4a4335)",
                          color: "var(--text-value, #D8D3C6)",
                        }}
                      >
                        {r.grade} ({r.gradePoints.toFixed(2)})
                      </span>
                    </td>

                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 select-none">
                        <span
                          className="w-[7px] h-[7px] rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              r.status === "Published"
                                ? "var(--status-success, #7DAE7A)"
                                : r.status === "Draft"
                                ? "var(--text-muted, #8a8272)"
                                : "#B8963E",
                          }}
                        />
                        <span
                          className="text-[11px] font-medium"
                          style={{
                            color:
                              r.status === "Published"
                                ? "var(--status-success, #7DAE7A)"
                                : r.status === "Draft"
                                ? "var(--text-muted, #8a8272)"
                                : "#B8963E",
                          }}
                        >
                          {r.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 text-right">
                      {r.status !== "Published" ? (
                        <button
                          onClick={() => onUpdateStatus(r._id, "Published")}
                          className="h-[28px] px-3 text-[11px] font-semibold rounded-[4px] border transition-colors hover:bg-[#7DAE7A]/10"
                          style={{
                            borderColor: "var(--status-success, #7DAE7A)",
                            color: "var(--status-success, #7DAE7A)",
                          }}
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus(r._id, "Draft")}
                          className="h-[28px] px-3 text-[11px] font-semibold rounded-[4px] border transition-colors hover:bg-white/5"
                          style={{
                            borderColor: "var(--card-border, #4a4335)",
                            color: "var(--text-muted, #8a8272)",
                          }}
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
      <CredentialModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        eyebrow="GRADING ENGINE"
        title="Enter Student Academic Marks"
        description="Compute HEC grade points and publish official transcripts."
        maxWidth="lg"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsEntryModalOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSaveSubmit}
            >
              {isSubmitting ? "Saving Marks..." : "Save Academic Result"}
            </CredentialButton>
          </>
        }
      >
        <form onSubmit={handleSaveSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CredentialSelect
              label="Select Student *"
              value={formData.enrollmentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
            >
              {students.map((s) => (
                <option key={s.id} value={s.studentId}>
                  {s.studentId} — {s.name}
                </option>
              ))}
            </CredentialSelect>

            <CredentialSelect
              label="Select Course *"
              value={formData.courseCode}
              onChange={(e) => handleCourseSelect(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title}
                </option>
              ))}
            </CredentialSelect>
          </div>

          {/* Marks Breakdown */}
          <div
            className="p-4 rounded-[6px] border space-y-3"
            style={{
              backgroundColor: "var(--card-bg, #1D1B18)",
              borderColor: "var(--card-border, #4a4335)",
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <CredentialInput
                label="Asg (20)"
                type="number"
                min={0}
                max={20}
                value={formData.assignmentMarks}
                onChange={(e) => setFormData({ ...formData, assignmentMarks: parseFloat(e.target.value) || 0 })}
              />
              <CredentialInput
                label="Quiz (15)"
                type="number"
                min={0}
                max={15}
                value={formData.quizMarks}
                onChange={(e) => setFormData({ ...formData, quizMarks: parseFloat(e.target.value) || 0 })}
              />
              <CredentialInput
                label="Mid (25)"
                type="number"
                min={0}
                max={25}
                value={formData.midtermMarks}
                onChange={(e) => setFormData({ ...formData, midtermMarks: parseFloat(e.target.value) || 0 })}
              />
              <CredentialInput
                label="Final (35)"
                type="number"
                min={0}
                max={35}
                value={formData.finalMarks}
                onChange={(e) => setFormData({ ...formData, finalMarks: parseFloat(e.target.value) || 0 })}
              />
              <CredentialInput
                label="Att (5)"
                type="number"
                min={0}
                max={5}
                value={formData.attendanceMarks}
                onChange={(e) => setFormData({ ...formData, attendanceMarks: parseFloat(e.target.value) || 0 })}
              />
            </div>

            {/* Calculated Scale */}
            <div
              className="p-3 rounded-[4px] border flex items-center justify-between"
              style={{
                borderColor: "var(--card-border, #4a4335)",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] block" style={{ color: "var(--text-muted, #8a8272)" }}>
                  Total Computed
                </span>
                <span className="font-serif text-[22px] font-[500]" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                  {previewTotal} / 100
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] block" style={{ color: "var(--text-muted, #8a8272)" }}>
                  HEC Grade Point
                </span>
                <span className="font-serif text-[22px] font-[500]" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                  {previewScale.grade} ({previewScale.gp.toFixed(2)} GP)
                </span>
              </div>
            </div>
          </div>

          <CredentialSelect
            label="Initial Workflow Status *"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          >
            <option value="Draft">Draft (Private, not visible)</option>
            <option value="Submitted">Submitted (Department review)</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Approved">Approved (Ready for publish)</option>
            <option value="Published">Published (Live on transcript)</option>
          </CredentialSelect>
        </form>
      </CredentialModal>
    </div>
  );
};

