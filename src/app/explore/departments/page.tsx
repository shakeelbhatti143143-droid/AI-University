"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Building2,
  GraduationCap,
  Users,
  ArrowRight,
} from "lucide-react";

export default function DepartmentsDirectoryPage() {
  const departments = useQuery(
    api.website.getPublicDepartments,
    isConvexConfigured ? {} : "skip"
  );

  const isLoading = departments === undefined;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Academic Departments" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Academic Faculties</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            University Departments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Explore our specialized academic departments advancing research, instruction, and student mentorship across computer science, artificial intelligence, software engineering, and business.
          </p>
        </div>

        {/* Counter */}
        <div className="px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-center shrink-0 self-start md:self-auto">
          <span className="text-xl sm:text-2xl font-black font-heading text-slate-900 block">
            {departments ? departments.length : "—"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Departments
          </span>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-3 shadow-xs"
            >
              <div className="h-6 w-1/3 rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-2/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && departments.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 max-w-xl mx-auto shadow-xs">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Departments Configured</h3>
          <p className="text-xs text-slate-500">
            Departments configured by administration will appear here dynamically.
          </p>
        </div>
      )}

      {/* Departments Grid */}
      {!isLoading && departments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((d) => (
            <div
              key={d._id}
              className="p-6 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md group hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 font-bold uppercase tracking-wider">
                    {d.code}
                  </span>
                  <span className="text-slate-500 font-medium">Chak Shezad</span>
                </div>

                <h3 className="font-heading font-black text-lg text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
                  {d.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {d.description ||
                    `Dedicated academic faculty offering state-of-the-art educational curricula, advanced laboratories, and research programs.`}
                </p>

                {d.headOfDepartment && (
                  <div className="text-xs text-slate-600 pt-1">
                    <strong className="text-slate-700">Head of Dept:</strong> {d.headOfDepartment}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#0b1f3a]" />
                    <span>{d.programsCount} Programs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#0b1f3a]" />
                    <span>{d.facultyCount} Faculty</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  href={`/explore/departments/${d._id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-[#0b1f3a] bg-[#f0f4fa] hover:bg-[#0b1f3a] hover:text-white active:bg-[#071426] active:scale-[0.98] border border-[#0b1f3a]/20 hover:border-[#0b1f3a] transition-all"
                >
                  <span>View Department Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
