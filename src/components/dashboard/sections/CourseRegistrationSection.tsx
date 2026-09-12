"use client";

import React, { useState } from "react";
import {
  FolderPlus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  User,
  Clock,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { AvailableCourse, EnrolledCourse } from "@/lib/dashboard-data";

interface CourseRegistrationSectionProps {
  availableCourses: AvailableCourse[];
  enrolledCourses: EnrolledCourse[];
  onRegisterCourse: (course: AvailableCourse) => void;
  onDropCourse: (courseId: string) => void;
}

export const CourseRegistrationSection: React.FC<CourseRegistrationSectionProps> = ({
  availableCourses,
  enrolledCourses,
  onRegisterCourse,
  onDropCourse,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedCredits, setSelectedCredits] = useState("All");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const totalRegisteredCredits = enrolledCourses.reduce((acc, c) => acc + c.creditHours, 0);
  const MAX_CREDITS = 21; // HEC regular semester maximum limit

  // Filter available courses
  const filteredAvailable = availableCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === "All" || course.department.includes(selectedDept);
    const matchesCredits = selectedCredits === "All" || course.creditHours.toString() === selectedCredits;

    return matchesSearch && matchesDept && matchesCredits;
  });

  const handleRegister = (course: AvailableCourse) => {
    if (totalRegisteredCredits + course.creditHours > MAX_CREDITS) {
      setFeedbackMessage(`Registration limit exceeded! Maximum allowed credit hours is ${MAX_CREDITS}.`);
      setTimeout(() => setFeedbackMessage(null), 4000);
      return;
    }
    onRegisterCourse(course);
    setFeedbackMessage(`Successfully added "${course.code}: ${course.title}" to your registered courses.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Registration Status & Credit Hours Summary Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Registration Period
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">Fall 2026 Regular Add/Drop</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
              Course Registration Catalog
            </h2>
            <p className="text-xs text-slate-500">
              Department of Computing & Technology • Chak Shehzad Campus, Islamabad
            </p>
          </div>

          {/* Credit Hours Summary Card */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Registered Credit Hours
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-heading text-iqra-navy-900">
                  {totalRegisteredCredits}
                </span>
                <span className="text-xs font-bold text-slate-400">/ {MAX_CREDITS} Max Allowed</span>
              </div>
            </div>
            <div className="h-9 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Courses
              </span>
              <span className="text-2xl font-black font-heading text-iqra-blue-700">
                {enrolledCourses.length}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Alert if present */}
        {feedbackMessage && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-iqra-blue-800 flex items-center justify-between animate-in fade-in duration-150">
            <span>{feedbackMessage}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs text-iqra-blue-600 hover:text-iqra-blue-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Currently Registered Courses Summary Bar */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Currently Enrolled Courses in Registration Session:
          </span>
          <div className="flex flex-wrap gap-2">
            {enrolledCourses.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800"
              >
                <strong className="font-mono text-iqra-blue-700">{c.code}</strong>
                <span className="truncate max-w-[140px] sm:max-w-none">{c.title}</span>
                <span className="text-[10px] font-bold text-slate-500">({c.creditHours} Cr)</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Multi-criteria Filters */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search course title, code, instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Computing">Computing & Tech</option>
              <option value="Information Technology">Information Tech</option>
              <option value="Management">Management Sciences</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Credit Hours:</span>
            <select
              value={selectedCredits}
              onChange={(e) => setSelectedCredits(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Credits</option>
              <option value="2">2 Credit Hours</option>
              <option value="3">3 Credit Hours</option>
              <option value="4">4 Credit Hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Available Courses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Available Courses for Registration ({filteredAvailable.length})
          </h3>
          <span className="text-xs text-slate-400">Regular Fall 2026 Offerings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAvailable.map((course) => {
            const isAlreadyEnrolled = enrolledCourses.some((c) => c.code === course.code);
            const isFull = course.availableSeats <= 0;

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-iqra-blue-400/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {/* Top: Code, Credit hours, Seats badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-iqra-navy-900 text-white">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {course.creditHours} Credit Hours
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        course.availableSeats < 10
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {course.availableSeats} / {course.totalSeats} Seats Left
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{course.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Instructor & Schedule */}
                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Instructor: <strong>{course.instructor}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.schedule}</span>
                    </p>
                  </div>

                  {/* Prerequisites */}
                  <div className="pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400 font-semibold">Prerequisites: </span>
                    <span className="text-slate-700 font-medium">
                      {course.prerequisites.join(", ")}
                    </span>
                  </div>
                </div>

                {/* Add/Register or Already Enrolled Button */}
                <div className="pt-2">
                  {isAlreadyEnrolled ? (
                    <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Already Registered in Course</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(course)}
                      disabled={isFull}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        isFull
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                          : "bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white shadow-slate-900/10"
                      }`}
                    >
                      <Plus className="w-4 h-4 text-iqra-gold-400" />
                      <span>{isFull ? "Course Full (Waitlist Only)" : "Register Course (+)"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
