"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import {
  Search,
  X,
  GraduationCap,
  Users,
  Building2,
  Share2,
  Calendar,
  ArrowRight,
  Loader2,
  Compass,
} from "lucide-react";

interface ExploreSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExploreSearchModal: React.FC<ExploreSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // Toggle or focus
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reactive Convex search
  const searchResults = useQuery(
    api.website.searchExplore,
    isConvexConfigured && searchTerm.trim().length >= 2
      ? { query: searchTerm.trim() }
      : "skip"
  );

  if (!isOpen) return null;

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  const hasResults =
    searchResults &&
    (searchResults.programs.length > 0 ||
      searchResults.faculty.length > 0 ||
      searchResults.departments.length > 0 ||
      searchResults.posts.length > 0 ||
      searchResults.events.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden mt-8 sm:mt-16 flex flex-col max-h-[82vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/90">
          <Search className="w-5 h-5 text-[#0b1f3a] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs, faculty, departments, news, events..."
            className="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="p-1 rounded-md text-slate-400 hover:text-[#0b1f3a] hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-md text-[11px] font-mono text-slate-500 bg-slate-200/80 border border-slate-300 hover:text-[#0b1f3a]"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {searchTerm.trim().length < 2 && (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <Compass className="w-8 h-8 text-[#0b1f3a] mx-auto animate-pulse" />
              <p className="text-xs">Type at least 2 characters to search across AI University.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {["Computer Science", "Artificial Intelligence", "BBA", "Faculty", "Scholarships"].map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSearchTerm(s)}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 hover:bg-[#f0f4fa] text-slate-700 hover:text-[#0b1f3a] border border-slate-200 hover:border-[#0b1f3a]/30 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {searchTerm.trim().length >= 2 && !searchResults && (
            <div className="py-12 flex items-center justify-center gap-2 text-slate-500 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#0b1f3a]" />
              <span>Searching directory...</span>
            </div>
          )}

          {searchTerm.trim().length >= 2 && searchResults && !hasResults && (
            <div className="py-10 text-center text-slate-500 space-y-1">
              <p className="text-sm font-semibold text-slate-900">No results found for &ldquo;{searchTerm}&rdquo;</p>
              <p className="text-xs">Try searching for program codes, faculty names, or departments.</p>
            </div>
          )}

          {searchResults && hasResults && (
            <div className="space-y-4">
              {/* Programs */}
              {searchResults.programs.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0b1f3a]">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Degree Programs ({searchResults.programs.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 border border-slate-200 overflow-hidden">
                    {searchResults.programs.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => handleSelect(`/explore/programs/${p._id}`)}
                        className="w-full text-left p-3 hover:bg-[#f0f4fa] flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0b1f3a]">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {p.code} • {p.degreeLevel} • {p.department}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0b1f3a] transform group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculty */}
              {searchResults.faculty.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                    <Users className="w-3.5 h-3.5" />
                    <span>Faculty Members ({searchResults.faculty.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 border border-slate-200 overflow-hidden">
                    {searchResults.faculty.map((f) => (
                      <button
                        key={f._id}
                        type="button"
                        onClick={() => handleSelect(`/explore/faculty/${f._id}`)}
                        className="w-full text-left p-3 hover:bg-[#f0f4fa] flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0b1f3a]">
                            {f.fullName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {f.designation} • {f.department}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0b1f3a] transform group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Departments */}
              {searchResults.departments.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Departments ({searchResults.departments.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 border border-slate-200 overflow-hidden">
                    {searchResults.departments.map((d) => (
                      <button
                        key={d._id}
                        type="button"
                        onClick={() => handleSelect(`/explore/departments/${d._id}`)}
                        className="w-full text-left p-3 hover:bg-[#f0f4fa] flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0b1f3a]">
                            {d.name}
                          </div>
                          <div className="text-[10px] text-slate-500">{d.code}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0b1f3a] transform group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts & News */}
              {searchResults.posts.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>University Posts ({searchResults.posts.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 border border-slate-200 overflow-hidden">
                    {searchResults.posts.map((post) => (
                      <button
                        key={post._id}
                        type="button"
                        onClick={() => handleSelect(`/explore/posts/${post._id}`)}
                        className="w-full text-left p-3 hover:bg-[#f0f4fa] flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0b1f3a]">
                            {post.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {post.category} • {post.publishDate}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0b1f3a] transform group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {searchResults.events.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Events ({searchResults.events.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 border border-slate-200 overflow-hidden">
                    {searchResults.events.map((e) => (
                      <button
                        key={e._id}
                        type="button"
                        onClick={() => handleSelect(`/explore/events`)}
                        className="w-full text-left p-3 hover:bg-[#f0f4fa] flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0b1f3a]">
                            {e.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {e.date} • {e.time} • {e.location}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0b1f3a] transform group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search the entire AI University directory</span>
          <Link
            href={`/explore/search?q=${encodeURIComponent(searchTerm)}`}
            onClick={onClose}
            className="text-xs text-[#0b1f3a] hover:text-[#122b4e] font-semibold"
          >
            View Full Search Page →
          </Link>
        </div>
      </div>
    </div>
  );
};
