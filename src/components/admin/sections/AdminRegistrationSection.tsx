"use client";

import React, { useState } from "react";
import {
  FolderPlus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  ToggleLeft,
  ToggleRight,
  Filter,
  X,
} from "lucide-react";
import {
  RegistrationPeriod,
  RegistrationRequest,
  AdminCourse,
  AdminStudent,
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

interface AdminRegistrationSectionProps {
  period: RegistrationPeriod;
  requests: RegistrationRequest[];
  courses: AdminCourse[];
  students: AdminStudent[];
  onTogglePeriod: (isOpen: boolean) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onManualRegister: (studentId: string, courseCode: string, section: string) => void;
  onDropStudent: (studentId: string, courseCode: string) => void;
}

export const AdminRegistrationSection: React.FC<AdminRegistrationSectionProps> = ({
  period,
  requests,
  courses,
  students,
  onTogglePeriod,
  onApproveRequest,
  onRejectRequest,
  onManualRegister,
  onDropStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Manual enrollment modal
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.studentId || "");
  const [selectedCourseCode, setSelectedCourseCode] = useState(courses[0]?.code || "");
  const [selectedSection, setSelectedSection] = useState("CS-6A");

  // Statistics
  const totalRequests = requests.length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;
  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const fullCourses = courses.filter((c) => c.enrolledCount >= c.capacity);
  const availableCourses = courses.filter((c) => c.enrolledCount < c.capacity);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onManualRegister(selectedStudentId, selectedCourseCode, selectedSection);
    setIsManualOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Registration Period Controller Banner */}
      <div
        className="relative overflow-hidden p-6 rounded-[10px] border flex flex-col md:flex-row md:items-center justify-between gap-4 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
        style={{
          backgroundColor: "var(--card-bg, #1D1B18)",
          borderColor: "var(--card-border, #4a4335)",
          borderRadius: "var(--radius-card, 10px)",
        }}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className="w-[7px] h-[7px] rounded-full shrink-0"
              style={{
                backgroundColor: period.isOpen
                  ? "var(--status-success, #7DAE7A)"
                  : "var(--status-danger, #E27878)",
              }}
            />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{
                color: period.isOpen
                  ? "var(--status-success, #7DAE7A)"
                  : "var(--status-danger, #E27878)",
              }}
            >
              {period.isOpen ? "Registration Window Open" : "Registration Closed"}
            </span>
            <span style={{ color: "var(--text-muted, #8a8272)" }}>•</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              {period.session}
            </span>
          </div>

          <h2
            className="font-serif text-[26px] font-[500] leading-tight tracking-tight"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            Course Registration Administration
          </h2>

          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            Active Window: <strong style={{ color: "var(--text-value, #D8D3C6)" }}>{period.startDate} to {period.endDate}</strong> • Max Credit Limit: <strong style={{ color: "var(--text-value, #D8D3C6)" }}>{period.maxCreditHours} Cr. Hrs</strong>
          </p>
        </div>

        {/* Toggle Switch & Manual Register Button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onTogglePeriod(!period.isOpen)}
            className="h-[36px] px-3.5 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors hover:bg-white/5 active:scale-[0.98]"
            style={{
              borderColor: period.isOpen ? "var(--status-danger, #E27878)" : "var(--status-success, #7DAE7A)",
              color: period.isOpen ? "var(--status-danger, #E27878)" : "var(--status-success, #7DAE7A)",
            }}
          >
            {period.isOpen ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            <span>{period.isOpen ? "Close Window" : "Open Window"}</span>
          </button>

          <button
            onClick={() => setIsManualOpen(true)}
            className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98]"
            style={{
              borderColor: "var(--accent-gold, #C9A25B)",
              color: "var(--accent-gold, #C9A25B)",
              backgroundColor: "transparent",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Manually Register Student</span>
          </button>
        </div>
      </div>

      {/* Registration Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <CredentialCard className="pt-4 px-5 pb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted, #8a8272)" }}>
            Total Requests
          </span>
          <span className="font-serif text-[28px] font-[500] leading-none mt-2" style={{ color: "var(--text-heading, #F2EEE4)" }}>
            {totalRequests}
          </span>
          <span className="text-[11px] mt-1.5" style={{ color: "var(--text-muted, #8a8272)" }}>
            Enqueued student filings
          </span>
        </CredentialCard>

        <CredentialCard className="pt-4 px-5 pb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted, #8a8272)" }}>
            Pending Review
          </span>
          <span className="font-serif text-[28px] font-[500] leading-none mt-2" style={{ color: "var(--text-heading, #F2EEE4)" }}>
            {pendingCount}
          </span>
          <span className="text-[11px] mt-1.5" style={{ color: "var(--text-muted, #8a8272)" }}>
            Awaiting administrator action
          </span>
        </CredentialCard>

        <CredentialCard className="pt-4 px-5 pb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted, #8a8272)" }}>
            Approved
          </span>
          <span className="font-serif text-[28px] font-[500] leading-none mt-2" style={{ color: "var(--status-success, #7DAE7A)" }}>
            {approvedCount}
          </span>
          <span className="text-[11px] mt-1.5" style={{ color: "var(--text-muted, #8a8272)" }}>
            Seats authorized
          </span>
        </CredentialCard>

        <CredentialCard className="pt-4 px-5 pb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted, #8a8272)" }}>
            Capacity Saturated
          </span>
          <span className="font-serif text-[28px] font-[500] leading-none mt-2" style={{ color: "var(--status-danger, #E27878)" }}>
            {fullCourses.length}
          </span>
          <span className="text-[11px] mt-1.5" style={{ color: "var(--text-muted, #8a8272)" }}>
            Full course sections
          </span>
        </CredentialCard>
      </div>

      {/* Filter Bar */}
      <CredentialFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by student name, ID, course code, title..."
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
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </CredentialFilterBar>

      {/* Requests Data Table */}
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
          <div>
            <h3 className="font-serif text-[18px] font-[500]" style={{ color: "var(--text-heading, #F2EEE4)" }}>
              Registration Requests Queue ({filteredRequests.length})
            </h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              Review student prerequisite compliance and authorize classroom seats
            </p>
          </div>
        </div>

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
                <th className="pb-3 font-medium">Requested Course</th>
                <th className="pb-3 font-medium text-center">Credit Hours</th>
                <th className="pb-3 font-medium text-center">Section</th>
                <th className="pb-3 font-medium">Timestamp</th>
                <th className="pb-3 font-medium text-center">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--card-border, #4a4335)" }}
            >
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3">
                    <span className="font-medium block leading-tight" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                      {req.studentName}
                    </span>
                    <span className="font-mono text-[10px]" style={{ color: "var(--text-muted, #8a8272)" }}>
                      {req.studentId}
                    </span>
                  </td>

                  <td className="py-3">
                    <span className="font-mono font-medium block" style={{ color: "var(--text-value, #D8D3C6)" }}>
                      {req.courseCode}
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
                      {req.courseTitle}
                    </span>
                  </td>

                  <td className="py-3 text-center font-mono" style={{ color: "var(--text-value, #D8D3C6)" }}>
                    {req.creditHours} Cr
                  </td>

                  <td className="py-3 text-center font-mono" style={{ color: "var(--text-value, #D8D3C6)" }}>
                    {req.section}
                  </td>

                  <td className="py-3 font-mono text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
                    {req.requestedAt}
                  </td>

                  <td className="py-3 text-center">
                    <div className="inline-flex items-center gap-1.5 select-none">
                      <span
                        className="w-[7px] h-[7px] rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            req.status === "Approved"
                              ? "var(--status-success, #7DAE7A)"
                              : req.status === "Pending"
                              ? "#B8963E"
                              : "var(--status-danger, #E27878)",
                        }}
                      />
                      <span
                        className="text-[11px] font-medium"
                        style={{
                          color:
                            req.status === "Approved"
                              ? "var(--status-success, #7DAE7A)"
                              : req.status === "Pending"
                              ? "#B8963E"
                              : "var(--status-danger, #E27878)",
                        }}
                      >
                        {req.status}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 text-right">
                    {req.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onApproveRequest(req.id)}
                          className="h-[28px] px-3 text-[11px] font-semibold rounded-[4px] border transition-colors hover:bg-[#7DAE7A]/10"
                          style={{
                            borderColor: "var(--status-success, #7DAE7A)",
                            color: "var(--status-success, #7DAE7A)",
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectRequest(req.id)}
                          className="h-[28px] px-3 text-[11px] font-semibold rounded-[4px] border transition-colors hover:bg-[#E27878]/10"
                          style={{
                            borderColor: "var(--card-border, #4a4335)",
                            color: "var(--text-muted, #8a8272)",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono" style={{ color: "var(--text-muted, #8a8272)" }}>
                        Decided
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Registration Modal */}
      <CredentialModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        eyebrow="ADMINISTRATIVE OVERRIDE"
        title="Manual Course Enrollment"
        description="Directly register a student into a designated course section."
        maxWidth="md"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsManualOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              onClick={handleManualSubmit}
            >
              Confirm Enrollment
            </CredentialButton>
          </>
        }
      >
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <CredentialSelect
            label="Select Student *"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.id} value={s.studentId}>
                {s.studentId} — {s.name} ({s.semester})
              </option>
            ))}
          </CredentialSelect>

          <CredentialSelect
            label="Select Course to Enroll *"
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code} — {c.title} ({c.enrolledCount}/{c.capacity} Enrolled)
              </option>
            ))}
          </CredentialSelect>

          <CredentialSelect
            label="Section *"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="CS-6A">Section CS-6A</option>
            <option value="CS-6B">Section CS-6B</option>
            <option value="SE-7A">Section SE-7A</option>
            <option value="AI-4A">Section AI-4A</option>
          </CredentialSelect>
        </form>
      </CredentialModal>
    </div>
  );
};

