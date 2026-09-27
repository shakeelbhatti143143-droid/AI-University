"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  UserCheck,
  GraduationCap,
  BookOpen,
  FolderPlus,
  CalendarDays,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MapPin,
  Sparkles,
  ShieldCheck,
  X,
  CalendarClock,
  Award,
  ScrollText,
  LineChart,
  Bot,
  BrainCircuit,
  Layers,
  Library,
  PartyPopper,
  Briefcase,
  Receipt,
  MessageSquare,
} from "lucide-react";
import { StudentProfile } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export type DashboardTab =
  | "dashboard"
  | "profile"
  | "academics"
  | "courses"
  | "course-materials"
  | "resources"
  | "discussions"
  | "registration"
  | "schedule"
  | "attendance"
  | "assignments"
  | "examinations"
  | "results"
  | "transcript"
  | "finances"
  | "analytics"
  | "events"
  | "careers"
  | "ai-assistant"
  | "study-planner";

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  profile: StudentProfile;
  pendingAssignmentsCount: number;
  registeredCoursesCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  profile,
  pendingAssignmentsCount,
  registeredCoursesCount,
  onLogout,
}) => {
  // SYSTEMATIC DASHBOARD NAVIGATION WITH CAMPUS LIFE EXTENSIONS
  const navItems: Array<{
    id: DashboardTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: "dashboard",
      label: "Dashboard",
      sublabel: "Executive Summary",
      icon: LayoutDashboard,
    },
    {
      id: "profile",
      label: "My Profile",
      sublabel: "Student Information",
      icon: UserCheck,
    },
    {
      id: "academics",
      label: "Academic Overview",
      sublabel: "Grades & CGPA Records",
      icon: GraduationCap,
      badge: `${profile.cgpa.toFixed(2)}`,
      badgeColor: "bg-blue-100 text-iqra-blue-700 font-bold",
    },
    {
      id: "courses",
      label: "My Courses",
      sublabel: "Enrolled Subjects",
      icon: BookOpen,
      badge: registeredCoursesCount,
      badgeColor: "bg-slate-100 text-slate-700 font-semibold",
    },
    {
      id: "course-materials",
      label: "Course Materials",
      sublabel: "Slides, Labs & Handouts",
      icon: Layers,
      badge: "Weekly",
      badgeColor: "bg-indigo-100 text-indigo-800 font-bold",
    },
    {
      id: "resources",
      label: "Learning Resources",
      sublabel: "Digital Library & IEEE",
      icon: Library,
      badge: "Library",
      badgeColor: "bg-blue-100 text-blue-800 font-bold",
    },
    {
      id: "discussions",
      label: "Course Discussions",
      sublabel: "Academic Q&A & Forums",
      icon: MessageSquare,
      badge: "Community",
      badgeColor: "bg-amber-100 text-amber-800 font-bold",
    },
    {
      id: "registration",
      label: "Course Registration",
      sublabel: "Add/Drop Catalog",
      icon: FolderPlus,
      badge: "Open",
      badgeColor: "bg-emerald-100 text-emerald-700 font-bold",
    },
    {
      id: "schedule",
      label: "Class Schedule",
      sublabel: "Weekly Timetable",
      icon: CalendarDays,
    },
    {
      id: "attendance",
      label: "Attendance",
      sublabel: "91.4% Overall Record",
      icon: CheckCircle2,
    },
    {
      id: "assignments",
      label: "Assignments",
      sublabel: "Submissions & Tasks",
      icon: FileText,
      badge: pendingAssignmentsCount,
      badgeColor: "bg-amber-100 text-amber-800 font-bold",
    },
    {
      id: "examinations",
      label: "Examinations",
      sublabel: "Timetable & Admit Slips",
      icon: CalendarClock,
      badge: "Upcoming",
      badgeColor: "bg-purple-100 text-purple-800 font-bold",
    },
    {
      id: "results",
      label: "Results & Grades",
      sublabel: "Term Performance & GPA",
      icon: Award,
    },
    {
      id: "transcript",
      label: "Academic Transcript",
      sublabel: "Official Academic Record",
      icon: ScrollText,
    },
    {
      id: "finances",
      label: "Fee & Challans",
      sublabel: "Bursar & Accounts SIS",
      icon: Receipt,
      badge: "Invoices",
      badgeColor: "bg-emerald-100 text-emerald-800 font-bold",
    },
    {
      id: "analytics",
      label: "GPA & CGPA Analytics",
      sublabel: "Trajectory & Metrics",
      icon: LineChart,
      badge: "Analytics",
      badgeColor: "bg-cyan-100 text-cyan-800 font-bold",
    },
    {
      id: "events",
      label: "Events & Activities",
      sublabel: "Hackathons & Seminars",
      icon: PartyPopper,
      badge: "Campus",
      badgeColor: "bg-amber-100 text-amber-800 font-bold",
    },
    {
      id: "careers",
      label: "Career & Internships",
      sublabel: "Jobs & Placement Cell",
      icon: Briefcase,
      badge: "Hiring",
      badgeColor: "bg-emerald-100 text-emerald-800 font-bold",
    },
    {
      id: "ai-assistant",
      label: "AI University Assistant",
      sublabel: "Campus AI Intelligence",
      icon: Bot,
      badge: "AI",
      badgeColor: "bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold",
    },
    {
      id: "study-planner",
      label: "AI Study Planner",
      sublabel: "Personalized Study Roadmap",
      icon: BrainCircuit,
      badge: "Smart",
      badgeColor: "bg-emerald-100 text-emerald-800 font-bold",
    },
  ];

  const handleItemClick = (id: DashboardTab) => {
    onSelectTab(id);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200/90 shadow-sm select-none">
      {/* Top Branding Section */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* IU Crest Monogram */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066cc] to-[#0a192f] border border-blue-400/30 flex items-center justify-center shrink-0 shadow-md shadow-blue-900/15">
              <div className="flex flex-col items-center justify-center leading-none">
                <span className="text-white font-extrabold tracking-wider text-xs">IU</span>
                <span className="h-0.5 w-3 bg-iqra-gold-500 rounded-full mt-0.5" />
              </div>
            </div>

            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-slate-900 tracking-tight text-sm uppercase truncate">
                    IQRA UNIVERSITY
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-iqra-blue-700 truncate">
                  <MapPin className="w-3 h-3 text-iqra-gold-600 shrink-0" />
                  <span className="truncate">Chak Shehzad, Islamabad</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 items-center justify-center transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campus & Accreditation Sub-pill */}
        {(!isCollapsed || mobileOpen) && (
          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              HEC Recognized
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-iqra-blue-700">
              Fall 2026
            </span>
          </div>
        )}
      </div>

      {/* Navigation List: Exactly 8 Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5 custom-scrollbar">
        <div className={cn("px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400", isCollapsed && !mobileOpen ? "text-center" : "")}>
          {isCollapsed && !mobileOpen ? "Menu" : "Student Portal Navigation"}
        </div>

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative",
                isActive
                  ? "bg-iqra-navy-900 text-white font-semibold shadow-md shadow-slate-900/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium",
                isCollapsed && !mobileOpen ? "justify-center px-2" : ""
              )}
              title={item.label}
            >
              {/* Active Left Accent Indicator */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-iqra-gold-500 rounded-r-full" />
              )}

              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-iqra-gold-400" : "text-slate-500 group-hover:text-iqra-blue-600"
                )}
              />

              {(!isCollapsed || mobileOpen) && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div className="truncate">
                    <span className="block text-xs sm:text-[13px] tracking-tight leading-tight truncate">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "block text-[10px] truncate leading-tight mt-0.5",
                        isActive ? "text-slate-300" : "text-slate-400"
                      )}
                    >
                      {item.sublabel}
                    </span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-1.5 transition-colors",
                        isActive ? "bg-white/15 text-white" : item.badgeColor || "bg-slate-100 text-slate-600"
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

      {/* Bottom Student Profile Info & Quick Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {(!isCollapsed || mobileOpen) ? (
          <div className="space-y-3">
            <div
              onClick={() => handleItemClick("profile")}
              className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-iqra-blue-400/50 transition-colors cursor-pointer flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-iqra-navy-900 text-white font-bold flex items-center justify-center text-xs shrink-0 ring-2 ring-iqra-blue-500/20 overflow-hidden">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{profile.name}</p>
                <p className="text-[10px] font-mono text-slate-500 truncate">{profile.studentId}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-700 font-semibold">{profile.currentSemester}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href="/"
                className="text-[11px] font-medium text-slate-500 hover:text-iqra-blue-600 transition-colors flex items-center gap-1"
              >
                <span>Campus Portal</span>
              </Link>

              <button
                onClick={onLogout}
                className="text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                title="Sign out of student portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 py-1">
            <div
              onClick={() => handleItemClick("profile")}
              className="w-9 h-9 rounded-lg bg-iqra-navy-900 text-white font-bold flex items-center justify-center text-xs cursor-pointer ring-2 ring-iqra-blue-500/20 overflow-hidden"
              title={`${profile.name} (${profile.studentId})`}
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
              )}
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
