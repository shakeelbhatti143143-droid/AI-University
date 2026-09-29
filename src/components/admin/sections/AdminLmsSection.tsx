"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  BookOpen,
  Users,
  Play,
  Calendar,
  Clock,
  Radio,
  Search,
  CheckCircle2,
  Trash2,
  AlertCircle,
  FileText,
  UserCheck,
  Shield,
  Layers,
  ArrowRight,
  BarChart3,
  ExternalLink,
  Plus,
  Edit,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { LectureFileUploader, UploadedFileMetadata } from "@/components/lms/LectureFileUploader";
import { LectureRichTextEditor, LectureContentRenderer } from "@/components/lms/LectureRichTextEditor";
import { LecturePlayerModal } from "@/components/dashboard/modals/LecturePlayerModal";
import { PdfViewerModal } from "@/components/lms/PdfViewerModal";

interface AdminLmsSectionProps {
  subTab?: "lectures" | "assignments";
}

export const AdminLmsSection: React.FC<AdminLmsSectionProps> = ({ subTab = "lectures" }) => {
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState<"lectures" | "assignments">(
    subTab === "assignments" ? "assignments" : "lectures"
  );
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allFaculty, setAllFaculty] = useState<any[]>([]);
  const [allLectures, setAllLectures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Lecture Modal State
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lecture Form fields
  const [formCourseId, setFormCourseId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLectureNumber, setFormLectureNumber] = useState<number | undefined>(undefined);
  const [formLectureType, setFormLectureType] = useState("Video");
  const [formLectureDate, setFormLectureDate] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formVideoStorageId, setFormVideoStorageId] = useState<string | undefined>(undefined);
  const [formThumbnailUrl, setFormThumbnailUrl] = useState("");
  const [formThumbnailStorageId, setFormThumbnailStorageId] = useState<string | undefined>(undefined);
  const [formDuration, setFormDuration] = useState("45 minutes");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [formResources, setFormResources] = useState<
    Array<{ name: string; url: string; storageId?: string; fileType: string; fileSize?: number }>
  >([]);

  // Modals for Player and PDF viewer
  const [previewLecture, setPreviewLecture] = useState<any | null>(null);
  const [viewingPdf, setViewingPdf] = useState<{ url: string; title: string } | null>(null);

  // Assign Teacher Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignCourseId, setAssignCourseId] = useState("");
  const [assignFacultyId, setAssignFacultyId] = useState("");

  const loadAdminLmsData = async () => {
    try {
      setIsLoading(true);
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const [stats, courses, faculty, lectures] = await Promise.all([
          client.query(api.lms.getAdminLmsOverview, {
            token: token || undefined,
            email: user?.universityEmail || user?.email,
          }),
          client.query(api.academicManagement.getCourses, {}),
          client.query(api.academicManagement.getFacultyMembers, {}),
          client.query(api.lms.getAdminAllLectures, {
            token: token || undefined,
            email: user?.universityEmail || user?.email,
          }).catch(() => []),
        ]);

        if (stats) setOverviewStats(stats);
        if (courses) setAllCourses(courses);
        if (faculty) setAllFaculty(faculty);
        if (lectures) setAllLectures(lectures);
      }
    } catch (err) {
      console.warn("Could not load admin LMS data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminLmsData();
  }, [user, token]);

  // Open Create Lecture Modal
  const handleOpenCreateModal = () => {
    setEditingLectureId(null);
    setFormCourseId(allCourses[0]?._id ? String(allCourses[0]._id) : "");
    setFormTitle("");
    setFormDescription("");
    setFormLectureNumber(undefined);
    setFormLectureType("Video");
    setFormLectureDate(new Date().toISOString().slice(0, 10));
    setFormVideoUrl("");
    setFormVideoStorageId(undefined);
    setFormThumbnailUrl("");
    setFormThumbnailStorageId(undefined);
    setFormDuration("45 minutes");
    setFormStatus("published");
    setFormResources([]);
    setIsLectureModalOpen(true);
  };

  // Open Edit Lecture Modal
  const handleOpenEditModal = (lec: any) => {
    setEditingLectureId(lec.id);
    setFormCourseId(lec.courseId || "");
    setFormTitle(lec.title || "");
    setFormDescription(lec.description || "");
    setFormLectureNumber(lec.lectureNumber);
    setFormLectureType(lec.lectureType || "Video");
    setFormLectureDate(
      lec.lectureDate
        ? new Date(lec.lectureDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    );
    setFormVideoUrl(lec.videoUrl || "");
    setFormVideoStorageId(lec.videoStorageId);
    setFormThumbnailUrl(lec.thumbnailUrl || "");
    setFormThumbnailStorageId(lec.thumbnailStorageId);
    setFormDuration(lec.duration || "45 minutes");
    setFormStatus(lec.status || "published");
    setFormResources(
      lec.resources?.map((r: any) => ({
        name: r.name,
        url: r.url,
        storageId: r.storageId,
        fileType: r.fileType,
        fileSize: r.fileSize,
      })) || []
    );
    setIsLectureModalOpen(true);
  };

  // Save Lecture (Create or Update)
  const handleSaveLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter a lecture title.");
      return;
    }
    if (!formCourseId) {
      alert("Please select a target curriculum course.");
      return;
    }

    try {
      setIsSubmitting(true);
      const client = getConvexClient();
      if (!client || !isConvexConfigured) return;

      const durMins = parseInt(formDuration) || 45;
      const lectureTimestamp = formLectureDate ? new Date(formLectureDate).getTime() : Date.now();

      if (editingLectureId) {
        await client.mutation(api.lms.updateLecture, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          lectureId: editingLectureId as any,
          title: formTitle.trim(),
          description: formDescription.trim(),
          lectureNumber: formLectureNumber,
          lectureType: formLectureType,
          lectureDate: lectureTimestamp,
          videoUrl: formVideoUrl.trim() || undefined,
          videoStorageId: formVideoStorageId,
          thumbnailUrl: formThumbnailUrl.trim() || undefined,
          thumbnailStorageId: formThumbnailStorageId,
          duration: formDuration.trim(),
          durationMinutes: durMins,
          status: formStatus,
          resources: formResources,
        });
        alert("Lecture updated successfully!");
      } else {
        await client.mutation(api.lms.uploadLecture, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          courseId: formCourseId,
          title: formTitle.trim(),
          description: formDescription.trim(),
          lectureNumber: formLectureNumber,
          lectureType: formLectureType,
          lectureDate: lectureTimestamp,
          videoUrl: formVideoUrl.trim() || undefined,
          videoStorageId: formVideoStorageId,
          thumbnailUrl: formThumbnailUrl.trim() || undefined,
          thumbnailStorageId: formThumbnailStorageId,
          duration: formDuration.trim(),
          durationMinutes: durMins,
          status: formStatus,
          resources: formResources,
        });
        alert("Lecture published and broadcasted to enrolled students!");
      }

      setIsLectureModalOpen(false);
      await loadAdminLmsData();
    } catch (err: any) {
      alert(`Lecture save failed: ${err?.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Lecture
  const handleDeleteLecture = async (lectureId: string, lectureTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete the lecture "${lectureTitle}" and all its attached resources?`)) {
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
        await loadAdminLmsData();
        alert("Lecture removed permanently.");
      }
    } catch (err: any) {
      alert(`Lecture deletion failed: ${err?.message}`);
    }
  };


  // Assign Teacher handler
  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCourseId || !assignFacultyId) return;

    const facultyObj = allFaculty.find((f) => String(f._id) === assignFacultyId);
    if (!facultyObj) return;

    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        await client.mutation(api.lms.assignTeacherToCourse, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          courseId: assignCourseId,
          facultyId: assignFacultyId,
          facultyName: facultyObj.fullName,
        });

        setIsAssignModalOpen(false);
        await loadAdminLmsData();
        alert(`Instructor ${facultyObj.fullName} successfully assigned to course!`);
      }
    } catch (err: any) {
      alert(`Assignment failed: ${err?.message}`);
    }
  };

  // Filtered lectures list
  const filteredLectures = allLectures.filter((lec) => {
    const matchesSearch =
      lec.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-[#0B1528] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              Central Registrar & LMS Governance
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-semibold text-slate-400">Institutional Curriculum</span>
          </div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">
            LMS Lectures Governance
          </h1>
          <p className="text-xs text-slate-400">
            Create and audit university lectures, manage course syllabus resources, and assign faculty instructors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Lecture</span>
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all border border-slate-700"
          >
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Assign Teacher</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW STATS METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Total Lectures</span>
            <Play className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {allLectures.length || overviewStats?.totalLectures || 0}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">
            {allLectures.filter((l) => l.status === "published").length} Published
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Published Curricula</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {overviewStats?.publishedLecturesCount || allLectures.filter((l) => l.status === "published").length}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold">
            Active Lecture Materials
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Enrolled Curriculum Courses</span>
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {allCourses.length}
          </div>
          <div className="text-[10px] text-indigo-300 font-semibold">
            Faculty Assigned
          </div>
        </div>
      </div>

      {/* SUB-TABS (LECTURES VS ASSIGNMENTS) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center rounded-xl bg-slate-950 p-1 text-xs font-bold text-slate-400 border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("lectures")}
            className={cn(
              "px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 flex-1 sm:flex-initial justify-center",
              activeTab === "lectures" ? "bg-blue-600 text-white shadow-xs" : "hover:text-white"
            )}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Curriculum Lectures ({allLectures.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={cn(
              "px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 flex-1 sm:flex-initial justify-center",
              activeTab === "assignments" ? "bg-blue-600 text-white shadow-xs" : "hover:text-white"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course Faculty ({allCourses.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeTab === "lectures" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          )}

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lectures, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: CURRICULUM LECTURES MANAGEMENT */}
      {activeTab === "lectures" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Institutional Lectures Directory
              </h3>
              <p className="text-xs text-slate-400">
                Full CRUD control: Create, edit descriptions, manage uploads, attach resources, and preview student experience.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lecture</span>
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Loading university lectures...
            </div>
          ) : filteredLectures.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <Play className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-semibold">No lectures found matching your filter.</p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-2 text-xs font-bold text-blue-400 hover:text-blue-300"
              >
                + Create the first lecture
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLectures.map((lec) => (
                <div
                  key={lec.id}
                  className="rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
                >
                  <div>
                    {/* THUMBNAIL / PREVIEW BANNER */}
                    <div className="relative aspect-video bg-slate-900 border-b border-slate-800/80 flex items-center justify-center overflow-hidden">
                      {lec.thumbnailUrl ? (
                        <img
                          src={lec.thumbnailUrl}
                          alt={lec.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-600">
                          <Play className="w-8 h-8 text-slate-700" />
                          <span className="text-[10px] uppercase font-bold tracking-wider">No Thumbnail</span>
                        </div>
                      )}

                      {/* BADGES ON THUMBNAIL */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-600 text-white">
                          {lec.courseCode}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-black uppercase",
                            lec.status === "published"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          )}
                        >
                          {lec.status}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-slate-300">
                        {lec.duration || "45 mins"}
                      </div>
                    </div>

                    {/* CONTENT BODY */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300 truncate">{lec.courseTitle}</span>
                        {lec.lectureType && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-400 font-bold">{lec.lectureType}</span>
                          </>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {lec.title}
                      </h4>

                      {/* FORMATTED DESCRIPTION SNIPPET */}
                      <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {lec.description ? (
                          lec.description.replace(/[#*`_\[\]]/g, "").slice(0, 120)
                        ) : (
                          <span className="italic text-slate-500">No description entered</span>
                        )}
                      </div>

                      {/* ATTACHED RESOURCES LIST */}
                      {lec.resources && lec.resources.length > 0 && (
                        <div className="pt-2 border-t border-slate-900 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase text-slate-500">
                            {lec.resources.length} Attachment{lec.resources.length !== 1 ? "s" : ""}:
                          </span>
                          {lec.resources.map((r: any, idx: number) => {
                            const isPdf = r.fileType?.includes("pdf") || r.name.toLowerCase().endsWith(".pdf");
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (isPdf) {
                                    setViewingPdf({ url: r.url, title: r.name });
                                  } else {
                                    window.open(r.url, "_blank");
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-medium text-slate-300 hover:text-white border border-slate-800 transition-colors"
                              >
                                <FileText className="w-2.5 h-2.5 text-blue-400" />
                                <span className="truncate max-w-[100px]">{r.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewLecture(lec)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-500/30"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(lec)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Lecture"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLecture(lec.id, lec.title)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 hover:text-rose-200 transition-colors border border-rose-900/40"
                        title="Delete Lecture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* TAB 3: COURSE FACULTY ASSIGNMENTS */}
      {activeTab === "assignments" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Faculty Course Assignments
              </h3>
              <p className="text-xs text-slate-400">
                Authorize instructors to upload lectures and host virtual classrooms for curriculum courses.
              </p>
            </div>
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assign Faculty</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCourses
              .filter(
                (c) =>
                  c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((c) => (
                <div
                  key={c._id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      {c.code}
                    </span>
                    <span className="text-slate-400">{c.creditHours} Credits</span>
                  </div>

                  <h4 className="font-bold text-white text-sm truncate">{c.name}</h4>
                  <p className="text-slate-400 truncate">
                    Assigned Faculty:{" "}
                    <strong className={c.facultyName ? "text-emerald-400" : "text-amber-400"}>
                      {c.facultyName || "Pending Assignment"}
                    </strong>
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <span className="text-slate-500">Department: {c.department || "CS"}</span>
                    <button
                      onClick={() => {
                        setAssignCourseId(String(c._id));
                        setIsAssignModalOpen(true);
                      }}
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Change Assignment
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT LECTURE MODAL */}
      {isLectureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-3xl max-h-[90vh] rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingLectureId ? "Edit Curriculum Lecture" : "Create New Curriculum Lecture"}
                </h3>
                <p className="text-xs text-slate-400">
                  Fill in all lecture details, format descriptions, upload device files, and set publishing visibility.
                </p>
              </div>
              <button
                onClick={() => setIsLectureModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLecture} className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
              {/* Target Course & Lecture Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Target Course *</label>
                  <select
                    value={formCourseId}
                    onChange={(e) => setFormCourseId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="">Select Course...</option>
                    {allCourses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Lecture Type</label>
                  <select
                    value={formLectureType}
                    onChange={(e) => setFormLectureType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="Video">Video Recording</option>
                    <option value="Slide Deck">Slide Deck & Reading</option>
                    <option value="Lab Demonstration">Lab Demonstration</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                  </select>
                </div>
              </div>

              {/* Title & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">Lecture Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems Consensus & Paxos Protocol"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 minutes"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Status & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Publishing Status *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="published">Published (Visible to Enrolled Students)</option>
                    <option value="draft">Draft (Private to Faculty & Admin)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Lecture Date</label>
                  <input
                    type="date"
                    value={formLectureDate}
                    onChange={(e) => setFormLectureDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Formatted Description / Rich Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Lecture Description & Notes (Rich Text)</label>
                <LectureRichTextEditor
                  value={formDescription}
                  onChange={setFormDescription}
                  placeholder="Enter detailed syllabus topics, markdown notes, code snippets, or reference links..."
                />
              </div>

              {/* File Uploads: Video & Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>Upload Lecture Video</span>
                  </label>
                  <LectureFileUploader
                    label="Lecture Video File"
                    accept="video/mp4,video/webm,.mp4,.webm,.mkv"
                    maxSizeMB={500}
                    allowedExtensions={["mp4", "webm", "mkv"]}
                    helperText="Upload video file (MP4, WebM)"
                    onFileUploaded={(file: UploadedFileMetadata | null) => {
                      if (file) {
                        setFormVideoUrl(file.url || "");
                        setFormVideoStorageId(file.storageId);
                      } else {
                        setFormVideoUrl("");
                        setFormVideoStorageId(undefined);
                      }
                    }}
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
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Upload Lecture Thumbnail</span>
                  </label>
                  <LectureFileUploader
                    label="Lecture Thumbnail Image"
                    accept="image/*,.png,.jpg,.jpeg,.webp"
                    maxSizeMB={15}
                    allowedExtensions={["png", "jpg", "jpeg", "webp"]}
                    helperText="Upload thumbnail image"
                    onFileUploaded={(file: UploadedFileMetadata | null) => {
                      if (file) {
                        setFormThumbnailUrl(file.url || "");
                        setFormThumbnailStorageId(file.storageId);
                      } else {
                        setFormThumbnailUrl("");
                        setFormThumbnailStorageId(undefined);
                      }
                    }}
                    initialFile={
                      formThumbnailStorageId
                        ? {
                            name: "Thumbnail Image",
                            fileType: "jpg",
                            fileSize: 500000,
                            storageId: formThumbnailStorageId,
                            url: formThumbnailUrl,
                          }
                        : null
                    }
                  />
                </div>
              </div>

              {/* Resource Attachments */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Attach Educational Resources (PDF, PPT, DOC, ZIP, TXT)</span>
                </label>

                <LectureFileUploader
                  label="Upload Educational Document"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt,.xlsx,.csv"
                  maxSizeMB={100}
                  allowedExtensions={["pdf", "doc", "docx", "ppt", "pptx", "zip", "txt", "xlsx", "csv"]}
                  onFileUploaded={(file: UploadedFileMetadata | null) => {
                    if (file) {
                      setFormResources((prev) => [
                        ...prev,
                        {
                          name: file.name,
                          url: file.url || "",
                          storageId: file.storageId,
                          fileType: file.fileType,
                          fileSize: file.fileSize,
                        },
                      ]);
                    }
                  }}
                />

                {/* Attached resources chips */}
                {formResources.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-400">Attached Documents ({formResources.length}):</span>
                    <div className="flex flex-wrap gap-2">
                      {formResources.map((res, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{res.name}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormResources((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="text-slate-400 hover:text-rose-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal footer action buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLectureModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
                >
                  {isSubmitting ? "Saving..." : editingLectureId ? "Save Lecture Changes" : "Create & Publish Lecture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ASSIGN TEACHER MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Assign Faculty to Course</h3>
            <p className="text-xs text-slate-400">
              Select the curriculum course and the faculty instructor to grant lecture upload and class management permissions.
            </p>

            <form onSubmit={handleAssignTeacher} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Course *</label>
                <select
                  value={assignCourseId}
                  onChange={(e) => setAssignCourseId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="">Select Course...</option>
                  {allCourses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Faculty Instructor *</label>
                <select
                  value={assignFacultyId}
                  onChange={(e) => setAssignFacultyId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="">Select Faculty Member...</option>
                  {allFaculty.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.fullName} ({f.designation} - {f.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW LECTURE PLAYER MODAL */}
      {previewLecture && (
        <LecturePlayerModal
          isOpen={!!previewLecture}
          lecture={{
            id: previewLecture.id,
            courseId: previewLecture.courseId || "",
            courseCode: previewLecture.courseCode || "",
            courseTitle: previewLecture.courseTitle || "",
            teacherName: previewLecture.teacherName || "Instructor",
            title: previewLecture.title,
            description: previewLecture.description,
            lectureNumber: previewLecture.lectureNumber || 1,
            videoUrl: previewLecture.videoUrl || "",
            thumbnailUrl: previewLecture.thumbnailUrl,
            duration: previewLecture.duration || "45 mins",
            durationMinutes: previewLecture.durationMinutes || 45,
            createdAt: previewLecture.createdAt || Date.now(),
            status: "COMPLETED",
            progressPercent: 100,
            lastPosition: 0,
            isCompleted: true,
            isNew: false,
            resources: previewLecture.resources,
          }}
          onClose={() => setPreviewLecture(null)}
        />
      )}

      {/* PDF VIEWER MODAL */}
      {viewingPdf && (
        <PdfViewerModal
          isOpen={!!viewingPdf}
          pdfUrl={viewingPdf.url}
          title={viewingPdf.title}
          onClose={() => setViewingPdf(null)}
        />
      )}

    </div>
  );
};
