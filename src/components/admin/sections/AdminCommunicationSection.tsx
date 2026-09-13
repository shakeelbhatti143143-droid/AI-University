"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Bell,
  Plus,
  Send,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  sender: string;
  category: "University" | "Department" | "Course" | "Exam" | "Student-specific";
  targetAudience: string;
  department?: string;
  courseCode?: string;
  priority: "High" | "Normal" | "Urgent";
  publishDate: string;
  status: "Published" | "Draft" | "Archived";
  createdAt: number;
}

interface AdminCommunicationSectionProps {
  initialTab?: "announcements" | "notifications";
  announcements: Announcement[];
  onCreateAnnouncement: (data: any) => Promise<void>;
}

export const AdminCommunicationSection: React.FC<AdminCommunicationSectionProps> = ({
  initialTab = "announcements",
  announcements,
  onCreateAnnouncement,
}) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<"announcements" | "notifications">(initialTab);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    sender: "Office of the Registrar",
    category: "University" as const,
    targetAudience: "All Students",
    department: "",
    courseCode: "",
    priority: "Normal" as const,
    publishDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      alert("Please provide announcement title and message.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateAnnouncement({
        ...formData,
        adminName: user?.name || "Administrator",
        adminEmail: user?.email || "admin@isb.iqra.edu.pk",
      });
      setIsModalOpen(false);
      setFormData({
        title: "",
        message: "",
        sender: "Office of the Registrar",
        category: "University",
        targetAudience: "All Students",
        department: "",
        courseCode: "",
        priority: "Normal",
        publishDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });
    } catch (err: any) {
      alert(err.message || "Failed to publish announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase flex items-center gap-1">
              <Megaphone className="w-3 h-3" />
              University Communications
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Chak Shehzad Campus Broadcast</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Announcements & Targeted Notifications
          </h2>
          <p className="text-xs text-slate-500">
            Publish official university announcements, schedule notifications, and broadcast messages to student dashboards.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 self-start md:self-auto transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No announcements published</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Announcements published here will appear in the top notification marquee of relevant students.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((a) => (
              <div
                key={a._id}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                        a.priority === "Urgent"
                          ? "bg-rose-100 text-rose-800"
                          : a.priority === "High"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {a.category} • {a.priority}
                    </span>

                    <span className="text-[10px] text-slate-400 font-medium">{a.publishDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-tight">{a.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{a.message}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">From: {a.sender}</span>
                  <span className="font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                    Audience: {a.targetAudience}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black font-heading text-slate-900">
                Publish Campus Announcement
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Examination Timetable Published"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="University">University</option>
                    <option value="Department">Department</option>
                    <option value="Course">Course</option>
                    <option value="Exam">Exam</option>
                    <option value="Student-specific">Student-specific</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. All Students, Computing Dept"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Entity</label>
                  <input
                    type="text"
                    value={formData.sender}
                    onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed message text..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-iqra-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing..." : "Broadcast Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
