"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Sparkles,
  Building2,
  ShieldCheck,
  Award,
  CheckCircle2,
  Users,
  History,
  ArrowRight,
  BookOpen,
  Globe,
} from "lucide-react";

export default function AboutUniversityPage() {
  const profile = useQuery(api.website.getUniversityProfile, isConvexConfigured ? {} : "skip");

  return (
    <div className="space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "About University" }]} />

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-[#f0f4fa] via-slate-50 to-white border border-slate-200/80 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Institutional Profile</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading text-slate-900">
            About AI University
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {profile?.tagline ||
              "Where Your Future Begins — Your Journey Towards Excellence Starts Here."}
          </p>
        </div>
      </div>

      {/* Overview & Key Accreditations */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            University Overview
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {profile?.overview ||
              "Chartered by the Federal Government of Pakistan and recognized by the Higher Education Commission (HEC) in the highest W4 category, Iqra University Chak Shezad Campus stands as Islamabad's premier hub for innovative learning, research advancement, and academic distinction."}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Our curricula are specifically aligned with contemporary technology landscapes, incorporating advanced artificial intelligence, machine learning, scalable software architectures, and global business practices into all degree programs.
          </p>
        </div>

        {/* Credentials Pill Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Accreditation & Charter
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>HEC Highest Category (W4)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0b1f3a] shrink-0" />
                <span>Chartered by Federal Government</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Chak Shezad Campus, Islamabad</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0b1f3a] shrink-0" />
                <span>15,000+ Alumni Network</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/apply"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] transition-all shadow-xs"
            >
              <span>Apply for Admissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision-mission" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
        {/* Vision */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0b1f3a]/30 transition-colors shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-[#0b1f3a]" />
            <span>Our Vision</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            Pioneering the Next Generation of Thinkers
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {profile?.vision ||
              "To be an internationally recognized center of academic excellence and research that equips future generations with cutting-edge artificial intelligence, technological proficiency, entrepreneurial spirit, and human-centric values."}
          </p>
        </div>

        {/* Mission */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0b1f3a]/30 transition-colors shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] tracking-wider uppercase">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Our Mission</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            Excellence in Research, Teaching & Service
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {profile?.mission ||
              "To impart state-of-the-art education, foster ground-breaking scientific and technological research, and nurture ethical leaders capable of navigating complex global challenges through critical thinking, interdisciplinary innovation, and public service."}
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-widest text-[#0b1f3a] uppercase">
            Institutional Values
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            Core Values That Guide Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile?.coreValues && profile.coreValues.length > 0 ? (
            profile.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-[#0b1f3a]/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#f0f4fa] flex items-center justify-center text-[#0b1f3a] font-black text-xs">
                  {idx + 1}
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">{val.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center col-span-3 text-slate-500 text-xs">
              No core values configured yet.
            </div>
          )}
        </div>
      </section>

      {/* Academic Philosophy & Campus Experience */}
      <section id="philosophy" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 tracking-wider uppercase">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Academic Philosophy</span>
          </div>
          <h3 className="text-xl font-black font-heading text-slate-900">
            Theory Rooted in Practice
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {profile?.academicPhilosophy ||
              "Our pedagogy bridges foundational theoretical mastery with intensive hands-on lab experience, real-world industry capstone projects, and AI-assisted personalized mentorship. We ensure every scholar masters analytical problem-solving and rapid technological adaptation."}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 tracking-wider uppercase">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Campus Experience</span>
          </div>
          <h3 className="text-xl font-black font-heading text-slate-900">
            A Vibrant Learning Ecosystem
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {profile?.campusExperience ||
              "Nestled along scenic Park Road in Chak Shezad, Islamabad, our state-of-the-art campus combines architectural elegance with modern smart classrooms, high-performance computing laboratories, digital research libraries, vibrant student societies, and serene green courtyards."}
          </p>
        </div>
      </section>

      {/* History */}
      <section id="history" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 scroll-mt-24">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] tracking-wider uppercase">
          <History className="w-4 h-4 text-[#0b1f3a]" />
          <span>University History</span>
        </div>
        <h2 className="text-2xl font-black font-heading text-slate-900">
          Our Legacy of Educational Excellence
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {profile?.history ||
            "Established through Federal Charter, Iqra University has consistently ranked among the top institutions for computer science, business administration, and higher education in Pakistan. Over 15,000 alumni drive progress across global tech enterprises, academia, and public service."}
        </p>
      </section>

      {/* Leadership */}
      <section id="leadership" className="space-y-6 scroll-mt-24">
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-widest text-[#0b1f3a] uppercase">
            University Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            Institutional Leadership
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile?.leadership && profile.leadership.length > 0 ? (
            profile.leadership.map((leader, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between hover:border-[#0b1f3a]/30 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#0b1f3a] font-bold uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-[#0b1f3a]" />
                    <span>{leader.role}</span>
                  </div>
                  <h3 className="font-heading font-black text-lg text-slate-900">{leader.name}</h3>
                  <div className="text-xs text-[#0b1f3a] font-medium">{leader.designation}</div>
                  {leader.message && (
                    <blockquote className="text-xs text-slate-600 italic leading-relaxed pt-1 border-l-2 border-[#0b1f3a]/30 pl-3">
                      &ldquo;{leader.message}&rdquo;
                    </blockquote>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center col-span-2 text-slate-500 text-xs">
              Leadership profiles configured by administration will appear here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
