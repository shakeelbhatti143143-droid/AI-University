"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { FacultyLecturesSection } from "@/components/faculty/sections/FacultyLecturesSection";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, MapPin } from "lucide-react";

function TeacherLecturesContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#070E1E] text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col">
      {/* TOP PORTAL NAV HEADER */}
      <header className="sticky top-0 z-30 bg-[#0B1528] border-b border-slate-800 px-4 sm:px-8 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/faculty/dashboard?tab=lectures"
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Faculty Dashboard</span>
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-white">
                FACULTY LECTURE MANAGEMENT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Academic Curriculum Portal</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              {user?.name ? user.name[0] : "F"}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <FacultyLecturesSection />
      </main>
    </div>
  );
}

export default function TeacherLecturesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#070E1E]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TeacherLecturesContent />
    </Suspense>
  );
}
