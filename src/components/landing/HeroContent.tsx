"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { InstitutionalBadge } from "./InstitutionalBadge";
import { UniversityStats } from "./UniversityStats";

export const HeroContent: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full flex flex-col items-start text-left">
      {/* 45-50% Width Left-Aligned Text Column on Desktop */}
      <div className="w-full max-w-2xl lg:max-w-[52%] xl:max-w-[48%] flex flex-col items-start text-left">
        {/* 1. Institutional Badge */}
        <InstitutionalBadge className="mb-5 sm:mb-6" />

        {/* 2. University Identity: Premium 3D Institutional Lockup */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative space-y-1.5 mb-4 sm:mb-5 select-none"
        >
          {/* Subtle ambient backglow */}
          <div className="absolute -inset-x-4 -top-2 bottom-0 bg-blue-500/10 blur-xl rounded-full pointer-events-none -z-10" />

          {/* Heading: IQRA UNIVERSITY with 3D Depth & Light Reflection */}
          <h2 className="relative inline-flex items-baseline gap-2.5 sm:gap-3 text-2xl sm:text-[32px] md:text-[36px] lg:text-[38px] xl:text-[40px] font-black font-heading tracking-[0.05em] uppercase leading-none overflow-hidden py-1">
            {/* Primary Visual Word: IQRA with premium blue accent and high contrast */}
            <span
              className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent"
              style={{
                filter: "drop-shadow(0 2px 10px rgba(56, 189, 248, 0.35)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.9))",
              }}
            >
              IQRA
            </span>

            {/* UNIVERSITY: Elegant, clean, sophisticated platinum-white */}
            <span
              className="text-white font-extrabold tracking-[0.07em]"
              style={{
                filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.9))",
              }}
            >
              UNIVERSITY
            </span>

            {/* Very subtle specular reflection / light sweep overlay */}
            {!shouldReduceMotion && (
              <span
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none hero-reflection-effect opacity-60 mix-blend-overlay"
              />
            )}
          </h2>

          <p className="text-xs sm:text-sm font-bold tracking-[0.24em] uppercase text-sky-200/90 font-mono">
            CHAK SHEHZAD CAMPUS
          </p>
        </motion.div>

        {/* 3. Main Headline: Primary Visual Focus */}
        <motion.h1
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[36px] min-[400px]:text-[40px] sm:text-[48px] md:text-[54px] lg:text-[62px] xl:text-[72px] font-extrabold text-white leading-[1.06] tracking-[-0.02em] font-heading"
          style={{
            textShadow: "0 4px 28px rgba(0, 0, 0, 0.6)",
          }}
        >
          &ldquo;Where Your Future Begins.&rdquo;
        </motion.h1>

        {/* 4. Supporting Academic Paragraph */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }}
          className="mt-4 sm:mt-5 lg:mt-6 text-sm sm:text-base lg:text-[17px] text-slate-300 leading-relaxed font-normal max-w-xl"
        >
          Islamabad&apos;s premier seat of academic distinction, research excellence, and technological innovation. Empowering the next generation of leaders along scenic Park Road.
        </motion.p>
      </div>

      {/* 5. Compact Information Modules (Row underneath the hero content) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
        className="mt-8 sm:mt-10 lg:mt-12 w-full"
      >
        <UniversityStats />
      </motion.div>
    </div>
  );
};
