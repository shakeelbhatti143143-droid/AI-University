"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CredentialFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export const CredentialFilterBar: React.FC<CredentialFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search records...",
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3",
        "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-blue-600",
        className
      )}
      style={{
        backgroundColor: "var(--card-bg, #ffffff)",
        borderColor: "var(--card-border, #e2e8f0)",
        borderRadius: "var(--radius-card, 16px)",
      }}
    >
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[240px]">
        <Search
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={cn(
            "w-full h-[36px] pl-9 pr-3 text-[13px] rounded-xl border border-slate-200 bg-slate-50 text-slate-800 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent",
            "placeholder:text-slate-400"
          )}
        />
      </div>

      {/* Filter Options */}
      {children && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 text-xs">
          {children}
        </div>
      )}
    </div>
  );
};
