"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  Cpu,
  Sparkles,
  Briefcase,
  Award,
  Layers,
  X,
  BookOpen,
} from "lucide-react";

const FALLBACK_DIRECTORY = {
  programs: [
    {
      _id: "bsai",
      code: "BSAI",
      name: "Bachelor of Science in Artificial Intelligence",
      degreeLevel: "Undergraduate",
      duration: "4 Years (8 Semesters)",
      totalCreditHours: 134,
      department: "Department of Computing & Artificial Intelligence",
      description: "Deep learning, neural architectures, computer vision, and cognitive systems calibrated for modern technological frontiers.",
    },
    {
      _id: "bsse",
      code: "BSSE",
      name: "Bachelor of Science in Software Engineering",
      degreeLevel: "Undergraduate",
      duration: "4 Years (8 Semesters)",
      totalCreditHours: 134,
      department: "Department of Software Engineering",
      description: "Enterprise application architectures, cloud native microservices, CI/CD pipelines, and high-reliability software systems.",
    },
    {
      _id: "bscy",
      code: "BSCY",
      name: "Bachelor of Science in Cyber Security",
      degreeLevel: "Undergraduate",
      duration: "4 Years (8 Semesters)",
      totalCreditHours: 134,
      department: "Department of Cyber Security",
      description: "Threat vector intelligence, ethical penetration testing, network forensics, cryptography, and mission-critical cloud defense.",
    },
    {
      _id: "bscs",
      code: "BSCS",
      name: "Bachelor of Science in Computer Science",
      degreeLevel: "Undergraduate",
      duration: "4 Years (8 Semesters)",
      totalCreditHours: 134,
      department: "Department of Computing & Artificial Intelligence",
      description: "Algorithmic computation, operating systems design, database systems, distributed computing, and artificial intelligence.",
    },
    {
      _id: "fcasu",
      code: "FCASU",
      name: "BS Artificial Intelligence & Autonomous Systems",
      degreeLevel: "Undergraduate",
      duration: "4 Years (8 Semesters)",
      totalCreditHours: 134,
      department: "Department of Computing & Artificial Intelligence",
      description: "Robotics automation, sensor fusion, autonomous decision pipelines, and edge-AI machine learning models.",
    },
    {
      _id: "bba",
      code: "BBA",
      name: "Bachelor of Business Administration",
      degreeLevel: "Undergraduate",
      duration: "4 Years (8 Semesters)",
      totalCreditHours: 134,
      department: "Department of Management Sciences",
      description: "Strategic executive leadership, quantitative fintech analytics, international business governance, and digital enterprise scaling.",
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
      content: "Dedicated AI cluster and neural network research infrastructure deployed at Chak Shehzad Campus.",
    },
    {
      _id: "post_2",
      title: "Admissions 2026 Open for Flagship Undergraduate Disciplines",
      category: "Admissions",
      publishDate: "Fall 2026",
      content: "Prospective scholars are invited to apply for BSAI, BSCS, BSSE, and BBA degree programs.",
    },
  ],
  events: [
    {
      _id: "event_1",
      title: "National AI Symposium & Robotics Expo 2026",
      category: "Academic Conference",
      date: "October 18, 2026",
      time: "10:00 AM",
      location: "Auditorium Hall, Chak Shehzad Campus",
    },
  ],
};

