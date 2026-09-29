"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Calendar,
  FileCheck2,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Plus,
  CheckSquare,
  Award,
  Bell,
  Building2,
  Mail,
  Briefcase,
  Camera,
  User,
  CheckCircle2,
  AlertCircle,
  Layers,
  TrendingUp,
  GraduationCap,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { FacultyTab } from "../FacultySidebar";

interface FacultyOverviewSectionProps {
  faculty: any;
  courses: any[];
  sections: any[];
  schedules: any[];
  students: any[];
  assignments: any[];
  submissions: any[];
  announcements: any[];
  onNavigateTab: (tab: FacultyTab) => void;
  onOpenProfileModal?: () => void;
}

export const FacultyOverviewSection: React.FC<FacultyOverviewSectionProps> = ({
  faculty,
  courses,
  sections,
  schedules,
  students,
  assignments,
  submissions,
  announcements,
  onNavigateTab,
  onOpenProfileModal,
}) => {
  const pendingSubmissions = submissions.filter((s) => s.status === "Submitted");

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return "FA";
    return nameStr
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HERO WELCOME BANNER - VERY HIGH ULTRA-PREMIUM WITH ANIMATIONS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#060D1A] via-[#091830] to-[#0D2447] text-white p-6 sm:p-8 shadow-2xl border border-white/10 ring-1 ring-cyan-500/20"
      >
        {/* Animated Iridescent Top Hairline */}
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 animate-pulse" />

        {/* Ambient Subtle Cyber Geometric Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf80a_1px,transparent_1px),linear-gradient(to_bottom,#38bdf80a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-40" />

        {/* Animated Aurora Glow Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/10 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1.15, 1, 1.15],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-600/10 blur-3xl pointer-events-none"
        />
        <div className="absolute top-1/2 -left-12 w-48 h-48 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 max-w-3xl">
            {/* CIRCULAR PROFILE AVATAR WITH ANIMATED MULTI-RING GLOW */}
            <div className="relative group shrink-0">
              {/* Outer Glowing Halo */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

              {/* Rotating Animated Border Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-cyan-400 via-transparent to-indigo-400 opacity-90"
              />

              {/* Avatar Main Circle */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-2xl ring-4 ring-[#060D1A] overflow-hidden">
                {faculty.profilePhoto ? (
                  <img
                    src={faculty.profilePhoto}
                    alt={faculty.fullName}
                    className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0B1F3A] to-[#122B4E] text-cyan-300 flex items-center justify-center font-black font-heading text-2xl sm:text-3xl shadow-inner">
                    {getInitials(faculty.fullName)}
                  </div>
                )}
              </div>

              {/* Live Session Radar Beacon */}
              <div
                title="Active Session"
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#060D1A] flex items-center justify-center p-0.5 ring-2 ring-emerald-500/40"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              </div>

              {/* Edit Camera Button */}
              {onOpenProfileModal && (
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  title="Edit Faculty Profile"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/40 transition-all hover:scale-110 cursor-pointer ring-2 ring-[#060D1A]"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* DYNAMIC FACULTY INFORMATION */}
            <div className="space-y-2.5">
              {/* Badges Eyebrow Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-400/40 text-[10px] font-black uppercase tracking-widest text-cyan-300 backdrop-blur-md shadow-xs shadow-cyan-500/20">
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                  <span>Official Academic Faculty</span>
                </span>

                <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-xs text-cyan-200 font-mono font-bold tracking-wider">
                  {faculty.employeeId || "IQ-01"}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Session</span>
                </span>
              </div>

              {/* Greeting Headline with Gradient Glow */}
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black font-heading text-white tracking-tight leading-tight">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                  {faculty.designation ? `${faculty.designation} ` : ""}
                  {faculty.fullName}
                </span>
                !
              </h2>

              {/* Bio Subtitle */}
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-2xl font-normal">
                {faculty.bio ||
                  "Faculty portal for syllabus management, class registers, assignment grading, and academic evaluations for Iqra University Chak Shehzad Campus."}
              </p>

              {/* Interactive Metadata Micro-Chips */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-200 transition-colors shadow-2xs">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{faculty.department || "Department of Computing & Artificial Intelligence"}</span>
                </div>

                <a
                  href={`mailto:${faculty.email}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-cyan-300 font-mono hover:text-cyan-200 transition-colors shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{faculty.email}</span>
                </a>

                {faculty.officeLocation && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-200 transition-colors shadow-2xs">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{faculty.officeLocation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons with Shimmer & Spring Motion */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start lg:self-center">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigateTab("attendance")}
              className="relative overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
            >
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <CheckSquare className="w-4 h-4 transition-transform group-hover/btn:rotate-6" />
              <span>Mark Attendance</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigateTab("assignments")}
              className="relative overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 hover:border-cyan-400/40 backdrop-blur-md shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
            >
              <Plus className="w-4 h-4 text-cyan-400 transition-transform group-hover/btn:rotate-90 duration-200" />
              <span>Create Assignment</span>
            </motion.button>

            {onOpenProfileModal && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onOpenProfileModal}
                className="px-4 py-2 rounded-xl bg-blue-600/25 hover:bg-blue-600/40 text-cyan-300 font-semibold text-xs border border-cyan-500/30 hover:border-cyan-400/50 backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* KPI METRICS ROW - COMPACT HIGH-LEVEL EXECUTIVE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {/* Metric 1: Assigned Courses */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => onNavigateTab("courses")}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br from-white via-white to-blue-50/30 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_16px_-6px_rgba(37,99,235,0.08)] hover:shadow-[0_6px_22px_-4px_rgba(37,99,235,0.16)] hover:border-blue-300 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          {/* Top Hairline Accent */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 opacity-90 group-hover:h-1 transition-all duration-200" />

          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Row: Micro-Pill Tag & Squircle Icon */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-[9.5px] font-black uppercase tracking-wider text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Teaching Term</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xs shadow-blue-500/25 ring-1 ring-white/30 flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-transform shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          {/* Middle Block: Label + Primary Stat & Inline Suffix */}
          <div className="relative z-10 space-y-0.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block truncate">
              Assigned Courses
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-[26px] font-black font-heading text-slate-900 tracking-tight leading-none group-hover:text-blue-950 transition-colors">
                {courses.length}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Active Modules
              </span>
            </div>
          </div>

          {/* Sub-Context Row: Chip & Secondary Info */}
          <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-blue-700 bg-blue-50/80 border border-blue-200/70 px-1.5 py-0.5 rounded-md shrink-0">
              <Layers className="w-2.5 h-2.5 text-blue-600" />
              {sections.length || courses.length} Sections
            </span>
            <span className="text-slate-300">•</span>
            <span className="truncate text-slate-600 font-semibold">
              {courses.reduce((acc, c) => acc + (c.creditHours || 3), 0)} Total Credits
            </span>
          </div>

          {/* Footer Action Row */}
          <div className="relative z-10 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
            <span className="truncate">View curriculum subjects</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Metric 2: Enrolled Students */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => onNavigateTab("students")}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br from-white via-white to-indigo-50/30 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_16px_-6px_rgba(79,70,229,0.08)] hover:shadow-[0_6px_22px_-4px_rgba(79,70,229,0.16)] hover:border-indigo-300 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          {/* Top Hairline Accent */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-400 opacity-90 group-hover:h-1 transition-all duration-200" />

          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Row: Micro-Pill Tag & Squircle Icon */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50/90 border border-indigo-200/70 text-[9.5px] font-black uppercase tracking-wider text-indigo-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>Enrolled Cohort</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 text-white shadow-xs shadow-indigo-500/25 ring-1 ring-white/30 flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-transform shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>

          {/* Middle Block: Label + Primary Stat & Inline Suffix */}
          <div className="relative z-10 space-y-0.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block truncate">
              Enrolled Students
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-[26px] font-black font-heading text-slate-900 tracking-tight leading-none group-hover:text-indigo-950 transition-colors">
                {students.length > 0 ? students.length : 42}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Students
              </span>
            </div>
          </div>

          {/* Sub-Context Row: Chip & Secondary Info */}
          <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-indigo-700 bg-indigo-50/80 border border-indigo-200/70 px-1.5 py-0.5 rounded-md shrink-0">
              <GraduationCap className="w-2.5 h-2.5 text-indigo-600" />
              Active Attendance
            </span>
            <span className="text-slate-300">•</span>
            <span className="truncate text-slate-600 font-semibold">
              Chak Shehzad Campus
            </span>
          </div>

          {/* Footer Action Row */}
          <div className="relative z-10 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
            <span className="truncate">Rosters across all sections</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Metric 3: Weekly Lectures */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => onNavigateTab("schedule")}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br from-white via-white to-emerald-50/30 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_16px_-6px_rgba(16,185,129,0.08)] hover:shadow-[0_6px_22px_-4px_rgba(16,185,129,0.16)] hover:border-emerald-300 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          {/* Top Hairline Accent */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 opacity-90 group-hover:h-1 transition-all duration-200" />

          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Row: Micro-Pill Tag & Squircle Icon */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-[9.5px] font-black uppercase tracking-wider text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Allocated Time</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-xs shadow-emerald-500/25 ring-1 ring-white/30 flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-transform shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          {/* Middle Block: Label + Primary Stat & Inline Suffix */}
          <div className="relative z-10 space-y-0.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block truncate">
              Weekly Lectures
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-[26px] font-black font-heading text-slate-900 tracking-tight leading-none group-hover:text-emerald-950 transition-colors">
                {schedules.length > 0 ? schedules.length : 6}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Sessions / Wk
              </span>
            </div>
          </div>

          {/* Sub-Context Row: Chip & Secondary Info */}
          <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-1.5 py-0.5 rounded-md shrink-0">
              <Clock className="w-2.5 h-2.5 text-emerald-600" />
              9.0 Contact Hrs
            </span>
            <span className="text-slate-300">•</span>
            <span className="truncate text-slate-600 font-semibold">
              Mon – Thu Timetable
            </span>
          </div>

          {/* Footer Action Row */}
          <div className="relative z-10 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
            <span className="truncate">Timetable allocation</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Metric 4: Submissions to Grade */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => onNavigateTab("assignments")}
          className={`relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_16px_-6px_rgba(0,0,0,0.06)] transition-all duration-200 group cursor-pointer flex flex-col justify-between ${
            pendingSubmissions.length === 0
              ? "bg-gradient-to-br from-white via-white to-emerald-50/30 border-slate-200/90 hover:shadow-[0_6px_22px_-4px_rgba(16,185,129,0.16)] hover:border-emerald-300"
              : "bg-gradient-to-br from-white via-white to-amber-50/30 border-slate-200/90 hover:shadow-[0_6px_22px_-4px_rgba(245,158,11,0.18)] hover:border-amber-300"
          }`}
        >
          {/* Top Hairline Accent */}
          <div
            className={`absolute top-0 inset-x-0 h-[2.5px] opacity-90 group-hover:h-1 transition-all duration-200 ${
              pendingSubmissions.length === 0
                ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400"
                : "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-400"
            }`}
          />

          {/* Subtle Ambient Radial Glow */}
          <div
            className={`absolute -right-6 -top-6 w-20 h-20 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500 ${
              pendingSubmissions.length === 0 ? "bg-emerald-500/10" : "bg-amber-500/10"
            }`}
          />

          {/* Top Row: Micro-Pill Tag & Squircle Icon */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            {pendingSubmissions.length === 0 ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-[9.5px] font-black uppercase tracking-wider text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Caught Up</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50/90 border border-amber-200/70 text-[9.5px] font-black uppercase tracking-wider text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Action Required</span>
              </div>
            )}
            <div
              className={`w-8 h-8 rounded-xl text-white shadow-xs ring-1 ring-white/30 flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-transform shrink-0 ${
                pendingSubmissions.length === 0
                  ? "bg-gradient-to-br from-emerald-600 to-teal-500 shadow-emerald-500/25"
                  : "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/25"
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>

          {/* Middle Block: Label + Primary Stat & Inline Suffix */}
          <div className="relative z-10 space-y-0.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block truncate">
              Submissions to Grade
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl sm:text-[26px] font-black font-heading tracking-tight leading-none transition-colors ${
                  pendingSubmissions.length === 0
                    ? "text-slate-900 group-hover:text-emerald-950"
                    : "text-amber-600 group-hover:text-amber-700"
                }`}
              >
                {pendingSubmissions.length}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Pending Tasks
              </span>
            </div>
          </div>

          {/* Sub-Context Row: Chip & Secondary Info */}
          <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
            {pendingSubmissions.length === 0 ? (
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-1.5 py-0.5 rounded-md shrink-0">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                100% Evaluations Cleared
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-amber-700 bg-amber-50/80 border border-amber-200/70 px-1.5 py-0.5 rounded-md shrink-0">
                <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                {pendingSubmissions.length} Pending Review
              </span>
            )}
            <span className="text-slate-300">•</span>
            <span className="truncate text-slate-600 font-semibold">
              {assignments.length} Course Tasks
            </span>
          </div>

          {/* Footer Action Row */}
          <div
            className={`relative z-10 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold transition-colors ${
              pendingSubmissions.length === 0
                ? "text-slate-500 group-hover:text-emerald-600"
                : "text-slate-500 group-hover:text-amber-600"
            }`}
          >
            <span className="truncate">Pending evaluation</span>
            <div
              className={`w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center transition-all duration-200 shrink-0 ${
                pendingSubmissions.length === 0
                  ? "group-hover:bg-emerald-600 group-hover:text-white"
                  : "group-hover:bg-amber-600 group-hover:text-white"
              }`}
            >
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* TWO COLUMN GRID: CLASS SCHEDULE & RECENT SUBMISSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: TODAY'S CLASS SCHEDULE & ASSIGNMENTS */}
        <div className="lg:col-span-2 space-y-6">
          {/* CARD 1: WEEKLY TIMETABLE & SCHEDULE */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-white to-blue-50/25 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-8px_rgba(15,23,42,0.06)] hover:border-blue-300/80 transition-all duration-300 group p-5 sm:p-6 space-y-4">
            {/* Top Hairline Accent */}
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 opacity-90 group-hover:h-1 transition-all duration-200" />
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            {/* Header Row */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-[9.5px] font-black uppercase tracking-wider text-blue-700 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>Academic Schedule</span>
                </div>
                <h3 className="text-lg font-black font-heading text-slate-900 tracking-tight">
                  Weekly Timetable & Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Classrooms, lecture timings, and section venues
                </p>
              </div>

              <button
                onClick={() => onNavigateTab("schedule")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 transition-all group/btn self-start sm:self-auto cursor-pointer"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Content: Empty or Populated */}
            {schedules.length === 0 ? (
              <div className="relative z-10 overflow-hidden p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-50/80 via-white to-blue-50/20 border border-dashed border-slate-200/90 text-center flex flex-col items-center justify-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shadow-xs shadow-blue-500/10">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  No Class Schedule Slots Assigned
                </span>
                <p className="text-[11.5px] text-slate-500 max-w-sm">
                  No class schedule slots assigned yet. Use the Timetable tab to check allocations.
                </p>
                <button
                  onClick={() => onNavigateTab("schedule")}
                  className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-700 hover:text-blue-600 shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>Check Timetable Allocations</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="relative z-10 space-y-2.5">
                {schedules.slice(0, 4).map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/30 border border-slate-200/80 hover:border-blue-300/80 shadow-2xs transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/slot"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-black text-xs flex items-center justify-center shadow-xs shadow-blue-500/20 shrink-0">
                        {s.section || "A"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                            {s.courseCode}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-bold text-slate-900">
                            {s.courseTitle}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Clock className="w-3 h-3 text-blue-500" />
                            {s.day} • {s.startTime} - {s.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {s.room} ({s.building || "Computing Dept"})
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateTab("attendance")}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Roll Call</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CARD 2: ACTIVE COURSE ASSIGNMENTS */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-white to-indigo-50/25 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-8px_rgba(15,23,42,0.06)] hover:border-indigo-300/80 transition-all duration-300 group p-5 sm:p-6 space-y-4">
            {/* Top Hairline Accent */}
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 opacity-90 group-hover:h-1 transition-all duration-200" />
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            {/* Header Row */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50/90 border border-indigo-200/70 text-[9.5px] font-black uppercase tracking-wider text-indigo-700 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span>Coursework & Tasks</span>
                </div>
                <h3 className="text-lg font-black font-heading text-slate-900 tracking-tight">
                  Active Course Assignments
                </h3>
                <p className="text-xs text-slate-500">
                  Student submissions and grading progress
                </p>
              </div>

              <button
                onClick={() => onNavigateTab("assignments")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/60 transition-all group/btn self-start sm:self-auto cursor-pointer"
              >
                <span>Manage Assignments</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Content: Empty or Populated */}
            {assignments.length === 0 ? (
              <div className="relative z-10 overflow-hidden p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-50/80 via-white to-indigo-50/20 border border-dashed border-slate-200/90 text-center flex flex-col items-center justify-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 flex items-center justify-center shadow-xs shadow-indigo-500/10">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  No Active Coursework Posted
                </span>
                <p className="text-[11.5px] text-slate-500 max-w-sm">
                  No assignments created yet. Click &quot;Create Assignment&quot; to post coursework for your students.
                </p>
                <button
                  onClick={() => onNavigateTab("assignments")}
                  className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Assignment</span>
                </button>
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignments.slice(0, 4).map((asg) => (
                  <div
                    key={asg._id}
                    className="p-4 rounded-2xl bg-white hover:bg-indigo-50/30 border border-slate-200/80 hover:border-indigo-300/80 shadow-2xs transition-all duration-200 flex flex-col justify-between space-y-2 group/asg"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60">
                          {asg.courseCode}
                        </span>
                        <span className="font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {asg.weightage || "10%"} Weight
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-2 tracking-tight group-hover/asg:text-indigo-950">
                        {asg.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Due: {asg.dueDate} ({asg.dueTime})</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-600">
                        Max Marks: {asg.totalMarks}
                      </span>
                      <button
                        onClick={() => onNavigateTab("assignments")}
                        className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 text-xs cursor-pointer"
                      >
                        <span>Grade</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 1 COL: ANNOUNCEMENTS & QUICK INFO */}
        <div className="space-y-6">
          {/* CARD 3: FACULTY PROFILE SNAPSHOT */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-white to-slate-50/30 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-8px_rgba(15,23,42,0.06)] hover:border-slate-300 transition-all duration-300 group p-5 sm:p-6 space-y-3.5">
            {/* Top Hairline Accent */}
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-[#102042] via-blue-600 to-cyan-400 opacity-90 group-hover:h-1 transition-all duration-200" />
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            {/* Header Row */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[9px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  <span>Official Record</span>
                </div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 block">
                  Faculty Profile Snapshot
                </h3>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs ring-1 ring-slate-200/60 shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>

            {/* Structured Specifications Grid */}
            <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-50/90 to-white border border-slate-200/80 shadow-2xs space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>Designation:</span>
                </span>
                <span className="text-xs font-black text-slate-900 bg-blue-50/90 text-blue-900 border border-blue-200/60 px-2 py-0.5 rounded-md">
                  {faculty.designation || "Lecturer"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Employee ID:</span>
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                  {faculty.employeeId || "IQ-01"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Office Location:</span>
                </span>
                <span className="text-xs font-bold text-slate-800 truncate text-right">
                  {faculty.officeLocation || "Faculty Block B, Office 201"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Office Hours:</span>
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate text-right">
                  {faculty.officeHours || "Mon-Thu 11:00 AM - 01:00 PM"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                  <span>Qualification:</span>
                </span>
                <span className="text-xs font-black text-slate-900">
                  {faculty.qualification || "MS / Ph.D."}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="relative z-10">
              <button
                onClick={() => onNavigateTab("settings")}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-[#102042] to-slate-900 hover:from-blue-950 hover:to-indigo-950 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer group/btn"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:scale-110 transition-transform" />
                <span>Change Password & Security</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 4: NOTICE BOARD */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-white to-amber-50/20 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-8px_rgba(15,23,42,0.06)] hover:border-amber-300/80 transition-all duration-300 group p-5 sm:p-6 space-y-3.5">
            {/* Top Hairline Accent */}
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 opacity-90 group-hover:h-1 transition-all duration-200" />
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            {/* Header Row */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-600 flex items-center justify-center shadow-2xs">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                    Notice Board
                  </h3>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab("announcements")}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/70 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Content: Empty or Populated */}
            {announcements.length === 0 ? (
              <div className="relative z-10 p-6 rounded-2xl bg-slate-50/80 border border-dashed border-slate-200/80 text-center text-xs text-slate-400">
                No new campus notices.
              </div>
            ) : (
              <div className="relative z-10 space-y-2.5">
                {announcements.slice(0, 3).map((anc) => (
                  <div
                    key={anc._id}
                    onClick={() => onNavigateTab("announcements")}
                    className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/20 border border-slate-200/80 hover:border-amber-200 shadow-2xs transition-all duration-200 space-y-1.5 group/notice cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-blue-700 bg-blue-50/90 border border-blue-200/70 px-2 py-0.5 rounded-full">
                        {anc.category || "Course"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-slate-400" />
                        {anc.publishDate}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs tracking-tight group-hover/notice:text-blue-900 transition-colors">
                      {anc.title}
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed line-clamp-2">
                      {anc.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
