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
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  DollarSign,
} from "lucide-react";

export default function ProgramDetailPage() {
  const params = useParams();
  const programId = params.id as Id<"academicPrograms">;

  const data = useQuery(
    api.website.getPublicProgramById,
    isConvexConfigured && programId ? { id: programId } : "skip"
  );

  const isLoading = data === undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Programs", href: "/explore/programs" }, { label: "Loading..." }]} />
        <div className="p-12 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-6 shadow-xs">
          <div className="h-6 w-1/4 rounded bg-slate-100" />
          <div className="h-10 w-2/3 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-24 w-full rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!data || !data.program) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Programs", href: "/explore/programs" }, { label: "Program Not Found" }]} />
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Program Not Found</h2>
          <p className="text-xs text-slate-500">
            This degree program is currently unavailable or inactive.
          </p>
          <Link
            href="/explore/programs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#f0f4fa] text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white active:bg-[#071426] border border-[#0b1f3a]/20 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Programs Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const { program, department, courses, fees } = data;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Programs", href: "/explore/programs" },
          { label: program.name },
        ]}
      />

      {/* Program Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 uppercase tracking-wider">
            {program.degreeLevel} Program
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
            {program.code}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {program.department}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
          {program.name}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          {program.description ||
            `A comprehensive curriculum offered by the ${program.department} designed to produce industry-ready graduates and innovative researchers.`}
        </p>

        {/* Quick Highlights Bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
            <span className="text-slate-900 font-bold">{program.duration}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Credit Hours</span>
            <span className="text-slate-900 font-bold">{program.totalCreditHours} Cr. Hrs</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Accreditation</span>
            <span className="text-emerald-700 font-bold">HEC Recognized</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus</span>
            <span className="text-slate-900 font-bold">Chak Shezad, Islamabad</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Curriculum & Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Coursework & Degree Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses in Curriculum */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0b1f3a]" />
                <span>Curriculum & Course Structure</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {courses ? `${courses.length} Courses Cataloged` : "Catalog Loading"}
              </span>
            </div>

            {courses && courses.length > 0 ? (
              <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 border border-slate-200 overflow-hidden">
                {courses.map((c) => (
                  <div key={c._id} className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{c.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {c.code} • {c.creditHours} Credit Hours • Semester {c.semester}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 shrink-0">
                      Sem {c.semester}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Detailed semester syllabus for {program.code} is available from the academic department office.
              </div>
            )}
          </div>

          {/* Fee Information if configured */}
          {fees && fees.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Program Fee Structure</span>
                </h2>
                <Link
                  href="/explore/fees"
                  className="text-xs text-[#0b1f3a] hover:text-[#122b4e] font-semibold transition-colors"
                >
                  View All Fees →
                </Link>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 border border-slate-200 overflow-hidden">
                {fees.map((fee) => (
                  <div key={fee._id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{fee.feeType}</div>
                      <div className="text-[10px] text-slate-500">
                        {fee.semester} • Effective: {fee.effectiveDate}
                      </div>
                    </div>
                    <div className="text-sm font-mono font-bold text-emerald-700">
                      {fee.currency} {fee.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Admission CTA & Department Lockup */}
        <div className="space-y-6">
          {/* Apply Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 via-white to-slate-50 border border-slate-200 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0b1f3a] uppercase tracking-wider block">
                Session 2026 Admissions
              </span>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Ready to Enroll in {program.code}?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit your credentials and educational background online to secure your seat.
              </p>
            </div>

            <Link
              href="/apply"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] shadow-md shadow-[#0b1f3a]/20 transition-all"
            >
              <span>Apply for this Program</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Department Information */}
          {department && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Offering Department
              </h3>
              <div className="space-y-1">
                <div className="font-heading font-bold text-sm text-slate-900">
                  {department.name}
                </div>
                <div className="text-xs text-slate-500">
                  Head of Department: {department.headOfDepartment || "Department Chair"}
                </div>
              </div>
              <Link
                href={`/explore/departments/${department._id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b1f3a] hover:text-[#122b4e] pt-2 transition-colors"
              >
                <span>View Department Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
