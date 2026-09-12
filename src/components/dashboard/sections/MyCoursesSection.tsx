"use client";

import React, { useState } from "react";
import {
  BookOpen,
  User,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Award,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { EnrolledCourse } from "@/lib/dashboard-data";

interface MyCoursesSectionProps {
  courses: EnrolledCourse[];
  onOpenCourseModal: (course: EnrolledCourse) => void;
  searchFilter: string;
}

export const MyCoursesSection: React.FC<MyCoursesSectionProps> = ({
  courses,
  onOpenCourseModal,
  searchFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Computing" | "General">("All");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      course.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === "Computing") return course.code.startsWith("CS") || course.code.startsWith("SE");
    if (selectedCategory === "General") return !course.code.startsWith("CS") && !course.code.startsWith("SE");
    return true;
  });

  const totalCredits = courses.reduce((acc, c) => acc + c.creditHours, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800 uppercase">
              Semester 6 • Fall 2026
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Section CS-6A</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Currently Enrolled Courses ({courses.length})
          </h2>
          <p className="text-xs text-slate-500">
            Total Enrolled: <strong>{totalCredits} Credit Hours</strong> • All courses active
          </p>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2">
          {(["All", "Computing", "General"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? "bg-iqra-navy-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {cat} Courses
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid or Empty State */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-iqra-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No courses available</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You are not currently enrolled in any academic courses for this session. Use the Course Registration section to enroll in your approved degree subjects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isAttendanceWarning = course.attendancePercentage < 80;
          const isAttendanceCritical = course.attendancePercentage < 75;

          return (
            <div
              key={course.id}
              className="rounded-2xl bg-white border border-slate-200/90 hover:border-iqra-blue-400/60 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-4">
                {/* Card Top: Code, Credit Hours, Grade badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-iqra-navy-900 text-white">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {course.creditHours} Cr. Hrs
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Grade: {course.currentGrade}
                    </span>
                  </div>
                </div>

                {/* Course Title & Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-iqra-blue-600 transition-colors leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Section: <span className="font-semibold text-slate-700">{course.section}</span> • {course.building}
                  </p>
                </div>

                {/* Instructor Info */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-iqra-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {course.instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{course.instructor.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{course.instructor.designation}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-slate-500">Curriculum Progress</span>
                    <span className="font-bold text-slate-800">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-iqra-blue-600"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Key Status Indicators: Attendance & Assignments */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-semibold">Attendance</span>
                    <span
                      className={`text-xs font-bold ${
                        isAttendanceCritical
                          ? "text-rose-600"
                          : isAttendanceWarning
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {course.attendancePercentage}% ({course.attendedLectures}/{course.totalLectures})
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-semibold">Assignments</span>
                    <span className="text-xs font-bold text-slate-800">
                      {course.pendingAssignments > 0 ? (
                        <span className="text-amber-700 font-bold">{course.pendingAssignments} Pending</span>
                      ) : (
                        <span className="text-emerald-700">All Submitted</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Course Details Button */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-100">
                <button
                  onClick={() => onOpenCourseModal(course)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-iqra-navy-900 hover:text-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>View Course Details & Syllabus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
