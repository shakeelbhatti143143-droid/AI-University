"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Megaphone,
  Share2,
  Bell,
} from "lucide-react";

export default function UniversityNewsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "announcements" | "news">("all");

  const announcements = useQuery(
    api.academicManagement.getPublicAnnouncements,
    isConvexConfigured ? {} : "skip"
  );

  const newsPosts = useQuery(
    api.website.getPublishedPosts,
    isConvexConfigured ? { category: "University News" } : "skip"
  );

  const publishedAnnouncements = announcements || [];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "News & Announcements" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <Megaphone className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Official Dispatches</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            News & Official Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Official institutional notices from the Office of the Registrar, academic deans, and university communications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#0b1f3a] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa]"
            }`}
          >
            All Updates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("announcements")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "announcements"
                ? "bg-[#0b1f3a] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa]"
            }`}
          >
            Announcements
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("news")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "news"
                ? "bg-[#0b1f3a] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa]"
            }`}
          >
            Press News
          </button>
        </div>
      </div>

      {/* Announcements List */}
      {(activeTab === "all" || activeTab === "announcements") && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Official University Notices ({publishedAnnouncements.length})</span>
          </div>

          {publishedAnnouncements.length > 0 ? (
            <div className="space-y-3">
              {publishedAnnouncements.map((a) => (
                <div
                  key={a._id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-[#0b1f3a]/40 transition-all"
                >
                  <div className="flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          a.priority === "Urgent"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : a.priority === "High"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20"
                        }`}
                      >
                        {a.priority} Priority
                      </span>
                      <span className="text-slate-500">{a.category} Notice</span>
                    </div>
                    <span className="text-slate-500 font-mono">{a.publishDate}</span>
                  </div>

                  <h3 className="font-heading font-black text-base text-slate-900">{a.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {a.message}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-100">
                    <span>Issued by: <strong className="text-slate-700">{a.sender}</strong></span>
                    <span>•</span>
                    <span>Audience: {a.targetAudience}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              No active announcements published.
            </div>
          )}
        </section>
      )}

      {/* News Posts List */}
      {(activeTab === "all" || activeTab === "news") && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5 text-[#0b1f3a]" />
              <span>Press Releases & Stories</span>
            </div>
            <Link
              href="/explore/posts"
              className="text-xs text-[#0b1f3a] hover:text-[#122b4e] font-semibold transition-colors"
            >
              View Full Social Feed →
            </Link>
          </div>

          {newsPosts && newsPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {newsPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/explore/posts/${post._id}`}
                  className="p-5 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#0b1f3a] font-bold">{post.category}</span>
                      <span className="text-slate-500">{post.publishDate}</span>
                    </div>
                    <h3 className="font-heading font-black text-base text-slate-900 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-[#0b1f3a] font-semibold flex items-center justify-between">
                    <span>By {post.authorName}</span>
                    <span>Read More →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              No press releases cataloged in this section.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
