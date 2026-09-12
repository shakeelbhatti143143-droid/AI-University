"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  GraduationCap,
  LogOut,
  Calendar,
  BookOpen,
  MapPin,
  CheckCircle2,
  Sparkles,
  Shield,
  ArrowRight,
  User as UserIcon,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UniversityLogo } from "@/components/ui/UniversityLogo";
import { Button } from "@/components/ui/Button";

export default function WelcomePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Trigger brief celebration confetti once on mount
  useEffect(() => {
    if (!hasCelebrated && user) {
      setHasCelebrated(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#0066cc", "#f59e0b", "#38bdf8", "#ffffff"],
        });
      } catch (e) {
        // Safe fallback if confetti fails
      }
    }
  }, [user, hasCelebrated]);

  // If not logged in and not loading, redirect to login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050e1d] text-white">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center animate-pulse mb-4">
          <GraduationCap className="w-6 h-6 text-[#0066cc]" />
        </div>
        <p className="text-sm font-medium text-slate-300">Loading your student portal...</p>
      </div>
    );
  }

  const displayName = user?.name || "Student";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050e1d] text-white relative overflow-x-hidden selection:bg-iqra-blue-600 selection:text-white">
      {/* Background Ambience & Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-[#0c2b5c]/40 via-transparent to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full border-b border-white/10 bg-[#050e1d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <UniversityLogo variant="default" size="sm" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Portal Session Active</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400" />}
              className="text-xs border-white/20 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-300 hover:text-white rounded-xl"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Welcome Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center">
        {/* Personalized Greeting Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center w-full max-w-2xl mx-auto"
        >
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-iqra-gold-400" />
            <span>Academic Onboarding Verified</span>
          </div>

          {/* DYNAMIC PERSONALIZED GREETING (e.g. Hey, Shakeel!) */}
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white mb-2">
            Hey,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-iqra-gold-400">
              {displayName}!
            </span>
          </h1>

          <div className="space-y-1 mb-4">
            <h2 className="text-lg sm:text-2xl font-bold font-heading text-blue-300">
              Welcome to Iqra University
            </h2>
            <p className="text-sm sm:text-base font-semibold text-iqra-gold-400 uppercase tracking-wider">
              Chak Shezad Campus
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            &ldquo;We are delighted to have you as part of our academic community. Your university journey towards excellence begins here.&rdquo;
          </p>
        </motion.div>

        {/* Digital Student Identification Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md mt-10 rounded-3xl p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-[#0c2b5c] via-[#0a192f] to-[#061122] border border-blue-400/30 shadow-2xl shadow-blue-950/50"
        >
          {/* Decorative Hologram Foil Accent */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br from-amber-400/20 to-blue-500/10 blur-xl pointer-events-none" />

          {/* Card Top: IU Branding */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066cc] to-[#0a192f] border border-blue-400/40 flex items-center justify-center text-xs font-black text-white">
                IU
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-white">IQRA UNIVERSITY</p>
                <p className="text-[10px] text-blue-300 font-medium">Chak Shezad Campus • Islamabad</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-iqra-gold-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              STUDENT ID
            </span>
          </div>

          {/* Card Body: Student Details */}
          <div className="py-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Name</span>
                <p className="text-base font-black text-white">{displayName}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-300">
                <UserIcon className="w-6 h-6 text-iqra-gold-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-black/25 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Enrollment ID</span>
                <span className="text-xs font-mono font-bold text-blue-300">
                  {user?.enrollmentId || "IU-CS-2026-1084"}
                </span>
              </div>

              <div className="bg-black/25 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active Enrolled
                </span>
              </div>
            </div>

            <div className="bg-black/25 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Department / Role</span>
              <span className="text-xs font-medium text-slate-200">
                {user?.department || "Computing & Technology"} • {user?.role ? user.role.toUpperCase() : "STUDENT"}
              </span>
            </div>
          </div>

          {/* Card Footer: Microchip / Barcode visual */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono text-[10px] tracking-widest text-slate-400">
              SECURE ACADEMIC CREDENTIAL
            </span>
            <span className="text-iqra-gold-400 font-bold">2026-2030</span>
          </div>
        </motion.div>

        {/* Phase 1 Notice & Upcoming Dashboard Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="w-full max-w-2xl mt-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 text-iqra-gold-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Phase 1 Milestone Complete</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            What&apos;s Coming in Phase 2?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            You have successfully completed user authentication and session registration. The full student dashboard features will be launched in the next development phase:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-slate-300">
              <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Course Enrollment & Timetable</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-slate-300">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Attendance & Grade Records</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-slate-300">
              <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Fee Invoices & Digital Challans</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-slate-300">
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Faculty Mentorship & Advising</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            {user?.role === "admin" ? (
              <Link
                href="/admin"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-iqra-gold-500 hover:from-amber-300 hover:to-iqra-gold-400 text-slate-950 text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-amber-500/20"
              >
                <span>Launch Admin SIS Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-iqra-gold-500 hover:bg-iqra-gold-400 text-slate-950 text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-amber-500/20"
              >
                <span>Launch Student Dashboard (8 Sections)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link href="/" className="text-xs text-blue-300 hover:text-white transition-colors inline-flex items-center gap-1">
              <span>Return to Campus Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="text-xs border-white/20 hover:bg-white/10 rounded-xl"
            >
              Sign Out Securely
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
