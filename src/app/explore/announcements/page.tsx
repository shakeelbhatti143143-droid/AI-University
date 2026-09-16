"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Megaphone,
  Bell,
  Sparkles,
  Search,
  ArrowRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UniversityAnnouncementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAnnouncement, setActiveAnnouncement] = useState<any | null>(null);

  // STRICT PUBLIC QUERY: returns ONLY Admin-created, Published, Public announcements
  const publicAnnouncements = useQuery(
    api.academicManagement.getPublicAnnouncements,
    isConvexConfigured ? {} : "skip"
  );

  const featuredAnnouncements = useQuery(
    api.academicManagement.getPublicAnnouncements,
    isConvexConfigured ? { isFeatured: true, limit: 1 } : "skip"
  );

  const featured = featuredAnnouncements && featuredAnnouncements.length > 0 ? featuredAnnouncements[0] : null;

  const categories = ["All", "University", "Department", "Exam"];

  // Filter announcements
  const filtered = (publicAnnouncements || []).filter((a) => {
    if (selectedCategory !== "All" && a.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchMsg = a.message.toLowerCase().includes(q);
      const matchSender = a.sender.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchSender) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "University Announcements" }]} />

      {/* Hero Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <Megaphone className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Official University Administration Notices</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
            University Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Official institutional directives, admissions alerts, semester schedules, and university-wide bulletins published by the AI University administration.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="p-4 px-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {publicAnnouncements ? publicAnnouncements.length : "—"}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Public Bulletins
            </div>
          </div>
        </div>
      </div>

      {/* Featured Announcement Highlight */}
      {featured && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Featured Bulletin</span>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20">
                  Featured
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    featured.priority === "Urgent"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20"
                  )}
                >
                  {featured.priority} Priority
                </span>
                <span className="text-xs text-slate-500 font-mono">{featured.publishDate}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                {featured.title}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                {featured.message}
              </p>

              <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                <span>Issued by: <strong className="text-slate-700">{featured.sender}</strong></span>
                <span>•</span>
                <span>Target: {featured.targetAudience}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveAnnouncement(featured)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] transition-all shadow-md shadow-[#0b1f3a]/20 shrink-0 cursor-pointer"
            >
              <span>Read Notice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                selectedCategory === cat
                  ? "bg-[#0b1f3a] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-[#f0f4fa] hover:text-[#0b1f3a]"
              )}
            >
              {cat} Notices
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bulletins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Official University Notices ({filtered.length})</span>
          </div>
          <span className="text-xs text-slate-500">
            Showing official public administration communications
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((anc) => (
              <div
                key={anc._id}
                className="p-6 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          anc.priority === "Urgent"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : anc.priority === "High"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20"
                        )}
                      >
                        {anc.priority}
                      </span>
                      <span className="text-slate-500 font-medium">{anc.category}</span>
                      {anc.isFeatured && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 uppercase">
                          Featured
                        </span>
                      )}
                    </div>

                    <span className="text-slate-500 font-mono text-[11px]">{anc.publishDate}</span>
                  </div>

                  <h3 className="text-lg font-black font-heading text-slate-900 leading-snug">
                    {anc.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {anc.message}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[220px]">
                    Issued by: <strong className="text-slate-700">{anc.sender}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveAnnouncement(anc)}
                    className="text-xs font-bold text-[#0b1f3a] hover:text-[#122b4e] active:text-[#071426] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Full Notice</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#f0f4fa] flex items-center justify-center mx-auto text-[#0b1f3a]">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Public Announcements Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no active public announcements published for this category.
            </p>
          </div>
        )}
      </section>

      {/* FULL NOTICE MODAL */}
      {activeAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    activeAnnouncement.priority === "Urgent"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20"
                  )}
                >
                  {activeAnnouncement.priority} Priority
                </span>
                <span className="text-xs text-slate-500">
                  {activeAnnouncement.category} Notice
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveAnnouncement(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-500">
                Published on {activeAnnouncement.publishDate}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                {activeAnnouncement.title}
              </h2>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {activeAnnouncement.message}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                <span>Official Issuer: </span>
                <strong className="text-slate-800">{activeAnnouncement.sender}</strong>
              </div>
              <div>
                <span>Target Audience: </span>
                <span className="text-[#0b1f3a] font-semibold">{activeAnnouncement.targetAudience}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
