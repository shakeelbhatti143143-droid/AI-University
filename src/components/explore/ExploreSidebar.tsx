"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Building2,
  Users,
  GraduationCap,
  DollarSign,
  MapPin,
  Share2,
  Calendar,
  Image as ImageIcon,
  PhoneCall,
  ChevronDown,
  Sparkles,
  Award,
  Layers,
  History,
  ShieldCheck,
  Megaphone,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

interface ExploreSidebarProps {
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  hideStaticSidebar?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const ExploreSidebar: React.FC<ExploreSidebarProps> = ({
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
  isCollapsed = false,
  onToggleCollapse,
  hideStaticSidebar = false,
}) => {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const navGroups: NavGroup[] = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Explore University", href: "/explore", icon: Compass },
      ],
    },
    {
      title: "UNIVERSITY",
      items: [
        { label: "About University", href: "/explore/about", icon: Building2 },
        { label: "Vision & Mission", href: "/explore/about#vision-mission", icon: Sparkles },
        { label: "Leadership", href: "/explore/about#leadership", icon: Award },
        { label: "University History", href: "/explore/about#history", icon: History },
      ],
    },
    {
      title: "ACADEMICS",
      items: [
        { label: "Faculties", href: "/explore/faculty", icon: Users },
        { label: "Departments", href: "/explore/departments", icon: Layers },
        { label: "Degree Programs", href: "/explore/programs", icon: GraduationCap },
        { label: "Fee Structure", href: "/explore/fees", icon: DollarSign },
        { label: "Scholarships", href: "/explore/scholarships", icon: Award, badge: "Merit", badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-300" },
      ],
    },
    {
      title: "CAMPUS",
      items: [
        { label: "Campus", href: "/explore/campus", icon: Building2 },
        { label: "Facilities", href: "/explore/campus#facilities", icon: Layers },
        { label: "Map & Location", href: "/explore/map", icon: MapPin },
        { label: "Gallery", href: "/explore/gallery", icon: ImageIcon },
      ],
    },
    {
      title: "COMMUNITY",
      items: [
        { label: "Announcements", href: "/explore/announcements", icon: Bell, badge: "Official", badgeColor: "bg-[#f0f4fa] text-[#0b1f3a] border-[#0b1f3a]/20" },
        { label: "University Posts", href: "/explore/posts", icon: Share2, badge: "Feed", badgeColor: "bg-[#f0f4fa] text-[#0b1f3a] border-[#0b1f3a]/20" },
        { label: "News", href: "/explore/news", icon: Megaphone },
        { label: "Events", href: "/explore/events", icon: Calendar },
      ],
    },
    {
      title: "CONNECT",
      items: [
        { label: "Contact", href: "/explore/contact", icon: PhoneCall },
      ],
    },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between select-none bg-white">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[#0b1f3a] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            <Compass className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-black text-slate-900 text-xs uppercase tracking-wider truncate">
                AI University
              </span>
              <span className="text-[10px] text-[#0b1f3a] font-bold tracking-wide truncate">
                Explore Navigation
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-[#0b1f3a] hover:bg-[#f0f4fa] transition-colors focus-visible:ring-2 focus-visible:ring-[#0b1f3a]"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Close Button */}
        {onCloseMobileDrawer && (
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0b1f3a] hover:bg-[#f0f4fa] focus-visible:ring-2 focus-visible:ring-[#0b1f3a] cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
        {navGroups.map((group) => {
          const isGroupCollapsed = collapsedGroups[group.title];
          return (
            <div key={group.title} className="space-y-1">
              {!isCollapsed ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase hover:text-[#0b1f3a] transition-colors"
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform ${
                      isGroupCollapsed ? "-rotate-90" : ""
                    }`}
                  />
                </button>
              ) : (
                <div className="h-px bg-slate-200 my-2 mx-1" />
              )}

              {(!isGroupCollapsed || isCollapsed) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isExactOrSub =
                      pathname === item.href ||
                      (item.href !== "/explore" &&
                        !item.href.includes("#") &&
                        pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          if (onCloseMobileDrawer) onCloseMobileDrawer();
                        }}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1f3a] ${
                          isExactOrSub
                            ? "bg-[#0b1f3a] text-white font-bold shadow-xs"
                            : "text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa] active:bg-[#0b1f3a] active:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isExactOrSub && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse" />
                          )}
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isExactOrSub
                                ? "text-white"
                                : "text-slate-400 group-hover:text-[#0b1f3a] group-active:text-white"
                            }`}
                          />
                          {!isCollapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </div>

                        {!isCollapsed && item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                              isExactOrSub
                                ? "bg-white/15 text-white border-white/20"
                                : "bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-[#f0f4fa] group-hover:text-[#0b1f3a] group-hover:border-[#0b1f3a]/30"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Campus Quick Badge */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-xl bg-[#f0f4fa] border border-slate-200 text-[11px] text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5 text-[#0b1f3a] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Chartered & HEC W4</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Iqra University Chak Shezad Campus Islamabad
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (only when not hidden on showcase pages) */}
      {!hideStaticSidebar && (
        <aside
          className={`hidden lg:block shrink-0 bg-white border border-slate-200/80 rounded-2xl shadow-xs transition-all duration-300 sticky top-20 sm:top-24 h-[calc(100vh-6.5rem)] z-30 overflow-hidden ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          {content}
        </aside>
      )}

      {/* Drawer Backdrop & Container (accessible on all screen sizes) */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobileDrawer}
          />
          <div className="relative w-80 max-w-[85vw] bg-white border-r border-slate-200 h-full z-10 shadow-2xl overflow-hidden animate-in slide-in-from-left duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
