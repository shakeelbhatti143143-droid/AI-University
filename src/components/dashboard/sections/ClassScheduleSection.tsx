"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  ChevronRight,
  Layers,
  AlertCircle,
  Building2,
} from "lucide-react";
import { weeklySchedule, ScheduleSlot } from "@/lib/dashboard-data";

interface ClassScheduleSectionProps {
  schedule?: ScheduleSlot[];
}

export const ClassScheduleSection: React.FC<ClassScheduleSectionProps> = ({
  schedule = weeklySchedule,
}) => {
  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
  const [selectedDay, setSelectedDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday">("Monday");

  const days: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"> = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const currentClass = schedule.length > 0 ? schedule[0] : null;
  const upcomingClass = schedule.length > 1 ? schedule[1] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Switcher: Weekly vs Daily View */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800 uppercase">
              Monday–Friday Timetable
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Session</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Academic Class Schedule
          </h2>
          <p className="text-xs text-slate-500">
            Chak Shehzad Campus, Islamabad • Section CS-6A
          </p>
        </div>

        {/* View Switcher: Weekly vs Daily */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "weekly"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Weekly Grid
          </button>
          <button
            onClick={() => setViewMode("daily")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "daily"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daily View
          </button>
        </div>
      </div>

      {/* CURRENT CLASS & UPCOMING CLASS STATUS BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Happening Now Highlight */}
        {currentClass && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-iqra-navy-950 to-iqra-navy-900 text-white shadow-md border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Happening Today
              </span>
              <span className="text-xs font-mono text-slate-300">{currentClass.startTime} - {currentClass.endTime}</span>
            </div>

            <h3 className="text-base font-bold text-white leading-snug">
              {currentClass.courseCode}: {currentClass.courseTitle}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-iqra-gold-400 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                {currentClass.classroom} ({currentClass.building})
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {currentClass.instructor}
              </span>
            </div>
          </div>
        )}

        {/* Upcoming Class Indicator */}
        {upcomingClass && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-iqra-blue-800 text-[10px] font-bold uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                Upcoming Next
              </span>
              <span className="text-xs font-mono text-slate-500">{upcomingClass.startTime} - {upcomingClass.endTime}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {upcomingClass.courseCode}: {upcomingClass.courseTitle}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-iqra-blue-600" />
                {upcomingClass.classroom} ({upcomingClass.building})
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <User className="w-3.5 h-3.5" />
                {upcomingClass.instructor}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: WEEKLY TIMETABLE GRID */}
      {viewMode === "weekly" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map((day) => {
              const daySlots = schedule.filter((s) => s.day === day);

              return (
                <div key={day} className="space-y-3">
                  {/* Day Header */}
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 block">
                      {day}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {daySlots.length} Classes
                    </span>
                  </div>

                  {/* Day Slots */}
                  <div className="space-y-3">
                    {daySlots.length > 0 ? (
                      daySlots.map((slot) => {
                        const isCurrent = currentClass ? slot.id === currentClass.id : false;

                        return (
                          <div
                            key={slot.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              isCurrent
                                ? "bg-blue-50/60 border-iqra-blue-500 ring-2 ring-iqra-blue-400/20 shadow-xs"
                                : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-iqra-navy-900 text-white">
                                {slot.courseCode}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  slot.type === "Lab"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {slot.type}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                              {slot.courseTitle}
                            </h4>

                            <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                              <p className="flex items-center gap-1 font-semibold text-slate-700">
                                <Clock className="w-3 h-3 text-iqra-blue-600 shrink-0" />
                                <span>{slot.startTime} - {slot.endTime}</span>
                              </p>
                              <p className="flex items-center gap-1 truncate text-slate-600">
                                <MapPin className="w-3 h-3 text-iqra-gold-600 shrink-0" />
                                <span className="truncate">{slot.classroom}</span>
                              </p>
                              <p className="flex items-center gap-1 truncate text-[10px] text-slate-400">
                                <User className="w-3 h-3 shrink-0" />
                                <span className="truncate">{slot.instructor}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        No classes scheduled
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: DAILY VIEW */}
      {viewMode === "daily" && (
        <div className="space-y-4">
          {/* Day selection tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedDay === day
                    ? "bg-iqra-navy-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Daily Schedule List */}
          <div className="space-y-3">
            {schedule
              .filter((s) => s.day === selectedDay)
              .map((slot) => (
                <div
                  key={slot.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-iqra-blue-700 flex flex-col items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                      <span className="text-[9px] font-bold uppercase mt-0.5">{slot.type}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-iqra-navy-900 text-white">
                          {slot.courseCode}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{slot.courseTitle}</h4>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        <span className="font-semibold text-iqra-blue-700">
                          {slot.startTime} – {slot.endTime}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-iqra-gold-600" />
                          {slot.classroom}, {slot.building}
                        </span>
                        <span>•</span>
                        <span className="text-slate-500">Instructor: {slot.instructor}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-center">
                    Confirmed Slot
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
