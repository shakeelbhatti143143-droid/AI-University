"use client";

import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileCheck,
  Eye,
  Calendar,
  Sparkles,
  Award,
  Filter,
} from "lucide-react";
import { Assignment } from "@/lib/dashboard-data";

interface AssignmentsSectionProps {
  assignments: Assignment[];
  onOpenSubmitModal: (assignment: Assignment) => void;
  onOpenViewModal: (assignment: Assignment) => void;
  searchFilter: string;
}

export const AssignmentsSection: React.FC<AssignmentsSectionProps> = ({
  assignments,
  onOpenSubmitModal,
  onOpenViewModal,
  searchFilter,
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<
    "All" | "Upcoming" | "Pending" | "Submitted" | "Overdue"
  >("All");

  const counts = {
    All: assignments.length,
    Upcoming: assignments.filter((a) => a.status === "Upcoming").length,
    Pending: assignments.filter((a) => a.status === "Pending").length,
    Submitted: assignments.filter((a) => a.status === "Submitted").length,
    Overdue: assignments.filter((a) => a.status === "Overdue").length,
  };

  const filteredAssignments = assignments.filter((asg) => {
    const matchesSearch =
      asg.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      asg.courseCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
      asg.courseTitle.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;
    if (activeStatusTab === "All") return true;
    return asg.status === activeStatusTab;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Fall 2026 Academic Submissions
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Section CS-6A</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Assignments & Coursework Manager
          </h2>
          <p className="text-xs text-slate-500">
            Submit assignments on time to avoid late grade penalties (10% penalty per 24 hours overdue).
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pending Submissions
            </span>
            <span className="text-2xl font-black font-heading text-amber-600">
              {counts.Pending + counts.Upcoming}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Graded & Done
            </span>
            <span className="text-2xl font-black font-heading text-emerald-600">
              {counts.Submitted}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs: All, Upcoming, Pending, Submitted, Overdue */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(["All", "Upcoming", "Pending", "Submitted", "Overdue"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveStatusTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeStatusTab === tab
                ? "bg-iqra-navy-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>{tab} Assignments</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeStatusTab === tab
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((asg) => {
            const isPending = asg.status === "Pending";
            const isUpcoming = asg.status === "Upcoming";
            const isSubmitted = asg.status === "Submitted";
            const isOverdue = asg.status === "Overdue";

            return (
              <div
                key={asg.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-iqra-blue-400/60 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-iqra-navy-900 text-white">
                      {asg.courseCode}
                    </span>

                    <span className="text-xs font-semibold text-slate-500 truncate">
                      {asg.courseTitle}
                    </span>

                    {/* Priority Indicator */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        asg.priority === "High"
                          ? "bg-rose-100 text-rose-800"
                          : asg.priority === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {asg.priority} Priority
                    </span>

                    {/* Weightage */}
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {asg.weightage}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {asg.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {asg.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-rose-700">
                      <Calendar className="w-3.5 h-3.5" />
                      Due Date: {asg.dueDate} ({asg.dueTime})
                    </span>

                    <span>•</span>

                    <span>Total Marks: <strong>{asg.totalMarks}</strong></span>

                    {(asg.teacher || asg.facultyName) && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">
                          Instructor: {asg.teacher || asg.facultyName}
                        </span>
                      </>
                    )}

                    {asg.createdAt && (
                      <>
                        <span>•</span>
                        <span className="text-slate-500">
                          Assigned: {new Date(asg.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    )}

                    {asg.obtainedMarks !== undefined && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Awarded Marks: {asg.obtainedMarks} / {asg.totalMarks}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Action buttons & Status Badge */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isSubmitted
                        ? "bg-emerald-100 text-emerald-800"
                        : isPending
                        ? "bg-amber-100 text-amber-800"
                        : isUpcoming
                        ? "bg-blue-100 text-blue-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {isSubmitted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isPending && <Clock className="w-3.5 h-3.5" />}
                    {isUpcoming && <Calendar className="w-3.5 h-3.5" />}
                    {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{asg.status}</span>
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onOpenViewModal(asg)}
                      className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Rubric</span>
                    </button>

                    {isSubmitted ? (
                      <button
                        onClick={() => onOpenViewModal(asg)}
                        className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Submitted File</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenSubmitModal(asg)}
                        className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-iqra-gold-400" />
                        <span>Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : assignments.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">No assignments available</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no assignments assigned for your enrolled courses.
            </p>
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">No Assignments Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no assignments matching the selected filter ({activeStatusTab}).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
