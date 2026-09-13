"use client";

import React from "react";
import {
  Bot,
  Brain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Calendar,
  BookOpen,
  Award,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminAiManagementSectionProps {
  coursesCount: number;
  examsCount: number;
  assignmentsCount: number;
}

export const AdminAiManagementSection: React.FC<AdminAiManagementSectionProps> = ({
  coursesCount,
  examsCount,
  assignmentsCount,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase flex items-center gap-1">
              <Bot className="w-3 h-3 text-indigo-600" />
              Machine Learning & Academic Intelligence
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Iqra University Assistant</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            AI Assistant & Study Planner Governance
          </h2>
          <p className="text-xs text-slate-500">
            Monitor institutional AI usage, study planner course contextualization, and automated academic recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-bold self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Gemini Intelligence Engine Connected</span>
        </div>
      </div>

      {/* Institutional AI Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Courses Indexed for AI</span>
            <BookOpen className="w-4 h-4 text-iqra-blue-600" />
          </div>
          <span className="text-3xl font-black font-heading text-slate-900">{coursesCount}</span>
          <p className="text-[10px] text-slate-500">
            Syllabi & topics available for automated study plan generation
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Upcoming Exams Mapped</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-black font-heading text-slate-900">{examsCount}</span>
          <p className="text-[10px] text-slate-500">
            Exam target milestones guiding day-by-day revision schedules
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Assignments Contextualized</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-3xl font-black font-heading text-slate-900">{assignmentsCount}</span>
          <p className="text-[10px] text-slate-500">
            Course deadlines synchronized with study time allocations
          </p>
        </div>
      </div>

      {/* Student Privacy & Governance Notice */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-iqra-gold-400 text-xs font-bold">
          <Lock className="w-4 h-4" />
          <span>Student Privacy & Academic Integrity Guarantee</span>
        </div>
        <h3 className="text-lg font-bold text-white">Confidential AI Tutoring Environment</h3>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          In strict accordance with academic information privacy policies, administrators cannot inspect the private conversational logs or personal study habit notes of students. The Admin portal governs the institutional reference curricula, examination dates, and grading weights that guide the AI's recommendations.
        </p>
      </div>

      {/* Model & System Configuration */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          AI Assistant Operational Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Default Model Engine:</span>
              <span className="font-bold text-slate-900">Google Gemini 2.5 Flash / Flash-Lite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Context Window:</span>
              <span className="font-mono text-slate-900">1,000,000 Tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Campus Identity Context:</span>
              <span className="font-semibold text-slate-900">Iqra University Chak Shehzad</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Study Plan Customization:</span>
              <span className="font-bold text-emerald-600">Adaptive Dynamic Scheduling</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rate Limiting:</span>
              <span className="font-semibold text-slate-900">HEC Fair-Use Academic Tier</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Guardrails:</span>
              <span className="font-semibold text-emerald-700">Strict Anti-Plagiarism & Safety</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
