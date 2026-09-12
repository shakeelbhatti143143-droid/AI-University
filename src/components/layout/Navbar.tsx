"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UniversityLogo } from "../ui/UniversityLogo";
import { useAuth } from "@/lib/auth-context";
import {
  LogIn,
  User as UserIcon,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  LogOut,
  Compass,
  PhoneCall,
  ChevronRight,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none px-3 sm:px-6 lg:px-8 ${
        isScrolled ? "pt-2 sm:pt-3" : "pt-3 sm:pt-4"
      }`}
    >
      <div
        className={`pointer-events-auto max-w-7xl mx-auto rounded-2xl transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
          isScrolled
            ? "py-2.5 bg-[#050e1d]/90 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
            : "py-3 bg-[#050e1d]/75 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        }`}
      >
        {/* University Crest & Brand Lockup */}
        <div className="flex items-center">
          <UniversityLogo variant="default" size="md" />
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/#explore-university"
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.07] transition-all flex items-center gap-1.5"
          >
            <span>Explore Campus</span>
          </Link>

          <Link
            href="/login"
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.07] transition-all"
          >
            Academic Portal
          </Link>

          <Link
            href="/status"
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.07] transition-all"
          >
            Track Status
          </Link>

          <Link
            href="/apply"
            className="text-xs font-medium text-slate-200 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.07] transition-all flex items-center gap-2 group"
          >
            <span>Admissions 2026</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open
            </span>
          </Link>

          {user && (
            <>
              <div className="h-4 w-px bg-white/15 mx-1" />
              {user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 shadow-sm transition-all hover:bg-amber-500/20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Admin SIS</span>
                </Link>
              ) : (
                <Link
                  href={user.role === "applicant" ? "/status" : "/dashboard"}
                  className="text-xs font-semibold text-sky-300 hover:text-sky-200 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center gap-1.5 shadow-sm transition-all hover:bg-sky-500/20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  <span>{user.role === "applicant" ? "Application Portal" : "Student Portal"}</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right Desktop Actions & CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={user.role === "admin" ? "/admin" : user.role === "applicant" ? "/status" : "/dashboard"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-all text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center font-bold text-[11px] text-slate-950 shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-white text-xs leading-none">
                    {user.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider leading-none mt-1">
                    {user.role}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="text-xs font-semibold text-slate-200 hover:text-white px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 shadow-sm">
                  <LogIn className="w-3.5 h-3.5 text-slate-300" />
                  <span>Sign In</span>
                </button>
              </Link>
              <Link href="/apply">
                <button className="relative group overflow-hidden px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/35 border border-amber-300/40 flex items-center gap-1.5">
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          {!user && (
            <Link href="/apply" className="sm:hidden">
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm border border-amber-300/40">
                Apply
              </button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Glass Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden max-w-7xl mx-auto mt-2 rounded-2xl bg-[#050e1d]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-5 flex flex-col gap-3 animate-fadeIn">
          {/* Navigation items */}
          <div className="flex flex-col divide-y divide-white/5">
            <Link
              href="/#explore-university"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-2 text-sm font-medium text-slate-200 hover:text-white flex items-center justify-between"
            >
              <span>Explore Campus</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-2 text-sm font-medium text-slate-200 hover:text-white flex items-center justify-between"
            >
              <span>Academic Portal / LMS</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/status"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-2 text-sm font-medium text-slate-200 hover:text-white flex items-center justify-between"
            >
              <span>Track Application Status</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-2 text-sm font-medium text-amber-300 hover:text-amber-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>Admissions 2026</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Open
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400/60" />
            </Link>
          </div>

          {/* User Status / Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={user.role === "admin" ? "/admin" : user.role === "applicant" ? "/status" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md flex items-center justify-center gap-2"
                >
                  <span>Go to {user.role === "admin" ? "Admin Portal" : "Student Dashboard"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 bg-white/[0.04] border border-white/10 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out ({user.name.split(" ")[0]})</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Link
                  href="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Apply Now for 2026</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center border border-white/20 text-white bg-white/5 hover:bg-white/10 flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Helpline Footer */}
          <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Helpline: +92 51 111-264-264</span>
            </div>
            <span className="text-slate-500">Chak Shezad, Islamabad</span>
          </div>
        </div>
      )}
    </header>
  );
};
