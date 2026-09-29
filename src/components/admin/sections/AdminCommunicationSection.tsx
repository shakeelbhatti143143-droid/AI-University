"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  Send,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Users,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Star,
  Edit2,
  Trash2,
  ShieldAlert,
  Search,
  Check,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
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

export interface Announcement {
  _id: string;
  title: string;
  message: string;
  sender: string;
  category: "University" | "Department" | "Course" | "Exam" | "Student-specific";
  targetAudience: string;
  department?: string;
  courseCode?: string;
  priority: "High" | "Normal" | "Urgent";
  publishDate: string;
  status: "Published" | "Draft" | "Archived";
  createdAt: number;
  createdByRole?: "ADMIN" | "FACULTY";
  createdByUserId?: string;
  visibility?: "PUBLIC" | "INTERNAL" | "AUTHENTICATED";
  isFeatured?: boolean;
  imageUrl?: string;
}

interface AdminCommunicationSectionProps {
  initialTab?: "announcements" | "notifications";
  announcements: Announcement[];
  onCreateAnnouncement: (data: any) => Promise<void>;
  onUpdateAnnouncement?: (data: any) => Promise<void>;
  onUpdateStatus?: (id: string, status: "Published" | "Draft" | "Archived") => Promise<void>;
  onUpdateVisibility?: (id: string, visibility: "PUBLIC" | "INTERNAL") => Promise<void>;
  onToggleFeatured?: (id: string, isFeatured: boolean) => Promise<void>;
  onDeleteAnnouncement?: (id: string) => Promise<void>;
}

