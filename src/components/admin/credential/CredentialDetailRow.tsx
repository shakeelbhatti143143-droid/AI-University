"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CredentialDetailRowProps {
  label: string;
  value: React.ReactNode;
  isLink?: boolean;
  isEmail?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const CredentialDetailRow: React.FC<CredentialDetailRowProps> = ({
  label,
  value,
  isLink,
  isEmail,
  href,
  onClick,
  className,
}) => {
  const isActionable = Boolean(isLink || isEmail || href || onClick);

  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-3 text-xs leading-relaxed py-0.5",
        className
      )}
    >
      <span className="shrink-0 font-medium text-slate-500 select-none text-[12px]">
        {label}
      </span>

      <div className="text-right truncate font-semibold text-slate-800 text-[12px]">
        {isActionable ? (
          href ? (
            <a
              href={isEmail && !href.startsWith("mailto:") ? `mailto:${href}` : href}
              target={isEmail ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate block font-medium"
            >
              {value}
            </a>
          ) : (
            <button
              type="button"
              onClick={onClick}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-right truncate block font-medium"
            >
              {value}
            </button>
          )
        ) : (
          <span className="truncate block">
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

interface CredentialDetailListProps {
  children: React.ReactNode;
  className?: string;
}

export const CredentialDetailList: React.FC<CredentialDetailListProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-1.5 my-2.5 p-3 rounded-xl bg-slate-50/90 border border-slate-100", className)}>
      {children}
    </div>
  );
};
