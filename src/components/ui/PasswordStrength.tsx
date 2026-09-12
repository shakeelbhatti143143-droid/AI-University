"use client";

import React, { useContext } from "react";
import { cn } from "@/lib/utils";
import { InputThemeContext } from "./InputField";

interface PasswordStrengthProps {
  password?: string;
  variant?: "light" | "dark";
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = "", variant }) => {
  const contextVariant = useContext(InputThemeContext);
  const isDark = (variant || contextVariant || "light") === "dark";

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "None", color: isDark ? "bg-white/10" : "bg-slate-200" };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
      case 3:
        return { score: 3, label: "Good", color: "bg-sky-400", text: "text-sky-400" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-400", text: "text-emerald-400" };
      default:
        return { score: 0, label: "Too short", color: isDark ? "bg-white/10" : "bg-slate-200", text: isDark ? "text-slate-400" : "text-slate-500" };
    }
  };

  const { score, label, color, text } = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="w-full mt-2">
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className={isDark ? "text-slate-300" : "text-slate-500"}>Security strength:</span>
        <span className={cn("font-semibold", text)}>{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              "rounded-full transition-all duration-300",
              step <= score ? color : isDark ? "bg-white/10" : "bg-slate-200"
            )}
          />
        ))}
      </div>
    </div>
  );
};
