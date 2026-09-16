"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Calendar,
  Layers,
  Camera,
  ArrowRight,
  Compass,
} from "lucide-react";

export interface GalleryPhoto {
  _id: string;
  _creationTime?: number;
  title: string;
  category: string;
  imageUrl: string;
  storageId?: string;
  description?: string;
  featured?: boolean;
  createdAt?: number;
  location?: string;
  photographer?: string;
  caption?: string;
  [key: string]: any;
}

interface CampusEditorialGalleryProps {
  images: GalleryPhoto[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  isLoading?: boolean;
}

export const CampusEditorialGallery: React.FC<CampusEditorialGalleryProps> = ({
  images,
  selectedCategory,
  onSelectCategory,
  categories,
  isLoading = false,
}) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Lock body scroll when fullscreen lightbox is active
  useEffect(() => {
    if (activeLightboxIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeLightboxIndex]);

  // Keyboard navigation for lightbox (Arrow keys and Escape)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") {
        setActiveLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : null
        );
      }
    },
    [activeLightboxIndex, images.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activePhoto =
    activeLightboxIndex !== null && images[activeLightboxIndex]
      ? images[activeLightboxIndex]
      : null;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(timestamp));
    } catch {
      return null;
    }
  };

  return (
    <section
      id="life-at-campus-gallery"
      className="relative w-full bg-[#050e1d] text-white py-14 sm:py-20 border-y border-white/10 overflow-hidden"
    >
      {/* Background Architectural Accent Glows - strictly institutional deep blue */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0b1f3a]/25 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#07172e]/30 rounded-full blur-[120px] pointer-events-none translate-y-1/3" />

      {/* Controlled Container Max-Width (~1240-1280px) matching luxury institutional portfolio standards */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ================================================================= */}
        {/* SECTION HEADER: Life at Chak Shehzad Campus */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-5 border-b border-white/10">
          <div className="space-y-2.5 max-w-2xl">
            {/* Curatorial Academic Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1f3a]/90 text-slate-200 border border-white/20 text-xs font-semibold tracking-wider uppercase shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
              <Camera className="w-3.5 h-3.5 text-slate-300" />
              <span>Life at Chak Shehzad Campus</span>
            </div>

            {/* Primary Editorial Heading */}
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-heading text-white tracking-tight">
              Architectural Panorama & Campus Photography
            </h2>

            {/* Descriptive Body */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-xl">
              Real photography capturing smart lecture halls, advanced computational laboratories, peaceful courtyards, and vibrant campus life.
            </p>
          </div>

          {/* Action Row & Direct Archive Link */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/explore/gallery"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-bold text-white border border-white/15 transition-all shadow-xs cursor-pointer group"
            >
              <span>View All Photos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CATEGORY FILTER PILLS */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-[#050e1d] shadow-md font-bold"
                    : "bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* COMPACT RESPONSIVE EDITORIAL GALLERY GRID */}
        {/* Desktop: 4 cols | Laptop: 3 cols | Tablet: 2 cols | Mobile: 1 col */}
        {/* ================================================================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-[#081528] border border-white/10 p-3.5 space-y-3 animate-pulse"
              >
                <div className="w-full aspect-[4/3] rounded-xl bg-white/10" />
                <div className="h-4 w-2/3 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {images.map((photo, index) => {
              const formattedDate = formatDate(photo.createdAt || photo._creationTime);
              const locationText = photo.location || "Chak Shehzad Campus, Islamabad";

              return (
                <motion.div
                  key={photo._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.3),
                    ease: "easeOut",
                  }}
                  className="h-full flex flex-col"
                >
                  <div
                    onClick={() => setActiveLightboxIndex(index)}
                    className="group relative w-full h-full flex flex-col rounded-2xl bg-[#081528] border border-white/10 hover:border-white/25 shadow-md hover:shadow-xl hover:shadow-black/40 transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer overflow-hidden select-none"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveLightboxIndex(index);
                      }
                    }}
                    aria-label={`View photograph: ${photo.title}`}
                  >
                    {/* Visual Photography Canvas: Controlled 4:3 Aspect Ratio */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#050e1d] shrink-0">
                      {/* High-Resolution Photograph with 1.03x gentle scale on hover */}
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      />

                      {/* Deep Navy Subtle Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#081528]/80 via-transparent to-black/15 opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

                      {/* Gentle Light Sheen sweep on hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Top Overlay Badge & Fullscreen Expand Trigger */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                        {photo.category && (
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#050e1d]/85 backdrop-blur-md text-white border border-white/20 shadow-xs">
                            {photo.category}
                          </span>
                        )}

                        <div className="w-7 h-7 rounded-full bg-[#050e1d]/85 backdrop-blur-md border border-white/25 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#050e1d] transition-all duration-200 shadow-sm ml-auto">
                          <Maximize2 className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Feature Callout Tag if flagged */}
                      {photo.featured && (
                        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-[#0b1f3a]/90 text-slate-200 border border-white/20">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Compact Editorial Content Card Body */}
                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#081528]">
                      <div className="space-y-1">
                        {/* Title: Single line clamp */}
                        <h3 className="font-heading font-bold text-sm sm:text-base text-white tracking-tight leading-snug line-clamp-1 group-hover:text-slate-200 transition-colors">
                          {photo.title}
                        </h3>

                        {/* Description: 2 lines clamp preview */}
                        {photo.description ? (
                          <p className="text-[11px] sm:text-xs text-slate-300/90 line-clamp-2 leading-relaxed font-normal">
                            {photo.description}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">
                            Official campus photography archive.
                          </p>
                        )}
                      </div>

                      {/* Compact Editorial Metadata Footer */}
                      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                        {/* Location */}
                        <div className="inline-flex items-center gap-1 font-medium text-slate-300 truncate max-w-[140px]">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{locationText}</span>
                        </div>

                        {/* Date or Expand indicator */}
                        <div className="flex items-center gap-2 shrink-0">
                          {formattedDate && (
                            <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                              {formattedDate}
                            </span>
                          )}
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Elegant Empty State */
          <div className="p-10 sm:p-14 rounded-2xl bg-[#081528] border border-white/10 text-center space-y-3 max-w-md mx-auto shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-300">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No Photographs in this Category</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Photographs cataloged by the university administration will dynamically appear here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectCategory("All")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#050e1d] text-xs font-bold shadow-md hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Show All Photographs</span>
            </button>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* ULTRA-PREMIUM FULLSCREEN ARCHITECTURAL LIGHTBOX */}
      {/* ================================================================= */}
      <AnimatePresence>
        {activePhoto && activeLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#050e1d]/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none"
            role="dialog"
            aria-modal="true"
            aria-label={`Photograph viewer: ${activePhoto.title}`}
          >
            {/* Lightbox Top Bar */}
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-4 max-w-7xl w-full mx-auto shrink-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                  {activePhoto.category}
                </div>

                <div className="hidden sm:inline-flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Photograph {String(activeLightboxIndex + 1).padStart(2, "0")} /{" "}
                    {String(images.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveLightboxIndex(null)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 transition-all cursor-pointer text-xs font-semibold"
                title="Close Lightbox (Escape)"
              >
                <span className="hidden sm:inline">Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Center Visual Stage */}
            <div className="relative flex-1 flex items-center justify-center max-w-7xl w-full mx-auto py-4 overflow-hidden">
              {/* Previous Photograph Trigger */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveLightboxIndex(
                      (activeLightboxIndex - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-[#050e1d]/80 hover:bg-white hover:text-[#050e1d] text-white border border-white/20 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl hover:scale-105"
                  title="Previous Photograph (Left Arrow)"
                  aria-label="Previous Photograph"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* High-Resolution Centered Image Frame */}
              <motion.div
                key={activePhoto._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-full max-h-[68vh] sm:max-h-[72vh] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/40 flex items-center justify-center"
              >
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="max-w-full max-h-[68vh] sm:max-h-[72vh] object-contain mx-auto"
                />
              </motion.div>

              {/* Next Photograph Trigger */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveLightboxIndex((activeLightboxIndex + 1) % images.length)
                  }
                  className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-[#050e1d]/80 hover:bg-white hover:text-[#050e1d] text-white border border-white/20 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl hover:scale-105"
                  title="Next Photograph (Right Arrow)"
                  aria-label="Next Photograph"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Lightbox Editorial Caption & Metadata Drawer */}
            <div className="max-w-4xl w-full mx-auto border-t border-white/10 pt-4 text-center space-y-2 shrink-0">
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activePhoto.location || "Chak Shehzad Campus, Islamabad"}</span>
                </span>

                {activePhoto.createdAt && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(activePhoto.createdAt || activePhoto._creationTime)}</span>
                    </span>
                  </>
                )}
              </div>

              <h3 className="font-heading font-black text-lg sm:text-2xl text-white tracking-tight">
                {activePhoto.title}
              </h3>

              {activePhoto.description && (
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                  {activePhoto.description}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
