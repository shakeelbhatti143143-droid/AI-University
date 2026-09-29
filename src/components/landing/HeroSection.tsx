"use client";

import React from "react";
import Image from "next/image";
import { HeroContent } from "./HeroContent";

const CAMPUS_HERO_IMAGE = "/images/campus-hero.jpg";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-screen flex flex-col justify-center pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden">
      {/* Full-bleed Campus Background Image & Layered Cinematic Overlay */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
        {/* Authentic Campus Photography */}
        <Image
          src={CAMPUS_HERO_IMAGE}
          alt="Iqra University Chak Shehzad Campus Islamabad"
          fill
          priority
          quality={95}
          className="object-cover object-[center_right] sm:object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
        />

        {/* Desktop Left-to-Right Contrast Gradient:
            Guarantees crystal clear legibility on the left text-safe zone (~45-50% width),
            while allowing the campus architecture and grounds on the right to shine through authentically */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background: `linear-gradient(90deg, 
              rgba(5, 14, 29, 0.97) 0%, 
              rgba(5, 14, 29, 0.92) 34%, 
              rgba(5, 14, 29, 0.70) 52%, 
              rgba(5, 14, 29, 0.32) 75%, 
              rgba(5, 14, 29, 0.16) 100%
            )`,
          }}
        />

        {/* Mobile & Tablet Full-Coverage Balanced Gradient */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background: `linear-gradient(180deg, 
              rgba(5, 14, 29, 0.92) 0%, 
              rgba(5, 14, 29, 0.82) 40%, 
              rgba(5, 14, 29, 0.88) 75%, 
              rgba(5, 14, 29, 0.98) 100%
            )`,
          }}
        />

        {/* Top Floating Navbar Blend & Bottom Section Transition Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(5, 14, 29, 0.72) 0%, 
              transparent 18%, 
              transparent 72%, 
              rgba(5, 14, 29, 0.96) 100%
            )`,
          }}
        />

        {/* Subtle Radial Vignette for Depth */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 78% 45%, rgba(5, 14, 29, 0) 25%, rgba(5, 14, 29, 0.42) 75%, rgba(5, 14, 29, 0.85) 100%)`,
          }}
        />

        {/* Soft Ambient Glow Behind Typography */}
        <div className="absolute top-1/4 -left-12 w-[420px] h-[420px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Hero Foreground Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto flex flex-col">
        <HeroContent />
      </div>
    </section>
  );
};
