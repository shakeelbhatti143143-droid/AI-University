"use client";

import React, { useState } from "react";
import {
  Bell,
  Plus,
  Calendar,
  AlertCircle,
  X,
  Send,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FacultyAnnouncementsSectionProps {
  announcements: any[];
  courses: any[];
  facultyName: string;
  department: string;
  onPostAnnouncement: (data: any) => Promise<any>;
}

export const FacultyAnnouncementsSection: React.FC<FacultyAnnouncementsSectionProps> = ({
  announcements,
  courses,
  facultyName,
  department,
  onPostAnnouncement,
}) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<"Course" | "Department">("Course");
  const [selectedCourseCode, setSelectedCourseCode] = useState(courses[0]?.code || "");
  const [priority, setPriority] = useState<"Normal" | "High" | "Urgent">("Normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setIsSubmitting(true);
      await onPostAnnouncement({
        title: title.trim(),
        message: message.trim(),
        category,
        courseCode: category === "Course" ? selectedCourseCode : undefined,
        department: category === "Department" ? department : undefined,
        priority,
        facultyName,
      });

      setIsPostModalOpen(false);
      setTitle("");
      setMessage("");
      setSuccessMessage("Announcement posted and broadcasted to enrolled students.");
    } catch (err: any) {
      alert(err.message || "Failed to post announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase flex items-center gap-1">
              <Bell className="w-3 h-3" />
              Academic Communications
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Official Notices & Bulletins</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Notices & Class Announcements
          </h2>
          <p className="text-xs text-slate-500">
            Publish course updates, exam instructions, and review university-wide registrar notifications.
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 self-start sm:self-auto transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Post Notice</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <Bell className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No active notices</h3>
          <p className="text-xs text-slate-500">
            Post an announcement to notify students of lecture cancellations or assignment guidelines.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((anc) => (
            <div
              key={anc._id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase",
                      anc.priority === "Urgent"
                        ? "bg-rose-100 text-rose-800"
                        : anc.priority === "High"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-50 text-blue-700"
                    )}
                  >
                    {anc.priority || "Normal"} Priority
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                    {anc.category}
                  </span>
                  {anc.courseCode && (
                    <span className="text-[10px] font-mono font-bold text-blue-700">
                      {anc.courseCode}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{anc.publishDate}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">{anc.title}</h3>

              <p className="text-xs text-slate-600 leading-relaxed">{anc.message}</p>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Sender: <strong className="text-slate-600">{anc.sender}</strong></span>
                <span>Target: {anc.targetAudience || "All Students"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POST ANNOUNCEMENT MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black font-heading text-slate-900">
                  Broadcast Academic Notice
                </h3>
                <p className="text-xs text-slate-500">
                  Send notice to your course students or academic department.
                </p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Extra Lab Session for AI Model Deployment"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Scope</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Course">Specific Course</option>
                    <option value="Department">Full Department</option>
                  </select>
                </div>

                {category === "Course" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                    <select
                      value={selectedCourseCode}
                      onChange={(e) => setSelectedCourseCode(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    >
                      {courses.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detailed announcement instructions for students..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Broadcasting..." : "Broadcast Notice"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
