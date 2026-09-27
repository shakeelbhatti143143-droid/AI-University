"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CredentialStatus {
  label: string;
  state: "success" | "danger" | "neutral";
}

export interface CredentialAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  isDestructive?: boolean;
  disabled?: boolean;
}

interface CredentialFooterProps {
  status?: CredentialStatus;
  primaryAction?: CredentialAction;
  secondaryActions?: CredentialAction[];
  className?: string;
  children?: React.ReactNode;
}

export const CredentialFooter: React.FC<CredentialFooterProps> = ({
  status,
  primaryAction,
  secondaryActions = [],
  className,
  children,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const dotColor =
    status?.state === "success"
      ? "text-emerald-600 bg-emerald-500"
      : status?.state === "danger"
      ? "text-red-600 bg-red-500"
      : "text-slate-500 bg-slate-400";

  return (
    <div
      className={cn(
        "mt-auto pt-[16px] border-t border-slate-100 flex items-center justify-between gap-3 text-xs",
        className
      )}
      style={{ borderColor: "var(--card-border, #e2e8f0)" }}
    >
      {/* Status indicator: 7px filled dot + label */}
      {status ? (
        <div className="flex items-center gap-2 select-none shrink-0">
          <span
            className={cn("w-[7px] h-[7px] rounded-full shrink-0", dotColor.split(" ")[1])}
          />
          <span className={cn("text-[12px] font-semibold", dotColor.split(" ")[0])}>
            {status.label}
          </span>
        </div>
      ) : (
        <div />
      )}

      {children}

      {/* Action Area: primary button + overflow button */}
      {(primaryAction || secondaryActions.length > 0) && (
        <div className="flex items-center gap-2 shrink-0 relative">
          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className={cn(
                "h-[32px] px-3.5 text-xs font-bold rounded-lg",
                "bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all select-none",
                "flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
              )}
            >
              {primaryAction.icon && <span className="w-3.5 h-3.5 shrink-0">{primaryAction.icon}</span>}
              <span>{primaryAction.label}</span>
            </button>
          )}

          {secondaryActions.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={cn(
                  "w-[32px] h-[32px] rounded-lg border border-slate-200",
                  "flex items-center justify-center transition-colors text-slate-500",
                  "bg-white hover:bg-slate-50 active:scale-[0.98]"
                )}
                title="More Actions"
                aria-label="More Actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div
                  className={cn(
                    "absolute right-0 bottom-full mb-1.5 w-48 py-1 z-50",
                    "border border-slate-200 bg-white rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
                  )}
                >
                  {secondaryActions.map((act, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={act.disabled}
                      onClick={() => {
                        setMenuOpen(false);
                        act.onClick();
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-xs font-semibold transition-colors",
                        "flex items-center gap-2 hover:bg-slate-50",
                        act.isDestructive
                          ? "text-red-600 hover:bg-red-50"
                          : "text-slate-700 hover:text-slate-900"
                      )}
                    >
                      {act.icon && <span className="w-3.5 h-3.5 shrink-0">{act.icon}</span>}
                      <span className="truncate">{act.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
