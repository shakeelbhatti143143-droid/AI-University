"use client";

import React from "react";
import {
  X,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  Download,
  AlertCircle,
} from "lucide-react";
import { Assignment } from "@/lib/dashboard-data";

interface ViewAssignmentModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSubmit: (assignment: Assignment) => void;
}

export const ViewAssignmentModal: React.FC<ViewAssignmentModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onOpenSubmit,
}) => {
  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">
                {assignment.courseCode}
              </span>
              <span className="text-xs text-iqra-gold-400 font-semibold">
                {assignment.courseTitle}
              </span>
            </div>
            <h3 className="text-base font-bold text-white leading-snug">
              {assignment.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Metadata chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Due Date</span>
              <span className="text-xs font-bold text-slate-900">{assignment.dueDate}</span>
              <span className="text-[10px] text-slate-400 block">{assignment.dueTime}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Marks</span>
              <span className="text-xs font-bold text-slate-900">{assignment.totalMarks} Marks</span>
              <span className="text-[10px] text-slate-400 block">{assignment.weightage}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Status</span>
              <span
                className={`text-xs font-bold block ${
                  assignment.status === "Submitted" ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {assignment.status}
              </span>
              {assignment.obtainedMarks !== undefined && (
                <span className="text-[10px] font-bold text-emerald-700 block">
                  Scored: {assignment.obtainedMarks}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Assignment Overview & Requirements
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
              {assignment.description}
            </div>
          </div>

          {/* Rubric Notes */}
          {assignment.rubricNotes && (
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Grading Rubric & Feedback Notes
              </h4>
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 text-slate-700 leading-relaxed">
                {assignment.rubricNotes}
              </div>
            </div>
          )}

          {/* If Submitted: Show submitted file */}
          {assignment.fileName && (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-xs block">{assignment.fileName}</span>
                  <span className="text-[10px] text-emerald-700">
                    Submitted on {assignment.submittedAt || "On-time"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => alert(`Downloading ${assignment.fileName}...`)}
                className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors"
                title="Download submitted file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Close
          </button>

          {assignment.status !== "Submitted" && (
            <button
              onClick={() => {
                onClose();
                onOpenSubmit(assignment);
              }}
              className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-colors"
            >
              Submit This Assignment →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
