"use client";

import React, { useState } from "react";
import {
  Award,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  FileCheck2,
  User,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface Examination {
  _id: string;
  title: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  examType: "Midterm" | "Final" | "Quiz" | "Practical" | "Presentation";
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  building: string;
  campus: string;
  facultyName: string;
  instructions: string[];
  requiredMaterials: string[];
  duration: string;
  seatNumber?: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Postponed";
  importantNotes?: string;
  createdAt: number;
}

interface AdminExaminationsSectionProps {
  examinations: Examination[];
  courses: Array<{ id: string; code: string; title: string }>;
  onCreateExamination: (data: any) => Promise<void>;
}

export const AdminExaminationsSection: React.FC<AdminExaminationsSectionProps> = ({
  examinations,
  courses,
  onCreateExamination,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "Midterm Examination",
    courseCode: courses[0]?.code || "CS-201",
    courseTitle: courses[0]?.title || "Data Structures & Algorithms",
    section: "A",
    examType: "Midterm" as const,
    date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    day: "Monday",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    room: "Lab 204",
    building: "Computing Department",
    campus: "Chak Shehzad Campus, Islamabad",
    facultyName: "Dr. Arshad Mehmood",
    duration: "2 Hours (120 Mins)",
    instructions: "Iqra University ID Card and Admit Slip are mandatory for entry. Electronic gadgets strictly prohibited.",
    requiredMaterials: "Student ID Card, Admit Slip, Stationery",
    seatNumber: "Assigned on Venue Board",
    importantNotes: "Covers Weeks 1 to 7. Constitutes 25% of total course marks.",
  });

  const filteredExams = examinations.filter((e) => {
    const matchesSearch =
      e.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All" || e.examType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCourseChange = (code: string) => {
    const c = courses.find((x) => x.code === code);
    setFormData((prev) => ({
      ...prev,
      courseCode: code,
      courseTitle: c?.title || prev.courseTitle,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const parsedInstructions = formData.instructions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedMaterials = formData.requiredMaterials
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await onCreateExamination({
        title: formData.title,
        courseId: formData.courseCode,
        courseCode: formData.courseCode,
        courseTitle: formData.courseTitle,
        section: formData.section,
        examType: formData.examType,
        date: formData.date,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
        building: formData.building,
        campus: formData.campus,
        facultyName: formData.facultyName,
        instructions: parsedInstructions.length > 0 ? parsedInstructions : ["Standard Exam Protocol"],
        requiredMaterials: parsedMaterials.length > 0 ? parsedMaterials : ["Student ID Card"],
        duration: formData.duration,
        seatNumber: formData.seatNumber,
        importantNotes: formData.importantNotes,
        adminName: user?.name || "Administrator",
        adminEmail: user?.email || "admin@isb.iqra.edu.pk",
      });

      setIsCreateModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to schedule examination.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" />
              Examination Controller Office
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Terminals</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Examination Management & Rosters
          </h2>
          <p className="text-xs text-slate-500">
            Schedule midterms, finals, practical vivas, allocate examination halls, and broadcast admit rosters.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 self-start md:self-auto transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Examination</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search examinations by course code, title, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
        >
          <option value="All">All Exam Types</option>
          <option value="Midterm">Midterm</option>
          <option value="Final">Final</option>
          <option value="Quiz">Quiz</option>
          <option value="Practical">Practical</option>
          <option value="Presentation">Presentation</option>
        </select>
      </div>

      {/* Examinations Cards */}
      {filteredExams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No examinations scheduled yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Examinations scheduled here will automatically appear in enrolled students' Examination Timetable.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((e) => (
            <div
              key={e._id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-iqra-blue-800 border border-blue-200/60 font-mono">
                      {e.courseCode} • Sec {e.section}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 leading-tight">
                      {e.courseTitle}
                    </h3>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                    {e.examType}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {e.date} ({e.day})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">
                      {e.startTime} - {e.endTime} ({e.duration})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {e.room}, {e.building}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Invigilator: {e.facultyName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Published to Students
                </span>
                <button
                  onClick={() => setSelectedExam(e)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCHEDULE EXAM MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black font-heading text-slate-900">
                Schedule Academic Examination
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course *</label>
                  <select
                    value={formData.courseCode}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section *</label>
                  <input
                    type="text"
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Type *</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Midterm">Midterm</option>
                    <option value="Final">Final</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Practical">Practical</option>
                    <option value="Presentation">Presentation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Day *</label>
                  <input
                    type="text"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    placeholder="e.g. Tuesday"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time *</label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="12:00 PM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room / Lab *</label>
                  <input
                    type="text"
                    required
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Lab 204"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Building</label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    placeholder="Computing Department"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Invigilator / Faculty</label>
                <input
                  type="text"
                  value={formData.facultyName}
                  onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                  placeholder="Dr. Arshad Mehmood"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Important Instructions</label>
                <textarea
                  rows={2}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="One instruction per line..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing..." : "Save Examination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW EXAM MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-iqra-blue-800">
                  {selectedExam.courseCode}
                </span>
                <h3 className="text-xl font-black font-heading text-slate-900 mt-1">
                  {selectedExam.courseTitle}
                </h3>
                <p className="text-xs font-bold text-amber-600">{selectedExam.examType} Examination</p>
              </div>
              <button
                onClick={() => setSelectedExam(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold">{selectedExam.date} ({selectedExam.day})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time:</span>
                <span className="font-semibold">{selectedExam.startTime} - {selectedExam.endTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Venue:</span>
                <span>{selectedExam.room}, {selectedExam.building}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Invigilator:</span>
                <span>{selectedExam.facultyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span>{selectedExam.duration}</span>
              </div>
            </div>

            {selectedExam.importantNotes && (
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Examination Note:</span>
                {selectedExam.importantNotes}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedExam(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
