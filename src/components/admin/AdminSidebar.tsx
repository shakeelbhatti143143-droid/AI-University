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
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab =
  | "dashboard"
  | "applications"
  | "videos"
  | "students"
  | "academics"
  | "courses"
  | "registration"
  | "schedule"
  | "attendance"
  | "assignments"
  | "profile"
  | "reports"
  | "settings"
  | "security";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
  pendingApplicationsCount?: number;
  pendingRegistrationsCount: number;
  warningsCount: number;
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
  pendingRegistrationsCount,
  warningsCount,
  onLogout,
}) => {
  const mainNavItems: Array<{
    id: AdminTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: "dashboard",
      label: "Overview",
      sublabel: "Analytics & Status",
      icon: LayoutDashboard,
    },
    {
      id: "applications",
      label: "Pending Applications",
      sublabel: "Admissions & Review",
      icon: UserCheck,
      badge: pendingApplicationsCount > 0 ? `${pendingApplicationsCount} Pending` : undefined,
      badgeColor: "bg-amber-100 text-amber-800 font-bold",
    },
    {
      id: "videos",
      label: "University Videos",
      sublabel: "Promotions & Media",
      icon: Video,
    },
    {
      id: "students",
      label: "Students",
      sublabel: "Directory & Enrollment",
      icon: Users,
    },
    {
      id: "academics",
      label: "Academic Overview",
      sublabel: "Performance & Standing",
      icon: GraduationCap,
    },
    {
      id: "courses",
      label: "Courses",
      sublabel: "Catalog & Faculty",
      icon: BookOpen,
    },
    {
      id: "registration",
      label: "Course Registration",
      sublabel: "Approvals & Add/Drop",
      icon: FolderPlus,
      badge: pendingRegistrationsCount > 0 ? `${pendingRegistrationsCount} New` : undefined,
      badgeColor: "bg-blue-100 text-blue-800 font-bold",
    },
    {
      id: "schedule",
      label: "Class Schedule",
      sublabel: "Timetable & Conflicts",
      icon: CalendarDays,
    },
    {
      id: "attendance",
      label: "Attendance",
      sublabel: "Course & Student Records",
      icon: CheckCircle2,
    },
    {
      id: "assignments",
      label: "Assignments",
      sublabel: "Submissions & Grading",
      icon: FileText,
    },
  ];

  const secondaryNavItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: "profile",
      label: "Admin Profile",
      icon: UserCheck,
    },
    {
      id: "reports",
      label: "Reports & Audits",
      icon: FileSpreadsheet,
    },
    {
      id: "security",
      label: "Security & RBAC",
      icon: ShieldAlert,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleItemClick = (id: AdminTab) => {
    onSelectTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#0a192f] text-slate-100 border-r border-slate-800 shadow-xl select-none">
      {/* Top Branding Section */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* IU Crest Monogram */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-iqra-gold-500 to-amber-700 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <div className="flex flex-col items-center justify-center leading-none">
                <span className="font-black tracking-wider text-xs">IU</span>
                <span className="h-0.5 w-3 bg-slate-950 rounded-full mt-0.5" />
              </div>
            </div>

            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-white tracking-tight text-sm uppercase truncate">
                    IQRA UNIVERSITY
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-iqra-gold-400 tracking-wider uppercase truncate">
                  <ShieldCheck className="w-3 h-3 text-iqra-gold-400 shrink-0" />
                  <span>Admin Information System</span>
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

        {/* Campus & Super Admin Status Pill */}
        {(!isCollapsed || mobileOpen) && (
          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-iqra-gold-400" />
              Chak Shehzad, ISB
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-iqra-gold-500 text-slate-950">
              Super Admin
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 custom-scrollbar">
        {/* Core Academic Operations */}
        <div className="space-y-1">
          <div className={cn("px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400", isCollapsed && !mobileOpen ? "text-center" : "")}>
            {isCollapsed && !mobileOpen ? "Academic" : "Academic Operations"}
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative",
                  isActive
                    ? "bg-iqra-blue-600 text-white font-semibold shadow-md shadow-blue-900/40"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium",
                  isCollapsed && !mobileOpen ? "justify-center px-2" : ""
                )}
                title={item.label}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-iqra-gold-400 rounded-r-full" />
                )}

                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-iqra-gold-400"
                  )}
                />

                {(!isCollapsed || mobileOpen) && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div className="truncate">
                      <span className="block text-xs tracking-tight leading-tight truncate">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "block text-[10px] truncate leading-tight mt-0.5",
                          isActive ? "text-blue-100" : "text-slate-400"
                        )}
                      >
                        {item.sublabel}
                      </span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-1.5 transition-colors",
                          isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-slate-800 text-slate-300"
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

        {/* Administration & System */}
        <div className="space-y-1 pt-2 border-t border-slate-800/60">
          <div className={cn("px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400", isCollapsed && !mobileOpen ? "text-center" : "")}>
            {isCollapsed && !mobileOpen ? "Admin" : "System & Governance"}
          </div>

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 group relative",
                  isActive
                    ? "bg-iqra-blue-600 text-white font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium",
                  isCollapsed && !mobileOpen ? "justify-center px-2" : ""
                )}
                title={item.label}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-iqra-gold-400 rounded-r-full" />
                )}

                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-iqra-gold-400"
                  )}
                />

                {(!isCollapsed || mobileOpen) && (
                  <span className="text-xs tracking-tight truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Administrator Profile Banner & Switch to Student Portal */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/80">
        {(!isCollapsed || mobileOpen) ? (
          <div className="space-y-2.5">
            {/* Shakeel Bhatti Card */}
            <div
              onClick={() => handleItemClick("profile")}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-iqra-gold-500/50 transition-colors cursor-pointer flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-iqra-gold-500 to-amber-700 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 ring-2 ring-amber-500/30">
                SB
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">Shakeel Bhatti</p>
                <p className="text-[10px] text-iqra-gold-400 truncate">shakeelbhatti143143@gmail.com</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-semibold uppercase">Super Administrator</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href="/dashboard"
                className="text-[11px] font-semibold text-slate-300 hover:text-iqra-gold-400 transition-colors flex items-center gap-1"
                title="Preview Student Portal"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Student Portal</span>
              </Link>

              <button
                onClick={onLogout}
                className="text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                title="Sign out of Administrator Session"
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
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-iqra-gold-500 to-amber-700 text-slate-950 font-black flex items-center justify-center text-xs cursor-pointer ring-2 ring-amber-500/30"
              title="Shakeel Bhatti (Super Administrator)"
            >
              SB
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
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
      <aside
        className={cn(
          "hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
