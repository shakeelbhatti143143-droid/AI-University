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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. WELCOME BANNER WITH STUDENT NAME, SEMESTER & ACADEMIC SESSION */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#050e1d] via-[#0a192f] to-[#0f274a] text-white p-6 sm:p-8 shadow-xl shadow-slate-900/10 border border-slate-800">
        {/* Decorative background glows */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-52 h-52 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-iqra-gold-400" />
              <span>Iqra University Chak Shehzad Portal</span>
              <span className="text-white/40">•</span>
              <span className="text-iqra-gold-300 font-bold">{profile.academicSession}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-iqra-gold-400">
                {profile.name}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              {profile.program} • <span className="font-semibold text-white">{profile.currentSemester}</span> (Roll:{" "}
              <span className="font-mono text-blue-300">{profile.studentId}</span>)
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {profile.status} Enrolled
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-medium">
                <Building2 className="w-3.5 h-3.5" />
                Chak Shehzad Campus, Islamabad
              </span>
            </div>
          </div>

          {/* Academic Standing Card Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col justify-between min-w-[220px]">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-300 mb-2">
              <span className="uppercase tracking-wider font-semibold text-[10px] text-blue-200">
                Academic Standing
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-base font-bold text-white leading-tight">
              {profile.academicStanding.split("—")[0]}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300">Degree Progress</span>
              <span className="font-bold text-iqra-gold-400">
                {Math.round((profile.completedCreditHours / profile.totalCreditHours) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. GPA/CGPA SUMMARY & CORE METRIC CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: CGPA & Semester GPA */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={() => onNavigateTab("academics")}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Cumulative CGPA
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-iqra-blue-600 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {profile.cgpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Current Semester GPA:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {profile.currentGpa.toFixed(2)}
            </span>
          </div>
        </motion.div>

        {/* Card 2: Total Registered Courses */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={() => onNavigateTab("courses")}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registered Courses
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {courses.length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Subjects</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Enrolled Credit Hours:</span>
            <span className="font-bold text-slate-800">
              {courses.reduce((sum, c) => sum + c.creditHours, 0)} Cr. Hrs
            </span>
          </div>
        </motion.div>

        {/* Card 3: Attendance Percentage */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={() => onNavigateTab("attendance")}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Attendance
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {overallAttendance}%
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Safe (&gt;75%)
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-medium">HEC Requirement:</span>
            <span className="font-bold text-slate-800">75% Mandatory</span>
          </div>
        </motion.div>

        {/* Card 4: Pending Assignments */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={() => onNavigateTab("assignments")}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-slate-900">
              {pendingAssignments.length}
            </span>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
              {pendingAssignments.length > 0 ? "Action Required" : "Up to Date"}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Pending:</span>
            <span className="font-bold text-slate-700">
              {pendingAssignments.length > 0 ? `${pendingAssignments.length} Assignment(s)` : "No pending tasks"}
            </span>
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
