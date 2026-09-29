"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Video,
  Image as ImageIcon,
  Archive,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  FileCode,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

export interface UploadedFileMetadata {
  name: string;
  fileType: string;
  fileSize: number;
  storageId: string;
  url?: string;
}

interface LectureFileUploaderProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  allowedExtensions?: string[];
  initialFile?: UploadedFileMetadata | null;
  onFileUploaded: (file: UploadedFileMetadata | null) => void;
  helperText?: string;
  isMedia?: boolean; // if true, preview video/image
}

export const LectureFileUploader: React.FC<LectureFileUploaderProps> = ({
  label,
  accept = ".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt,.mp4,.webm,.png,.jpg,.jpeg",
  maxSizeMB = 250,
  allowedExtensions = ["pdf", "doc", "docx", "ppt", "pptx", "zip", "txt", "mp4", "webm", "png", "jpg", "jpeg"],
  initialFile = null,
  onFileUploaded,
  helperText,
  isMedia = false,
}) => {
  const [fileMeta, setFileMeta] = useState<UploadedFileMetadata | null>(initialFile);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const getFormatIcon = (ext: string) => {
    switch (ext) {
      case "pdf":
        return <FileText className="w-5 h-5 text-rose-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FileSpreadsheet className="w-5 h-5 text-amber-500" />;
      case "zip":
      case "rar":
      case "7z":
        return <Archive className="w-5 h-5 text-purple-500" />;
      case "mp4":
      case "webm":
      case "mkv":
        return <Video className="w-5 h-5 text-cyan-500" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "webp":
        return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileCode className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const uploadFileBinary = async (file: File) => {
    setErrorMsg(null);

    // Validation 1: Size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(`File exceeds maximum allowed size of ${maxSizeMB} MB.`);
      return;
    }

    // Validation 2: Extension
    const ext = getFileExtension(file.name);
    if (allowedExtensions.length > 0 && !allowedExtensions.includes(ext)) {
      setErrorMsg(`Unsupported file type (.${ext}). Allowed: ${allowedExtensions.join(", ")}`);
      return;
    }

    try {
      setIsUploading(true);
      setProgress(5);

      const client = getConvexClient();
      if (!client || !isConvexConfigured) {
        throw new Error("Convex backend is not configured.");
      }

      // Step 1: Generate direct upload URL from Convex Storage
      const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {});
      if (!uploadUrl) {
        throw new Error("Could not acquire storage upload ticket.");
      }

      // Step 2: Upload binary with progress tracking via XMLHttpRequest
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl, true);
        if (file.type) {
          xhr.setRequestHeader("Content-Type", file.type);
        }

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            setProgress(Math.max(5, Math.min(98, pct)));
          }
        };

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              const storageId = res.storageId;
              if (!storageId) {
                reject(new Error("Storage ID missing in upload response."));
                return;
              }

              setProgress(100);

              // Step 3: Resolve preview URL
              let resolvedUrl: string | undefined = undefined;
              try {
                const url = await client.query(api.storage.getDocumentUrl, { storageId });
                if (url) resolvedUrl = url;
              } catch {
                // ignore
              }

              const newMeta: UploadedFileMetadata = {
                name: file.name,
                fileType: ext,
                fileSize: file.size,
                storageId,
                url: resolvedUrl,
              };

              setFileMeta(newMeta);
              onFileUploaded(newMeta);
              resolve();
            } catch (err: any) {
              reject(err);
            }
          } else {
            reject(new Error(`Storage returned status ${xhr.status}: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during file upload."));
        xhr.send(file);
      });
    } catch (err: any) {
      console.error("Upload failed:", err);
      setErrorMsg(err.message || "Failed to upload file.");
      setFileMeta(null);
      onFileUploaded(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      uploadFileBinary(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      uploadFileBinary(dropped);
    }
  };

  const handleRemove = () => {
    setFileMeta(null);
    setProgress(0);
    setErrorMsg(null);
    onFileUploaded(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {label}
        </label>
        {helperText && (
          <span className="text-[10px] text-slate-400 dark:text-slate-400">
            {helperText}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* UPLOADED STATE */}
      {fileMeta ? (
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-slate-900 dark:text-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
              {getFormatIcon(fileMeta.fileType)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {fileMeta.name}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                  {fileMeta.fileType}
                </span>
                <span>•</span>
                <span>{formatFileSize(fileMeta.fileSize)}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Replace file"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : isUploading ? (
        /* UPLOADING STATE WITH PROGRESS BAR */
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-bounce" />
              <span>Uploading to Secure Storage...</span>
            </div>
            <span className="font-mono text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Please keep this window open while the file is transferring.
          </p>
        </div>
      ) : (
        /* DROPZONE / PICKER STATE */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group",
            isDragOver
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
              : "border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-900/60"
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Click to choose file or drag &amp; drop
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              PDF, DOC, DOCX, PPT, PPTX, ZIP, TXT, Images, or Video (Max {maxSizeMB} MB)
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
