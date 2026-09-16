"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UniversityLogo } from "@/components/ui/UniversityLogo";
import { useAuth } from "@/lib/auth-context";
import {
  LogIn,
  Menu,
  ArrowRight,
  LogOut,
  Compass,
  Search,
  Building2,
  GraduationCap,
  Users,
  Image as ImageIcon,
  Megaphone,
  LayoutGrid,
} from "lucide-react";

interface ExploreNavbarProps {
  onOpenSearch?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const ExploreNavbar: React.FC<ExploreNavbarProps> = ({
  onOpenSearch,
  onToggleMobileSidebar,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Campus", href: "/explore/campus", icon: Building2 },
    { label: "Programs", href: "/explore/programs", icon: GraduationCap },
    { label: "Faculty", href: "/explore/faculty", icon: Users },
    { label: "Gallery", href: "/explore/gallery", icon: ImageIcon },
    { label: "Notices", href: "/explore/announcements", icon: Megaphone },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-400 ${
        isScrolled
          ? "bg-[#071322]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_12px_36px_rgba(5,14,29,0.35)] py-2.5 sm:py-3"
          : "bg-slate-950/25 backdrop-blur-md border-b border-white/10 py-3.5 sm:py-4"
      }`}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Left: University Branding Lockup */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <UniversityLogo variant="dark" size="md" />

          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide bg-white/10 text-slate-200 border border-white/15 backdrop-blur-sm">
            <Compass className="w-3 h-3 text-white" />
            <span>Explore Campus</span>
          </span>
        </div>

        {/* Center: Curated Institutional Showcase Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Explore Navigation">
          <Link
            href="/explore"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              pathname === "/explore"
                ? "text-white bg-white/15 border border-white/20 shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Overview
          </Link>
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/explore" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "text-white bg-white/15 border border-white/20 shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Desktop Actions & CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center gap-2 text-xs font-medium cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            title="Search Explore University (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[11.5px]">Search</span>
            <kbd className="hidden xl:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono text-slate-300 bg-white/10 border border-white/15 ml-0.5">
              Ctrl+K
            </kbd>
          </button>

          {/* Full Portal Directory Drawer Toggle */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="px-3 py-1.5 rounded-xl text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
            title="Open Complete Portal Directory"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="text-[11.5px] hidden xl:inline">Directory</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "applicant"
                    ? "/status"
                    : "/dashboard"
                }
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all text-xs focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="w-6 h-6 rounded-full bg-[#0b1f3a] border border-white/20 flex items-center justify-center font-bold text-[11px] text-white shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-white text-xs leading-none">
                    {user.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] text-slate-300 uppercase tracking-wider leading-none mt-1">
                    {user.role}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-200 hover:text-white px-3.5 py-1.5 rounded-xl border border-white/15 hover:border-white/30 bg-white/10 hover:bg-white/15 active:bg-[#0b1f3a] transition-all flex items-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-300" />
                  <span>Login</span>
                </button>
              </Link>
              <Link href="/apply">
                <button
                  type="button"
                  className="group px-4 py-1.5 rounded-xl text-xs font-bold text-[#071322] bg-white hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 shadow-md flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View Controls */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer"
            aria-label="Search Explore Portal"
          >
            <Search className="w-4 h-4" />
          </button>

          {!user ? (
            <Link href="/apply">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#071322] bg-white hover:bg-slate-100 shadow-xs cursor-pointer"
              >
                Apply
              </button>
            </Link>
          ) : (
            <Link
              href={
                user.role === "admin"
                  ? "/admin"
                  : user.role === "applicant"
                  ? "/status"
                  : "/dashboard"
              }
              className="p-1.5 rounded-xl bg-white/15 text-white font-bold text-xs border border-white/20"
            >
              {user.name.charAt(0).toUpperCase()}
            </Link>
          )}

          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl text-white bg-white/15 hover:bg-white/20 border border-white/20 focus-visible:ring-2 focus-visible:ring-white transition-colors cursor-pointer"
            aria-label="Open Explore Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
