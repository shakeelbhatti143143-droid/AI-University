"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import { ScholarshipsSection } from "@/components/explore/ScholarshipsSection";
import { Award, Building2, ChevronRight, GraduationCap, ArrowRight } from "lucide-react";

export default function ScholarshipsPage() {
  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Scholarships & Merit Awards" }]} />

      {/* Institutional Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#071322] via-[#0b1f3a] to-[#0e274a] text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/15 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Academic Financial Aid</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white">
            Merit-Based Scholarships & Academic Honor Awards
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
            Iqra University awards substantial tuition fee reductions to eligible students based strictly on official
            published semester CGPAs. Explore the criteria, verify your status, and calculate your tuition support tier.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#scholarships"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#071322] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/explore/fees"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <span>University Fee Structure</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Scholarships Content Section */}
      <ScholarshipsSection id="scholarships" className="py-0 px-0 sm:px-0 lg:px-0" />
    </div>
  );
}
