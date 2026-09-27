"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type StatusBadgeType =
  | "ready"
  | "active"
  | "approved"
  | "published"
  | "passed"
  | "pending"
  | "under review"
  | "review"
  | "inactive"
  | "rejected"
  | "dropped"
  | "probation"
  | "cancelled"
  | "failed"
  | "closed"
  | "draft";

export interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: "dot" | "pill" | "both";
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  variant = "both",
  size = "md",
  className,
}) => {
  const norm = (status || "").trim().toLowerCase();
  const displayLabel = label || status || "Unknown";

  let dotColor = "bg-slate-400";
  let textColor = "text-slate-600";
  let pillClasses = "bg-slate-50 text-slate-600 border-slate-200";

  if (["active", "ready", "approved", "published", "passed", "success"].includes(norm)) {
    dotColor = "bg-emerald-500";
    textColor = "text-emerald-700";
    pillClasses = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
  } else if (["pending", "under review", "review", "upcoming"].includes(norm)) {
    dotColor = "bg-amber-500";
    textColor = "text-amber-700";
    pillClasses = "bg-amber-50 text-amber-700 border-amber-200/80";
  } else if (["inactive", "rejected", "dropped", "probation", "cancelled", "failed", "danger"].includes(norm)) {
    dotColor = "bg-rose-500";
    textColor = "text-rose-700";
    pillClasses = "bg-rose-50 text-rose-700 border-rose-200/80";
  } else if (["closed", "draft"].includes(norm)) {
    dotColor = "bg-slate-400";
    textColor = "text-slate-600";
    pillClasses = "bg-slate-100 text-slate-600 border-slate-200/80";
  }

  const dotEl = (
    <span
      className={cn(
        "rounded-full shrink-0",
        size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
        dotColor
      )}
    />
  );

  if (variant === "dot") {
    return (
      <div className={cn("inline-flex items-center gap-1.5 select-none", className)}>
        {dotEl}
        <span className={cn("font-semibold leading-none capitalize", size === "sm" ? "text-[11px]" : "text-xs", textColor)}>
          {displayLabel}
        </span>
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center font-bold tracking-wide uppercase border rounded-full select-none",
          size === "sm" ? "text-[9px] px-2 py-0.5" : "text-[10px] px-2.5 py-0.5",
          pillClasses,
          className
        )}
      >
        {displayLabel}
      </span>
    );
  }

  // variant === "both"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-bold tracking-wide border rounded-full select-none",
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-0.5",
        pillClasses,
        className
      )}
    >
      {dotEl}
      <span className="capitalize">{displayLabel}</span>
    </span>
  );
};
