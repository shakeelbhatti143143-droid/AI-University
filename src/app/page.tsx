"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Users,
  Building2,
  Compass,
  ArrowRight,
  BookOpen,
  Cpu,
  Briefcase,
  Layers,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";

// Academic Faculties & Disciplines Data
const FACULTIES_DATA = [
  {
    id: "computing",
    title: "Computing & Artificial Intelligence",
    discipline: "Faculty of Technology",
    description: "AI, Computer Science, and Software Engineering calibrated for industry innovation.",
    icon: Cpu,
    badge: "Flagship AI",
    badgeIcon: Sparkles,
    programs: ["BS AI", "BS CS", "BS SE", "MS • PhD"],
    feature: "Neural GPU Research Labs",
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
    glowColor: "rgba(37, 99, 235, 0.12)",
    accentText: "text-blue-600",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200/80",
    chipBg: "bg-blue-50/70 hover:bg-blue-100/90 text-blue-900 border-blue-200/60",
    iconBoxBg: "bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-blue-500/5",
    iconBoxBorder: "border-blue-500/20 group-hover:border-blue-500/40",
    iconColor: "text-blue-600 group-hover:text-blue-700",
    href: "/explore/programs",
  },
  {
    id: "management",
    title: "Management Sciences",
    discipline: "Faculty of Business",
    description: "Strategic business acumen, fintech analytics, and corporate executive leadership.",
    icon: Briefcase,
    badge: "Leadership Track",
    badgeIcon: Award,
    programs: ["BBA", "MBA", "FinTech", "PhD Mgt"],
    feature: "Corporate Incubation Hub",
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    glowColor: "rgba(217, 119, 6, 0.12)",
    accentText: "text-amber-600",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200/80",
    chipBg: "bg-amber-50/70 hover:bg-amber-100/90 text-amber-900 border-amber-200/60",
    iconBoxBg: "bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5",
    iconBoxBorder: "border-amber-500/20 group-hover:border-amber-500/40",
    iconColor: "text-amber-600 group-hover:text-amber-700",
    href: "/explore/programs",
  },
  {
    id: "engineering",
    title: "Engineering & Technology",
    discipline: "Faculty of Engineering",
    description: "Electrical and computer engineering backed by high-tech laboratory infrastructure.",
    icon: Layers,
    badge: "PEC Accredited",
    badgeIcon: ShieldCheck,
    programs: ["BE Electrical", "Robotics", "IoT", "Embedded"],
    feature: "Advanced Electronics Testbeds",
    gradient: "from-emerald-500 via-teal-500 to-emerald-600",
    glowColor: "rgba(16, 185, 129, 0.12)",
    accentText: "text-emerald-600",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    chipBg: "bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-900 border-emerald-200/60",
    iconBoxBg: "bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/5",
    iconBoxBorder: "border-emerald-500/20 group-hover:border-emerald-500/40",
    iconColor: "text-emerald-600 group-hover:text-emerald-700",
    href: "/explore/programs",
  },
  {
    id: "social-sciences",
    title: "Social Sciences & Media",
    discipline: "Faculty of Media",
    description: "Media studies, digital journalism, and economics focused on societal transformation.",
    icon: Users,
    badge: "Broadcast Hub",
    badgeIcon: Sparkles,
    programs: ["Media", "DigiComms", "Broadcast", "Economics"],
    feature: "4K Digital Broadcast Suite",
    gradient: "from-rose-500 via-pink-500 to-purple-600",
    glowColor: "rgba(244, 63, 94, 0.12)",
    accentText: "text-rose-600",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200/80",
    chipBg: "bg-rose-50/70 hover:bg-rose-100/90 text-rose-900 border-rose-200/60",
    iconBoxBg: "bg-gradient-to-br from-rose-500/10 via-purple-500/10 to-rose-500/5",
    iconBoxBorder: "border-rose-500/20 group-hover:border-rose-500/40",
    iconColor: "text-rose-600 group-hover:text-rose-700",
    href: "/explore/programs",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050e1d] text-white relative selection:bg-[#0b1f3a] selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* ========================================================================= */}
      {/* HERO SECTION: Editorial Left-Aligned Architecture & Authentic Campus Focal Point */}
      {/* ========================================================================= */}
      <HeroSection />

      {/* ========================================================================= */}
      {/* SECTION 2: EXECUTIVE ACADEMIC OVERVIEW & INSTITUTIONAL PHILOSOPHY */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Academic Distinction & Pedagogy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5 text-[#0b1f3a]" />
                <span className="uppercase tracking-wider text-[11px]">Academic Distinction</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-900 leading-tight">
                An Educational Ecosystem Grounded in Excellence & Innovation
              </h2>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Chartered by the Federal Government of Pakistan and recognized by the Higher Education Commission (HEC) in the highest W4 category, Iqra University Chak Shezad Campus stands as Islamabad&apos;s premier hub for innovative learning, research advancement, and academic distinction.
              </p>

              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
                Our pedagogy bridges foundational theoretical mastery with intensive hands-on lab experience, real-world industry capstone projects, and AI-assisted personalized mentorship. We ensure every scholar masters analytical problem-solving and rapid technological adaptation.
              </p>

              {/* Verified Institutional Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200/90 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Rigorous Standards</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Contemporary curricula aligned with global technological frontiers and outcome-based education.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200/90 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Research Advancement</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Inquiry-driven laboratories in artificial intelligence, machine learning, and scalable systems.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/explore/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0b1f3a] hover:text-[#122b4e] transition-colors"
                >
                  <span>Read Full Institutional Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Campus Life & Location Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-3xl overflow-hidden bg-[#050e1d] text-white border border-white/10 p-8 sm:p-10 shadow-xl space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Campus Location
                  </span>
                  <h3 className="text-2xl font-black font-heading text-white">
                    Chak Shezad, Islamabad
                  </h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Nestled along scenic Park Road in Chak Shezad, Islamabad, our state-of-the-art campus combines architectural elegance with modern smart classrooms, high-performance computing laboratories, digital research libraries, vibrant student societies, and serene green courtyards.
                </p>

                <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Park Road, Chak Shezad, Islamabad, 45550</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>UAN: +92 51 111-264-264</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/explore/campus"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0b1f3a] hover:bg-slate-100 text-xs font-bold transition-all shadow-md"
                  >
                    <span>View Campus Facilities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/explore/map"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold transition-all"
                  >
                    <span>Campus Map & Directions</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: ACADEMIC DISCIPLINES & FACULTIES */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/70 to-[#f8fafc] text-slate-900 border-t border-slate-200/90 overflow-hidden">
        {/* Subtle Decorative Background Ambient Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#0b1f3a 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-gradient-to-b from-blue-200/25 via-indigo-100/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#0b1f3a]" />
              <span className="uppercase tracking-wider text-[11px] font-bold">Academic Faculties</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-[#0b1f3a]">
              Disciplines of Contemporary Distinction
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Accredited degree programs combining rigorous foundational theories with advanced artificial intelligence, machine learning, and executive leadership.
            </p>
          </div>

          {/* 4 Faculties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {FACULTIES_DATA.map((faculty, idx) => {
              const IconComponent = faculty.icon;
              const BadgeIcon = faculty.badgeIcon;
              return (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col justify-between rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_36px_-10px_rgba(11,31,58,0.14)] hover:-translate-y-1.5 hover:border-slate-300 transition-all duration-300 overflow-hidden"
                >
                  {/* Top Ambient Accent Gradient Line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${faculty.gradient} opacity-80 group-hover:opacity-100 group-hover:h-1.5 transition-all duration-300`}
                  />

                  {/* Subtle Top-Right Ambient Radial Glow (Fires on Hover) */}
                  <div
                    className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-35 transition-opacity duration-500"
                    style={{ backgroundColor: faculty.glowColor }}
                  />

                  {/* Main Card Content */}
                  <div className="p-5 space-y-3 relative z-10 flex-1 flex flex-col">
                    {/* Header: Floating Icon Badge + Credential Pill */}
                    <div className="flex items-center justify-between gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-xl ${faculty.iconBoxBg} border ${faculty.iconBoxBorder} flex items-center justify-center shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:rotate-1`}
                      >
                        <IconComponent className={`w-5 h-5 ${faculty.iconColor} transition-colors duration-300`} />
                      </div>

                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${faculty.badgeBg}`}
                      >
                        <BadgeIcon className="w-2.5 h-2.5 shrink-0" />
                        <span>{faculty.badge}</span>
                      </div>
                    </div>

                    {/* Title & Category */}
                    <div className="space-y-0.5 pt-0.5">
                      <span className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 block">
                        {faculty.discipline}
                      </span>
                      <h3 className="text-[15px] sm:text-base font-bold font-heading text-slate-900 group-hover:text-[#0b1f3a] tracking-tight leading-snug transition-colors min-h-[2.5rem] flex items-center">
                        {faculty.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                      {faculty.description}
                    </p>

                    {/* Key Programs Chips */}
                    <div className="pt-1 mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {faculty.programs.map((prog, pIdx) => (
                          <span
                            key={pIdx}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all duration-200 ${faculty.chipBg}`}
                          >
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hallmark Feature Ribbon */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10.5px] font-medium text-slate-500">
                      <CheckCircle2 className={`w-3 h-3 shrink-0 ${faculty.accentText}`} />
                      <span className="truncate">{faculty.feature}</span>
                    </div>
                  </div>

                  {/* Compact Interactive Action Footer */}
                  <div className="px-5 pb-4 pt-0 relative z-10">
                    <Link
                      href={faculty.href}
                      className="group/btn w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-[#0b1f3a] group-hover:bg-[#0b1f3a] text-slate-700 hover:text-white group-hover:text-white transition-all duration-200 font-bold text-xs shadow-2xs group-hover:shadow-xs border border-slate-200/80 group-hover:border-[#0b1f3a]"
                    >
                      <span>Explore Programs</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/explore/programs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] text-white text-xs sm:text-sm font-bold tracking-wide shadow-md shadow-[#0b1f3a]/15 hover:shadow-lg hover:shadow-[#0b1f3a]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>View All Degree Programs & Curricula</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: ADMISSIONS 2026 INSTITUTIONAL GATEWAY */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#050e1d] text-white border-t border-white/10 overflow-hidden">
        <div className="max-w-5xl mx-auto w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admissions Session 2026 Open</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white">
              Take the Next Step Towards Academic Excellence
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Submit your online application through our centralized admission portal or visit the Admissions Office at Chak Shezad Campus, Islamabad.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#0b1f3a] bg-white hover:bg-slate-100 active:bg-slate-200 active:scale-[0.98] shadow-xl hover:scale-[1.01] transition-all"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 text-[#0b1f3a]" />
            </Link>

            <Link
              href="/status"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/20 backdrop-blur-md transition-all"
            >
              <span>Track Application Status</span>
            </Link>

            <Link
              href="/explore/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-transparent border border-white/15 hover:border-white/30 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Admissions Office</span>
            </Link>
          </div>

          <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs text-slate-400">
            <div>
              <p className="text-white font-bold mb-0.5">UAN Inquiry Line</p>
              <p>+92 51 111-264-264</p>
            </div>
            <div>
              <p className="text-white font-bold mb-0.5">Admissions Email</p>
              <p>info@isb.iqra.edu.pk</p>
            </div>
            <div>
              <p className="text-white font-bold mb-0.5">Campus Location</p>
              <p>Park Road, Chak Shezad, Islamabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
