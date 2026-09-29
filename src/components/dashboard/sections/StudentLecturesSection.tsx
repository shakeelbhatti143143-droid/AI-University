"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  Layers,
  ArrowRight,
  FileText,
  Video,
  ChevronLeft,
  Calendar,
  User,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { LecturePlayerModal, LectureItem } from "../modals/LecturePlayerModal";

interface CourseLectureGroup {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  teacherName: string;
  creditHours: number;
  department: string;
  semester: string;
  totalLectures: number;
  completedLectures: number;
  newLecturesCount: number;
  progressPercent: number;
}

interface StudentLecturesSectionProps {
  initialCourseId?: string;
  onNavigateTab?: (tab: any) => void;
}

export const StudentLecturesSection: React.FC<StudentLecturesSectionProps> = ({
  initialCourseId,
  onNavigateTab,
}) => {
  const router = useRouter();
  const { user, token } = useAuth();

  // State
  const [courseGroups, setCourseGroups] = useState<CourseLectureGroup[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialCourseId || null);
  const [courseDetailData, setCourseDetailData] = useState<{
    course: any;
    lectures: LectureItem[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeLectureForPlayer, setActiveLectureForPlayer] = useState<LectureItem | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "NEW" | "COMPLETED" | "UNCOMPLETED">("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "LECTURE_NUM">("NEWEST");

  // Load course groups
  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const groups = await client.query(api.lms.getStudentCoursesWithLectures, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
        });
        if (groups) {
          setCourseGroups(groups as CourseLectureGroup[]);
        }
      }
    } catch (err) {
      console.warn("Failed to load courses with lectures:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [user, token]);

  // Load course lecture details when a course is selected
  const loadCourseLectures = async (courseId: string) => {
    try {
      setIsDetailLoading(true);
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const detail = await client.query(api.lms.getStudentCourseLectures, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          courseId,
        });
        if (detail) {
          setCourseDetailData(detail as any);
        }
      }
    } catch (err) {
      console.warn("Failed to load course lecture details:", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseLectures(selectedCourseId);
    } else {
      setCourseDetailData(null);
    }
  }, [selectedCourseId]);

  // Update progress locally & trigger refresh
  const handleProgressUpdated = (lectureId: string, progress: number, completed: boolean) => {
    if (courseDetailData) {
      const updated = courseDetailData.lectures.map((lec) => {
        if (lec.id === lectureId) {
          return {
            ...lec,
            progressPercent: progress,
            isCompleted: completed,
            status: completed ? ("COMPLETED" as const) : ("IN_PROGRESS" as const),
          };
        }
        return lec;
      });

      const completedCount = updated.filter((l) => l.isCompleted).length;
      const totalCount = updated.length;
      const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      setCourseDetailData({
        ...courseDetailData,
        course: {
          ...courseDetailData.course,
          completedLectures: completedCount,
          progressPercent: pct,
        },
        lectures: updated,
      });

      // Update active player lecture state too
      if (activeLectureForPlayer && activeLectureForPlayer.id === lectureId) {
        setActiveLectureForPlayer({
          ...activeLectureForPlayer,
          progressPercent: progress,
          isCompleted: completed,
          status: completed ? "COMPLETED" : "IN_PROGRESS",
        });
      }

      // Reload overarching course groups
      loadCourses();
    }
  };

  const handleManualMarkComplete = async (lectureId: string) => {
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        await client.mutation(api.lms.saveLectureProgress, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          lectureId: lectureId as any,
          progress: 100,
          lastPosition: 100,
          completed: true,
        });
        handleProgressUpdated(lectureId, 100, true);
      }
    } catch (err) {
      console.warn("Failed to mark complete:", err);
    }
  };

  // --------------------------------------------------------------------------
  // VIEW 2: COURSE LECTURE DETAILS VIEW
  // --------------------------------------------------------------------------
  if (selectedCourseId && courseDetailData) {
    const { course, lectures } = courseDetailData;

    // Filter lectures in course view
    let filteredLectures = lectures.filter((lec) => {
      const matchesQuery =
        lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `lecture ${lec.lectureNumber}`.includes(searchQuery.toLowerCase());

      if (!matchesQuery) return false;

      if (statusFilter === "NEW") return lec.isNew;
      if (statusFilter === "COMPLETED") return lec.isCompleted;
      if (statusFilter === "UNCOMPLETED") return !lec.isCompleted;
      return true;
    });

    if (sortBy === "NEWEST") {
      filteredLectures.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "OLDEST") {
      filteredLectures.sort((a, b) => a.createdAt - b.createdAt);
    } else {
      filteredLectures.sort((a, b) => a.lectureNumber - b.lectureNumber);
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* TOP NAVIGATION BACK BUTTON */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedCourseId(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Courses</span>
          </button>

          <Link
            href={`/student/lectures/${selectedCourseId}`}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Direct Course URL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* COURSE HEADER BANNER */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-iqra-navy-900 to-blue-950 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {course.code}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-iqra-gold-400" />
                Teacher: <strong className="text-white">{course.teacherName}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              {course.title}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Official video curriculum, syllabus lectures, and downloadable study resources for this course.
            </p>
          </div>

          {/* PROGRESS METRIC CARD */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shrink-0 min-w-[220px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Course Progress</span>
              <span className="font-extrabold text-iqra-gold-400 font-mono">
                {course.progressPercent}%
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Completed</span>
              <span className="font-bold text-white">
                {course.completedLectures} / {course.totalLectures} Lectures
              </span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lectures by topic or lecture number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 text-xs font-semibold text-slate-600">
              {(["ALL", "NEW", "COMPLETED", "UNCOMPLETED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-colors capitalize",
                    statusFilter === st ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"
                  )}
                >
                  {st.toLowerCase()}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="NEWEST">Sort: Newest First</option>
              <option value="OLDEST">Sort: Oldest First</option>
              <option value="LECTURE_NUM">Sort: Lecture 01 First</option>
            </select>
          </div>
        </div>

        {/* LECTURES LIST (CARDS) */}
        {filteredLectures.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <Video className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No lectures found matching criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check your search query or reset your status filter to see all course lectures.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLectures.map((lec) => {
              const lecNumStr = lec.lectureNumber < 10 ? `0${lec.lectureNumber}` : `${lec.lectureNumber}`;
              const isNew = lec.isNew;
              const isComp = lec.isCompleted;

              return (
                <div
                  key={lec.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Lecture Number Pill / Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/70 flex flex-col items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-600">LEC</span>
                      <span className="text-base font-black text-slate-900 leading-none">{lecNumStr}</span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isNew && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white uppercase tracking-wider animate-pulse">
                            NEW
                          </span>
                        )}
                        {isComp && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            COMPLETED
                          </span>
                        )}
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {lec.duration}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          Uploaded: {new Date(lec.publishedAt || lec.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {lec.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {lec.description}
                      </p>

                      {/* Resource count indicator */}
                      {lec.resources && lec.resources.length > 0 && (
                        <div className="pt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>{lec.resources.length} Downloadable Resource{lec.resources.length > 1 ? "s" : ""}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    {!isComp && (
                      <button
                        onClick={() => handleManualMarkComplete(lec.id)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        title="Mark as completed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mark Complete</span>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveLectureForPlayer(lec)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Lecture</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LECTURE VIDEO PLAYER MODAL */}
        <LecturePlayerModal
          lecture={activeLectureForPlayer}
          isOpen={!!activeLectureForPlayer}
          onClose={() => setActiveLectureForPlayer(null)}
          onProgressUpdated={handleProgressUpdated}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW 1: COURSE-WISE LECTURE DIRECTORY (MAIN PAGE)
  // --------------------------------------------------------------------------
  const filteredCourses = courseGroups.filter((g) => {
    const matches =
      g.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matches) return false;
    if (statusFilter === "NEW") return g.newLecturesCount > 0;
    if (statusFilter === "COMPLETED") return g.progressPercent >= 100;
    if (statusFilter === "UNCOMPLETED") return g.progressPercent < 100;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Learning Management System
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Academic Session</span>
          </div>
          <h1 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            My Lectures
          </h1>
          <p className="text-xs text-slate-500">
            Access lectures from all your enrolled courses in one place.
          </p>
        </div>

        {/* Badges summary */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-2.5 text-xs">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              {courseGroups.reduce((acc, c) => acc + c.newLecturesCount, 0)}
            </div>
            <div>
              <div className="font-bold text-blue-900">New Lectures</div>
              <div className="text-[10px] text-blue-700">Awaiting your review</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enrolled courses by title or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-100 p-0.5 text-xs font-semibold text-slate-600">
            {(["ALL", "NEW", "COMPLETED", "UNCOMPLETED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  "px-3 py-1 rounded-lg transition-colors capitalize",
                  statusFilter === st ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"
                )}
              >
                {st.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COURSE-WISE LECTURE SECTIONS (NOT ONE HUGE LIST) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs animate-pulse space-y-4">
              <div className="h-5 w-24 bg-slate-200 rounded-md" />
              <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
              <div className="h-2 w-full bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No enrolled courses with lectures found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You must be enrolled in approved courses to access learning modules and lecture video materials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCourses.map((course) => (
            <div
              key={course.courseCode}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* TOP COURSE INFO */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                    {course.courseCode}
                  </span>

                  {course.newLecturesCount > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs animate-pulse">
                      {course.newLecturesCount} New Lecture{course.newLecturesCount > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      0 New Lectures
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black font-heading text-slate-900 group-hover:text-blue-600 transition-colors">
                    {course.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instructor: <strong className="text-slate-700">{course.teacherName}</strong>
                  </p>
                </div>

                {/* STATS ROW */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Curriculum</span>
                    <span className="font-extrabold text-slate-800 text-sm">{course.totalLectures} Lectures</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Completed</span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      {course.completedLectures} / {course.totalLectures}
                    </span>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-blue-600 font-mono font-bold">{course.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedCourseId(course.courseId || course.courseCode)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs group-hover:bg-blue-600"
                >
                  <span>View Lectures</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
