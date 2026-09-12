
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Building2,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExploreUniversitySection } from "@/components/landing/ExploreUniversitySection";

// ARCHITECTURE CONFIGURATION:
// Replace this single path anytime to update the campus hero background image
const CAMPUS_HERO_IMAGE = "/images/campus-hero.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050e1d] text-white relative selection:bg-iqra-blue-600 selection:text-white">

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section: Full Viewport with Campus Image & Dark Luxury Overlay */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Full-bleed Campus Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <Image
            src={CAMPUS_HERO_IMAGE}
            alt="Iqra University Chak Shezad Campus Islamabad"
            fill
            priority
            quality={90}
            className="object-cover object-center transition-transform duration-1000 ease-out"
          />

          {/* Subtle Dark Navy Overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(5, 15, 30, 0.45), rgba(5, 15, 30, 0.55))",
            }}
          />
        </div>

        {/* Hero Content Area */}
        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center my-auto">

          {/* Top Campus Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-6 shadow-glass-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 text-iqra-gold-400 animate-pulse" />

            <span>
              Chartered by Federal Government • HEC Recognized
            </span>
          </motion.div>

          {/* University Name */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="space-y-2"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tight uppercase leading-[1.08] text-white">
              IQRA UNIVERSITY
            </h1>

            <div className="flex items-center justify-center gap-3">
              <span className="h-0.5 w-8 sm:w-16 bg-iqra-gold-500 rounded-full" />

              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-widest uppercase text-blue-300">
                CHAK SHEZAD CAMPUS
              </h2>

              <span className="h-0.5 w-8 sm:w-16 bg-iqra-gold-500 rounded-full" />
            </div>
          </motion.div>

          {/* ================================================= */}
          {/* SIMPLE WHITE BOLD TAGLINE */}
          {/* ================================================= */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: "easeOut",
            }}
            className="mt-6 text-xl sm:text-3xl font-extrabold text-white max-w-4xl leading-relaxed tracking-wide"
          >
            &ldquo;Where Your Future Begins — Your Journey Towards Excellence
            Starts Here.&rdquo;
          </motion.p>

          {/* ================================================= */}
          {/* SIMPLE WHITE BOLD DESCRIPTION */}
          {/* ================================================= */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease: "easeOut",
            }}
            className="mt-4 text-sm sm:text-lg font-bold text-white max-w-3xl leading-relaxed tracking-wide"
          >
            Welcome to Islamabad&apos;s premier hub for innovative learning,
            research advancement, and academic distinction. Access your
            institutional resources through our centralized digital portal.
          </motion.p>


          {/* Floating Key Indicators / Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: "easeOut",
            }}
            className="mt-14 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left"
          >

            {/* Ranked */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 text-iqra-gold-400 mb-1">
                <Award className="w-4 h-4" />

                <span className="text-xs font-bold uppercase tracking-wider">
                  Ranked
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-black font-heading text-white">
                #1 in IT
              </div>

              <div className="text-[11px] text-slate-400">
                Independent Rankings
              </div>
            </div>

            {/* Campus */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 text-sky-400 mb-1">
                <Building2 className="w-4 h-4" />

                <span className="text-xs font-bold uppercase tracking-wider">
                  Campus
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-black font-heading text-white">
                Chak Shezad
              </div>

              <div className="text-[11px] text-slate-400">
                Islamabad, Pakistan
              </div>
            </div>

            {/* Status */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />

                <span className="text-xs font-bold uppercase tracking-wider">
                  Status
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-black font-heading text-white">
                Chartered
              </div>

              <div className="text-[11px] text-slate-400">
                Federal Government
              </div>
            </div>

            {/* Community */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Users className="w-4 h-4" />

                <span className="text-xs font-bold uppercase tracking-wider">
                  Community
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-black font-heading text-white">
                15,000+
              </div>

              <div className="text-[11px] text-slate-400">
                Alumni & Scholars
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Explore University Showcase Section */}
      <ExploreUniversitySection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
