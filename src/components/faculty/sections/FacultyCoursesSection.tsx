"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Search,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { FacultyTab } from "../FacultySidebar";

interface FacultyCoursesSectionProps {
  courses: any[];
  sections: any[];
  onNavigateTab: (tab: FacultyTab) => void;
}

export const FacultyCoursesSection: React.FC<FacultyCoursesSectionProps> = ({
  courses,
  sections,
  onNavigateTab,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any | null>(courses[0] || null);

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Curriculum & Instruction
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Academic Session</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            My Assigned Courses & Sections
          </h2>
          <p className="text-xs text-slate-500">
            Official curriculum modules, assigned lecture sections, course syllabi, and student enrollment capacities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 font-bold text-xs">
            {courses.length} Assigned Course{courses.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter courses by code, title, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-600/20 shadow-xs"
        />
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No courses match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {courses.length === 0
              ? "You do not have courses assigned yet. Contact your department head to allocate your teaching courses."
              : "Try adjusting your search query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => {
            const courseSections = sections.filter((s) => s.courseCode === c.code);

            return (
              <div
                key={c._id || c.code}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                      {c.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {c.creditHours} Credit Hours
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black font-heading text-slate-900 leading-tight">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {c.description || "Foundational and advanced academic coursework."}
                    </p>
                  </div>

                  {/* Section Details */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-semibold">
                      <span>Sections:</span>
                      <span className="text-blue-700 font-mono">
                        {courseSections.length > 0
                          ? courseSections.map((s) => `Sec ${s.section}`).join(", ")
                          : "Section A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Program & Semester:</span>
                      <span className="font-semibold text-slate-800">
                        {c.program || "BSCS"} • Sem {c.semester || 1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Department:</span>
                      <span className="truncate max-w-[160px]">{c.department}</span>
                    </div>
                  </div>
                </div>

                {/* Quick actions for this course */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onNavigateTab("attendance")}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors"
                  >
                    Attendance
                  </button>

                  <button
                    onClick={() => onNavigateTab("students")}
                    className="flex-1 py-2 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs text-center shadow-xs transition-colors"
                  >
                    Student Roster
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
