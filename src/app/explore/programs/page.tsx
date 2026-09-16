"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  GraduationCap,
  Search,
  ArrowRight,
} from "lucide-react";

export default function DegreeProgramsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const programs = useQuery(
    api.website.getPublicAcademicPrograms,
    isConvexConfigured
      ? {
          degreeLevel: degreeFilter === "All" ? undefined : degreeFilter,
          department: departmentFilter === "All" ? undefined : departmentFilter,
          search: searchQuery.trim().length > 0 ? searchQuery.trim() : undefined,
        }
      : "skip"
  );

  const departments = useQuery(api.website.getPublicDepartments, isConvexConfigured ? {} : "skip");

  const isLoading = programs === undefined;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Degree Programs" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Academic Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            Academic Degree Programs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Explore cutting-edge undergraduate, graduate, and doctoral degree programs calibrated for the age of artificial intelligence and digital transformation.
          </p>
        </div>

        {/* Counter */}
        <div className="px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-center shrink-0 self-start md:self-auto">
          <span className="text-xl sm:text-2xl font-black font-heading text-slate-900 block">
            {programs ? programs.length : "—"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Available Programs
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs by title, code, or department..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 shadow-xs transition-all"
          />
        </div>

        {/* Level & Dept Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Degree Level Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            {["All", "Undergraduate", "Graduate", "Postgraduate"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDegreeFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  degreeFilter === level
                    ? "bg-[#0b1f3a] text-white shadow-xs"
                    : "text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Department dropdown */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 shadow-xs transition-all"
          >
            <option value="All">All Departments</option>
            {departments?.map((d) => (
              <option key={d._id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-3 shadow-xs"
            >
              <div className="h-4 w-1/3 rounded bg-slate-100" />
              <div className="h-6 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && programs.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 max-w-xl mx-auto shadow-xs">
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Programs Available</h3>
          <p className="text-xs text-slate-500">
            {searchQuery || degreeFilter !== "All" || departmentFilter !== "All"
              ? "No degree programs match your filter parameters. Try clearing your search."
              : "There are currently no active degree programs published in the academic system."}
          </p>
          {(searchQuery || degreeFilter !== "All" || departmentFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setDegreeFilter("All");
                setDepartmentFilter("All");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#f0f4fa] text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white active:bg-[#071426] border border-[#0b1f3a]/20 cursor-pointer transition-all"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Programs Grid */}
      {!isLoading && programs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
            <div
              key={p._id}
              className="p-6 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md group hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 font-bold uppercase tracking-wider">
                    {p.degreeLevel}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">{p.code}</span>
                </div>

                <h3 className="font-heading font-black text-lg text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
                  {p.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {p.description ||
                    `Comprehensive degree program offered by the ${p.department}. Rigorous academic coursework and practical computing laboratories.`}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">
                      {p.department}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-medium text-slate-800">{p.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Credits:</span>
                    <span className="font-medium text-slate-800">{p.totalCreditHours} Cr. Hrs</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/explore/programs/${p._id}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white active:bg-[#071426] bg-[#f0f4fa] border border-[#0b1f3a]/20 transition-all flex items-center gap-1"
                >
                  <span>Program Details</span>
                </Link>

                <Link
                  href="/apply"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] transition-all flex items-center gap-1 shadow-xs"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
