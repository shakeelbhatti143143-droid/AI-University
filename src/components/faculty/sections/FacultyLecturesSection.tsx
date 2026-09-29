"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Play,
  FileText,
  Video,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Upload,
  Link2,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  X,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { LectureFileUploader, UploadedFileMetadata } from "@/components/lms/LectureFileUploader";
import { LectureRichTextEditor, LectureContentRenderer } from "@/components/lms/LectureRichTextEditor";
import { PdfViewerModal } from "@/components/lms/PdfViewerModal";

interface CourseWithStats {
  id: string;
  code: string;
  name: string;
  department: string;
  creditHours: number;
  semester: number;
  totalLectures: number;
  publishedCount: number;
  draftCount: number;
  enrolledStudentsCount: number;
  avgCompletionPercentage: number;
}

interface LectureRow {
  id: string;
  title: string;
  description: string;
  lectureNumber: number;
  lectureType?: string;
  lectureDate?: number;
  videoUrl?: string;
  videoStorageId?: string;
  thumbnailUrl?: string;
  duration: string;
  status: "published" | "draft";
  publishedAt?: number;
  createdAt: number;
  resourceCount: number;
  viewsCount: number;
  completedCount: number;
}

interface FacultyLecturesSectionProps {
  initialCourseId?: string;
}

