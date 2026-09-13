"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Mail,
  BookOpen,
  Filter,
  GraduationCap,
  Download,
} from "lucide-react";

interface FacultyStudentsSectionProps {
  students: any[];
  courses: any[];
}

export const FacultyStudentsSection: React.FC<FacultyStudentsSectionProps> = ({
  students,
  courses,
}) => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesCourse = courseFilter === "All" || s.courseCode === courseFilter;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase flex items-center gap-1">
              <Users className="w-3 h-3" />
              Class Roster
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Student Roster</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Enrolled Students in Your Classes
          </h2>
          <p className="text-xs text-slate-500">
            View verified university students registered in your allocated courses and lecture sections.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-xs">
          {students.length} Total Enrolled Student{students.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students by name, registration ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-600/20"
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="All">All Courses</option>
          {courses.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No students found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {students.length === 0
              ? "No student enrollments found for your courses yet."
              : "No students matched your search query or course filter."}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Enrollment ID</th>
                  <th className="px-6 py-3.5">Course Code & Title</th>
                  <th className="px-6 py-3.5">Section</th>
                  <th className="px-6 py-3.5">Semester</th>
                  <th className="px-6 py-3.5">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredStudents.map((st, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                        {st.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div>{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Registered Student</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {st.studentId}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-blue-700 mr-1.5">
                        {st.courseCode}
                      </span>
                      <span className="text-slate-600">{st.courseTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800">
                        {st.section || "Sec A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {st.semester || "Semester 5"}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-blue-600">
                      {st.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
