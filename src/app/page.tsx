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
import { Iqra3DWordmark } from "@/components/ui/Iqra3DWordmark";

// Campus hero photography path
const CAMPUS_HERO_IMAGE = "/images/campus-hero.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050e1d] text-white relative selection:bg-[#0b1f3a] selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* ========================================================================= */}
      {/* HERO SECTION: Full-Screen Cinematic Campus Background & Institutional Typography */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Full-bleed Campus Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <Image
            src={CAMPUS_HERO_IMAGE}
            alt="Iqra University Chak Shehzad Campus Islamabad"
            fill
            priority
            quality={92}
            className="object-cover object-center transition-transform duration-1000 ease-out"
          />

          {/* Controlled Cinematic Navy Overlay: Subtle so campus photography is clearly visible */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(5, 14, 29, 0.55) 0%, rgba(5, 14, 29, 0.35) 40%, rgba(5, 14, 29, 0.7) 80%, rgba(5, 14, 29, 0.95) 100%)",
            }}
          />
        </div>

        {/* Hero Content Area */}
        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center my-auto">
          {/* Institutional Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-slate-200 mb-6 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chartered by Federal Government • HEC Highest W4 Category</span>
          </motion.div>

          {/* University Name & Campus Branding */}
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <h1 className="text-[clamp(2.5rem,7.2vw,5.75rem)] font-black font-heading tracking-tight uppercase leading-[1.05] flex flex-wrap items-baseline justify-center gap-x-3.5 sm:gap-x-5 select-none text-center">
              {/* Ultra-Premium 3D Animated Deep-Blue IQRA Brand Wordmark */}
              <Iqra3DWordmark />

              {/* Supporting Institutional Suffix */}
              <span
                className="font-bold sm:font-extrabold tracking-[0.04em] sm:tracking-[0.06em] text-slate-100/95 inline-block"
                style={{
                  filter: "drop-shadow(0 2px 8px rgba(5, 14, 29, 0.75))",
                }}
              >
                UNIVERSITY
              </span>
            </h1>

            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 sm:w-20 bg-white/30" />
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold font-heading tracking-widest uppercase text-slate-200">
                CHAK SHEHZAD CAMPUS
              </h2>
              <span className="h-px w-10 sm:w-20 bg-white/30" />
            </div>
          </motion.div>

          {/* Primary Tagline Headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
            className="mt-6 text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-4xl leading-tight tracking-tight"
          >
            &ldquo;Where Your Future Begins.&rdquo;
          </motion.p>

          {/* Concise Academic Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: "easeOut" }}
            className="mt-4 text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal"
          >
            Islamabad&apos;s premier seat of academic distinction, research excellence, and technological innovation. Empowering the next generation of leaders along scenic Park Road.
          </motion.p>

          {/* Primary & Secondary Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5 z-20"
          >
            {/* Primary CTA: Start Your Journey */}
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#0b1f3a] bg-white hover:bg-slate-100 active:bg-slate-200 active:scale-[0.98] shadow-xl shadow-black/30 hover:shadow-2xl hover:scale-[1.01] transition-all duration-200"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 text-[#0b1f3a]" />
            </Link>

            {/* Secondary CTA: Already Have an Account */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 active:bg-white/20 active:scale-[0.98] border border-white/20 backdrop-blur-md hover:scale-[1.01] transition-all duration-200"
            >
              <span>Already Have an Account</span>
            </Link>

            {/* Dedicated Portal Link: Explore University */}
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-[#0b1f3a]/80 hover:bg-[#0b1f3a] active:scale-[0.98] border border-white/15 backdrop-blur-md transition-all duration-200"
            >
              <Compass className="w-4 h-4 text-slate-300" />
              <span>Explore University</span>
            </Link>
          </motion.div>

          {/* Verified Institutional Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            className="mt-14 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left"
          >
            {/* Pillar 1: Federal Charter */}
            <div className="p-4 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/15 hover:border-white/25 transition-colors">
              <div className="flex items-center gap-2 text-slate-300 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Charter</span>
              </div>
              <div className="text-lg sm:text-xl font-black font-heading text-white">Federal</div>
              <div className="text-[11px] text-slate-300">Government of Pakistan</div>
            </div>

            {/* Pillar 2: HEC Recognition */}
            <div className="p-4 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/15 hover:border-white/25 transition-colors">
              <div className="flex items-center gap-2 text-slate-300 mb-1">
                <Award className="w-4 h-4 text-slate-200" />
                <span className="text-[11px] font-bold uppercase tracking-wider">HEC W4</span>
              </div>
              <div className="text-lg sm:text-xl font-black font-heading text-white">Category</div>
              <div className="text-[11px] text-slate-300">Highest Recognition</div>
            </div>

            {/* Pillar 3: Campus Location */}
            <div className="p-4 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/15 hover:border-white/25 transition-colors">
              <div className="flex items-center gap-2 text-slate-300 mb-1">
                <Building2 className="w-4 h-4 text-slate-200" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Location</span>
              </div>
              <div className="text-lg sm:text-xl font-black font-heading text-white">Chak Shezad</div>
              <div className="text-[11px] text-slate-300">Park Road, Islamabad</div>
            </div>

            {/* Pillar 4: Alumni Network */}
            <div className="p-4 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/15 hover:border-white/25 transition-colors">
              <div className="flex items-center gap-2 text-slate-300 mb-1">
                <Users className="w-4 h-4 text-slate-200" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Scholars</span>
              </div>
              <div className="text-lg sm:text-xl font-black font-heading text-white">15,000+</div>
              <div className="text-[11px] text-slate-300">Alumni & Graduates</div>
            </div>
          </motion.div>
        </div>
      </section>

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
      <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto w-full space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/15 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-[#0b1f3a]" />
              <span className="uppercase tracking-wider text-[11px] font-bold">Academic Faculties</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-[#0b1f3a]">
              Disciplines of Contemporary Distinction
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Accredited degree programs combining rigorous foundational theories with advanced artificial intelligence, machine learning, and executive leadership.
            </p>
          </div>

          {/* 4 Faculties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Faculty 1: Computing & AI */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0b1f3a]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#f0f4fa] border border-[#0b1f3a]/15 text-[#0b1f3a] flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-[#0b1f3a]" />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Computing & Artificial Intelligence
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Degree programs in Artificial Intelligence, Computer Science, and Software Engineering calibrated for industry innovation.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/explore/programs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b1f3a] hover:text-[#122b4e] transition-colors"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Faculty 2: Management Sciences */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0b1f3a]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#f0f4fa] border border-[#0b1f3a]/15 text-[#0b1f3a] flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#0b1f3a]" />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Management Sciences
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  BBA, MBA, and graduate research cultivating strategic business acumen, data-driven finance, and executive leadership.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/explore/programs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b1f3a] hover:text-[#122b4e] transition-colors"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Faculty 3: Engineering & Technology */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0b1f3a]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#f0f4fa] border border-[#0b1f3a]/15 text-[#0b1f3a] flex items-center justify-center">
                  <Layers className="w-6 h-6 text-[#0b1f3a]" />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Engineering & Technology
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Electrical and Computer Engineering degrees backed by high-tech laboratory infrastructure and hardware prototypes.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/explore/programs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b1f3a] hover:text-[#122b4e] transition-colors"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Faculty 4: Social Sciences */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0b1f3a]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#f0f4fa] border border-[#0b1f3a]/15 text-[#0b1f3a] flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0b1f3a]" />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Social Sciences & Media
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Degrees in Media Studies, Communications, and Economics focused on digital broadcast media and societal transformation.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/explore/programs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b1f3a] hover:text-[#122b4e] transition-colors"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/explore/programs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] text-white text-xs sm:text-sm font-bold tracking-wide shadow-md transition-all"
            >
              <span>View All Degree Programs & Curricula</span>
              <ArrowRight className="w-4 h-4" />
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
