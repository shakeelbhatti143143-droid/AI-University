"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CalendarClock,
  Clock,
  MapPin,
  Building2,
  User,
  AlertCircle,
  FileCheck2,
  Search,
  Filter,
  ChevronRight,
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle2,
  Download,
  Printer,
  X,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Examination, ExamType, ExamStatus } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface ExaminationsSectionProps {
  examinations: Examination[];
  onOpenAdmitSlip?: () => void;
}

export const ExaminationsSection: React.FC<ExaminationsSectionProps> = ({
  examinations,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"timetable" | "calendar">("timetable");
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);

  // Find next upcoming exam for the hero countdown
  const upcomingExams = useMemo(() => {
    return examinations
      .filter((e) => e.status === "Upcoming")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [examinations]);

  const nextExam = upcomingExams[0] || null;

  // Real-time Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nextExam) return;

    const calculateCountdown = () => {
      // Parse exam date and start time (e.g., "2026-09-22 10:00 AM")
      const examDateTimeStr = `${nextExam.date} ${nextExam.startTime.replace(/[^\x00-\x7F]/g, "").trim()}`;
      const targetTime = new Date(examDateTimeStr).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextExam]);

  // Filter and search
  const filteredExams = useMemo(() => {
    return examinations.filter((exam) => {
      // Filter logic
      if (selectedFilter === "Upcoming" && exam.status !== "Upcoming") return false;
      if (selectedFilter === "Completed" && exam.status !== "Completed") return false;
      if (selectedFilter === "Midterms" && exam.examType !== "Midterm") return false;
      if (selectedFilter === "Finals" && exam.examType !== "Final") return false;
      if (selectedFilter === "Practical" && exam.examType !== "Practical") return false;

      // Search logic
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = exam.courseTitle.toLowerCase().includes(q);
        const matchCode = exam.courseCode.toLowerCase().includes(q);
        const matchInstructor = exam.instructor.toLowerCase().includes(q);
        const matchRoom = exam.room.toLowerCase().includes(q);
        return matchTitle || matchCode || matchInstructor || matchRoom;
      }

      return true;
    });
  }, [examinations, selectedFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP HEADER & ADMIT SLIP DOWNLOAD ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#050e1d] via-[#0a192f] to-[#0c2340] border border-slate-800 text-white shadow-xl shadow-slate-950/20">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iqra-gold-500/20 border border-iqra-gold-400/30 text-iqra-gold-300 text-xs font-bold">
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Iqra University Examination Directorate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Examinations & Assessment Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Chak Shehzad Campus, Islamabad • Fall 2026 Academic Term
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
            title="Print Timetable"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Print Timetable</span>
          </button>

          <button
            onClick={() => {
              alert(
                "Iqra University Admit Slip generation: Your official digital exam slip with QR verification is downloaded."
              );
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-iqra-blue-600 to-iqra-blue-700 hover:from-iqra-blue-500 hover:to-iqra-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-iqra-blue-900/30"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Admit Slip</span>
          </button>
        </div>
      </div>

      {/* 2. UPCOMING EXAMS HIGHLIGHT CARD (WITH LIVE COUNTDOWN) */}
      {nextExam && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1f3a] via-[#0f284d] to-[#163866] border border-blue-500/30 p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20">
          {/* Subtle background glow */}
          <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-12 w-52 h-52 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Exam Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  Next Scheduled Examination
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/15">
                  {nextExam.examType} Exam
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-iqra-gold-400">
                  {nextExam.courseCode}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight mt-0.5">
                  {nextExam.courseTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CalendarIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <strong>{nextExam.date}</strong> ({nextExam.day})
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-200">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{nextExam.time}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-200">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    Room: <strong>{nextExam.roomNumber}</strong> • {nextExam.building}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-200">
                  <User className="w-4 h-4 text-iqra-gold-400 shrink-0" />
                  <span>Instructor: {nextExam.instructor}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setSelectedExam(nextExam)}
                  className="px-4 py-2 rounded-xl bg-white text-iqra-navy-950 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>View Instructions & Venue Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Premium Countdown Box */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-black/35 backdrop-blur-md border border-white/15 p-5 text-center shadow-inner">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-cyan-300 block mb-3">
                  Starts In
                </span>

                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white block">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Days</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white block">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Hours</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white block">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Mins</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-iqra-gold-400 block">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Secs</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 px-1">
                  <span>Assigned Seat:</span>
                  <span className="font-mono font-bold text-iqra-gold-400">
                    {nextExam.seatNumber || "Hall A - Seat 14"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTROLS, SEARCH & VIEW SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {["All", "Upcoming", "Completed", "Midterms", "Finals", "Practical"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
                  selectedFilter === filter
                    ? "bg-iqra-navy-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course, code, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20 focus:border-iqra-blue-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/70">
            <button
              onClick={() => setViewMode("timetable")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                viewMode === "timetable"
                  ? "bg-white text-iqra-navy-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Timetable
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                viewMode === "calendar"
                  ? "bg-white text-iqra-navy-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT VIEW (TIMETABLE OR CALENDAR) */}
      {filteredExams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
            <CalendarClock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Upcoming Examinations</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No examinations matching "${searchQuery}". Clear your search or change the filter.`
              : "Your examination schedule will appear here once published by the university."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : viewMode === "timetable" ? (
        /* TIMETABLE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam) => {
            const isCompleted = exam.status === "Completed";
            const isUpcoming = exam.status === "Upcoming";

            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-iqra-blue-400/80 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 relative"
              >
                {/* Top badges */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-iqra-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {exam.courseCode}
                    </span>
                    <span className="ml-2 text-[10px] font-semibold text-slate-500">
                      {exam.examType}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      isUpcoming
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : isCompleted
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {exam.status}
                  </span>
                </div>

                {/* Course Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-iqra-blue-700 transition-colors line-clamp-1">
                    {exam.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{exam.instructor}</span>
                  </p>
                </div>

                {/* Date & Time Grid */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-iqra-blue-600" />
                      <span className="font-semibold">{exam.date}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{exam.day}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-iqra-blue-600" />
                      <span>{exam.time}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{exam.duration}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700 pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="font-bold text-[11px] text-slate-800 truncate">
                      Room {exam.roomNumber} • {exam.building}
                    </span>
                  </div>
                </div>

                {/* Footer action */}
                <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-iqra-blue-700 group-hover:text-iqra-blue-800">
                  <span>View Details & Instructions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CALENDAR / TIMELINE VIEW */
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Examination Timeline & Calendar Map
              </h3>
              <p className="text-[11px] text-slate-500">
                Sequential exam dates for Fall 2026 Academic Term
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              {filteredExams.length} Scheduled Sessions
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-iqra-blue-600 before:via-purple-500 before:to-slate-200">
            {filteredExams.map((exam) => {
              const isNext = exam.id === nextExam?.id;
              return (
                <div key={exam.id} className="relative group">
                  {/* Timeline bullet node */}
                  <div
                    className={cn(
                      "absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center transition-all",
                      isNext
                        ? "bg-rose-500 ring-4 ring-rose-500/20 scale-110"
                        : exam.status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-iqra-blue-600"
                    )}
                  />

                  {/* Timeline Card */}
                  <div
                    onClick={() => setSelectedExam(exam)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/70 hover:border-iqra-blue-400/80 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{exam.date}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-500">{exam.day}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-iqra-blue-800 font-bold">
                          {exam.courseCode}
                        </span>
                        {isNext && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                            Next Exam
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{exam.courseTitle}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Time: {exam.time}</span>
                        <span>•</span>
                        <span>
                          Room: <strong>{exam.roomNumber}</strong> ({exam.building})
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={cn(
                          "text-[10px] px-2.5 py-1 rounded-full font-bold uppercase",
                          exam.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-purple-100 text-purple-800"
                        )}
                      >
                        {exam.status}
                      </span>
                      <button className="text-xs text-iqra-blue-600 hover:text-iqra-blue-800 font-bold flex items-center gap-1">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. EXAM DETAILS MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 custom-scrollbar animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-100 text-iqra-blue-800">
                    {selectedExam.courseCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                    {selectedExam.examType} Examination
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      selectedExam.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {selectedExam.status}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                  {selectedExam.courseTitle}
                </h3>
              </div>

              <button
                onClick={() => setSelectedExam(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Schedule & Venue Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Date & Timing
                </span>
                <p className="font-bold text-slate-800 text-sm">
                  {selectedExam.date} ({selectedExam.day})
                </p>
                <p className="text-slate-600 font-medium">
                  {selectedExam.time} ({selectedExam.duration})
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Examination Venue
                </span>
                <p className="font-bold text-slate-800 text-sm">
                  Room: {selectedExam.roomNumber}
                </p>
                <p className="text-slate-600 font-medium">
                  {selectedExam.building} • {selectedExam.campus}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Course Instructor & Invigilator
                </span>
                <p className="font-bold text-slate-800 text-sm">{selectedExam.instructor}</p>
                <p className="text-slate-600 font-medium text-[11px]">
                  Board: {selectedExam.invigilator || "Central Exam Board"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Candidate Seat Number
                </span>
                <p className="font-mono font-black text-iqra-blue-700 text-sm">
                  {selectedExam.seatNumber || "Hall A - Seat 14"}
                </p>
                <p className="text-slate-600 font-medium text-[11px]">Admit Slip Verified</p>
              </div>
            </div>

            {/* Mandatory Exam Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Important Examination Instructions</span>
              </h4>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-950 space-y-1.5">
                {selectedExam.instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Materials */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Required Materials & Equipment</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedExam.requiredMaterials.map((mat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{mat}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            {selectedExam.importantNotes && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-iqra-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Important Note: </span>
                  {selectedExam.importantNotes}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedExam(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Exam Slip downloaded for ${selectedExam.courseTitle}`);
                }}
                className="px-4 py-2 rounded-xl bg-iqra-navy-900 text-white text-xs font-bold hover:bg-iqra-navy-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Exam Admit Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
