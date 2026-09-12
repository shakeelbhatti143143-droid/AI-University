"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { StudentProfile, Announcement } from "@/lib/dashboard-data";
import { DashboardTab } from "./Sidebar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  profile: StudentProfile;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  announcements: Announcement[];
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  announcements,
  onOpenMobileMenu,
  onLogout,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSectionTitle = (tab: DashboardTab) => {
    switch (tab) {
      case "dashboard":
        return "Student Dashboard";
      case "profile":
        return "My Student Profile";
      case "academics":
        return "Academic Overview & Performance";
      case "courses":
        return "My Enrolled Courses";
      case "registration":
        return "Course Registration & Catalog";
      case "schedule":
        return "Class Schedule & Timetable";
      case "attendance":
        return "Attendance Records & Policies";
      case "assignments":
        return "Course Assignments & Submissions";
      default:
        return "Student Portal";
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Mobile trigger + Section Title & Campus breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black font-heading text-slate-900 tracking-tight leading-tight truncate">
              {getSectionTitle(activeTab)}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="text-iqra-blue-700 font-semibold truncate hidden sm:inline">
                Iqra University Islamabad
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="truncate">{profile.currentSemester} ({profile.academicSession})</span>
            </div>
          </div>
        </div>

        {/* Center / Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses, instructors, codes, assignments..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20 focus:border-iqra-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons: Session Tag, Notifications, Profile Dropdown */}
        <div className="flex items-center gap-2.5">
          {/* Quick Session Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-iqra-blue-700 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-iqra-blue-600" />
            <span>Session: Fall 2026</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-iqra-navy-900 hover:bg-slate-50 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Academic Notifications</h3>
                    <p className="text-[11px] text-slate-500">Iqra University Chak Shehzad Bulletins</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    3 New
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {announcements.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                            item.category === "Examination"
                              ? "bg-rose-100 text-rose-700"
                              : item.category === "Administrative"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                          )}
                        >
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">{item.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      onSelectTab("dashboard");
                    }}
                    className="text-xs font-semibold text-iqra-blue-600 hover:text-iqra-blue-800 transition-colors"
                  >
                    View All Campus Announcements →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-iqra-navy-900 text-white font-bold text-xs flex items-center justify-center">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="hidden md:block text-left pr-1">
                <span className="block text-xs font-bold text-slate-800 leading-none">
                  {profile.name.split(" ")[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-mono leading-none">
                  {profile.studentId.split("-").slice(2).join("-")}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{profile.studentId}</p>
                  <p className="text-[11px] text-iqra-blue-700 font-medium truncate mt-0.5">
                    {profile.program}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSelectTab("profile");
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Profile & Record</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSelectTab("academics");
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    <span>Academic Transcript / GPA</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSelectTab("courses");
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Enrolled Courses</span>
                  </button>

                  <Link
                    href="/"
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>University Homepage</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
