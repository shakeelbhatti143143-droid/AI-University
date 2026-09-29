"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UniversityLogoProps {
  className?: string;
  variant?: "light" | "dark" | "default";
  size?: "sm" | "md" | "lg";
  withLink?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  className,
  variant = "default",
  size = "md",
  withLink = true,
  showBadge = false,
  badgeText = "Chartered",
}) => {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: {
      crest: "w-9 h-9 rounded-[10px]",
      iqra: "text-[14px]",
      univ: "text-[12px]",
      sub: "text-[8.5px]",
      monogram: "text-[11px]",
      bar: "h-[1.5px] w-3.5",
    },
    md: {
      crest: "w-11 h-11 sm:w-11.5 sm:h-11.5 rounded-[13px]",
      iqra: "text-[17px] sm:text-[18.5px]",
      univ: "text-[15px] sm:text-[16.5px]",
      sub: "text-[10px] sm:text-[10.5px]",
      monogram: "text-[13px] sm:text-[14px]",
      bar: "h-[2px] w-4.5",
    },
    lg: {
      crest: "w-14 h-14 rounded-[16px]",
      iqra: "text-[21px] sm:text-[23px]",
      univ: "text-[18px] sm:text-[20px]",
      sub: "text-xs",
      monogram: "text-base",
      bar: "h-[2.5px] w-6",
    },
  }[size];

  const content = (
    <div className={cn("flex items-center gap-3 sm:gap-3.5 select-none group", className)}>
      {/* 3D Institutional Emblem Crest */}
      <div
        className={cn(
          "relative flex items-center justify-center font-black tracking-tighter shrink-0 transition-all duration-300 ease-out animate-crest-depth",
          sizeClasses.crest,
          isLight
            ? "bg-gradient-to-br from-[#0e274a] via-[#091b35] to-[#040e1c] text-white border border-sky-900/30 group-hover:border-sky-600/50"
            : "bg-gradient-to-br from-[#122e58] via-[#0a1c36] to-[#030914] text-white border border-sky-400/25 group-hover:border-sky-400/50"
        )}
        style={{
          boxShadow: isLight
            ? "inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.5), 0 4px 14px rgba(11,31,58,0.22)"
            : "inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.7), 0 4px 18px rgba(0,0,0,0.55), 0 0 16px rgba(56,189,248,0.18)",
        }}
      >
        {/* Specular top-half glass highlight reflection */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.16] to-transparent rounded-t-[12px] pointer-events-none" />

        {/* Micro-animation: Diagonal subtle light sweep */}
        <div className="absolute inset-0 overflow-hidden rounded-[12px] pointer-events-none">
          <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent rotate-12 pointer-events-none animate-crest-sheen" />
        </div>

        {/* Sculpted IU Crest Monogram with 3D Depth */}
        <div className="relative z-10 flex flex-col items-center justify-center leading-none">
          <span
            className={cn(
              "font-black tracking-widest bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.9)]",
              sizeClasses.monogram
            )}
          >
            IU
          </span>
          <div
            className={cn(
              "bg-gradient-to-r from-sky-400 via-blue-300 to-sky-400 rounded-full mt-0.5 shadow-[0_1px_3px_rgba(56,189,248,0.6)]",
              sizeClasses.bar
            )}
          />
        </div>
      </div>

      {/* University Name & Campus Text */}
      <div className="flex flex-col justify-center">
        {/* Row 1: IQRA UNIVERSITY */}
        <div className="flex items-baseline gap-2 sm:gap-2.5">
          {/* Primary Visual Word: IQRA with sophisticated premium blue & 3D depth */}
          <span
            className={cn(
              "font-heading font-black tracking-[0.04em] uppercase leading-none transition-all duration-300",
              sizeClasses.iqra,
              isLight
                ? "bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#0b1f3a] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] group-hover:from-[#0284c7] group-hover:to-[#0369a1]"
                : "bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(56,189,248,0.28)] group-hover:from-sky-300 group-hover:via-blue-300 group-hover:to-indigo-200"
            )}
          >
            IQRA
          </span>

          {/* Secondary word: UNIVERSITY - elegant, clean, slightly larger */}
          <span
            className={cn(
              "font-heading font-bold tracking-[0.07em] uppercase leading-none transition-colors duration-200",
              sizeClasses.univ,
              isLight
                ? "text-slate-900 group-hover:text-slate-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
                : "text-white/95 group-hover:text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]"
            )}
          >
            UNIVERSITY
          </span>

          {showBadge && (
            <span
              className={cn(
                "hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider transition-all ml-1",
                isLight
                  ? "bg-slate-100 text-[#0b1f3a] border border-slate-300"
                  : "bg-white/10 text-slate-200 border border-white/20 shadow-xs"
              )}
            >
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              {badgeText}
            </span>
          )}
        </div>

        {/* Row 2: Exact Campus Location: CHAK SHEHZAD CAMPUS • ISLAMABAD */}
        <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5">
          <span
            className={cn(
              "font-medium tracking-[0.16em] uppercase leading-none transition-colors duration-200",
              sizeClasses.sub,
              isLight ? "text-slate-600 group-hover:text-slate-800" : "text-slate-400 group-hover:text-slate-300"
            )}
          >
            CHAK SHEHZAD CAMPUS
          </span>
          <span
            className={cn(
              "text-[9px] font-bold leading-none select-none",
              isLight ? "text-slate-400" : "text-sky-400/60"
            )}
          >
            •
          </span>
          <span
            className={cn(
              "font-medium tracking-[0.16em] uppercase leading-none transition-colors duration-200",
              sizeClasses.sub,
              isLight ? "text-slate-500 group-hover:text-slate-700" : "text-slate-400 group-hover:text-slate-300"
            )}
          >
            ISLAMABAD
          </span>
        </div>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link
        href="/"
        className="inline-block transition-transform duration-200 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 rounded-xl"
        aria-label="Iqra University Chak Shehzad Campus Homepage"
      >
        {content}
      </Link>
    );
  }

  return content;
};

