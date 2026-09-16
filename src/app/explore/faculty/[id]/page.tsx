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
  Users,
  Mail,
  Award,
  BookOpen,
  MapPin,
  Clock,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";

export default function FacultyProfileDetailPage() {
  const params = useParams();
  const facultyId = params.id as Id<"faculty">;

  const faculty = useQuery(
    api.website.getPublicFacultyById,
    isConvexConfigured && facultyId ? { id: facultyId } : "skip"
  );

  const isLoading = faculty === undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Faculty", href: "/explore/faculty" }, { label: "Loading..." }]} />
        <div className="p-12 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-6 shadow-xs">
          <div className="w-24 h-24 rounded-2xl bg-slate-100" />
          <div className="h-7 w-1/3 rounded bg-slate-200" />
          <div className="h-4 w-1/4 rounded bg-slate-100" />
          <div className="h-24 w-full rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Faculty", href: "/explore/faculty" }, { label: "Profile Not Found" }]} />
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Faculty Profile Not Found</h2>
          <p className="text-xs text-slate-500">
            This faculty profile is either inactive or does not exist.
          </p>
          <Link
            href="/explore/faculty"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#f0f4fa] text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white active:bg-[#071426] border border-[#0b1f3a]/20 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Faculty Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Faculty", href: "/explore/faculty" },
          { label: faculty.fullName },
        ]}
      />

      {/* Header Profile Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start gap-6 sm:gap-8">
        {faculty.profilePhoto ? (
          <img
            src={faculty.profilePhoto}
            alt={faculty.fullName}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
          />
        ) : (
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-[#0b1f3a] to-[#122b4e] text-white flex items-center justify-center font-heading font-black text-3xl shadow-sm shrink-0">
            {faculty.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
        )}

        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20">
              {faculty.designation}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {faculty.department}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            {faculty.fullName}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
            {faculty.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{faculty.email}</span>
              </div>
            )}
            {faculty.officeLocation && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0b1f3a] shrink-0" />
                <span className="truncate">{faculty.officeLocation}</span>
              </div>
            )}
            {faculty.officeHours && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="truncate">Office Hours: {faculty.officeHours}</span>
              </div>
            )}
            {faculty.qualification && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#0b1f3a] shrink-0" />
                <span className="truncate">{faculty.qualification}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Biography & Assigned Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Biography & Specialization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biography */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0b1f3a]" />
              <span>Academic Biography</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {faculty.bio ||
                `${faculty.fullName} serves as ${faculty.designation} in the ${faculty.department} at Iqra University Chak Shezad Campus Islamabad. With distinguished expertise in ${faculty.specialization || "contemporary computing"}, they are committed to academic distinction and inquiry-driven education.`}
            </p>
          </div>

          {/* Research & Specialization */}
          {faculty.specialization && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Primary Fields of Specialization
              </h3>
              <div className="p-4 rounded-xl bg-[#f0f4fa] border border-[#0b1f3a]/20 text-xs text-slate-800 font-medium leading-relaxed">
                {faculty.specialization}
              </div>
            </div>
          )}

          {/* Assigned Teaching Courses */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0b1f3a]" />
                <span>Assigned Teaching Courses</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                {faculty.courses ? `${faculty.courses.length} Active Courses` : "0 Courses"}
              </span>
            </div>

            {faculty.courses && faculty.courses.length > 0 ? (
              <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 border border-slate-200 overflow-hidden">
                {faculty.courses.map((course) => (
                  <div key={course._id} className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {course.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {course.code} • {course.creditHours} Credit Hours • Semester {course.semester}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                No currently assigned active lecture courses on the public catalog.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Office & Consultation Details */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
              Office & Consultation
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Campus Venue
                </span>
                <span className="text-slate-900 font-medium">
                  {faculty.officeLocation || "Computing Department Building, 2nd Floor"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Consultation Schedule
                </span>
                <span className="text-slate-900 font-medium">
                  {faculty.officeHours || "By Prior Appointment / Check SIS Timetable"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Official Communication
                </span>
                <a
                  href={`mailto:${faculty.email}`}
                  className="text-[#0b1f3a] hover:underline transition-colors truncate block font-medium"
                >
                  {faculty.email}
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/apply"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] transition-all shadow-xs"
              >
                <span>Study Under This Faculty</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
