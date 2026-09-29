"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UniversityLogo } from "@/components/ui/UniversityLogo";
import { useAuth } from "@/lib/auth-context";
import {
  Search,
  LogOut,
  ArrowRight,
  Menu,
  X,
  LayoutGrid,
  User,
  ChevronRight,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile drawer whenever route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  // Escape key closes the mobile drawer.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    {
      label: "Overview",
      href: "/explore",
    },
    {
      label: "Campus Life",
      href: "/explore/campus",
    },
    {
      label: "Programs",
      href: "/explore/programs",
    },
    {
      label: "Scholarships",
      href: "/explore/scholarships",
      highlight: true,
    },
    {
      label: "Faculty",
      href: "/explore/faculty",
    },
    {
      label: "Admissions",
      href: "/apply",
    },
  ];

  const getDashboardHref = () => {
    if (user?.role === "admin") {
      return "/admin";
    }

    if (user?.role === "applicant") {
      return "/status";
    }

    return "/dashboard";
  };

  const getDashboardLabel = () => {
    if (user?.role === "admin") {
      return "Admin SIS";
    }

    if (user?.role === "applicant") {
      return "Application Status";
    }

    return "Student Portal";
  };

  const isNavItemActive = (href: string) => {
    if (href === "/explore") {
      return pathname === "/explore";
    }

    if (href === "/apply") {
      return pathname === "/apply";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const openSearch = () => {
    setMobileMenuOpen(false);
    onOpenSearch?.();
  };

  const openDirectory = () => {
    setMobileMenuOpen(false);
    onToggleMobileSidebar?.();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* =========================================================
          PREMIUM NAVBAR
      ========================================================== */}
      <header
        className={[
          "fixed inset-x-0 top-0 z-40 w-full",
          "transition-all duration-300 ease-out",
          isScrolled
            ? [
              "bg-[#050B14]/95",
              "backdrop-blur-2xl",
              "border-b border-white/[0.10]",
              "shadow-[0_12px_40px_rgba(0,0,0,0.28)]",
            ].join(" ")
            : [
              "bg-[#050B14]/75",
              "backdrop-blur-xl",
              "border-b border-white/[0.065]",
            ].join(" "),
        ].join(" ")}
      >
        {/* Subtle top light line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />

        <div
          className={[
            "mx-auto grid w-full max-w-[1440px]",
            "grid-cols-[auto_1fr_auto]",
            "items-center",
            "gap-3 sm:gap-5 lg:gap-6",
            "px-4 sm:px-6 lg:px-8 xl:px-10",
            isScrolled
              ? "h-[68px] sm:h-[70px]"
              : "h-[74px] sm:h-[78px]",
            "transition-all duration-300",
          ].join(" ")}
        >
          {/* =====================================================
              LEFT — UNIVERSITY BRAND
          ====================================================== */}
          <div className="flex min-w-0 shrink-0 items-center">
            <Link
              href="/explore"
              aria-label="Iqra University home"
              className="group flex min-w-0 items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B14]"
            >
              <div className="transition-transform duration-300 group-hover:-translate-y-px">
                <UniversityLogo variant="dark" size="md" />
              </div>
            </Link>
          </div>

          {/* =====================================================
              CENTER — DESKTOP NAVIGATION
          ====================================================== */}
          <nav
            className="hidden min-w-0 justify-center xl:flex"
            aria-label="Campus Navigation"
          >
            <div className="flex items-center rounded-2xl border border-white/[0.045] bg-white/[0.018] p-1">
              {navLinks.map((item) => {
                const isActive = isNavItemActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "group relative flex items-center gap-1.5",
                      "whitespace-nowrap rounded-xl",
                      "px-3 py-2",
                      "2xl:px-3.5",
                      "text-[12.5px] 2xl:text-[13px]",
                      "font-medium tracking-[-0.01em]",
                      "outline-none",
                      "transition-all duration-200",
                      "focus-visible:ring-2 focus-visible:ring-amber-400/70",
                      isActive
                        ? "bg-white/[0.075] text-white"
                        : "text-slate-400 hover:bg-white/[0.045] hover:text-white",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>

                    {item.highlight && !isActive && (
                      <span
                        className={[
                          "rounded-full px-1.5 py-[2px]",
                          "border border-emerald-400/15",
                          "bg-emerald-400/[0.08]",
                          "text-[8px] font-bold uppercase tracking-wide",
                          "text-emerald-300",
                        ].join(" ")}
                      >
                        Merit
                      </span>
                    )}

                    {isActive && (
                      <motion.span
                        layoutId="activeExploreNavbarIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                        className="absolute bottom-[3px] left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-amber-400 shadow-[0_0_9px_rgba(251,191,36,0.45)]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* =====================================================
              RIGHT — UTILITY CONTROLS
          ====================================================== */}
          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={openSearch}
              title="Search University (Ctrl+K)"
              aria-label="Search University"
              className={[
                "group flex h-9 items-center justify-center gap-2",
                "rounded-xl",
                "border border-white/[0.07]",
                "bg-white/[0.025]",
                "px-2.5 sm:px-3",
                "text-slate-400",
                "transition-all duration-200",
                "hover:border-white/[0.13]",
                "hover:bg-white/[0.07]",
                "hover:text-white",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-amber-400/70",
              ].join(" ")}
            >
              <Search className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />

              <span className="hidden 2xl:inline text-[11px] font-medium">
                Search
              </span>

              <kbd className="hidden 2xl:inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.045] px-1.5 py-0.5 font-mono text-[9px] text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Directory */}
            <button
              type="button"
              onClick={openDirectory}
              title="Open Campus Directory"
              aria-label="Open Campus Directory"
              className={[
                "hidden lg:flex h-9 items-center gap-1.5",
                "rounded-xl",
                "border border-transparent",
                "px-2.5",
                "text-[11px] font-medium",
                "text-slate-400",
                "transition-all duration-200",
                "hover:border-white/[0.07]",
                "hover:bg-white/[0.05]",
                "hover:text-white",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-amber-400/70",
              ].join(" ")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />

              <span className="hidden 2xl:inline">Directory</span>
            </button>

            {/* =================================================
                LOGGED-IN USER
            ================================================== */}
            {user ? (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link
                  href={getDashboardHref()}
                  title={getDashboardLabel()}
                  className={[
                    "group flex h-9 items-center gap-2",
                    "rounded-xl",
                    "border border-white/[0.08]",
                    "bg-white/[0.045]",
                    "px-2.5",
                    "transition-all duration-200",
                    "hover:border-white/[0.14]",
                    "hover:bg-white/[0.085]",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-amber-400/70",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-6 w-6 shrink-0 items-center justify-center",
                      "rounded-full",
                      "border border-white/[0.12]",
                      "bg-[#071322]",
                      "text-[10px] font-bold text-white",
                      "shadow-inner",
                    ].join(" ")}
                  >
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>

                  <span className="hidden max-w-[100px] truncate text-[11px] font-semibold text-slate-200 2xl:block">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className={[
                    "flex h-9 w-9 items-center justify-center",
                    "rounded-xl",
                    "text-slate-500",
                    "transition-all duration-200",
                    "hover:bg-rose-500/[0.10]",
                    "hover:text-rose-300",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-rose-400/60",
                  ].join(" ")}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              /* Logged-out portal */
              <Link
                href="/login"
                className={[
                  "hidden sm:flex h-9 items-center gap-1.5",
                  "rounded-xl",
                  "px-2.5 lg:px-3",
                  "text-[11px] font-medium",
                  "text-slate-400",
                  "transition-all duration-200",
                  "hover:bg-white/[0.055]",
                  "hover:text-white",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-amber-400/70",
                ].join(" ")}
              >
                <User className="h-3.5 w-3.5" />
                <span>Portal</span>
              </Link>
            )}

            {/* =================================================
                PRIMARY CTA
            ================================================== */}
            <Link
              href="/apply"
              className={[
                "group flex h-9 sm:h-10 shrink-0 items-center justify-center gap-1.5",
                "rounded-xl",
                "border border-amber-300/20",
                "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500",
                "px-3 sm:px-4",
                "text-[11px] sm:text-[12px]",
                "font-bold text-[#071322]",
                "shadow-[0_7px_22px_rgba(245,158,11,0.16)]",
                "transition-all duration-200",
                "hover:-translate-y-px",
                "hover:from-amber-200",
                "hover:via-amber-300",
                "hover:to-amber-400",
                "hover:shadow-[0_10px_30px_rgba(245,158,11,0.25)]",
                "active:translate-y-0",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-amber-300",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[#050B14]",
              ].join(" ")}
            >
              <span className="hidden sm:inline">Apply Now</span>
              <span className="sm:hidden">Apply</span>

              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            {/* =================================================
                MOBILE MENU
            ================================================== */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              className={[
                "flex h-9 w-9 xl:hidden items-center justify-center",
                "rounded-xl",
                "border border-white/[0.08]",
                "bg-white/[0.045]",
                "text-slate-300",
                "transition-all duration-200",
                "hover:border-white/[0.14]",
                "hover:bg-white/[0.09]",
                "hover:text-white",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-amber-400/70",
              ].join(" ")}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE / TABLET DRAWER
      ========================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm xl:hidden"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              className={[
                "fixed right-0 top-0 bottom-0 z-[60]",
                "flex w-[min(420px,92vw)] flex-col",
                "overflow-hidden",
                "border-l border-white/[0.10]",
                "bg-[#07111E]",
                "text-white",
                "shadow-[-24px_0_70px_rgba(0,0,0,0.42)]",
                "xl:hidden",
              ].join(" ")}
            >
              {/* Drawer subtle glow */}
              <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[280px] w-[280px] rounded-full bg-amber-400/[0.035] blur-3xl" />

              {/* Drawer Header */}
              <div className="relative flex items-center justify-between border-b border-white/[0.08] px-5 py-5 sm:px-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Iqra University
                  </div>

                  <div className="mt-1 text-sm font-semibold text-slate-100">
                    Campus Navigation
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  className={[
                    "flex h-9 w-9 items-center justify-center",
                    "rounded-xl",
                    "border border-white/[0.08]",
                    "bg-white/[0.045]",
                    "text-slate-400",
                    "transition-all duration-200",
                    "hover:bg-white/[0.09]",
                    "hover:text-white",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-amber-400/70",
                  ].join(" ")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="relative flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="space-y-6">
                  {/* Search */}
                  <button
                    type="button"
                    onClick={openSearch}
                    className={[
                      "flex w-full items-center justify-between",
                      "rounded-2xl",
                      "border border-white/[0.08]",
                      "bg-white/[0.035]",
                      "p-3.5",
                      "text-left",
                      "transition-all duration-200",
                      "hover:border-white/[0.13]",
                      "hover:bg-white/[0.065]",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-amber-400/70",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-slate-400">
                        <Search className="h-4 w-4" />
                      </div>

                      <span className="truncate text-xs font-medium text-slate-300">
                        Search programs, faculty, campus...
                      </span>
                    </div>

                    <kbd className="ml-3 shrink-0 rounded-md border border-white/[0.08] bg-white/[0.05] px-1.5 py-1 font-mono text-[9px] text-slate-500">
                      ⌘K
                    </kbd>
                  </button>

                  {/* Primary navigation */}
                  <div>
                    <div className="mb-2 px-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      Explore
                    </div>

                    <nav
                      className="space-y-1"
                      aria-label="Mobile Navigation"
                    >
                      {navLinks.map((item) => {
                        const isActive = isNavItemActive(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={[
                              "group relative flex min-h-[52px] items-center justify-between",
                              "rounded-xl px-3.5",
                              "transition-all duration-200",
                              "focus-visible:outline-none",
                              "focus-visible:ring-2",
                              "focus-visible:ring-amber-400/70",
                              isActive
                                ? [
                                  "border border-white/[0.08]",
                                  "bg-white/[0.065]",
                                  "text-white",
                                ].join(" ")
                                : [
                                  "border border-transparent",
                                  "text-slate-400",
                                  "hover:border-white/[0.05]",
                                  "hover:bg-white/[0.045]",
                                  "hover:text-white",
                                ].join(" "),
                            ].join(" ")}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {isActive && (
                                <span className="h-5 w-[3px] shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.45)]" />
                              )}

                              <span className="text-sm font-medium">
                                {item.label}
                              </span>

                              {item.highlight && (
                                <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-300">
                                  Merit Support
                                </span>
                              )}
                            </div>

                            <ChevronRight
                              className={[
                                "h-4 w-4 shrink-0 transition-transform duration-200",
                                isActive
                                  ? "text-slate-300"
                                  : "text-slate-600 group-hover:translate-x-0.5 group-hover:text-slate-400",
                              ].join(" ")}
                            />
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Quick services */}
                  <div className="border-t border-white/[0.07] pt-5">
                    <div className="mb-3 px-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      Quick Services
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/explore/fees"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex min-h-[54px] items-center rounded-xl border border-white/[0.055] bg-white/[0.025] px-3 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-white/[0.10] hover:bg-white/[0.065] hover:text-white"
                      >
                        Fee Structure
                      </Link>

                      <Link
                        href="/explore/map"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex min-h-[54px] items-center rounded-xl border border-white/[0.055] bg-white/[0.025] px-3 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-white/[0.10] hover:bg-white/[0.065] hover:text-white"
                      >
                        Campus Map
                      </Link>

                      <Link
                        href="/explore/announcements"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex min-h-[54px] items-center rounded-xl border border-white/[0.055] bg-white/[0.025] px-3 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-white/[0.10] hover:bg-white/[0.065] hover:text-white"
                      >
                        Announcements
                      </Link>

                      <button
                        type="button"
                        onClick={openDirectory}
                        className="flex min-h-[54px] items-center rounded-xl border border-white/[0.055] bg-white/[0.025] px-3 text-left text-xs font-medium text-slate-400 transition-all duration-200 hover:border-white/[0.10] hover:bg-white/[0.065] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
                      >
                        Full Directory
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  DRAWER FOOTER
              ================================================== */}
              <div className="relative border-t border-white/[0.08] bg-[#050B14]/70 px-5 py-5 sm:px-6">
                {!user ? (
                  <div className="space-y-2.5">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={[
                        "flex min-h-[46px] w-full items-center justify-center gap-2",
                        "rounded-xl",
                        "border border-white/[0.08]",
                        "bg-white/[0.045]",
                        "text-xs font-semibold text-slate-200",
                        "transition-all duration-200",
                        "hover:bg-white/[0.09]",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-amber-400/70",
                      ].join(" ")}
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Student & Faculty Portal</span>
                    </Link>

                    <Link
                      href="/apply"
                      onClick={() => setMobileMenuOpen(false)}
                      className={[
                        "group flex min-h-[48px] w-full items-center justify-center gap-2",
                        "rounded-xl",
                        "border border-amber-300/20",
                        "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500",
                        "text-xs font-bold text-[#071322]",
                        "shadow-[0_8px_24px_rgba(245,158,11,0.16)]",
                        "transition-all duration-200",
                        "hover:-translate-y-px",
                        "hover:shadow-[0_10px_30px_rgba(245,158,11,0.24)]",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-amber-300",
                      ].join(" ")}
                    >
                      <span>Apply for Admissions</span>

                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <Link
                      href={getDashboardHref()}
                      onClick={() => setMobileMenuOpen(false)}
                      className={[
                        "flex min-h-[46px] w-full items-center justify-center",
                        "rounded-xl",
                        "border border-white/[0.08]",
                        "bg-white/[0.055]",
                        "px-4",
                        "text-xs font-semibold text-white",
                        "transition-all duration-200",
                        "hover:bg-white/[0.09]",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-amber-400/70",
                      ].join(" ")}
                    >
                      Go to {getDashboardLabel()}
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        await handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className={[
                        "flex min-h-[40px] w-full items-center justify-center",
                        "rounded-xl",
                        "text-xs font-medium text-rose-300/80",
                        "transition-all duration-200",
                        "hover:bg-rose-500/[0.10]",
                        "hover:text-rose-300",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-rose-400/60",
                      ].join(" ")}
                    >
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};