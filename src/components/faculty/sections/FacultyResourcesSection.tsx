"use client";

import React from "react";
import {
  FolderArchive,
  BookOpen,
  Download,
  ExternalLink,
  FileCode,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export const FacultyResourcesSection: React.FC = () => {
  const resources = [
    {
      title: "HEC Pakistan Standardized Grading & Credit Policy",
      category: "Academic Policy",
      description: "Guidelines on 4.0 GPA calculation scale, relative grading standards, and continuous evaluation weightages.",
      size: "2.4 MB PDF",
      updated: "Fall 2026",
    },
    {
      title: "Iqra University Official Course Syllabus Template",
      category: "Curriculum Design",
      description: "Accredited syllabus format with Bloom's Taxonomy learning outcomes and course milestones.",
      size: "850 KB DOCX",
      updated: "August 2026",
    },
    {
      title: "Chak Shehzad Campus Academic Calendar 2026-2027",
      category: "Schedule & Deadlines",
      description: "Official dates for semester start, add/drop week, midterm exam window, prep leave, and final results publishing.",
      size: "1.1 MB PDF",
      updated: "September 2026",
    },
    {
      title: "Laboratory Manual & Hardware Workstation Guidelines",
      category: "Lab Instruction",
      description: "Computing department lab safety protocols, cloud GPU sandbox allocation, and student machine policies.",
      size: "3.2 MB PDF",
      updated: "July 2026",
    },
    {
      title: "Examination Conduct & Invigilation Standard Operating Procedures",
      category: "Examinations",
      description: "Invigilator duties, unfair means case (UMC) procedures, attendance verification, and script submission rules.",
      size: "1.5 MB PDF",
      updated: "September 2026",
    },
    {
      title: "Digital Library Access & IEEE/ACM Research Portal",
      category: "Research Repository",
      description: "Campus proxy credentials and instructions for accessing IEEE Xplore, ScienceDirect, and ACM Digital Library.",
      size: "Web Portal Link",
      updated: "Active Subscription",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase flex items-center gap-1">
              <FolderArchive className="w-3 h-3" />
              Faculty Knowledge Base
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">HEC & University Guidelines</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Academic & Teaching Resources
          </h2>
          <p className="text-xs text-slate-500">
            Official curriculum templates, HEC grading regulations, academic calendar, and research library access.
          </p>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((res, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                {res.category}
              </span>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {res.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {res.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium text-[11px]">{res.size}</span>
              <button
                onClick={() => alert(`Downloading "${res.title}"...`)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Access</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
