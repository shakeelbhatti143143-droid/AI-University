"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Building2,
  MapPin,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Play,
  Film,
  X,
  Clock,
  CheckCircle2,
  Maximize2,
  Minimize2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Cpu,
  ChevronRight,
} from "lucide-react";

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

const CAMPUS_HERO_IMAGE = "/images/campus-hero.jpg";

export default function ExploreCampusPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Real-time reactive queries to Convex backend
  const facilities = useQuery(
    api.website.getCampusFacilities,
    isConvexConfigured
      ? {
          category: selectedCategory === "All" ? undefined : selectedCategory,
        }
      : "skip"
  );

  const profile = useQuery(
    api.website.getUniversityProfile,
    isConvexConfigured ? {} : "skip"
  );

  const publishedVideos = useQuery(
    api.videos.getPublishedVideos,
    isConvexConfigured ? {} : "skip"
  ) as PublishedVideo[] | undefined;

  // Video lightbox state
  const [activeVideo, setActiveVideo] = useState<PublishedVideo | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoAspectRatio(null);
    setIsFullscreen(false);
  }, [activeVideo]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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

  useEffect(() => {
    if (activeVideo) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeVideo]);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth && videoHeight) {
      setVideoAspectRatio(videoWidth / videoHeight);
    }
  };

  const categories = [
    "All",
    "Academic",
    "Research",
    "Student Life",
    "Sports",
    "Administrative",
  ];

  const isLoadingFacilities = facilities === undefined;
  const videosList = publishedVideos || [];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#0b1f3a] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC FULL-VIEWPORT CAMPUS BANNER */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[85svh] lg:min-h-[90svh] flex flex-col justify-end overflow-hidden pb-12 sm:pb-16 lg:pb-20 pt-28 sm:pt-36 px-4 sm:px-8 lg:px-16 border-b border-slate-200/50">
        {/* Full-bleed Campus Photography */}
        <div className="absolute inset-0 z-0 select-none">
          <Image
            src={CAMPUS_HERO_IMAGE}
            alt="Iqra University Chak Shehzad Campus Islamabad"
            fill
            priority
            quality={90}
            className="object-cover object-center scale-100 hover:scale-[1.01] transition-transform duration-1000 ease-out"
          />
          {/* Controlled dark navy gradient overlay: ensures photography is vibrant and clearly visible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5, 14, 29, 0.45) 0%, rgba(5, 14, 29, 0.15) 30%, rgba(5, 14, 29, 0.65) 70%, rgba(5, 14, 29, 0.94) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050e1d]/85 via-[#050e1d]/35 to-transparent" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto space-y-5 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-slate-200" />
            <span>Chak Shezad Campus • Park Road, Islamabad</span>
          </div>

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-black font-heading tracking-tight uppercase leading-[1.05] text-white drop-shadow-sm">
              CAMPUS & FACILITIES
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-medium text-slate-200 leading-relaxed max-w-3xl drop-shadow-xs">
              &ldquo;Where Your Future Begins.&rdquo; Discover state-of-the-art smart lecture halls, advanced computing laboratories, digital research libraries, and serene green courtyards on Islamabad&apos;s scenic Park Road.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#facilities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-[#071322] bg-white hover:bg-slate-100 active:scale-[0.98] transition-all shadow-md cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Facilities</span>
            </a>

            {videosList.length > 0 && (
              <a
                href="#campus-video"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 active:bg-[#0b1f3a] backdrop-blur-md border border-white/25 transition-all shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Campus Film</span>
              </a>
            )}

            <Link
              href="/explore/map"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>Campus Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CAMPUS ATMOSPHERE & EDITORIAL COMPOSITION */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1600px] mx-auto py-16 sm:py-24 px-4 sm:px-8 lg:px-16 space-y-8">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Campus Environment</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
            Architectural Distinction & Inspiring Grounds
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {profile?.campusExperience ||
              "Nestled along scenic Park Road in Chak Shezad, Islamabad, our state-of-the-art campus combines architectural elegance with modern smart classrooms, high-performance computing laboratories, digital research libraries, vibrant student societies, and serene green courtyards."}
          </p>
        </div>

        {/* Editorial Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 hover:border-[#0b1f3a]/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-[#f0f4fa] border border-[#0b1f3a]/15 text-[#0b1f3a] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#0b1f3a]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
              Academic & Research Blocks
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Designed with spacious lecture theatres, multimedia smart classrooms, and dedicated faculty research consultation suites.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 hover:border-[#0b1f3a]/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-[#f0f4fa] border border-[#0b1f3a]/15 text-[#0b1f3a] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#0b1f3a]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
              High-Performance Labs
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Equipped with high-performance workstations, machine learning clusters, robotics testbeds, and Gigabit campus networking.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 hover:border-[#0b1f3a]/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-[#f0f4fa] border border-[#0b1f3a]/15 text-[#0b1f3a] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#0b1f3a]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
              Green Courtyards & Student Life
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Lush lawns and open-air courtyards fostering collaborative debate, student society activities, and tranquil academic study.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. IMMERSIVE VIDEO PRESENTATION ("EXPLORE OUR CAMPUS") */}
      {/* ========================================================================= */}
      <section
        id="campus-video"
        className="w-full bg-[#071322] text-white py-16 sm:py-24 border-y border-white/10 scroll-mt-20"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 text-xs font-semibold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5 text-slate-300" />
              <span>Campus Film Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
              EXPLORE OUR CAMPUS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience Iqra University, Chak Shehzad Campus. Watch official campus reels, research showcases, and student life on Park Road.
            </p>
          </div>

          {videosList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosList.map((video) => (
                <div
                  key={video._id}
                  onClick={() => setActiveVideo(video)}
                  className="group relative rounded-2xl bg-[#050e1d] border border-white/15 hover:border-white/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col shadow-md hover:-translate-y-1 select-none"
                >
                  <div className="relative w-full aspect-video bg-slate-950 overflow-hidden shrink-0">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0c1f3a] via-[#09152a] to-[#050e1d] flex flex-col items-center justify-center p-6 text-center">
                        <Building2 className="w-8 h-8 text-slate-300 mb-2" />
                        <span className="text-xs font-bold tracking-widest uppercase text-white">
                          Iqra University
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#0b1f3a]/90 group-hover:bg-white group-hover:text-[#0b1f3a] text-white flex items-center justify-center shadow-xl border border-white/30 group-hover:scale-105 transition-all duration-300">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{video.duration || "Campus Reel"}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-slate-200 transition-colors line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description || "Official campus showcase at Iqra University."}
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white">
                      <span>Watch Film</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <Film className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Campus Film Gallery</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Official campus showcase videos will be featured here as they are published by university administration.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MODERN FACILITIES CATALOG (Real Convex Data) */}
      {/* ========================================================================= */}
      <section id="facilities" className="w-full max-w-[1600px] mx-auto py-16 sm:py-24 px-4 sm:px-8 lg:px-16 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#0b1f3a]" />
              <span>Campus Facilities</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 mt-2">
              State-of-the-Art Student & Academic Amenities
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0b1f3a] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa] border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoadingFacilities && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-3 shadow-xs"
              >
                <div className="w-full aspect-video rounded-xl bg-slate-100" />
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingFacilities && facilities.length === 0 && (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 max-w-md mx-auto shadow-xs">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Facilities Cataloged</h3>
            <p className="text-xs text-slate-500">
              Campus facilities managed by administration will appear here dynamically.
            </p>
          </div>
        )}

        {/* Real Facilities Grid */}
        {!isLoadingFacilities && facilities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <div
                key={facility._id}
                className="p-6 rounded-3xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md group hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  {facility.imageUrl && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-3 border border-slate-200/80">
                      <img
                        src={facility.imageUrl}
                        alt={facility.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 font-bold uppercase tracking-wider">
                      {facility.category}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">Active</span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
                    {facility.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {facility.description}
                  </p>

                  <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0b1f3a] shrink-0" />
                    <span>{facility.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. LOCATION & DIRECTIONS CALLOUT */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1600px] mx-auto pb-20 px-4 sm:px-8 lg:px-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
              Looking for Campus Directions & Route Maps?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              View interactive coordinates, public transit connections, and campus gates on scenic Park Road.
            </p>
          </div>

          <Link
            href="/explore/map"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:scale-[0.98] transition-all shrink-0 shadow-md cursor-pointer"
          >
            <span>Open Interactive Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 bg-[#050e1d]/90 backdrop-blur-xl transition-opacity"
            />

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
    </div>
  );
}