export const FacultyLecturesSection: React.FC<FacultyLecturesSectionProps> = ({
  initialCourseId,
}) => {
  const { user, token } = useAuth();

  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialCourseId || null);
  const [lectures, setLectures] = useState<LectureRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLecturesLoading, setIsLecturesLoading] = useState(false);

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [previewLecture, setPreviewLecture] = useState<any | null>(null);
  const [viewingPdf, setViewingPdf] = useState<{ url: string; title: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Upload/Edit Form Fields
  const [formCourseId, setFormCourseId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLectureNumber, setFormLectureNumber] = useState<number | undefined>(undefined);
  const [formLectureType, setFormLectureType] = useState("Video");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formVideoStorageId, setFormVideoStorageId] = useState<string | undefined>(undefined);
  const [formDuration, setFormDuration] = useState("45 minutes");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [formResources, setFormResources] = useState<
    Array<{ name: string; url: string; storageId?: string; fileType: string; fileSize?: number }>
  >([]);

  // Resource manual/uploaded toggle
  const [showResourceUploader, setShowResourceUploader] = useState(false);

  // Load teacher assigned courses
  const loadTeacherCourses = async () => {
    try {
      setIsLoading(true);
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const res = await client.query(api.lms.getTeacherCoursesWithStats, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
        });
        if (res) {
          setCourses(res as CourseWithStats[]);
          if (!selectedCourseId && res.length > 0) {
            setSelectedCourseId(res[0].id);
          }
          if (res.length > 0 && !formCourseId) {
            setFormCourseId(res[0].id);
          }
        }
      }
    } catch (err) {
      console.warn("Could not load teacher courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherCourses();
  }, [user, token]);

  // Load lectures when a course is selected
  const loadLecturesForCourse = async (courseId: string) => {
    try {
      setIsLecturesLoading(true);
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const res = await client.query(api.lms.getTeacherCourseLectures, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          courseId,
        });
        if (res?.lectures) {
          setLectures(res.lectures as LectureRow[]);
        }
      }
    } catch (err) {
      console.warn("Could not load lectures:", err);
    } finally {
      setIsLecturesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      loadLecturesForCourse(selectedCourseId);
    }
  }, [selectedCourseId]);

  const resetForm = () => {
    setEditingLectureId(null);
    setFormTitle("");
    setFormDescription("");
    setFormLectureNumber(undefined);
    setFormLectureType("Video");
    setFormVideoUrl("");
    setFormVideoStorageId(undefined);
    setFormDuration("45 minutes");
    setFormStatus("published");
    setFormResources([]);
    setShowResourceUploader(false);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    if (selectedCourseId) {
      setFormCourseId(selectedCourseId);
    } else if (courses.length > 0) {
      setFormCourseId(courses[0].id);
    }
    setIsUploadModalOpen(true);
  };

  const handleOpenEditModal = async (lec: LectureRow) => {
    setEditingLectureId(lec.id);
    setFormCourseId(selectedCourseId || "");
    setFormTitle(lec.title);
    setFormDescription(lec.description);
    setFormLectureNumber(lec.lectureNumber);
    setFormLectureType(lec.lectureType || "Video");
    setFormVideoUrl(lec.videoUrl || "");
    setFormVideoStorageId(lec.videoStorageId);
    setFormDuration(lec.duration || "45 minutes");
    setFormStatus(lec.status);

    // Fetch full lecture detail including resources
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const detail = await client.query(api.lms.getStudentCourseLectures, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          courseId: selectedCourseId || "",
        });
        const matched = detail?.lectures?.find((l: any) => l.id === lec.id);
        if (matched?.resources) {
          setFormResources(
            matched.resources.map((r: any) => ({
              name: r.name,
              url: r.url,
              storageId: r.storageId,
              fileType: r.fileType,
              fileSize: r.fileSize,
            }))
          );
        }
      }
    } catch {
      // ignore
    }

    setIsUploadModalOpen(true);
  };

  const handleVideoFileUploaded = (meta: UploadedFileMetadata | null) => {
    if (meta) {
      setFormVideoStorageId(meta.storageId);
      if (meta.url) setFormVideoUrl(meta.url);
    } else {
      setFormVideoStorageId(undefined);
    }
  };

  const handleResourceFileUploaded = (meta: UploadedFileMetadata | null) => {
    if (meta) {
      setFormResources((prev) => [
        ...prev,
        {
          name: meta.name,
          url: meta.url || "",
          storageId: meta.storageId,
          fileType: meta.fileType,
          fileSize: meta.fileSize,
        },
      ]);
      setShowResourceUploader(false);
    }
  };

  const handleRemoveResource = (index: number) => {
    setFormResources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCourseId || !formTitle.trim() || !formDescription.trim()) {
      alert("Please fill in the course, title, and description.");
      return;
    }

    try {
      setIsSubmitting(true);
      const client = getConvexClient();
      if (!client || !isConvexConfigured) {
        throw new Error("Convex backend is not configured.");
      }

      if (editingLectureId) {
        // UPDATE EXISTING LECTURE
        await client.mutation(api.lms.updateLecture, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          lectureId: editingLectureId as any,
          title: formTitle.trim(),
          description: formDescription.trim(),
          lectureNumber: formLectureNumber,
          lectureType: formLectureType,
          videoUrl: formVideoUrl.trim() || undefined,
          videoStorageId: formVideoStorageId,
          duration: formDuration.trim() || "45 minutes",
          status: formStatus,
          resources: formResources,
        });

        alert("Lecture updated successfully!");
      } else {
        // CREATE NEW LECTURE
        await client.mutation(api.lms.uploadLecture, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          courseId: formCourseId,
          title: formTitle.trim(),
          description: formDescription.trim(),
          lectureNumber: formLectureNumber,
          lectureType: formLectureType,
          videoUrl: formVideoUrl.trim() || undefined,
          videoStorageId: formVideoStorageId,
          duration: formDuration.trim() || "45 minutes",
          status: formStatus,
          resources: formResources,
        });

        alert(
          formStatus === "published"
            ? "Lecture published! Enrolled students have been notified."
            : "Draft lecture saved."
        );
      }

      setIsUploadModalOpen(false);
      resetForm();

      if (selectedCourseId) {
        await loadLecturesForCourse(selectedCourseId);
        await loadTeacherCourses();
      }
    } catch (err: any) {
      alert(`Operation failed: ${err?.message || "Server error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLecture = async (lectureId: string, title: string) => {
    if (
      !confirm(`Are you sure you want to delete "${title}"? Attached resources will be permanently removed.`)
    ) {
      return;
    }

    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        await client.mutation(api.lms.deleteLecture, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          lectureId: lectureId as any,
        });
        if (selectedCourseId) {
          await loadLecturesForCourse(selectedCourseId);
          await loadTeacherCourses();
        }
      }
    } catch (err: any) {
      alert(`Deletion failed: ${err?.message || "Server error"}`);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const filteredLectures = lectures.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1528] border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 uppercase flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Faculty LMS Management
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Curriculum &amp; Resource Delivery
            </span>
          </div>
          <h1 className="text-2xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
            Lecture Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload video lessons directly, attach PDF presentations and documents, format syllabus notes, and track student completion.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload New Lecture</span>
        </button>
      </div>

      {/* ASSIGNED COURSES STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => {
          const isSelected = c.id === selectedCourseId;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={cn(
                "p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3",
                isSelected
                  ? "bg-gradient-to-br from-slate-900 to-[#0A1A3A] text-white border-blue-500 shadow-lg shadow-blue-900/15"
                  : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200/90 dark:border-slate-800 hover:border-blue-300 shadow-xs"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider",
                      isSelected
                        ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    )}
                  >
                    {c.code}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isSelected ? "text-slate-300" : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {c.creditHours} Cr. Hrs
                  </span>
                </div>

                <h3
                  className={cn(
                    "font-bold text-sm truncate",
                    isSelected ? "text-white" : "text-slate-900 dark:text-white"
                  )}
                >
                  {c.name}
                </h3>
                <p
                  className={cn(
                    "text-[11px] truncate",
                    isSelected ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {c.department}
                </p>
              </div>

              {/* STATS METRIC ROW */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/40 text-center">
                <div className={cn("p-2 rounded-xl", isSelected ? "bg-white/5" : "bg-slate-50 dark:bg-slate-800/60")}>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total</div>
                  <div className="text-xs font-black">{c.totalLectures}</div>
                </div>
                <div className={cn("p-2 rounded-xl", isSelected ? "bg-white/5" : "bg-slate-50 dark:bg-slate-800/60")}>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Published</div>
                  <div className="text-xs font-black">{c.publishedCount}</div>
                </div>
                <div className={cn("p-2 rounded-xl", isSelected ? "bg-white/5" : "bg-slate-50 dark:bg-slate-800/60")}>
                  <div className="text-[10px] uppercase font-bold text-amber-400">Enrolled</div>
                  <div className="text-xs font-black">{c.enrolledStudentsCount}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED COURSE LECTURE DIRECTORY */}
      {selectedCourse && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1528] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 px-2.5 py-0.5 rounded-md">
                  {selectedCourse.code}
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedCourse.name} — Curriculum Syllabus
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage uploaded videos, downloadable resources, and formatted learning outcomes.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search lectures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44 sm:w-56"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lecture</span>
              </button>
            </div>
          </div>

          {/* LECTURES TABLE / LIST */}
          {isLecturesLoading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : filteredLectures.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Video className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {searchQuery ? "No matching lectures found" : "No lectures uploaded yet for this course"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Click &quot;Add Lecture&quot; to upload your video lesson, attach PDF slide presentations, and publish notes for students.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLectures.map((lec) => {
                const isPub = lec.status === "published";

                return (
                  <div
                    key={lec.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center font-bold text-slate-800 dark:text-slate-100 shrink-0 shadow-2xs">
                        <span className="text-[8px] uppercase text-blue-600 dark:text-blue-400 font-black">LEC</span>
                        <span className="text-xs font-extrabold leading-none">{lec.lectureNumber}</span>
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                              isPub
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            )}
                          >
                            {lec.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {lec.duration}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {lec.resourceCount} Resource{lec.resourceCount !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {lec.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {lec.description}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        <span className="font-bold text-slate-800 dark:text-white">{lec.viewsCount}</span> Views
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(lec)}
                        className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        title="Edit Lecture"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteLecture(lec.id, lec.title)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Lecture"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT LECTURE MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0B1528] text-slate-900 dark:text-slate-100 w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  {editingLectureId ? <Edit className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {editingLectureId ? "Edit Course Lecture" : "Create & Upload Course Lecture"}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Direct video and file uploads saved securely to database.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLecture} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              {/* Course Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Course Assignment *
                </label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  required
                  disabled={!!editingLectureId}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {courses.length === 0 ? (
                    <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-400">
                      {isLoading ? "Loading your assigned courses..." : "No assigned courses found"}
                    </option>
                  ) : (
                    <>
                      <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-400">
                        -- Select an Assigned Course --
                      </option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {c.code} — {c.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* Title & Lecture Number */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Lecture Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Introduction to Neural Networks"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Lecture #</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Auto"
                    value={formLectureNumber || ""}
                    onChange={(e) => setFormLectureNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Description & Rich Text Editor */}
              <LectureRichTextEditor
                label="Lecture Description & Syllabus Learning Outcomes"
                required
                value={formDescription}
                onChange={setFormDescription}
                placeholder="Outline core topics, concepts covered, and required readings..."
                rows={4}
              />

              {/* Lecture Type & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Lecture Type</label>
                  <select
                    value={formLectureType}
                    onChange={(e) => setFormLectureType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Video" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Video Lecture</option>
                    <option value="Document" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Document / Reading</option>
                    <option value="Hybrid" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Hybrid (Video & Slides)</option>
                    <option value="Lab" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Lab Demonstration</option>
                    <option value="Seminar" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Guest Seminar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 minutes"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Video File Direct Upload or URL */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <LectureFileUploader
                  label="Lecture Video File (Upload directly from device)"
                  accept="video/mp4,video/webm,.mp4,.webm,.mkv"
                  maxSizeMB={500}
                  allowedExtensions={["mp4", "webm", "mkv"]}
                  helperText="Optional: MP4 or WebM video file"
                  onFileUploaded={handleVideoFileUploaded}
                  initialFile={
                    formVideoStorageId
                      ? {
                          name: "Uploaded Lecture Video",
                          fileType: "mp4",
                          fileSize: 1000000,
                          storageId: formVideoStorageId,
                          url: formVideoUrl,
                        }
                      : null
                  }
                />

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Or specify external Video Stream URL:
                  </span>
                  <input
                    type="url"
                    placeholder="https://... (MP4, CDN, S3, or standard stream)"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Publication Visibility
                </label>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "published"}
                      onChange={() => setFormStatus("published")}
                      className="accent-blue-600"
                    />
                    <span className="text-slate-800 dark:text-slate-200">
                      Published (Enrolled students receive instant notification)
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "draft"}
                      onChange={() => setFormStatus("draft")}
                      className="accent-blue-600"
                    />
                    <span className="text-slate-800 dark:text-slate-200">Draft (Private)</span>
                  </label>
                </div>
              </div>

              {/* Attached Resources Section */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Supplementary Study Resources (PDF, PPT, DOCX, ZIP)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowResourceUploader(!showResourceUploader)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showResourceUploader ? "Cancel File" : "Upload File"}</span>
                  </button>
                </div>

                {/* Direct file uploader for resources */}
                {showResourceUploader && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in">
                    <LectureFileUploader
                      label="Select Educational Resource from Device"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt,.png,.jpg"
                      allowedExtensions={["pdf", "doc", "docx", "ppt", "pptx", "zip", "txt", "png", "jpg"]}
                      onFileUploaded={handleResourceFileUploaded}
                    />
                  </div>
                )}

                {/* List of attached resources */}
                {formResources.length > 0 ? (
                  <div className="space-y-1.5">
                    {formResources.map((r, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {r.name}
                          </span>
                          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {r.fileType}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {r.fileType.toLowerCase() === "pdf" && r.url && (
                            <button
                              type="button"
                              onClick={() => setViewingPdf({ url: r.url, title: r.name })}
                              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveResource(idx)}
                            className="text-rose-500 hover:text-rose-700 font-bold px-1.5 py-0.5 rounded"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No resources attached yet.</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  {isSubmitting ? "Saving..." : editingLectureId ? "Update Lecture" : "Publish Lecture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF VIEWER MODAL */}
      {viewingPdf && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setViewingPdf(null)}
          pdfUrl={viewingPdf.url}
          title={viewingPdf.title}
        />
      )}
    </div>
  );
};
