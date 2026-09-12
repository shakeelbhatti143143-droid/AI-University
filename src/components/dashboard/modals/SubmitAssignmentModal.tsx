"use client";

import React, { useState } from "react";
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Assignment } from "@/lib/dashboard-data";

interface SubmitAssignmentModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentId: string, fileName: string) => void;
}

export const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const fileName = selectedFile?.name || `IU_${assignment.courseCode}_Shakeel_Assignment.pdf`;
      onSubmit(assignment.id, fileName);
      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">
                {assignment.courseCode}
              </span>
              <span className="text-[11px] text-iqra-gold-400 font-semibold">
                Due: {assignment.dueDate} ({assignment.dueTime})
              </span>
            </div>
            <h3 className="text-base font-bold text-white leading-snug">
              Submit Assignment
            </h3>
            <p className="text-xs text-blue-200 line-clamp-1">{assignment.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-slate-900">Assignment Submitted!</h4>
              <p className="text-xs text-slate-500">
                Your file has been recorded in the LMS database.
              </p>
            </div>
          ) : (
            <>
              {/* Drag & Drop File Box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-iqra-blue-500 bg-slate-50/70 hover:bg-blue-50/20 text-center transition-colors cursor-pointer relative"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.zip,.py,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-iqra-blue-600 mx-auto mb-2" />
                {selectedFile ? (
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-slate-700 text-xs">
                      Drag & Drop assignment file or browse
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Supported formats: PDF, ZIP, DOCX, PY (Max 25MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Submission Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Submission Comments / Git Repository URL (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. GitHub link, specific run instructions for evaluator..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20"
                />
              </div>

              {/* Plagiarism Declaration */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Academic Integrity Pledge:</strong> By submitting, I declare that this assignment is my own original work and adheres to HEC plagiarism policies.
                </span>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4 text-iqra-gold-400" />
                  <span>{isSubmitting ? "Uploading..." : "Confirm & Submit"}</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
