"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileCheck,
  CreditCard,
  Download,
  Building2,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  User,
} from "lucide-react";
import {
  StudentProfile,
  EnrolledCourse,
  Assignment,
  Examination,
  Announcement,
  AcademicActivity,
} from "@/lib/dashboard-data";
import { DashboardTab } from "../Sidebar";

interface DashboardOverviewProps {
  profile: StudentProfile;
  courses: EnrolledCourse[];
  assignments: Assignment[];
  examinations: Examination[];
  announcements: Announcement[];
  activities: AcademicActivity[];
  onNavigateTab: (tab: DashboardTab) => void;
  onOpenCourse: (course: EnrolledCourse) => void;
  onOpenSubmitAssignment: (assignment: Assignment) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  profile,
  courses,
  assignments,
  examinations,
  announcements,
  activities,
  onNavigateTab,
  onOpenCourse,
  onOpenSubmitAssignment,
}) => {
  const pendingAssignments = assignments.filter((a) => a.status === "Pending" || a.status === "Upcoming");
  const overallAttendance = (
    courses.reduce((acc, c) => acc + c.attendancePercentage, 0) / (courses.length || 1)
  ).toFixed(1);

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return "ST";
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
      {/* ========================================================================= */}
      {/* 1. DYNAMIC STUDENT HERO BANNER WITH CIRCULAR AVATAR & ACADEMIC INFO */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#050e1d] via-[#0a192f] to-[#0f274a] text-white p-6 sm:p-8 shadow-2xl border border-white/10 ring-1 ring-cyan-500/20"
      >
        {/* Animated Iridescent Top Hairline */}
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 animate-pulse" />

        {/* Ambient Subtle Cyber Geometric Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf80a_1px,transparent_1px),linear-gradient(to_bottom,#38bdf80a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-40" />

        {/* Animated Aurora Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], x: [0, -25, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-1/3 -bottom-16 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
            {/* CIRCULAR PROFILE IMAGE WITH ROTATING HALO */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-cyan-400 via-transparent to-indigo-400 opacity-90"
              />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-2xl ring-4 ring-[#050e1d] overflow-hidden relative">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#071326] to-[#0d2347] flex items-center justify-center text-cyan-300 font-black text-xl sm:text-2xl tracking-wider">
                    {getInitials(profile.name)}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab("profile")}
                title="View Student Profile"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md transition-all border-2 border-[#0a192f] hover:scale-110 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* DYNAMIC STUDENT PROFILE INFORMATION */}
            <div className="space-y-2 min-w-0">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-cyan-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>OFFICIAL ENROLLED STUDENT</span>
                <span className="text-white/40">•</span>
                <span className="font-mono text-cyan-300 font-bold">{profile.studentId}</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {profile.academicSession || "Active Session"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
                  {profile.name}
                </span>
                !
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium">
                <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 text-white font-semibold">{profile.program}</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 text-cyan-300">{profile.department || "Computing & Artificial Intelligence"}</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 text-slate-300">{profile.currentSemester}</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 text-slate-300">{profile.campus || "Chak Shehzad Campus, Islamabad"}</span>
              </div>

              {profile.bio && (
                <p className="text-xs text-slate-300/90 italic line-clamp-2 max-w-2xl pt-0.5">
                  &ldquo;{profile.bio}&rdquo;
                </p>
              )}

              {/* ACTION SHORTCUT BUTTONS */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onNavigateTab("profile")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onNavigateTab("registration")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-cyan-400/40 text-white font-semibold transition-all cursor-pointer backdrop-blur-md"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Course Registration</span>
                </motion.button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {profile.status} Enrolled
                </span>
              </div>
            </div>
          </div>

          {/* Academic Standing Card Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col justify-between min-w-[220px]">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-300 mb-2">
              <span className="uppercase tracking-wider font-semibold text-[10px] text-cyan-200">
                Academic Standing
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-base font-bold text-white leading-tight">
              {profile.academicStanding.split("—")[0]}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300">Degree Progress</span>
              <span className="font-bold text-cyan-300">
                {Math.round((profile.completedCreditHours / (profile.totalCreditHours || 134)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. GPA/CGPA SUMMARY & CORE METRIC CARDS - COMPACT LUXURY EXECUTIVE CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {/* Card 1: CGPA & Semester GPA */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => onNavigateTab("academics")}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br from-white via-white to-blue-50/30 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_16px_-6px_rgba(37,99,235,0.08)] hover:shadow-[0_6px_22px_-4px_rgba(37,99,235,0.16)] hover:border-blue-300 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          {/* Top Hairline Accent */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 opacity-90 group-hover:h-1 transition-all duration-200" />
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Row: Micro-Pill Tag & Squircle Icon */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-[9.5px] font-black uppercase tracking-wider text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Academic Merit</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xs shadow-blue-500/25 ring-1 ring-white/30 flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-transform shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>

          {/* Middle Block: Label + Primary Stat */}
          <div className="relative z-10 space-y-0.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block truncate">
              Cumulative CGPA
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-[26px] font-black font-heading text-slate-900 tracking-tight leading-none group-hover:text-blue-950 transition-colors">
                {profile.cgpa.toFixed(2)}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                / 4.00 Scale
              </span>
            </div>
          </div>

          {/* Sub-Context Row */}
          <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-1.5 py-0.5 rounded-md shrink-0">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
              GPA {profile.currentGpa.toFixed(2)}
            </span>
            <span className="text-slate-300">•</span>
            <span className="truncate text-slate-600 font-semibold">
              Current Semester
            </span>
          </div>

          {/* Footer Action Row */}
          <div className="relative z-10 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
            <span className="truncate">View academic history</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Card 2: Total Registered Courses */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => onNavigateTab("courses")}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br from-white via-white to-emerald-50/30 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_16px_-6px_rgba(16,185,129,0.08)] hover:shadow-[0_6px_22px_-4px_rgba(16,185,129,0.16)] hover:border-emerald-300 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          {/* Top Hairline Accent */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 opacity-90 group-hover:h-1 transition-all duration-200" />
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Row: Micro-Pill Tag & Squircle Icon */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-[9.5px] font-black uppercase tracking-wider text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Current Term</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-xs shadow-emerald-500/25 ring-1 ring-white/30 flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-transform shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          {/* Middle Block: Label + Primary Stat */}
          <div className="relative z-10 space-y-0.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block truncate">
              Registered Courses
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-[26px] font-black font-heading text-slate-900 tracking-tight leading-none group-hover:text-emerald-950 transition-colors">
                {courses.length}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Subjects
              </span>
            </div>
          </div>

          {/* Sub-Context Row */}
          <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-1.5 py-0.5 rounded-md shrink-0">
              {courses.reduce((sum, c) => sum + c.creditHours, 0)} Cr. Hrs
            </span>
            <span className="text-slate-300">•</span>
            <span className="truncate text-slate-600 font-semibold">
              Spring 2026 Term
            </span>
          </div>

          {/* Footer Action Row */}
          <div className="relative z-10 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
            <span className="truncate">View enrolled classes</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Attendance Percentage */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => onNavigateTab("attendance")}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br from-white via-white to-purple-50/30 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_16px_-6px_rgba(147,51,234,0.08)] hover:shadow-[0_6px_22px_-4px_rgba(147,51,234,0.16)] hover:border-purple-300 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          {/* Top Hairline Accent */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-400 opacity-90 group-hover:h-1 transition-all duration-200" />
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Row: Micro-Pill Tag & Squircle Icon */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-50/90 border border-purple-200/70 text-[9.5px] font-black uppercase tracking-wider text-purple-700">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span>Campus Presence</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-500 text-white shadow-xs shadow-purple-500/25 ring-1 ring-white/30 flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-transform shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Middle Block: Label + Primary Stat */}
          <div className="relative z-10 space-y-0.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block truncate">
              Overall Attendance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-[26px] font-black font-heading text-slate-900 tracking-tight leading-none group-hover:text-purple-950 transition-colors">
                {overallAttendance}%
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                Cleared
              </span>
            </div>
          </div>

          {/* Sub-Context Row */}
          <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-purple-700 bg-purple-50/80 border border-purple-200/70 px-1.5 py-0.5 rounded-md shrink-0">
              HEC &ge; 75%
            </span>
            <span className="text-slate-300">•</span>
            <span className="truncate text-slate-600 font-semibold">
              Eligible for Finals
            </span>
          </div>

          {/* Footer Action Row */}
          <div className="relative z-10 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold text-slate-500 group-hover:text-purple-600 transition-colors">
            <span className="truncate">Detailed class registers</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-purple-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Card 4: Pending Assignments */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          onClick={() => onNavigateTab("assignments")}
          className={`relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_16px_-6px_rgba(0,0,0,0.06)] transition-all duration-200 group cursor-pointer flex flex-col justify-between ${
            pendingAssignments.length === 0
              ? "bg-gradient-to-br from-white via-white to-emerald-50/30 border-slate-200/90 hover:shadow-[0_6px_22px_-4px_rgba(16,185,129,0.16)] hover:border-emerald-300"
              : "bg-gradient-to-br from-white via-white to-amber-50/30 border-slate-200/90 hover:shadow-[0_6px_22px_-4px_rgba(245,158,11,0.18)] hover:border-amber-300"
          }`}
        >
          {/* Top Hairline Accent */}
          <div
            className={`absolute top-0 inset-x-0 h-[2.5px] opacity-90 group-hover:h-1 transition-all duration-200 ${
              pendingAssignments.length === 0
                ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400"
                : "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-400"
            }`}
          />
          <div
            className={`absolute -right-6 -top-6 w-20 h-20 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500 ${
              pendingAssignments.length === 0 ? "bg-emerald-500/10" : "bg-amber-500/10"
            }`}
          />

          {/* Top Row: Micro-Pill Tag & Squircle Icon */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            {pendingAssignments.length === 0 ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-[9.5px] font-black uppercase tracking-wider text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Submitted</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50/90 border border-amber-200/70 text-[9.5px] font-black uppercase tracking-wider text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Action Required</span>
              </div>
            )}
            <div
              className={`w-8 h-8 rounded-xl text-white shadow-xs ring-1 ring-white/30 flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-transform shrink-0 ${
                pendingAssignments.length === 0
                  ? "bg-gradient-to-br from-emerald-600 to-teal-500 shadow-emerald-500/25"
                  : "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/25"
              }`}
            >
              <FileText className="w-4 h-4" />
            </div>
          </div>

          {/* Middle Block: Label + Primary Stat */}
          <div className="relative z-10 space-y-0.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400 block truncate">
              Pending Tasks
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl sm:text-[26px] font-black font-heading tracking-tight leading-none transition-colors ${
                  pendingAssignments.length === 0
                    ? "text-slate-900 group-hover:text-emerald-950"
                    : "text-amber-600 group-hover:text-amber-700"
                }`}
              >
                {pendingAssignments.length}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Pending Tasks
              </span>
            </div>
          </div>

          {/* Sub-Context Row */}
          <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
            {pendingAssignments.length === 0 ? (
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-1.5 py-0.5 rounded-md shrink-0">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                Zero Backlog
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-amber-700 bg-amber-50/80 border border-amber-200/70 px-1.5 py-0.5 rounded-md shrink-0">
                <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                {pendingAssignments.length} Need Submission
              </span>
            )}
            <span className="text-slate-300">•</span>
            <span className="truncate text-slate-600 font-semibold">
              Course Work
            </span>
          </div>

          {/* Footer Action Row */}
          <div
            className={`relative z-10 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold transition-colors ${
              pendingAssignments.length === 0
                ? "text-slate-500 group-hover:text-emerald-600"
                : "text-slate-500 group-hover:text-amber-600"
            }`}
          >
            <span className="truncate">View task deadlines</span>
            <div
              className={`w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center transition-all duration-200 shrink-0 ${
                pendingAssignments.length === 0
                  ? "group-hover:bg-emerald-600 group-hover:text-white"
                  : "group-hover:bg-amber-600 group-hover:text-white"
              }`}
            >
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK-ACTION BUTTONS */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Instant Portal Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab("schedule")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-iqra-navy-900 hover:text-white border border-slate-200/70 text-slate-700 text-left transition-all duration-200 group flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white group-hover:bg-white/10 flex items-center justify-center text-iqra-blue-600 group-hover:text-iqra-gold-400 shadow-xs shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold">Class Schedule</span>
              <span className="block text-[10px] text-slate-400 group-hover:text-slate-300">View Timetable</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("registration")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-iqra-navy-900 hover:text-white border border-slate-200/70 text-slate-700 text-left transition-all duration-200 group flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white group-hover:bg-white/10 flex items-center justify-center text-emerald-600 group-hover:text-emerald-300 shadow-xs shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold">Course Catalog</span>
              <span className="block text-[10px] text-slate-400 group-hover:text-slate-300">Add / Drop Course</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("assignments")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-iqra-navy-900 hover:text-white border border-slate-200/70 text-slate-700 text-left transition-all duration-200 group flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white group-hover:bg-white/10 flex items-center justify-center text-amber-600 group-hover:text-amber-300 shadow-xs shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold">Assignments</span>
              <span className="block text-[10px] text-slate-400 group-hover:text-slate-300">Submit Work</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("academics")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-iqra-navy-900 hover:text-white border border-slate-200/70 text-slate-700 text-left transition-all duration-200 group flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white group-hover:bg-white/10 flex items-center justify-center text-purple-600 group-hover:text-purple-300 shadow-xs shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold">Transcript</span>
              <span className="block text-[10px] text-slate-400 group-hover:text-slate-300">Audit & Grades</span>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TWO-COLUMN SPLIT: UPCOMING EXAMINATIONS & RECENT ANNOUNCEMENTS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Examinations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upcoming Midterm Examinations</h3>
                <p className="text-[11px] text-slate-500">Official Schedule • Controller of Examinations</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
              Fall 2026
            </span>
          </div>

          <div className="space-y-3">
            {examinations.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-500">
                <Clock className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span>No examinations currently scheduled for this session.</span>
              </div>
            ) : (
              examinations.map((exam) => (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-iqra-navy-900 text-white">
                          {exam.courseCode}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{exam.courseTitle}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-rose-700">
                          <Calendar className="w-3.5 h-3.5" />
                          {exam.date} ({exam.time})
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-iqra-gold-600" />
                          {exam.room}, {exam.building}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Seat #</span>
                      <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {exam.seatNumber}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Examination Hall Rule:</strong> Students must arrive 15 minutes before exam start time with a valid Iqra University ID card. Electronic smartwatches and phones are prohibited.
            </span>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-iqra-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-iqra-gold-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Campus Announcements</h3>
                <p className="text-[11px] text-slate-500">Chak Shehzad Academic & Registrar Notices</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-iqra-blue-600 hover:text-iqra-blue-800 cursor-pointer">
              View All
            </span>
          </div>

          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-500">
                <Sparkles className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span>No campus announcements posted at this time.</span>
              </div>
            ) : (
              announcements.slice(0, 3).map((anc) => (
                <div
                  key={anc.id}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {anc.isUrgent && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-600 text-white animate-pulse">
                          Urgent
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-200 text-slate-700">
                        {anc.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{anc.date}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{anc.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1 line-clamp-2">
                    {anc.content}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Sender: {anc.sender}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. TWO-COLUMN SPLIT: ENROLLED COURSES SUMMARY & RECENT ACADEMIC ACTIVITY */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currently Enrolled Courses Quick List (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Enrolled Courses Progress</h3>
              <p className="text-[11px] text-slate-500">6 Enrolled Subjects • Section CS-6A</p>
            </div>
            <button
              onClick={() => onNavigateTab("courses")}
              className="text-xs font-semibold text-iqra-blue-600 hover:text-iqra-blue-800 flex items-center gap-1"
            >
              <span>Detailed Course List</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => onOpenCourse(course)}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-iqra-blue-500/40 hover:shadow-xs transition-all cursor-pointer bg-slate-50/50 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-iqra-blue-700 border border-blue-100">
                    {course.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Grade: {course.currentGrade}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-iqra-blue-600 transition-colors line-clamp-1 mt-2">
                  {course.title}
                </h4>

                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {course.instructor.name}
                </p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
                    <span>Course Progress</span>
                    <span className="text-slate-800">{course.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-iqra-blue-600 transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Attendance: {course.attendancePercentage}%</span>
                  <span className="font-semibold text-iqra-blue-600 group-hover:underline">
                    View Syllabus →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Academic Activity Feed (1 col) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Academic Activity Feed</h3>
              <p className="text-[11px] text-slate-500">Recent portal and grade updates</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => (
              <div key={act.id} className="relative">
                {/* Dot */}
                <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-iqra-blue-600 ring-4 ring-blue-50" />
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">
                    {act.timestamp}
                  </span>
                  <h5 className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">
                    {act.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {act.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab("assignments")}
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition-colors"
            >
              View Full History & Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
