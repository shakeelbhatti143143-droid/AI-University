"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  CheckCircle2,
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/lib/auth-context";
import { PdfViewerModal } from "@/components/lms/PdfViewerModal";
import { LectureContentRenderer } from "@/components/lms/LectureRichTextEditor";

interface LectureResource {
  id: string;
  name: string;
  url: string;
  fileType: string;
  fileSize?: number;
}

export interface LectureItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  teacherName: string;
  title: string;
  description: string;
  lectureNumber: number;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  durationMinutes?: number;
  publishedAt?: number;
  createdAt: number;
  status: "NEW" | "IN_PROGRESS" | "COMPLETED";
  progressPercent: number;
  lastPosition: number;
  isCompleted: boolean;
  isNew: boolean;
  resources: LectureResource[];
}

interface LecturePlayerModalProps {
  lecture: LectureItem | null;
  isOpen: boolean;
  onClose: () => void;
  onProgressUpdated?: (lectureId: string, progress: number, completed: boolean) => void;
}

export const LecturePlayerModal: React.FC<LecturePlayerModalProps> = ({
  lecture,
  isOpen,
  onClose,
  onProgressUpdated,
}) => {
  const { token, user } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "resources" | "notes">("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [viewingPdf, setViewingPdf] = useState<{ url: string; title: string; downloadUrl?: string; fileSize?: number } | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize playback from saved position
  useEffect(() => {
    if (!lecture) return;
    setIsCompleted(lecture.isCompleted);
    setCurrentTime(lecture.lastPosition || 0);

    const timer = setTimeout(() => {
      if (videoRef.current) {
        if (lecture.lastPosition && lecture.lastPosition > 0) {
          videoRef.current.currentTime = lecture.lastPosition;
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [lecture]);

  if (!isOpen || !lecture) return null;

  // Sync progress to backend
  const saveProgressToDb = async (pos: number, dur: number, forceCompleted = false) => {
    if (!lecture) return;
    const calcProgress = dur > 0 ? Math.min(100, Math.round((pos / dur) * 100)) : 0;
    const completedNow = forceCompleted || calcProgress >= 90 || isCompleted;

    try {
      setIsSaving(true);
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        await client.mutation(api.lms.saveLectureProgress, {
          token: token || undefined,
          email: user?.universityEmail || user?.email,
          lectureId: lecture.id as any,
          progress: calcProgress,
          lastPosition: Math.round(pos),
          completed: completedNow,
        });
        if (completedNow) setIsCompleted(true);
        if (onProgressUpdated) {
          onProgressUpdated(lecture.id, calcProgress, completedNow);
        }
      }
    } catch (err) {
      console.warn("Could not sync lecture progress:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // Save every 15 seconds
    if (Math.floor(cur) % 15 === 0 && Math.floor(cur) > 0) {
      saveProgressToDb(cur, videoRef.current.duration || duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      if (lecture.lastPosition && lecture.lastPosition < dur - 5) {
        videoRef.current.currentTime = lecture.lastPosition;
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    saveProgressToDb(duration, duration, true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      saveProgressToDb(videoRef.current.currentTime, videoRef.current.duration);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(false);
    }
  };

  const handleMarkCompleteManual = async () => {
    await saveProgressToDb(duration || 100, duration || 100, true);
    setIsCompleted(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPct = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className="bg-[#0B1528] text-slate-100 w-full max-w-5xl max-h-[95vh] rounded-2xl md:rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden relative"
      >
        {/* MODAL HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-[#081022]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              {lecture.courseCode} • LEC {lecture.lectureNumber < 10 ? `0${lecture.lectureNumber}` : lecture.lectureNumber}
            </span>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {lecture.title}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                Instructor: {lecture.teacherName} • {lecture.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            {isCompleted ? (
              <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Completed
              </span>
            ) : (
              <button
                onClick={handleMarkCompleteManual}
                disabled={isSaving}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                title="Mark as completed"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Complete</span>
              </button>
            )}

            <button
              onClick={() => {
                if (videoRef.current) {
                  saveProgressToDb(videoRef.current.currentTime, videoRef.current.duration);
                }
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: VIDEO PLAYER + RESOURCE PANEL */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row">
          {/* VIDEO CANVAS CONTAINER */}
          <div className="lg:w-7/12 xl:w-2/3 bg-black flex flex-col justify-center relative group min-h-[260px] sm:min-h-[380px]">
            <video
              ref={videoRef}
              src={lecture.videoUrl}
              className="w-full h-full object-contain max-h-[500px]"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              onClick={togglePlay}
              playsInline
            />

            {/* BIG PLAY BUTTON OVERLAY WHEN PAUSED */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer backdrop-blur-[2px] transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl shadow-blue-900/50 hover:scale-110 hover:bg-blue-500 transition-transform">
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </div>
              </div>
            )}

            {/* CUSTOM VIDEO CONTROLS BAR */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-6 flex flex-col gap-2">
              {/* PROGRESS SEEK BAR */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
                />
              </div>

              {/* CONTROLS ROW */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button onClick={toggleMute} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
                    />
                  </div>

                  <span className="font-mono text-[11px] text-slate-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* SPEED SELECTOR */}
                  <div className="flex items-center rounded-lg bg-slate-800/80 p-0.5 border border-slate-700/60">
                    {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors",
                          playbackSpeed === s
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:text-white"
                        )}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                    title="Fullscreen"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SIDE PANEL: TABS (OVERVIEW / RESOURCES / NOTES) */}
          <div className="lg:w-5/12 xl:w-1/3 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#091224] flex flex-col">
            {/* TABS HEADER */}
            <div className="flex items-center border-b border-slate-800 px-3 pt-2 bg-[#060D1A]">
              <button
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5",
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={cn(
                  "px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 relative",
                  activeTab === "resources"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resources ({lecture.resources?.length || 0})</span>
                {(lecture.resources?.length || 0) > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* Progress tracker widget */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-400">Lesson Progress</span>
                      <span className="text-blue-400 font-bold font-mono">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300 rounded-full",
                          isCompleted
                            ? "bg-emerald-500"
                            : "bg-gradient-to-r from-blue-600 to-cyan-400"
                        )}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{isCompleted ? "Status: Completed" : "In Progress"}</span>
                      {lecture.lastPosition > 0 && !isCompleted && (
                        <span>Resumed at {formatTime(lecture.lastPosition)}</span>
                      )}
                    </div>
                  </div>

                  {/* Lecture Description with Formatted Renderer */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Description & Learning Outcomes
                    </h4>
                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                      <LectureContentRenderer content={lecture.description} />
                    </div>
                  </div>

                  {/* Course Details Pill */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Module Information
                    </div>
                    <div className="font-semibold text-white">{lecture.courseTitle}</div>
                    <div className="text-[11px] text-slate-400">
                      Course Code: <span className="font-mono text-cyan-400">{lecture.courseCode}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Instructor: <span className="text-slate-200">{lecture.teacherName}</span>
                    </div>
                  </div>

                  {/* Manual Mark Complete Mobile Button */}
                  <button
                    onClick={handleMarkCompleteManual}
                    className="w-full sm:hidden flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCompleted ? "Completed" : "Mark as Completed"}</span>
                  </button>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400">
                    Supplementary slide decks, reading materials, and code downloads for this lecture.
                  </div>

                  {!lecture.resources || lecture.resources.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                      <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-medium">
                        No supplementary resources attached yet.
                      </p>
                    </div>
                  ) : (
                    lecture.resources.map((res) => {
                      const isPdf = res.fileType.toLowerCase() === "pdf";

                      return (
                        <div
                          key={res.id}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                {res.name}
                              </p>
                              <span className="text-[10px] uppercase font-mono text-slate-500">
                                {res.fileType.toUpperCase()}
                                {res.fileSize
                                  ? ` • ${(res.fileSize / (1024 * 1024)).toFixed(1)} MB`
                                  : ""}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {isPdf && (
                              <button
                                type="button"
                                onClick={() =>
                                  setViewingPdf({
                                    url: res.url,
                                    title: res.name,
                                    downloadUrl: res.url,
                                    fileSize: res.fileSize,
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View PDF</span>
                              </button>
                            )}

                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={res.name}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download{isPdf ? " PDF" : ""}</span>
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EMBEDDED PDF VIEWER MODAL */}
      {viewingPdf && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setViewingPdf(null)}
          pdfUrl={viewingPdf.url}
          title={viewingPdf.title}
          downloadUrl={viewingPdf.downloadUrl}
          fileSize={viewingPdf.fileSize}
        />
      )}
    </div>
  );
};
