"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { CampusEditorialGallery } from "@/components/explore/CampusEditorialGallery";
import { ScholarshipsSection } from "@/components/explore/ScholarshipsSection";
import {
  Compass,
  GraduationCap,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Share2,
  Calendar,
  Image as ImageIcon,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft,
  Globe,
  Megaphone,
  Bell,
  Play,
  Film,
  X,
  Maximize2,
  Minimize2,
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

// Baseline Featured Degree Programs for authoritative academic preview
const DEFAULT_FEATURED_PROGRAMS = [
  {
    _id: "bsai",
    code: "BSAI",
    name: "Bachelor of Science in Artificial Intelligence",
    degreeLevel: "Undergraduate",
    duration: "4 Years (8 Semesters)",
    totalCreditHours: 134,
    department: "Department of Computing & Artificial Intelligence",
    description: "Deep learning, neural architectures, computer vision, and cognitive systems calibrated for modern technological frontiers.",
  },
  {
    _id: "bsse",
    code: "BSSE",
    name: "Bachelor of Science in Software Engineering",
    degreeLevel: "Undergraduate",
    duration: "4 Years (8 Semesters)",
    totalCreditHours: 134,
    department: "Department of Software Engineering",
    description: "Enterprise application architectures, cloud native microservices, CI/CD pipelines, and high-reliability software systems.",
  },
  {
    _id: "bscy",
    code: "BSCY",
    name: "Bachelor of Science in Cyber Security",
    degreeLevel: "Undergraduate",
    duration: "4 Years (8 Semesters)",
    totalCreditHours: 134,
    department: "Department of Cyber Security",
    description: "Threat vector intelligence, ethical penetration testing, network forensics, cryptography, and mission-critical cloud defense.",
  },
  {
    _id: "bscs",
    code: "BSCS",
    name: "Bachelor of Science in Computer Science",
    degreeLevel: "Undergraduate",
    duration: "4 Years (8 Semesters)",
    totalCreditHours: 134,
    department: "Department of Computing & Artificial Intelligence",
    description: "Algorithmic computation, operating systems design, database systems, distributed computing, and artificial intelligence.",
  },
  {
    _id: "fcasu",
    code: "FCASU",
    name: "BS Artificial Intelligence & Autonomous Systems",
    degreeLevel: "Undergraduate",
    duration: "4 Years (8 Semesters)",
    totalCreditHours: 134,
    department: "Department of Computing & Artificial Intelligence",
    description: "Robotics automation, sensor fusion, autonomous decision pipelines, and edge-AI machine learning models.",
  },
  {
    _id: "bba",
    code: "BBA",
    name: "Bachelor of Business Administration",
    degreeLevel: "Undergraduate",
    duration: "4 Years (8 Semesters)",
    totalCreditHours: 134,
    department: "Department of Management Sciences",
    description: "Strategic executive leadership, quantitative fintech analytics, international business governance, and digital enterprise scaling.",
  },
];

export default function ExploreUniversityPage() {
  // Modal states
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState("All");

  // Video Lightbox Modal states
  const [activeVideo, setActiveVideo] = useState<PublishedVideo | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const videoModalRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  // Reactive real-time data from Convex backend
  const stats = useQuery(api.website.getExploreQuickStats, isConvexConfigured ? {} : "skip");
  const profile = useQuery(api.website.getUniversityProfile, isConvexConfigured ? {} : "skip");

  // Public announcements
  const publicAnnouncements = useQuery(
    api.academicManagement.getPublicAnnouncements,
    isConvexConfigured ? { limit: 3 } : "skip"
  );
  const featuredAnnouncements = useQuery(
    api.academicManagement.getPublicAnnouncements,
    isConvexConfigured ? { isFeatured: true, limit: 1 } : "skip"
  );
  const featuredAnnouncement =
    featuredAnnouncements && featuredAnnouncements.length > 0
      ? featuredAnnouncements[0]
      : null;

  // Published posts / feed
  const publishedPosts = useQuery(
    api.website.getPublishedPosts,
    isConvexConfigured ? { limit: 4 } : "skip"
  );
  const featuredPosts = useQuery(
    api.website.getPublishedPosts,
    isConvexConfigured ? { isFeatured: true, limit: 1 } : "skip"
  );
  const featuredPost = featuredPosts && featuredPosts.length > 0 ? featuredPosts[0] : null;

  // Upcoming events
  const upcomingEvents = useQuery(
    api.website.getPublishedEvents,
    isConvexConfigured ? { upcomingOnly: true, limit: 3 } : "skip"
  );

  // Gallery images with category filter (dynamic, no artificial limits)
  const galleryImages = useQuery(
    api.website.getGalleryImages,
    isConvexConfigured
      ? {
        category: selectedGalleryCategory === "All" ? undefined : selectedGalleryCategory,
      }
      : "skip"
  );
  const galleryList = galleryImages || [];

  // Academic programs
  const programs = useQuery(
    api.website.getPublicAcademicPrograms,
    isConvexConfigured ? {} : "skip"
  );
  const displayPrograms =
    programs && programs.length > 0
      ? programs.slice(0, 6)
      : DEFAULT_FEATURED_PROGRAMS;

  // Campus location
  const location = useQuery(
    api.website.getUniversityLocation,
    isConvexConfigured ? {} : "skip"
  );

  // Published videos from Convex
  const publishedVideos = useQuery(
    api.videos.getPublishedVideos,
    isConvexConfigured ? {} : "skip"
  ) as PublishedVideo[] | undefined;
  const videosList = publishedVideos || [];

  // Body overflow locking for modals
  useEffect(() => {
    if (activeVideo !== null || selectedAnnouncement !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeVideo, selectedAnnouncement]);

  // Keyboard navigation for Video modal and Announcement modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isVideoFullscreen && document.fullscreenElement) {
          document.exitFullscreen().catch(() => { });
        } else if (activeVideo) {
          setActiveVideo(null);
        } else if (selectedAnnouncement) {
          setSelectedAnnouncement(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo, selectedAnnouncement, isVideoFullscreen]);

  const toggleVideoFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (videoModalRef.current?.requestFullscreen) {
          await videoModalRef.current.requestFullscreen();
        } else if (videoElementRef.current?.requestFullscreen) {
          await videoElementRef.current.requestFullscreen();
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

  const galleryCategories = [
    "All",
    "Campus",
    "Facilities",
    "Students",
    "Faculty",
    "Events",
    "Activities",
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#0b1f3a] selection:text-white">
      {/* ===================================================================== */}
      {/* 1. CINEMATIC FULL-VIEWPORT HERO SECTION */}
      {/* ===================================================================== */}
      <section className="relative w-full min-h-[92svh] lg:min-h-screen flex flex-col justify-end overflow-hidden pb-12 sm:pb-16 lg:pb-24 pt-28 sm:pt-36 px-4 sm:px-8 lg:px-16 border-b border-slate-200/50">
        {/* Full-bleed Campus Photography */}
        <div className="absolute inset-0 z-0 select-none">
          <Image
            src="/images/campus-hero.jpg"
            alt="Iqra University Chak Shehzad Campus Islamabad"
            fill
            priority
            quality={90}
            className="object-cover object-center scale-100 hover:scale-[1.01] transition-transform duration-1000 ease-out"
          />
          {/* Refined Cinematic Navy Overlay: Transparent enough so campus photography is vibrant & dominant */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5, 14, 29, 0.45) 0%, rgba(5, 14, 29, 0.15) 30%, rgba(5, 14, 29, 0.65) 70%, rgba(5, 14, 29, 0.94) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050e1d]/85 via-[#050e1d]/35 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto space-y-6 text-white">
          {/* Eyebrow Institutional Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-slate-200" />
            <span>Chartered by Federal Government • HEC Recognized W4 Category</span>
          </div>

          {/* Large Responsive Clamp Typography */}
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-[clamp(2.4rem,6vw,5rem)] font-black font-heading tracking-tight uppercase leading-[1.04] text-white drop-shadow-sm">
              EXPLORE IQRA UNIVERSITY
            </h1>
            <div className="text-[clamp(0.95rem,2.2vw,1.4rem)] font-bold font-heading tracking-[0.2em] uppercase text-slate-300">
              CHAK SHEHZAD CAMPUS, ISLAMABAD
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-slate-200 leading-relaxed max-w-3xl pt-2 drop-shadow-xs">
              &ldquo;Where Your Future Begins.&rdquo; Discover Islamabad&apos;s premier hub for innovative learning, research advancement, world-class faculty, and future-ready academic distinction on scenic Park Road.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/explore/campus"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-[#071322] bg-white hover:bg-slate-100 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#071322]" />
              <span>Campus & Facilities</span>
            </Link>

            <Link
              href="/explore/programs"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 active:bg-[#0b1f3a] backdrop-blur-md border border-white/25 transition-all shadow-sm cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-slate-200" />
              <span>Degree Programs</span>
            </Link>

            {videosList.length > 0 && (
              <a
                href="#campus-film"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Campus Film</span>
              </a>
            )}

            <a
              href="#scholarships"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-[0.98] border border-emerald-400/40 backdrop-blur-md transition-all shadow-sm"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Scholarships</span>
            </a>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:scale-[0.98] border border-white/20 transition-all shadow-md ml-auto sm:ml-0"
            >
              <span>Apply for Admissions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. INSTITUTIONAL HERITAGE & VISION (Editorial Storytelling) */}
      {/* ===================================================================== */}
      <section className="w-full max-w-[1600px] mx-auto py-16 sm:py-24 px-4 sm:px-8 lg:px-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Academic Standing */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#0b1f3a]" />
              <span>Institutional Overview</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight leading-tight">
              A Legacy of Academic Distinction in the Nation&apos;s Capital
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {profile?.overview ||
                "Chartered by the Federal Government of Pakistan and recognized by the Higher Education Commission (HEC) in the highest W4 category, Iqra University Chak Shehzad Campus stands as Islamabad's premier hub for innovative learning, research advancement, and academic distinction."}
            </p>

            <div className="pt-2">
              <Link
                href="/explore/about"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0b1f3a] hover:text-[#122b4e] transition-colors"
              >
                <span>Discover University History & Leadership</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Distinctive Vision & Mission Statement Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Card 1: Institutional Vision */}
            <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-slate-950 border border-slate-200/20 shadow-md hover:border-slate-300/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.02] pointer-events-none grayscale-[25%]"
                style={{
                  backgroundImage: "url('/images/card-institutional-vision.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/25 backdrop-blur-[0.5px] transition-colors duration-300 pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 border border-blue-400/40">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-black text-base text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  Institutional Vision
                </h3>
                <p className="text-xs sm:text-sm text-white leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  {profile?.vision ||
                    "To be an internationally recognized center of academic excellence and research that equips future generations with cutting-edge artificial intelligence, technological proficiency, entrepreneurial spirit, and human-centric values."}
                </p>
              </div>
            </div>

            {/* Card 2: Our Mission */}
            <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-slate-950 border border-slate-200/20 shadow-md hover:border-slate-300/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.02] pointer-events-none grayscale-[25%]"
                style={{
                  backgroundImage: "url('/images/card-our-mission.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/25 backdrop-blur-[0.5px] transition-colors duration-300 pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 border border-emerald-400/40">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-black text-base text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  Our Mission
                </h3>
                <p className="text-xs sm:text-sm text-white leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  {profile?.mission ||
                    "To impart state-of-the-art education, foster ground-breaking scientific and technological research, and nurture ethical leaders capable of navigating complex global challenges through critical thinking, interdisciplinary innovation, and public service."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Institutional Metrics (Slide Background Cards with High-Contrast Overlays) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {/* 1st: Departments */}
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-slate-950 border border-white/20 hover:border-white/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-105 pointer-events-none"
              style={{
                backgroundImage: "url('/images/departments-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/75 to-slate-900/65 group-hover:from-slate-950/85 group-hover:via-slate-950/65 group-hover:to-slate-900/50 transition-colors duration-300 pointer-events-none" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider drop-shadow-sm">
                <Building2 className="w-4 h-4 text-white" />
                <span>Departments</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white drop-shadow-md tracking-tight">
                {stats !== undefined ? stats.departmentsCount : "—"}
              </div>
              <p className="text-[11px] sm:text-xs text-white/90 font-medium drop-shadow-sm">Active Academic Departments</p>
            </div>
          </div>

          {/* 2nd: Degree Programs */}
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-slate-950 border border-white/20 hover:border-white/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-105 pointer-events-none"
              style={{
                backgroundImage: "url('/images/programs-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/75 to-slate-900/65 group-hover:from-slate-950/85 group-hover:via-slate-950/65 group-hover:to-slate-900/50 transition-colors duration-300 pointer-events-none" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider drop-shadow-sm">
                <GraduationCap className="w-4 h-4 text-white" />
                <span>Degree Programs</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white drop-shadow-md tracking-tight">
                {stats !== undefined ? stats.programsCount : "—"}
              </div>
              <p className="text-[11px] sm:text-xs text-white/90 font-medium drop-shadow-sm">BS, MS, and PhD Programs</p>
            </div>
          </div>

          {/* 3rd: Accreditation (HEC W4) */}
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-slate-950 border border-white/20 hover:border-white/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-105 pointer-events-none"
              style={{
                backgroundImage: "url('/images/hec-w4-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/75 to-slate-900/65 group-hover:from-slate-950/85 group-hover:via-slate-950/65 group-hover:to-slate-900/50 transition-colors duration-300 pointer-events-none" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider drop-shadow-sm">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Accreditation</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white drop-shadow-md tracking-tight">
                HEC W4
              </div>
              <p className="text-[11px] sm:text-xs text-white/90 font-medium drop-shadow-sm">Federal Chartered Status</p>
            </div>
          </div>

          {/* 4th: Distinguished Faculty */}
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-slate-950 border border-white/20 hover:border-white/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-105 pointer-events-none"
              style={{
                backgroundImage: "url('/images/faculty-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/75 to-slate-900/65 group-hover:from-slate-950/85 group-hover:via-slate-950/65 group-hover:to-slate-900/50 transition-colors duration-300 pointer-events-none" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider drop-shadow-sm">
                <Users className="w-4 h-4 text-white" />
                <span>Distinguished Faculty</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white drop-shadow-md tracking-tight">
                {stats !== undefined ? stats.facultyCount : "—"}
              </div>
              <p className="text-[11px] sm:text-xs text-white/90 font-medium drop-shadow-sm">Active Professors & Researchers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. ULTRA-PREMIUM EDITORIAL CAMPUS GALLERY (Life at Chak Shehzad Campus) */}
      {/* ===================================================================== */}
      <CampusEditorialGallery
        images={galleryList}
        selectedCategory={selectedGalleryCategory}
        onSelectCategory={setSelectedGalleryCategory}
        categories={galleryCategories}
        isLoading={galleryImages === undefined}
      />

      {/* ===================================================================== */}
      {/* 4. DEGREE PROGRAMS PREVIEW */}
      {/* ===================================================================== */}
      <section className="w-full max-w-[1600px] mx-auto py-16 sm:py-24 px-4 sm:px-8 lg:px-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-[#0b1f3a]" />
              <span>Academics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-2">
              Featured Degree Programs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Future-ready curricula designed to meet high academic standards and industry demands.
            </p>
          </div>
          <Link
            href="/explore/programs"
            className="text-xs sm:text-sm font-bold text-[#0b1f3a] hover:text-[#122b4e] flex items-center gap-1 transition-colors"
          >
            <span>Explore All Degree Programs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPrograms.map((prog) => (
            <div
              key={prog._id}
              className="group p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_8px_-4px_rgba(15,23,42,0.03)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Program Level Badge + Program Code */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700 tracking-wide">
                    {prog.degreeLevel}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    {prog.code}
                  </span>
                </div>

                {/* Program Title */}
                <h3 className="font-heading font-bold text-lg sm:text-[19px] text-slate-900 tracking-[-0.015em] leading-snug group-hover:text-[#0b1f3a] transition-colors duration-200 mt-4 mb-2.5">
                  {prog.name}
                </h3>

                {/* Program Description */}
                <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-2 leading-relaxed mb-5">
                  {prog.description || `Offered by ${prog.department}. Total credit hours: ${prog.totalCreditHours}.`}
                </p>

                {/* Duration & Credit Hours */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="font-normal text-slate-500">
                    Duration: <span className="font-semibold text-slate-700">{prog.duration}</span>
                  </span>
                  <span className="font-semibold text-slate-700">
                    {prog.totalCreditHours} <span className="font-normal text-slate-500">Credit Hours</span>
                  </span>
                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/explore/programs/${prog._id}`}
                  className="font-semibold text-slate-600 hover:text-[#0b1f3a] transition-colors"
                >
                  Program Details
                </Link>
                <Link
                  href="/apply"
                  className="font-bold text-slate-900 hover:text-[#0b1f3a] inline-flex items-center gap-1.5 transition-colors group/apply"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover/apply:text-[#0b1f3a] group-hover/apply:translate-x-1 transition-all duration-200" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. IMMERSIVE VIDEO SHOWCASE (Requirement #12) */}
      {/* ===================================================================== */}
      <section
        id="campus-film"
        className="w-full bg-[#071322] text-white py-16 sm:py-24 border-y border-white/10 scroll-mt-20"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 text-xs font-semibold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5 text-slate-300" />
              <span>Campus Film Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
              Cinematic Campus Tour & Reels
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the campus atmosphere, student society activities, research symposiums, and smart lecture halls through our official films.
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
                      <span>Watch Reel</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <Film className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Campus Video Reels</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Official campus showcase videos will be featured here as they are published by university administration.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. OFFICIAL DISPATCHES & UNIVERSITY NEWS */}
      {/* ===================================================================== */}
      <section className="w-full max-w-[1600px] mx-auto py-16 sm:py-24 px-4 sm:px-8 lg:px-16 space-y-12">
        {/* Official Announcements */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold uppercase tracking-wider">
                <Megaphone className="w-3.5 h-3.5 text-[#0b1f3a]" />
                <span>Official Dispatches</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-2">
                Latest University Announcements
              </h2>
            </div>
            <Link
              href="/explore/announcements"
              className="text-xs sm:text-sm font-bold text-[#0b1f3a] hover:text-[#122b4e] flex items-center gap-1 transition-colors"
            >
              <span>All Announcements</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured Announcement Banner */}
          {featuredAnnouncement && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#0b1f3a]" />
                    Featured Notice
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {featuredAnnouncement.publishDate}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                  {featuredAnnouncement.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {featuredAnnouncement.message}
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                  <span>Issued by: <strong className="text-slate-700">{featuredAnnouncement.sender}</strong></span>
                  <span>•</span>
                  <span className="text-[#0b1f3a] font-semibold">{featuredAnnouncement.category} Notice</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAnnouncement(featuredAnnouncement)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] shadow-md shadow-[#0b1f3a]/20 transition-all shrink-0 cursor-pointer"
              >
                <span>Read Full Notice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Announcements Grid */}
          {publicAnnouncements && publicAnnouncements.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicAnnouncements.slice(0, 3).map((anc) => (
                <div
                  key={anc._id}
                  className="rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 p-5 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20">
                        {anc.category}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">{anc.publishDate}</span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-slate-900 line-clamp-2">
                      {anc.title}
                    </h3>
                    <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                      {anc.message}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[150px]">{anc.sender}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedAnnouncement(anc)}
                      className="font-bold text-[#0b1f3a] hover:text-[#122b4e] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Read More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campus News / Posts Feed */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold uppercase tracking-wider">
                <Share2 className="w-3.5 h-3.5 text-[#0b1f3a]" />
                <span>University Feed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-2">
                Campus News & Stories
              </h2>
            </div>
            <Link
              href="/explore/posts"
              className="text-xs sm:text-sm font-bold text-[#0b1f3a] hover:text-[#122b4e] flex items-center gap-1 transition-colors"
            >
              <span>View All Posts</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {publishedPosts && publishedPosts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedPosts.slice(0, 3).map((post) => (
                <Link
                  key={post._id}
                  href={`/explore/posts/${post._id}`}
                  className="group rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 p-5 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-[#f0f4fa] border border-[#0b1f3a]/20 text-[#0b1f3a] font-semibold">
                        {post.category}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">{post.publishDate}</span>
                    </div>
                    <h4 className="font-heading font-bold text-base text-slate-900 group-hover:text-[#0b1f3a] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{post.authorName}</span>
                    <span className="text-[#0b1f3a] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read Story <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. UPCOMING ACADEMIC EVENTS */}
      {/* ===================================================================== */}
      <section className="w-full max-w-[1600px] mx-auto py-16 sm:py-24 px-4 sm:px-8 lg:px-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#0b1f3a]" />
              <span>Campus Calendar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-2">
              Upcoming Events & Seminars
            </h2>
          </div>
          <Link
            href="/explore/events"
            className="text-xs sm:text-sm font-bold text-[#0b1f3a] hover:text-[#122b4e] flex items-center gap-1 transition-colors"
          >
            <span>All Campus Events</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event._id}
                className="p-6 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 font-bold">
                      {event.category}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#0b1f3a]" />
                      {event.time}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base text-slate-900">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0b1f3a] shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {event.date}
                  </span>
                  {event.registrationUrl ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#0b1f3a] hover:text-[#122b4e] flex items-center gap-1"
                    >
                      Register <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium">Open Attendance</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">No Upcoming Seminars Scheduled</p>
            <p className="text-xs text-slate-500">
              Campus workshops and conferences will appear here when scheduled by administration.
            </p>
          </div>
        )}
      </section>

      {/* ===================================================================== */}
      {/* 8. MERIT SCHOLARSHIPS SECTION */}
      {/* ===================================================================== */}
      <ScholarshipsSection id="scholarships" />

      {/* ===================================================================== */}
      {/* 9. CAMPUS MAP & DIRECTIONS PREVIEW */}
      {/* ===================================================================== */}
      <section className="w-full max-w-[1600px] mx-auto py-16 sm:py-20 px-4 sm:px-8 lg:px-16 space-y-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#0b1f3a]" />
                <span>Campus Location</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black font-heading text-slate-900">
                {location?.campusName || "Chak Shehzad Campus, Islamabad"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {location?.address || "Park Road, Chak Shehzad, Islamabad, Pakistan"}
              </p>
            </div>

            <Link
              href="/explore/map"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:scale-[0.98] shadow-md transition-all self-start sm:self-center shrink-0 cursor-pointer"
            >
              <span>Interactive Campus Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-xs">
            {location?.embedMapUrl ? (
              <iframe
                src={location.embedMapUrl}
                title="AI University Campus Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-50">
                <MapPin className="w-10 h-10 text-[#0b1f3a]" />
                <div className="space-y-1">
                  <p className="font-heading font-bold text-sm sm:text-base text-slate-900">
                    Park Road, Chak Shehzad, Islamabad
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Latitude: {location?.latitude || "33.6766"} • Longitude: {location?.longitude || "73.1388"}
                  </p>
                </div>
                <a
                  href={location?.googleMapsUrl || "https://maps.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] transition-all"
                >
                  Open in Google Maps <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. BOTTOM CALL TO ACTION */}
      {/* ===================================================================== */}
      <section className="w-full max-w-[1600px] mx-auto pb-20 px-4 sm:px-8 lg:px-16">
        <div className="rounded-3xl p-8 sm:p-14 lg:p-16 bg-gradient-to-r from-[#050e1d] via-[#0b1f3a] to-[#071322] border border-white/10 text-center space-y-6 shadow-2xl text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Admissions 2026 Currently Open</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading text-white max-w-2xl mx-auto tracking-tight">
            Ready to Begin Your Educational Journey?
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Submit your online application in minutes or log into the academic portal to explore student facilities and admissions resources.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#071322] bg-white hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98] cursor-pointer"
            >
              <span>Apply Now for Admissions 2026</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
            >
              <span>Academic Portal Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 10. ULTRA-PREMIUM FULL-SCREEN PHOTOGRAPHY LIGHTBOX */}
      {/* ===================================================================== */}
      {/* Lightbox now elegantly integrated inside CampusEditorialGallery component */}

      {/* ===================================================================== */}
      {/* 11. VIDEO LIGHTBOX PLAYER MODAL */}
      {/* ===================================================================== */}
      {activeVideo && (
        <div
          ref={videoModalRef}
          className="fixed inset-0 z-50 bg-[#050e1d]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300 select-none"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-[#081426] border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-slate-300" />
                <span className="font-heading font-bold text-sm truncate max-w-xs sm:max-w-md">
                  {activeVideo.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleVideoFullscreen}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isVideoFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Video (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {activeVideo.videoUrl && (
                <video
                  ref={videoElementRef}
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  onLoadedMetadata={(e) => {
                    const { videoWidth, videoHeight } = e.currentTarget;
                    if (videoWidth && videoHeight) {
                      setVideoAspectRatio(videoWidth / videoHeight);
                    }
                  }}
                />
              )}
            </div>

            {/* Video Footer Description */}
            <div className="p-4 bg-[#081426] text-slate-300 text-xs flex items-center justify-between">
              <span className="truncate">{activeVideo.description || "Official Iqra University Reel"}</span>
              <span className="font-mono text-slate-400 shrink-0 ml-4">
                {activeVideo.duration || "Campus Reel"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 12. FULL ANNOUNCEMENT MODAL */}
      {/* ===================================================================== */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20">
                  {selectedAnnouncement.priority} Priority
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedAnnouncement.category} Notice
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-500">
                Published on {selectedAnnouncement.publishDate}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                {selectedAnnouncement.title}
              </h2>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedAnnouncement.message}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                <span>Issued by: </span>
                <strong className="text-slate-800">{selectedAnnouncement.sender}</strong>
              </div>
              <div>
                <span>Audience: </span>
                <span className="text-[#0b1f3a] font-semibold">{selectedAnnouncement.targetAudience}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
