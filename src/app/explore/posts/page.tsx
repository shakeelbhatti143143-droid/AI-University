"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Share2,
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function UniversityPostsFeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const posts = useQuery(
    api.website.getPublishedPosts,
    isConvexConfigured
      ? {
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: searchQuery.trim().length > 0 ? searchQuery.trim() : undefined,
        }
      : "skip"
  );

  const categories = useQuery(api.website.getPostCategories, isConvexConfigured ? {} : "skip");

  const isLoading = posts === undefined;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "University Feed & Posts" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <Share2 className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Official University Feed</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            Campus Pulse & Social Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Stay connected with the latest institutional announcements, research discoveries, student accomplishments, and campus events.
          </p>
        </div>

        {/* Counter */}
        <div className="px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-center shrink-0 self-start md:self-auto">
          <span className="text-xl sm:text-2xl font-black font-heading text-slate-900 block">
            {posts ? posts.length : "—"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Published Posts
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news by topic, title, tags, or author..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 shadow-xs transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "All"
                ? "bg-[#0b1f3a] text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa] border border-slate-200"
            }`}
          >
            All Updates
          </button>
          {categories?.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0b1f3a] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa] border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100" />
                <div className="space-y-1">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-20 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 max-w-lg mx-auto shadow-xs">
          <Share2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Published Posts</h3>
          <p className="text-xs text-slate-500">
            {searchQuery || selectedCategory !== "All"
              ? "No posts match the selected category or search filter. Try clearing your filters."
              : "There are currently no published posts in this category. Authorized administrators can create and publish posts from the Admin Dashboard."}
          </p>
        </div>
      )}

      {/* Social Media Post Feed Cards */}
      {!isLoading && posts.length > 0 && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {posts.map((post) => (
            <article
              key={post._id}
              className="rounded-3xl bg-white border border-slate-200/90 hover:border-[#0b1f3a]/40 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Post Author / Header */}
              <div className="p-5 sm:p-6 pb-4 flex items-center justify-between gap-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0b1f3a] to-[#122b4e] flex items-center justify-center font-bold text-white text-xs shadow-xs">
                    IU
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-black text-sm text-slate-900">
                        {post.authorName}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0b1f3a]" />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {post.authorRole || "University Administration"} • {post.publishDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.isFeatured && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#0b1f3a]" />
                      Featured
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-5 sm:p-6 space-y-4">
                <Link href={`/explore/posts/${post._id}`}>
                  <h2 className="text-lg sm:text-xl font-black font-heading text-slate-900 hover:text-[#0b1f3a] transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4 whitespace-pre-line">
                  {post.content}
                </p>

                {/* Event Date if applicable */}
                {post.eventDate && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f0f4fa] border border-[#0b1f3a]/20 text-xs font-semibold text-[#0b1f3a]">
                    <Calendar className="w-3.5 h-3.5 text-[#0b1f3a]" />
                    <span>Event Date: {post.eventDate}</span>
                  </div>
                )}

                {/* Cover Image */}
                {post.coverImage && (
                  <Link
                    href={`/explore/posts/${post._id}`}
                    className="block rounded-2xl overflow-hidden border border-slate-200 aspect-video sm:aspect-[21/9] bg-slate-100 relative group"
                  >
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    />
                  </Link>
                )}

                {/* Additional Images Preview Grid */}
                {post.additionalImages && post.additionalImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {post.additionalImages.slice(0, 3).map((img, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200"
                      >
                        <img
                          src={img}
                          alt={`${post.title} photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Bottom / Footer Actions */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Official release by Iqra University
                </span>

                <Link
                  href={`/explore/posts/${post._id}`}
                  className="inline-flex items-center gap-1.5 font-bold text-[#0b1f3a] hover:text-[#122b4e] active:text-[#071426] transition-colors"
                >
                  <span>Read Full Post & Discussion</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
