"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  CheckCircle2,
  ShieldCheck,
  Send,
  User,
  ArrowLeft,
} from "lucide-react";
import { StudentProfile } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface CourseDiscussionsSectionProps {
  profile: StudentProfile;
}

interface DiscussionPost {
  id: string;
  courseCode: string;
  courseTitle: string;
  authorId: string;
  authorName: string;
  authorRole: "student" | "faculty" | "admin";
  title: string;
  content: string;
  tag: "#Assignment" | "#Lecture" | "#ExamPrep" | "#Project" | "#General";
  upvotesCount: number;
  hasUserUpvoted: boolean;
  hasInstructorEndorsed: boolean;
  replyCount: number;
  timeAgo: string;
  replies: Array<{
    id: string;
    authorName: string;
    authorRole: "student" | "faculty" | "admin";
    content: string;
    isInstructorEndorsed: boolean;
    upvotesCount: number;
    timeAgo: string;
  }>;
}

const SAMPLE_DISCUSSIONS: DiscussionPost[] = [
  {
    id: "disc-1",
    courseCode: "CS-301",
    courseTitle: "Data Structures & Algorithms",
    authorId: "st-101",
    authorName: "Hamza Tariq",
    authorRole: "student",
    title: "Time complexity analysis of AVL Tree rotation vs Red-Black Tree?",
    content: "When balancing AVL trees during sequential insertions, how many rotations are strictly guaranteed in the worst case compared to Red-Black tree color flips?",
    tag: "#Lecture",
    upvotesCount: 8,
    hasUserUpvoted: false,
    hasInstructorEndorsed: true,
    replyCount: 2,
    timeAgo: "2 hours ago",
    replies: [
      {
        id: "rep-1",
        authorName: "Dr. Kamran Malik",
        authorRole: "faculty",
        content: "Great question, Hamza. For AVL trees, insertion requires at most 2 rotations (single or double) to restore balance, though height calculation propagates up. Red-black trees require at most 2 rotations as well, but fewer recolorings overall. See Lecture 7 slide 24 for the amortized proof.",
        isInstructorEndorsed: true,
        upvotesCount: 14,
        timeAgo: "1 hour ago",
      },
      {
        id: "rep-2",
        authorName: "Fatima Noor",
        authorRole: "student",
        content: "Also remember AVL trees have tighter height balance factors (differ by at most 1), making lookups slightly faster than Red-Black trees!",
        isInstructorEndorsed: false,
        upvotesCount: 3,
        timeAgo: "45 mins ago",
      },
    ],
  },
  {
    id: "disc-2",
    courseCode: "CS-301",
    courseTitle: "Data Structures & Algorithms",
    authorId: "st-102",
    authorName: "Bilal Ahmed",
    authorRole: "student",
    title: "Assignment 2: Graph Cycle Detection with Disjoint Sets",
    content: "Does the Union-Find algorithm with path compression work correctly on directed graphs for cycle detection, or only undirected?",
    tag: "#Assignment",
    upvotesCount: 5,
    hasUserUpvoted: false,
    hasInstructorEndorsed: true,
    replyCount: 1,
    timeAgo: "5 hours ago",
    replies: [
      {
        id: "rep-3",
        authorName: "Dr. Kamran Malik",
        authorRole: "faculty",
        content: "Union-Find works directly only for undirected graphs. For directed graphs, use DFS with coloring (white/grey/black) or Kahn's algorithm (topological sort check). Refer to the CLRS textbook Chapter 22.",
        isInstructorEndorsed: true,
        upvotesCount: 9,
        timeAgo: "4 hours ago",
      },
    ],
  },
  {
    id: "disc-3",
    courseCode: "MTH-201",
    courseTitle: "Discrete Mathematics",
    authorId: "st-103",
    authorName: "Zainab Rauf",
    authorRole: "student",
    title: "Midterm Exam Prep: Which Proof Techniques Are Prioritized?",
    content: "Should I focus more on induction proofs or combinatorics for the upcoming midterm based on last year's paper trends?",
    tag: "#ExamPrep",
    upvotesCount: 12,
    hasUserUpvoted: false,
    hasInstructorEndorsed: false,
    replyCount: 0,
    timeAgo: "1 day ago",
    replies: [],
  },
];

