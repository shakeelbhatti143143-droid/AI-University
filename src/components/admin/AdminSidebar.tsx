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
  ExternalLink,
  ShieldCheck,
  Building2,
  X,
  Video,
  Award,
  Layers,
  Calendar,
  Bell,
  Megaphone,
  Bot,
  Brain,
  BarChart3,
  History,
  Lock,
  DoorOpen,
  ScrollText,
<<<<<<< Updated upstream
  Image as ImageIcon,
=======
  Receipt,
>>>>>>> Stashed changes
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab =
  | "dashboard"
  | "finances"
  | "students"
  | "faculty"
  | "administrators"
  | "applications"
  | "videos"
  | "academics"
  | "departments"
  | "programs"
  | "courses"
  | "course-sections"
  | "registration"
  | "schedule"
  | "attendance"
  | "assignments"
  | "exams"
  | "exam-schedule"
  | "exam-rooms"
  | "results"
<<<<<<< Updated upstream
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
=======
  | "transcripts"
  | "gpa-cgpa"
  | "reports"
  | "announcements"
  | "notifications"
>>>>>>> Stashed changes
  | "ai-assistant"
  | "ai-planner"
  | "ai-analytics"
  | "user-management"
  | "security"
  | "audit-logs"
  | "settings"
  | "profile";

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  accentColor?: string;
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
      accentColor: "text-blue-600",
      items: [
        { id: "students", label: "Students", icon: Users, iconColor: "text-blue-500" },
        { id: "faculty", label: "Faculty Members", icon: UserCheck, iconColor: "text-cyan-500" },
        { id: "administrators", label: "Administrators", icon: ShieldCheck, iconColor: "text-indigo-500" },
        {
          id: "applications",
          label: "Admissions & Applications",
          icon: ScrollText,
          iconColor: "text-amber-500",
          badge: pendingApplicationsCount > 0 ? `${pendingApplicationsCount}` : undefined,
          badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
        },
      ],
    },
    {
      title: "ACADEMICS",
      accentColor: "text-indigo-600",
      items: [
        { id: "departments", label: "Departments", icon: Building2, iconColor: "text-indigo-500" },
        { id: "programs", label: "Programs", icon: GraduationCap, iconColor: "text-blue-500" },
        { id: "courses", label: "Courses", icon: BookOpen, iconColor: "text-emerald-500" },
        { id: "course-sections", label: "Course Sections", icon: Layers, iconColor: "text-teal-500" },
        {
          id: "registration",
          label: "Course Registration",
          icon: FolderPlus,
          iconColor: "text-cyan-500",
          badge: pendingRegistrationsCount > 0 ? `${pendingRegistrationsCount}` : undefined,
          badgeColor: "bg-cyan-100 text-cyan-700 border-cyan-200",
        },
        { id: "schedule", label: "Class Schedule", icon: CalendarDays, iconColor: "text-blue-500" },
        { id: "attendance", label: "Attendance", icon: CheckCircle2, iconColor: "text-emerald-500" },
        { id: "assignments", label: "Assignments", icon: FileText, iconColor: "text-amber-500" },
      ],
    },
    {
      title: "EXAMINATIONS",
      accentColor: "text-amber-600",
      items: [
        { id: "exams", label: "Exams", icon: Award, iconColor: "text-amber-500" },
        { id: "exam-schedule", label: "Exam Schedule", icon: Calendar, iconColor: "text-blue-500" },
        { id: "exam-rooms", label: "Exam Rooms", icon: DoorOpen, iconColor: "text-purple-500" },
        { id: "results", label: "Results & Grades", icon: BarChart3, iconColor: "text-emerald-500" },
      ],
    },
    {
      title: "ACADEMIC RECORDS",
      accentColor: "text-purple-600",
      items: [
<<<<<<< Updated upstream
        { id: "progression", label: "Academic Progression", icon: Sparkles },
        { id: "transcripts", label: "Transcripts", icon: ScrollText },
        { id: "gpa-cgpa", label: "GPA & CGPA", icon: Award },
        { id: "reports", label: "Academic Reports", icon: FileSpreadsheet },
=======
        { id: "transcripts", label: "Transcripts", icon: ScrollText, iconColor: "text-purple-500" },
        { id: "gpa-cgpa", label: "GPA & CGPA", icon: Award, iconColor: "text-indigo-500" },
        { id: "reports", label: "Academic Reports", icon: FileSpreadsheet, iconColor: "text-blue-500" },
        { id: "finances", label: "Fee & Finances", icon: Receipt, iconColor: "text-emerald-500" },
>>>>>>> Stashed changes
      ],
    },
    {
      title: "COMMUNICATION",
      accentColor: "text-teal-600",
      items: [
        { id: "announcements", label: "Announcements", icon: Megaphone, iconColor: "text-teal-500" },
        { id: "notifications", label: "Notifications", icon: Bell, iconColor: "text-amber-500" },
        { id: "videos", label: "University Media", icon: Video, iconColor: "text-rose-500" },
      ],
    },
    {
      title: "AI & LEARNING",
      accentColor: "text-violet-600",
      items: [
<<<<<<< Updated upstream
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
=======
        { id: "ai-assistant", label: "AI Assistant", icon: Bot, iconColor: "text-violet-500" },
        { id: "ai-planner", label: "AI Study Planner", icon: Brain, iconColor: "text-indigo-500" },
        { id: "ai-analytics", label: "AI Usage Analytics", icon: BarChart3, iconColor: "text-cyan-500" },
>>>>>>> Stashed changes
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
      accentColor: "text-slate-600",
      items: [
        { id: "user-management", label: "User Management", icon: Users, iconColor: "text-slate-500" },
        { id: "security", label: "Roles & Permissions", icon: Lock, iconColor: "text-rose-500" },
        { id: "audit-logs", label: "Audit Logs", icon: History, iconColor: "text-blue-500" },
        { id: "settings", label: "Settings", icon: Settings, iconColor: "text-slate-500" },
      ],
    },
  ];

  const handleItemClick = (id: AdminTab) => {
    onSelectTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-slate-50/80 border-r border-slate-200 select-none">
      {/* Header / Brand */}
      <div className="p-4 border-b border-slate-200/80 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Logo Crest */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 font-black text-xs text-white shadow-xs">
              IU
            </div>

            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="font-bold tracking-tight text-xs uppercase truncate text-slate-800">
                  IQRA UNIVERSITY
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase truncate text-blue-600">
                  Executive Admin
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg border border-slate-200 items-center justify-center transition-colors hover:bg-slate-50 text-slate-400 hover:text-slate-600"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {(!isCollapsed || mobileOpen) && (
          <div className="mt-3 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[10px]">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              Chak Shehzad Campus
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[9px] uppercase text-emerald-600">Active</span>
            </div>
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
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all relative border text-xs font-semibold",
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-sm shadow-blue-500/20"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80",
              isCollapsed && !mobileOpen ? "justify-center px-2" : ""
            )}
            title="Dashboard Overview"
          >
            <LayoutDashboard className={cn("w-4 h-4 shrink-0", activeTab === "dashboard" ? "text-white" : "text-blue-500")} />
            {(!isCollapsed || mobileOpen) && (
              <span className="tracking-tight truncate">Dashboard</span>
            )}
          </button>
        </div>

        {/* Grouped Navigation */}
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <div
              className={cn(
                "px-2.5 mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400",
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
                    "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left transition-all border text-xs",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white font-bold shadow-sm shadow-blue-500/20"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white font-medium",
                    isCollapsed && !mobileOpen ? "justify-center px-2" : ""
                  )}
                  title={item.label}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-white" : item.iconColor || "text-slate-400"
                    )}
                  />

                  {(!isCollapsed || mobileOpen) && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <span className="tracking-tight truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ml-1 font-bold border",
                            item.badgeColor || "bg-slate-100 border-slate-200 text-slate-600"
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
      <div className="p-3 border-t border-slate-200/80 bg-white space-y-1.5">
        <Link
          href="/dashboard"
          className={cn(
            "w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200",
            isCollapsed && !mobileOpen ? "justify-center px-2" : ""
          )}
          title="Switch to Student Portal"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
          {(!isCollapsed || mobileOpen) && <span>Student Portal View</span>}
        </Link>

        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors",
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
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
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
