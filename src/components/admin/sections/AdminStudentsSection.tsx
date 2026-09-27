"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  X,
  LayoutGrid,
  List,
} from "lucide-react";
import { AdminStudent } from "@/lib/admin-data";
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

interface AdminStudentsSectionProps {
  students: AdminStudent[];
  searchFilter: string;
  onAddStudent: (student: Omit<AdminStudent, "id">) => void;
  onUpdateStudent: (id: string, updated: Partial<AdminStudent>) => void;
  onDeleteStudent: (id: string) => void;
}

export const AdminStudentsSection: React.FC<AdminStudentsSectionProps> = ({
  students,
  searchFilter,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [localSearch, setLocalSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Modals state
  const [viewStudent, setViewStudent] = useState<AdminStudent | null>(null);
  const [editStudent, setEditStudent] = useState<AdminStudent | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<AdminStudent | null>(null);

  // New Student Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newProgram, setNewProgram] = useState("BS Computer Science (BSCS)");
  const [newDept, setNewDept] = useState("Computing & Technology");
  const [newSemester, setNewSemester] = useState("1st Semester");
  const [newBatch, setNewBatch] = useState("Fall 2026");

  // Filtering
  const query = (searchFilter || localSearch).toLowerCase().trim();
  const filteredStudents = students.filter((std) => {
    const matchesQuery =
      std.name.toLowerCase().includes(query) ||
      std.studentId.toLowerCase().includes(query) ||
      std.email.toLowerCase().includes(query) ||
      std.program.toLowerCase().includes(query);

    const matchesDept = selectedDept === "All" || std.department.includes(selectedDept);
    const matchesSemester = selectedSemester === "All" || std.semester === selectedSemester;
    const matchesStatus = selectedStatus === "All" || std.status === selectedStatus;

    return matchesQuery && matchesDept && matchesSemester && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `IU-${newProgram.includes("AI") ? "AI" : newProgram.includes("Software") ? "SE" : "CS"}-2026-${randomSuffix}`;

    onAddStudent({
      studentId: generatedId,
      name: newName,
      email: newEmail,
      phone: newPhone || "+92 300 1234567",
      program: newProgram,
      department: newDept,
      campus: "Chak Shehzad, Islamabad",
      batch: newBatch,
      semester: newSemester,
      semesterNumber: parseInt(newSemester) || 1,
      status: "Active",
      cgpa: 3.50,
      currentGpa: 3.50,
      completedCreditHours: 0,
      totalCreditHours: 134,
      remainingCreditHours: 134,
      academicStanding: "Good Standing",
      attendancePercentage: 100,
      warningsCount: 0,
      enrolledCourseCodes: ["CS-401", "CS-308"],
      enrollmentDate: "09-Sep-2026",
      emergencyContact: "+92 300 8765432 (Guardian)",
      cnic: "61101-9876543-2",
    });

    setIsCreateOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    onUpdateStudent(editStudent.id, {
      name: editStudent.name,
      email: editStudent.email,
      phone: editStudent.phone,
      program: editStudent.program,
      department: editStudent.department,
      semester: editStudent.semester,
      semesterNumber: parseInt(editStudent.semester) || editStudent.semesterNumber,
      batch: editStudent.batch,
      status: editStudent.status,
      cgpa: editStudent.cgpa,
      academicStanding: editStudent.academicStanding,
    });
    setEditStudent(null);
  };

  const handleExportCSV = () => {
    const headers = "Student ID,Name,Email,Program,Department,Semester,Batch,Status,CGPA,Attendance\n";
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.studentId}","${s.name}","${s.email}","${s.program}","${s.department}","${s.semester}","${s.batch}","${s.status}","${s.cgpa}","${s.attendancePercentage}%"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Iqra_University_Students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
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
              Student Records & Dossier
            </span>
            <span style={{ color: "var(--text-muted, #8a8272)" }}>•</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              Total Enrolled: {students.length}
            </span>
          </div>
          <h2
            className="font-serif text-[26px] font-[500] leading-tight tracking-tight"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            Student Management & Academic Audit
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            Central repository of enrolled university students, credit audits, standing metrics, and student profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="h-[36px] px-3.5 rounded-[6px] border text-xs font-semibold flex items-center gap-1.5 transition-colors hover:bg-white/5 active:scale-[0.98]"
            style={{
              borderColor: "var(--card-border, #4a4335)",
              color: "var(--text-muted, #8a8272)",
              borderRadius: "var(--radius-control, 6px)",
            }}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98]"
            style={{
              borderColor: "var(--accent-gold, #C9A25B)",
              color: "var(--accent-gold, #C9A25B)",
              backgroundColor: "transparent",
              borderRadius: "var(--radius-control, 6px)",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <CredentialFilterBar
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        searchPlaceholder="Search by student name, enrollment ID, degree or email..."
      >
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="h-[36px] px-3 bg-[#1D1B18] border border-[#4a4335] rounded-[6px] text-xs text-[#D8D3C6] focus:outline-none focus:border-[#C9A25B]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
            color: "var(--text-value, #D8D3C6)",
            borderRadius: "var(--radius-control, 6px)",
          }}
        >
          <option value="All">All Departments</option>
          <option value="Computing">Computing & Tech</option>
          <option value="Information Technology">Information Tech</option>
          <option value="Management">Management Sciences</option>
        </select>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="h-[36px] px-3 bg-[#1D1B18] border border-[#4a4335] rounded-[6px] text-xs text-[#D8D3C6] focus:outline-none focus:border-[#C9A25B]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
            color: "var(--text-value, #D8D3C6)",
            borderRadius: "var(--radius-control, 6px)",
          }}
        >
          <option value="All">All Semesters</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
          <option value="3rd Semester">3rd Semester</option>
          <option value="4th Semester">4th Semester</option>
          <option value="6th Semester">6th Semester</option>
          <option value="7th Semester">7th Semester</option>
          <option value="8th Semester">8th Semester</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-[36px] px-3 bg-[#1D1B18] border border-[#4a4335] rounded-[6px] text-xs text-[#D8D3C6] focus:outline-none focus:border-[#C9A25B]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
            color: "var(--text-value, #D8D3C6)",
            borderRadius: "var(--radius-control, 6px)",
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Probation">Probation</option>
          <option value="Suspended">Suspended</option>
        </select>

        {/* View mode toggle */}
        <div
          className="flex items-center border rounded-[6px] overflow-hidden p-0.5"
          style={{
            borderColor: "var(--card-border, #4a4335)",
            backgroundColor: "var(--card-bg, #1D1B18)",
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className="p-1.5 rounded-[4px] transition-colors"
            style={{
              backgroundColor: viewMode === "cards" ? "rgba(255,255,255,0.08)" : "transparent",
              color: viewMode === "cards" ? "var(--text-heading, #F2EEE4)" : "var(--text-muted, #8a8272)",
            }}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className="p-1.5 rounded-[4px] transition-colors"
            style={{
              backgroundColor: viewMode === "table" ? "rgba(255,255,255,0.08)" : "transparent",
              color: viewMode === "table" ? "var(--text-heading, #F2EEE4)" : "var(--text-muted, #8a8272)",
            }}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </CredentialFilterBar>

      {/* Main Students Display */}
      {filteredStudents.length === 0 ? (
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
            <Users className="w-6 h-6" />
          </div>
          <h3
            className="font-serif text-[20px] font-[500]"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            No student records found
          </h3>
          <p className="text-xs max-w-sm mx-auto" style={{ color: "var(--text-muted, #8a8272)" }}>
            No enrolled students match your search criteria.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* Credential Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((std) => (
            <CredentialCard key={std.id}>
              {/* Header: Degree Eyebrow + Monospace ID */}
              <CredentialHeader
                eyebrow={std.program}
                referenceId={std.studentId}
              />

              {/* Title Block: Serif Name + Gold Subheading */}
              <CredentialTitle
                title={std.name}
                subheading={`${std.department} • ${std.batch}`}
                hasDivider
              />

              {/* Detail Rows */}
              <CredentialDetailList className="flex-1">
                <CredentialDetailRow
                  label="CGPA / SGPA"
                  value={`${std.cgpa.toFixed(2)} (SGPA: ${std.currentGpa.toFixed(2)})`}
                />
                <CredentialDetailRow
                  label="Semester"
                  value={std.semester}
                />
                <CredentialDetailRow
                  label="Institutional Email"
                  value={std.email}
                  isEmail
                  href={std.email}
                />
                <CredentialDetailRow
                  label="Attendance Rate"
                  value={`${std.attendancePercentage}% (${std.enrolledCourseCodes.length} Subjects)`}
                />
                <CredentialDetailRow
                  label="Academic Standing"
                  value={std.academicStanding}
                />
              </CredentialDetailList>

              {/* Footer */}
              <CredentialFooter
                status={{
                  label: std.status,
                  state: std.status === "Active" ? "success" : "danger",
                }}
                primaryAction={{
                  label: "Dossier",
                  onClick: () => setViewStudent(std),
                }}
                secondaryActions={[
                  {
                    label: "Edit Record",
                    icon: <Edit className="w-3.5 h-3.5" />,
                    onClick: () => setEditStudent(std),
                  },
                  {
                    label: "Delete Student",
                    icon: <Trash2 className="w-3.5 h-3.5" />,
                    isDestructive: true,
                    onClick: () => setStudentToDelete(std),
                  },
                ]}
              />
            </CredentialCard>
          ))}
        </div>
      ) : (
        /* Credential Table View */
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
            <h3
              className="text-xs font-bold tracking-wider uppercase"
              style={{ color: "var(--text-heading, #F2EEE4)" }}
            >
              Student Records Directory ({filteredStudents.length})
            </h3>
            <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              Displaying matching student dossiers
            </span>
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
                  <th className="pb-3 font-medium">Degree & Department</th>
                  <th className="pb-3 font-medium text-center">Semester / Batch</th>
                  <th className="pb-3 font-medium text-center">CGPA / SGPA</th>
                  <th className="pb-3 font-medium text-center">Attendance</th>
                  <th className="pb-3 font-medium text-center">Academic Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ borderColor: "var(--card-border, #4a4335)" }}
              >
                {filteredStudents.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3">
                      <div>
                        <span
                          className="font-serif text-sm font-[500] block leading-tight"
                          style={{ color: "var(--text-heading, #F2EEE4)" }}
                        >
                          {std.name}
                        </span>
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: "var(--text-muted, #8a8272)" }}
                        >
                          {std.studentId}
                        </span>
                      </div>
                    </td>

                    <td className="py-3">
                      <span
                        className="font-medium block leading-tight text-xs"
                        style={{ color: "var(--text-value, #D8D3C6)" }}
                      >
                        {std.program}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--text-muted, #8a8272)" }}
                      >
                        {std.department}
                      </span>
                    </td>

                    <td className="py-3 text-center">
                      <span
                        className="font-medium block"
                        style={{ color: "var(--text-value, #D8D3C6)" }}
                      >
                        {std.semester}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--text-muted, #8a8272)" }}
                      >
                        {std.batch}
                      </span>
                    </td>

                    <td className="py-3 text-center">
                      <span
                        className="font-mono text-xs font-semibold block"
                        style={{ color: "var(--text-heading, #F2EEE4)" }}
                      >
                        {std.cgpa.toFixed(2)}
                      </span>
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: "var(--text-muted, #8a8272)" }}
                      >
                        SGPA: {std.currentGpa.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3 text-center">
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{
                          color:
                            std.attendancePercentage < 75
                              ? "var(--status-danger, #E27878)"
                              : "var(--status-success, #7DAE7A)",
                        }}
                      >
                        {std.attendancePercentage}%
                      </span>
                      <span
                        className="text-[10px] block"
                        style={{ color: "var(--text-muted, #8a8272)" }}
                      >
                        {std.enrolledCourseCodes.length} Subjects
                      </span>
                    </td>

                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 select-none">
                        <span
                          className="w-[7px] h-[7px] rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              std.status === "Active"
                                ? "var(--status-success, #7DAE7A)"
                                : "var(--status-danger, #E27878)",
                          }}
                        />
                        <span
                          className="text-[11px] font-medium"
                          style={{
                            color:
                              std.status === "Active"
                                ? "var(--status-success, #7DAE7A)"
                                : "var(--status-danger, #E27878)",
                          }}
                        >
                          {std.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewStudent(std)}
                          className="h-[28px] px-2 rounded-[4px] border text-[11px] font-medium transition-colors hover:bg-white/5"
                          style={{
                            borderColor: "var(--card-border, #4a4335)",
                            color: "var(--text-value, #D8D3C6)",
                          }}
                          title="View Dossier"
                        >
                          Dossier
                        </button>
                        <button
                          onClick={() => setEditStudent(std)}
                          className="w-[28px] h-[28px] rounded-[4px] border flex items-center justify-center transition-colors hover:bg-white/5"
                          style={{
                            borderColor: "var(--card-border, #4a4335)",
                            color: "var(--text-muted, #8a8272)",
                          }}
                          title="Edit Student"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(std)}
                          className="w-[28px] h-[28px] rounded-[4px] border flex items-center justify-center transition-colors hover:bg-white/5"
                          style={{
                            borderColor: "var(--card-border, #4a4335)",
                            color: "var(--status-danger, #E27878)",
                          }}
                          title="Delete Record"
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
        </div>
      )}

      {/* 1. VIEW STUDENT DOSSIER MODAL */}
      {viewStudent && (
        <CredentialModal
          isOpen={Boolean(viewStudent)}
          onClose={() => setViewStudent(null)}
          eyebrow={`ID: ${viewStudent.studentId} • STUDENT DOSSIER`}
          title={viewStudent.name}
          description={`${viewStudent.program} • ${viewStudent.department}`}
          maxWidth="2xl"
          footer={
            <CredentialButton
              variant="primary"
              onClick={() => setViewStudent(null)}
            >
              Close Dossier
            </CredentialButton>
          }
        >
          <div className="space-y-4">
            {/* Core Metrics Credential Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                className="p-3 rounded-[6px] border space-y-1"
                style={{
                  backgroundColor: "var(--card-bg, #1D1B18)",
                  borderColor: "var(--card-border, #4a4335)",
                }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted, #8a8272)" }}>
                  Cumulative CGPA
                </span>
                <span className="font-serif text-[22px] font-[500] block leading-none mt-1" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                  {viewStudent.cgpa.toFixed(2)}
                </span>
              </div>

              <div
                className="p-3 rounded-[6px] border space-y-1"
                style={{
                  backgroundColor: "var(--card-bg, #1D1B18)",
                  borderColor: "var(--card-border, #4a4335)",
                }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted, #8a8272)" }}>
                  Credits Completed
                </span>
                <span className="font-serif text-[22px] font-[500] block leading-none mt-1" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                  {viewStudent.completedCreditHours}/{viewStudent.totalCreditHours}
                </span>
              </div>

              <div
                className="p-3 rounded-[6px] border space-y-1"
                style={{
                  backgroundColor: "var(--card-bg, #1D1B18)",
                  borderColor: "var(--card-border, #4a4335)",
                }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted, #8a8272)" }}>
                  Attendance Rate
                </span>
                <span
                  className="font-serif text-[22px] font-[500] block leading-none mt-1"
                  style={{
                    color:
                      viewStudent.attendancePercentage < 75
                        ? "var(--status-danger, #E27878)"
                        : "var(--status-success, #7DAE7A)",
                  }}
                >
                  {viewStudent.attendancePercentage}%
                </span>
              </div>

              <div
                className="p-3 rounded-[6px] border space-y-1"
                style={{
                  backgroundColor: "var(--card-bg, #1D1B18)",
                  borderColor: "var(--card-border, #4a4335)",
                }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted, #8a8272)" }}>
                  Academic Status
                </span>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className="w-[7px] h-[7px] rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        viewStudent.status === "Active"
                          ? "var(--status-success, #7DAE7A)"
                          : "var(--status-danger, #E27878)",
                    }}
                  />
                  <span className="text-[12px] font-medium" style={{ color: "var(--text-value, #D8D3C6)" }}>
                    {viewStudent.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Info List */}
            <CredentialDetailList>
              <CredentialDetailRow
                label="Department & Campus"
                value={`${viewStudent.department} (${viewStudent.campus})`}
              />
              <CredentialDetailRow
                label="Batch & Semester"
                value={`${viewStudent.batch} • ${viewStudent.semester}`}
              />
              <CredentialDetailRow
                label="Institutional Email"
                value={viewStudent.email}
                isEmail
                href={viewStudent.email}
              />
              <CredentialDetailRow
                label="Contact Phone"
                value={viewStudent.phone}
              />
              <CredentialDetailRow
                label="Academic Standing"
                value={viewStudent.academicStanding}
              />
              <CredentialDetailRow
                label="Emergency Contact"
                value={viewStudent.emergencyContact}
              />
              <CredentialDetailRow
                label="National Identity (CNIC)"
                value={viewStudent.cnic}
              />
            </CredentialDetailList>

            {/* Enrolled Courses */}
            <div
              className="p-3.5 rounded-[6px] border space-y-2"
              style={{
                backgroundColor: "var(--card-bg, #1D1B18)",
                borderColor: "var(--card-border, #4a4335)",
              }}
            >
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.12em] block"
                style={{ color: "var(--text-muted, #8a8272)" }}
              >
                Currently Enrolled Course Codes
              </span>
              <div className="flex flex-wrap gap-2">
                {viewStudent.enrolledCourseCodes.map((code) => (
                  <span
                    key={code}
                    className="px-2.5 py-0.5 rounded-[4px] font-mono text-[11px] border"
                    style={{
                      borderColor: "var(--card-border, #4a4335)",
                      color: "var(--text-value, #D8D3C6)",
                    }}
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CredentialModal>
      )}

      {/* 2. EDIT STUDENT MODAL */}
      {editStudent && (
        <CredentialModal
          isOpen={Boolean(editStudent)}
          onClose={() => setEditStudent(null)}
          eyebrow={`ID: ${editStudent.studentId} • RECORD OVERRIDE`}
          title={`Edit Student: ${editStudent.name}`}
          description="Adjust academic standing, enrolled semester, contact details, or cumulative GPA."
          maxWidth="lg"
          footer={
            <>
              <CredentialButton
                variant="secondary"
                onClick={() => setEditStudent(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="primary"
                onClick={handleEditSubmit}
              >
                Save Academic Changes
              </CredentialButton>
            </>
          }
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <CredentialInput
              label="Student Full Name"
              required
              value={editStudent.name}
              onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <CredentialInput
                label="Institutional Email"
                type="email"
                required
                value={editStudent.email}
                onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
              />
              <CredentialInput
                label="Phone Number"
                required
                value={editStudent.phone}
                onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CredentialSelect
                label="Current Semester"
                value={editStudent.semester}
                onChange={(e) => setEditStudent({ ...editStudent, semester: e.target.value })}
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </CredentialSelect>

              <CredentialSelect
                label="Academic Status"
                value={editStudent.status}
                onChange={(e) => setEditStudent({ ...editStudent, status: e.target.value as any })}
              >
                <option value="Active">Active Regular</option>
                <option value="Probation">Academic Probation</option>
                <option value="Suspended">Suspended</option>
              </CredentialSelect>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CredentialInput
                label="Cumulative CGPA"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={editStudent.cgpa}
                onChange={(e) => setEditStudent({ ...editStudent, cgpa: parseFloat(e.target.value) || 0 })}
              />
              <CredentialInput
                label="Academic Standing"
                value={editStudent.academicStanding}
                onChange={(e) => setEditStudent({ ...editStudent, academicStanding: e.target.value })}
              />
            </div>
          </form>
        </CredentialModal>
      )}

      {/* 3. CREATE NEW STUDENT MODAL */}
      <CredentialModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        eyebrow="ADMISSIONS • CHAK SHEHZAD CAMPUS"
        title="Enroll New University Student"
        description="Register an official student dossier and generate an institutional enrollment ID."
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
              Confirm & Enroll Student
            </CredentialButton>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <CredentialInput
            label="Full Name *"
            required
            placeholder="e.g. Tariq Mehmood"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <CredentialInput
              label="Institutional Email *"
              type="email"
              required
              placeholder="student@isb.iqra.edu.pk"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <CredentialInput
              label="Contact Phone"
              placeholder="+92 3XX XXXXXXX"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CredentialSelect
              label="Degree Program *"
              value={newProgram}
              onChange={(e) => setNewProgram(e.target.value)}
            >
              <option value="BS Computer Science (BSCS)">BS Computer Science</option>
              <option value="BS Software Engineering (BSSE)">BS Software Engineering</option>
              <option value="BS Artificial Intelligence (BSAI)">BS Artificial Intelligence</option>
              <option value="BS Cyber Security (BSCY)">BS Cyber Security</option>
              <option value="BBA (Bachelor of Business Admin)">BBA (Business Admin)</option>
            </CredentialSelect>

            <CredentialSelect
              label="Admission Semester *"
              value={newSemester}
              onChange={(e) => setNewSemester(e.target.value)}
            >
              <option value="1st Semester">1st Semester</option>
              <option value="3rd Semester (Transfer)">3rd Semester</option>
              <option value="5th Semester (Transfer)">5th Semester</option>
            </CredentialSelect>
          </div>
        </form>
      </CredentialModal>

      {/* 4. CONFIRM DELETE MODAL */}
      {studentToDelete && (
        <CredentialModal
          isOpen={Boolean(studentToDelete)}
          onClose={() => setStudentToDelete(null)}
          eyebrow="DANGER • PERMANENT RECORD REMOVAL"
          title="Delete Student Record?"
          description={`Permanently remove the academic record of ${studentToDelete.name} (${studentToDelete.studentId}).`}
          maxWidth="md"
          footer={
            <>
              <CredentialButton
                variant="secondary"
                onClick={() => setStudentToDelete(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="danger"
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
              >
                Permanently Delete
              </CredentialButton>
            </>
          }
        >
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-value, #D8D3C6)" }}>
            This action cannot be undone. All course enrollments, attendance history, and credit records will be permanently expunged.
          </p>
        </CredentialModal>
      )}
    </div>
  );
};


