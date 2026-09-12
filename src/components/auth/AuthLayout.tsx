"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { AuthIllustration } from "./AuthIllustration";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badgeText?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle = "CHAK SHEZAD CAMPUS",
  badgeText = "STUDENT PANEL",
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#f0f5fa] relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-[#0a192f]/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

      {/* Main Centered Split Card (Inspired by reference design) */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden relative z-10 flex flex-col md:flex-row min-h-[580px]"
      >
        {/* Left Side: Educational Illustration & Campus Atmosphere */}
        <div className="hidden md:flex md:w-1/2 bg-[#f8fbfe] border-r border-slate-100 items-center justify-center relative">
          <AuthIllustration />
        </div>

        {/* Right Side: Authentication Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 relative bg-white">
          {/* Top Bar with Back Button & Mini Crest */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            <span className="text-[11px] font-mono text-slate-400 tracking-wider">
              iqra.edu.pk
            </span>
          </div>

          {/* Centered Brand Header (Matching reference: Icon + UNIVERSITY NAME + STUDENT PANEL) */}
          <div className="flex flex-col items-center text-center my-auto">
            {/* Academic Icon / Book with Mortarboard (matching reference image) */}
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066cc] mb-3 shadow-sm group hover:scale-105 transition-transform duration-200">
              <div className="relative flex flex-col items-center">
                <GraduationCap className="w-7 h-7 text-[#0066cc]" />
                <div className="w-4 h-1 bg-iqra-gold-500 rounded-full mt-0.5" />
              </div>
            </div>

            <h1 className="text-lg sm:text-xl font-black font-heading tracking-wider uppercase text-slate-900">
              {title}
            </h1>
            <p className="text-xs font-bold tracking-widest uppercase text-[#0066cc] mt-0.5">
              {subtitle}
            </p>
            {badgeText && (
              <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {badgeText}
              </span>
            )}

            {/* Form Slot */}
            <div className="w-full mt-6">{children}</div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Official Digital Portal of Iqra University Chak Shezad Campus
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