export const CourseDiscussionsSection: React.FC<CourseDiscussionsSectionProps> = ({ profile }) => {
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(SAMPLE_DISCUSSIONS);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDiscussion, setActiveDiscussion] = useState<DiscussionPost | null>(null);
  const [replyInput, setReplyInput] = useState("");
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState<"#Assignment" | "#Lecture" | "#ExamPrep" | "#Project" | "#General">("#Lecture");

  const filteredDiscussions = discussions.filter((d) => {
    const matchesTag = selectedTag === "All" || d.tag === selectedTag;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleToggleUpvote = (discId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === discId) {
          const hasUpvoted = !d.hasUserUpvoted;
          return {
            ...d,
            hasUserUpvoted: hasUpvoted,
            upvotesCount: hasUpvoted ? d.upvotesCount + 1 : d.upvotesCount - 1,
          };
        }
        return d;
      })
    );
    if (activeDiscussion && activeDiscussion.id === discId) {
      setActiveDiscussion((prev) =>
        prev
          ? {
              ...prev,
              hasUserUpvoted: !prev.hasUserUpvoted,
              upvotesCount: !prev.hasUserUpvoted ? prev.upvotesCount + 1 : prev.upvotesCount - 1,
            }
          : null
      );
    }
  };

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeDiscussion) return;

    const newReply = {
      id: `rep-${Date.now()}`,
      authorName: profile.name,
      authorRole: "student" as const,
      content: replyInput.trim(),
      isInstructorEndorsed: false,
      upvotesCount: 0,
      timeAgo: "Just now",
    };

    const updatedDisc = {
      ...activeDiscussion,
      replyCount: activeDiscussion.replyCount + 1,
      replies: [...activeDiscussion.replies, newReply],
    };

    setDiscussions((prev) => prev.map((d) => (d.id === activeDiscussion.id ? updatedDisc : d)));
    setActiveDiscussion(updatedDisc);
    setReplyInput("");
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: DiscussionPost = {
      id: `disc-${Date.now()}`,
      courseCode: "CS-301",
      courseTitle: "Data Structures & Algorithms",
      authorId: profile.studentId,
      authorName: profile.name,
      authorRole: "student",
      title: newTitle.trim(),
      content: newContent.trim(),
      tag: newTag,
      upvotesCount: 1,
      hasUserUpvoted: true,
      hasInstructorEndorsed: false,
      replyCount: 0,
      timeAgo: "Just now",
      replies: [],
    };

    setDiscussions([newPost, ...discussions]);
    setIsAskModalOpen(false);
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-iqra-navy-950 via-iqra-navy-900 to-iqra-blue-900 text-white p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Academic Q&amp;A &amp; Peer Forum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Course Discussions &amp; Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Collaborative course discussion boards with peer upvoting and faculty-verified solution badges.
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-iqra-blue-700 hover:bg-white/90 text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>
      </div>

      {activeDiscussion ? (
        /* Detailed Thread View */
        <div className="space-y-4">
          <button
            onClick={() => setActiveDiscussion(null)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-iqra-blue-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Course Questions</span>
          </button>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-iqra-blue-700 px-2 py-0.5 rounded-lg bg-iqra-blue-50 border border-iqra-blue-200">
                  {activeDiscussion.courseCode}
                </span>
                <span className="text-xs text-slate-500">{activeDiscussion.courseTitle}</span>
                <span className="text-slate-200">•</span>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{activeDiscussion.tag}</span>
              </div>
              <span className="text-[11px] text-slate-400">{activeDiscussion.timeAgo}</span>
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              {activeDiscussion.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activeDiscussion.content}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <User className="w-3.5 h-3.5" />
                <span>Asked by <strong className="text-slate-700">{activeDiscussion.authorName}</strong></span>
              </div>

              <button
                onClick={() => handleToggleUpvote(activeDiscussion.id)}
                className={cn(
                  "h-[28px] px-3 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors",
                  activeDiscussion.hasUserUpvoted
                    ? "border-iqra-blue-300 text-iqra-blue-600 bg-iqra-blue-50"
                    : "border-slate-200 text-slate-500 hover:border-iqra-blue-300 hover:text-iqra-blue-600 hover:bg-iqra-blue-50"
                )}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Upvote ({activeDiscussion.upvotesCount})</span>
              </button>
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Answers &amp; Discussion ({activeDiscussion.replies.length})
            </h4>

            {activeDiscussion.replies.map((rep) => (
              <div
                key={rep.id}
                className={cn(
                  "p-4 rounded-2xl border space-y-2 shadow-xs",
                  rep.isInstructorEndorsed
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-white border-slate-200"
                )}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800">{rep.authorName}</span>
                    {rep.authorRole === "faculty" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-iqra-blue-100 text-iqra-blue-700 border border-iqra-blue-200">
                        Course Instructor
                      </span>
                    )}
                    {rep.isInstructorEndorsed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        <ShieldCheck className="w-3 h-3" />
                        Instructor Verified Solution
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{rep.timeAgo}</span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {rep.content}
                </p>
              </div>
            ))}

            {/* Post Reply Form */}
            <form onSubmit={handlePostReply} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <label className="block text-xs font-semibold text-slate-600">Your Answer</label>
              <textarea
                rows={3}
                required
                placeholder="Write your constructive response or solution..."
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-400 focus:border-transparent resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="h-[34px] px-4 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Answer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Threads List View */
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, questions, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-400 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {["All", "#Assignment", "#Lecture", "#ExamPrep", "#Project", "#General"].map((tg) => (
                <button
                  key={tg}
                  onClick={() => setSelectedTag(tg)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0",
                    selectedTag === tg
                      ? "bg-iqra-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {tg}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Feed */}
          <div className="space-y-3">
            {filteredDiscussions.map((d) => (
              <div
                key={d.id}
                onClick={() => setActiveDiscussion(d)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-iqra-blue-300 hover:shadow-md transition-all cursor-pointer space-y-2.5 shadow-xs group"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-iqra-blue-50 border border-iqra-blue-200 text-iqra-blue-700">
                      {d.courseCode}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">{d.tag}</span>
                    {d.hasInstructorEndorsed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Instructor Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{d.timeAgo}</span>
                </div>

                <h3 className="text-base font-bold text-slate-800 group-hover:text-iqra-blue-700 transition-colors">
                  {d.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {d.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <span>Asked by <strong className="text-slate-600">{d.authorName}</strong></span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {d.upvotesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {d.replyCount} answers
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredDiscussions.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-3">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-400 font-medium">No discussions found for that filter.</p>
                <button
                  onClick={() => { setSelectedTag("All"); setSearchQuery(""); }}
                  className="text-xs text-iqra-blue-600 hover:underline font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                New Course Question
              </span>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                Ask Your Course Cohort &amp; Faculty
              </h3>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-600 mb-1.5 font-semibold text-xs">Question Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to implement Topological Sort in DAGs?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-semibold text-xs">Topic Category</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-iqra-blue-400 focus:border-transparent"
                >
                  <option value="#Lecture">#Lecture (Theoretical Concept)</option>
                  <option value="#Assignment">#Assignment (Coding &amp; Problem Set)</option>
                  <option value="#ExamPrep">#ExamPrep (Midterm / Final Revision)</option>
                  <option value="#Project">#Project (Term Milestone)</option>
                  <option value="#General">#General (Logistics &amp; Textbook)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5 font-semibold text-xs">Elaborate Your Question *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide context, what you have tried, and code snippets or lecture slide references..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-iqra-blue-400 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="h-[34px] px-4 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[34px] px-4 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Question</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
