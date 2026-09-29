"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface StatItem {
  id: string;
  label: string;
  primaryValue: string;
  description: string;
  icon: LucideIcon;
  accentColor?: string;
  iconColor?: string;
}

interface StatCardProps {
  item: StatItem;
  index: number;
}

export const StatCard: React.FC<StatCardProps> = ({ item, index }) => {
  const shouldReduceMotion = useReducedMotion();
  const Icon = item.icon;

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: shouldReduceMotion ? 0 : 0.35 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -2.5,
              transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            }
      }
      className="group relative p-3.5 sm:p-4 rounded-xl bg-gradient-to-b from-[#0e1d35]/80 via-[#0a1628]/75 to-[#050e1d]/85 backdrop-blur-xl border border-white/[0.08] hover:border-sky-400/35 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_12px_36px_rgba(2,132,199,0.18),0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.16)] flex flex-col justify-between overflow-hidden select-none cursor-default"
    >
      {/* Hairline Specular Top Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-sky-400/40 transition-colors duration-300" />

      {/* Subtle Internal Ambient Light on Hover */}
      <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-sky-400/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Row: Small Uppercase Label & Elegant Icon */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 group-hover:text-slate-300 transition-colors font-mono">
          {item.label}
        </span>
        <div className="w-5.5 h-5.5 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-sky-500/10 group-hover:border-sky-400/25 transition-all duration-300 shadow-sm">
          <Icon className="w-3 h-3 text-sky-300/85 group-hover:text-sky-200 transition-colors" />
        </div>
      </div>

      {/* Main Hierarchy: Prominent Primary Value & Supporting Description */}
      <div className="relative z-10 space-y-0.5">
        <div className="text-[14.5px] sm:text-base font-bold font-heading text-white tracking-tight leading-snug group-hover:text-slate-100 transition-colors">
          {item.primaryValue}
        </div>
        <div className="text-[11px] sm:text-[11.5px] text-slate-400 group-hover:text-slate-300/90 transition-colors leading-tight truncate">
          {item.description}
        </div>
      </div>
    </motion.div>
  );
};

