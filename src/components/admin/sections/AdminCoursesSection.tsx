"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  Clock,
  MapPin,
  Layers,
  Sparkles,
} from "lucide-react";
import { AdminCourse, AdminStudent } from "@/lib/admin-data";

interface AdminCoursesSectionProps {
  courses: AdminCourse[];
  students: AdminStudent[];
  searchFilter: string;
  onAddCourse: (course: Omit<AdminCourse, "id">) => void;
  onUpdateCourse: (id: string, updated: Partial<AdminCourse>) => void;
  onDeleteCourse: (id: string) => void;
}

export const AdminCoursesSection: React.FC<AdminCoursesSectionProps> = ({
  courses,
  students,
  searchFilter,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  const [localSearch, setLocalSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<AdminCourse | null>(null);
  const [rosterCourse, setRosterCourse] = useState<AdminCourse | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<AdminCourse | null>(null);

  // New Course Form State
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Computing & Technology");
  const [newCredits, setNewCredits] = useState(3);
  const [newSemester, setNewSemester] = useState(6);
  const [newInstructor, setNewInstructor] = useState("Dr. Asim Farooq");
  const [newCapacity, setNewCapacity] = useState(45);
  const [newSchedule, setNewSchedule] = useState("Mon & Wed • 08:30 AM - 10:00 AM");
  const [newRoom, setNewRoom] = useState("Lab 4 - AI Lab");
  const [newBuilding, setNewBuilding] = useState("Block B");
  const [newDesc, setNewDesc] = useState("");

  const query = (searchFilter || localSearch).toLowerCase().trim();
  const filteredCourses = courses.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      c.instructor.toLowerCase().includes(query);

    const matchesDept = selectedDept === "All" || c.department.includes(selectedDept);
    const matchesSemester = selectedSemester === "All" || c.semester.toString() === selectedSemester;
    const matchesStatus = selectedStatus === "All" || c.status === selectedStatus;

    return matchesQuery && matchesDept && matchesSemester && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCourse({
      code: newCode.toUpperCase().trim(),
      title: newTitle.trim(),
      department: newDept,
      creditHours: newCredits,
      semester: newSemester,
      instructor: newInstructor,
      instructorEmail: `${newInstructor.toLowerCase().replace(/[^a-z]/g, "")}@isb.iqra.edu.pk`,
      enrolledCount: 0,
      capacity: newCapacity,
      status: "Active",
      schedule: newSchedule,
      classroom: newRoom,
      building: newBuilding,
      attendanceRate: 100,
      assignmentCount: 0,
      prerequisites: ["None"],
      description: newDesc || "Comprehensive course module for undergraduate curriculum.",
    });

    setIsCreateOpen(false);
    setNewCode("");
    setNewTitle("");
    setNewDesc("");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse) return;
    onUpdateCourse(editCourse.id, {
      code: editCourse.code,
      title: editCourse.title,
      department: editCourse.department,
      creditHours: editCourse.creditHours,
      semester: editCourse.semester,
      instructor: editCourse.instructor,
      capacity: editCourse.capacity,
      status: editCourse.status,
      schedule: editCourse.schedule,
      classroom: editCourse.classroom,
      building: editCourse.building,
    });
    setEditCourse(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800 uppercase">
              Academic Catalog Offerings
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Total Courses: {courses.length}</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Curriculum & Course Management
          </h2>
          <p className="text-xs text-slate-500">
            Create, configure course syllabus, assign faculty members, and monitor capacity.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-iqra-gold-400" />
          <span>Create New Course Offering</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, course code, instructor..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20"
          />
        </div>

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
              <option value="Humanities">General & Humanities</option>
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
              <option value="2">Semester 2</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
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
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isFull = course.enrolledCount >= course.capacity;
          const percentageFilled = Math.round((course.enrolledCount / course.capacity) * 100);

          return (
            <div
              key={course.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-iqra-blue-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                {/* Top: Code, Credits, Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-iqra-navy-900 text-white">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {course.creditHours} Cr. Hrs
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      course.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Semester {course.semester} • {course.department}
                  </p>
                </div>

                {/* Assigned Instructor */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Assigned Faculty</span>
                  <p className="font-bold text-slate-900">{course.instructor}</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">{course.instructorEmail}</p>
                </div>

                {/* Capacity progress */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Seat Capacity:</span>
                    <span className="font-bold text-slate-800">
                      {course.enrolledCount} / {course.capacity} Enrolled ({percentageFilled}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? "bg-rose-500" : percentageFilled > 85 ? "bg-amber-500" : "bg-iqra-blue-600"
                      }`}
                      style={{ width: `${Math.min(100, percentageFilled)}%` }}
                    />
                  </div>
                </div>

                {/* Venue & Schedule */}
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-iqra-blue-600 shrink-0" />
                    <span>{course.schedule}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-iqra-gold-600 shrink-0" />
                    <span>{course.classroom}, {course.building}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Enrolled Roster, Edit, Delete */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setRosterCourse(course)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-iqra-blue-700 text-xs font-bold flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Roster ({course.enrolledCount})</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditCourse(course)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                    title="Edit Course Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setCourseToDelete(course)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                    title="Delete Course Offering"
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
      {/* 1. VIEW ENROLLED STUDENTS ROSTER MODAL */}
      {/* ========================================================= */}
      {rosterCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-white/20 text-white">
                    {rosterCourse.code}
                  </span>
                  <span className="text-xs text-iqra-gold-400 font-semibold">
                    {rosterCourse.creditHours} Credit Hours • Semester {rosterCourse.semester}
                  </span>
                </div>
                <h3 className="text-lg font-black font-heading text-white">{rosterCourse.title}</h3>
                <p className="text-xs text-blue-200">Instructor: {rosterCourse.instructor}</p>
              </div>
              <button
                onClick={() => setRosterCourse(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800">
                  Enrolled Students in Course ({rosterCourse.enrolledCount} Seats Occupied)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Capacity: {rosterCourse.capacity}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {students
                  .filter((s) => s.enrolledCourseCodes.includes(rosterCourse.code))
                  .map((s) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{s.studentId} • {s.program}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-slate-800 block">
                          Attendance: {s.attendancePercentage}%
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">CGPA: {s.cgpa.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setRosterCourse(null)}
                className="px-5 py-2 rounded-xl bg-iqra-navy-900 text-white text-xs font-bold"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CREATE NEW COURSE MODAL */}
      {/* ========================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-heading text-white">Create New Course Offering</h3>
                <p className="text-xs text-blue-200">Central Academic Curriculum Catalog</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-3.5 text-xs overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Course Code</label>
                  <input
                    type="text"
                    placeholder="CS-450"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Course Title</label>
                  <input
                    type="text"
                    placeholder="Distributed Systems Architecture"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <option value="Computing & Technology">Computing & Technology</option>
                    <option value="Faculty of Information Technology">Information Technology</option>
                    <option value="Department of Management Sciences">Management Sciences</option>
                    <option value="General & Humanities">General & Humanities</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Assigned Instructor</label>
                  <input
                    type="text"
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Credit Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCredits}
                    onChange={(e) => setNewCredits(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newSemester}
                    onChange={(e) => setNewSemester(parseInt(e.target.value) || 6)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Capacity</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(parseInt(e.target.value) || 45)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Schedule Slot</label>
                  <input
                    type="text"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Classroom Venue</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
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
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. EDIT COURSE MODAL */}
      {/* ========================================================= */}
      {editCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-heading text-white">Edit Course Configuration</h3>
                <p className="text-xs text-blue-200 font-mono">{editCourse.code}</p>
              </div>
              <button
                onClick={() => setEditCourse(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Course Title</label>
                <input
                  type="text"
                  value={editCourse.title}
                  onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Assigned Instructor</label>
                  <input
                    type="text"
                    value={editCourse.instructor}
                    onChange={(e) => setEditCourse({ ...editCourse, instructor: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Status</label>
                  <select
                    value={editCourse.status}
                    onChange={(e) => setEditCourse({ ...editCourse, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <option value="Active">Active Offering</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Classroom</label>
                  <input
                    type="text"
                    value={editCourse.classroom}
                    onChange={(e) => setEditCourse({ ...editCourse, classroom: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Capacity Limit</label>
                  <input
                    type="number"
                    value={editCourse.capacity}
                    onChange={(e) => setEditCourse({ ...editCourse, capacity: parseInt(e.target.value) || 40 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. CONFIRM DELETE COURSE MODAL */}
      {/* ========================================================= */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Course Offering?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong>{courseToDelete.code}: {courseToDelete.title}</strong>? Students currently enrolled will have to be reassigned.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCourse(courseToDelete.id);
                  setCourseToDelete(null);
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