export const AdminCommunicationSection: React.FC<AdminCommunicationSectionProps> = ({
  initialTab = "announcements",
  announcements,
  onCreateAnnouncement,
  onUpdateAnnouncement,
  onUpdateStatus,
  onUpdateVisibility,
  onToggleFeatured,
  onDeleteAnnouncement,
}) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<"all" | "public" | "internal" | "drafts" | "faculty">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data shape
  type CategoryType = "University" | "Department" | "Course" | "Exam" | "Student-specific";
  type PriorityType = "Normal" | "High" | "Urgent";

  // Create Form State
  const [createForm, setCreateForm] = useState<{
    title: string;
    message: string;
    sender: string;
    category: CategoryType;
    targetAudience: string;
    department: string;
    courseCode: string;
    priority: PriorityType;
    status: "Published" | "Draft";
    visibility: "PUBLIC" | "INTERNAL";
    isFeatured: boolean;
    imageUrl: string;
    publishDate: string;
  }>({
    title: "",
    message: "",
    sender: "Office of the Registrar",
    category: "University",
    targetAudience: "All Students",
    department: "",
    courseCode: "",
    priority: "Normal",
    status: "Published",
    visibility: "PUBLIC",
    isFeatured: false,
    imageUrl: "",
    publishDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  });

  // Edit Form State
  const [editForm, setEditForm] = useState<{
    title: string;
    message: string;
    sender: string;
    category: CategoryType;
    targetAudience: string;
    department: string;
    courseCode: string;
    priority: PriorityType;
    status: "Published" | "Draft" | "Archived";
    visibility: "PUBLIC" | "INTERNAL";
    isFeatured: boolean;
    imageUrl: string;
  }>({
    title: "",
    message: "",
    sender: "",
    category: "University",
    targetAudience: "",
    department: "",
    courseCode: "",
    priority: "Normal",
    status: "Published",
    visibility: "PUBLIC",
    isFeatured: false,
    imageUrl: "",
  });

  const handleOpenEditModal = (a: Announcement) => {
    setEditingAnnouncement(a);
    setEditForm({
      title: a.title,
      message: a.message,
      sender: a.sender,
      category: a.category,
      targetAudience: a.targetAudience,
      department: a.department || "",
      courseCode: a.courseCode || "",
      priority: a.priority,
      status: a.status,
      visibility: (a.visibility as any) === "PUBLIC" ? "PUBLIC" : "INTERNAL",
      isFeatured: Boolean(a.isFeatured),
      imageUrl: a.imageUrl || "",
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.message.trim()) {
      alert("Please provide announcement title and message.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateAnnouncement({
        ...createForm,
        adminName: user?.name || "Administrator",
        adminEmail: user?.email || "admin@isb.iqra.edu.pk",
      });
      setIsCreateModalOpen(false);
      setCreateForm({
        title: "",
        message: "",
        sender: "Office of the Registrar",
        category: "University",
        targetAudience: "All Students",
        department: "",
        courseCode: "",
        priority: "Normal",
        status: "Published",
        visibility: "PUBLIC",
        isFeatured: false,
        imageUrl: "",
        publishDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });
    } catch (err: any) {
      alert(err.message || "Failed to create announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement) return;
    if (!editForm.title.trim() || !editForm.message.trim()) {
      alert("Title and message are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (onUpdateAnnouncement) {
        await onUpdateAnnouncement({
          id: editingAnnouncement._id,
          ...editForm,
          adminName: user?.name || "Administrator",
          adminEmail: user?.email || "admin@isb.iqra.edu.pk",
        });
      }
      setEditingAnnouncement(null);
    } catch (err: any) {
      alert(err.message || "Failed to update announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusToggle = async (a: Announcement) => {
    if (!onUpdateStatus) return;
    const nextStatus = a.status === "Published" ? "Draft" : "Published";
    try {
      await onUpdateStatus(a._id, nextStatus);
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleQuickVisibilityToggle = async (a: Announcement) => {
    if (!onUpdateVisibility) return;
    const nextVisibility = a.visibility === "PUBLIC" ? "INTERNAL" : "PUBLIC";
    try {
      await onUpdateVisibility(a._id, nextVisibility);
    } catch (err: any) {
      alert(err.message || "Failed to update visibility");
    }
  };

  const handleQuickFeaturedToggle = async (a: Announcement) => {
    if (!onToggleFeatured) return;
    try {
      await onToggleFeatured(a._id, !a.isFeatured);
    } catch (err: any) {
      alert(err.message || "Failed to toggle featured status");
    }
  };

  const handleDelete = async (a: Announcement) => {
    if (!onDeleteAnnouncement) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${a.title}"?`)) return;
    try {
      await onDeleteAnnouncement(a._id);
    } catch (err: any) {
      alert(err.message || "Failed to delete announcement");
    }
  };

  // Filtered List
  const filteredAnnouncements = announcements.filter((a) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchMessage = a.message.toLowerCase().includes(q);
      const matchSender = a.sender.toLowerCase().includes(q);
      if (!matchTitle && !matchMessage && !matchSender) return false;
    }

    if (activeFilter === "public") {
      return a.visibility === "PUBLIC" && a.status === "Published";
    }
    if (activeFilter === "internal") {
      return a.visibility === "INTERNAL" || a.visibility === "AUTHENTICATED";
    }
    if (activeFilter === "drafts") {
      return a.status === "Draft";
    }
    if (activeFilter === "faculty") {
      return (
        a.createdByRole === "FACULTY" ||
        (a.sender && a.sender.toLowerCase().includes("course instructor"))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase flex items-center gap-1">
              <Megaphone className="w-3 h-3" />
              University Communications
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Explore & Campus Portal Broadcast</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Announcements & Targeted Notifications
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Publish official university notices, manage public Explore visibility, approve faculty announcements for public release, or keep notices internal to authenticated student dashboards.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 self-start md:self-auto transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
              activeFilter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            All ({announcements.length})
          </button>
          <button
            onClick={() => setActiveFilter("public")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeFilter === "public"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            )}
          >
            <Globe className="w-3 h-3" />
            <span>Public — Explore</span>
          </button>
          <button
            onClick={() => setActiveFilter("internal")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              activeFilter === "internal"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
            )}
          >
            <Lock className="w-3 h-3" />
            <span>Internal / Portal</span>
          </button>
          <button
            onClick={() => setActiveFilter("drafts")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
              activeFilter === "drafts"
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveFilter("faculty")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
              activeFilter === "faculty"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
            )}
          >
            Faculty Notices
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No announcements match criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your filter or search query, or create a new announcement using the button above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnnouncements.map((a) => {
              const isFacultyPost =
                a.createdByRole === "FACULTY" ||
                (a.sender && a.sender.toLowerCase().includes("course instructor"));
              const isPublic = a.visibility === "PUBLIC";
              const isPublished = a.status === "Published";

              return (
                <div
                  key={a._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div className="space-y-2.5">
                    {/* Badges Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Priority Badge */}
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                            a.priority === "Urgent"
                              ? "bg-rose-100 text-rose-800"
                              : a.priority === "High"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                          )}
                        >
                          {a.category} • {a.priority}
                        </span>

                        {/* Visibility Badge */}
                        {isPublic ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5" />
                            PUBLIC (EXPLORE)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            INTERNAL ONLY
                          </span>
                        )}

                        {/* Status Badge */}
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                            isPublished
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          )}
                        >
                          {a.status}
                        </span>

                        {/* Creator Role Badge */}
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            isFacultyPost
                              ? "bg-purple-100 text-purple-800"
                              : "bg-indigo-100 text-indigo-800"
                          )}
                        >
                          {isFacultyPost ? "FACULTY" : "ADMIN"}
                        </span>

                        {/* Featured Badge */}
                        {a.isFeatured && isPublic && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            FEATURED
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {a.publishDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{a.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">
                      {a.message}
                    </p>
                  </div>

                  {/* Metadata & Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                      <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                        From: {a.sender}
                      </span>
                      <span className="font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                        Audience: {a.targetAudience}
                      </span>
                    </div>

                    {/* Admin Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Status Toggle Button */}
                        {onUpdateStatus && (
                          <button
                            onClick={() => handleQuickStatusToggle(a)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1",
                              isPublished
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                            )}
                            title={isPublished ? "Unpublish to draft" : "Publish to live portal"}
                          >
                            {isPublished ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Unpublish</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Publish</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Visibility Toggle Button */}
                        {onUpdateVisibility && (
                          <button
                            onClick={() => handleQuickVisibilityToggle(a)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1",
                              isPublic
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            )}
                            title={
                              isPublic
                                ? "Make Internal (hide from Explore)"
                                : isFacultyPost
                                  ? "Approve & Publish to Public Explore University"
                                  : "Make Public (show on Explore)"
                            }
                          >
                            {isPublic ? (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Make Internal</span>
                              </>
                            ) : (
                              <>
                                <Globe className="w-3 h-3" />
                                <span>{isFacultyPost ? "Approve for Public" : "Make Public"}</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Featured Toggle Button (Only active when Public) */}
                        {onToggleFeatured && isPublic && (
                          <button
                            onClick={() => handleQuickFeaturedToggle(a)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1",
                              a.isFeatured
                                ? "bg-amber-500 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                            title={a.isFeatured ? "Remove from Featured" : "Feature on Explore Homepage"}
                          >
                            <Star className="w-3 h-3" />
                            <span>{a.isFeatured ? "Featured" : "Feature"}</span>
                          </button>
                        )}
                      </div>

                      {/* Edit and Delete Actions */}
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => handleOpenEditModal(a)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit announcement"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteAnnouncement && (
                          <button
                            onClick={() => handleDelete(a)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete announcement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black font-heading text-slate-900">
                  Publish Announcement
                </h3>
                <p className="text-xs text-slate-500">
                  Configure announcement target audience, status, and public visibility.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fall 2026 Admissions Now Open"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Visibility Selector */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">
                  Visibility & Access Control *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={cn(
                      "p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all",
                      createForm.visibility === "PUBLIC"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <input
                      type="radio"
                      name="createVisibility"
                      checked={createForm.visibility === "PUBLIC"}
                      onChange={() => setCreateForm({ ...createForm, visibility: "PUBLIC" })}
                      className="mt-0.5 text-emerald-600"
                    />
                    <div>
                      <span className="font-bold flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        Public — Explore
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Visible on public Explore University portal to all visitors.
                      </p>
                    </div>
                  </label>

                  <label
                    className={cn(
                      "p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all",
                      createForm.visibility === "INTERNAL"
                        ? "bg-amber-50 border-amber-300 text-amber-950 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <input
                      type="radio"
                      name="createVisibility"
                      checked={createForm.visibility === "INTERNAL"}
                      onChange={() => setCreateForm({ ...createForm, visibility: "INTERNAL" })}
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <span className="font-bold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        Internal Only
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Only visible to logged-in students and faculty.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status *</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority *</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="University">University</option>
                    <option value="Department">Department</option>
                    <option value="Course">Course</option>
                    <option value="Exam">Exam</option>
                    <option value="Student-specific">Student-specific</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. All Students, Computing Dept"
                    value={createForm.targetAudience}
                    onChange={(e) => setCreateForm({ ...createForm, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Entity</label>
                  <input
                    type="text"
                    value={createForm.sender}
                    onChange={(e) => setCreateForm({ ...createForm, sender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://... or /images/..."
                    value={createForm.imageUrl}
                    onChange={(e) => setCreateForm({ ...createForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed announcement message text..."
                  value={createForm.message}
                  onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Featured toggle */}
              {createForm.visibility === "PUBLIC" && (
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createForm.isFeatured}
                    onChange={(e) => setCreateForm({ ...createForm, isFeatured: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <div>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Mark as Featured Announcement
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Displays in top highlight banner on the public Explore University homepage.
                    </p>
                  </div>
                </label>
              )}

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
                  {isSubmitting ? "Publishing..." : "Broadcast Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ANNOUNCEMENT MODAL */}
      {editingAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black font-heading text-slate-900">
                  Edit Announcement
                </h3>
                <p className="text-xs text-slate-500">
                  Update content, visibility, or publication status.
                </p>
              </div>
              <button
                onClick={() => setEditingAnnouncement(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Visibility Selector */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">
                  Visibility & Access Control *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={cn(
                      "p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all",
                      editForm.visibility === "PUBLIC"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <input
                      type="radio"
                      name="editVisibility"
                      checked={editForm.visibility === "PUBLIC"}
                      onChange={() => setEditForm({ ...editForm, visibility: "PUBLIC" })}
                      className="mt-0.5 text-emerald-600"
                    />
                    <div>
                      <span className="font-bold flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        Public — Explore
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Visible on public Explore University portal.
                      </p>
                    </div>
                  </label>

                  <label
                    className={cn(
                      "p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all",
                      editForm.visibility === "INTERNAL"
                        ? "bg-amber-50 border-amber-300 text-amber-950 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <input
                      type="radio"
                      name="editVisibility"
                      checked={editForm.visibility === "INTERNAL"}
                      onChange={() => setEditForm({ ...editForm, visibility: "INTERNAL" })}
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <span className="font-bold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        Internal Only
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Only visible to logged-in students and faculty.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status *</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority *</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="University">University</option>
                    <option value="Department">Department</option>
                    <option value="Course">Course</option>
                    <option value="Exam">Exam</option>
                    <option value="Student-specific">Student-specific</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience *</label>
                  <input
                    type="text"
                    required
                    value={editForm.targetAudience}
                    onChange={(e) => setEditForm({ ...editForm, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Entity</label>
                  <input
                    type="text"
                    value={editForm.sender}
                    onChange={(e) => setEditForm({ ...editForm, sender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://... or /images/..."
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Content *</label>
                <textarea
                  rows={3}
                  required
                  value={editForm.message}
                  onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Featured toggle */}
              {editForm.visibility === "PUBLIC" && (
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isFeatured}
                    onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <div>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Mark as Featured Announcement
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Displays prominently on the public Explore University homepage.
                    </p>
                  </div>
                </label>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAnnouncement(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};




