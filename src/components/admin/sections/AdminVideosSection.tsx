"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Upload,
  Plus,
  Play,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Film,
  Image as ImageIcon,
  Clock,
  HardDrive,
  FileVideo,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "@/lib/auth-context";

interface AdminVideoItem {
  _id: Id<"universityVideos">;
  _creationTime: number;
  title: string;
  description: string;
  videoStorageId: string;
  videoFileName: string;
  videoFileSize: number;
  thumbnailStorageId?: string;
  thumbnailFileName?: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  status: "published" | "draft";
  displayOrder: number;
  duration?: string;
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
}

export const AdminVideosSection: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<AdminVideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Notification / Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Upload / Edit Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideoItem | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [formDuration, setFormDuration] = useState("");
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>("");

  // Delete Confirmation Modal State
  const [deletingVideo, setDeletingVideo] = useState<AdminVideoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview Modal State
  const [previewVideo, setPreviewVideo] = useState<AdminVideoItem | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch all videos from Convex
  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const data = await client.query(api.videos.getAllVideosAdmin, {});
        if (data) {
          setVideos(data as AdminVideoItem[]);
        }
      }
    } catch (err: any) {
      console.error("Failed to load university videos:", err);
      showToast("error", err?.message || "Failed to load university videos from backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Open Form for New Video
  const handleOpenCreateModal = () => {
    setEditingVideo(null);
    setFormTitle("");
    setFormDescription("");
    setFormStatus("published");
    setFormDuration("");
    setSelectedVideoFile(null);
    setSelectedThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    setUploadStep("");
    setIsFormModalOpen(true);
  };

  // Open Form for Editing
  const handleOpenEditModal = (video: AdminVideoItem) => {
    setEditingVideo(video);
    setFormTitle(video.title);
    setFormDescription(video.description);
    setFormStatus(video.status);
    setFormDuration(video.duration || "");
    setSelectedVideoFile(null);
    setSelectedThumbnailFile(null);
    setThumbnailPreviewUrl(video.thumbnailUrl || null);
    setUploadStep("");
    setIsFormModalOpen(true);
  };

  // Handle Video File Selection
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/m4v"];
    if (!validVideoTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|avi|m4v)$/i)) {
      showToast("error", "Invalid format. Please upload an MP4, WebM, or MOV video file.");
      return;
    }

    // Validate size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      showToast("error", "File too large. Maximum supported video size is 100MB.");
      return;
    }

    setSelectedVideoFile(file);

    // Try auto-calculating duration from HTML video
    try {
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.onloadedmetadata = () => {
        window.URL.revokeObjectURL(tempVideo.src);
        const mins = Math.floor(tempVideo.duration / 60);
        const secs = Math.floor(tempVideo.duration % 60);
        const formatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
        if (!formDuration) {
          setFormDuration(formatted);
        }
      };
      tempVideo.src = URL.createObjectURL(file);
    } catch {
      // ignore
    }
  };

  // Handle Thumbnail File Selection
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please upload a valid image file (JPG, PNG, WebP) for the thumbnail.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Thumbnail image size exceeds 5MB limit.");
      return;
    }

    setSelectedThumbnailFile(file);
    const preview = URL.createObjectURL(file);
    setThumbnailPreviewUrl(preview);
  };

  // Upload a single file to Convex Storage
  const uploadFileToConvex = async (file: File): Promise<string> => {
    const client = getConvexClient();
    if (!client) throw new Error("Convex client is not available.");

    const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {});
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!res.ok) {
      throw new Error(`Upload failed for file: ${file.name}`);
    }

    const json = await res.json();
    return json.storageId;
  };

  // Submit Create or Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      showToast("error", "Please provide a video title.");
      return;
    }

    if (!editingVideo && !selectedVideoFile) {
      showToast("error", "Please select a video file to upload.");
      return;
    }

    setIsSubmitting(true);
    const client = getConvexClient();

    try {
      if (!client || !isConvexConfigured) {
        throw new Error("Convex database service is unavailable.");
      }

      if (editingVideo) {
        // Edit flow
        let newVideoStorageId: string | undefined = undefined;
        let newVideoFileName: string | undefined = undefined;
        let newVideoFileSize: number | undefined = undefined;

        if (selectedVideoFile) {
          setUploadStep("Uploading updated video file...");
          newVideoStorageId = await uploadFileToConvex(selectedVideoFile);
          newVideoFileName = selectedVideoFile.name;
          newVideoFileSize = selectedVideoFile.size;
        }

        let newThumbnailStorageId: string | undefined = undefined;
        let newThumbnailFileName: string | undefined = undefined;

        if (selectedThumbnailFile) {
          setUploadStep("Uploading updated poster thumbnail...");
          newThumbnailStorageId = await uploadFileToConvex(selectedThumbnailFile);
          newThumbnailFileName = selectedThumbnailFile.name;
        }

        setUploadStep("Saving video updates...");
        await client.mutation(api.videos.updateVideo, {
          id: editingVideo._id,
          title: formTitle.trim(),
          description: formDescription.trim(),
          status: formStatus,
          duration: formDuration.trim() || undefined,
          videoStorageId: newVideoStorageId,
          videoFileName: newVideoFileName,
          videoFileSize: newVideoFileSize,
          thumbnailStorageId: newThumbnailStorageId,
          thumbnailFileName: newThumbnailFileName,
        });

        showToast("success", `Video "${formTitle}" updated successfully!`);
      } else {
        // Create flow
        setUploadStep("Uploading university video to persistent storage...");
        const videoStorageId = await uploadFileToConvex(selectedVideoFile!);

        let thumbnailStorageId: string | undefined = undefined;
        let thumbnailFileName: string | undefined = undefined;

        if (selectedThumbnailFile) {
          setUploadStep("Uploading video poster image...");
          thumbnailStorageId = await uploadFileToConvex(selectedThumbnailFile);
          thumbnailFileName = selectedThumbnailFile.name;
        }

        setUploadStep("Registering university video in database...");
        await client.mutation(api.videos.createVideo, {
          title: formTitle.trim(),
          description: formDescription.trim(),
          videoStorageId,
          videoFileName: selectedVideoFile!.name,
          videoFileSize: selectedVideoFile!.size,
          thumbnailStorageId,
          thumbnailFileName,
          status: formStatus,
          duration: formDuration.trim() || undefined,
          createdBy: user?.name || "Super Admin",
        });

        showToast(
          "success",
          `Video "${formTitle}" uploaded & ${
            formStatus === "published" ? "published to Landing Page" : "saved as Draft"
          }!`
        );
      }

      setIsFormModalOpen(false);
      await loadVideos();
    } catch (err: any) {
      console.error("Save video error:", err);
      showToast("error", err?.message || "Failed to save video.");
    } finally {
      setIsSubmitting(false);
      setUploadStep("");
    }
  };

  // Toggle publish / unpublish
  const handleTogglePublish = async (video: AdminVideoItem) => {
    try {
      const client = getConvexClient();
      if (!client) return;

      const res = await client.mutation(api.videos.toggleVideoStatus, {
        id: video._id,
      });

      const updatedStatus = res.status as "published" | "draft";
      setVideos((prev) =>
        prev.map((v) => (v._id === video._id ? { ...v, status: updatedStatus } : v))
      );

      showToast(
        "success",
        `Video "${video.title}" is now ${
          updatedStatus === "published" ? "Published on Landing Page" : "Draft (Hidden from public)"
        }.`
      );
    } catch (err: any) {
      showToast("error", err?.message || "Failed to change video status.");
    }
  };

  // Move video up / down
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const newVideos = [...videos];
    const [moved] = newVideos.splice(index, 1);
    newVideos.splice(targetIndex, 0, moved);

    // Assign new display orders
    const itemsToUpdate = newVideos.map((item, idx) => ({
      id: item._id,
      displayOrder: idx,
    }));

    setVideos(newVideos.map((item, idx) => ({ ...item, displayOrder: idx })));

    try {
      const client = getConvexClient();
      if (client) {
        await client.mutation(api.videos.reorderVideos, { items: itemsToUpdate });
        showToast("success", "Video display order updated.");
      }
    } catch (err: any) {
      showToast("error", "Failed to update display order.");
      await loadVideos();
    }
  };

  // Delete Video confirmation
  const handleConfirmDelete = async () => {
    if (!deletingVideo) return;
    setIsDeleting(true);

    try {
      const client = getConvexClient();
      if (!client) throw new Error("Convex client is not available.");

      await client.mutation(api.videos.deleteVideo, { id: deletingVideo._id });
      setVideos((prev) => prev.filter((v) => v._id !== deletingVideo._id));
      showToast("success", `Video "${deletingVideo.title}" and its storage files were deleted.`);
      setDeletingVideo(null);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete video.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalVideos = videos.length;
  const publishedVideos = videos.filter((v) => v.status === "published").length;
  const draftVideos = videos.filter((v) => v.status === "draft").length;
  const totalStorageBytes = videos.reduce((acc, v) => acc + (v.videoFileSize || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-slate-900 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40"
              : "bg-slate-900 border-rose-500/50 text-rose-300 shadow-rose-950/40"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-1">
              <Film className="w-3.5 h-3.5 text-iqra-gold-400" />
              <span>Campus Media & Showcase Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              University Videos Management
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Upload, organize, and publish high-definition promotional videos for Iqra University.
              Published videos automatically appear on the public landing page for prospective students.
            </p>
          </div>

          <Button
            variant="gold"
            onClick={handleOpenCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-lg shadow-amber-500/20 shrink-0"
          >
            Upload University Video
          </Button>
        </div>

        {/* Quick Stat Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Film className="w-3.5 h-3.5 text-blue-400" />
              <span>Total Videos</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{totalVideos}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live on Landing Page</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{publishedVideos}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-amber-400 flex items-center gap-1.5 font-medium">
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Drafts (Hidden)</span>
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">{draftVideos}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-purple-400 flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              <span>Convex Cloud Storage</span>
            </div>
            <div className="text-2xl font-black text-purple-300 mt-1">
              {formatFileSize(totalStorageBytes)}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-iqra-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === "all"
                ? "bg-iqra-blue-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            All ({videos.length})
          </button>
          <button
            onClick={() => setStatusFilter("published")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              statusFilter === "published"
                ? "bg-emerald-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-emerald-400 border border-slate-800"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Published ({publishedVideos})
          </button>
          <button
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              statusFilter === "draft"
                ? "bg-amber-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-amber-400 border border-slate-800"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Drafts ({draftVideos})
          </button>
        </div>
      </div>

      {/* Videos List / Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-iqra-gold-400 mb-3" />
          <p className="text-sm font-semibold text-slate-400">Loading university videos from Convex...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-16 px-4 text-center bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
            <Film className="w-7 h-7 text-iqra-gold-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {videos.length === 0 ? "No University Videos Yet" : "No Matching Videos Found"}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            {videos.length === 0
              ? "Upload campus tour reels, welcome speeches, departmental showcases, or academic highlights to engage prospective students."
              : "Try adjusting your search criteria or filter to locate the desired university video."}
          </p>
          {videos.length === 0 && (
            <Button
              variant="gold"
              onClick={handleOpenCreateModal}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Upload First Video
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 w-44">Thumbnail</th>
                  <th className="py-3.5 px-4">Title & Description</th>
                  <th className="py-3.5 px-4 w-32">Status</th>
                  <th className="py-3.5 px-4 w-36">Media Details</th>
                  <th className="py-3.5 px-4 w-28 text-center">Reorder</th>
                  <th className="py-3.5 px-4 w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs text-slate-200">
                {filteredVideos.map((video, index) => {
                  const isFirst = index === 0;
                  const isLast = index === filteredVideos.length - 1;

                  return (
                    <tr
                      key={video._id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Order Index */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                        {index + 1}
                      </td>

                      {/* Video Poster Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => setPreviewVideo(video)}
                          className="relative w-36 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group-hover:border-iqra-gold-500/50 transition-all cursor-pointer shadow-md flex items-center justify-center shrink-0"
                        >
                          {video.thumbnailUrl ? (
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col items-center justify-center text-slate-500">
                              <Film className="w-6 h-6 text-slate-600 mb-1" />
                              <span className="text-[9px] font-semibold">Video Stream</span>
                            </div>
                          )}

                          {/* Hover Play Icon Overlay */}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                            <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                            </div>
                          </div>

                          {video.duration && (
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                              {video.duration}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <h4 className="font-bold text-white text-sm tracking-tight mb-1 group-hover:text-blue-300 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                          {video.description || "No description provided."}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                          <span>By {video.createdBy || "Admin"}</span>
                          <span>•</span>
                          <span>
                            {new Date(video.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {video.status === "published" ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Published</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Draft</span>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1">
                          {video.status === "published"
                            ? "Visible on Landing Page"
                            : "Internal view only"}
                        </div>
                      </td>

                      {/* File Details */}
                      <td className="py-3.5 px-4 text-slate-400">
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
                          <FileVideo className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{video.videoFileName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          {formatFileSize(video.videoFileSize)}
                        </div>
                      </td>

                      {/* Reorder Buttons */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleMoveOrder(index, "up")}
                            disabled={isFirst}
                            className="p-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(index, "down")}
                            disabled={isLast}
                            className="p-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview Button */}
                          <button
                            onClick={() => setPreviewVideo(video)}
                            className="p-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-blue-950/40 transition-colors"
                            title="Preview Video"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Publish */}
                          <button
                            onClick={() => handleTogglePublish(video)}
                            className={`p-2 rounded-lg border transition-colors ${
                              video.status === "published"
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                            title={
                              video.status === "published"
                                ? "Unpublish (Hide from public)"
                                : "Publish to Landing Page"
                            }
                          >
                            {video.status === "published" ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Globe className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(video)}
                            className="p-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-300 hover:text-white hover:border-amber-500 hover:bg-amber-950/40 transition-colors"
                            title="Edit Video Metadata"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeletingVideo(video)}
                            className="p-2 rounded-lg border border-rose-900/50 bg-rose-950/30 text-rose-400 hover:text-rose-300 hover:bg-rose-900/50 transition-colors"
                            title="Delete Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: UPLOAD / EDIT VIDEO FORM */}
      {/* ========================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0a192f] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-iqra-gold-500/10 border border-iqra-gold-500/30 text-iqra-gold-400 flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingVideo ? "Edit University Video" : "Upload New University Video"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingVideo
                      ? "Update video information, status, or replace stored media."
                      : "Add promotional, campus tour, or institutional media to the website."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isSubmitting && setIsFormModalOpen(false)}
                disabled={isSubmitting}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Video Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Welcome to Iqra University Chak Shehzad"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-iqra-gold-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  placeholder="A concise summary highlighting the campus features, programs, and opportunities shown in this video..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-iqra-gold-500 transition-colors resize-none"
                />
              </div>

              {/* Video File Picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Video File {!editingVideo && <span className="text-rose-400">*</span>}
                </label>

                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-iqra-gold-500/70 rounded-xl p-5 bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-all text-center group"
                >
                  <FileVideo className="w-8 h-8 mx-auto text-blue-400 group-hover:scale-110 transition-transform mb-2" />
                  {selectedVideoFile ? (
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-md mx-auto">
                        {selectedVideoFile.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Size: {formatFileSize(selectedVideoFile.size)} • Click to choose different file
                      </p>
                    </div>
                  ) : editingVideo ? (
                    <div>
                      <p className="text-xs text-slate-300">
                        Current file: <span className="text-amber-300">{editingVideo.videoFileName}</span> ({formatFileSize(editingVideo.videoFileSize)})
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Click here only if you wish to replace this video file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Drag and drop video here, or <span className="text-iqra-gold-400 font-bold">browse</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Supports MP4, WebM, MOV (Max 100MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Picker & Preview */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Optional Poster / Thumbnail Image
                </label>

                <input
                  type="file"
                  ref={thumbnailInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleThumbnailFileChange}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-28 h-18 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 cursor-pointer hover:border-iqra-gold-500 transition-colors"
                  >
                    {thumbnailPreviewUrl ? (
                      <img
                        src={thumbnailPreviewUrl}
                        alt="Poster preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs text-slate-300 font-medium">
                      {selectedThumbnailFile ? selectedThumbnailFile.name : "Custom video cover image"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Recommended 16:9 ratio (JPG, PNG, or WebP up to 5MB).
                    </p>
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="mt-2 text-xs font-bold text-iqra-gold-400 hover:text-amber-300 transition-colors"
                    >
                      {thumbnailPreviewUrl ? "Change Poster" : "Choose Image"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status & Duration Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Publishing Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "published" | "draft")}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-iqra-gold-500 transition-colors cursor-pointer"
                  >
                    <option value="published">Published (Visible on Public Landing Page)</option>
                    <option value="draft">Draft (Saved privately in Admin SIS)</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Duration (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2:45 or 3 min"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-iqra-gold-500 transition-colors"
                  />
                </div>
              </div>

              {/* Upload Progress Status */}
              {isSubmitting && (
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                  <div className="text-xs text-blue-200 font-medium">{uploadStep}</div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => setIsFormModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  isLoading={isSubmitting}
                  leftIcon={!isSubmitting && <Upload className="w-4 h-4" />}
                >
                  {editingVideo ? "Save Changes" : "Upload Video"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PREVIEW VIDEO LIGHTBOX */}
      {/* ========================================================= */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-iqra-gold-400">
                  Admin Video Preview
                </span>
                <span className="text-slate-600">•</span>
                <h3 className="text-sm font-bold text-white truncate max-w-lg">
                  {previewVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {previewVideo.videoUrl ? (
                <video
                  src={previewVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  poster={previewVideo.thumbnailUrl || undefined}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8 text-slate-400">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm">Direct playback URL could not be resolved from storage.</p>
                </div>
              )}
            </div>

            {/* Details Footer */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <p className="text-slate-400 line-clamp-2">{previewVideo.description}</p>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    previewVideo.status === "published"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {previewVideo.status.toUpperCase()}
                </span>
                <span className="text-slate-500 font-mono">
                  {formatFileSize(previewVideo.videoFileSize)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {deletingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Delete University Video?</h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to permanently delete{" "}
                <span className="text-white font-semibold">&ldquo;{deletingVideo.title}&rdquo;</span>?
              </p>
              <p className="text-xs text-rose-400/90 pt-1">
                This action cannot be undone. The video will be removed from the public landing page and its persistent file storage in Convex will be freed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setDeletingVideo(null)}
              >
                Cancel
              </Button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Video</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
