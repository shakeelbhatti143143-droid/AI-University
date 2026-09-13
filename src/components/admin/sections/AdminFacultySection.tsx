"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Edit3,
  Trash2,
  BookOpen,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export interface FacultyMember {
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  designation:
    | "Professor"
    | "Associate Professor"
    | "Assistant Professor"
    | "Lecturer"
    | "Visiting Faculty"
    | "Lab Instructor";
  specialization: string;
  qualification: string;
  joiningDate: string;
  officeLocation: string;
  officeHours: string;
  status: "Active" | "Inactive" | "On Leave";
  bio?: string;
  createdAt: number;
}

interface AdminFacultySectionProps {
  facultyList: FacultyMember[];
  departments: Array<{ code: string; name: string }>;
  courses?: Array<{ id: string; code: string; title: string; instructor?: string }>;
  onCreateFaculty: (facultyData: any) => Promise<any>;
  onUpdateStatus: (facultyId: string, status: "Active" | "Inactive" | "On Leave") => Promise<void>;
  onResetPassword?: (facultyId: string, newPassword: string) => Promise<void>;
  onEditFaculty?: (facultyId: string, data: any) => Promise<void>;
  onDeleteFaculty?: (facultyId: string) => Promise<void>;
  onAssignCourse?: (courseId: string, facultyId: string, facultyName: string) => Promise<void>;
}

