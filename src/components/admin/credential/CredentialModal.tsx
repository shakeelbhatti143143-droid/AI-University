"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export const CredentialModal: React.FC<CredentialModalProps> = ({
  isOpen,
  onClose,
  eyebrow,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={cn(
          "relative w-full overflow-hidden flex flex-col max-h-[92vh]",
          "bg-white border border-slate-200 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-150",
          "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-blue-600 before:z-10",
          maxWidthClass
        )}
        style={{
          backgroundColor: "var(--card-bg, #ffffff)",
          borderColor: "var(--card-border, #e2e8f0)",
          borderRadius: "var(--radius-card, 16px)",
        }}
      >
        {/* Header */}
        <div
          className="pt-[22px] px-[24px] pb-[16px] border-b border-slate-100 flex items-start justify-between gap-4 shrink-0"
          style={{ borderColor: "var(--card-border, #e2e8f0)" }}
        >
          <div>
            {eyebrow && (
              <p
                className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5 select-none text-slate-400"
                style={{ color: "var(--text-muted, #64748b)" }}
              >
                {eyebrow}
              </p>
            )}
            <h2
              className="text-[20px] font-bold leading-snug tracking-tight text-slate-800"
              style={{ color: "var(--text-heading, #0f172a)" }}
            >
              {title}
            </h2>
            {description && (
              <p
                className="text-xs leading-relaxed mt-1 text-slate-500"
                style={{ color: "var(--text-muted, #64748b)" }}
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center transition-colors shrink-0 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-[24px] overflow-y-auto flex-1 space-y-4">
          {children}
        </div>

        {/* Footer (if provided) */}
        {footer && (
          <div
            className="px-[24px] py-[16px] border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50/50"
            style={{ borderColor: "var(--card-border, #e2e8f0)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const CredentialInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
> = ({ label, error, className, id, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-[12px] font-semibold text-slate-600 select-none"
          style={{ color: "var(--text-muted, #64748b)" }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full h-[36px] px-3 text-[13px] rounded-xl border border-slate-200 bg-slate-50 text-slate-800 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent",
          "placeholder:text-slate-400",
          error && "border-red-400 ring-red-200",
          className
        )}
        style={{
          borderRadius: "var(--radius-control, 8px)",
        }}
        {...props}
      />
      {error && (
        <p className="text-[11px] text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export const CredentialSelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }
> = ({ label, error, className, id, children, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-[12px] font-semibold text-slate-600 select-none"
          style={{ color: "var(--text-muted, #64748b)" }}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "w-full h-[36px] px-3 text-[13px] rounded-xl border border-slate-200 bg-slate-50 text-slate-800 transition-colors appearance-none",
          "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent",
          error && "border-red-400 ring-red-200",
          className
        )}
        style={{
          borderRadius: "var(--radius-control, 8px)",
        }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-[11px] text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export const CredentialButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }
> = ({ variant = "primary", className, children, ...props }) => {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";

  return (
    <button
      className={cn(
        "h-[34px] px-4 text-xs font-bold rounded-xl transition-all select-none",
        "flex items-center justify-center gap-1.5 active:scale-[0.98]",
        isPrimary
          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          : isDanger
          ? "border border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
          : "border border-slate-200 text-slate-600 bg-white hover:bg-slate-50",
        className
      )}
      style={{
        borderRadius: "var(--radius-control, 8px)",
      }}
      {...props}
    >
      {children}
    </button>
  );
};
