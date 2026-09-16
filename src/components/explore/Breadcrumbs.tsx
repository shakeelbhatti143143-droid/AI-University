"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-1.5 text-xs text-slate-500 py-2.5 ${className}`}
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-slate-500 hover:text-[#0b1f3a] transition-colors"
        title="Home"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span className="sr-only">Home</span>
      </Link>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

      <Link
        href="/explore"
        className="flex items-center gap-1 text-slate-600 hover:text-[#0b1f3a] transition-colors font-medium"
      >
        <span>Explore</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-[#0b1f3a] transition-colors font-medium text-slate-600 max-w-[200px] truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[#0b1f3a] font-bold max-w-[280px] truncate">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
