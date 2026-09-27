"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CredentialHeaderProps {
  eyebrow: string;
  referenceId?: string;
  className?: string;
  children?: React.ReactNode;
}

export const CredentialHeader: React.FC<CredentialHeaderProps> = ({
  eyebrow,
  referenceId,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 mb-3.5 text-xs select-none",
        className
      )}
    >
      <span className="font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 truncate max-w-[200px]">
        {eyebrow}
      </span>

      {referenceId && (
        <span className="font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80 shrink-0 shadow-2xs">
          {referenceId}
        </span>
      )}

      {children}
    </div>
  );
};
