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
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
} from "@/components/admin/credential";

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
      <CredentialCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#8a8272] flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-[#8a8272]" />
                Machine Learning & Academic Intelligence
              </span>
              <span className="text-xs text-[#4a4335]">•</span>
              <span className="text-xs font-semibold text-[#8a8272]">Iqra University Assistant</span>
            </div>
            <h2 className="text-2xl font-serif font-medium text-[#F2EEE4] tracking-tight">
              AI Assistant & Study Planner Governance
            </h2>
            <p className="text-xs text-[#8a8272] mt-1">
              Monitor institutional AI usage, study planner course contextualization, and automated academic recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] text-[#7DAE7A] text-xs font-mono self-start md:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DAE7A] animate-pulse" />
            <span>Gemini Intelligence Connected</span>
          </div>
        </div>
      </CredentialCard>

      {/* Institutional AI Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CredentialCard>
          <div className="flex items-center justify-between text-[#8a8272] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Courses Indexed for AI</span>
            <BookOpen className="w-4 h-4 text-[#8a8272]" />
          </div>
          <span className="text-3xl font-serif text-[#F2EEE4]">{coursesCount}</span>
          <p className="text-[11px] text-[#8a8272] mt-1">
            Syllabi & topics available for automated study plan generation
          </p>
        </CredentialCard>

        <CredentialCard>
          <div className="flex items-center justify-between text-[#8a8272] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Upcoming Exams Mapped</span>
            <Award className="w-4 h-4 text-[#8a8272]" />
          </div>
          <span className="text-3xl font-serif text-[#F2EEE4]">{examsCount}</span>
          <p className="text-[11px] text-[#8a8272] mt-1">
            Exam target milestones guiding day-by-day revision schedules
          </p>
        </CredentialCard>

        <CredentialCard>
          <div className="flex items-center justify-between text-[#8a8272] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Assignments Contextualized</span>
            <Calendar className="w-4 h-4 text-[#8a8272]" />
          </div>
          <span className="text-3xl font-serif text-[#F2EEE4]">{assignmentsCount}</span>
          <p className="text-[11px] text-[#8a8272] mt-1">
            Course deadlines synchronized with study time allocations
          </p>
        </CredentialCard>
      </div>

      {/* Student Privacy & Governance Notice */}
      <CredentialCard>
        <div className="flex items-center gap-2 text-[#8a8272] text-xs font-mono uppercase mb-2">
          <Lock className="w-4 h-4 text-[#8a8272]" />
          <span>Student Privacy & Academic Integrity Guarantee</span>
        </div>
        <h3 className="text-lg font-serif font-medium text-[#F2EEE4]">Confidential AI Tutoring Environment</h3>
        <p className="text-xs text-[#8a8272] max-w-2xl leading-relaxed mt-2">
          In strict accordance with academic information privacy policies, administrators cannot inspect the private conversational logs or personal study habit notes of students. The Admin portal governs the institutional reference curricula, examination dates, and grading weights that guide the AI's recommendations.
        </p>
      </CredentialCard>

      {/* Model & System Configuration */}
      <CredentialCard>
        <h3 className="text-sm font-serif font-medium text-[#F2EEE4] uppercase tracking-wider mb-4">
          AI Assistant Operational Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8a8272]">Default Model Engine:</span>
              <span className="font-serif text-[#F2EEE4]">Google Gemini 2.5 Flash</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8272]">Context Window:</span>
              <span className="font-mono text-[#D8D3C6]">1,000,000 Tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8272]">Campus Identity Context:</span>
              <span className="text-[#D8D3C6]">Iqra University Chak Shehzad</span>
            </div>
          </div>

          <div className="p-4 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8a8272]">Study Plan Customization:</span>
              <span className="font-medium text-[#7DAE7A]">Adaptive Dynamic Scheduling</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8272]">Rate Limiting:</span>
              <span className="text-[#D8D3C6]">HEC Fair-Use Academic Tier</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a8272]">Security Guardrails:</span>
              <span className="text-[#7DAE7A]">Strict Anti-Plagiarism & Safety</span>
            </div>
          </div>
        </div>
      </CredentialCard>
    </div>
  );
};
