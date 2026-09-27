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
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
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
      if (!client || !isConvexConfigured) {
        setVideos([]);
        return;
      }

      const list = await client.query(api.videos.getAllVideosAdmin, {});
      setVideos((list as any) || []);
    } catch (err: any) {
      console.error("Error loading university videos:", err);
      showToast("error", "Failed to fetch university videos from Convex.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

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

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    if (!validVideoTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|avi)$/i)) {
      showToast("error", "Please upload a valid MP4, WebM, or MOV video file.");
      return;
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast("error", "Video size exceeds the 100MB limit.");
      return;
    }

    setSelectedVideoFile(file);
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please upload an image file (JPG, PNG, WebP) for the thumbnail.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Thumbnail image exceeds the 5MB limit.");
      return;
    }

    setSelectedThumbnailFile(file);
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreviewUrl(objectUrl);
  };

  const uploadFileToConvexStorage = async (file: File): Promise<string> => {
    const client = getConvexClient();
    if (!client) throw new Error("Convex client is not available.");

    const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {});
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file to Convex: ${response.statusText}`);
    }

    const json = await response.json();
    return json.storageId;
  };

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

    try {
      const client = getConvexClient();
      if (!client) throw new Error("Convex client is not configured.");

      let videoStorageId = editingVideo ? editingVideo.videoStorageId : "";
      let videoFileName = editingVideo ? editingVideo.videoFileName : "";
      let videoFileSize = editingVideo ? editingVideo.videoFileSize : 0;

      if (selectedVideoFile) {
        setUploadStep(`Uploading video file (${formatFileSize(selectedVideoFile.size)})...`);
        videoStorageId = await uploadFileToConvexStorage(selectedVideoFile);
        videoFileName = selectedVideoFile.name;
        videoFileSize = selectedVideoFile.size;
      }

      let thumbnailStorageId = editingVideo ? editingVideo.thumbnailStorageId : undefined;
      let thumbnailFileName = editingVideo ? editingVideo.thumbnailFileName : undefined;

      if (selectedThumbnailFile) {
        setUploadStep("Uploading video thumbnail cover...");
        thumbnailStorageId = await uploadFileToConvexStorage(selectedThumbnailFile);
        thumbnailFileName = selectedThumbnailFile.name;
      }

      setUploadStep("Saving video record in Convex database...");

      if (editingVideo) {
        await client.mutation(api.videos.updateVideo, {
          id: editingVideo._id,
          title: formTitle.trim(),
          description: formDescription.trim(),
          status: formStatus,
          duration: formDuration.trim() || undefined,
          videoStorageId: selectedVideoFile ? videoStorageId : undefined,
          videoFileName: selectedVideoFile ? videoFileName : undefined,
          videoFileSize: selectedVideoFile ? videoFileSize : undefined,
          thumbnailStorageId: selectedThumbnailFile ? thumbnailStorageId : undefined,
          thumbnailFileName: selectedThumbnailFile ? thumbnailFileName : undefined,
        });

        showToast("success", `Video "${formTitle}" updated successfully.`);
      } else {
        await client.mutation(api.videos.createVideo, {
          title: formTitle.trim(),
          description: formDescription.trim(),
          videoStorageId,
          videoFileName,
          videoFileSize,
          thumbnailStorageId,
          thumbnailFileName,
          status: formStatus,
          duration: formDuration.trim() || undefined,
          createdBy: user?.name || "Administrator",
        });

        showToast("success", `Video "${formTitle}" uploaded successfully.`);
      }

      setIsFormModalOpen(false);
      await loadVideos();
    } catch (err: any) {
      console.error("Error submitting video:", err);
      showToast("error", err?.message || "Failed to process video upload.");
    } finally {
      setIsSubmitting(false);
      setUploadStep("");
    }
  };

  const handleTogglePublish = async (video: AdminVideoItem) => {
    const newStatus = video.status === "published" ? "draft" : "published";

    setVideos((prev) =>
      prev.map((v) => (v._id === video._id ? { ...v, status: newStatus } : v))
    );

    try {
      const client = getConvexClient();
      if (client) {
        await client.mutation(api.videos.toggleVideoStatus, {
          id: video._id,
        });
        showToast(
          "success",
          `Video is now ${newStatus === "published" ? "Published on public page" : "Saved as Draft"}.`
        );
      }
    } catch (err: any) {
      showToast("error", "Failed to toggle video status.");
      await loadVideos();
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredVideos.length) return;

    const newVideos = [...filteredVideos];
    const temp = newVideos[index];
    newVideos[index] = newVideos[targetIndex];
    newVideos[targetIndex] = temp;

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

  const handleConfirmDelete = async () => {
    if (!deletingVideo) return;
    setIsDeleting(true);

    try {
      const client = getConvexClient();
      if (!client) throw new Error("Convex client is not available.");

      await client.mutation(api.videos.deleteVideo, { id: deletingVideo._id });
      setVideos((prev) => prev.filter((v) => v._id !== deletingVideo._id));
      showToast("success", `Video "${deletingVideo.title}" was deleted.`);
      setDeletingVideo(null);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete video.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVideos = videos.length;
  const publishedVideos = videos.filter((v) => v.status === "published").length;
  const draftVideos = videos.filter((v) => v.status === "draft").length;
  const totalStorageBytes = videos.reduce((acc, v) => acc + (v.videoFileSize || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-[6px] border text-xs font-mono transition-all ${
            toast.type === "success"
              ? "bg-[#1D1B18] border-[#7DAE7A] text-[#7DAE7A]"
              : "bg-[#1D1B18] border-[#E27878] text-[#E27878]"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#7DAE7A] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#E27878] shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-[#8a8272] hover:text-[#F2EEE4] ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <CredentialCard>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#8a8272] flex items-center gap-1">
                <Film className="w-3.5 h-3.5 text-[#8a8272]" />
                Institutional Media Library
              </span>
              <span className="text-xs text-[#4a4335]">•</span>
              <span className="text-xs font-semibold text-[#8a8272]">Direct Convex Storage</span>
            </div>
            <h2 className="text-2xl font-serif font-medium text-[#F2EEE4] tracking-tight">
              University Videos & Showcase Media
            </h2>
            <p className="text-xs text-[#8a8272] mt-1">
              Upload, preview, organize, and publish campus tour videos and departmental showcases.
            </p>
          </div>

          <CredentialButton
            variant="primary"
            onClick={handleOpenCreateModal}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Upload New Video</span>
          </CredentialButton>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#4a4335]">
          <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]">
            <div className="text-[11px] text-[#8a8272] flex items-center gap-1.5 font-medium">
              <Film className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>Total Videos</span>
            </div>
            <div className="text-2xl font-serif text-[#F2EEE4] mt-1">{totalVideos}</div>
          </div>

          <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]">
            <div className="text-[11px] text-[#7DAE7A] flex items-center gap-1.5 font-medium">
              <Globe className="w-3.5 h-3.5 text-[#7DAE7A]" />
              <span>Published</span>
            </div>
            <div className="text-2xl font-serif text-[#7DAE7A] mt-1">{publishedVideos}</div>
          </div>

          <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]">
            <div className="text-[11px] text-[#8a8272] flex items-center gap-1.5 font-medium">
              <EyeOff className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>Drafts</span>
            </div>
            <div className="text-2xl font-serif text-[#F2EEE4] mt-1">{draftVideos}</div>
          </div>

          <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]">
            <div className="text-[11px] text-[#8a8272] flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-[#8a8272]" />
              <span>Convex Storage</span>
            </div>
            <div className="text-xl font-mono text-[#F2EEE4] mt-1">
              {formatFileSize(totalStorageBytes)}
            </div>
          </div>
        </div>
      </CredentialCard>

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1D1B18] border border-[#4a4335] rounded-[10px] p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8272]" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#C9A25B]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-colors ${
              statusFilter === "all"
                ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335]"
                : "text-[#8a8272] hover:text-[#F2EEE4] hover:bg-[#23201b]"
            }`}
          >
            All ({videos.length})
          </button>
          <button
            onClick={() => setStatusFilter("published")}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-colors flex items-center gap-1 ${
              statusFilter === "published"
                ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335]"
                : "text-[#8a8272] hover:text-[#F2EEE4] hover:bg-[#23201b]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DAE7A]" />
            Published ({publishedVideos})
          </button>
          <button
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-colors flex items-center gap-1 ${
              statusFilter === "draft"
                ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335]"
                : "text-[#8a8272] hover:text-[#F2EEE4] hover:bg-[#23201b]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8a8272]" />
            Drafts ({draftVideos})
          </button>
        </div>
      </div>

      {/* Videos List Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center bg-[#1D1B18] border border-[#4a4335] rounded-[10px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#8a8272] mb-3" />
          <p className="text-xs text-[#8a8272]">Loading university videos from Convex...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-16 px-4 text-center bg-[#1D1B18] border border-[#4a4335] rounded-[10px] flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-[8px] bg-[#23201b] border border-[#4a4335] flex items-center justify-center text-[#8a8272] mb-3">
            <Film className="w-6 h-6 text-[#8a8272]" />
          </div>
          <h3 className="text-base font-serif font-medium text-[#F2EEE4] mb-1">
            {videos.length === 0 ? "No University Videos Yet" : "No Matching Videos Found"}
          </h3>
          <p className="text-xs text-[#8a8272] max-w-md mb-4">
            Upload campus tour reels, welcome speeches, departmental showcases, or academic highlights to engage prospective students.
          </p>
          {videos.length === 0 && (
            <CredentialButton
              variant="primary"
              onClick={handleOpenCreateModal}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Upload First Video</span>
            </CredentialButton>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video, index) => (
            <CredentialCard key={video._id}>
              <CredentialHeader
                eyebrow={video.status.toUpperCase()}
                referenceId={video.duration || formatFileSize(video.videoFileSize)}
              />

              {/* Poster Thumbnail */}
              <div
                onClick={() => setPreviewVideo(video)}
                className="relative w-full h-36 rounded-[6px] overflow-hidden bg-[#0e0d0b] border border-[#4a4335] my-3 cursor-pointer group flex items-center justify-center"
              >
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#8a8272]">
                    <Film className="w-8 h-8 text-[#8a8272] mb-1" />
                    <span className="text-[10px] font-mono">Video Stream</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#C9A25B] text-[#1D1B18] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  </div>
                </div>
              </div>

              <CredentialTitle
                title={video.title}
                subheading={video.description || "Institutional video media"}
              />

              <CredentialDetailList>
                <CredentialDetailRow label="File" value={video.videoFileName} />
                <CredentialDetailRow label="Storage" value={formatFileSize(video.videoFileSize)} />
                <CredentialDetailRow
                  label="Uploaded"
                  value={new Date(video.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                />
              </CredentialDetailList>

              <CredentialFooter
                status={{
                  label: video.status === "published" ? "Published" : "Draft",
                  state: video.status === "published" ? "success" : "neutral",
                }}
                primaryAction={{
                  label: "Preview Video",
                  onClick: () => setPreviewVideo(video),
                }}
                secondaryActions={[
                  {
                    label: video.status === "published" ? "Unpublish to Draft" : "Publish Live",
                    onClick: () => handleTogglePublish(video),
                  },
                  {
                    label: "Edit Metadata",
                    onClick: () => handleOpenEditModal(video),
                  },
                  {
                    label: "Move Up in Order",
                    onClick: () => handleMoveOrder(index, "up"),
                    disabled: index === 0,
                  },
                  {
                    label: "Move Down in Order",
                    onClick: () => handleMoveOrder(index, "down"),
                    disabled: index === filteredVideos.length - 1,
                  },
                  {
                    label: "Delete Video",
                    onClick: () => setDeletingVideo(video),
                    isDestructive: true,
                  },
                ]}
              />
            </CredentialCard>
          ))}
        </div>
      )}

      {/* MODAL: UPLOAD / EDIT VIDEO FORM */}
      <CredentialModal
        isOpen={isFormModalOpen}
        onClose={() => !isSubmitting && setIsFormModalOpen(false)}
        title={editingVideo ? "Edit University Video" : "Upload New University Video"}
        eyebrow="CONVEX MEDIA"
        maxWidth="xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
          <CredentialInput
            label="Video Title *"
            required
            placeholder="e.g. Welcome to Iqra University Chak Shehzad"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />

          <div>
            <label className="block text-[#8a8272] text-xs mb-1.5 font-medium">Short Description</label>
            <textarea
              rows={3}
              placeholder="A concise summary highlighting the campus features..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#C9A25B] resize-none"
            />
          </div>

          {/* Video File Picker */}
          <div>
            <label className="block text-[#8a8272] text-xs mb-1.5 font-medium">
              Video File {!editingVideo && "*"}
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
              className="border border-dashed border-[#4a4335] hover:border-[#6a6050] rounded-[6px] p-4 bg-[#0e0d0b] cursor-pointer text-center"
            >
              <FileVideo className="w-6 h-6 mx-auto text-[#8a8272] mb-2" />
              {selectedVideoFile ? (
                <div>
                  <p className="text-xs font-serif text-[#F2EEE4] truncate max-w-md mx-auto">
                    {selectedVideoFile.name}
                  </p>
                  <p className="text-[10px] text-[#8a8272] mt-0.5">
                    Size: {formatFileSize(selectedVideoFile.size)} • Click to choose different file
                  </p>
                </div>
              ) : editingVideo ? (
                <div>
                  <p className="text-xs text-[#D8D3C6]">
                    Current file: <span className="text-[#D8D3C6] font-mono">{editingVideo.videoFileName}</span> ({formatFileSize(editingVideo.videoFileSize)})
                  </p>
                  <p className="text-[10px] text-[#8a8272] mt-0.5">
                    Click here only if you wish to replace this video file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-[#D8D3C6]">
                    Click to select video (MP4, WebM, MOV max 100MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Picker */}
          <div>
            <label className="block text-[#8a8272] text-xs mb-1.5 font-medium">
              Poster / Thumbnail Image (Optional)
            </label>
            <input
              type="file"
              ref={thumbnailInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-4 p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]">
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-20 h-14 rounded-[4px] overflow-hidden bg-[#1D1B18] border border-[#4a4335] flex items-center justify-center shrink-0 cursor-pointer hover:border-[#C9A25B]"
              >
                {thumbnailPreviewUrl ? (
                  <img
                    src={thumbnailPreviewUrl}
                    alt="Poster preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#8a8272]" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#D8D3C6]">
                  {selectedThumbnailFile ? selectedThumbnailFile.name : "Custom video cover"}
                </p>
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="text-xs text-[#C9A25B] hover:underline font-bold mt-1"
                >
                  {thumbnailPreviewUrl ? "Change Poster" : "Choose Image"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CredentialSelect
              label="Publishing Status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as "published" | "draft")}
            >
              <option value="published">Published (Landing Page)</option>
              <option value="draft">Draft (Internal only)</option>
            </CredentialSelect>

            <CredentialInput
              label="Duration (Optional)"
              placeholder="e.g. 2:45"
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
            />
          </div>

          {isSubmitting && (
            <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335] flex items-center gap-2 text-xs text-[#D8D3C6]">
              <Loader2 className="w-4 h-4 animate-spin text-[#8a8272]" />
              <span>{uploadStep}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <CredentialButton
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : editingVideo ? "Save Changes" : "Upload Video"}
            </CredentialButton>
          </div>
        </form>
      </CredentialModal>

      {/* MODAL: PREVIEW VIDEO LIGHTBOX */}
      {previewVideo && (
        <CredentialModal
          isOpen={!!previewVideo}
          onClose={() => setPreviewVideo(null)}
          title={previewVideo.title}
          eyebrow={previewVideo.status.toUpperCase()}
          maxWidth="3xl"
        >
          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-[6px] overflow-hidden border border-[#4a4335] flex items-center justify-center">
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
                <div className="text-center p-8 text-[#8a8272]">
                  <AlertCircle className="w-8 h-8 text-[#E27878] mx-auto mb-2" />
                  <p className="text-xs">Direct playback URL could not be resolved from storage.</p>
                </div>
              )}
            </div>

            <p className="text-xs text-[#8a8272]">{previewVideo.description}</p>

            <div className="flex justify-end">
              <CredentialButton
                variant="secondary"
                onClick={() => setPreviewVideo(null)}
              >
                Close Preview
              </CredentialButton>
            </div>
          </div>
        </CredentialModal>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingVideo && (
        <CredentialModal
          isOpen={!!deletingVideo}
          onClose={() => setDeletingVideo(null)}
          title="Delete University Video?"
          eyebrow="PERMANENT"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#D8D3C6]">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#F2EEE4] font-serif">&ldquo;{deletingVideo.title}&rdquo;</strong>?
            </p>
            <p className="text-[#E27878]">
              This action cannot be undone. The video will be removed from the public landing page and its persistent file storage in Convex will be freed.
            </p>

            <div className="flex justify-end gap-3 pt-3">
              <CredentialButton
                variant="secondary"
                disabled={isDeleting}
                onClick={() => setDeletingVideo(null)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="danger"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Video"}
              </CredentialButton>
            </div>
          </div>
        </CredentialModal>
      )}
    </div>
  );
};






