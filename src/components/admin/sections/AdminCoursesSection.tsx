"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  Building2,
  GraduationCap,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { AdminCourse, AdminStudent } from "@/lib/admin-data";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";

export interface DepartmentItem {
  _id: string;
  code: string;
  name: string;
  headOfDepartment?: string;
  status: "active" | "inactive";
}

export interface AcademicProgramItem {
  _id: string;
  code: string;
  name: string;
  department: string;
  departmentId?: string;
  degreeLevel?: string;
  status: "active" | "inactive";
}

export interface FacultyItem {
  _id: string;
  fullName: string;
  email: string;
  employeeId?: string;
  department: string;
  departmentId?: string;
  designation?: string;
  status: "Active" | "Inactive" | "On Leave";
}

interface AdminCoursesSectionProps {
  courses: AdminCourse[];
  students: AdminStudent[];
  departments?: DepartmentItem[];
  programs?: AcademicProgramItem[];
  facultyList?: FacultyItem[];
  searchFilter: string;
  onAddCourse: (course: any) => Promise<void> | void;
  onUpdateCourse: (id: string, updated: Partial<AdminCourse>) => Promise<void> | void;
  onDeleteCourse: (id: string) => Promise<void> | void;
  onNavigateTab?: (tab: any) => void;
  onRefresh?: () => Promise<void>;
}

