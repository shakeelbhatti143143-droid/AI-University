"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  CheckSquare,
  FileText,
  GraduationCap,
  Award,
  Bell,
  FolderArchive,
  Settings,
  LogOut,
  Sparkles,
  Shield,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FacultyTab =
  | "overview"
  | "courses"
  | "schedule"
  | "students"
  | "attendance"
  | "assignments"
  | "exams"
  | "results"
  | "announcements"
  | "resources"
  | "settings";

interface FacultySidebarProps {
  activeTab: FacultyTab;
  onSelectTab: (tab: FacultyTab) => void;
  facultyName: string;
  designation: string;
  department: string;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FacultySidebar: React.FC<FacultySidebarProps> = ({
  activeTab,
  onSelectTab,
  facultyName,
  designation,
  department,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: Array<{
    id: FacultyTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "courses",
      label: "Assigned Courses",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "schedule",
      label: "Class Schedule",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "students",
      label: "Enrolled Students",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "attendance",
      label: "Attendance Record",
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      id: "assignments",
      label: "Assignments & Grading",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "exams",
      label: "Examinations",
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: "results",
      label: "Results & Marks Entry",
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "resources",
      label: "Teaching Resources",
      icon: <FolderArchive className="w-4 h-4" />,
    },
    {
      id: "settings",
      label: "Settings & Password",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B1528] text-white flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 lg:translate-x-0",
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* TOP BRAND HEADER */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-[#0B1528] rounded-[14px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wider uppercase text-white">
                    IQRA UNIVERSITY
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    FACULTY PORTAL
                  </span>
                </div>
              </div>
            </div>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* FACULTY PROFILE PILL (TOP) */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
              {facultyName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-white truncate">{facultyName}</div>
              <div className="text-[10px] text-cyan-400 font-semibold truncate">
                {designation}
              </div>
              <div className="text-[9px] text-slate-400 truncate">{department}</div>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-slate-800">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "transition-colors",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM LOGOUT & FOOTER */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>

          <div className="text-center text-[10px] text-slate-500">
            Iqra University SIS • Fall 2026
          </div>
        </div>
      </aside>
    </>
  );
};
