"use client";

import React, { useState, useMemo } from "react";
import {
  FolderGit2,
  BookOpen,
  FileText,
  FileCode,
  Download,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
  Eye,
  FileDown,
  X,
} from "lucide-react";
import { CourseMaterialItem, EnrolledCourse } from "@/lib/dashboard-data";

interface CourseMaterialsSectionProps {
  materials: CourseMaterialItem[];
  enrolledCourses: EnrolledCourse[];
}

export const CourseMaterialsSection: React.FC<CourseMaterialsSectionProps> = ({
  materials,
  enrolledCourses,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedWeek, setSelectedWeek] = useState<number | "All">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewMaterial, setPreviewMaterial] = useState<CourseMaterialItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Available unique course codes
  const courseOptions = useMemo(() => {
    const set = new Set<string>();
    materials.forEach((m) => set.add(m.courseCode));
    enrolledCourses.forEach((c) => set.add(c.code));
    return Array.from(set);
  }, [materials, enrolledCourses]);

  // Unique weeks present in materials
  const weekOptions = useMemo(() => {
    const weeks = Array.from(new Set(materials.map((m) => m.weekNumber))).sort(
      (a, b) => a - b
    );
    return weeks;
  }, [materials]);

  // Filter logic
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchCourse =
        selectedCourse === "All" || m.courseCode === selectedCourse;
      const matchType =
        selectedType === "All" || m.materialType === selectedType;
      const matchWeek =
        selectedWeek === "All" || m.weekNumber === selectedWeek;
      const matchSearch =
        searchQuery.trim() === "" ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.courseCode.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCourse && matchType && matchWeek && matchSearch;
    });
  }, [materials, selectedCourse, selectedType, selectedWeek, searchQuery]);

  const handleDownload = (mat: CourseMaterialItem) => {
    setDownloadSuccess(`Downloading ${mat.title} (${mat.fileSize})...`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const getFormatBadgeColor = (type: string) => {
    switch (type) {
      case "PDF":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "PPTX":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "ZIP":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Lecture Slides":
        return <Layers className="w-4 h-4 text-orange-600" />;
      case "Lab Manual":
        return <FileCode className="w-4 h-4 text-purple-600" />;
      case "Reading Notes":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium">{downloadSuccess}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-700 uppercase flex items-center gap-1">
              <FolderGit2 className="w-3 h-3" />
              Official Course Repository
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Fall 2026 Academic Term</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Course Materials & Lecture Notes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access weekly presentation slides, verified lab instructions, reading handouts, and code archives.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-2.5">
          <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Files</p>
            <p className="text-lg font-black text-slate-800">{materials.length}</p>
          </div>
          <div className="px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-bold text-blue-600">Subjects</p>
            <p className="text-lg font-black text-iqra-blue-700">{courseOptions.length}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search lectures, topics, course codes, or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20 focus:border-iqra-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Week Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Week:</span>
            <select
              value={selectedWeek}
              onChange={(e) =>
                setSelectedWeek(e.target.value === "All" ? "All" : Number(e.target.value))
              }
              aria-label="Filter course materials by week"
              className="px-3.5 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-iqra-blue-500"
            >
              <option value="All">All Weeks (1-16)</option>
              {weekOptions.map((wk) => (
                <option key={wk} value={wk}>
                  Week {wk < 10 ? `0${wk}` : wk}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Course:</span>
          <button
            onClick={() => setSelectedCourse("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCourse === "All"
                ? "bg-iqra-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Courses
          </button>
          {courseOptions.map((code) => (
            <button
              key={code}
              onClick={() => setSelectedCourse(code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCourse === code
                  ? "bg-iqra-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        {/* Material Type Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Type:</span>
          {[
            "All",
            "Lecture Slides",
            "Reading Notes",
            "Lab Manual",
            "Source Code",
          ].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedType === type
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List */}
      {filteredMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Materials Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No course materials match your current filter selections. Try clearing your search query or selecting "All Courses".
          </p>
          <button
            onClick={() => {
              setSelectedCourse("All");
              setSelectedType("All");
              setSelectedWeek("All");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-iqra-blue-50 text-iqra-blue-700 text-xs font-bold rounded-xl hover:bg-iqra-blue-100 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Top Meta */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wider bg-slate-900 text-white uppercase shadow-2xs">
                      {mat.courseCode}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Week {mat.weekNumber < 10 ? `0${mat.weekNumber}` : mat.weekNumber}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black border uppercase shadow-2xs flex items-center gap-1 ${getFormatBadgeColor(
                      mat.fileType
                    )}`}
                  >
                    {mat.fileType} • {mat.fileSize}
                  </span>
                </div>

                {/* Title & Topic */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {getTypeIcon(mat.materialType)}
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {mat.topicTitle}
                    </p>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
                    {mat.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {mat.description}
                </p>

                {/* Instructor & Upload date */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-100 font-medium">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {mat.uploadedBy}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {mat.uploadDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleDownload(mat)}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download File
                </button>
                <button
                  onClick={() => setPreviewMaterial(mat)}
                  className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all shadow-2xs"
                  title="Quick Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900 text-white">
                  {previewMaterial.courseCode}
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-iqra-blue-700">
                  Week {previewMaterial.weekNumber}
                </span>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {previewMaterial.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {previewMaterial.courseTitle} • {previewMaterial.materialType}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">Topic Outline:</p>
              <p>{previewMaterial.topicTitle}</p>
              <p className="font-semibold text-slate-800 mt-2">Abstract:</p>
              <p>{previewMaterial.description}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-200">
                <span>Instructor: {previewMaterial.uploadedBy}</span>
                <span>Format: {previewMaterial.fileType} ({previewMaterial.fileSize})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMaterial(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(previewMaterial);
                  setPreviewMaterial(null);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-iqra-blue-600 text-white font-bold text-xs hover:bg-iqra-blue-700 transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
