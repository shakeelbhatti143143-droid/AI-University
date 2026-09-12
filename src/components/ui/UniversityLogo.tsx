"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
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
  badgeText = "Top Ranked",
}) => {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: {
      crest: "w-8 h-8 text-[11px] rounded-lg",
      title: "text-sm",
      sub: "text-[9.5px]",
    },
    md: {
      crest: "w-10 h-10 text-[13px] rounded-xl",
      title: "text-[15px] sm:text-base",
      sub: "text-[10px] sm:text-[10.5px]",
    },
    lg: {
      crest: "w-13 h-13 text-base rounded-xl",
      title: "text-lg sm:text-xl",
      sub: "text-xs",
    },
  }[size];

  const content = (
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      {/* IU Emblem Monogram */}
      <div
        className={cn(
          "relative flex items-center justify-center font-black tracking-tighter transition-all duration-300 shadow-md shrink-0",
          sizeClasses.crest,
          isLight
            ? "bg-white text-iqra-navy-900 border border-slate-200 group-hover:shadow-lg group-hover:border-blue-300"
            : "bg-gradient-to-b from-[#0f448c] via-[#092b5e] to-[#041228] text-white border border-blue-400/30 ring-1 ring-amber-400/20 shadow-blue-950/50 group-hover:border-blue-400/60 group-hover:ring-amber-400/40"
        )}
      >
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="font-extrabold tracking-widest text-[0.85em]">IU</span>
          <div className="h-[2px] w-3/5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mt-0.5 shadow-[0_0_6px_rgba(245,158,11,0.5)]"></div>
        </div>
      </div>

      {/* University Name Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-heading font-extrabold tracking-[0.03em] uppercase leading-none transition-colors",
              sizeClasses.title,
              isLight ? "text-slate-900 group-hover:text-blue-900" : "text-white group-hover:text-slate-100"
            )}
          >
            IQRA UNIVERSITY
          </span>
          {showBadge && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider transition-all",
                isLight
                  ? "bg-amber-100 text-amber-900 border border-amber-300/60"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
              )}
            >
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              {badgeText}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={cn(
              "font-medium tracking-[0.14em] uppercase leading-none",
              sizeClasses.sub,
              isLight ? "text-iqra-blue-700 font-semibold" : "text-blue-200/80"
            )}
          >
            Chak Shezad Campus
          </span>
          <span className={cn("text-[9px]", isLight ? "text-slate-400" : "text-amber-400/80")}>•</span>
          <span
            className={cn(
              "font-medium tracking-[0.14em] uppercase leading-none",
              sizeClasses.sub,
              isLight ? "text-slate-500" : "text-slate-400"
            )}
          >
            Islamabad
          </span>
        </div>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-block transition-transform duration-200 hover:scale-[1.01] focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
