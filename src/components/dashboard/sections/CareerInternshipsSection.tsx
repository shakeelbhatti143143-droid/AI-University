"use client";

import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileCheck2,
  TrendingUp,
  X,
  Send,
  GraduationCap,
  Award,
  ShieldCheck,
} from "lucide-react";
import { CareerOpportunity, StudentProfile } from "@/lib/dashboard-data";

interface CareerInternshipsSectionProps {
  opportunities: CareerOpportunity[];
  profile: StudentProfile;
}

export const CareerInternshipsSection: React.FC<CareerInternshipsSectionProps> = ({
  opportunities,
  profile,
}) => {
  const [selectedRoleType, setSelectedRoleType] = useState<string>("All");
  const [selectedWorkModel, setSelectedWorkModel] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [applyingJob, setApplyingJob] = useState<CareerOpportunity | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState<string>("");
  const [coverNote, setCoverNote] = useState<string>("");
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    return opportunities.filter((job) => {
      const matchRole =
        selectedRoleType === "All" || job.roleType === selectedRoleType;
      const matchModel =
        selectedWorkModel === "All" || job.workModel === selectedWorkModel;
      const matchSearch =
        searchQuery.trim() === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchRole && matchModel && matchSearch;
    });
  }, [opportunities, selectedRoleType, selectedWorkModel, searchQuery]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    setAppliedJobIds((prev) => new Set(prev).add(applyingJob.id));
    setNotification(
      `Application submitted for ${applyingJob.title} at ${applyingJob.company}! Ref: APP-IU-${Date.now().toString().slice(-5)}`
    );

    // Trigger Confetti Celebration!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#6366f1"],
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => setNotification(null), 4000);
    setApplyingJob(null);
    setPortfolioUrl("");
    setCoverNote("");
  };

  const getWorkModelBadge = (model: string) => {
    switch (model) {
      case "Remote":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Hybrid":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium">{notification}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Career Placement & Corporate Linkages
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Recruitment Drives</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Careers, Internships & Jobs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified campus recruitment opportunities, summer research fellowships, and industry software roles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-bold text-emerald-600">Applied</p>
            <p className="text-lg font-black text-emerald-800">{appliedJobIds.size}</p>
          </div>
          <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Openings</p>
            <p className="text-lg font-black text-slate-800">{opportunities.length}</p>
          </div>
        </div>
      </div>

      {/* AI Resume & Career Readiness Advisory Widget */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Campus Placement Cell Advice
            </span>
          </div>
          <h4 className="text-base font-black">
            Boost Your Resume Visibility with Verified Campus Credentials
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your verified CGPA ({profile.cgpa.toFixed(2)}) and official course projects are automatically formatted into your university endorsement packet for partner recruiters.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/dashboard?tab=transcript"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all backdrop-blur-xs flex items-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            View Official Transcript
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles, companies (e.g. Devsinc, NCAI), skills (React, Python), or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Role Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0">Role:</span>
            {["All", "Internship", "Full-Time"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedRoleType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedRoleType === type
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Work Model Filter */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0">Workplace:</span>
            {["All", "On-Site", "Hybrid", "Remote"].map((model) => (
              <button
                key={model}
                onClick={() => setSelectedWorkModel(model)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedWorkModel === model
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Openings Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No opportunities match your current filter preferences. Try resetting your search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const hasApplied = appliedJobIds.has(job.id);
            const brand = job.company.includes("Devsinc")
              ? { bg: "bg-blue-600 text-white", initials: "DS" }
              : job.company.includes("NCAI") || job.company.includes("National")
              ? { bg: "bg-emerald-600 text-white", initials: "AI" }
              : job.company.includes("Afiniti")
              ? { bg: "bg-violet-600 text-white", initials: "AF" }
              : job.company.includes("10Pearls")
              ? { bg: "bg-sky-600 text-white", initials: "10P" }
              : job.company.includes("Jazz")
              ? { bg: "bg-red-600 text-white", initials: "JZ" }
              : { bg: "bg-slate-800 text-white", initials: job.company.slice(0, 2).toUpperCase() };

            return (
              <div
                key={job.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white">
                      {job.roleType}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider ${getWorkModelBadge(
                        job.workModel
                      )}`}
                    >
                      {job.workModel}
                    </span>
                  </div>

                  {/* Company Avatar & Title */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-md ${brand.bg}`}
                    >
                      {brand.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                        <span className="font-semibold text-slate-700">{job.company}</span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remuneration & Verified Eligibility Pill */}
                  <div className="space-y-1.5">
                    <div className="px-3.5 py-2 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-900 shadow-2xs">
                      <span>Remuneration:</span>
                      <span className="font-mono">{job.stipendSalary}</span>
                    </div>

                    {profile.cgpa >= 3.0 && (
                      <div className="px-3 py-1 rounded-xl bg-blue-50/80 border border-blue-100 text-iqra-blue-700 text-[10px] font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Verified Match: Your CGPA ({profile.cgpa.toFixed(2)}) meets academic requirements</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Deadline & Applicants */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Apply Before: <span className="font-semibold text-slate-700">{job.deadline}</span>
                    </span>
                    <span className="font-semibold text-slate-600">{job.applicantsCount} Applied</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2">
                  {hasApplied ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Application Submitted
                    </div>
                  ) : (
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Apply Through Campus Portal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fast Application Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 uppercase">
                  Fast-Track Campus Application
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  {applyingJob.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {applyingJob.company} • {applyingJob.location}
                </p>
              </div>
              <button
                onClick={() => setApplyingJob(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Pre-filled Profile Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <p className="font-bold text-slate-700">Applicant Credentials (Auto-Attached):</p>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Candidate</span>
                  <span className="font-bold text-slate-800">{profile.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Enrollment No</span>
                  <span className="font-bold text-slate-800">{profile.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Program</span>
                  <span className="font-medium text-slate-800 truncate block">{profile.program}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Verified CGPA</span>
                  <span className="font-extrabold text-emerald-700">{profile.cgpa.toFixed(2)} / 4.00</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub, LinkedIn or Portfolio URL:
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username or https://linkedin.com/in/..."
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brief Pitch / Why are you a good fit? (Optional):
                </label>
                <textarea
                  rows={3}
                  placeholder="Highlight key coursework projects, hackathons won, or relevant frameworks you have worked with..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
