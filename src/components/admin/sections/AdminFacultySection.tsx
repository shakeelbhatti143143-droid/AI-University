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
        <div
          className="p-4 rounded-[10px] border flex items-start justify-between gap-3 animate-in fade-in duration-200"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--status-success, #7DAE7A)",
          }}
        >
          <div className="flex items-start gap-3">
            <span
              className="w-[8px] h-[8px] rounded-full shrink-0 mt-1"
              style={{ backgroundColor: "var(--status-success, #7DAE7A)" }}
            />
            <div>
              <div
                className="font-bold text-xs uppercase tracking-wider"
                style={{ color: "var(--status-success, #7DAE7A)" }}
              >
                Operation Successful
              </div>
              <p className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--text-value, #D8D3C6)" }}>
                {successMessage}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="p-1 rounded-[4px] hover:bg-white/5 transition-colors"
            style={{ color: "var(--text-muted, #8a8272)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner & Stats */}
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
              Academic Personnel & SIS
            </span>
            <span style={{ color: "var(--text-muted, #8a8272)" }}>•</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              Iqra University Chak Shehzad
            </span>
          </div>
          <h2
            className="font-serif text-[26px] font-[500] leading-tight tracking-tight"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            Faculty Directory & Credentials
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            Create faculty accounts, assign institutional emails, manage hashed passwords, and configure course allocations.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreateModalOpen(true);
            setErrorMessage(null);
          }}
          className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 self-start md:self-auto transition-colors active:scale-[0.98]"
          style={{
            borderColor: "var(--accent-gold, #C9A25B)",
            color: "var(--accent-gold, #C9A25B)",
            backgroundColor: "transparent",
            borderRadius: "var(--radius-control, 6px)",
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Quick KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <CredentialCard className="pt-4 px-5 pb-4">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted, #8a8272)" }}
          >
            Total Faculty
          </div>
          <div
            className="font-serif text-[28px] font-[500] leading-none mt-2"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            {facultyList.length}
          </div>
          <div className="text-[11px] mt-1.5" style={{ color: "var(--text-muted, #8a8272)" }}>
            Registered personnel
          </div>
        </CredentialCard>

        <CredentialCard className="pt-4 px-5 pb-4">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted, #8a8272)" }}
          >
            Active Accounts
          </div>
          <div
            className="font-serif text-[28px] font-[500] leading-none mt-2"
            style={{ color: "var(--status-success, #7DAE7A)" }}
          >
            {facultyList.filter((f) => f.status === "Active").length}
          </div>
          <div className="text-[11px] mt-1.5" style={{ color: "var(--text-muted, #8a8272)" }}>
            Authorized for login
          </div>
        </CredentialCard>

        <CredentialCard className="pt-4 px-5 pb-4">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted, #8a8272)" }}
          >
            Departments
          </div>
          <div
            className="font-serif text-[28px] font-[500] leading-none mt-2"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            {departments.length}
          </div>
          <div className="text-[11px] mt-1.5" style={{ color: "var(--text-muted, #8a8272)" }}>
            Academic units
          </div>
        </CredentialCard>

        <CredentialCard className="pt-4 px-5 pb-4">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted, #8a8272)" }}
          >
            Available Courses
          </div>
          <div
            className="font-serif text-[28px] font-[500] leading-none mt-2"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            {courses.length}
          </div>
          <div className="text-[11px] mt-1.5" style={{ color: "var(--text-muted, #8a8272)" }}>
            Curriculum subjects
          </div>
        </CredentialCard>
      </div>

      {/* Filters & Search Bar */}
      <CredentialFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search faculty by name, employee ID, university email, specialization..."
      >
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="h-[36px] px-3 bg-[#1D1B18] border border-[#4a4335] rounded-[6px] text-xs text-[#D8D3C6] focus:outline-none focus:border-[#C9A25B]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
            color: "var(--text-value, #D8D3C6)",
            borderRadius: "var(--radius-control, 6px)",
          }}
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
          <option value="Inactive">Inactive</option>
          <option value="On Leave">On Leave</option>
        </select>
      </CredentialFilterBar>

      {/* Faculty Cards Grid */}
      {filteredFaculty.length === 0 ? (
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
            <UserCheck className="w-6 h-6" />
          </div>
          <h3
            className="font-serif text-[20px] font-[500]"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            No faculty members found
          </h3>
          <p className="text-xs max-w-sm mx-auto" style={{ color: "var(--text-muted, #8a8272)" }}>
            {facultyList.length === 0
              ? "No faculty accounts exist in the database. Click 'Add Faculty Member' to register instructors."
              : "No faculty matched your active search query or filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.map((f) => {
            const secondaryActions = [
              {
                label: "Edit Profile",
                icon: <Edit3 className="w-3.5 h-3.5" />,
                onClick: () => handleOpenEdit(f),
              },
              {
                label: "Reset Password",
                icon: <KeyRound className="w-3.5 h-3.5" />,
                onClick: () => {
                  setResetPasswordFaculty(f);
                  setNewPassword("");
                  setConfirmNewPassword("");
                },
              },
              ...(courses.length > 0 && onAssignCourse
                ? [
                    {
                      label: "Assign Course",
                      icon: <BookOpen className="w-3.5 h-3.5" />,
                      onClick: () => setAssignCourseFaculty(f),
                    },
                  ]
                : []),
              {
                label: f.status === "Active" ? "Deactivate Account" : "Activate Account",
                onClick: () => onUpdateStatus(f._id, f.status === "Active" ? "Inactive" : "Active"),
              },
              ...(onDeleteFaculty
                ? [
                    {
                      label: "Delete Faculty Account",
                      isDestructive: true,
                      icon: <Trash2 className="w-3.5 h-3.5" />,
                      onClick: () => setDeleteFacultyConfirm(f),
                    },
                  ]
                : []),
            ];

            return (
              <CredentialCard key={f._id}>
                {/* Header: Eyebrow + Monospace ID */}
                <CredentialHeader
                  eyebrow={f.department}
                  referenceId={f.employeeId}
                />

                {/* Title Block: Serif Name + Gold Subheading */}
                <CredentialTitle
                  title={f.fullName}
                  subheading={f.designation}
                  hasDivider
                />

                {/* Detail Rows */}
                <CredentialDetailList className="flex-1">
                  <CredentialDetailRow
                    label="Institutional Email"
                    value={f.email}
                    isEmail
                    href={f.email}
                  />
                  <CredentialDetailRow
                    label="Specialization"
                    value={f.specialization}
                  />
                  <CredentialDetailRow
                    label="Office Location"
                    value={f.officeLocation}
                  />
                  <CredentialDetailRow
                    label="Office Hours"
                    value={f.officeHours}
                  />
                  <CredentialDetailRow
                    label="Qualification"
                    value={f.qualification}
                  />
                </CredentialDetailList>

                {/* Footer: 7px dot status + primary button + overflow menu */}
                <CredentialFooter
                  status={{
                    label: f.status,
                    state: f.status === "Active" ? "success" : "danger",
                  }}
                  primaryAction={{
                    label: "Details",
                    onClick: () => setSelectedFaculty(f),
                  }}
                  secondaryActions={secondaryActions}
                />
              </CredentialCard>
            );
          })}
        </div>
      )}

      {/* CREATE FACULTY MODAL */}
      <CredentialModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        eyebrow="FACULTY REGISTRATION • LIVE SIS ACCOUNT"
        title="Create Faculty Member"
        description="Assign official university credentials, system privileges, and encrypted authentication password."
        maxWidth="2xl"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              disabled={isSubmitting}
              onClick={handleCreateSubmit}
            >
              {isSubmitting ? "Creating..." : "Create Faculty Member"}
            </CredentialButton>
          </>
        }
      >
        {errorMessage && (
          <div
            className="p-3 rounded-[6px] border flex items-center gap-2 text-xs"
            style={{
              borderColor: "var(--status-danger, #E27878)",
              color: "var(--status-danger, #E27878)",
            }}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <CredentialInput
                label="Full Name *"
                required
                value={formData.fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Dr. Muhammad Imran"
              />
            </div>

            <div>
              <CredentialInput
                label="University Email (Login Username) *"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="m.imran@iqra.edu.pk"
              />
            </div>

            <div>
              <CredentialInput
                label="Contact Phone *"
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 51 111 264 264"
              />
            </div>

            {/* Password Fields */}
            <div>
              <CredentialInput
                label="Account Password *"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div>
              <CredentialInput
                label="Confirm Password *"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div>
              <CredentialSelect
                label="Department *"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map((d) => (
                  <option key={d.code} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </CredentialSelect>
            </div>

            <div>
              <CredentialSelect
                label="Academic Designation *"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    designation: e.target.value as FacultyMember["designation"],
                  })
                }
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Visiting Faculty">Visiting Faculty</option>
                <option value="Lab Instructor">Lab Instructor</option>
              </CredentialSelect>
            </div>

            <div>
              <CredentialInput
                label="Employee ID *"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="FAC-2026-1042"
              />
            </div>

            <div>
              <CredentialInput
                label="Specialization *"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. Artificial Intelligence & Algorithms"
              />
            </div>

            <div>
              <CredentialInput
                label="Highest Qualification *"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. Ph.D. in Computer Science"
              />
            </div>

            <div>
              <CredentialInput
                label="Office Location *"
                value={formData.officeLocation}
                onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                placeholder="e.g. Faculty Block B, Office 201"
              />
            </div>

            <div className="sm:col-span-2">
              <CredentialInput
                label="Office Hours *"
                value={formData.officeHours}
                onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                placeholder="e.g. Mon-Thu 11:00 AM - 01:00 PM"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-[12px] font-medium leading-none select-none"
              style={{ color: "var(--text-muted, #8a8272)" }}
            >
              Faculty Bio / Research Summary
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Academic research interests, published journal papers, industry experience..."
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

      {/* EDIT FACULTY MODAL */}
      {editingFaculty && (
        <CredentialModal
          isOpen={Boolean(editingFaculty)}
          onClose={() => setEditingFaculty(null)}
          eyebrow={`ID: ${editingFaculty.employeeId} • EDIT RECORD`}
          title={`Edit Profile: ${editingFaculty.fullName}`}
          description="Update department, designations, specialization, and administrative contact details."
          maxWidth="xl"
          footer={
            <>
              <CredentialButton
                variant="secondary"
                onClick={() => setEditingFaculty(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="primary"
                disabled={isSubmitting}
                onClick={handleEditSubmit}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </CredentialButton>
            </>
          }
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <CredentialInput
                  label="Full Name"
                  required
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                />
              </div>

              <div>
                <CredentialSelect
                  label="Department"
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                >
                  {departments.map((d) => (
                    <option key={d.code} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </CredentialSelect>
              </div>

              <div>
                <CredentialSelect
                  label="Academic Designation"
                  value={editFormData.designation}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      designation: e.target.value as FacultyMember["designation"],
                    })
                  }
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Visiting Faculty">Visiting Faculty</option>
                  <option value="Lab Instructor">Lab Instructor</option>
                </CredentialSelect>
              </div>

              <div>
                <CredentialInput
                  label="Contact Phone"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>

              <div>
                <CredentialSelect
                  label="Account Status"
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      status: e.target.value as "Active" | "Inactive" | "On Leave",
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </CredentialSelect>
              </div>

              <div>
                <CredentialInput
                  label="Specialization"
                  value={editFormData.specialization}
                  onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                />
              </div>

              <div>
                <CredentialInput
                  label="Highest Qualification"
                  value={editFormData.qualification}
                  onChange={(e) => setEditFormData({ ...editFormData, qualification: e.target.value })}
                />
              </div>

              <div>
                <CredentialInput
                  label="Office Location"
                  value={editFormData.officeLocation}
                  onChange={(e) => setEditFormData({ ...editFormData, officeLocation: e.target.value })}
                />
              </div>

              <div>
                <CredentialInput
                  label="Office Hours"
                  value={editFormData.officeHours}
                  onChange={(e) => setEditFormData({ ...editFormData, officeHours: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                className="block text-[12px] font-medium leading-none select-none"
                style={{ color: "var(--text-muted, #8a8272)" }}
              >
                Faculty Bio / Research Summary
              </label>
              <textarea
                rows={3}
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
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

      {/* RESET PASSWORD MODAL */}
      {resetPasswordFaculty && (
        <CredentialModal
          isOpen={Boolean(resetPasswordFaculty)}
          onClose={() => setResetPasswordFaculty(null)}
          eyebrow={`ID: ${resetPasswordFaculty.employeeId} • SECURITY OVERRIDE`}
          title={`Reset Password: ${resetPasswordFaculty.fullName}`}
          description={`Directly update credentials for ${resetPasswordFaculty.email}.`}
          maxWidth="md"
          footer={
            <>
              <CredentialButton
                variant="secondary"
                onClick={() => setResetPasswordFaculty(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="primary"
                disabled={isSubmitting}
                onClick={handleResetPasswordSubmit}
              >
                {isSubmitting ? "Updating..." : "Reset Password"}
              </CredentialButton>
            </>
          }
        >
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div className="relative">
              <CredentialInput
                label="New Password (min. 6 characters) *"
                type={showResetPassword ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
              />
              <button
                type="button"
                onClick={() => setShowResetPassword(!showResetPassword)}
                className="absolute right-3 top-8 text-xs hover:text-white"
                style={{ color: "var(--text-muted, #8a8272)" }}
              >
                {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div>
              <CredentialInput
                label="Confirm New Password *"
                type={showResetPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              {newPassword && confirmNewPassword && (
                <span
                  className="text-[11px] mt-1.5 block font-medium"
                  style={{
                    color:
                      newPassword === confirmNewPassword
                        ? "var(--status-success, #7DAE7A)"
                        : "var(--status-danger, #E27878)",
                  }}
                >
                  {newPassword === confirmNewPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </span>
              )}
            </div>
          </form>
        </CredentialModal>
      )}

      {/* ASSIGN COURSE MODAL */}
      {assignCourseFaculty && (
        <CredentialModal
          isOpen={Boolean(assignCourseFaculty)}
          onClose={() => setAssignCourseFaculty(null)}
          eyebrow="COURSE ALLOCATION"
          title={`Assign Course to ${assignCourseFaculty.fullName}`}
          description={`Select an active course to assign to ${assignCourseFaculty.employeeId}.`}
          maxWidth="md"
          footer={
            <>
              <CredentialButton
                variant="secondary"
                onClick={() => setAssignCourseFaculty(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="primary"
                disabled={isSubmitting || !selectedCourseId}
                onClick={handleAssignCourseSubmit}
              >
                {isSubmitting ? "Assigning..." : "Assign Course"}
              </CredentialButton>
            </>
          }
        >
          <form onSubmit={handleAssignCourseSubmit} className="space-y-4">
            <CredentialSelect
              label="Select Course to Assign *"
              required
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="">-- Choose Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title} {c.instructor ? `(Current: ${c.instructor})` : ""}
                </option>
              ))}
            </CredentialSelect>
          </form>
        </CredentialModal>
      )}

      {/* DELETE FACULTY CONFIRMATION MODAL */}
      {deleteFacultyConfirm && (
        <CredentialModal
          isOpen={Boolean(deleteFacultyConfirm)}
          onClose={() => setDeleteFacultyConfirm(null)}
          eyebrow="DANGER • PERMANENT ACTION"
          title="Delete Faculty Account?"
          description={`Are you sure you want to permanently delete ${deleteFacultyConfirm.fullName} (${deleteFacultyConfirm.email})?`}
          maxWidth="md"
          footer={
            <>
              <CredentialButton
                variant="secondary"
                onClick={() => setDeleteFacultyConfirm(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="danger"
                disabled={isSubmitting}
                onClick={handleDeleteSubmit}
              >
                {isSubmitting ? "Deleting..." : "Permanently Delete"}
              </CredentialButton>
            </>
          }
        >
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-value, #D8D3C6)" }}>
            This action will revoke all authentication and dashboard privileges. Associated authentication sessions will be immediately terminated.
          </p>
        </CredentialModal>
      )}

      {/* VIEW FACULTY DETAILS MODAL */}
      {selectedFaculty && (
        <CredentialModal
          isOpen={Boolean(selectedFaculty)}
          onClose={() => setSelectedFaculty(null)}
          eyebrow={`ID: ${selectedFaculty.employeeId} • FACULTY RECORD`}
          title={selectedFaculty.fullName}
          description={selectedFaculty.designation}
          maxWidth="lg"
          footer={
            <CredentialButton
              variant="primary"
              onClick={() => setSelectedFaculty(null)}
            >
              Close Record
            </CredentialButton>
          }
        >
          <div className="space-y-4">
            <CredentialDetailList>
              <CredentialDetailRow
                label="Department"
                value={selectedFaculty.department}
              />
              <CredentialDetailRow
                label="Institutional Email"
                value={selectedFaculty.email}
                isEmail
                href={selectedFaculty.email}
              />
              <CredentialDetailRow
                label="Contact Phone"
                value={selectedFaculty.phone}
              />
              <CredentialDetailRow
                label="Qualification"
                value={selectedFaculty.qualification}
              />
              <CredentialDetailRow
                label="Specialization"
                value={selectedFaculty.specialization}
              />
              <CredentialDetailRow
                label="Office Location"
                value={selectedFaculty.officeLocation}
              />
              <CredentialDetailRow
                label="Office Hours"
                value={selectedFaculty.officeHours}
              />
              <CredentialDetailRow
                label="Joining Date"
                value={selectedFaculty.joiningDate}
              />
              <CredentialDetailRow
                label="Account Status"
                value={
                  <div className="flex items-center gap-2 justify-end">
                    <span
                      className="w-[7px] h-[7px] rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          selectedFaculty.status === "Active"
                            ? "var(--status-success, #7DAE7A)"
                            : "var(--status-danger, #E27878)",
                      }}
                    />
                    <span>{selectedFaculty.status}</span>
                  </div>
                }
              />
            </CredentialDetailList>

            {selectedFaculty.bio && (
              <div
                className="p-3.5 rounded-[6px] border space-y-1.5"
                style={{
                  backgroundColor: "var(--card-bg, #1D1B18)",
                  borderColor: "var(--card-border, #4a4335)",
                }}
              >
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] block"
                  style={{ color: "var(--text-muted, #8a8272)" }}
                >
                  Biography & Research Overview
                </span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-value, #D8D3C6)" }}>
                  {selectedFaculty.bio}
                </p>
              </div>
            )}
          </div>
        </CredentialModal>
      )}
    </div>
  );
};


