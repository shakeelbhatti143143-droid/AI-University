"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CredentialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  children,
  className,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={cn(
        "relative flex flex-col justify-between overflow-hidden group",
        "bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200",
        "pt-5 px-5 pb-4",
        "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-blue-600 before:via-indigo-600 before:to-cyan-500",
        className
      )}
      style={{
        backgroundColor: "var(--card-bg, #ffffff)",
        borderColor: "var(--card-border, #e2e8f0)",
        borderRadius: "var(--radius-card, 16px)",
      }}
      {...props}
    >
      {children}
    </Component>
  );
};
