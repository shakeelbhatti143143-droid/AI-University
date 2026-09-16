"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Compass,
  Sparkles,
  PhoneCall,
  Clock,
} from "lucide-react";
import { UniversityLogo } from "@/components/ui/UniversityLogo";

export const ExploreFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#030914] text-slate-400 text-xs border-t border-white/10 pt-16 pb-12 relative z-10 select-none">
      {/* Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Callout Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900/40 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold tracking-widest text-iqra-gold-400 uppercase">
              Admissions 2026 Open
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
              Ready to Begin Your Journey Towards Excellence?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Explore programs, review transparent fee schedules, or submit your online admission application.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore/programs"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <span>Explore Programs</span>
            </Link>
          </div>
        </div>

        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Col 1 & 2: About Lockup */}
          <div className="space-y-4 lg:col-span-2">
            <UniversityLogo variant="default" size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Chartered by the Federal Government of Pakistan and recognized by the Higher Education Commission (HEC) in the highest W4 category. Dedicated to world-class learning, computing leadership, and artificial intelligence advancement.
            </p>
            <div className="space-y-2 pt-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-iqra-blue-400 shrink-0" />
                <span>Park Road, Chak Shezad, Islamabad, 45550, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Admissions Helpline: +92 51 111-264-264</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Admissions Office: admissions@isb.iqra.edu.pk</span>
              </div>
            </div>
          </div>

          {/* Col 3: Explore Portal */}
          <div className="space-y-3">
            <p className="text-white font-bold uppercase tracking-wider text-xs font-heading">
              Explore Portal
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore/about" className="hover:text-blue-400 transition-colors">
                  About University
                </Link>
              </li>
              <li>
                <Link href="/explore/faculty" className="hover:text-blue-400 transition-colors">
                  Faculty Members
                </Link>
              </li>
              <li>
                <Link href="/explore/departments" className="hover:text-blue-400 transition-colors">
                  Academic Departments
                </Link>
              </li>
              <li>
                <Link href="/explore/programs" className="hover:text-blue-400 transition-colors">
                  Degree Programs
                </Link>
              </li>
              <li>
                <Link href="/explore/fees" className="hover:text-blue-400 transition-colors">
                  Fee Structure
                </Link>
              </li>
              <li>
                <Link href="/explore/campus" className="hover:text-blue-400 transition-colors">
                  Campus Facilities
                </Link>
              </li>
              <li>
                <Link href="/explore/map" className="hover:text-blue-400 transition-colors">
                  University Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & News */}
          <div className="space-y-3">
            <p className="text-white font-bold uppercase tracking-wider text-xs font-heading">
              Community & News
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore/posts" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span>University Feed</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/explore/announcements" className="hover:text-blue-400 transition-colors">
                  Official Announcements
                </Link>
              </li>
              <li>
                <Link href="/explore/news" className="hover:text-blue-400 transition-colors">
                  News & Dispatches
                </Link>
              </li>
              <li>
                <Link href="/explore/events" className="hover:text-blue-400 transition-colors">
                  Campus Events
                </Link>
              </li>
              <li>
                <Link href="/explore/gallery" className="hover:text-blue-400 transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/explore/contact" className="hover:text-blue-400 transition-colors">
                  Contact Directory
                </Link>
              </li>
              <li>
                <Link href="/explore/search" className="hover:text-blue-400 transition-colors">
                  Portal Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Accreditation & Portals */}
          <div className="space-y-3">
            <p className="text-white font-bold uppercase tracking-wider text-xs font-heading">
              Accreditation
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>HEC Recognized W4 Category</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Chartered by the Federal Government of Pakistan. Full equivalence and accreditation recognized globally.
            </p>

            <div className="pt-3 space-y-1.5 border-t border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Digital Systems
              </span>
              <div className="flex flex-col gap-1 text-xs">
                <Link href="/login" className="hover:text-blue-300 transition-colors">
                  Academic Portal Sign In
                </Link>
                <Link href="/status" className="hover:text-blue-300 transition-colors">
                  Track Application Status
                </Link>
                <Link href="/apply" className="hover:text-amber-400 transition-colors">
                  Online Admission Application
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Iqra University Chak Shezad Campus Islamabad. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/explore/about" className="hover:text-slate-300 transition-colors">
              About AI University
            </Link>
            <span>•</span>
            <Link href="/explore/contact" className="hover:text-slate-300 transition-colors">
              Help & Support
            </Link>
            <span>•</span>
            <span className="text-iqra-gold-400 font-medium">Explore Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
