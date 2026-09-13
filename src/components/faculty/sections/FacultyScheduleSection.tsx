"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  BookOpen,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FacultyScheduleSectionProps {
  schedules: any[];
}

export const FacultyScheduleSection: React.FC<FacultyScheduleSectionProps> = ({
  schedules,
}) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [selectedDay, setSelectedDay] = useState<string>("All");

  const filteredSchedules = schedules.filter(
    (s) => selectedDay === "All" || s.day === selectedDay
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Academic Timetable
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Weekly Lecture Allocation</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Class Schedule & Venues
          </h2>
          <p className="text-xs text-slate-500">
            Assigned lecture halls, laboratory slots, and weekly timetable for your courses.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-xs">
          {schedules.length} Weekly Session{schedules.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedDay("All")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0",
            selectedDay === "All"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          All Days
        </button>

        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0",
              selectedDay === day
                ? "bg-iqra-blue-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Cards */}
      {filteredSchedules.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No classes scheduled</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {selectedDay === "All"
              ? "There are currently no timetable slots recorded for your profile."
              : `No lectures scheduled on ${selectedDay}.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 font-mono border border-blue-200/60">
                    {s.courseCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    {s.day}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {s.courseTitle}
                </h3>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s.startTime} - {s.endTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s.room} ({s.building || "Academic Block"})</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                    <span>Section {s.section || "A"}</span>
                    <span className="font-semibold text-blue-700">{s.type || "Lecture"}</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-right">
                Chak Shehzad Campus, Islamabad
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
