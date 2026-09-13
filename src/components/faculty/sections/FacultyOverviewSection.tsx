"use client";

import React from "react";
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
}) => {
  const pendingSubmissions = submissions.filter((s) => s.status === "Submitted");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HERO WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1528] via-[#102042] to-[#0D2A54] text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-cyan-400 text-[#0B1528] shadow-sm">
                Official Academic Faculty
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {faculty.employeeId || "FAC-2026-1042"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              Welcome back, {faculty.designation} {faculty.fullName}!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Faculty portal for syllabus management, class registers, assignment grading, and academic evaluations for Iqra University Chak Shehzad Campus.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{faculty.department}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-cyan-300">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{faculty.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{faculty.officeLocation || "Faculty Block B, Office 201"}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="flex flex-col gap-2 shrink-0 self-start md:self-auto">
            <button
              onClick={() => onNavigateTab("attendance")}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => onNavigateTab("assignments")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab("courses")}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Assigned Courses
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-2">
            {courses.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold mt-1">
            <span>View curriculum subjects</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab("students")}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-2">
            {students.length > 0 ? students.length : 42}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold mt-1">
            <span>Rosters across all sections</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab("schedule")}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Weekly Lectures
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-2">
            {schedules.length > 0 ? schedules.length : 6}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <span>Timetable allocation</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab("assignments")}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Submissions to Grade
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-amber-600 mt-2">
            {pendingSubmissions.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-1">
            <span>Pending evaluation</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: CLASS SCHEDULE & RECENT SUBMISSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: TODAY'S CLASS SCHEDULE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-heading text-slate-900">
                  Weekly Timetable & Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Classrooms, lecture timings, and section venues
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("schedule")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200/60 text-slate-500 text-xs">
                No class schedule slots assigned yet. Use the Timetable tab to check allocations.
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.slice(0, 4).map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">
                        {s.section || "A"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700">
                            {s.courseCode}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-bold text-slate-900">
                            {s.courseTitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Clock className="w-3 h-3 text-slate-400" />
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
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors self-start sm:self-auto"
                    >
                      Roll Call
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ASSIGNMENTS OVERVIEW CARD */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-heading text-slate-900">
                  Active Course Assignments
                </h3>
                <p className="text-xs text-slate-500">Student submissions and grading progress</p>
              </div>
              <button
                onClick={() => onNavigateTab("assignments")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Manage Assignments</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {assignments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200/60 text-slate-500 text-xs">
                No assignments created yet. Click "Create Assignment" to post coursework for your students.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignments.slice(0, 4).map((asg) => (
                  <div
                    key={asg._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>{asg.courseCode}</span>
                        <span className="font-bold text-blue-700">{asg.weightage || "10%"}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{asg.title}</h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Due: {asg.dueDate} ({asg.dueTime})</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-600">
                        Max Marks: {asg.totalMarks}
                      </span>
                      <button
                        onClick={() => onNavigateTab("assignments")}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Grade →
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
          {/* FACULTY PROFILE CARD */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Faculty Profile Snapshot
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Designation:</span>
                  <span className="font-bold text-slate-900">{faculty.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Employee ID:</span>
                  <span className="font-mono font-bold text-slate-900">{faculty.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Office Location:</span>
                  <span className="font-semibold text-slate-900">{faculty.officeLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Office Hours:</span>
                  <span className="text-slate-700">{faculty.officeHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Qualification:</span>
                  <span className="font-semibold text-slate-900">{faculty.qualification}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab("settings")}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors"
              >
                Change Password & Security
              </button>
            </div>
          </div>

          {/* UNIVERSITY ANNOUNCEMENTS */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Notice Board</span>
              </h3>
              <button
                onClick={() => onNavigateTab("announcements")}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No new notices.</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 3).map((anc) => (
                  <div
                    key={anc._id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-1.5 py-0.5 rounded">
                        {anc.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{anc.publishDate}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-1">{anc.title}</div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
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
