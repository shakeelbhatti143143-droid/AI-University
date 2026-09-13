"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  FileCheck2,
  AlertCircle,
  Building2,
} from "lucide-react";

interface FacultyExaminationsSectionProps {
  examinations: any[];
}

export const FacultyExaminationsSection: React.FC<FacultyExaminationsSectionProps> = ({
  examinations,
}) => {
  const [filterType, setFilterType] = useState("All");

  const filteredExams = examinations.filter(
    (e) => filterType === "All" || e.examType === filterType
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              Institutional Assessments
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Examination Schedule</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Examinations & Invigilation Duties
          </h2>
          <p className="text-xs text-slate-500">
            Official date sheets, examination venues, seating allocations, and invigilation instructions.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-rose-50 text-rose-800 font-bold text-xs">
          {examinations.length} Scheduled Assessment{examinations.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["All", "Midterm", "Final", "Quiz", "Practical"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === type
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {type === "All" ? "All Assessments" : type}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      {filteredExams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No scheduled exams found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Midterm and Final Examination dates will appear here once officially published by the Controller of Examinations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredExams.map((ex) => (
            <div
              key={ex._id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-blue-50 text-blue-700">
                    {ex.courseCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800">
                    {ex.examType} Exam
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {ex.title || `${ex.courseCode} ${ex.examType}`}
                  </h3>
                  <p className="text-xs text-slate-500">{ex.courseTitle}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{ex.date} ({ex.day})</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{ex.startTime} - {ex.endTime} ({ex.duration})</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Room: {ex.room} • {ex.building}</span>
                  </div>
                </div>

                {ex.instructions && ex.instructions.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Exam Guidelines
                    </span>
                    <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                      {ex.instructions.map((ins: string, i: number) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Section: {ex.section || "A"}</span>
                <span>Controller of Examinations</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
