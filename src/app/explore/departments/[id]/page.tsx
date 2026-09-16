"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Building2,
  GraduationCap,
  Users,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function DepartmentDetailPage() {
  const params = useParams();
  const departmentId = params.id as Id<"departments">;

  const data = useQuery(
    api.website.getPublicDepartmentById,
    isConvexConfigured && departmentId ? { id: departmentId } : "skip"
  );

  const isLoading = data === undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Departments", href: "/explore/departments" }, { label: "Loading..." }]} />
        <div className="p-12 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-6 shadow-xs">
          <div className="h-6 w-1/4 rounded bg-slate-100" />
          <div className="h-10 w-2/3 rounded bg-slate-200" />
          <div className="h-24 w-full rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!data || !data.department) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Departments", href: "/explore/departments" }, { label: "Department Not Found" }]} />
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Department Not Found</h2>
          <p className="text-xs text-slate-500">
            This academic department does not exist or has been made inactive.
          </p>
          <Link
            href="/explore/departments"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#f0f4fa] text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white active:bg-[#071426] border border-[#0b1f3a]/20 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Departments</span>
          </Link>
        </div>
      </div>
    );
  }

  const { department, programs, faculty } = data;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Departments", href: "/explore/departments" },
          { label: department.name },
        ]}
      />

      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 uppercase tracking-wider">
            Academic Department
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
            {department.code}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
          {department.name}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          {department.description ||
            `Committed to pioneering research, high-quality instruction, and producing skilled leaders across computing and applied sciences.`}
        </p>

        {department.headOfDepartment && (
          <div className="pt-2 text-xs text-slate-600">
            <strong className="text-slate-700">Head of Department:</strong> {department.headOfDepartment}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#0b1f3a]" />
            <span>{programs.length} Degree Programs Available</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0b1f3a]" />
            <span>{faculty.length} Faculty Members</span>
          </div>
        </div>
      </div>

      {/* Available Programs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#0b1f3a]" />
            <span>Available Degree Programs ({programs.length})</span>
          </h2>
        </div>

        {programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((p) => (
              <div
                key={p._id}
                className="p-5 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 font-bold">
                      {p.degreeLevel}
                    </span>
                    <span className="font-mono text-slate-500">{p.code}</span>
                  </div>
                  <h3 className="font-heading font-black text-base text-slate-900">{p.name}</h3>
                  <div className="text-xs text-slate-500">Duration: {p.duration}</div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/explore/programs/${p._id}`}
                    className="text-xs font-semibold text-[#0b1f3a] hover:text-[#122b4e]"
                  >
                    View Details
                  </Link>
                  <Link
                    href="/apply"
                    className="text-xs font-bold text-slate-900 hover:text-[#0b1f3a] flex items-center gap-1"
                  >
                    Apply <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            No degree programs currently registered under this department.
          </div>
        )}
      </section>

      {/* Faculty Members in this Department */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0b1f3a]" />
            <span>Department Faculty ({faculty.length})</span>
          </h2>
        </div>

        {faculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {faculty.map((f) => (
              <div
                key={f._id}
                className="p-5 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {f.profilePhoto ? (
                    <img
                      src={f.profilePhoto}
                      alt={f.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b1f3a] to-[#122b4e] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {f.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-heading font-black text-sm text-slate-900 truncate">
                      {f.fullName}
                    </h4>
                    <p className="text-xs text-[#0b1f3a] font-medium truncate">{f.designation}</p>
                    <p className="text-[11px] text-slate-500 truncate">{f.specialization}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Link
                    href={`/explore/faculty/${f._id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#0b1f3a] bg-[#f0f4fa] hover:bg-[#0b1f3a] hover:text-white active:bg-[#071426] border border-[#0b1f3a]/20 transition-all"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            No public faculty profiles currently associated with this department.
          </div>
        )}
      </section>
    </div>
  );
}
