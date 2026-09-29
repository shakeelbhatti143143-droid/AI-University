"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Cpu,
  Sparkles,
  Briefcase,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";

interface ExploreSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_DIRECTORY = {
  programs: [
    {
      _id: "bsai",
      code: "BSAI",
      name: "Bachelor of Science in Artificial Intelligence",
      degreeLevel: "Undergraduate",
      department: "Department of Computing & Artificial Intelligence",
      duration: "4 Years (8 Semesters)",
    },
    {
      _id: "bsse",
      code: "BSSE",
      name: "Bachelor of Science in Software Engineering",
      degreeLevel: "Undergraduate",
      department: "Department of Software Engineering",
      duration: "4 Years (8 Semesters)",
    },
    {
      _id: "bscy",
      code: "BSCY",
      name: "Bachelor of Science in Cyber Security",
      degreeLevel: "Undergraduate",
      department: "Department of Cyber Security",
      duration: "4 Years (8 Semesters)",
    },
    {
      _id: "bscs",
      code: "BSCS",
      name: "Bachelor of Science in Computer Science",
      degreeLevel: "Undergraduate",
      department: "Department of Computing & Artificial Intelligence",
      duration: "4 Years (8 Semesters)",
    },
    {
      _id: "fcasu",
      code: "FCASU",
      name: "BS Artificial Intelligence & Autonomous Systems",
      degreeLevel: "Undergraduate",
      department: "Department of Computing & Artificial Intelligence",
      duration: "4 Years (8 Semesters)",
    },
    {
      _id: "bba",
      code: "BBA",
      name: "Bachelor of Business Administration",
      degreeLevel: "Undergraduate",
      department: "Department of Management Sciences",
      duration: "4 Years (8 Semesters)",
    },
  ],
  faculty: [
    {
      _id: "fac_1",
      fullName: "Dr. Kamran Qureshi",
      designation: "Professor & Lead AI Researcher",
      department: "Department of Computing & Artificial Intelligence",
    },
    {
      _id: "fac_2",
      fullName: "Dr. Arshad Mehmood",
      designation: "Associate Professor (Distributed Systems)",
      department: "Department of Computing & Artificial Intelligence",
    },
    {
      _id: "fac_3",
      fullName: "Dr. Fatima Tariq",
      designation: "Assistant Professor (Cloud Architecture)",
      department: "Department of Software Engineering",
    },
  ],
  departments: [
    {
      _id: "dept_cs",
      name: "Department of Computing & Artificial Intelligence",
      code: "DCAI",
    },
    {
      _id: "dept_se",
      name: "Department of Software Engineering",
      code: "DSE",
    },
    {
      _id: "dept_mgt",
      name: "Department of Management Sciences",
      code: "DMS",
    },
  ],
  posts: [
    {
      _id: "post_1",
      title: "Iqra University Establishes Advanced GPU Computing & AI Testbeds",
      category: "Research Advancement",
      publishDate: "March 2026",
    },
    {
      _id: "post_2",
      title: "Admissions 2026 Open for Flagship Undergraduate Disciplines",
      category: "Admissions",
      publishDate: "Fall 2026",
    },
  ],
  events: [
    {
      _id: "event_1",
      title: "National AI Symposium & Robotics Expo 2026",
      date: "October 18, 2026",
      time: "10:00 AM",
      location: "Auditorium Hall, Chak Shehzad Campus",
    },
  ],
};

const SUGGESTED_QUERIES = [
  { label: "Computer Science", icon: Cpu },
  { label: "Artificial Intelligence", icon: Sparkles },
  { label: "BBA", icon: Briefcase },
  { label: "Faculty Directory", icon: Users },
  { label: "Scholarships", icon: Award },
];

