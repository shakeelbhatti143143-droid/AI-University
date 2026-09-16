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
  Plus,
} from "lucide-react";
import { EnrolledCourse } from "@/lib/dashboard-data";

interface MyCoursesSectionProps {
  courses: EnrolledCourse[];
  onOpenCourseModal: (course: EnrolledCourse) => void;
  searchFilter: string;
  onNavigateTab?: (tab: any) => void;
}

export const MyCoursesSection: React.FC<MyCoursesSectionProps> = ({
  courses,
  onOpenCourseModal,
  searchFilter,
  onNavigateTab,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"All" | "InProgress" | "Completed">("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Computing" | "General">("All");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      course.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === "Computing") return course.code.startsWith("CS") || course.code.startsWith("SE");
    if (selectedCategory === "General") return !course.code.startsWith("CS") && !course.code.startsWith("SE");

    if (selectedStatusFilter === "Completed") return course.isCompleted || course.resultStatus === "Published";
    if (selectedStatusFilter === "InProgress") return !course.isCompleted && course.resultStatus !== "Published";

    return true;
  });

  const totalCredits = courses.reduce((acc, c) => acc + c.creditHours, 0);
  const primarySemester = (courses[0] as any)?.semester || 1;
  const completedCount = courses.filter((c) => c.isCompleted || c.resultStatus === "Published").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800 uppercase">
              {courses.length > 0 ? `Semester ${primarySemester} • Academic Session` : "Academic Session"}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              {courses.length > 0 ? `Section ${(courses[0] as any)?.section || "A"}` : "Regular Session"}
            </span>
            {completedCount > 0 && (
              <>
                <span className="text-xs text-slate-400">•</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  {completedCount} / {courses.length} Completed
                </span>
              </>
            )}
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            My Enrolled Courses ({courses.length})
          </h2>
          <p className="text-xs text-slate-500">
            Total Approved: <strong>{totalCredits} Credit Hours</strong> • Synchronized with Examination Results
          </p>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {(["All", "InProgress", "Completed"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedStatusFilter === st
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st === "All" ? "All Status" : st === "InProgress" ? "In Progress" : "Completed / Passed"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
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
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid or Empty State */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-iqra-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {courses.length === 0
                ? "No Registered / Approved Courses Yet"
                : "No courses match your filter criteria."}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {courses.length === 0
                ? "You do not have any registered and approved courses in your curriculum yet. Please navigate to Course Registration to submit registration requests for your semester courses."
                : "Try selecting \"All Status\" or clearing your search query to view all your registered courses."}
            </p>
          </div>
          {courses.length === 0 && onNavigateTab && (
            <button
              onClick={() => onNavigateTab("registration")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold shadow-md shadow-slate-900/10 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4 text-iqra-gold-400" />
              <span>Go to Course Registration</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isAttendanceWarning = course.attendancePercentage < 80;
          const isAttendanceCritical = course.attendancePercentage < 75;
          const isCompleted = course.isCompleted || course.resultStatus === "Published";
          const isPassed = course.isPassed || (isCompleted && !course.isFailed && course.currentGrade !== "F");

          return (
            <div
              key={course.id}
              className={`rounded-2xl bg-white border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                isCompleted
                  ? isPassed
                    ? "border-emerald-200/90 hover:border-emerald-400 ring-1 ring-emerald-500/10"
                    : "border-rose-200 hover:border-rose-400 ring-1 ring-rose-500/10"
                  : "border-slate-200/90 hover:border-iqra-blue-400/60"
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Card Top: Code, Credit Hours, Grade badge & Publication status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-iqra-navy-900 text-white">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {course.creditHours} Cr. Hrs
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {isCompleted ? (
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1 ${
                          isPassed
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300/50"
                            : "bg-rose-100 text-rose-800 border border-rose-300/50"
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : null}
                        <span>{isPassed ? "Completed / Passed" : "Failed"}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-iqra-blue-700 border border-blue-200/50">
                        ● In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Title & Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-iqra-blue-600 transition-colors leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>
                      Section: <strong className="text-slate-700">{course.section}</strong> • {course.building}
                    </span>
                    {course.semester && (
                      <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        Sem {course.semester}
                      </span>
                    )}
                  </div>
                </div>

                {/* Grade & GPA Highlights (When Result Published) */}
                {isCompleted && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-emerald-50/40 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Final Official Grade
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-lg font-black font-heading ${isPassed ? "text-emerald-700" : "text-rose-600"}`}>
                          {course.currentGrade}
                        </span>
                        {course.gradePoints !== undefined && (
                          <span className="text-xs font-bold text-slate-600">
                            ({course.gradePoints.toFixed(2)} GP)
                          </span>
                        )}
                        {course.percentage !== undefined && (
                          <span className="text-[11px] text-slate-400">
                            • {course.percentage}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-600 text-white shadow-2xs">
                        Result: Published
                      </span>
                    </div>
                  </div>
                )}

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
                    <span className="text-[11px] font-medium text-slate-500">
                      Curriculum Progress: {isPassed ? "Completed" : isCompleted ? "Evaluation Complete" : "In Progress"}
                    </span>
                    <span className="font-bold text-slate-800">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPassed
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : isCompleted
                          ? "bg-rose-500"
                          : "bg-iqra-blue-600"
                      }`}
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
                      {isCompleted ? (
                        <span className="text-emerald-700 font-bold">Evaluated</span>
                      ) : course.pendingAssignments > 0 ? (
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
