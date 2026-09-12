"use client";

import React from "react";
import {
  X,
  BookOpen,
  User,
  Mail,
  Building,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  FileText,
} from "lucide-react";
import { EnrolledCourse } from "@/lib/dashboard-data";

interface CourseDetailsModalProps {
  course: EnrolledCourse | null;
  onClose: () => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-iqra-navy-950 via-iqra-navy-900 to-iqra-blue-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-white/20 text-white">
                {course.code}
              </span>
              <span className="text-xs font-bold text-iqra-gold-400">
                {course.creditHours} Credit Hours • Section {course.section}
              </span>
            </div>
            <h2 className="text-xl font-black font-heading text-white leading-snug">
              {course.title}
            </h2>
            <p className="text-xs text-blue-200">
              Department of Computing & Technology • Chak Shehzad Campus
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Key Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Curriculum Progress</span>
              <span className="text-base font-bold text-slate-900">{course.progress}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Attendance</span>
              <span className="text-base font-bold text-emerald-600">{course.attendancePercentage}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Current Grade</span>
              <span className="text-base font-bold text-iqra-blue-700">{course.currentGrade}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Assignments</span>
              <span className="text-base font-bold text-slate-800">
                {course.totalAssignments - course.pendingAssignments}/{course.totalAssignments}
              </span>
            </div>
          </div>

          {/* Instructor & Classroom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Course Instructor
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-iqra-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {course.instructor.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{course.instructor.name}</h4>
                  <p className="text-[11px] text-slate-500">{course.instructor.designation}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-1">
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{course.instructor.email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Office: {course.instructor.office}</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Class Schedule & Venue
              </span>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-iqra-blue-600 shrink-0" />
                  <span className="font-semibold text-xs">{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-iqra-gold-600 shrink-0" />
                  <span className="text-xs">{course.classroom}, {course.building}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus Outline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Official HEC / IU Course Syllabus Modules
            </h4>
            <div className="space-y-2">
              {course.syllabus.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3 text-slate-700"
                >
                  <span className="w-5 h-5 rounded-lg bg-iqra-navy-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
