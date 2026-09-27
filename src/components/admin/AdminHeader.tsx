"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Menu,
  ExternalLink,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ShieldAlert,
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
      case "dashboard": return "Central University Dashboard";
      case "students": return "Student Directory & Records";
      case "academics": return "Academic Overview & Performance Audit";
      case "courses": return "Courses & Curriculum Management";
      case "registration": return "Course Registration Administration";
      case "schedule": return "Master Class Timetable & Conflict Engine";
      case "attendance": return "Attendance Monitoring & HEC Compliance";
      case "assignments": return "University Coursework & Submissions";
      case "profile": return "Super Administrator Profile";
      case "reports": return "Institutional Reports & Audit Logs";
      case "security": return "Role-Based Access Control & Security";
      case "settings": return "Portal System Settings";
      default: return "University Administration";
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Section Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Open administrative sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className="font-bold text-[17px] sm:text-[19px] tracking-tight leading-tight truncate text-slate-800">
              {getSectionTitle(activeTab)}
            </h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] font-semibold mt-0.5">
              <span className="text-slate-400">Iqra University</span>
              <span className="text-slate-200">•</span>
              <span className="hidden sm:inline truncate text-slate-400">Chak Shehzad SIS</span>
            </div>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty, students, courses, exams, registrations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-[36px] pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-700 font-medium"
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
            className="hidden sm:inline-flex items-center gap-1.5 h-[32px] px-3 rounded-lg border border-blue-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            title="Preview student perspective"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative w-[32px] h-[32px] rounded-lg border border-slate-200 flex items-center justify-center transition-colors hover:bg-slate-50 text-slate-500"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-[6px] h-[6px] rounded-full bg-red-500" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                {/* Blue accent top stripe */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-2xl" />
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between mt-1">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Administrative Alerts</h3>
                    <p className="text-[11px] text-slate-400">System notices & pending approvals</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-200 text-slate-500 bg-slate-50">
                    2 Actions
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  <div
                    onClick={() => { setNotificationsOpen(false); onSelectTab("registration"); }}
                    className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-blue-600">Course Registration</span>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                    <p className="font-semibold text-slate-800">New Registration Request</p>
                    <p className="text-[11px] mt-0.5 text-slate-500">
                      Muhammad Shakeel (IU-CS-2023-4819) requested enrollment in CS-415 Deep Learning.
                    </p>
                  </div>

                  <div
                    onClick={() => { setNotificationsOpen(false); onSelectTab("academics"); }}
                    className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-red-500">Academic Notice</span>
                      <span className="text-[10px] text-slate-400">1h ago</span>
                    </div>
                    <p className="font-semibold text-slate-800">Attendance Threshold Flagged</p>
                    <p className="text-[11px] mt-0.5 text-slate-500">
                      Hamza Tariq (IU-CS-2024-5109) dropped below 70% attendance in CS-308 Database Systems.
                    </p>
                  </div>
                </div>

                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => { setNotificationsOpen(false); onSelectTab("reports"); }}
                    className="text-xs hover:underline font-semibold text-blue-600"
                  >
                    View Comprehensive Audit Log →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Super Admin Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-white transition-colors hover:border-blue-300 hover:bg-slate-50"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                SB
              </div>
              <div className="hidden md:block text-left pr-1">
                <span className="block text-xs font-bold leading-none text-slate-800">Shakeel Bhatti</span>
                <span className="text-[10px] uppercase font-bold tracking-wider leading-none mt-1 inline-block text-slate-400">
                  Super Admin
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                {/* Blue accent top stripe */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-2xl" />
                <div className="px-4 py-3 border-b border-slate-100 mt-1">
                  <p className="text-xs font-bold text-slate-800">Shakeel Bhatti</p>
                  <p className="text-[11px] truncate font-mono mt-0.5 text-slate-400">shakeelbhatti143143@gmail.com</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border border-blue-200 text-blue-600 bg-blue-50">
                    Full Administrative Privileges
                  </span>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => { setProfileMenuOpen(false); onSelectTab("profile"); }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors text-slate-600"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Administrator Profile</span>
                  </button>

                  <button
                    onClick={() => { setProfileMenuOpen(false); onSelectTab("security"); }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors text-slate-600"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    <span>Security & RBAC Controls</span>
                  </button>

                  <Link
                    href="/dashboard"
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors text-slate-600"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch to Student Portal</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => { setProfileMenuOpen(false); onLogout(); }}
                    className="w-full px-4 py-2 text-left text-xs hover:bg-red-50 flex items-center gap-2.5 font-semibold transition-colors text-red-500"
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
