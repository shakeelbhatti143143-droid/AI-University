"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Users,
  Search,
  Mail,
  Award,
  ArrowRight,
  MapPin,
  GraduationCap,
} from "lucide-react";

export default function FacultyDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const facultyList = useQuery(
    api.website.getPublicFacultyList,
    isConvexConfigured
      ? {
          department: selectedDepartment === "All" ? undefined : selectedDepartment,
          search: searchQuery.trim().length > 0 ? searchQuery.trim() : undefined,
        }
      : "skip"
  );

  const departments = useQuery(api.website.getPublicDepartments, isConvexConfigured ? {} : "skip");

  const isLoading = facultyList === undefined;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Faculty Directory" }]} />

      {/* Page Title & Search Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Academic Excellence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            Meet Our Distinguished Faculty
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Learn from esteemed professors, published researchers, and seasoned industry practitioners shaping the future of computing, artificial intelligence, and leadership.
          </p>
        </div>

        {/* Live Count Pill */}
        <div className="px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-center shrink-0 self-start md:self-auto">
          <span className="text-xl sm:text-2xl font-black font-heading text-slate-900 block">
            {facultyList ? facultyList.length : "—"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Public Profiles
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by faculty name, designation, or specialization..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 shadow-xs transition-all"
          />
        </div>

        {/* Department Filter Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">
            Department:
          </span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 shadow-xs transition-all"
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
              className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4 shadow-xs"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-100" />
              <div className="h-5 w-2/3 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-100" />
              <div className="h-3 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && facultyList.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 max-w-xl mx-auto shadow-xs">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Faculty Members Found</h3>
          <p className="text-xs text-slate-500">
            {searchQuery || selectedDepartment !== "All"
              ? "No faculty profiles match your filter criteria. Try clearing the search query or selecting All Departments."
              : "There are currently no public faculty profiles published in the system."}
          </p>
          {(searchQuery || selectedDepartment !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDepartment("All");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#f0f4fa] hover:bg-[#0b1f3a] text-[#0b1f3a] hover:text-white active:bg-[#071426] border border-[#0b1f3a]/20 cursor-pointer transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Faculty Cards Grid */}
      {!isLoading && facultyList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyList.map((f) => (
            <div
              key={f._id}
              className="p-6 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md group hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  {f.profilePhoto ? (
                    <img
                      src={f.profilePhoto}
                      alt={f.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 group-hover:border-[#0b1f3a] transition-colors shrink-0 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0b1f3a] to-[#122b4e] text-white flex items-center justify-center font-heading font-black text-xl shrink-0 shadow-xs">
                      {f.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading font-black text-base text-slate-900 group-hover:text-[#0b1f3a] transition-colors truncate">
                      {f.fullName}
                    </h3>
                    <p className="text-xs font-bold text-[#0b1f3a] truncate">
                      {f.designation}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {f.department}
                    </p>
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  {f.specialization && (
                    <div className="flex items-start gap-2">
                      <Award className="w-3.5 h-3.5 text-[#0b1f3a] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">
                        <strong className="text-slate-700">Specialization:</strong>{" "}
                        {f.specialization}
                      </span>
                    </div>
                  )}

                  {f.qualification && (
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">
                        <strong className="text-slate-700">Qualification:</strong>{" "}
                        {f.qualification}
                      </span>
                    </div>
                  )}

                  {f.email && (
                    <div className="flex items-center gap-2 text-slate-500 truncate">
                      <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{f.email}</span>
                    </div>
                  )}

                  {f.officeLocation && (
                    <div className="flex items-center gap-2 text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span className="truncate">{f.officeLocation}</span>
                    </div>
                  )}
                </div>

                {/* Short Bio preview */}
                {f.bio && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {f.bio}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  href={`/explore/faculty/${f._id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-[#0b1f3a] bg-[#f0f4fa] hover:bg-[#0b1f3a] hover:text-white active:bg-[#071426] active:scale-[0.98] border border-[#0b1f3a]/20 hover:border-[#0b1f3a] transition-all duration-200"
                >
                  <span>View Faculty Profile</span>
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
