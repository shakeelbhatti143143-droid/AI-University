"use client";

import React, { useState } from "react";
import {
  Building2,
  GraduationCap,
  Plus,
  Search,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  X,
  Layers,
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

interface Department {
  _id: string;
  code: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
  status: "active" | "inactive";
  createdAt: number;
}

interface AcademicProgram {
  _id: string;
  code: string;
  name: string;
  department: string;
  degreeLevel: "Undergraduate" | "Graduate" | "Postgraduate";
  duration: string;
  totalCreditHours: number;
  description?: string;
  status: "active" | "inactive";
  createdAt: number;
}

interface AdminDepartmentsProgramsSectionProps {
  initialTab?: "departments" | "programs";
  departments: Department[];
  programs: AcademicProgram[];
  onCreateDepartment: (data: any) => Promise<void>;
  onCreateProgram: (data: any) => Promise<void>;
}

export const AdminDepartmentsProgramsSection: React.FC<AdminDepartmentsProgramsSectionProps> = ({
  initialTab = "departments",
  departments,
  programs,
  onCreateDepartment,
  onCreateProgram,
}) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<"departments" | "programs">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Department Form
  const [deptForm, setDeptForm] = useState({
    code: "",
    name: "",
    headOfDepartment: "",
    description: "",
    status: "active" as const,
  });

  // Program Form
  const [progForm, setProgForm] = useState({
    code: "",
    name: "",
    department: departments[0]?.name || "",
    departmentId: departments[0]?._id || "",
    degreeLevel: "Undergraduate" as const,
    duration: "4 Years (8 Semesters)",
    totalCreditHours: 134,
    description: "",
    status: "active" as const,
  });

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.code || !deptForm.name) {
      alert("Please provide department code and name.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateDepartment({
        ...deptForm,
        adminName: user?.name || "Administrator",
        adminEmail: user?.email || "admin@isb.iqra.edu.pk",
      });
      setIsDeptModalOpen(false);
      setDeptForm({
        code: "",
        name: "",
        headOfDepartment: "",
        description: "",
        status: "active",
      });
    } catch (err: any) {
      alert(err.message || "Failed to create department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progForm.code || !progForm.name) {
      alert("Please provide program code and name.");
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedDept = departments.find(
        (d) => d._id === progForm.departmentId || d.name === progForm.department
      );

      await onCreateProgram({
        ...progForm,
        department: selectedDept ? selectedDept.name : progForm.department,
        departmentId: selectedDept ? selectedDept._id : progForm.departmentId,
        adminName: user?.name || "Administrator",
        adminEmail: user?.email || "admin@isb.iqra.edu.pk",
      });
      setIsProgModalOpen(false);
      setProgForm({
        code: "",
        name: "",
        department: departments[0]?.name || "",
        departmentId: departments[0]?._id || "",
        degreeLevel: "Undergraduate",
        duration: "4 Years (8 Semesters)",
        totalCreditHours: 134,
        description: "",
        status: "active",
      });
    } catch (err: any) {
      alert(err.message || "Failed to create degree program.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Subtab Switcher */}
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
              Academic Structure & Units
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
            Departments & Degree Programs
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            Define academic departments, assign faculty heads, and manage degree program curricula.
          </p>
        </div>

        {/* Subtab Switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-[6px] border self-start md:self-auto"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
          }}
        >
          <button
            onClick={() => {
              setActiveSubTab("departments");
              setSearchQuery("");
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-colors flex items-center gap-1.5",
              activeSubTab === "departments"
                ? "border border-[#4a4335] text-[#F2EEE4] bg-white/5"
                : "border-transparent text-[#8a8272] hover:text-[#F2EEE4]"
            )}
          >
            <Building2 className="w-3.5 h-3.5 text-[#8a8272]" />
            <span>Departments ({departments.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab("programs");
              setSearchQuery("");
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-colors flex items-center gap-1.5",
              activeSubTab === "programs"
                ? "border border-[#4a4335] text-[#F2EEE4] bg-white/5"
                : "border-transparent text-[#8a8272] hover:text-[#F2EEE4]"
            )}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#8a8272]" />
            <span>Degree Programs ({programs.length})</span>
          </button>
        </div>
      </div>

      {/* 1. DEPARTMENTS VIEW */}
      {activeSubTab === "departments" && (
        <div className="space-y-4">
          <CredentialFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search departments by name, code, head..."
          >
            <button
              onClick={() => setIsDeptModalOpen(true)}
              className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98]"
              style={{
                borderColor: "var(--accent-gold, #C9A25B)",
                color: "var(--accent-gold, #C9A25B)",
                backgroundColor: "transparent",
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Department</span>
            </button>
          </CredentialFilterBar>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {departments
              .filter(
                (d) =>
                  d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.code.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((d) => {
                const programCount = programs.filter(
                  (p) => p.department === d.name || p.code === d.code
                ).length;

                return (
                  <CredentialCard key={d._id}>
                    <CredentialHeader
                      eyebrow="ACADEMIC DEPARTMENT"
                      referenceId={d.code}
                    />

                    <CredentialTitle
                      title={d.name}
                      subheading={d.headOfDepartment ? `Head of Dept: ${d.headOfDepartment}` : "HOD: Pending Assignment"}
                      hasDivider
                    />

                    <CredentialDetailList className="flex-1">
                      <CredentialDetailRow
                        label="Head of Department"
                        value={d.headOfDepartment || "Not Assigned"}
                      />
                      <CredentialDetailRow
                        label="Degree Programs"
                        value={`${programCount} Programs Offered`}
                      />
                      {d.description && (
                        <CredentialDetailRow
                          label="Overview"
                          value={d.description}
                        />
                      )}
                    </CredentialDetailList>

                    <CredentialFooter
                      status={{
                        label: d.status === "active" ? "Active" : "Inactive",
                        state: d.status === "active" ? "success" : "danger",
                      }}
                      primaryAction={{
                        label: "View Programs",
                        onClick: () => {
                          setActiveSubTab("programs");
                          setSearchQuery(d.code);
                        },
                      }}
                    />
                  </CredentialCard>
                );
              })}
          </div>
        </div>
      )}

      {/* 2. DEGREE PROGRAMS VIEW */}
      {activeSubTab === "programs" && (
        <div className="space-y-4">
          <CredentialFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search degree programs by code, title, department..."
          >
            <button
              onClick={() => setIsProgModalOpen(true)}
              className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98]"
              style={{
                borderColor: "var(--accent-gold, #C9A25B)",
                color: "var(--accent-gold, #C9A25B)",
                backgroundColor: "transparent",
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Degree Program</span>
            </button>
          </CredentialFilterBar>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs
              .filter(
                (p) =>
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.department.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((p) => (
                <CredentialCard key={p._id}>
                  <CredentialHeader
                    eyebrow={p.department}
                    referenceId={p.code}
                  />

                  <CredentialTitle
                    title={p.name}
                    subheading={`${p.degreeLevel} • ${p.duration}`}
                    hasDivider
                  />

                  <CredentialDetailList className="flex-1">
                    <CredentialDetailRow
                      label="Degree Level"
                      value={p.degreeLevel}
                    />
                    <CredentialDetailRow
                      label="Total Credit Hours"
                      value={`${p.totalCreditHours} Cr. Hrs`}
                    />
                    <CredentialDetailRow
                      label="Academic Department"
                      value={p.department}
                    />
                    <CredentialDetailRow
                      label="Program Duration"
                      value={p.duration}
                    />
                  </CredentialDetailList>

                  <CredentialFooter
                    status={{
                      label: p.status === "active" ? "Active" : "Inactive",
                      state: p.status === "active" ? "success" : "danger",
                    }}
                    primaryAction={{
                      label: "Curriculum Details",
                      onClick: () => {
                        alert(`Curriculum details for ${p.name} (${p.code})`);
                      },
                    }}
                  />
                </CredentialCard>
              ))}
          </div>
        </div>
      )}

      {/* CREATE DEPARTMENT MODAL */}
      <CredentialModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        eyebrow="ACADEMIC STRUCTURE"
        title="Create Academic Department"
        description="Establish a new university department and designate academic leadership."
        maxWidth="lg"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsDeptModalOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              disabled={isSubmitting}
              onClick={handleCreateDept}
            >
              {isSubmitting ? "Creating..." : "Save Department"}
            </CredentialButton>
          </>
        }
      >
        <form onSubmit={handleCreateDept} className="space-y-4">
          <CredentialInput
            label="Department Code *"
            placeholder="e.g. CS, SE, EE, BBA"
            value={deptForm.code}
            onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
            required
          />

          <CredentialInput
            label="Department Full Name *"
            placeholder="e.g. Department of Computing & Artificial Intelligence"
            value={deptForm.name}
            onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
            required
          />

          <CredentialInput
            label="Head of Department (HoD)"
            placeholder="e.g. Dr. Arshad Mehmood"
            value={deptForm.headOfDepartment}
            onChange={(e) => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
          />

          <div className="space-y-1.5">
            <label
              className="block text-[12px] font-medium leading-none select-none"
              style={{ color: "var(--text-muted, #8a8272)" }}
            >
              Description & Scope
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of department scope..."
              value={deptForm.description}
              onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
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

      {/* CREATE PROGRAM MODAL */}
      <CredentialModal
        isOpen={isProgModalOpen}
        onClose={() => setIsProgModalOpen(false)}
        eyebrow="ACADEMIC CATALOG"
        title="Register Degree Program"
        description="Define a new academic curriculum program with credit requirements."
        maxWidth="lg"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsProgModalOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              disabled={isSubmitting}
              onClick={handleCreateProg}
            >
              {isSubmitting ? "Creating..." : "Save Degree Program"}
            </CredentialButton>
          </>
        }
      >
        <form onSubmit={handleCreateProg} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CredentialInput
              label="Program Code *"
              placeholder="e.g. BSCS, BSAI, MSCS"
              value={progForm.code}
              onChange={(e) => setProgForm({ ...progForm, code: e.target.value.toUpperCase() })}
              required
            />
            <CredentialSelect
              label="Department *"
              value={progForm.departmentId || progForm.department}
              onChange={(e) => {
                const val = e.target.value;
                const found = departments.find((d) => d._id === val || d.name === val);
                setProgForm({
                  ...progForm,
                  departmentId: found ? found._id : val,
                  department: found ? found.name : val,
                });
              }}
            >
              <option value="">-- Select Department --</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </CredentialSelect>
          </div>

          <CredentialInput
            label="Program Name *"
            placeholder="e.g. Bachelor of Science in Computer Science"
            value={progForm.name}
            onChange={(e) => setProgForm({ ...progForm, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CredentialSelect
              label="Degree Level *"
              value={progForm.degreeLevel}
              onChange={(e) => setProgForm({ ...progForm, degreeLevel: e.target.value as any })}
            >
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </CredentialSelect>

            <CredentialInput
              label="Total Credit Hours"
              type="number"
              value={progForm.totalCreditHours}
              onChange={(e) =>
                setProgForm({ ...progForm, totalCreditHours: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <CredentialInput
            label="Duration"
            placeholder="e.g. 4 Years (8 Semesters)"
            value={progForm.duration}
            onChange={(e) => setProgForm({ ...progForm, duration: e.target.value })}
          />
        </form>
      </CredentialModal>
    </div>
  );
};