export const ExploreSearchModal: React.FC<ExploreSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 60);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Reactive Convex search
  const liveSearchResults = useQuery(
    api.website.searchExplore,
    isConvexConfigured && searchTerm.trim().length >= 2
      ? { query: searchTerm.trim() }
      : "skip"
  );

  // Intelligent fallback merge when live database query is empty or offline
  const effectiveResults = useMemo(() => {
    if (
      liveSearchResults &&
      (liveSearchResults.programs.length > 0 ||
        liveSearchResults.faculty.length > 0 ||
        liveSearchResults.departments.length > 0 ||
        liveSearchResults.posts.length > 0 ||
        liveSearchResults.events.length > 0)
    ) {
      return liveSearchResults;
    }

    if (searchTerm.trim().length >= 2) {
      const q = searchTerm.toLowerCase().trim();
      return {
        programs: FALLBACK_DIRECTORY.programs.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q) ||
            p.department.toLowerCase().includes(q)
        ),
        faculty: FALLBACK_DIRECTORY.faculty.filter(
          (f) =>
            f.fullName.toLowerCase().includes(q) ||
            f.designation.toLowerCase().includes(q) ||
            f.department.toLowerCase().includes(q)
        ),
        departments: FALLBACK_DIRECTORY.departments.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.code.toLowerCase().includes(q)
        ),
        posts: FALLBACK_DIRECTORY.posts.filter(
          (post) =>
            post.title.toLowerCase().includes(q) ||
            post.category.toLowerCase().includes(q)
        ),
        events: FALLBACK_DIRECTORY.events.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q)
        ),
      };
    }

    return null;
  }, [liveSearchResults, searchTerm]);

  if (!isOpen) return null;

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  const hasResults =
    effectiveResults &&
    (effectiveResults.programs.length > 0 ||
      effectiveResults.faculty.length > 0 ||
      effectiveResults.departments.length > 0 ||
      effectiveResults.posts.length > 0 ||
      effectiveResults.events.length > 0);

  const totalResultsCount = effectiveResults
    ? effectiveResults.programs.length +
      effectiveResults.faculty.length +
      effectiveResults.departments.length +
      effectiveResults.posts.length +
      effectiveResults.events.length
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Cinematic Deep Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-[#050e1d]/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Luxury Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-[0_24px_70px_-12px_rgba(11,31,58,0.3),0_0_0_1px_rgba(11,31,58,0.06)] overflow-hidden mt-6 sm:mt-16 flex flex-col max-h-[85vh] transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Subtle Top Accent Ribbon */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-[#0b1f3a] to-blue-600 pointer-events-none" />

        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-b from-slate-50/80 to-white">
          <div className="w-9 h-9 rounded-xl bg-[#0b1f3a]/[0.06] border border-[#0b1f3a]/10 flex items-center justify-center text-[#0b1f3a] shrink-0 shadow-2xs">
            <Search className="w-4.5 h-4.5 text-[#0b1f3a]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs, faculty, departments, news, events..."
            className="flex-1 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 shadow-none text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal p-0"
            style={{ outline: "none", boxShadow: "none", border: "none" }}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="hidden sm:inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills (Shown when search query is active) */}
        {searchTerm.trim().length >= 2 && hasResults && (
          <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {["All", "Programs", "Faculty", "Departments", "News", "Events"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCategoryFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategoryFilter === tab
                    ? "bg-[#0b1f3a] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {tab}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-slate-400 font-mono hidden sm:inline">
              {totalResultsCount} results
            </span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* 1. Empty Default State: Pristine Academic Command Palette */}
          {searchTerm.trim().length < 2 && (
            <div className="py-8 sm:py-10 px-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0b1f3a]/10 via-[#0b1f3a]/[0.04] to-transparent border border-[#0b1f3a]/15 flex items-center justify-center mx-auto shadow-sm">
                <Compass className="w-7 h-7 text-[#0b1f3a]" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="text-sm sm:text-base font-bold font-heading text-slate-900">
                  Iqra University Search Directory
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Type at least 2 characters to explore degree programs, distinguished faculty members, and official campus resources.
                </p>
              </div>

              {/* Curated Suggested Queries */}
              <div className="pt-2 max-w-md mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Suggested Searches
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {SUGGESTED_QUERIES.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSearchTerm(item.label)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#f0f4fa] text-slate-700 hover:text-[#0b1f3a] border border-slate-200/90 hover:border-[#0b1f3a]/30 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
                      >
                        <Icon className="w-3.5 h-3.5 text-[#0b1f3a]/75" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. Loading State */}
          {searchTerm.trim().length >= 2 && !effectiveResults && (
            <div className="py-14 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-[#0b1f3a]" />
              <span className="font-medium">Searching institutional directory...</span>
            </div>
          )}

          {/* 3. No Results State */}
          {searchTerm.trim().length >= 2 && effectiveResults && !hasResults && (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                No matching records for &ldquo;{searchTerm}&rdquo;
              </h4>
              <p className="text-xs max-w-xs mx-auto text-slate-500">
                Try searching by program codes (BSCS, BSAI), faculty names, or academic departments.
              </p>
            </div>
          )}

          {/* 4. Categorized Results List */}
          {effectiveResults && hasResults && (
            <div className="space-y-5">
              {/* Degree Programs */}
              {(activeCategoryFilter === "All" || activeCategoryFilter === "Programs") &&
                effectiveResults.programs.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#0b1f3a] px-1">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-[#0b1f3a]" />
                        <span>Degree Programs</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {effectiveResults.programs.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {effectiveResults.programs.map((p) => (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => handleSelect(`/explore/programs/${p._id}`)}
                          className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-[#f8fafc] border border-slate-200/80 hover:border-[#0b1f3a]/30 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#0b1f3a]/[0.06] border border-[#0b1f3a]/10 flex items-center justify-center text-[#0b1f3a] shrink-0">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono font-semibold text-slate-600">{p.code}</span>
                                <span>•</span>
                                <span>{p.degreeLevel}</span>
                                <span>•</span>
                                <span className="truncate max-w-[220px]">{p.department}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#0b1f3a] transition-colors shrink-0">
                            <span className="text-xs font-semibold hidden sm:inline">Details</span>
                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Faculty Members */}
              {(activeCategoryFilter === "All" || activeCategoryFilter === "Faculty") &&
                effectiveResults.faculty.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-sky-800 px-1">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-700" />
                        <span>Faculty Scholars</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80">
                        {effectiveResults.faculty.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {effectiveResults.faculty.map((f) => (
                        <button
                          key={f._id}
                          type="button"
                          onClick={() => handleSelect(`/explore/faculty/${f._id}`)}
                          className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-[#f8fafc] border border-slate-200/80 hover:border-sky-500/30 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-800 font-bold text-xs shrink-0">
                              {f.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
                                {f.fullName}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="font-medium text-slate-700">{f.designation}</span>
                                <span>•</span>
                                <span className="truncate max-w-[240px]">{f.department}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 group-hover:text-sky-700 transition-colors shrink-0">
                            <span className="text-xs font-semibold hidden sm:inline">Profile</span>
                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Departments */}
              {(activeCategoryFilter === "All" || activeCategoryFilter === "Departments") &&
                effectiveResults.departments.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-800 px-1">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Academic Departments</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        {effectiveResults.departments.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {effectiveResults.departments.map((d) => (
                        <button
                          key={d._id}
                          type="button"
                          onClick={() => handleSelect(`/explore/departments/${d._id}`)}
                          className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-[#f8fafc] border border-slate-200/80 hover:border-emerald-500/30 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-800 font-mono font-bold text-xs shrink-0">
                              {d.code}
                            </div>
                            <div>
                              <div className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
                                {d.name}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Official Faculty Division
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-700 transition-colors shrink-0">
                            <span className="text-xs font-semibold hidden sm:inline">Overview</span>
                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* News & Bulletins */}
              {(activeCategoryFilter === "All" || activeCategoryFilter === "News") &&
                effectiveResults.posts.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-indigo-800 px-1">
                      <div className="flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-indigo-700" />
                        <span>University News & Bulletins</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                        {effectiveResults.posts.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {effectiveResults.posts.map((post) => (
                        <button
                          key={post._id}
                          type="button"
                          onClick={() => handleSelect(`/explore/posts/${post._id}`)}
                          className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-[#f8fafc] border border-slate-200/80 hover:border-indigo-500/30 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60 inline-block mb-1">
                              {post.category}
                            </span>
                            <div className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
                              {post.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {post.publishDate}
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-700 transform group-hover:translate-x-1 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Events */}
              {(activeCategoryFilter === "All" || activeCategoryFilter === "Events") &&
                effectiveResults.events.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-800 px-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        <span>Upcoming Campus Events</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                        {effectiveResults.events.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {effectiveResults.events.map((e) => (
                        <button
                          key={e._id}
                          type="button"
                          onClick={() => handleSelect(`/explore/events`)}
                          className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-[#f8fafc] border border-slate-200/80 hover:border-amber-500/30 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
                              {e.title}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold text-amber-800">{e.date}</span>
                              {e.time && <span>• {e.time}</span>}
                              {e.location && <span>• {e.location}</span>}
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 transform group-hover:translate-x-1 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* High-Level Institutional Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-2xs">↵</kbd> select
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-2xs">ESC</kbd> close
            </span>
          </div>

          <Link
            href={`/explore/search?q=${encodeURIComponent(searchTerm)}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b1f3a] hover:text-[#122b4e] transition-colors group"
          >
            <span>Open Full Search Directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
