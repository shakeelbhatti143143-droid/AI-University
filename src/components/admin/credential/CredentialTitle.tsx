"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CredentialTitleProps {
  title: string;
  subheading?: string;
  className?: string;
  hasDivider?: boolean;
  children?: React.ReactNode;
}

export const CredentialTitle: React.FC<CredentialTitleProps> = ({
  title,
  subheading,
  className,
  hasDivider = true,
  children,
}) => {
  return (
    <div className={cn("space-y-1 mb-3", className)}>
      <h3 className="font-bold text-[18px] text-slate-800 leading-snug tracking-tight break-words group-hover:text-blue-700 transition-colors">
        {title}
      </h3>

      {subheading && (
        <p className="text-xs font-medium text-slate-500 leading-snug truncate">
          {subheading}
        </p>
      )}

      {children}

      {hasDivider && (
        <div className="pt-2 border-b border-slate-100" />
      )}
    </div>
  );
};
