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
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

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
      setDeptForm({ code: "", name: "", headOfDepartment: "", description: "", status: "active" });
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

    const selectedDept = departments.find(
      (d) => d._id === progForm.departmentId || d.name === progForm.department
    );

    if (!selectedDept && !progForm.department) {
      alert("Please select an academic department.");
      return;
    }

    try {
      setIsSubmitting(true);
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
      {/* Top Banner with Switcher */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800 uppercase flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Academic Structure
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Iqra University Chak Shehzad</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Departments & Degree Programs
          </h2>
          <p className="text-xs text-slate-500">
            Define official university academic departments, faculty heads, and undergraduate/graduate degree programs.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab("departments")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "departments"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Building2 className="w-3.5 h-3.5 text-iqra-blue-600" />
            <span>Departments ({departments.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("programs")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeSubTab === "programs"
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Degree Programs ({programs.length})</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. DEPARTMENTS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "departments" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search departments by name, code, head..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setIsDeptModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 self-stretch sm:self-auto transition-transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments
              .filter((d) =>
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.code.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((d) => (
                <div
                  key={d._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                        {d.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{d.name}</h3>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        d.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {d.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Head of Department:</span>
                      <span className="font-semibold text-slate-900">
                        {d.headOfDepartment || "Not Assigned"}
                      </span>
                    </div>
                    {d.description && (
                      <p className="text-slate-500 text-[11px] leading-relaxed pt-1">
                        {d.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. DEGREE PROGRAMS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "programs" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search degree programs by code, title, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setIsProgModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 self-stretch sm:self-auto transition-transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Degree Program</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs
              .filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.department.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((p) => (
                <div
                  key={p._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-iqra-blue-800 border border-blue-200/50">
                        {p.code}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {p.degreeLevel}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-tight">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.department}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-semibold">{p.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Credit Hours:</span>
                      <span className="font-bold text-iqra-blue-700">{p.totalCreditHours} Cr. Hrs</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CREATE DEPARTMENT MODAL */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black font-heading text-slate-900">
                Create Academic Department
              </h3>
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDept} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS, SE, EE, BBA"
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 uppercase font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Computing & Artificial Intelligence"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Head of Department (HoD)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Arshad Mehmood"
                  value={deptForm.headOfDepartment}
                  onChange={(e) => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of department scope..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PROGRAM MODAL */}
      {isProgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black font-heading text-slate-900">
                Register Degree Program
              </h3>
              <button
                onClick={() => setIsProgModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProg} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Program Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BSCS, BSAI, MSCS"
                  value={progForm.code}
                  onChange={(e) => setProgForm({ ...progForm, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 uppercase font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Program Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  value={progForm.name}
                  onChange={(e) => setProgForm({ ...progForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                <select
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree Level *</label>
                  <select
                    value={progForm.degreeLevel}
                    onChange={(e) => setProgForm({ ...progForm, degreeLevel: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Credit Hours</label>
                  <input
                    type="number"
                    value={progForm.totalCreditHours}
                    onChange={(e) =>
                      setProgForm({ ...progForm, totalCreditHours: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={progForm.duration}
                  onChange={(e) => setProgForm({ ...progForm, duration: e.target.value })}
                  placeholder="e.g. 4 Years (8 Semesters)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProgModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Degree Program"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
