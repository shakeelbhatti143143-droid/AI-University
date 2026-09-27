"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-10 sm:p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3",
        className
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="pt-2">
          <button
            type="button"
            onClick={action.onClick}
            className="h-[36px] px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            <span>{action.label}</span>
          </button>
        </div>
      )}
    </div>
  );
};
