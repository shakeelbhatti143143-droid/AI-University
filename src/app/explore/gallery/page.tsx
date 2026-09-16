"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Image as ImageIcon,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UniversityGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const images = useQuery(
    api.website.getGalleryImages,
    isConvexConfigured
      ? {
          category: selectedCategory === "All" ? undefined : selectedCategory,
        }
      : "skip"
  );

  const isLoading = images === undefined;
  const imageList = images || [];

  const categories = [
    "All",
    "Campus",
    "Events",
    "Students",
    "Faculty",
    "Facilities",
    "Activities",
  ];

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % imageList.length : null));
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + imageList.length) % imageList.length : null));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, imageList.length]);

  // Lock body overflow when lightbox is open
  useEffect(() => {
    if (activeImageIndex !== null) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [activeImageIndex]);

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const handleNext = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % imageList.length);
    }
  };

  const handlePrev = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + imageList.length) % imageList.length);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Campus Gallery" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <ImageIcon className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Visual Tour</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
            Campus Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Experience the architectural design, research labs, student events, and vibrant academic atmosphere of Chak Shezad Campus Islamabad.
          </p>
        </div>

        {/* Counter */}
        <div className="px-6 py-4 rounded-2xl bg-[#f0f4fa] border border-[#0b1f3a]/15 text-center shrink-0 self-start md:self-auto">
          <span className="text-2xl sm:text-3xl font-black font-heading text-[#0b1f3a] block">
            {imageList.length}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Photographs
          </span>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#0b1f3a] text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa] border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="aspect-[4/3] rounded-2xl bg-slate-100 border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && imageList.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 max-w-md mx-auto shadow-xs">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Images in this Category</h3>
          <p className="text-xs text-slate-500">
            Official campus photos uploaded by administrators will appear in this showcase.
          </p>
        </div>
      )}

      {/* Gallery Grid */}
      {!isLoading && imageList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageList.map((img, idx) => (
            <div
              key={img._id}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200/90 hover:border-[#0b1f3a]/40 shadow-xs hover:shadow-xl cursor-pointer transition-all duration-400 ease-out select-none"
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              />

              {/* Gradient Overlay & Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050e1d]/90 via-[#050e1d]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/25 uppercase tracking-wider">
                    {img.category}
                  </span>
                  <span className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-heading font-black text-sm sm:text-base text-white leading-snug">
                    {img.title}
                  </h3>
                  {img.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {img.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Lightbox Modal */}
      {activeImageIndex !== null && imageList[activeImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-[#050e1d]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-300 select-none"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4 max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20">
                {imageList[activeImageIndex].category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Image {activeImageIndex + 1} of {imageList.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/15 transition-all cursor-pointer"
              title="Close Lightbox (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image Area */}
          <div className="relative flex-1 flex items-center justify-center max-w-7xl w-full mx-auto py-4 overflow-hidden">
            {imageList.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative max-w-full max-h-[72vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={imageList[activeImageIndex].imageUrl}
                alt={imageList[activeImageIndex].title}
                className="max-w-full max-h-[72vh] object-contain mx-auto"
              />
            </div>

            {imageList.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Footer Caption */}
          <div className="max-w-7xl w-full mx-auto border-t border-white/10 pt-4 text-center space-y-1">
            <h3 className="font-heading font-bold text-base sm:text-xl text-white">
              {imageList[activeImageIndex].title}
            </h3>
            {imageList[activeImageIndex].description && (
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
                {imageList[activeImageIndex].description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
