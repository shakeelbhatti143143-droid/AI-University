"use client";

import React, { Suspense, use } from "react";
import Link from "next/link";
import { StudentLecturesSection } from "@/components/dashboard/sections/StudentLecturesSection";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, MapPin } from "lucide-react";

function CourseLecturesContent({ courseId }: { courseId: string }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col">
      {/* TOP PORTAL NAV HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/student/lectures"
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Courses</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                COURSE LECTURES
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              {user?.name ? user.name[0] : "S"}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT WITH SELECTED COURSE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <StudentLecturesSection initialCourseId={courseId} />
      </main>
    </div>
  );
}

export default function CourseLecturesPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CourseLecturesContent courseId={resolvedParams.courseId} />
    </Suspense>
  );
}
