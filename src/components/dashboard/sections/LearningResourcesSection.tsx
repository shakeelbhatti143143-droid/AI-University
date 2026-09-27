"use client";

import React, { useState, useMemo } from "react";
import {
  BookMarked,
  Search,
  ExternalLink,
  Download,
  BookOpen,
  FileCode,
  Sparkles,
  Bookmark,
  Share2,
  CheckCircle2,
  Library,
  GraduationCap,
  Layers,
  FileText,
  Tag,
  TrendingUp,
} from "lucide-react";
import { LearningResource } from "@/lib/dashboard-data";

interface LearningResourcesSectionProps {
  resources: LearningResource[];
}

export const LearningResourcesSection: React.FC<LearningResourcesSectionProps> = ({
  resources,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);

  const categories = [
    "All",
    "HEC Repository",
    "Digital Book",
    "Research Paper",
    "Cheat Sheet",
    "Development Tool",
  ];

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchCategory =
        selectedCategory === "All" || r.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.author && r.author.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [resources, selectedCategory, searchQuery]);

  const toggleBookmark = (id: string, title: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setNotification(`Removed "${title.slice(0, 30)}..." from bookmarks`);
      } else {
        next.add(id);
        setNotification(`Saved "${title.slice(0, 30)}..." to your library`);
      }
      return next;
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAccess = (r: LearningResource) => {
    if (r.link && r.link !== "#") {
      window.open(r.link, "_blank", "noopener,noreferrer");
    } else {
      setNotification(`Opening ${r.title}...`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const getCategoryBadgeStyle = (cat: string) => {
    switch (cat) {
      case "HEC Repository":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Digital Book":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Research Paper":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Cheat Sheet":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium">{notification}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase flex items-center gap-1">
              <Library className="w-3 h-3" />
              Digital Learning Commons
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">HEC & Global Repositories</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Learning Resources & Digital Library
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access indexed IEEE publications, university textbooks, development toolchains, and AI curriculum roadmaps.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-2.5">
          <div className="px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-bold text-indigo-600">Bookmarked</p>
            <p className="text-lg font-black text-indigo-800">{bookmarkedIds.size}</p>
          </div>
          <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Items</p>
            <p className="text-lg font-black text-slate-800">{resources.length}</p>
          </div>
        </div>
      </div>

      {/* Recommended Academic Portals Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="https://ieeexplore.ieee.org"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white hover:scale-[1.02] transition-transform shadow-xs flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              Campus Proxy
            </span>
            <h4 className="text-sm font-black">IEEE Xplore Library</h4>
            <p className="text-[11px] text-blue-200/80">5M+ IEEE journals and conference papers</p>
          </div>
          <ExternalLink className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
        </a>

        <a
          href="https://arxiv.org/corr"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white hover:scale-[1.02] transition-transform shadow-xs flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Open Science
            </span>
            <h4 className="text-sm font-black">arXiv AI & CS Archive</h4>
            <p className="text-[11px] text-slate-300">Latest preprints on GenAI, NLP & Vision</p>
          </div>
          <ExternalLink className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
        </a>

        <a
          href="https://www.hec.gov.pk"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white hover:scale-[1.02] transition-transform shadow-xs flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
              National Repository
            </span>
            <h4 className="text-sm font-black">HEC National Digital Library</h4>
            <p className="text-[11px] text-teal-200/80">30+ institutional international databases</p>
          </div>
          <ExternalLink className="w-5 h-5 text-teal-300 group-hover:text-white transition-colors" />
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search textbooks, research papers, cheat sheets, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <BookMarked className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Resources Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No items match your selected filters. Try broadening your keywords or clearing category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => {
            const isBookmarked = bookmarkedIds.has(res.id);
            return (
              <div
                key={res.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase border tracking-wider ${getCategoryBadgeStyle(
                        res.category
                      )}`}
                    >
                      {res.category}
                    </span>

                    <button
                      onClick={() => toggleBookmark(res.id, res.title)}
                      className={`p-1.5 rounded-xl transition-all ${
                        isBookmarked
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Save for Later"}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isBookmarked ? "fill-indigo-600" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {res.title}
                    </h3>
                    {(res.author || res.publisher) && (
                      <p className="text-[11px] font-medium text-slate-400 mt-1">
                        By {res.author || res.publisher}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {res.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {res.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {res.fileSize ? `${res.fileType} • ${res.fileSize}` : res.fileType}
                  </div>

                  <button
                    onClick={() => handleAccess(res)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    {res.fileType === "WEB" ? (
                      <>
                        <span>Visit Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Access Resource</span>
                        <Download className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
