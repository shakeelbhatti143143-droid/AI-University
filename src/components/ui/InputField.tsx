"use client";

import React, { InputHTMLAttributes, useState, useContext, createContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const InputThemeContext = createContext<"light" | "dark">("light");

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  variant?: "light" | "dark";
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      label,
      labelClassName,
      error,
      helperText,
      leftIcon,
      isPassword = false,
      type = "text",
      id,
      variant,
      ...props
    },
    ref
  ) => {
    const contextVariant = useContext(InputThemeContext);
    const isDark = (variant || contextVariant || "light") === "dark";

    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const inputId = id || props.name;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-xs font-semibold tracking-wide select-none flex items-center justify-between",
              isDark ? "text-slate-200" : "text-slate-700",
              labelClassName
            )}
          >
            <span>
              {label}
              {props.required && (
                <span className={cn("ml-1 font-bold", isDark ? "text-iqra-gold-400" : "text-rose-500")}>
                  *
                </span>
              )}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className={cn(
                "absolute left-3.5 pointer-events-none shrink-0",
                isDark ? "text-slate-400" : "text-slate-400"
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "w-full h-11 px-3.5 text-sm rounded-xl transition-all duration-200 focus:outline-none",
              leftIcon ? "pl-10" : "pl-3.5",
              isPassword ? "pr-10" : "pr-3.5",
              isDark
                ? cn(
                    "text-white bg-[#0a172d] border border-white/20 placeholder:text-slate-400 font-normal",
                    "hover:border-white/35 focus:bg-[#0d1e38] focus:border-iqra-gold-400 focus:ring-2 focus:ring-iqra-gold-400/25 shadow-sm",
                    error && "border-rose-400/80 bg-rose-950/20 focus:border-rose-400 focus:ring-rose-400/25"
                  )
                : cn(
                    "text-slate-900 bg-slate-50 border border-slate-200 placeholder:text-slate-400",
                    "hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 shadow-sm",
                    error && "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  ),
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-3.5 focus:outline-none p-1 rounded-lg transition-colors",
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-white/10"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              )}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {error ? (
          <p
            className={cn(
              "text-xs font-medium mt-0.5 animate-fadeIn",
              isDark ? "text-rose-400" : "text-rose-600"
            )}
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            className={cn(
              "text-[11px] mt-0.5",
              isDark ? "text-slate-400" : "text-slate-500"
            )}
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";