interface SearchableOption {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  value: string;
  onChange: (id: string) => void;
  options: SearchableOption[];
  isLoading?: boolean;
  emptyStateTitle: string;
  emptyStateMessage: string;
  emptyStateActionLabel?: string;
  onEmptyStateAction?: () => void;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  placeholder,
  searchPlaceholder,
  value,
  onChange,
  options,
  isLoading = false,
  emptyStateTitle,
  emptyStateMessage,
  emptyStateActionLabel,
  onEmptyStateAction,
  required = false,
  disabled = false,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  const filtered = options.filter(
    (opt) =>
      opt.title.toLowerCase().includes(search.toLowerCase()) ||
      (opt.subtitle && opt.subtitle.toLowerCase().includes(search.toLowerCase())) ||
      (opt.badge && opt.badge.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
          {required && <span className="text-rose-500 font-black">*</span>}
        </label>
        {isLoading && (
          <span className="text-[10px] text-iqra-blue-600 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Fetching...</span>
          </span>
        )}
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between border transition-all ${
          disabled
            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
            : isOpen
              ? "bg-white border-iqra-blue-600 ring-2 ring-iqra-blue-500/20 shadow-xs"
              : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800"
        }`}
      >
        <span className="truncate">
          {selectedOption ? (
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span>{selectedOption.title}</span>
              {selectedOption.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                  {selectedOption.badge}
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-iqra-blue-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-iqra-blue-500"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 text-xs">
            {options.length === 0 ? (
              // Empty database state
              <div className="p-4 text-center space-y-2 bg-slate-50/60">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">{emptyStateTitle}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 max-w-xs mx-auto leading-relaxed">
                    {emptyStateMessage}
                  </p>
                </div>
                {emptyStateActionLabel && onEmptyStateAction && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onEmptyStateAction();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                  >
                    <span>{emptyStateActionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : filtered.length === 0 ? (
              // Search has no match
              <div className="p-4 text-center text-slate-500 text-[11px]">
                No matching results found for <span className="font-semibold text-slate-700">"{search}"</span>
              </div>
            ) : (
              // List items
              filtered.map((opt) => {
                const isSelected = opt.id === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 text-left flex items-center justify-between gap-2 hover:bg-blue-50/70 transition-colors ${
                      isSelected ? "bg-blue-50/90 font-bold" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isSelected ? "text-iqra-navy-900" : "text-slate-800"}`}>
                          {opt.title}
                        </span>
                        {opt.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.subtitle && (
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{opt.subtitle}</p>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-iqra-blue-600 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminCoursesSection: React.FC<AdminCoursesSectionProps> = ({
  courses,
  students,
  departments = [],
  programs = [],
  facultyList = [],
  searchFilter,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onNavigateTab,
  onRefresh,
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

  // Live Convex store sync
  const [liveDepartments, setLiveDepartments] = useState<DepartmentItem[]>(departments);
  const [livePrograms, setLivePrograms] = useState<AcademicProgramItem[]>(programs);
  const [liveFaculty, setLiveFaculty] = useState<FacultyItem[]>(facultyList);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // New Course Form State (Strictly Real Records - Zero Mock Data)
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [newCredits, setNewCredits] = useState(3);
  const [newSemester, setNewSemester] = useState(1);
  const [newStatus, setNewStatus] = useState<"Active" | "Inactive">("Active");
  const [newCapacity, setNewCapacity] = useState(45);
  const [newSchedule, setNewSchedule] = useState("Mon & Wed • 08:30 AM - 10:00 AM");
  const [newRoom, setNewRoom] = useState("Lab 4");
  const [newBuilding, setNewBuilding] = useState("Block B");
  const [newDesc, setNewDesc] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Course Form State
  const [editDeptId, setEditDeptId] = useState("");
  const [editProgramId, setEditProgramId] = useState("");
  const [editInstructorId, setEditInstructorId] = useState("");

  // Sync props to state
  useEffect(() => {
    if (departments && departments.length > 0) setLiveDepartments(departments);
  }, [departments]);

  useEffect(() => {
    if (programs && programs.length > 0) setLivePrograms(programs);
  }, [programs]);

  useEffect(() => {
    if (facultyList && facultyList.length > 0) setLiveFaculty(facultyList);
  }, [facultyList]);

  // Fetch real database records from Convex on modal opening or mount
  const fetchLiveDatabaseRecords = async () => {
    try {
      setIsLoadingDropdowns(true);
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const [depts, progs, facs] = await Promise.all([
          client.query(api.academicManagement.getDepartments, {}),
          client.query(api.academicManagement.getAcademicPrograms, {}),
          client.query(api.academicManagement.getInstructors, {}),
        ]);
        if (depts) setLiveDepartments(depts as any);
        if (progs) setLivePrograms(progs as any);
        if (facs) setLiveFaculty(facs as any);
      }
    } catch (err) {
      console.warn("Could not query live academic entities:", err);
    } finally {
      setIsLoadingDropdowns(false);
    }
  };

  useEffect(() => {
    if (isCreateOpen) {
      fetchLiveDatabaseRecords();
      setFormError(null);
    }
  }, [isCreateOpen]);

  // When editing course, initialize dropdown IDs
  useEffect(() => {
    if (editCourse) {
      fetchLiveDatabaseRecords();
      // Match department
      const matchDept = liveDepartments.find(
        (d) => d._id === editCourse.departmentId || d.name === editCourse.department
      );
      if (matchDept) setEditDeptId(matchDept._id);

      // Match program
      if (editCourse.programId) {
        setEditProgramId(editCourse.programId);
      } else if (editCourse.program) {
        const matchProg = livePrograms.find(
          (p) => p.name === editCourse.program || p.code === editCourse.program
        );
        if (matchProg) setEditProgramId(matchProg._id);
      }

      // Match instructor
      if (editCourse.instructorId) {
        setEditInstructorId(editCourse.instructorId);
      } else {
        const matchInst = liveFaculty.find((f) => f.fullName === editCourse.instructor);
        if (matchInst) setEditInstructorId(matchInst._id);
      }
    }
  }, [editCourse]);

  // Handle department change in Create Form
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedProgramId(""); // Reset program when department changes
  };

  // Resolve selected department record
  const selectedDeptRecord = liveDepartments.find((d) => d._id === selectedDeptId);

  // Dynamically filter Degree Programs belonging to selected Department
  const departmentPrograms = livePrograms.filter((p) => {
    if (!selectedDeptRecord) return true;
    if (p.departmentId && p.departmentId === selectedDeptRecord._id) return true;
    const pDept = p.department?.toLowerCase().trim();
    const dName = selectedDeptRecord.name?.toLowerCase().trim();
    const dCode = selectedDeptRecord.code?.toLowerCase().trim();
    return pDept === dName || pDept === dCode || (dName && pDept?.includes(dName));
  });

  // Filter & Prioritize Instructors belonging to selected Department
  const activeFaculty = liveFaculty.filter((f) => f.status !== "Inactive");

  const departmentFaculty = activeFaculty.filter((f) => {
    if (!selectedDeptRecord) return true;
    if (f.departmentId && f.departmentId === selectedDeptRecord._id) return true;
    const fDept = f.department?.toLowerCase().trim();
    const dName = selectedDeptRecord.name?.toLowerCase().trim();
    const dCode = selectedDeptRecord.code?.toLowerCase().trim();
    return fDept === dName || fDept === dCode || (dName && fDept?.includes(dName));
  });

  const otherFaculty = activeFaculty.filter(
    (f) => !departmentFaculty.some((df) => df._id === f._id)
  );

  // Instructor dropdown options (prioritized by department)
  const instructorOptions: SearchableOption[] = [
    {
      id: "unassigned",
      title: "Unassigned / TBA",
      subtitle: "Course instructor will be assigned later",
      badge: "Pending",
    },
    ...departmentFaculty.map((f) => ({
      id: f._id,
      title: f.fullName,
      subtitle: `${f.designation || "Faculty Member"} • ${f.department}`,
      badge: f.employeeId || "Faculty",
    })),
    ...otherFaculty.map((f) => ({
      id: f._id,
      title: f.fullName,
      subtitle: `${f.designation || "Faculty Member"} • ${f.department} (Other Dept)`,
      badge: f.employeeId || "Other Dept",
    })),
  ];

  // Filtering for Catalog Table/Grid
  const query = (searchFilter || localSearch).toLowerCase().trim();
  const filteredCourses = courses.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      c.instructor.toLowerCase().includes(query);

    const matchesDept = selectedDept === "All" || c.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSemester = selectedSemester === "All" || c.semester.toString() === selectedSemester;
    const matchesStatus = selectedStatus === "All" || c.status === selectedStatus;

    return matchesQuery && matchesDept && matchesSemester && matchesStatus;
  });

  // Reset Create Form
  const resetCreateForm = () => {
    setNewCode("");
    setNewTitle("");
    setSelectedDeptId("");
    setSelectedProgramId("");
    setSelectedInstructorId("");
    setNewCredits(3);
    setNewSemester(1);
    setNewStatus("Active");
    setNewDesc("");
    setFormError(null);
  };

  // Submit New Course Creation
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const codeClean = newCode.toUpperCase().trim();
    const titleClean = newTitle.trim();

    // 1. Validation
    if (!codeClean) {
      setFormError("Course code is required (e.g. CS-201).");
      return;
    }
    if (!titleClean) {
      setFormError("Course title/name is required.");
      return;
    }
    if (!selectedDeptId) {
      setFormError("Department is required. Please select an existing department from the database.");
      return;
    }

    const deptRecord = liveDepartments.find((d) => d._id === selectedDeptId);
    if (!deptRecord) {
      setFormError("The selected department could not be found in the database. Please select a valid department.");
      return;
    }

    if (newCredits < 1 || newCredits > 6) {
      setFormError("Credit hours must be between 1 and 6.");
      return;
    }

    // Duplicate check in local catalog
    const duplicate = courses.find((c) => c.code.toUpperCase().trim() === codeClean);
    if (duplicate) {
      setFormError(`Course code "${codeClean}" is already in use by "${duplicate.title}". Please enter a unique course code.`);
      return;
    }

    const progRecord = livePrograms.find((p) => p._id === selectedProgramId);
    const instRecord =
      selectedInstructorId && selectedInstructorId !== "unassigned"
        ? liveFaculty.find((f) => f._id === selectedInstructorId)
        : null;

    try {
      setIsSubmitting(true);
      await onAddCourse({
        code: codeClean,
        title: titleClean,
        name: titleClean,
        department: deptRecord.name,
        departmentId: deptRecord._id,
        program: progRecord ? progRecord.name : deptRecord.name,
        programId: progRecord ? progRecord._id : undefined,
        degreeProgramId: progRecord ? progRecord._id : undefined,
        creditHours: newCredits,
        semester: newSemester,
        instructor: instRecord ? instRecord.fullName : "TBA",
        instructorId: instRecord ? instRecord._id : undefined,
        facultyId: instRecord ? instRecord._id : undefined,
        facultyName: instRecord ? instRecord.fullName : "TBA",
        instructorEmail: instRecord ? instRecord.email : "faculty@isb.iqra.edu.pk",
        enrolledCount: 0,
        capacity: newCapacity,
        status: newStatus,
        schedule: newSchedule,
        classroom: newRoom,
        building: newBuilding,
        attendanceRate: 100,
        assignmentCount: 0,
        prerequisites: ["None"],
        description: newDesc || "Comprehensive course module for university curriculum catalog.",
      });

      setIsCreateOpen(false);
      resetCreateForm();
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      setFormError(err?.message || "Failed to create course in the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Course Editing
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse) return;

    const chosenDept = liveDepartments.find((d) => d._id === editDeptId);
    const chosenProg = livePrograms.find((p) => p._id === editProgramId);
    const chosenInst =
      editInstructorId && editInstructorId !== "unassigned"
        ? liveFaculty.find((f) => f._id === editInstructorId)
        : null;

    try {
      setIsSubmitting(true);
      await onUpdateCourse(editCourse.id, {
        code: editCourse.code,
        title: editCourse.title,
        department: chosenDept ? chosenDept.name : editCourse.department,
        departmentId: chosenDept ? chosenDept._id : editCourse.departmentId,
        program: chosenProg ? chosenProg.name : editCourse.program,
        programId: chosenProg ? chosenProg._id : editCourse.programId,
        degreeProgramId: chosenProg ? chosenProg._id : editCourse.programId,
        creditHours: editCourse.creditHours,
        semester: editCourse.semester,
        instructor: chosenInst ? chosenInst.fullName : editCourse.instructor,
        instructorId: chosenInst ? chosenInst._id : editCourse.instructorId,
        capacity: editCourse.capacity,
        status: editCourse.status,
        schedule: editCourse.schedule,
        classroom: editCourse.classroom,
        building: editCourse.building,
      });

      setEditCourse(null);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to update course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800 uppercase">
              Live Academic Catalog
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Total Courses: {courses.length}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-emerald-600">
              {liveDepartments.length} Departments Registered
            </span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Curriculum & Course Management
          </h2>
          <p className="text-xs text-slate-500">
            Create, configure course catalog offerings, and link real Departments, Degree Programs, and Faculty Instructors.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
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
          {/* Real Dynamic Department Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {liveDepartments
                .filter((d) => d.status === "active")
                .map((d) => (
                  <option key={d._id} value={d.name}>
                    {d.name} ({d.code})
                  </option>
                ))}
            </select>
          </div>

          {/* Dynamic Semesters Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s.toString()}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
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

      {/* Courses Grid / Empty Catalog State */}
      {courses.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-iqra-navy-900 mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-iqra-blue-600" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-black text-slate-900">No Courses in Catalog Yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are currently zero courses registered in the database. Click below to create your first real course linked to departments and instructors.
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-iqra-gold-400" />
            <span>Create First Course Offering</span>
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
          <p className="text-sm font-bold text-slate-800">No courses match the active filters.</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search query, department filter, or semester selection.
          </p>
        </div>
      ) : (
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
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                      <span>Semester {course.semester}</span>
                      <span>•</span>
                      <span className="truncate">{course.department}</span>
                    </p>
                    {course.program && (
                      <p className="text-[10px] font-semibold text-iqra-blue-700 mt-0.5">
                        Program: {course.program}
                      </p>
                    )}
                  </div>

                  {/* Assigned Instructor */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Assigned Faculty
                    </span>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-iqra-blue-600 shrink-0" />
                      <span>{course.instructor}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {course.instructorEmail}
                    </p>
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
                          isFull
                            ? "bg-rose-500"
                            : percentageFilled > 85
                              ? "bg-amber-500"
                              : "bg-iqra-blue-600"
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
                      <span>
                        {course.classroom}, {course.building}
                      </span>
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
      )}

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
                {students.filter((s) => s.enrolledCourseCodes.includes(rosterCourse.code)).length ===
                0 ? (
                  <div className="p-6 text-center text-slate-500">
                    No students currently enrolled in this course offering.
                  </div>
                ) : (
                  students
                    .filter((s) => s.enrolledCourseCodes.includes(rosterCourse.code))
                    .map((s) => (
                      <div key={s.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {s.studentId} • {s.program}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-slate-800 block">
                            Attendance: {s.attendancePercentage}%
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">
                            CGPA: {s.cgpa.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                )}
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
      {/* 2. CREATE NEW COURSE MODAL (Zero Dummy Data - Real DB Only) */}
      {/* ========================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-iqra-gold-400 text-iqra-navy-950 text-[10px] font-black uppercase tracking-wider">
                    Academic Catalog
                  </span>
                  <span className="text-xs text-blue-200">• Real Database Records</span>
                </div>
                <h3 className="text-lg font-black font-heading text-white">
                  Create New Course Offering
                </h3>
                <p className="text-xs text-blue-200">
                  Assign dynamic departments, degree programs, and approved faculty instructors.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  resetCreateForm();
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Validation Error</p>
                  <p className="mt-0.5 leading-relaxed">{formError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormError(null)}
                  className="text-rose-500 hover:text-rose-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Course Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              {/* Row 1: Course Code & Course Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                    <span>Course Code</span>
                    <span className="text-rose-500 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS-301"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold uppercase focus:outline-none focus:border-iqra-blue-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                    <span>Course Name / Title</span>
                    <span className="text-rose-500 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Database Architecture"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-iqra-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Dynamic Searchable Department Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SearchableDropdown
                  label="Department"
                  icon={<Building2 className="w-3.5 h-3.5 text-iqra-blue-600" />}
                  placeholder="Select Academic Department..."
                  searchPlaceholder="Search departments by name or code..."
                  value={selectedDeptId}
                  onChange={handleDepartmentChange}
                  isLoading={isLoadingDropdowns}
                  required
                  options={liveDepartments
                    .filter((d) => d.status === "active")
                    .map((d) => ({
                      id: d._id,
                      title: d.name,
                      subtitle: d.headOfDepartment ? `HOD: ${d.headOfDepartment}` : undefined,
                      badge: d.code,
                    }))}
                  emptyStateTitle="No departments available."
                  emptyStateMessage="Please create a department first in Department Management."
                  emptyStateActionLabel="Go to Department Management"
                  onEmptyStateAction={() => {
                    setIsCreateOpen(false);
                    if (onNavigateTab) onNavigateTab("departments");
                  }}
                />

                {/* Degree Program Dropdown (Dynamically Filtered by Department) */}
                <SearchableDropdown
                  label="Degree Program (Filtered)"
                  icon={<GraduationCap className="w-3.5 h-3.5 text-iqra-blue-600" />}
                  placeholder={
                    selectedDeptId
                      ? "Select Degree Program..."
                      : "First select a department above..."
                  }
                  searchPlaceholder="Search programs under selected department..."
                  value={selectedProgramId}
                  onChange={(id) => setSelectedProgramId(id)}
                  isLoading={isLoadingDropdowns}
                  disabled={!selectedDeptId}
                  options={departmentPrograms
                    .filter((p) => p.status === "active")
                    .map((p) => ({
                      id: p._id,
                      title: p.name,
                      subtitle: `${p.degreeLevel || "Undergraduate"} • ${p.department}`,
                      badge: p.code,
                    }))}
                  emptyStateTitle="No degree programs found."
                  emptyStateMessage={
                    selectedDeptRecord
                      ? `No active degree programs found under "${selectedDeptRecord.name}".`
                      : "Please select a department first."
                  }
                  emptyStateActionLabel="Create Degree Program"
                  onEmptyStateAction={() => {
                    setIsCreateOpen(false);
                    if (onNavigateTab) onNavigateTab("programs");
                  }}
                />
              </div>

              {/* Row 3: Dynamic Searchable Instructor Dropdown (Prioritized by Department) */}
              <SearchableDropdown
                label="Assign Instructor (Faculty Member)"
                icon={<UserCheck className="w-3.5 h-3.5 text-iqra-blue-600" />}
                placeholder="Select Approved Faculty Member..."
                searchPlaceholder="Search instructors by name, designation, or department..."
                value={selectedInstructorId}
                onChange={(id) => setSelectedInstructorId(id)}
                isLoading={isLoadingDropdowns}
                options={instructorOptions}
                emptyStateTitle="No instructors available."
                emptyStateMessage="Please add a faculty member first in Faculty Management."
                emptyStateActionLabel="Go to Faculty Management"
                onEmptyStateAction={() => {
                  setIsCreateOpen(false);
                  if (onNavigateTab) onNavigateTab("faculty");
                }}
              />

              {/* Row 4: Credit Hours, Semester & Course Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                    <span>Credit Hours</span>
                    <span className="text-rose-500 font-black">*</span>
                  </label>
                  <select
                    value={newCredits}
                    onChange={(e) => setNewCredits(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-iqra-blue-500 focus:bg-white"
                  >
                    <option value={1}>1 Credit Hour (Lab / Seminar)</option>
                    <option value={2}>2 Credit Hours</option>
                    <option value={3}>3 Credit Hours (Standard Theory)</option>
                    <option value={4}>4 Credit Hours (Theory + Lab)</option>
                    <option value={5}>5 Credit Hours</option>
                    <option value={6}>6 Credit Hours (Capstone / Thesis)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                    <span>Semester / Academic Term</span>
                    <span className="text-rose-500 font-black">*</span>
                  </label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-iqra-blue-500 focus:bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Course Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-iqra-blue-500 focus:bg-white"
                  >
                    <option value="Active">Active Offering</option>
                    <option value="Inactive">Inactive / Draft</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Course Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Course Description & Objectives
                </label>
                <textarea
                  rows={2}
                  placeholder="Outline syllabus overview, learning objectives, and prerequisites..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-iqra-blue-500 focus:bg-white"
                />
              </div>

              {/* Row 6: Capacity, Schedule & Venue (Optional defaults) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(parseInt(e.target.value) || 45)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Default Schedule
                  </label>
                  <input
                    type="text"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Classroom</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  {selectedDeptRecord ? (
                    <span>
                      Linking to: <strong>{selectedDeptRecord.name}</strong>
                    </span>
                  ) : (
                    <span>Select a real department to proceed</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateOpen(false);
                      resetCreateForm();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDeptId}
                    className={`px-5 py-2 rounded-xl text-white font-bold flex items-center gap-2 transition-all ${
                      isSubmitting || !selectedDeptId
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-iqra-navy-900 hover:bg-iqra-blue-700 shadow-sm"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating Course...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-iqra-gold-400" />
                        <span>Create Course Offering</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. EDIT COURSE MODAL (Dynamic Database Updates) */}
      {/* ========================================================= */}
      {editCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-heading text-white">
                  Edit Course Configuration
                </h3>
                <p className="text-xs text-blue-200 font-mono">{editCourse.code}</p>
              </div>
              <button
                onClick={() => setEditCourse(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-3.5 text-xs overflow-y-auto">
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

              {/* Department Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Department</label>
                <select
                  value={editDeptId}
                  onChange={(e) => setEditDeptId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <option value="">{editCourse.department}</option>
                  {liveDepartments
                    .filter((d) => d.status === "active")
                    .map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                </select>
              </div>

              {/* Instructor Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Assigned Instructor
                </label>
                <select
                  value={editInstructorId}
                  onChange={(e) => setEditInstructorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <option value="unassigned">Unassigned / TBA</option>
                  {liveFaculty
                    .filter((f) => f.status !== "Inactive")
                    .map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.fullName} ({f.department})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Status</label>
                  <select
                    value={editCourse.status}
                    onChange={(e) =>
                      setEditCourse({ ...editCourse, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <option value="Active">Active Offering</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Capacity Limit
                  </label>
                  <input
                    type="number"
                    value={editCourse.capacity}
                    onChange={(e) =>
                      setEditCourse({ ...editCourse, capacity: parseInt(e.target.value) || 40 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Schedule</label>
                  <input
                    type="text"
                    value={editCourse.schedule}
                    onChange={(e) => setEditCourse({ ...editCourse, schedule: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Classroom</label>
                  <input
                    type="text"
                    value={editCourse.classroom}
                    onChange={(e) => setEditCourse({ ...editCourse, classroom: e.target.value })}
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
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold"
                >
                  {isSubmitting ? "Saving..." : "Save Configuration"}
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
                Are you sure you want to remove <strong>{courseToDelete.code}: {courseToDelete.title}</strong>? This action will remove the course record from the university academic catalog.
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
                onClick={async () => {
                  await onDeleteCourse(courseToDelete.id);
                  setCourseToDelete(null);
                  if (onRefresh) await onRefresh();
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
