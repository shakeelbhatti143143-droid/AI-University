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
  ExternalLink,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  Settings,
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  onLogout,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

  const getSectionTitle = (tab: AdminTab) => {
    switch (tab) {
      case "dashboard":
        return "Central University Dashboard";
      case "students":
        return "Student Directory & Records";
      case "academics":
        return "Academic Overview & Performance Audit";
      case "courses":
        return "Courses & Curriculum Management";
      case "registration":
        return "Course Registration Administration";
      case "schedule":
        return "Master Class Timetable & Conflict Engine";
      case "attendance":
        return "Attendance Monitoring & HEC Compliance";
      case "assignments":
        return "University Coursework & Submissions";
      case "profile":
        return "Super Administrator Profile";
      case "reports":
        return "Institutional Reports & Audit Logs";
      case "security":
        return "Role-Based Access Control & Security";
      case "settings":
        return "Portal System Settings";
      default:
        return "University Administration";
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Section Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Open administrative sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black font-heading text-slate-900 tracking-tight leading-tight truncate">
              {getSectionTitle(activeTab)}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="text-iqra-blue-700 font-bold uppercase tracking-wider truncate">
                Iqra University Islamabad
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:inline truncate">Chak Shehzad Campus</span>
            </div>
          </div>
        </div>

        {/* Center: Global Search across entire university */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Global Search: Students, Courses, Instructors, IDs, Registrations..."
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

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Switch to Student Portal shortcut */}
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            title="Preview student perspective"
          >
            <ExternalLink className="w-3.5 h-3.5 text-iqra-blue-600" />
            <span>Student Portal</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-iqra-navy-900 hover:bg-slate-50 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Administrative Alerts</h3>
                    <p className="text-[11px] text-slate-500">System notices & pending approvals</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    2 Action Items
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  <div
                    onClick={() => {
                      setNotificationsOpen(false);
                      onSelectTab("registration");
                    }}
                    className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800">
                        Course Registration
                      </span>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                    <p className="font-bold text-slate-800">New Registration Request</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Muhammad Shakeel (IU-CS-2023-4819) requested enrollment in CS-415 Deep Learning.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setNotificationsOpen(false);
                      onSelectTab("academics");
                    }}
                    className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-800">
                        Academic Warning
                      </span>
                      <span className="text-[10px] text-slate-400">1h ago</span>
                    </div>
                    <p className="font-bold text-slate-800">Attendance Threshold Flagged</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Hamza Tariq (IU-CS-2024-5109) dropped below 70% attendance in CS-308 Database Systems.
                    </p>
                  </div>
                </div>

                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      onSelectTab("reports");
                    }}
                    className="text-xs font-semibold text-iqra-blue-600 hover:text-iqra-blue-800"
                  >
                    View All Audit Logs →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Super Admin Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-iqra-gold-500 to-amber-700 text-slate-950 font-black text-xs flex items-center justify-center">
                SB
              </div>
              <div className="hidden md:block text-left pr-1">
                <span className="block text-xs font-bold text-slate-800 leading-none">
                  Shakeel Bhatti
                </span>
                <span className="text-[10px] text-iqra-gold-600 font-bold uppercase leading-none">
                  Super Admin
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Shakeel Bhatti</p>
                  <p className="text-[11px] text-slate-500 truncate font-mono">shakeelbhatti143143@gmail.com</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-iqra-gold-500 text-slate-950">
                    Full Administrative Privileges
                  </span>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSelectTab("profile");
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Administrator Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSelectTab("security");
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                    <span>Security & RBAC Controls</span>
                  </button>

                  <Link
                    href="/dashboard"
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>Switch to Student Portal</span>
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
                    <span>Sign Out Administrator</span>
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