const SUGGESTED_TOPICS = [
  { label: "Artificial Intelligence", icon: Sparkles },
  { label: "Computer Science", icon: Cpu },
  { label: "Software Engineering", icon: Layers },
  { label: "BBA", icon: Briefcase },
  { label: "Faculty Scholars", icon: Users },
  { label: "Scholarships", icon: Award },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [queryText, setQueryText] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<string>("All");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setQueryText(q);
  }, [searchParams]);

  const liveResults = useQuery(
    api.website.searchExplore,
    isConvexConfigured && queryText.trim().length >= 2
      ? { query: queryText.trim() }
      : "skip"
  );

  const effectiveResults = useMemo(() => {
    if (
      liveResults &&
      (liveResults.programs.length > 0 ||
        liveResults.faculty.length > 0 ||
        liveResults.departments.length > 0 ||
        liveResults.posts.length > 0 ||
        liveResults.events.length > 0)
    ) {
      return liveResults;
    }

    if (queryText.trim().length >= 2) {
      const q = queryText.toLowerCase().trim();
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
  }, [liveResults, queryText]);

  const isLoading =
    queryText.trim().length >= 2 &&
    liveResults === undefined &&
    isConvexConfigured;

  const totalResultsCount = effectiveResults
    ? effectiveResults.programs.length +
      effectiveResults.faculty.length +
      effectiveResults.departments.length +
      effectiveResults.posts.length +
      effectiveResults.events.length
    : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      router.push(`/explore/search?q=${encodeURIComponent(queryText.trim())}`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Search Directory" }]} />

      {/* Flagship Institutional Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c2447] via-[#091b35] to-[#040e1c] text-white p-8 sm:p-12 border border-sky-400/20 shadow-xl overflow-hidden space-y-6">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-sky-200 border border-white/15 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Institutional Knowledge Search</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            Explore Iqra University Directory
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
            Instantly discover degree programs, faculty scholars, academic departments, campus notices, and official events across Chak Shehzad Campus, Islamabad.
          </p>
        </div>

        {/* Floating Luxury Search Input Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative z-10 max-w-3xl rounded-2xl bg-white p-2 sm:p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] border border-white/80 flex items-center gap-2.5"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0b1f3a] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Search className="w-5 h-5 text-sky-300" />
          </div>

          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search degree programs (BSAI, BSCS), faculty, departments..."
            className="flex-1 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 p-0"
            style={{ outline: "none", boxShadow: "none", border: "none" }}
          />

          {queryText && (
            <button
              type="button"
              onClick={() => setQueryText("")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Suggested Quick Tags */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium mr-1">Trending:</span>
          {SUGGESTED_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.label}
                type="button"
                onClick={() => setQueryText(topic.label)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-slate-200 hover:text-white transition-all text-xs cursor-pointer"
              >
                <Icon className="w-3 h-3 text-sky-300" />
                <span>{topic.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Tabs Bar (When searching) */}
      {queryText.trim().length >= 2 && effectiveResults && totalResultsCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto scrollbar-none">
            {[
              { id: "All", label: "All Results", count: totalResultsCount },
              { id: "Programs", label: "Programs", count: effectiveResults.programs.length },
              { id: "Faculty", label: "Faculty", count: effectiveResults.faculty.length },
              { id: "Departments", label: "Departments", count: effectiveResults.departments.length },
              { id: "Posts", label: "News", count: effectiveResults.posts.length },
              { id: "Events", label: "Events", count: effectiveResults.events.length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-[#0b1f3a] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing matching records for &ldquo;<strong className="text-slate-900">{queryText}</strong>&rdquo;
          </div>
        </div>
      )}

      {/* 1. Default Welcome State: Curated Showcase when no search is active */}
      {queryText.trim().length < 2 && (
        <div className="space-y-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-3 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0b1f3a]/10 via-[#0b1f3a]/[0.04] to-transparent border border-[#0b1f3a]/15 flex items-center justify-center mx-auto text-[#0b1f3a] shadow-sm">
              <Compass className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
              Institutional Search Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Enter program titles (Artificial Intelligence, Cyber Security), professor names, or departmental codes to start exploring.
            </p>
          </div>

          {/* Quick Academic Disciplines Spotlight */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-bold uppercase tracking-wider text-[#0b1f3a]">
                Quick Academic Explore
              </span>
              <span>6 Featured Programs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FALLBACK_DIRECTORY.programs.map((prog) => (
                <div
                  key={prog._id}
                  className="group p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_8px_-4px_rgba(15,23,42,0.03)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700 tracking-wide">
                        {prog.degreeLevel}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-400 tracking-wider uppercase">
                        {prog.code}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg sm:text-[19px] text-slate-900 tracking-[-0.015em] leading-snug group-hover:text-[#0b1f3a] transition-colors duration-200 mt-4 mb-2.5">
                      {prog.name}
                    </h3>

                    <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-5">
                      {prog.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="font-normal text-slate-500">
                        Duration: <span className="font-semibold text-slate-700">{prog.duration}</span>
                      </span>
                      <span className="font-semibold text-slate-700">
                        {prog.totalCreditHours} <span className="font-normal text-slate-500">Credit Hours</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/explore/programs/${prog._id}`}
                      className="font-semibold text-slate-600 hover:text-[#0b1f3a] transition-colors"
                    >
                      Program Details
                    </Link>
                    <Link
                      href="/apply"
                      className="font-bold text-slate-900 hover:text-[#0b1f3a] inline-flex items-center gap-1.5 transition-colors group/apply"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover/apply:text-[#0b1f3a] group-hover/apply:translate-x-1 transition-all duration-200" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Loading State */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-[#0b1f3a]" />
          <span className="font-semibold">Querying institutional database...</span>
        </div>
      )}

      {/* 3. Empty Results State */}
      {!isLoading && queryText.trim().length >= 2 && effectiveResults && totalResultsCount === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3 max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No results found for &ldquo;{queryText}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please verify the spelling or try searching for abbreviations such as BSAI, BSCS, BBA, or general faculty topics.
          </p>
        </div>
      )}

      {/* 4. Categorized Results Sections */}
      {!isLoading && effectiveResults && totalResultsCount > 0 && (
        <div className="space-y-10">
          {/* Degree Programs */}
          {(activeTab === "All" || activeTab === "Programs") && effectiveResults.programs.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#0b1f3a]" />
                  <span>Degree Programs ({effectiveResults.programs.length})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {effectiveResults.programs.map((prog) => (
                  <div
                    key={prog._id}
                    className="group p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_8px_-4px_rgba(15,23,42,0.03)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700 tracking-wide">
                          {prog.degreeLevel}
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-400 tracking-wider uppercase">
                          {prog.code}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-lg sm:text-[19px] text-slate-900 tracking-[-0.015em] leading-snug group-hover:text-[#0b1f3a] transition-colors duration-200 mt-4 mb-2.5">
                        {prog.name}
                      </h3>

                      <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-5">
                        {prog.description || `Offered by ${prog.department}.`}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span className="font-normal text-slate-500">
                          Duration: <span className="font-semibold text-slate-700">{prog.duration}</span>
                        </span>
                        <span className="font-semibold text-slate-700">
                          {prog.totalCreditHours} <span className="font-normal text-slate-500">Credit Hours</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <Link
                        href={`/explore/programs/${prog._id}`}
                        className="font-semibold text-slate-600 hover:text-[#0b1f3a] transition-colors"
                      >
                        Program Details
                      </Link>
                      <Link
                        href="/apply"
                        className="font-bold text-slate-900 hover:text-[#0b1f3a] inline-flex items-center gap-1.5 transition-colors group/apply"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover/apply:text-[#0b1f3a] group-hover/apply:translate-x-1 transition-all duration-200" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Faculty Members */}
          {(activeTab === "All" || activeTab === "Faculty") && effectiveResults.faculty.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
                <Users className="w-4 h-4 text-sky-700" />
                <span>Faculty Scholars ({effectiveResults.faculty.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {effectiveResults.faculty.map((f) => (
                  <Link
                    key={f._id}
                    href={`/explore/faculty/${f._id}`}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-400/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0b1f3a] to-[#163664] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                          {f.fullName.split(" ").pop()?.charAt(0) || "F"}
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0b1f3a] transition-colors leading-snug">
                            {f.fullName}
                          </h4>
                          <p className="text-xs text-sky-700 font-semibold mt-0.5">
                            {f.designation}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed truncate">
                        {f.department}
                      </p>
                    </div>

                    <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0b1f3a]">
                      <span>View Academic Profile</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Departments */}
          {(activeTab === "All" || activeTab === "Departments") && effectiveResults.departments.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Academic Departments ({effectiveResults.departments.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {effectiveResults.departments.map((d) => (
                  <Link
                    key={d._id}
                    href={`/explore/departments/${d._id}`}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {d.code}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0b1f3a] transition-colors leading-snug">
                        {d.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Official Academic Division</p>
                    </div>

                    <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                      <span>Department Overview</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* News & Posts */}
          {(activeTab === "All" || activeTab === "Posts") && effectiveResults.posts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                <Share2 className="w-4 h-4 text-indigo-700" />
                <span>University News & Bulletins ({effectiveResults.posts.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {effectiveResults.posts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/explore/posts/${post._id}`}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60 inline-block mb-2">
                        {post.category}
                      </span>
                      <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0b1f3a] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      {post.content && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                          {post.content}
                        </p>
                      )}
                    </div>

                    <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-700">
                      <span>Read Publication</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Events */}
          {(activeTab === "All" || activeTab === "Events") && effectiveResults.events.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>Campus Events ({effectiveResults.events.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {effectiveResults.events.map((e) => (
                  <Link
                    key={e._id}
                    href="/explore/events"
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 inline-block mb-2">
                        {e.category || "Campus Event"}
                      </span>
                      <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0b1f3a] transition-colors leading-snug">
                        {e.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        <span>{e.date}</span>
                        {e.location && <span>• {e.location}</span>}
                      </p>
                    </div>

                    <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-800">
                      <span>Event Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
          <Loader2 className="w-6 h-6 animate-spin text-[#0b1f3a]" />
          <span>Loading search directory...</span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
