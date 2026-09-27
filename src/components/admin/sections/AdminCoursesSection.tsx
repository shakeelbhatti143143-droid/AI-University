"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  Clock,
  MapPin,
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
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label
          className="text-[12px] font-medium leading-none select-none flex items-center gap-1.5"
          style={{ color: "var(--text-muted, #8a8272)" }}
        >
          {icon}
          <span>{label}</span>
          {required && <span className="text-[#E27878] font-black">*</span>}
        </label>
        {isLoading && (
          <span
            className="text-[10px] flex items-center gap-1"
            style={{ color: "var(--text-muted, #8a8272)" }}
          >
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
        className="w-full h-[36px] px-3 rounded-[6px] text-[13px] text-left flex items-center justify-between border transition-colors"
        style={{
          backgroundColor: "var(--card-bg, #1D1B18)",
          borderColor: isOpen ? "var(--accent-gold, #C9A25B)" : "var(--card-border, #4a4335)",
          color: selectedOption ? "var(--text-value, #D8D3C6)" : "var(--text-muted, #8a8272)",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span className="truncate">
          {selectedOption ? (
            <span className="font-medium flex items-center gap-1.5">
              <span>{selectedOption.title}</span>
              {selectedOption.badge && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.2 rounded border"
                  style={{
                    borderColor: "var(--card-border, #4a4335)",
                    color: "var(--text-value, #D8D3C6)",
                  }}
                >
                  {selectedOption.badge}
                </span>
              )}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-[#D8D3C6]" : "text-[#8a8272]"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full mt-1 z-50 rounded-[6px] shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
          }}
        >
          {/* Search Box */}
          <div
            className="p-2 border-b"
            style={{ borderColor: "var(--card-border, #4a4335)" }}
          >
            <div className="relative">
              <Search
                className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--text-muted, #8a8272)" }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-[32px] pl-8 pr-3 bg-transparent rounded-[4px] border text-xs focus:outline-none focus:border-[#C9A25B]"
                style={{
                  borderColor: "var(--card-border, #4a4335)",
                  color: "var(--text-value, #D8D3C6)",
                }}
              />
            </div>
          </div>

          {/* Options List */}
          <div
            className="max-h-56 overflow-y-auto divide-y text-xs"
            style={{ borderColor: "var(--card-border, #4a4335)" }}
          >
            {options.length === 0 ? (
              <div className="p-4 text-center space-y-2">
                <div
                  className="w-8 h-8 rounded-full mx-auto flex items-center justify-center border"
                  style={{
                    borderColor: "var(--card-border, #4a4335)",
                    color: "var(--text-muted, #8a8272)",
                  }}
                >
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[11px]" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                    {emptyStateTitle}
                  </p>
                  <p className="text-[10px] mt-0.5 max-w-xs mx-auto leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border text-[11px] font-semibold transition-colors hover:bg-white/5"
                    style={{
                      borderColor: "var(--accent-gold, #C9A25B)",
                      color: "var(--accent-gold, #C9A25B)",
                    }}
                  >
                    <span>{emptyStateActionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
                No matching results found for <span className="font-semibold" style={{ color: "var(--text-value, #D8D3C6)" }}>"{search}"</span>
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2.5 text-left transition-colors flex items-center justify-between gap-2 hover:bg-white/5"
                  style={{
                    backgroundColor: opt.id === value ? "rgba(255,255,255,0.04)" : "transparent",
                  }}
                >
                  <div className="truncate">
                    <p
                      className="font-medium truncate leading-snug"
                      style={{
                        color: opt.id === value ? "var(--text-heading, #F2EEE4)" : "var(--text-value, #D8D3C6)",
                      }}
                    >
                      {opt.title}
                    </p>
                    {opt.subtitle && (
                      <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--text-muted, #8a8272)" }}>
                        {opt.subtitle}
                      </p>
                    )}
                  </div>
                  {opt.badge && (
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0"
                      style={{
                        borderColor: "var(--card-border, #4a4335)",
                        color: "var(--text-muted, #8a8272)",
                      }}
                    >
                      {opt.badge}
                    </span>
                  )}
                </button>
              ))
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

  // Live Database Records state
  const [liveDepartments, setLiveDepartments] = useState<DepartmentItem[]>(departments);
  const [livePrograms, setLivePrograms] = useState<AcademicProgramItem[]>(programs);
  const [liveFaculty, setLiveFaculty] = useState<FacultyItem[]>(facultyList);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<AdminCourse | null>(null);
  const [rosterCourse, setRosterCourse] = useState<AdminCourse | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<AdminCourse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Create Form State
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [newCredits, setNewCredits] = useState<number>(3);
  const [newSemester, setNewSemester] = useState<number>(1);
  const [newStatus, setNewStatus] = useState<"Active" | "Inactive">("Active");
  const [newCapacity, setNewCapacity] = useState<number>(45);
  const [newSchedule, setNewSchedule] = useState("Mon/Wed 10:00 - 11:30 AM");
  const [newRoom, setNewRoom] = useState("Lab 3");
  const [newDesc, setNewDesc] = useState("");

  // Edit Form State
  const [editDeptId, setEditDeptId] = useState("");
  const [editProgramId, setEditProgramId] = useState("");
  const [editInstructorId, setEditInstructorId] = useState("");

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
      const matchDept = liveDepartments.find(
        (d) => d._id === editCourse.departmentId || d.name === editCourse.department
      );
      if (matchDept) setEditDeptId(matchDept._id);

      if (editCourse.programId) {
        setEditProgramId(editCourse.programId);
      } else if (editCourse.program) {
        const matchProg = livePrograms.find(
          (p) => p.name === editCourse.program || p.code === editCourse.program
        );
        if (matchProg) setEditProgramId(matchProg._id);
      }

      if (editCourse.instructorId) {
        setEditInstructorId(editCourse.instructorId);
      } else {
        const matchInst = liveFaculty.find((f) => f.fullName === editCourse.instructor);
        if (matchInst) setEditInstructorId(matchInst._id);
      }
    }
  }, [editCourse]);

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedProgramId("");
  };

  const selectedDeptRecord = liveDepartments.find((d) => d._id === selectedDeptId);

  const departmentPrograms = livePrograms.filter((p) => {
    if (!selectedDeptRecord) return true;
    if (p.departmentId && p.departmentId === selectedDeptRecord._id) return true;
    const pDept = p.department?.toLowerCase().trim();
    const dName = selectedDeptRecord.name?.toLowerCase().trim();
    const dCode = selectedDeptRecord.code?.toLowerCase().trim();
    return pDept === dName || pDept === dCode || (dName && pDept?.includes(dName));
  });

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

  const resetCreateForm = () => {
    setNewCode("");
    setNewTitle("");
    setSelectedDeptId("");
    setSelectedProgramId("");
    setSelectedInstructorId("");
    setNewCredits(3);
    setNewSemester(1);
    setNewStatus("Active");
    setNewCapacity(45);
    setNewSchedule("Mon/Wed 10:00 - 11:30 AM");
    setNewRoom("Lab 3");
    setNewDesc("");
    setFormError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newCode.trim()) {
      setFormError("Course code is required (e.g. CS-301).");
      return;
    }
    if (!newTitle.trim()) {
      setFormError("Course name/title is required.");
      return;
    }
    if (!selectedDeptId) {
      setFormError("Please select a valid academic department from the list.");
      return;
    }

    const matchedDept = liveDepartments.find((d) => d._id === selectedDeptId);
    const departmentName = matchedDept ? matchedDept.name : "Computing & Technology";

    const matchedProgram = livePrograms.find((p) => p._id === selectedProgramId);
    const programName = matchedProgram ? matchedProgram.name : undefined;

    let instructorName = "Unassigned / TBA";
    let instructorEmail = "pending.allocation@iqra.edu.pk";
    let validInstructorId: string | undefined = undefined;

    if (selectedInstructorId && selectedInstructorId !== "unassigned") {
      const matchedInst = liveFaculty.find((f) => f._id === selectedInstructorId);
      if (matchedInst) {
        instructorName = matchedInst.fullName;
        instructorEmail = matchedInst.email;
        validInstructorId = matchedInst._id;
      }
    }

    const payload = {
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      department: departmentName,
      departmentId: selectedDeptId,
      program: programName,
      programId: selectedProgramId || undefined,
      creditHours: newCredits,
      semester: newSemester,
      instructor: instructorName,
      instructorEmail: instructorEmail,
      instructorId: validInstructorId,
      status: newStatus,
      capacity: newCapacity,
      enrolledCount: 0,
      schedule: newSchedule,
      classroom: newRoom,
      building: "Academic Block A",
      description: newDesc,
    };

    try {
      setIsSubmitting(true);
      await onAddCourse(payload);
      setIsCreateOpen(false);
      resetCreateForm();
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to create course. Please verify inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse) return;

    const matchedDept = liveDepartments.find((d) => d._id === editDeptId);
    const departmentName = matchedDept ? matchedDept.name : editCourse.department;

    let instructorName = editCourse.instructor;
    let instructorEmail = editCourse.instructorEmail;
    let validInstructorId: string | undefined = editCourse.instructorId;

    if (editInstructorId === "unassigned") {
      instructorName = "Unassigned / TBA";
      instructorEmail = "pending.allocation@iqra.edu.pk";
      validInstructorId = undefined;
    } else if (editInstructorId) {
      const matchedInst = liveFaculty.find((f) => f._id === editInstructorId);
      if (matchedInst) {
        instructorName = matchedInst.fullName;
        instructorEmail = matchedInst.email;
        validInstructorId = matchedInst._id;
      }
    }

    const updatedData: Partial<AdminCourse> = {
      title: editCourse.title,
      department: departmentName,
      departmentId: editDeptId || editCourse.departmentId,
      instructor: instructorName,
      instructorEmail: instructorEmail,
      instructorId: validInstructorId,
      status: editCourse.status,
      capacity: editCourse.capacity,
      schedule: editCourse.schedule,
      classroom: editCourse.classroom,
    };

    try {
      setIsSubmitting(true);
      await onUpdateCourse(editCourse.id, updatedData);
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
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
            <span>Academic Catalog &amp; Curriculum SIS</span>
            <span className="text-white/30">•</span>
            <span className="text-cyan-200">Total Offerings: {courses.length}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Curriculum &amp; Course Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Configure course catalog offerings, seat allocations, and link official Departments, Degree Programs, and Faculty Instructors.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Course Offering</span>
        </button>
      </div>

      {/* Toolbar / Filters */}
      <CredentialFilterBar
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        searchPlaceholder="Search by title, course code, instructor..."
      >
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="h-[38px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
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

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="h-[38px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
        >
          <option value="All">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s.toString()}>
              Semester {s}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-[38px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </CredentialFilterBar>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            No courses in catalog yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Zero course offerings registered. Click below to add your first course offering.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="h-[36px] px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 mt-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Course Offering</span>
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <p className="text-base font-bold text-slate-800">
            No courses match the active filters.
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting your search query, department filter, or semester selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const percentageFilled = Math.round((course.enrolledCount / course.capacity) * 100);

            return (
              <CredentialCard key={course.id}>
                {/* Header: Department/Program Eyebrow + Monospace Code */}
                <CredentialHeader
                  eyebrow={course.department}
                  referenceId={course.code}
                />

                {/* Title Block: Course Name + Subtitle */}
                <CredentialTitle
                  title={course.title}
                  subheading={`${course.creditHours} Credit Hours • Semester ${course.semester}${course.program ? ` • ${course.program}` : ""}`}
                  hasDivider
                />

                {/* Detail Rows */}
                <CredentialDetailList className="flex-1">
                  <CredentialDetailRow
                    label="Assigned Instructor"
                    value={
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0">
                          {course.instructor.charAt(0)}
                        </span>
                        <span className="truncate">{course.instructor}</span>
                      </span>
                    }
                  />
                  <CredentialDetailRow
                    label="Instructor Email"
                    value={course.instructorEmail}
                    isEmail
                    href={course.instructorEmail}
                  />
                  <div className="space-y-1.5 py-1">
                    <CredentialDetailRow
                      label="Seat Capacity"
                      value={
                        <span className="font-mono text-xs">
                          <strong className="text-slate-900">{course.enrolledCount}</strong>
                          <span className="text-slate-400">/{course.capacity}</span>
                          <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${percentageFilled > 80 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                            {percentageFilled}%
                          </span>
                        </span>
                      }
                    />
                    <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${percentageFilled > 80 ? 'bg-amber-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.max(percentageFilled, 3)}%` }}
                      />
                    </div>
                  </div>
                  <CredentialDetailRow
                    label="Lecture Schedule"
                    value={
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                        <span className="truncate">{course.schedule}</span>
                      </span>
                    }
                  />
                  <CredentialDetailRow
                    label="Classroom Venue"
                    value={
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{course.classroom}, {course.building}</span>
                      </span>
                    }
                  />
                </CredentialDetailList>

                {/* Footer */}
                <CredentialFooter
                  status={{
                    label: course.status,
                    state: course.status === "Active" ? "success" : "danger",
                  }}
                  primaryAction={{
                    label: `Roster (${course.enrolledCount})`,
                    onClick: () => setRosterCourse(course),
                  }}
                  secondaryActions={[
                    {
                      label: "Edit Course",
                      icon: <Edit className="w-3.5 h-3.5" />,
                      onClick: () => setEditCourse(course),
                    },
                    {
                      label: "Delete Course Offering",
                      icon: <Trash2 className="w-3.5 h-3.5" />,
                      isDestructive: true,
                      onClick: () => setCourseToDelete(course),
                    },
                  ]}
                />
              </CredentialCard>
            );
          })}
        </div>
      )}

      {/* 1. VIEW ENROLLED STUDENTS ROSTER MODAL */}
      {rosterCourse && (
        <CredentialModal
          isOpen={Boolean(rosterCourse)}
          onClose={() => setRosterCourse(null)}
          eyebrow={`CODE: ${rosterCourse.code} • ENROLLED ROSTER`}
          title={rosterCourse.title}
          description={`Instructor: ${rosterCourse.instructor} • ${rosterCourse.creditHours} Credit Hours • Semester ${rosterCourse.semester}`}
          maxWidth="2xl"
          footer={
            <CredentialButton
              variant="primary"
              onClick={() => setRosterCourse(null)}
            >
              Close Roster
            </CredentialButton>
          }
        >
          <div className="space-y-4">
            <div
              className="flex items-center justify-between pb-2 border-b text-xs"
              style={{ borderColor: "var(--card-border, #4a4335)" }}
            >
              <span className="font-medium" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                Enrolled Students ({rosterCourse.enrolledCount} Seats Occupied)
              </span>
              <span className="font-mono text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
                Total Capacity: {rosterCourse.capacity}
              </span>
            </div>

            <div
              className="divide-y text-xs"
              style={{ borderColor: "var(--card-border, #4a4335)" }}
            >
              {students.filter((s) => s.enrolledCourseCodes.includes(rosterCourse.code)).length === 0 ? (
                <div className="py-6 text-center" style={{ color: "var(--text-muted, #8a8272)" }}>
                  No students currently enrolled in this course offering.
                </div>
              ) : (
                students
                  .filter((s) => s.enrolledCourseCodes.includes(rosterCourse.code))
                  .map((s) => (
                    <div key={s.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium" style={{ color: "var(--text-heading, #F2EEE4)" }}>
                          {s.name}
                        </p>
                        <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted, #8a8272)" }}>
                          {s.studentId} • {s.program}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs block" style={{ color: "var(--text-value, #D8D3C6)" }}>
                          Attendance: {s.attendancePercentage}%
                        </span>
                        <span className="text-[11px] font-mono font-medium" style={{ color: "var(--text-value, #D8D3C6)" }}>
                          CGPA: {s.cgpa.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </CredentialModal>
      )}

      {/* 2. CREATE NEW COURSE MODAL */}
      <CredentialModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          resetCreateForm();
        }}
        eyebrow="ACADEMIC CATALOG • LIVE DATABASE"
        title="Create New Course Offering"
        description="Assign dynamic departments, degree programs, and approved faculty instructors."
        maxWidth="2xl"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => {
                setIsCreateOpen(false);
                resetCreateForm();
              }}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              disabled={isSubmitting || !selectedDeptId}
              onClick={handleCreateSubmit}
            >
              {isSubmitting ? "Creating Course..." : "Create Course Offering"}
            </CredentialButton>
          </>
        }
      >
        {formError && (
          <div
            className="p-3 rounded-[6px] border flex items-center gap-2 text-xs"
            style={{
              borderColor: "var(--status-danger, #E27878)",
              color: "var(--status-danger, #E27878)",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CredentialInput
              label="Course Code *"
              placeholder="e.g. CS-301"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              required
            />
            <div className="sm:col-span-2">
              <CredentialInput
                label="Course Name / Title *"
                placeholder="e.g. Distributed Database Architecture"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SearchableDropdown
              label="Department"
              icon={<Building2 className="w-3.5 h-3.5 text-[#8a8272]" />}
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
              emptyStateActionLabel="Go to Departments"
              onEmptyStateAction={() => {
                setIsCreateOpen(false);
                if (onNavigateTab) onNavigateTab("departments");
              }}
            />

            <SearchableDropdown
              label="Degree Program"
              icon={<GraduationCap className="w-3.5 h-3.5 text-[#8a8272]" />}
              placeholder={
                selectedDeptId
                  ? "Select Degree Program..."
                  : "First select a department..."
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
                  ? `No active degree programs under "${selectedDeptRecord.name}".`
                  : "Please select a department first."
              }
              emptyStateActionLabel="Create Program"
              onEmptyStateAction={() => {
                setIsCreateOpen(false);
                if (onNavigateTab) onNavigateTab("programs");
              }}
            />
          </div>

          <SearchableDropdown
            label="Assign Faculty Instructor"
            icon={<UserCheck className="w-3.5 h-3.5 text-[#8a8272]" />}
            placeholder="Select Approved Faculty Member..."
            searchPlaceholder="Search instructors by name, designation, or department..."
            value={selectedInstructorId}
            onChange={(id) => setSelectedInstructorId(id)}
            isLoading={isLoadingDropdowns}
            options={instructorOptions}
            emptyStateTitle="No instructors available."
            emptyStateMessage="Please add a faculty member first in Faculty Management."
            emptyStateActionLabel="Go to Faculty"
            onEmptyStateAction={() => {
              setIsCreateOpen(false);
              if (onNavigateTab) onNavigateTab("faculty");
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CredentialSelect
              label="Credit Hours *"
              value={newCredits}
              onChange={(e) => setNewCredits(parseInt(e.target.value) || 3)}
            >
              <option value={1}>1 Credit Hour</option>
              <option value={2}>2 Credit Hours</option>
              <option value={3}>3 Credit Hours (Standard)</option>
              <option value={4}>4 Credit Hours (Theory+Lab)</option>
              <option value={5}>5 Credit Hours</option>
              <option value={6}>6 Credit Hours (Capstone)</option>
            </CredentialSelect>

            <CredentialSelect
              label="Semester / Term *"
              value={newSemester}
              onChange={(e) => setNewSemester(parseInt(e.target.value) || 1)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </CredentialSelect>

            <CredentialSelect
              label="Course Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
            >
              <option value="Active">Active Offering</option>
              <option value="Inactive">Inactive / Draft</option>
            </CredentialSelect>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CredentialInput
              label="Seat Capacity"
              type="number"
              min="10"
              max="100"
              value={newCapacity}
              onChange={(e) => setNewCapacity(parseInt(e.target.value) || 45)}
            />
            <CredentialInput
              label="Lecture Schedule"
              value={newSchedule}
              onChange={(e) => setNewSchedule(e.target.value)}
            />
            <CredentialInput
              label="Classroom"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-[12px] font-medium leading-none select-none"
              style={{ color: "var(--text-muted, #8a8272)" }}
            >
              Course Description & Objectives
            </label>
            <textarea
              rows={2}
              placeholder="Outline syllabus overview, learning objectives, and prerequisites..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
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

      {/* 3. EDIT COURSE MODAL */}
      {editCourse && (
        <CredentialModal
          isOpen={Boolean(editCourse)}
          onClose={() => setEditCourse(null)}
          eyebrow={`CODE: ${editCourse.code} • EDIT OFFERING`}
          title={`Edit Course: ${editCourse.title}`}
          description="Update course details, venue, faculty allocation, or seat limits."
          maxWidth="lg"
          footer={
            <>
              <CredentialButton
                variant="secondary"
                onClick={() => setEditCourse(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="primary"
                disabled={isSubmitting}
                onClick={handleEditSubmit}
              >
                {isSubmitting ? "Saving..." : "Save Configuration"}
              </CredentialButton>
            </>
          }
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <CredentialInput
              label="Course Title"
              required
              value={editCourse.title}
              onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
            />

            <CredentialSelect
              label="Department"
              value={editDeptId}
              onChange={(e) => setEditDeptId(e.target.value)}
            >
              <option value="">{editCourse.department}</option>
              {liveDepartments
                .filter((d) => d.status === "active")
                .map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.code})
                  </option>
                ))}
            </CredentialSelect>

            <CredentialSelect
              label="Assigned Instructor"
              value={editInstructorId}
              onChange={(e) => setEditInstructorId(e.target.value)}
            >
              <option value="unassigned">Unassigned / TBA</option>
              {liveFaculty
                .filter((f) => f.status !== "Inactive")
                .map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.fullName} ({f.department})
                  </option>
                ))}
            </CredentialSelect>

            <div className="grid grid-cols-2 gap-3">
              <CredentialSelect
                label="Status"
                value={editCourse.status}
                onChange={(e) => setEditCourse({ ...editCourse, status: e.target.value as any })}
              >
                <option value="Active">Active Offering</option>
                <option value="Inactive">Inactive / Suspended</option>
              </CredentialSelect>

              <CredentialInput
                label="Seat Capacity"
                type="number"
                value={editCourse.capacity}
                onChange={(e) => setEditCourse({ ...editCourse, capacity: parseInt(e.target.value) || 40 })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CredentialInput
                label="Schedule"
                value={editCourse.schedule}
                onChange={(e) => setEditCourse({ ...editCourse, schedule: e.target.value })}
              />
              <CredentialInput
                label="Classroom"
                value={editCourse.classroom}
                onChange={(e) => setEditCourse({ ...editCourse, classroom: e.target.value })}
              />
            </div>
          </form>
        </CredentialModal>
      )}

      {/* 4. CONFIRM DELETE COURSE MODAL */}
      {courseToDelete && (
        <CredentialModal
          isOpen={Boolean(courseToDelete)}
          onClose={() => setCourseToDelete(null)}
          eyebrow="DANGER • PERMANENT ACTION"
          title="Delete Course Offering?"
          description={`Permanently remove ${courseToDelete.code}: ${courseToDelete.title} from the academic catalog.`}
          maxWidth="md"
          footer={
            <>
              <CredentialButton
                variant="secondary"
                onClick={() => setCourseToDelete(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="danger"
                onClick={async () => {
                  await onDeleteCourse(courseToDelete.id);
                  setCourseToDelete(null);
                  if (onRefresh) await onRefresh();
                }}
              >
                Confirm Delete
              </CredentialButton>
            </>
          }
        >
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-value, #D8D3C6)" }}>
            This action will permanently delete this course offering. Any student registrations associated with this section will be flagged.
          </p>
        </CredentialModal>
      )}
    </div>
  );
};


