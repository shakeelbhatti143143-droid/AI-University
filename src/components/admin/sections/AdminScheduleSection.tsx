"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  AdminScheduleSlot,
  AdminCourse,
  detectScheduleConflicts,
} from "@/lib/admin-data";
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
  CredentialModal,
  CredentialInput,
  CredentialSelect,
  CredentialButton,
} from "@/components/admin/credential";

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
    if (classroomFilter === "All") return true;
    return slot.classroom.includes(classroomFilter);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div
        className="relative overflow-hidden p-6 rounded-[10px] border flex flex-col md:flex-row md:items-center justify-between gap-4 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
        style={{
          backgroundColor: "var(--card-bg, #1D1B18)",
          borderColor: "var(--card-border, #4a4335)",
          borderRadius: "var(--radius-card, 10px)",
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted, #8a8272)" }}
            >
              Master Campus Timetable Engine
            </span>
            <span style={{ color: "var(--text-muted, #8a8272)" }}>•</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              Fall 2026 Session
            </span>
          </div>
          <h2
            className="font-serif text-[26px] font-[500] leading-tight tracking-tight"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            Class Schedule & Conflict Management
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            Configure time slots, assign laboratories and classrooms, and detect overlapping bookings in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="flex items-center gap-1 p-1 rounded-[6px] border"
            style={{
              backgroundColor: "var(--card-bg, #1D1B18)",
              borderColor: "var(--card-border, #4a4335)",
            }}
          >
            <button
              onClick={() => setViewMode("weekly")}
              className="px-3 py-1 rounded-[4px] text-xs font-semibold transition-colors"
              style={{
                backgroundColor: viewMode === "weekly" ? "rgba(255,255,255,0.08)" : "transparent",
                color: viewMode === "weekly" ? "var(--text-heading, #F2EEE4)" : "var(--text-muted, #8a8272)",
              }}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode("daily")}
              className="px-3 py-1 rounded-[4px] text-xs font-semibold transition-colors"
              style={{
                backgroundColor: viewMode === "daily" ? "rgba(255,255,255,0.08)" : "transparent",
                color: viewMode === "daily" ? "var(--text-heading, #F2EEE4)" : "var(--text-muted, #8a8272)",
              }}
            >
              Daily List
            </button>
          </div>

          <button
            onClick={() => {
              setConflictWarning(null);
              setIsCreateOpen(true);
            }}
            className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98]"
            style={{
              borderColor: "var(--accent-gold, #C9A25B)",
              color: "var(--accent-gold, #C9A25B)",
              backgroundColor: "transparent",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Class Slot</span>
          </button>
        </div>
      </div>

      {/* Conflict Engine Notice */}
      <div
        className="p-4 rounded-[10px] border flex items-start gap-3"
        style={{
          backgroundColor: "var(--card-bg, #1D1B18)",
          borderColor: "var(--card-border, #4a4335)",
        }}
      >
        <CheckCircle2
          className="w-5 h-5 shrink-0 mt-0.5"
          style={{ color: "var(--status-success, #7DAE7A)" }}
        />
        <div>
          <h4 className="font-semibold text-xs" style={{ color: "var(--text-heading, #F2EEE4)" }}>
            Automated Conflict Detection Active
          </h4>
          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            The scheduler verifies classroom occupancy and faculty availability in real time. Any overlapping bookings or room collisions are rejected with explicit conflict warnings.
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
                <div
                  className="p-3 rounded-[8px] border text-center"
                  style={{
                    backgroundColor: "var(--card-bg, #1D1B18)",
                    borderColor: "var(--card-border, #4a4335)",
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wider block"
                    style={{ color: "var(--text-muted, #8a8272)" }}
                  >
                    {day}
                  </span>
                  <span className="text-[10px] font-mono mt-0.5 block" style={{ color: "var(--text-muted, #8a8272)" }}>
                    {daySlots.length} Classes
                  </span>
                </div>

                <div className="space-y-3">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="relative overflow-hidden p-4 rounded-[10px] border space-y-2 group before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
                      style={{
                        backgroundColor: "var(--card-bg, #1D1B18)",
                        borderColor: "var(--card-border, #4a4335)",
                      }}
                    >
                      <button
                        onClick={() => onDeleteSlot(slot.id)}
                        className="absolute top-2 right-2 p-1 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/5"
                        style={{ color: "var(--status-danger, #E27878)" }}
                        title="Delete Schedule Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border"
                          style={{
                            borderColor: "var(--card-border, #4a4335)",
                            color: "var(--text-value, #D8D3C6)",
                          }}
                        >
                          {slot.courseCode}
                        </span>
                        <span
                          className="text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase"
                          style={{
                            borderColor: "var(--card-border, #4a4335)",
                            color: "var(--text-muted, #8a8272)",
                          }}
                        >
                          {slot.type}
                        </span>
                      </div>

                      <h4
                        className="font-serif text-[15px] font-[500] leading-snug line-clamp-2"
                        style={{ color: "var(--text-heading, #F2EEE4)" }}
                      >
                        {slot.courseTitle}
                      </h4>

                      <div
                        className="pt-2 border-t text-[11px] space-y-1 font-mono"
                        style={{ borderColor: "var(--card-border, #4a4335)" }}
                      >
                        <p className="flex items-center gap-1.5" style={{ color: "var(--text-value, #D8D3C6)" }}>
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate" style={{ color: "var(--text-value, #D8D3C6)" }}>
                          <MapPin className="w-3 h-3 shrink-0" style={{ color: "var(--text-muted, #8a8272)" }} />
                          <span className="truncate">{slot.classroom}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate text-[10px]" style={{ color: "var(--text-muted, #8a8272)" }}>
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className="h-[32px] px-3.5 rounded-[6px] border text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: selectedDay === day ? "rgba(255,255,255,0.06)" : "var(--card-bg, #1D1B18)",
                  borderColor: selectedDay === day ? "#6a6050" : "var(--card-border, #4a4335)",
                  color: selectedDay === day ? "var(--text-heading, #F2EEE4)" : "var(--text-muted, #8a8272)",
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSlots
              .filter((s) => s.day === selectedDay)
              .map((slot) => (
                <CredentialCard key={slot.id}>
                  <CredentialHeader
                    eyebrow={`${slot.day} • ${slot.type}`}
                    referenceId={slot.courseCode}
                  />

                  <CredentialTitle
                    title={slot.courseTitle}
                    subheading={`Section ${slot.section} • Semester ${slot.semester}`}
                    hasDivider
                  />

                  <CredentialDetailList className="flex-1">
                    <CredentialDetailRow
                      label="Lecture Timings"
                      value={`${slot.startTime} - ${slot.endTime}`}
                    />
                    <CredentialDetailRow
                      label="Venue & Lab"
                      value={`${slot.classroom} (${slot.building})`}
                    />
                    <CredentialDetailRow
                      label="Course Instructor"
                      value={slot.instructor}
                    />
                  </CredentialDetailList>

                  <CredentialFooter
                    primaryAction={{
                      label: "Remove Slot",
                      onClick: () => onDeleteSlot(slot.id),
                    }}
                  />
                </CredentialCard>
              ))}
          </div>
        </div>
      )}

      {/* CREATE SLOT MODAL */}
      <CredentialModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        eyebrow="TIMETABLE ENGINE"
        title="Schedule Class Session"
        description="Verify real-time classroom availability and prevent faculty collision."
        maxWidth="lg"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              onClick={handleCreateSubmit}
            >
              Verify & Schedule
            </CredentialButton>
          </>
        }
      >
        {conflictWarning && (
          <div
            className="p-3.5 rounded-[6px] border flex items-start gap-2.5 text-xs"
            style={{
              borderColor: "var(--status-danger, #E27878)",
              color: "var(--status-danger, #E27878)",
            }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Collision Conflict</p>
              <p className="mt-0.5">{conflictWarning}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <CredentialSelect
              label="Day of Week"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value as any)}
            >
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </CredentialSelect>

            <CredentialSelect
              label="Class Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
            >
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab Session</option>
              <option value="Tutorial">Tutorial</option>
            </CredentialSelect>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CredentialInput
              label="Start Time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              required
            />
            <CredentialInput
              label="End Time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              required
            />
          </div>

          <CredentialSelect
            label="Select Course"
            value={newCourseCode}
            onChange={(e) => {
              setNewCourseCode(e.target.value);
              const c = courses.find((crs) => crs.code === e.target.value);
              if (c) setNewInstructor(c.instructor);
            }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code} — {c.title}
              </option>
            ))}
          </CredentialSelect>

          <CredentialInput
            label="Assigned Instructor"
            value={newInstructor}
            onChange={(e) => setNewInstructor(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <CredentialInput
              label="Classroom / Lab"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              required
            />
            <CredentialInput
              label="Building"
              value={newBuilding}
              onChange={(e) => setNewBuilding(e.target.value)}
              required
            />
          </div>
        </form>
      </CredentialModal>
    </div>
  );
};


