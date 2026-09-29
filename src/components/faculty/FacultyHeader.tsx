"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Calendar,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
  Camera,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Building2,
  Mail,
} from "lucide-react";

interface FacultyHeaderProps {
  facultyName: string;
  designation: string;
  department: string;
  universityEmail: string;
  profilePhoto?: string;
  activeTabTitle: string;
  onOpenMobileSidebar: () => void;
  onLogout: () => void;
  announcementsCount?: number;
  onOpenProfileModal?: () => void;
  onOpenEditModal?: () => void;
  onNavigateSettings?: () => void;
  onNavigateProfile?: () => void;
}

export const FacultyHeader: React.FC<FacultyHeaderProps> = ({
  facultyName,
  designation,
  department,
  universityEmail,
  profilePhoto,
  activeTabTitle,
  onOpenMobileSidebar,
  onLogout,
  announcementsCount = 0,
  onOpenProfileModal,
  onOpenEditModal,
  onNavigateSettings,
  onNavigateProfile,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return "FA";
    return nameStr
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#070e1e]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* LEFT: Mobile Toggle & Tab Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-wider uppercase text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-blue-200/60 dark:border-cyan-800/50">
              FACULTY PORTAL
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Fall 2026 Academic Session
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black font-heading text-slate-900 dark:text-white tracking-tight leading-snug">
            {activeTabTitle}
          </h1>
        </div>
      </div>

      {/* RIGHT: Notifications & Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Campus Term Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Chak Shehzad Campus</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white relative transition-colors"
            title="Notifications & Announcements"
          >
            <Bell className="w-4 h-4" />
            {announcementsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>
        </div>

        {/* USER PROFILE DROPDOWN */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800" ref={profileRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-expanded={profileMenuOpen}
          >
            {/* Top Nav Circular Avatar */}
            <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-sm shrink-0 overflow-hidden">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={facultyName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0B1F3A] to-[#122B4E] text-cyan-300 font-bold flex items-center justify-center text-xs">
                  {getInitials(facultyName)}
                </div>
              )}
            </div>

            {/* Faculty Name & Role / Designation */}
            <div className="hidden sm:block text-left pr-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[140px]">
                {facultyName}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-cyan-400 font-semibold truncate max-w-[140px]">
                {designation || "Assistant Professor"}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* DROPDOWN MENU */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              {/* User summary card inside dropdown */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-md shrink-0 overflow-hidden">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={facultyName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0B1F3A] to-[#122B4E] text-cyan-300 font-black flex items-center justify-center text-sm">
                      {getInitials(facultyName)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {facultyName}
                  </h4>
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 truncate">
                    {designation || "Assistant Professor"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {universityEmail}
                  </p>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="p-2 space-y-1">
                {/* 1. My Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    if (onNavigateProfile) {
                      onNavigateProfile();
                    } else if (onOpenProfileModal) {
                      onOpenProfileModal();
                    }
                  }}
                  className="w-full px-3.5 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center gap-2.5 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span>My Profile</span>
                </button>

                {/* 2. Edit Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    if (onOpenEditModal) onOpenEditModal();
                    else if (onOpenProfileModal) onOpenProfileModal();
                  }}
                  className="w-full px-3.5 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center gap-2.5 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span>Edit Profile</span>
                </button>

                {/* 3. Change Profile Picture */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    if (onOpenEditModal) onOpenEditModal();
                    else if (onOpenProfileModal) onOpenProfileModal();
                  }}
                  className="w-full px-3.5 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center gap-2.5 transition-colors"
                >
                  <Camera className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Change Profile Picture</span>
                </button>

                {/* 4. Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    if (onNavigateSettings) onNavigateSettings();
                  }}
                  className="w-full px-3.5 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center gap-2.5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Settings</span>
                </button>

                {/* Public University Homepage */}
                <Link
                  href="/"
                  className="w-full px-3.5 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center gap-2.5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>University Homepage</span>
                </Link>
              </div>

              {/* 5. Logout */}
              <div className="p-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full px-3.5 py-2 rounded-xl text-left text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
