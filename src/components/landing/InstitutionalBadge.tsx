"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface InstitutionalBadgeProps {
  className?: string;
}

export const InstitutionalBadge: React.FC<InstitutionalBadgeProps> = ({ className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.07] hover:bg-white/[0.11] backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-semibold text-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-colors select-none ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span className="tracking-wide">Chartered by Federal Government • HEC Highest W4 Category</span>
    </motion.div>
  );
};
