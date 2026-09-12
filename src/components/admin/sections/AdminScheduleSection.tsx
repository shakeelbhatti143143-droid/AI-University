"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Filter,
  X,
  Building,
} from "lucide-react";
import {
  AdminScheduleSlot,
  AdminCourse,
  detectScheduleConflicts,
} from "@/lib/admin-data";

interface AdminScheduleSectionProps {
  slots: AdminScheduleSlot[];
  courses: AdminCourse[];
  onAddSlot: (slot: Omit<AdminScheduleSlot, "id">) => void;
  onUpdateSlot: (id: string, updated: Partial<AdminScheduleSlot>) => void;
  onDeleteSlot: (id: string) => void;
}

export const AdminScheduleSection: React.FC<AdminScheduleSectionProps> = ({
  slots,
  courses,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
}) => {
  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
  const [selectedDay, setSelectedDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday">("Monday");
  const [classroomFilter, setClassroomFilter] = useState("All");

  // Create slot modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Form fields
  const [newDay, setNewDay] = useState<AdminScheduleSlot["day"]>("Monday");
  const [newStartTime, setNewStartTime] = useState("08:30 AM");
  const [newEndTime, setNewEndTime] = useState("10:00 AM");
  const [newCourseCode, setNewCourseCode] = useState(courses[0]?.code || "CS-401");
  const [newInstructor, setNewInstructor] = useState("Dr. Asim Farooq");
  const [newRoom, setNewRoom] = useState("Lab 4 - AI Lab");
  const [newBuilding, setNewBuilding] = useState("Block B");
  const [newSection, setNewSection] = useState("CS-6A");
  const [newType, setNewType] = useState<AdminScheduleSlot["type"]>("Lecture");

  const days: Array<AdminScheduleSlot["day"]> = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    const foundCourse = courses.find((c) => c.code === newCourseCode);

    const candidateSlot: AdminScheduleSlot = {
      id: `temp_${Date.now()}`,
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      courseCode: newCourseCode,
      courseTitle: foundCourse?.title || "Academic Lecture",
      instructor: newInstructor,
      classroom: newRoom,
      building: newBuilding,
      section: newSection,
      semester: foundCourse?.semester || 6,
      type: newType,
    };

    // Run conflict detection engine
    const conflictResult = detectScheduleConflicts(slots, candidateSlot);

    if (conflictResult.hasConflict) {
      setConflictWarning(conflictResult.message || "Schedule Conflict Detected!");
      return;
    }

    onAddSlot({
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      courseCode: newCourseCode,
      courseTitle: foundCourse?.title || "Academic Lecture",
      instructor: newInstructor,
      classroom: newRoom,
      building: newBuilding,
      section: newSection,
      semester: foundCourse?.semester || 6,
      type: newType,
    });

    setIsCreateOpen(false);
  };

  const filteredSlots = slots.filter((slot) => {
    if (classroomFilter !== "All" && slot.classroom !== classroomFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Master Campus Timetable Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Session</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Class Schedule & Conflict Management
          </h2>
          <p className="text-xs text-slate-500">
            Configure time slots, assign rooms & labs, and automatically prevent instructor & room double-booking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "weekly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode("daily")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "daily" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              Daily List
            </button>
          </div>

          <button
            onClick={() => {
              setConflictWarning(null);
              setIsCreateOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-iqra-gold-400" />
            <span>Add Class Slot</span>
          </button>
        </div>
      </div>

      {/* Conflict Engine Notice */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-iqra-blue-900 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-iqra-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">Automated Conflict Detection Active</h4>
          <p className="text-[11px] text-iqra-blue-800 mt-0.5 leading-relaxed">
            The scheduler verifies classroom occupancy and faculty availability in real-time. Any overlapping bookings or room collisions are rejected with explicit conflict warnings.
          </p>
        </div>
      </div>

      {/* VIEW: WEEKLY GRID */}
      {viewMode === "weekly" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day) => {
            const daySlots = filteredSlots.filter((s) => s.day === day);

            return (
              <div key={day} className="space-y-3">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 block">
                    {day}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {daySlots.length} Classes
                  </span>
                </div>

                <div className="space-y-3">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs space-y-2 relative group"
                    >
                      <button
                        onClick={() => onDeleteSlot(slot.id)}
                        className="absolute top-2 right-2 p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Schedule Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-iqra-navy-900 text-white">
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

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {slot.courseTitle}
                      </h4>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                        <p className="flex items-center gap-1 font-semibold text-iqra-blue-700">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </p>
                        <p className="flex items-center gap-1 truncate text-slate-700">
                          <MapPin className="w-3 h-3 text-iqra-gold-600 shrink-0" />
                          <span className="truncate">{slot.classroom}</span>
                        </p>
                        <p className="flex items-center gap-1 truncate text-slate-500 text-[10px]">
                          <User className="w-3 h-3 shrink-0" />
                          <span className="truncate">{slot.instructor}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: DAILY LIST */}
      {viewMode === "daily" && (
        <div className="space-y-4">
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

          <div className="space-y-3">
            {filteredSlots
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

                  <button
                    onClick={() => onDeleteSlot(slot.id)}
                    className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors self-start sm:self-center"
                    title="Remove slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CREATE CLASS SCHEDULE MODAL WITH CONFLICT CHECK */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-heading text-white">Add Class Schedule Slot</h3>
                <p className="text-xs text-blue-200">With Automated Conflict Collision Check</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              {conflictWarning && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-shake">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Scheduling Conflict Prevented:</span>
                    <span className="leading-relaxed">{conflictWarning}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Day of Week</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Class Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab Session</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Start Time</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="08:30 AM"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">End Time</label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    placeholder="10:00 AM"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Select Course</label>
                <select
                  value={newCourseCode}
                  onChange={(e) => {
                    setNewCourseCode(e.target.value);
                    const c = courses.find((crs) => crs.code === e.target.value);
                    if (c) setNewInstructor(c.instructor);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Assigned Instructor</label>
                <input
                  type="text"
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Classroom / Lab</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="Lab 4 - AI Lab"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Building</label>
                  <input
                    type="text"
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                    placeholder="Block B"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold"
                >
                  Verify & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
