"use client";

import React from "react";
import { motion } from "framer-motion";

export const AuthIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[420px] flex items-center justify-center p-8 overflow-hidden select-none bg-gradient-to-br from-blue-50/60 via-slate-50/40 to-blue-100/30">
      {/* Soft Background Decorative Circles */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.45, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-blue-200/40 blur-2xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-sky-200/50 blur-3xl pointer-events-none"
      />

      {/* Main Illustration Container */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <svg
          viewBox="0 0 500 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-sm"
        >
          {/* Background Soft Bubble */}
          <circle cx="250" cy="230" r="160" fill="#EBF4FF" fillOpacity="0.8" />
          <circle cx="340" cy="140" r="45" fill="#DBEAFE" fillOpacity="0.6" />

          {/* Desktop Monitor Stand */}
          <rect x="235" y="320" width="30" height="40" rx="4" fill="#94A3B8" />
          <path d="M190 360 C190 355 210 355 250 355 C290 355 310 355 310 360 L320 370 H180 L190 360 Z" fill="#CBD5E1" />

          {/* Desktop Monitor Frame */}
          <rect x="110" y="140" width="280" height="185" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="4" />
          {/* Monitor Screen Bezel & Screen */}
          <rect x="120" y="150" width="260" height="165" rx="8" fill="#1E293B" />
          
          {/* Screen Content Graphics */}
          <rect x="140" y="170" width="130" height="8" rx="4" fill="#0284C7" />
          <rect x="140" y="185" width="90" height="6" rx="3" fill="#475569" />
          <rect x="140" y="200" width="150" height="6" rx="3" fill="#334155" />
          <rect x="140" y="215" width="110" height="6" rx="3" fill="#334155" />
          
          {/* Code/Graph window mock on screen */}
          <rect x="140" y="235" width="220" height="60" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <circle cx="155" cy="247" r="3" fill="#EF4444" />
          <circle cx="165" cy="247" r="3" fill="#F59E0B" />
          <circle cx="175" cy="247" r="3" fill="#10B981" />
          <rect x="155" y="260" width="120" height="4" rx="2" fill="#38BDF8" />
          <rect x="155" y="270" width="80" height="4" rx="2" fill="#94A3B8" />
          <rect x="155" y="280" width="140" height="4" rx="2" fill="#64748B" />

          {/* Large Graduation Cap Resting on Monitor */}
          <g transform="translate(60, 60)">
            {/* Mortarboard Diamond Top */}
            <path
              d="M130 65 L220 25 L130 -15 L40 25 Z"
              fill="#0F172A"
              stroke="#1E293B"
              strokeWidth="2"
            />
            {/* Skull Cap underside */}
            <path
              d="M75 35 C75 35 75 75 130 75 C185 75 185 35 185 35 Z"
              fill="#020617"
            />
            {/* Button on top */}
            <circle cx="130" cy="25" r="5" fill="#F59E0B" />
            {/* Tassel cord and fringe */}
            <path
              d="M130 25 C130 40 70 45 60 70"
              stroke="#F59E0B"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <rect x="54" y="70" width="12" height="22" rx="4" fill="#D97706" />
          </g>

          {/* Student Character 1 (collaborating on top of monitor) */}
          <g transform="translate(265, 85)">
            {/* Hair */}
            <circle cx="35" cy="20" r="14" fill="#0F172A" />
            {/* Head */}
            <circle cx="35" cy="23" r="11" fill="#FBCFE8" />
            {/* Blue Shirt Body */}
            <path d="M22 36 C22 32 48 32 48 36 L52 60 H18 L22 36 Z" fill="#0284C7" />
            {/* Arms holding cable */}
            <path d="M22 40 L5 55" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
            <path d="M48 40 L65 52" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Power/Network Cable Loop (Flowing down) */}
          <path
            d="M330 137 C370 160 385 240 375 300 C370 340 385 365 400 375"
            stroke="#0F172A"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Electrical Wall Socket */}
          <rect x="410" y="300" width="35" height="45" rx="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="422" cy="318" r="3" fill="#64748B" />
          <circle cx="433" cy="318" r="3" fill="#64748B" />

          {/* Student Character 2 (connecting plug at base) */}
          <g transform="translate(365, 310)">
            {/* Head */}
            <circle cx="20" cy="15" r="10" fill="#FBCFE8" />
            <circle cx="20" cy="12" r="11" fill="#1E293B" />
            {/* Blue Uniform */}
            <path d="M12 26 C12 24 28 24 28 26 L30 52 H10 L12 26 Z" fill="#0284C7" />
            {/* Dark Trousers */}
            <rect x="12" y="52" width="7" height="30" rx="3" fill="#0F172A" />
            <rect x="21" y="52" width="7" height="30" rx="3" fill="#0F172A" />
            {/* Arm holding connector */}
            <path d="M28 32 L45 28" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
            {/* Power Connector Plug */}
            <rect x="44" y="24" width="12" height="8" rx="2" fill="#0066CC" />
          </g>

          {/* Blue Spherical Nodes on floor (matching reference) */}
          <circle cx="160" cy="370" r="14" fill="#0284C7" />
          <circle cx="155" cy="365" r="5" fill="#38BDF8" fillOpacity="0.8" />
          <circle cx="295" cy="385" r="16" fill="#0369A1" />
          <circle cx="290" cy="380" r="6" fill="#38BDF8" fillOpacity="0.8" />
        </svg>

        {/* Caption below illustration */}
        <div className="text-center mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-iqra-blue-700">
            Next-Generation Academic Portal
          </p>
          <p className="text-[13px] text-slate-500 mt-1 max-w-[240px] leading-relaxed">
            Empowering students with seamless access to world-class learning resources.
          </p>
        </div>
      </div>
    </div>
  );
};
