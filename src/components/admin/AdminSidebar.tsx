"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FolderPlus,
  CalendarDays,
  CheckCircle2,
  FileText,
  UserCheck,
  FileSpreadsheet,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  MapPin,
  X,
  Video,
  Award,
  Layers,
  Calendar,
  Clock,
  Bell,
  Megaphone,
  Bot,
  Brain,
  BarChart3,
  History,
  Lock,
  DoorOpen,
  ScrollText,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab =
  | "dashboard"
  // People
  | "students"
  | "faculty"
  | "administrators"
  | "applications"
  | "videos"
  // Academics
  | "academics"
  | "departments"
  | "programs"
  | "courses"
  | "course-sections"
  | "registration"
  | "schedule"
  | "attendance"
  | "assignments"
  // Examinations
  | "exams"
  | "exam-schedule"
  | "exam-rooms"
  | "results"
  // Academic Records
  | "progression"
  | "transcripts"
  | "gpa-cgpa"
  | "reports"
  // University Website
  | "website-posts"
  | "website-events"
  | "website-gallery"
  | "website-fees"
  | "website-facilities"
  | "website-location"
  | "website-profile"
  // Communication
  | "announcements"
  | "notifications"
  | "videos"
  // AI & Learning
  | "ai-academic-assistant"
  | "ai-assistant"
  | "ai-planner"
  | "ai-analytics"
  // System
  | "user-management"
  | "security"
  | "audit-logs"
  | "settings"
  | "profile";

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
  pendingApplicationsCount?: number;
  pendingRegistrationsCount?: number;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  pendingApplicationsCount = 0,
  pendingRegistrationsCount = 0,
  onLogout,
}) => {
  const navGroups: NavGroup[] = [
    {
      title: "PEOPLE",
      items: [
        { id: "students", label: "Students", icon: Users },
        { id: "faculty", label: "Faculty Members", icon: UserCheck },
        { id: "administrators", label: "Administrators", icon: ShieldCheck },
        {
          id: "applications",
          label: "Admissions & Applications",
          icon: ScrollText,
          badge: pendingApplicationsCount > 0 ? `${pendingApplicationsCount}` : undefined,
          badgeColor: "bg-amber-400 text-slate-950 font-black",
        },
      ],
    },
    {
      title: "ACADEMICS",
      items: [
        { id: "departments", label: "Departments", icon: Building2 },
        { id: "programs", label: "Programs", icon: GraduationCap },
        { id: "courses", label: "Courses", icon: BookOpen },
        { id: "course-sections", label: "Course Sections", icon: Layers },
        {
          id: "registration",
          label: "Course Registration",
          icon: FolderPlus,
          badge: pendingRegistrationsCount > 0 ? `${pendingRegistrationsCount}` : undefined,
          badgeColor: "bg-cyan-400 text-slate-950 font-black",
        },
        { id: "schedule", label: "Class Schedule", icon: CalendarDays },
        { id: "attendance", label: "Attendance", icon: CheckCircle2 },
        { id: "assignments", label: "Assignments", icon: FileText },
      ],
    },
    {
      title: "EXAMINATIONS",
      items: [
        { id: "exams", label: "Exams", icon: Award },
        { id: "exam-schedule", label: "Exam Schedule", icon: Calendar },
        { id: "exam-rooms", label: "Exam Rooms", icon: DoorOpen },
        { id: "results", label: "Results & Grades", icon: BarChart3 },
      ],
    },
    {
      title: "ACADEMIC RECORDS",
      items: [
        { id: "progression", label: "Academic Progression", icon: Sparkles },
        { id: "transcripts", label: "Transcripts", icon: ScrollText },
        { id: "gpa-cgpa", label: "GPA & CGPA", icon: Award },
        { id: "reports", label: "Academic Reports", icon: FileSpreadsheet },
      ],
    },
    {
      title: "COMMUNICATION",
      items: [
        { id: "announcements", label: "Announcements", icon: Megaphone },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "videos", label: "University Media", icon: Video },
      ],
    },
    {
      title: "AI & LEARNING",
      items: [
        {
          id: "ai-academic-assistant",
          label: "AI Academic Assistant",
          icon: Sparkles,
          badge: "AI DATA",
          badgeColor: "bg-indigo-600 text-white font-bold",
        },
        { id: "ai-assistant", label: "AI Campus Assistant", icon: Bot },
        { id: "ai-planner", label: "AI Study Planner", icon: Brain },
        { id: "ai-analytics", label: "AI Usage Analytics", icon: BarChart3 },
      ],
    },
    {
      title: "UNIVERSITY WEBSITE",
      items: [
        { id: "website-posts", label: "University Posts", icon: Megaphone },
        { id: "website-events", label: "University Events", icon: Calendar },
        { id: "website-gallery", label: "Media & Gallery", icon: ImageIcon },
        { id: "website-fees", label: "Fee Structures", icon: FileSpreadsheet },
        { id: "website-facilities", label: "Campus Facilities", icon: Layers },
        { id: "website-location", label: "Map & Location", icon: MapPin },
        { id: "website-profile", label: "Institutional Profile", icon: Building2 },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { id: "user-management", label: "User Management", icon: Users },
        { id: "security", label: "Roles & Permissions", icon: Lock },
        { id: "audit-logs", label: "Audit Logs", icon: History },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const handleItemClick = (id: AdminTab) => {
    onSelectTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#081022] text-slate-100 border-r border-slate-800 shadow-2xl select-none">
      {/* Header / Brand */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Logo Crest */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-iqra-gold-400 to-amber-600 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <span className="font-black tracking-wider text-xs">IU</span>
            </div>

            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="font-heading font-black text-white tracking-tight text-xs uppercase truncate">
                  IQRA UNIVERSITY
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-iqra-gold-400 tracking-wider uppercase truncate">
                  <ShieldCheck className="w-3 h-3 text-iqra-gold-400 shrink-0" />
                  <span>Admin ERP Portal</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 items-center justify-center transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {(!isCollapsed || mobileOpen) && (
          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[10px]">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-iqra-gold-400" />
              Chak Shehzad Campus
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live SIS
            </span>
          </div>
        )}
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 custom-scrollbar">
        {/* Top-level Dashboard Tab */}
        <div>
          <button
            onClick={() => handleItemClick("dashboard")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 group relative",
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-iqra-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-900/40"
                : "text-slate-300 hover:text-white hover:bg-slate-850 font-medium",
              isCollapsed && !mobileOpen ? "justify-center px-2" : ""
            )}
            title="Dashboard Overview"
          >
            {activeTab === "dashboard" && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-iqra-gold-400 rounded-r-full" />
            )}
            <LayoutDashboard className="w-4 h-4 shrink-0 text-iqra-gold-400" />
            {(!isCollapsed || mobileOpen) && (
              <span className="text-xs tracking-tight truncate">Dashboard</span>
            )}
          </button>
        </div>

        {/* Grouped Navigation */}
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <div
              className={cn(
                "px-2.5 mb-1 text-[9px] font-black uppercase tracking-wider text-slate-400/90",
                isCollapsed && !mobileOpen ? "text-center text-[8px]" : ""
              )}
            >
              {isCollapsed && !mobileOpen ? group.title.slice(0, 3) : group.title}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all duration-150 group relative",
                    isActive
                      ? "bg-iqra-blue-600/90 text-white font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-850 font-normal",
                    isCollapsed && !mobileOpen ? "justify-center px-2" : ""
                  )}
                  title={item.label}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-iqra-gold-400 rounded-r-full" />
                  )}

                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                      isActive ? "text-iqra-gold-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />

                  {(!isCollapsed || mobileOpen) && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <span className="text-xs tracking-tight truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.2 rounded-full shrink-0 ml-1 font-bold",
                            item.badgeColor || "bg-slate-800 text-slate-300"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Links & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#050b18]">
        <Link
          href="/dashboard"
          className={cn(
            "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors",
            isCollapsed && !mobileOpen ? "justify-center px-2" : ""
          )}
          title="Switch to Student Portal"
        >
          <ExternalLink className="w-3.5 h-3.5 text-iqra-gold-400" />
          {(!isCollapsed || mobileOpen) && <span>Student Portal View</span>}
        </Link>

        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-colors",
            isCollapsed && !mobileOpen ? "justify-center px-2" : ""
          )}
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          {(!isCollapsed || mobileOpen) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden md:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out shrink-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 lg:hidden transition-transform duration-300 ease-in-out shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
