"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
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
  Building,
  Calendar,
  Phone,
  Mail,
  Hash,
} from "lucide-react";
import { AdminStudent } from "@/lib/admin-data";

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
      {/* Header with Title and Primary Actions */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800 uppercase">
              Student Records & Dossier
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Total Enrolled: {students.length}</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Student Management & Academic Audit
          </h2>
          <p className="text-xs text-slate-500">
            Central database of all registered students, credit audits, standing, and profile controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV Directory</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-iqra-gold-400" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, enrollment ID, or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Computing">Computing & Tech</option>
              <option value="Information Technology">Information Tech</option>
              <option value="Management">Management Sciences</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
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
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Students Data Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Student Records Directory ({filteredStudents.length})
          </h3>
          <span className="text-xs text-slate-400">Displaying matching students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Student Name & ID</th>
                <th className="pb-3 font-bold">Degree & Department</th>
                <th className="pb-3 font-bold text-center">Semester / Batch</th>
                <th className="pb-3 font-bold text-center">CGPA / SGPA</th>
                <th className="pb-3 font-bold text-center">Attendance</th>
                <th className="pb-3 font-bold text-center">Academic Status</th>
                <th className="pb-3 font-bold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-iqra-navy-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {std.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">{std.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">{std.studentId}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className="font-semibold text-slate-800 block leading-tight">{std.program}</span>
                    <span className="text-[10px] text-slate-400">{std.department}</span>
                  </td>

                  <td className="py-3 text-center">
                    <span className="font-bold text-slate-800 block">{std.semester}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{std.batch}</span>
                  </td>

                  <td className="py-3 text-center">
                    <span className="font-bold text-slate-900 font-mono text-xs block">
                      {std.cgpa.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      SGPA: {std.currentGpa.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3 text-center">
                    <span
                      className={`font-bold font-mono text-xs ${
                        std.attendancePercentage < 75
                          ? "text-rose-600"
                          : std.attendancePercentage < 80
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {std.attendancePercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {std.enrolledCourseCodes.length} Subjects
                    </span>
                  </td>

                  <td className="py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        std.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : std.status === "Probation"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {std.status === "Active" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {std.status === "Probation" && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                      {std.status === "Suspended" && <XCircle className="w-3 h-3 text-slate-600" />}
                      <span>{std.status}</span>
                    </span>
                  </td>

                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewStudent(std)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-iqra-blue-700 transition-colors"
                        title="View Full Profile & Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setEditStudent(std)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Edit Academic / Status Info"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setStudentToDelete(std)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                        title="Delete Student Record"
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

      {/* ========================================================= */}
      {/* 1. VIEW STUDENT PROFILE & DOSSIER MODAL */}
      {/* ========================================================= */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-iqra-blue-600 text-white font-black flex items-center justify-center text-lg">
                  {viewStudent.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black font-heading text-white">{viewStudent.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {viewStudent.status}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 font-mono">{viewStudent.studentId} • {viewStudent.program}</p>
                </div>
              </div>
              <button
                onClick={() => setViewStudent(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Core metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">CGPA</span>
                  <span className="text-lg font-black font-heading text-slate-900">{viewStudent.cgpa.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Completed Credits</span>
                  <span className="text-lg font-black font-heading text-slate-900">{viewStudent.completedCreditHours} / {viewStudent.totalCreditHours} Cr</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Attendance Rate</span>
                  <span className="text-lg font-black font-heading text-emerald-600">{viewStudent.attendancePercentage}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Warnings Issued</span>
                  <span className="text-lg font-black font-heading text-rose-600">{viewStudent.warningsCount}</span>
                </div>
              </div>

              {/* Detailed dossier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Department & Campus</span>
                  <p className="font-bold text-slate-900">{viewStudent.department}</p>
                  <p className="text-slate-500">{viewStudent.campus}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Academic Standing</span>
                  <p className="font-bold text-iqra-blue-700">{viewStudent.academicStanding}</p>
                  <p className="text-slate-500">{viewStudent.batch} • {viewStudent.semester}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Contact Information</span>
                  <p className="font-mono text-slate-900">{viewStudent.email}</p>
                  <p className="text-slate-600">{viewStudent.phone}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Emergency & CNIC</span>
                  <p className="text-slate-900">{viewStudent.emergencyContact}</p>
                  <p className="font-mono text-slate-500">{viewStudent.cnic}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Currently Enrolled Course Codes
                </span>
                <div className="flex flex-wrap gap-2">
                  {viewStudent.enrolledCourseCodes.map((code) => (
                    <span
                      key={code}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 font-mono text-xs font-bold text-iqra-blue-700"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewStudent(null)}
                className="px-5 py-2 rounded-xl bg-iqra-navy-900 text-white text-xs font-bold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. EDIT STUDENT MODAL (Academic Overrides) */}
      {/* ========================================================= */}
      {editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-heading text-white">
                  Edit Student Information & Academic Overrides
                </h3>
                <p className="text-xs text-blue-200 font-mono">{editStudent.studentId}</p>
              </div>
              <button
                onClick={() => setEditStudent(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Student Full Name</label>
                <input
                  type="text"
                  value={editStudent.name}
                  onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Email</label>
                  <input
                    type="email"
                    value={editStudent.email}
                    onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Phone</label>
                  <input
                    type="text"
                    value={editStudent.phone}
                    onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Current Semester</label>
                  <select
                    value={editStudent.semester}
                    onChange={(e) => setEditStudent({ ...editStudent, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Academic Status</label>
                  <select
                    value={editStudent.status}
                    onChange={(e) => setEditStudent({ ...editStudent, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <option value="Active">Active Regular</option>
                    <option value="Probation">Academic Probation</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Cumulative CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={editStudent.cgpa}
                    onChange={(e) => setEditStudent({ ...editStudent, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Academic Standing</label>
                  <input
                    type="text"
                    value={editStudent.academicStanding}
                    onChange={(e) => setEditStudent({ ...editStudent, academicStanding: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold"
                >
                  Save Academic Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CREATE NEW STUDENT MODAL */}
      {/* ========================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-heading text-white">Enroll New University Student</h3>
                <p className="text-xs text-blue-200">Chak Shehzad Admissions • Fall 2026</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Mehmood"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="student@isb.iqra.edu.pk"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+92 3XX XXXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Degree Program</label>
                  <select
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <option value="BS Computer Science (BSCS)">BS Computer Science</option>
                    <option value="BS Software Engineering (BSSE)">BS Software Engineering</option>
                    <option value="BS Artificial Intelligence (BSAI)">BS Artificial Intelligence</option>
                    <option value="BS Cyber Security (BSCY)">BS Cyber Security</option>
                    <option value="BBA (Bachelor of Business Admin)">BBA (Business Admin)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Admission Semester</label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="3rd Semester (Transfer)">3rd Semester</option>
                    <option value="5th Semester (Transfer)">5th Semester</option>
                  </select>
                </div>
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
                  Confirm & Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. CONFIRM DELETE MODAL */}
      {/* ========================================================= */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Student Record?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete the academic record for <strong>{studentToDelete.name}</strong> ({studentToDelete.studentId})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
