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
  badgeText = "Chartered",
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
            ? "bg-[#0b1f3a] text-white border border-slate-300 group-hover:shadow-lg group-hover:border-[#0b1f3a]"
            : "bg-gradient-to-b from-[#132c52] via-[#0b1f3a] to-[#050e1d] text-white border border-white/20 ring-1 ring-white/10 shadow-black/40 group-hover:border-white/40"
        )}
      >
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="font-black tracking-widest text-[0.85em] text-white">IU</span>
          <div className="h-[2px] w-3/5 bg-white/70 rounded-full mt-0.5 shadow-sm"></div>
        </div>
      </div>

      {/* University Name Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-heading font-extrabold tracking-[0.03em] uppercase leading-none transition-colors",
              sizeClasses.title,
              isLight ? "text-slate-900 group-hover:text-[#0b1f3a]" : "text-white group-hover:text-slate-100"
            )}
          >
            IQRA UNIVERSITY
          </span>
          {showBadge && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider transition-all",
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
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={cn(
              "font-medium tracking-[0.14em] uppercase leading-none",
              sizeClasses.sub,
              isLight ? "text-[#0b1f3a] font-semibold" : "text-slate-300"
            )}
          >
            Chak Shezad Campus
          </span>
          <span className={cn("text-[9px]", isLight ? "text-slate-400" : "text-slate-400")}>•</span>
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
