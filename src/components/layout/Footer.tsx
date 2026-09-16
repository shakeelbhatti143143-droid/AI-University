"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050e1d] text-slate-400 text-xs border-t border-white/10 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-sm tracking-wide">
              <GraduationCap className="w-5 h-5 text-white" />
              <span>IQRA UNIVERSITY – CHAK SHEZAD CAMPUS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Chartered by the Federal Government of Pakistan and recognized by the Higher Education Commission (HEC) in the highest W4 category. Committed to innovative learning, research advancement, and academic excellence.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Park Road, Chak Shezad, Islamabad
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <p className="text-white font-semibold uppercase tracking-wider text-[11px]">Academic Portals</p>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-slate-400 hover:text-white transition-colors">
                  Online Admissions 2026
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-slate-400 hover:text-white transition-colors">
                  Track Application Status
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-slate-400 hover:text-white transition-colors">
                  Explore University Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Accreditation */}
          <div className="space-y-2.5">
            <p className="text-white font-semibold uppercase tracking-wider text-[11px]">Accreditation & Help</p>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>HEC W4 Category Recognized</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed pt-1 space-y-1">
              <p>Admissions: info@isb.iqra.edu.pk</p>
              <p>UAN: +92 (51) 111-264-264</p>
              <p>Helpline: +92 (51) 111-264-636</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Iqra University Chak Shezad Campus, Islamabad. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <span className="text-slate-400">Institutional System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