export const AdminFacultySection: React.FC<AdminFacultySectionProps> = ({
  facultyList,
  departments,
  courses = [],
  onCreateFaculty,
  onUpdateStatus,
  onResetPassword,
  onEditFaculty,
  onDeleteFaculty,
  onAssignCourse,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [resetPasswordFaculty, setResetPasswordFaculty] = useState<FacultyMember | null>(null);
  const [assignCourseFaculty, setAssignCourseFaculty] = useState<FacultyMember | null>(null);
  const [deleteFacultyConfirm, setDeleteFacultyConfirm] = useState<FacultyMember | null>(null);

  // Submitting states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Create Form State
  const defaultDepartment =
    departments[0]?.name || "Department of Computing & Artificial Intelligence";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "+92 51 111 264 264",
    employeeId: `FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    department: defaultDepartment,
    designation: "Assistant Professor" as FacultyMember["designation"],
    specialization: "Artificial Intelligence & Software Engineering",
    qualification: "Ph.D. in Computer Science",
    joiningDate: new Date().toISOString().split("T")[0],
    officeLocation: "Faculty Block B, Office 201",
    officeHours: "Mon-Thu 11:00 AM - 01:00 PM",
    status: "Active" as const,
    bio: "",
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    department: defaultDepartment,
    designation: "Assistant Professor" as FacultyMember["designation"],
    phone: "",
    specialization: "",
    qualification: "",
    officeLocation: "",
    officeHours: "",
    status: "Active" as "Active" | "Inactive" | "On Leave",
    bio: "",
  });

  // Reset Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Course Assignment State
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch =
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === "All" || f.department === departmentFilter;
    const matchesStatus = statusFilter === "All" || f.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Auto-generate faculty email suggestion when typing name
  const handleNameChange = (nameVal: string) => {
    const cleanName = nameVal.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim().replace(/\s+/g, ".");
    const emailCandidate = cleanName ? `${cleanName}@iqra.edu.pk` : "";
    setFormData((prev) => ({
      ...prev,
      fullName: nameVal,
      email: prev.email && !prev.email.includes("@iqra.edu.pk") ? prev.email : emailCandidate,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage("Full Name is required.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("A valid university email address is required (e.g. teacher@iqra.edu.pk).");
      return;
    }
    if (!formData.password) {
      setErrorMessage("Password is required.");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await onCreateFaculty({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        employeeId: formData.employeeId.trim().toUpperCase(),
        department: formData.department,
        designation: formData.designation,
        specialization: formData.specialization.trim(),
        qualification: formData.qualification.trim(),
        joiningDate: formData.joiningDate,
        officeLocation: formData.officeLocation.trim(),
        officeHours: formData.officeHours.trim(),
        status: formData.status,
        bio: formData.bio.trim(),
      });

      setIsCreateModalOpen(false);
      setSuccessMessage(
        result?.message ||
          "Faculty Member created successfully. The faculty member can now log in using their university email and assigned password."
      );

      // Reset create form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "+92 51 111 264 264",
        employeeId: `FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        department: defaultDepartment,
        designation: "Assistant Professor",
        specialization: "Artificial Intelligence & Software Engineering",
        qualification: "Ph.D. in Computer Science",
        joiningDate: new Date().toISOString().split("T")[0],
        officeLocation: "Faculty Block B, Office 201",
        officeHours: "Mon-Thu 11:00 AM - 01:00 PM",
        status: "Active",
        bio: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create faculty member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (f: FacultyMember) => {
    setEditingFaculty(f);
    setEditFormData({
      fullName: f.fullName,
      department: f.department,
      designation: f.designation,
      phone: f.phone,
      specialization: f.specialization,
      qualification: f.qualification,
      officeLocation: f.officeLocation,
      officeHours: f.officeHours,
      status: f.status,
      bio: f.bio || "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty || !onEditFaculty) return;

    try {
      setIsSubmitting(true);
      await onEditFaculty(editingFaculty._id, editFormData);
      setEditingFaculty(null);
      setSuccessMessage(`Updated profile for ${editFormData.fullName} successfully.`);
    } catch (err: any) {
      alert(err.message || "Failed to update faculty member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordFaculty || !onResetPassword) return;

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onResetPassword(resetPasswordFaculty._id, newPassword);
      setResetPasswordFaculty(null);
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccessMessage(
        `Password for ${resetPasswordFaculty.fullName} (${resetPasswordFaculty.email}) reset successfully. The faculty member can now log in with the new password.`
      );
    } catch (err: any) {
      alert(err.message || "Failed to reset faculty password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCourseFaculty || !onAssignCourse || !selectedCourseId) return;

    try {
      setIsSubmitting(true);
      await onAssignCourse(selectedCourseId, assignCourseFaculty._id, assignCourseFaculty.fullName);
      setAssignCourseFaculty(null);
      setSelectedCourseId("");
      setSuccessMessage(
        `Assigned course to ${assignCourseFaculty.fullName} successfully.`
      );
    } catch (err: any) {
      alert(err.message || "Failed to assign course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteFacultyConfirm || !onDeleteFaculty) return;

    try {
      setIsSubmitting(true);
      await onDeleteFaculty(deleteFacultyConfirm._id);
      setDeleteFacultyConfirm(null);
      setSuccessMessage("Faculty member deleted successfully and login access revoked.");
    } catch (err: any) {
      alert(err.message || "Failed to delete faculty member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* SUCCESS NOTIFICATION BANNER */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-emerald-800">Operation Successful</div>
              <p className="text-xs text-emerald-700 leading-relaxed mt-0.5">{successMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-500 hover:text-emerald-800 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner & Stats */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Academic Personnel & SIS
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Iqra University Chak Shehzad</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Faculty Directory & Credentials Management
          </h2>
          <p className="text-xs text-slate-500">
            Create faculty accounts, assign institutional emails, manage hashed passwords, and configure course allocations.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreateModalOpen(true);
            setErrorMessage(null);
          }}
          className="px-4 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 self-start md:self-auto transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Quick KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Faculty</div>
          <div className="text-2xl font-black font-heading text-slate-900 mt-1">
            {facultyList.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Registered personnel</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Active Accounts</div>
          <div className="text-2xl font-black font-heading text-emerald-600 mt-1">
            {facultyList.filter((f) => f.status === "Active").length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Authorized for login</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Departments</div>
          <div className="text-2xl font-black font-heading text-indigo-600 mt-1">
            {departments.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Academic units</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Available Courses</div>
          <div className="text-2xl font-black font-heading text-blue-600 mt-1">
            {courses.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Curriculum subjects</div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty by name, employee ID, university email, specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-600/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.code} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No faculty members found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {facultyList.length === 0
              ? "No faculty accounts exist in the database. Click 'Add Faculty Member' to register instructors."
              : "No faculty matched your active search query or filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculty.map((f) => (
            <div
              key={f._id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {f.employeeId}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {f.fullName}
                    </h3>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-50 text-iqra-blue-700 border border-blue-200/60">
                      {f.designation}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      f.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : f.status === "On Leave"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                    )}
                  >
                    {f.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{f.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-blue-600 font-mono text-[11px] font-semibold">
                      {f.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{f.specialization}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{f.officeLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-[11px] text-slate-500">{f.officeHours}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-1.5 text-xs">
                  <button
                    onClick={() => setSelectedFaculty(f)}
                    className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-center transition-colors"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => handleOpenEdit(f)}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Edit Faculty Member"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setResetPasswordFaculty(f);
                      setNewPassword("");
                      setConfirmNewPassword("");
                    }}
                    className="p-1.5 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                    title="Reset Faculty Password"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>

                  {courses.length > 0 && onAssignCourse && (
                    <button
                      onClick={() => setAssignCourseFaculty(f)}
                      className="p-1.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Assign Course"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                  )}

                  {onDeleteFaculty && (
                    <button
                      onClick={() => setDeleteFacultyConfirm(f)}
                      className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Faculty Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Toggle Button */}
                <div className="pt-1">
                  {f.status === "Active" ? (
                    <button
                      onClick={() => onUpdateStatus(f._id, "Inactive")}
                      className="w-full py-1 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors"
                    >
                      Deactivate Account
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateStatus(f._id, "Active")}
                      className="w-full py-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-[11px] font-semibold transition-colors shadow-xs"
                    >
                      Activate Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE FACULTY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                    Role: FACULTY
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">Live Auth Account</span>
                </div>
                <h3 className="text-xl font-black font-heading text-slate-900 mt-1">
                  Create Faculty Member & Account
                </h3>
                <p className="text-xs text-slate-500">
                  Assign official university credentials and authentication password.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Muhammad Ali or Dr. Sarah Khan"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-iqra-blue-600/20 font-medium"
                  />
                </div>

                {/* University Email */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>University Email (Login Email) *</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Example: teacher@iqra.edu.pk
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. teacher@iqra.edu.pk or muhammad.ali@iqra.edu.pk"
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-iqra-blue-600/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="e.g. Teacher@123"
                      className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-iqra-blue-600/20 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Minimum 6 characters. Stored securely with SHA-256 hash.
                  </span>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-iqra-blue-600/20 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password && formData.confirmPassword && (
                    <span
                      className={cn(
                        "text-[10px] mt-0.5 block font-semibold",
                        formData.password === formData.confirmPassword
                          ? "text-emerald-600"
                          : "text-rose-600"
                      )}
                    >
                      {formData.password === formData.confirmPassword
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </span>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Faculty / Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none font-medium"
                  >
                    {departments.map((d) => (
                      <option key={d.code} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation *
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Visiting Faculty">Visiting Faculty</option>
                    <option value="Lab Instructor">Lab Instructor</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 51 111 264 264"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="FAC-2026-1042"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Artificial Intelligence & Algorithms"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. Ph.D. in Computer Science"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Office Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Office Location
                  </label>
                  <input
                    type="text"
                    value={formData.officeLocation}
                    onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                    placeholder="e.g. Faculty Block B, Office 201"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Office Hours */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    value={formData.officeHours}
                    onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                    placeholder="e.g. Mon-Thu 11:00 AM - 01:00 PM"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty Bio / Research Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Academic research interests, published journal papers, industry experience..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? "Creating Account..." : "Create Faculty Member"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FACULTY MODAL (NO PASSWORD EXPOSURE) */}
      {editingFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {editingFaculty.employeeId}
                </span>
                <h3 className="text-xl font-black font-heading text-slate-900">
                  Edit Faculty Member Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Credentials and password are kept secure and separate.
                </p>
              </div>
              <button
                onClick={() => setEditingFaculty(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.code} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <select
                    value={editFormData.designation}
                    onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Visiting Faculty">Visiting Faculty</option>
                    <option value="Lab Instructor">Lab Instructor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Office Location</label>
                  <input
                    type="text"
                    value={editFormData.officeLocation}
                    onChange={(e) => setEditFormData({ ...editFormData, officeLocation: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Office Hours</label>
                  <input
                    type="text"
                    value={editFormData.officeHours}
                    onChange={(e) => setEditFormData({ ...editFormData, officeHours: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFaculty(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPasswordFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-slate-900">
                    Reset Faculty Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    {resetPasswordFaculty.fullName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResetPasswordFaculty(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Target Account:</div>
              <div className="font-mono text-blue-600 text-[11px]">{resetPasswordFaculty.email}</div>
              <div className="text-slate-400 text-[11px]">
                Enter a new password for this faculty member. Existing password is never displayed or exposed.
              </div>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showResetPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showResetPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                {newPassword && confirmNewPassword && (
                  <span
                    className={cn(
                      "text-[10px] mt-1 block font-semibold",
                      newPassword === confirmNewPassword ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {newPassword === confirmNewPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetPasswordFaculty(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Resetting..." : "Confirm Password Reset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN COURSE MODAL */}
      {assignCourseFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-slate-900">
                    Assign Course to Faculty
                  </h3>
                  <p className="text-xs text-slate-500">{assignCourseFaculty.fullName}</p>
                </div>
              </div>
              <button
                onClick={() => setAssignCourseFaculty(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignCourseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Course *
                </label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                >
                  <option value="">-- Choose Course to Assign --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title} {c.instructor ? `(Current: ${c.instructor})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignCourseFaculty(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedCourseId}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Assigning..." : "Assign Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE FACULTY CONFIRMATION MODAL */}
      {deleteFacultyConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black font-heading text-slate-900">
                  Delete Faculty Member?
                </h3>
                <p className="text-xs text-slate-500">
                  This action will revoke all authentication and dashboard privileges.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900">{deleteFacultyConfirm.fullName}</strong> (
              <span className="font-mono text-blue-600">{deleteFacultyConfirm.email}</span>)? All
              associated authentication sessions will be terminated.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteFacultyConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteSubmit}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Yes, Delete Faculty Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW FACULTY DETAILS MODAL */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {selectedFaculty.employeeId}
                </span>
                <h3 className="text-xl font-black font-heading text-slate-900">
                  {selectedFaculty.fullName}
                </h3>
                <p className="text-xs text-iqra-blue-600 font-bold">{selectedFaculty.designation}</p>
              </div>
              <button
                onClick={() => setSelectedFaculty(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Department:</span>
                  <span className="font-semibold text-right">{selectedFaculty.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">University Email:</span>
                  <span className="font-mono text-blue-600 font-bold">{selectedFaculty.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Phone:</span>
                  <span>{selectedFaculty.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Qualification:</span>
                  <span className="font-semibold">{selectedFaculty.qualification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Specialization:</span>
                  <span className="font-semibold">{selectedFaculty.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Office:</span>
                  <span>{selectedFaculty.officeLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Office Hours:</span>
                  <span>{selectedFaculty.officeHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Joining Date:</span>
                  <span>{selectedFaculty.joiningDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      selectedFaculty.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    )}
                  >
                    {selectedFaculty.status}
                  </span>
                </div>
              </div>

              {selectedFaculty.bio && (
                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-slate-700">
                  <span className="text-[10px] font-bold uppercase text-iqra-blue-800 block mb-1">
                    Biography & Research
                  </span>
                  <p className="text-xs leading-relaxed">{selectedFaculty.bio}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
