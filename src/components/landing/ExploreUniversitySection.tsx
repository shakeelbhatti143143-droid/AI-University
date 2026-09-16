"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Film,
  X,
  Clock,
  ChevronRight,
  Maximize2,
  Minimize2,
  GraduationCap,
  Building2,
  Compass,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";

interface PublishedVideo {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  duration?: string;
  displayOrder: number;
  createdAt: number;
}

export const ExploreUniversitySection: React.FC = () => {
  // Real-time reactive query to Convex backend
  const publishedVideos = useQuery(
    api.videos.getPublishedVideos,
    isConvexConfigured ? {} : "skip"
  ) as PublishedVideo[] | undefined;

  // Selected video for the interactive lightbox modal
  const [activeVideo, setActiveVideo] = useState<PublishedVideo | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset aspect ratio and fullscreen state when active video changes
  useEffect(() => {
    setVideoAspectRatio(null);
    setIsFullscreen(false);
  }, [activeVideo]);

  // Track browser fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (modalCardRef.current?.requestFullscreen) {
          await modalCardRef.current.requestFullscreen();
        } else if (videoRef.current?.requestFullscreen) {
          await videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // Close modal on Escape key (or exit fullscreen first if active)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          setActiveVideo(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll with scrollbar compensation when video lightbox is open
  useEffect(() => {
    if (activeVideo) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [activeVideo]);

  // Detect intrinsic video aspect ratio when metadata loads
  const handleLoadedMetadata = (
    e: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth && videoHeight) {
      setVideoAspectRatio(videoWidth / videoHeight);
    }
  };

  const isLoading = publishedVideos === undefined;
  const videosList = publishedVideos || [];

  return (
    <section
      id="explore-university"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] border-t border-slate-200 overflow-hidden scroll-mt-24"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#0b1f3a]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold mb-4 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span className="tracking-widest uppercase text-[11px] font-bold">
              Campus Showcase
            </span>
          </motion.div>

          {/* Main Heading as requested */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-[#0b1f3a] leading-tight"
          >
            Explore Iqra University, Chak Shehzad Campus
          </motion.h2>

          {/* Subtitle as requested */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-2xl"
          >
            Where your future begins. Discover our academic environment, research culture, state-of-the-art facilities, and campus life along Park Road, Islamabad.
          </motion.p>

          {/* Direct CTA to dedicated Explore University Portal */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6"
          >
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] text-white text-xs sm:text-sm font-bold tracking-wide shadow-md shadow-[#0b1f3a]/20 hover:shadow-lg transition-all"
            >
              <Compass className="w-4 h-4 text-slate-300" />
              <span>Enter Dedicated Explore University Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* ======================================================== */}
        {/* CASE 1: LOADING SKELETON */}
        {/* ======================================================== */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-white border border-slate-200/90 p-4 animate-pulse space-y-4 shadow-xs"
              >
                <div className="w-full aspect-video rounded-xl bg-slate-100" />
                <div className="h-5 w-3/4 rounded bg-slate-100" />
                <div className="h-3.5 w-full rounded bg-slate-100" />
                <div className="h-3.5 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* CASE 2: ELEGANT EMPTY STATE (WHEN NO VIDEOS CURRENTLY PUBLISHED) */}
        {/* ======================================================== */}
        {!isLoading && videosList.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center rounded-3xl p-8 sm:p-12 bg-white border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f0f4fa] border border-[#0b1f3a]/15 text-[#0b1f3a] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Film className="w-8 h-8 sm:w-10 sm:h-10 text-[#0b1f3a]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight mb-2">
              Campus Video Gallery
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8 font-normal">
              Official campus showcase reels will be featured here. In the meantime, explore our programs, faculty directory, and campus facilities.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/explore/programs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <span>Academic Programs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#f0f4fa] border border-slate-200 text-slate-800 hover:text-[#0b1f3a] text-xs sm:text-sm font-semibold transition-all"
              >
                <span>Explore University</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* CASE 3: PUBLISHED UNIVERSITY VIDEOS GRID */}
        {/* ======================================================== */}
        {!isLoading && videosList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {videosList.map((video, index) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                onClick={() => setActiveVideo(video)}
                className="group relative rounded-2xl bg-white border border-slate-200 hover:border-[#0b1f3a]/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 select-none"
              >
                {/* 16:9 Thumbnail Poster Area */}
                <div className="relative w-full aspect-video bg-slate-950 overflow-hidden shrink-0">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    /* High-end institutional fallback poster */
                    <div className="w-full h-full bg-gradient-to-br from-[#0c1f3a] via-[#09152a] to-[#050e1d] flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-2 group-hover:scale-105 transition-transform">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black tracking-widest text-slate-100 uppercase">
                        Iqra University
                      </span>
                      <span className="text-[10px] text-slate-300 mt-0.5">
                        Chak Shezad Campus, Islamabad
                      </span>
                    </div>
                  )}

                  {/* Dark Gradient Overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                  {/* Central Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0b1f3a]/90 group-hover:bg-[#0b1f3a] text-white flex items-center justify-center shadow-xl border border-white/30 group-hover:scale-105 transition-all duration-300">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-current" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono font-medium text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span>{video.duration || "Campus Reel"}</span>
                  </div>

                  {/* Top Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0b1f3a]/90 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-wider uppercase">
                    Official Video
                  </div>
                </div>

                {/* Video Info Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-slate-900 tracking-tight leading-snug group-hover:text-[#0b1f3a] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {video.description ||
                        "Explore campus life, world-class faculty, modern labs, and academic excellence at Iqra University."}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0b1f3a] group-hover:text-[#122b4e] transition-colors">
                    <span>Watch Full Showcase</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE VIDEO MODAL / LIGHTBOX */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
          >
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 bg-[#050e1d]/90 backdrop-blur-xl transition-opacity"
            />

            {/* Modal Dialog Card */}
            <motion.div
              ref={modalCardRef}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`relative z-10 flex flex-col bg-[#081426] border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
                videoAspectRatio && videoAspectRatio < 0.85
                  ? "w-full max-w-[min(92vw,480px)]"
                  : videoAspectRatio && videoAspectRatio < 1.15
                  ? "w-full max-w-[min(92vw,680px)]"
                  : "w-full max-w-[min(94vw,1120px)]"
              } max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] md:max-h-[calc(100dvh-3rem)]`}
            >
              {/* Modal Top Header Bar */}
              <div className="shrink-0 p-3 sm:p-4 bg-[#050e1d]/90 border-b border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0">
                    <Film className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      id="video-modal-title"
                      className="text-sm sm:text-base font-bold text-white tracking-tight truncate"
                    >
                      {activeVideo.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      Iqra University Chak Shehzad Campus Islamabad
                    </p>
                  </div>
                </div>

                {/* Header Action Controls (Fullscreen + Close) */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveVideo(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    title="Close Video (Esc)"
                    aria-label="Close Video"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Viewport-Fitted Responsive Video Player Container */}
              <div className="relative flex-1 min-h-0 min-w-0 w-full bg-black flex items-center justify-center overflow-hidden max-h-[calc(100dvh-8rem)] sm:max-h-[calc(100dvh-9.5rem)]">
                {activeVideo.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    poster={activeVideo.thumbnailUrl || undefined}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-auto h-auto max-w-full max-h-full object-contain mx-auto my-auto block"
                  >
                    Your browser does not support HTML5 video playback.
                  </video>
                ) : (
                  <div className="text-center p-8 text-slate-400">
                    <p className="text-sm">Video playback link is unavailable.</p>
                  </div>
                )}
              </div>

              {/* Bottom Video Metadata & Quick Action CTA */}
              <div className="shrink-0 p-3 sm:p-4 bg-[#050e1d]/95 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 max-w-2xl min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white">About this showcase</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-1 sm:line-clamp-2">
                    {activeVideo.description ||
                      "Welcome to Iqra University Chak Shehzad Campus Islamabad. Building leaders and shaping futures through world-class academic education."}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
                  <Link
                    href="/apply"
                    onClick={() => setActiveVideo(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white text-[#0b1f3a] hover:bg-slate-100 text-xs font-bold transition-all shadow-md"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Apply Now</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
