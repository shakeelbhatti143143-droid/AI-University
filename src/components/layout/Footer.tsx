"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Globe, Mail, Phone, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050e1d] text-slate-400 text-xs border-t border-white/10 py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/5">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
              <GraduationCap className="w-5 h-5 text-iqra-gold-500" />
              <span>IQRA UNIVERSITY – CHAK SHEZAD CAMPUS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Chartered by the Federal Government of Pakistan and recognized by the Higher Education Commission (HEC). Committed to fostering innovation, research excellence, and leadership.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-iqra-blue-400" />
                Park Road, Chak Shezad, Islamabad
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <p className="text-white font-semibold uppercase tracking-wider text-[11px]">Portals</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-blue-400 transition-colors">
                  Online Registration
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Faculty Portal (Phase 2)</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Digital Library</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Accreditation */}
          <div className="space-y-2.5">
            <p className="text-white font-semibold uppercase tracking-wider text-[11px]">Accreditation</p>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HEC W4 Category Recognized</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Admissions Office: info@iqraisb.edu.pk <br />
              UAN: +92 (51) 111-264-636
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Iqra University Chak Shezad Campus. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <span className="text-iqra-gold-400 font-medium">Phase 1 Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
