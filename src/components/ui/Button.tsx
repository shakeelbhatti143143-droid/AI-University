"use client";

import React, { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-9 px-3.5 text-xs font-medium rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm font-semibold rounded-xl gap-2",
      lg: "h-13 px-7 text-base font-semibold rounded-xl gap-2.5",
    }[size];

    const variantClasses = {
      primary:
        "bg-[#0066cc] text-white hover:bg-[#0052a3] active:bg-[#003d7a] shadow-md hover:shadow-blue-500/25 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      secondary:
        "bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 shadow-sm focus-visible:ring-2 focus-visible:ring-slate-400",
      outline:
        "bg-transparent text-white border border-white/30 hover:border-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white",
      ghost:
        "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400",
      gold:
        "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 focus-visible:ring-2 focus-visible:ring-amber-500",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
