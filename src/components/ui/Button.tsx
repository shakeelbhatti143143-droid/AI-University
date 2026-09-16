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
        "bg-[#0b1f3a] text-white hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] shadow-sm hover:shadow-md hover:shadow-[#0b1f3a]/20 focus-visible:ring-2 focus-visible:ring-[#0b1f3a] focus-visible:ring-offset-2",
      secondary:
        "bg-white text-[#0b1f3a] hover:bg-[#f0f4fa] hover:text-[#0b1f3a] hover:border-[#0b1f3a]/40 active:bg-[#0b1f3a] active:text-white active:scale-[0.98] border border-slate-200 shadow-xs focus-visible:ring-2 focus-visible:ring-[#0b1f3a]",
      outline:
        "bg-transparent text-[#0b1f3a] border border-[#0b1f3a]/40 hover:bg-[#f0f4fa] hover:border-[#0b1f3a] hover:text-[#0b1f3a] active:bg-[#0b1f3a] active:text-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#0b1f3a]",
      ghost:
        "bg-transparent text-slate-700 hover:text-[#0b1f3a] hover:bg-[#f0f4fa] active:bg-[#0b1f3a] active:text-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#0b1f3a]",
      gold:
        "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 active:bg-[#0b1f3a] active:text-white active:scale-[0.98] shadow-md shadow-amber-500/20 focus-visible:ring-2 focus-visible:ring-[#0b1f3a]",
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
