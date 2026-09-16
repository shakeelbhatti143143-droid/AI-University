"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  DollarSign,
  Search,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function FeeStructurePage() {
  const [degreeLevelFilter, setDegreeLevelFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fees = useQuery(
    api.website.getPublicFeeStructures,
    isConvexConfigured
      ? {
          degreeLevel: degreeLevelFilter === "All" ? undefined : degreeLevelFilter,
          programName: searchQuery.trim().length > 0 ? searchQuery.trim() : undefined,
        }
      : "skip"
  );

  const isLoading = fees === undefined;

  // Group fees by program
  const groupedFees = fees
    ? fees.reduce((acc, fee) => {
        const key = `${fee.programName} (${fee.degreeLevel})`;
        if (!acc[key]) {
          acc[key] = {
            programName: fee.programName,
            degreeLevel: fee.degreeLevel,
            items: [],
            total: 0,
            currency: fee.currency,
          };
        }
        acc[key].items.push(fee);
        acc[key].total += fee.amount;
        return acc;
      }, {} as Record<string, { programName: string; degreeLevel: string; items: any[]; total: number; currency: string }>)
    : {};

  const groups = Object.values(groupedFees);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Fee Structure" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Official Transparent Pricing</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            Tuition & Fee Structure
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Review transparent academic fee schedules and institutional dues configured for each degree program at Chak Shezad Campus Islamabad.
          </p>
        </div>

        {/* Total Programs Covered */}
        <div className="px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-center shrink-0 self-start md:self-auto">
          <span className="text-xl sm:text-2xl font-black font-heading text-slate-900 block">
            {groups.length}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Programs Covered
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fees by program name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 shadow-xs transition-all"
          />
        </div>

        {/* Degree Level Tabs */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
          {["All", "Undergraduate", "Graduate", "Postgraduate"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDegreeLevelFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                degreeLevelFilter === level
                  ? "bg-[#0b1f3a] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4 shadow-xs"
            >
              <div className="h-6 w-1/3 rounded bg-slate-100" />
              <div className="h-16 w-full rounded bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && groups.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Public Fee Schedules Available</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {searchQuery || degreeLevelFilter !== "All"
              ? "No fee schedules match your search filters. Try clearing your search parameters."
              : "Official public fee structures for this academic session are currently being finalized by the university finance administration. Please contact the admissions office for detailed guidance."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/explore/contact"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#f0f4fa] hover:bg-[#0b1f3a] text-[#0b1f3a] hover:text-white active:bg-[#071426] border border-[#0b1f3a]/20 transition-all"
            >
              Contact Admissions Office
            </Link>
            <Link
              href="/apply"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] shadow-xs transition-all"
            >
              Apply Online
            </Link>
          </div>
        </div>
      )}

      {/* Grouped Program Fee Tables */}
      {!isLoading && groups.length > 0 && (
        <div className="space-y-6">
          {groups.map((group) => (
            <div
              key={`${group.programName}-${group.degreeLevel}`}
              className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs"
            >
              {/* Table Header */}
              <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 uppercase tracking-wider">
                      {group.degreeLevel}
                    </span>
                    <span className="text-xs text-slate-500">Chak Shezad Campus</span>
                  </div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    {group.programName}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Estimated Semester Total
                  </span>
                  <span className="text-base sm:text-xl font-mono font-black text-emerald-700">
                    {group.currency} {group.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Fee Type / Dues</th>
                      <th className="px-5 py-3">Semester Schedule</th>
                      <th className="px-5 py-3">Effective Date</th>
                      <th className="px-5 py-3">Notes & Description</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {group.items.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.feeType}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{item.semester}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                          {item.effectiveDate}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                          {item.description || "Standard tuition and institutional facility dues."}
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900 text-right">
                          {item.currency} {item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50/60 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Fee structures are subject to academic session adjustments approved by university authorities.
                </span>
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b1f3a] hover:text-[#122b4e] shrink-0 ml-3 transition-colors"
                >
                  <span>Apply Now</span>
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
