"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Search,
  GraduationCap,
  Users,
  Building2,
  Share2,
  Calendar,
  ArrowRight,
  Loader2,
  Compass,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [queryText, setQueryText] = useState(initialQuery);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setQueryText(q);
  }, [searchParams]);

  const results = useQuery(
    api.website.searchExplore,
    isConvexConfigured && queryText.trim().length >= 2
      ? { query: queryText.trim() }
      : "skip"
  );

  const isLoading = queryText.trim().length >= 2 && results === undefined;

  const totalResultsCount = results
    ? results.programs.length +
      results.faculty.length +
      results.departments.length +
      results.posts.length +
      results.events.length
    : 0;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Search Directory" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#0b1f3a] uppercase tracking-widest">
            Institutional Search
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            Search Explore University
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Instantly search across degree programs, faculty members, academic departments, campus posts, and events.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search programs, professors, courses, news..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Search State / Results */}
      {queryText.trim().length < 2 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3 max-w-md mx-auto shadow-xs">
          <Compass className="w-10 h-10 text-[#0b1f3a] mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Enter a search term</h3>
          <p className="text-xs text-slate-500">
            Type at least 2 characters to search across our full institutional directory.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-[#0b1f3a]" />
          <span>Searching across programs, faculty, news and events...</span>
        </div>
      )}

      {!isLoading && queryText.trim().length >= 2 && results && totalResultsCount === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3 max-w-md mx-auto shadow-xs">
          <Search className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            No results found for &ldquo;{queryText}&rdquo;
          </h3>
          <p className="text-xs text-slate-500">
            Try searching for program codes (BSCS, BBA), faculty names, or topics like Artificial Intelligence.
          </p>
        </div>
      )}

      {/* Categorized Results */}
      {!isLoading && results && totalResultsCount > 0 && (
        <div className="space-y-8">
          <div className="text-xs text-slate-500">
            Found <strong className="text-slate-900 font-bold">{totalResultsCount}</strong> results matching &ldquo;{queryText}&rdquo;
          </div>

          {/* Programs */}
          {results.programs.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Degree Programs ({results.programs.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.programs.map((p) => (
                  <Link
                    key={p._id}
                    href={`/explore/programs/${p._id}`}
                    className="p-5 rounded-2xl bg-white hover:bg-[#f0f4fa]/50 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#0b1f3a] uppercase">{p.degreeLevel}</span>
                      <h4 className="font-heading font-black text-sm text-slate-900 mt-1">{p.name}</h4>
                      <p className="text-[11px] text-slate-500">{p.code} • {p.department}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-[#0b1f3a] font-semibold flex items-center justify-between">
                      <span>Program Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Faculty */}
          {results.faculty.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Faculty Members ({results.faculty.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.faculty.map((f) => (
                  <Link
                    key={f._id}
                    href={`/explore/faculty/${f._id}`}
                    className="p-5 rounded-2xl bg-white hover:bg-[#f0f4fa]/50 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div>
                      <h4 className="font-heading font-black text-sm text-slate-900">{f.fullName}</h4>
                      <p className="text-xs text-[#0b1f3a] font-medium">{f.designation}</p>
                      <p className="text-[11px] text-slate-500">{f.department}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-[#0b1f3a] font-semibold flex items-center justify-between">
                      <span>View Faculty Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Departments */}
          {results.departments.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Academic Departments ({results.departments.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.departments.map((d) => (
                  <Link
                    key={d._id}
                    href={`/explore/departments/${d._id}`}
                    className="p-5 rounded-2xl bg-white hover:bg-[#f0f4fa]/50 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div>
                      <h4 className="font-heading font-black text-sm text-slate-900">{d.name}</h4>
                      <p className="text-[11px] text-slate-500">Department Code: {d.code}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-[#0b1f3a] font-semibold flex items-center justify-between">
                      <span>Department Overview</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Posts */}
          {results.posts.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                <Share2 className="w-4 h-4" />
                <span>University Posts ({results.posts.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.posts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/explore/posts/${post._id}`}
                    className="p-5 rounded-2xl bg-white hover:bg-[#f0f4fa]/50 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#0b1f3a] font-bold uppercase">{post.category}</span>
                      <h4 className="font-heading font-black text-sm text-slate-900 line-clamp-2">{post.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{post.content}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-[#0b1f3a] font-semibold flex items-center justify-between">
                      <span>Read Story</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Events */}
          {results.events.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Events ({results.events.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.events.map((e) => (
                  <Link
                    key={e._id}
                    href="/explore/events"
                    className="p-5 rounded-2xl bg-white hover:bg-[#f0f4fa]/50 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#0b1f3a] font-bold uppercase">{e.category}</span>
                      <h4 className="font-heading font-black text-sm text-slate-900">{e.title}</h4>
                      <p className="text-[11px] text-slate-500">{e.date} • {e.location}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-[#0b1f3a] font-semibold flex items-center justify-between">
                      <span>View Event</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExploreSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-iqra-gold-400" />
          <span>Loading search directory...</span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
