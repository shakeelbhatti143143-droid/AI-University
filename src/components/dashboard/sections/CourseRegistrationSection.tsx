"use client";

import React, { useState } from "react";
import {
  FolderPlus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  User,
  Clock,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  ShieldAlert,
  Calendar,
  XCircle,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  TrendingUp,
  Info,
  ChevronRight,
} from "lucide-react";
import { AvailableCourse, EnrolledCourse, StudentProgressionData } from "@/lib/dashboard-data";

export interface StudentRegistrationRequest {
  _id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  semester: string;
  status: "Pending" | "Approved" | "Rejected" | "Dropped";
  registeredAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  remarks?: string;
}

interface CourseRegistrationSectionProps {
  availableCourses: AvailableCourse[];
  enrolledCourses: EnrolledCourse[];
  registrationRequests?: StudentRegistrationRequest[];
  onRegisterCourse: (course: AvailableCourse) => Promise<void> | void;
  onDropCourse: (courseId: string) => Promise<void> | void;
  departmentName?: string;
  programName?: string;
  currentSemester?: number;
  selectedSemester?: number;
  onSelectSemester?: (semester: number) => void;
  progression?: StudentProgressionData | null;
}

export const CourseRegistrationSection: React.FC<CourseRegistrationSectionProps> = ({
  availableCourses,
  enrolledCourses,
  registrationRequests = [],
  onRegisterCourse,
  onDropCourse,
  departmentName,
  programName,
  currentSemester = 1,
  selectedSemester: controlledSemester,
  onSelectSemester,
  progression,
}) => {
  const [internalSemester, setInternalSemester] = useState<number>(currentSemester);
  const activeSemester = controlledSemester !== undefined ? controlledSemester : internalSemester;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCredits, setSelectedCredits] = useState("All");
  const [activeViewTab, setActiveViewTab] = useState<"catalog" | "queue">("catalog");
  const [expandedSemester, setExpandedSemester] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [submittingCourseId, setSubmittingCourseId] = useState<string | null>(null);

  const highestPassed = progression?.highestPassedSemester ?? 0;
  const nextEligible = progression?.nextEligibleSemester ?? (highestPassed + 1);
  const isCurrentTabPassed = activeSemester <= highestPassed;
  const isCurrentTabUnlocked = activeSemester <= nextEligible;
  const isCurrentTabLocked = activeSemester > nextEligible;

  const totalRegisteredCredits = enrolledCourses.reduce((acc, c) => acc + c.creditHours, 0);
  const MAX_CREDITS = 21; // HEC regular semester maximum limit

  const handleSemesterChange = (sem: number) => {
    if (onSelectSemester) {
      onSelectSemester(sem);
    } else {
      setInternalSemester(sem);
    }
  };

  // Filter available courses strictly by selected semester and criteria
  const filteredAvailable = availableCourses.filter((course) => {
    const courseSem = course.semester || 1;
    if (courseSem !== activeSemester) return false;

    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCredits =
      selectedCredits === "All" || course.creditHours.toString() === selectedCredits;

    return matchesSearch && matchesCredits;
  });

  const handleRegister = async (course: AvailableCourse) => {
    if (isCurrentTabLocked) {
      setFeedbackMessage({
        text: `Registration Blocked: Semester ${activeSemester} is locked. You must successfully complete Semester ${activeSemester - 1} first.`,
        type: "error",
      });
      setTimeout(() => setFeedbackMessage(null), 5000);
      return;
    }

    if (totalRegisteredCredits + course.creditHours > MAX_CREDITS) {
      setFeedbackMessage({
        text: `Registration limit exceeded! Maximum allowed credit hours is ${MAX_CREDITS}.`,
        type: "error",
      });
      setTimeout(() => setFeedbackMessage(null), 5000);
      return;
    }

    try {
      setSubmittingCourseId(course.id);
      await onRegisterCourse(course);
      setFeedbackMessage({
        text: `Registration request for "${course.code}: ${course.title}" submitted. Waiting for Admin approval.`,
        type: "success",
      });
      setTimeout(() => setFeedbackMessage(null), 6000);
    } catch (err: any) {
      setFeedbackMessage({
        text: err?.message || "Failed to submit course registration request.",
        type: "error",
      });
      setTimeout(() => setFeedbackMessage(null), 6000);
    } finally {
      setSubmittingCourseId(null);
    }
  };

  // Count pending and approved requests
  const pendingRequestsCount = registrationRequests.filter((r) => r.status === "Pending").length;
  const approvedRequestsCount = registrationRequests.filter((r) => r.status === "Approved").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Registration Status & Credit Hours Summary Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Registration Period
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-600">Fall 2026 Academic Session</span>
              <span className="text-xs text-slate-300">•</span>
              <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-iqra-blue-700 border border-blue-200/60">
                Your Current Level: Semester {progression?.currentSemester || currentSemester}
              </span>
              {highestPassed > 0 && (
                <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Completed: Semester {highestPassed}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
              Semester Course Registration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {departmentName || programName ? (
                <>
                  <strong className="text-slate-700">{departmentName}</strong>
                  {departmentName && programName ? " • " : ""}
                  <span className="text-iqra-blue-700 font-semibold">{programName}</span>
                </>
              ) : (
                "Academic Course Catalog & Enrollment Portal"
              )}
            </p>
          </div>

          {/* Credit Hours Summary Card */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shrink-0">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Approved Enrolled
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-heading text-iqra-navy-900">
                  {totalRegisteredCredits}
                </span>
                <span className="text-xs font-bold text-slate-400">/ {MAX_CREDITS} Max Cr</span>
              </div>
            </div>
            <div className="h-9 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Approved Courses
              </span>
              <span className="text-2xl font-black font-heading text-emerald-700">
                {enrolledCourses.length}
              </span>
            </div>
            <div className="h-9 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pending Approval
              </span>
              <span className="text-2xl font-black font-heading text-amber-600">
                {pendingRequestsCount}
              </span>
            </div>
          </div>
        </div>

        {/* 1. CONGRATULATORY UNLOCK SUCCESS ALERT (Appears when student completes a semester) */}
        {highestPassed >= 1 && nextEligible > highestPassed && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-blue-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                    🎉 Prerequisite Completed!
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/70 text-emerald-900">
                    Semester {highestPassed} Passed
                  </span>
                </div>
                <p className="text-xs text-emerald-950 mt-0.5 font-medium leading-relaxed">
                  Congratulations! You have successfully completed and passed Semester {highestPassed}. Semester {nextEligible} courses are now unlocked for registration.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSemesterChange(nextEligible)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Register Semester {nextEligible} Courses</span>
              <Unlock className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2. ACADEMIC PROGRESSION & SEQUENTIAL UNLOCK ROADMAP (Semesters 1-8) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-iqra-blue-600" />
              Academic Progression Timeline (Semesters 1 to 8):
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Sequential Course Unlock Status
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
              const semProg = progression?.semesters?.find((s) => s.semesterNumber === sem);
              const isPassed = sem <= highestPassed || semProg?.status === "Passed";
              const isNext = sem === nextEligible;
              const isSelected = activeSemester === sem;
              const isLocked = sem > nextEligible;
              const isFailed = semProg?.status === "Failed Courses";
              const isInProgress = semProg?.status === "In Progress" || (sem === currentSemester && !isPassed && !isLocked);

              let badgeBg = "bg-slate-100 text-slate-500 border-slate-200";
              let statusText = "Locked";
              if (isPassed) {
                badgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
                statusText = "Passed";
              } else if (isNext) {
                badgeBg = "bg-blue-50 text-iqra-blue-700 border-iqra-blue-300 ring-2 ring-iqra-blue-400/30";
                statusText = "Available";
              } else if (isFailed) {
                badgeBg = "bg-rose-50 text-rose-800 border-rose-200";
                statusText = "Failed Courses";
              } else if (isInProgress) {
                badgeBg = "bg-amber-50 text-amber-800 border-amber-200";
                statusText = "In Progress";
              }

              return (
                <div
                  key={sem}
                  onClick={() => handleSemesterChange(sem)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${badgeBg} ${
                    isSelected ? "ring-2 ring-slate-900 shadow-xs" : "hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-slate-900">Sem {sem}</span>
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : isNext ? (
                      <Unlock className="w-3.5 h-3.5 text-iqra-blue-600 shrink-0" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded block truncate ${
                      isPassed
                        ? "bg-emerald-100 text-emerald-800"
                        : isNext
                        ? "bg-blue-100 text-blue-800"
                        : isFailed
                        ? "bg-rose-100 text-rose-800"
                        : isLocked
                        ? "bg-slate-200/60 text-slate-500"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {statusText}
                  </span>

                  {isPassed && semProg && (
                    <div className="text-[10px] font-bold text-slate-700">
                      GPA: <span className="text-emerald-700">{semProg.gpa > 0 ? semProg.gpa.toFixed(2) : "4.00"}</span>
                    </div>
                  )}

                  {isLocked && (
                    <span className="text-[9px] text-slate-400 truncate">
                      Req: Sem {sem - 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Accordion / Expandable Completed Courses List for Passed Semesters */}
          {highestPassed > 0 && (
            <div className="pt-1">
              <button
                onClick={() => setExpandedSemester(expandedSemester ? null : highestPassed)}
                className="text-xs font-bold text-iqra-blue-700 hover:text-iqra-blue-900 flex items-center gap-1 transition-colors"
              >
                <span>
                  {expandedSemester
                    ? `Hide Passed Semester ${highestPassed} Courses`
                    : `View Passed Semester ${highestPassed} Course Grades (${progression?.semesters?.find((s) => s.semesterNumber === highestPassed)?.courses?.length || "Completed"})`}
                </span>
                {expandedSemester ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {expandedSemester && (
                <div className="mt-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-200">
                    <span className="font-bold text-slate-800">
                      Official Passed Courses for Semester {expandedSemester}:
                    </span>
                    <span className="font-bold text-emerald-700">
                      Term Status: ✓ Successfully Passed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {progression?.semesters
                      ?.find((s) => s.semesterNumber === expandedSemester)
                      ?.courses?.map((c, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="font-mono font-bold text-iqra-navy-900 text-[11px] block">
                              {c.code}
                            </span>
                            <span className="text-slate-700 font-medium text-xs">{c.title}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 block">
                              Grade: {c.grade} ({c.gradePoints.toFixed(2)} GP)
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                              {c.creditHours} Cr. Hrs
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Semester Selector Tabs */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-iqra-blue-600" />
              Select Semester Offerings:
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Currently viewing <strong>Semester {activeSemester}</strong>
              {isCurrentTabLocked && (
                <span className="text-rose-600 font-bold ml-1.5">(🔒 Locked)</span>
              )}
              {isCurrentTabPassed && (
                <span className="text-emerald-600 font-bold ml-1.5">(✓ Passed)</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
              const isSelected = activeSemester === sem;
              const isStudentCurrent = currentSemester === sem;
              const isPassed = sem <= highestPassed;
              const isLocked = sem > nextEligible;
              const isNext = sem === nextEligible;

              return (
                <button
                  key={sem}
                  onClick={() => handleSemesterChange(sem)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-iqra-navy-900 text-white shadow-sm ring-2 ring-iqra-blue-500/20"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
                  }`}
                >
                  <span>Semester {sem}</span>
                  {isPassed && <CheckCircle2 className={`w-3 h-3 ${isSelected ? "text-emerald-400" : "text-emerald-600"}`} />}
                  {isNext && !isPassed && <Unlock className={`w-3 h-3 ${isSelected ? "text-iqra-gold-400" : "text-iqra-blue-600"}`} />}
                  {isLocked && <Lock className={`w-3 h-3 ${isSelected ? "text-slate-400" : "text-slate-400"}`} />}
                  {isStudentCurrent && (
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                        isSelected ? "bg-iqra-gold-400 text-slate-950" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert if present */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150 ${
              feedbackMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : feedbackMessage.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-blue-50 border-blue-200 text-blue-900"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {feedbackMessage.type === "error" && <AlertCircle className="w-4 h-4 text-rose-600" />}
              {feedbackMessage.type === "info" && <Info className="w-4 h-4 text-blue-600" />}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs font-bold underline hover:opacity-80 ml-4 shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switcher: Catalog vs Registration Queue */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveViewTab("catalog")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeViewTab === "catalog"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Available Courses ({filteredAvailable.length})
          </button>
          <button
            onClick={() => setActiveViewTab("queue")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeViewTab === "queue"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>My Registration Requests ({registrationRequests.length})</span>
            {pendingRequestsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* VIEW TAB 1: CATALOG OF AVAILABLE COURSES */}
      {activeViewTab === "catalog" && (
        <>
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search course title, code, instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Credit Hours:</span>
                <select
                  value={selectedCredits}
                  onChange={(e) => setSelectedCredits(e.target.value)}
                  className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="All">All Credits</option>
                  <option value="2">2 Credit Hours</option>
                  <option value="3">3 Credit Hours</option>
                  <option value="4">4 Credit Hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Semester {activeSemester} Offerings</span>
                <span className="text-xs font-normal text-slate-400">
                  ({filteredAvailable.length} course{filteredAvailable.length !== 1 ? "s" : ""})
                </span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Admin-Approved Academic Offerings
              </span>
            </div>

            {isCurrentTabLocked ? (
              <div className="p-10 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
                  <Lock className="w-8 h-8 text-slate-600" />
                </div>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 uppercase">
                    Academic Prerequisite Locked
                  </span>
                  <h4 className="text-xl font-black font-heading text-slate-900 pt-1">
                    Semester {activeSemester} is Currently Locked
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    You cannot register for Semester {activeSemester} courses until you have successfully completed and passed all required courses in Semester {activeSemester - 1}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Progression Policy Rule:
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Current Highest Passed Semester: <strong>{highestPassed > 0 ? `Semester ${highestPassed}` : "None (Semester 1 in progress)"}</strong>.
                    Your active semester eligible for enrollment is <strong>Semester {nextEligible}</strong>.
                  </p>
                </div>

                <button
                  onClick={() => handleSemesterChange(nextEligible)}
                  className="px-5 py-2.5 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2"
                >
                  <span>Go to Semester {nextEligible} Offerings</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : isCurrentTabPassed ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      You have successfully passed Semester {activeSemester}. These courses are officially completed and archived in your transcript.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAvailable.map((course) => (
                    <div
                      key={course.id}
                      className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-iqra-navy-900 text-white">
                              {course.code}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {course.creditHours} Cr. Hrs
                            </span>
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                              Sem {course.semester || activeSemester} (Passed)
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Completed ✓
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                        <div className="space-y-1 text-xs text-slate-600 pt-1">
                          <p className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Instructor: <strong>{course.instructor}</strong></span>
                          </p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Course Passed / Completed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredAvailable.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  No courses available for Semester {activeSemester}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  The Administration has not published active courses for Semester {activeSemester} in your degree program yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAvailable.map((course) => {
                  const isFull = course.availableSeats <= 0;
                  const isEnrolled = course.isEnrolled || enrolledCourses.some((c) => c.code === course.code);
                  const isPending = course.isPending || course.registrationStatus === "Pending";
                  const isRejected = course.isRejected || course.registrationStatus === "Rejected";
                  const isSubmitting = submittingCourseId === course.id;

                  return (
                    <div
                      key={course.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-iqra-blue-400/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        {/* Top: Code, Semester, Credit hours, Seats */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-iqra-navy-900 text-white">
                              {course.code}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {course.creditHours} Cr. Hrs
                            </span>
                            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              Sem {course.semester || activeSemester}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              course.availableSeats < 10
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {course.availableSeats} / {course.totalSeats} Seats Left
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        {/* Instructor & Schedule */}
                        <div className="space-y-1 text-xs text-slate-600 pt-1">
                          <p className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              Instructor: <strong>{course.instructor}</strong>
                            </span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{course.schedule}</span>
                          </p>
                        </div>

                        {/* Prerequisites */}
                        {course.prerequisites && course.prerequisites.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 text-[11px]">
                            <span className="text-slate-400 font-semibold">Prerequisites: </span>
                            <span className="text-slate-700 font-medium">
                              {course.prerequisites.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Smart Registration Button States */}
                      <div className="pt-2">
                        {isEnrolled ? (
                          <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Registered</span>
                          </div>
                        ) : isPending ? (
                          <div className="w-full py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                            <span>Pending Approval</span>
                          </div>
                        ) : isRejected ? (
                          <div className="space-y-1.5">
                            <div className="w-full py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-center gap-1.5">
                              <XCircle className="w-4 h-4 text-rose-600" />
                              <span>Registration Rejected</span>
                            </div>
                            {course.registrationRemarks && (
                              <p className="text-[10px] text-rose-600 text-center italic">
                                Remarks: {course.registrationRemarks}
                              </p>
                            )}
                            <button
                              onClick={() => handleRegister(course)}
                              disabled={isSubmitting}
                              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-iqra-navy-900 hover:text-white text-slate-800 text-xs font-bold transition-all shadow-xs"
                            >
                              {isSubmitting ? "Submitting..." : "Re-submit Registration Request"}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRegister(course)}
                            disabled={isFull || isSubmitting}
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                              isFull
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                : "bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white shadow-slate-900/10"
                            }`}
                          >
                            <Plus className="w-4 h-4 text-iqra-gold-400" />
                            <span>
                              {isSubmitting
                                ? "Submitting Request..."
                                : isFull
                                ? "Course Full (Waitlist Only)"
                                : "Register Course (+)"}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEW TAB 2: MY REGISTRATION REQUESTS & APPROVAL STATUS LEDGER */}
      {activeViewTab === "queue" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Registration Requests & Approval Ledger ({registrationRequests.length})
            </h3>
            <p className="text-xs text-slate-500">
              Track the approval status of courses requested for your academic term. Pending courses appear in <strong>My Courses</strong> once approved.
            </p>
          </div>

          {registrationRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <Clock className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No course registration requests submitted yet.</p>
              <p className="text-[11px] text-slate-500">
                Select courses from the catalog tab and click <strong>Register Course</strong> to submit your enrollment request.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">Course Code & Title</th>
                    <th className="pb-3 font-bold text-center">Semester</th>
                    <th className="pb-3 font-bold text-center">Credit Hours</th>
                    <th className="pb-3 font-bold">Requested On</th>
                    <th className="pb-3 font-bold text-center">Status</th>
                    <th className="pb-3 font-bold">Admin Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrationRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5">
                        <span className="font-mono font-bold text-iqra-blue-700 block">
                          {req.courseCode}
                        </span>
                        <span className="text-slate-800 font-medium">{req.courseTitle}</span>
                      </td>

                      <td className="py-3.5 text-center font-bold text-slate-700">
                        {req.semester}
                      </td>

                      <td className="py-3.5 text-center font-mono font-bold text-slate-800">
                        {req.creditHours} Cr
                      </td>

                      <td className="py-3.5 text-slate-500 text-[11px]">
                        {new Date(req.registeredAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : req.status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {req.status === "Approved" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {req.status === "Pending" && <Clock className="w-3 h-3 text-amber-600 animate-pulse" />}
                          {req.status === "Rejected" && <XCircle className="w-3 h-3 text-rose-600" />}
                          <span>{req.status === "Pending" ? "Pending Approval" : req.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 text-slate-600 text-[11px]">
                        {req.remarks ? req.remarks : req.status === "Pending" ? "Awaiting review by Registrar Office" : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
