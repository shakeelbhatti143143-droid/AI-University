"use client";

import React from "react";
import {
  Menu,
  Bell,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";

interface FacultyHeaderProps {
  facultyName: string;
  designation: string;
  department: string;
  universityEmail: string;
  activeTabTitle: string;
  onOpenMobileSidebar: () => void;
  onLogout: () => void;
  announcementsCount?: number;
}

export const FacultyHeader: React.FC<FacultyHeaderProps> = ({
  facultyName,
  designation,
  department,
  universityEmail,
  activeTabTitle,
  onOpenMobileSidebar,
  onLogout,
  announcementsCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* LEFT: Mobile Toggle & Tab Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
              FACULTY DESK
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Fall 2026 Academic Session
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black font-heading text-slate-900 tracking-tight leading-snug">
            {activeTabTitle}
          </h1>
        </div>
      </div>

      {/* RIGHT: Notifications & Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Semester Term Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-700">Chak Shehzad Campus</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors"
            title="Notifications & Announcements"
          >
            <Bell className="w-4 h-4" />
            {announcementsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>
        </div>

        {/* Profile Pill & Logout Dropdown */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-inner">
            {facultyName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[150px]">
              {facultyName}
            </div>
            <div className="text-[10px] text-blue-600 font-mono truncate max-w-[150px]">
              {universityEmail}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
