"use client";

import React, { useState, useMemo } from "react";
import {
  BrainCircuit,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  Flame,
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  AlertCircle,
  X,
  ChevronRight,
  Filter,
  Check,
  CalendarDays,
  Zap,
} from "lucide-react";
import {
  StudyPlan,
  StudyTask,
  StudyTaskType,
  EnrolledCourse,
  Examination,
  Assignment,
  initialStudyPlans,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface AiStudyPlannerSectionProps {
  enrolledCourses: EnrolledCourse[];
  upcomingExaminations: Examination[];
  assignments: Assignment[];
}

export const AiStudyPlannerSection: React.FC<AiStudyPlannerSectionProps> = ({
  enrolledCourses,
  upcomingExaminations,
  assignments,
}) => {
  const [plans, setPlans] = useState<StudyPlan[]>(initialStudyPlans);
  const [activePlanId, setActivePlanId] = useState<string>(
    initialStudyPlans[0]?.id || ""
  );

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);

  // Create Plan Form state
  const [selectedCourseCode, setSelectedCourseCode] = useState(
    enrolledCourses[0]?.code || "CS-201"
  );
  const [examDate, setExamDate] = useState("2026-09-22");
  const [dailyHours, setDailyHours] = useState(3);
  const [preferredDuration, setPreferredDuration] = useState(45);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Very Hard">("Hard");
  const [topicsInput, setTopicsInput] = useState(
    "Trees & Binary Search Trees\nGraph Traversals (BFS, DFS)\nSorting & Searching Algorithms\nHash Tables & Collisions\nDynamic Programming Fundamentals"
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // New Custom Task Form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTopic, setNewTaskTopic] = useState("");
  const [newTaskType, setNewTaskType] = useState<StudyTaskType>("Practice Problems");
  const [newTaskDuration, setNewTaskDuration] = useState(60);
  const [newTaskDate, setNewTaskDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Currently active plan
  const activePlan = useMemo(() => {
    return plans.find((p) => p.id === activePlanId) || plans[0] || null;
  }, [plans, activePlanId]);

  // Calculations for progress & streak
  const totalTasks = activePlan?.tasks?.length || 0;
  const completedTasks = activePlan?.tasks?.filter((t) => t.completed).length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const studyStreakDays = 5; // Current active streak

  // Total planned study hours
  const totalStudyHours = activePlan?.tasks?.reduce((acc, t) => acc + t.durationMinutes / 60, 0) || 0;
  const completedStudyHours =
    activePlan?.tasks?.filter((t) => t.completed).reduce((acc, t) => acc + t.durationMinutes / 60, 0) || 0;

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === activePlanId) {
          return {
            ...plan,
            tasks: plan.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          };
        }
        return plan;
      })
    );
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === activePlanId) {
          return {
            ...plan,
            tasks: plan.tasks.filter((t) => t.id !== taskId),
          };
        }
        return plan;
      })
    );
  };

  // Add Custom Task
  const handleAddCustomTask = () => {
    if (!newTaskTitle.trim() || !activePlan) return;

    const newTask: StudyTask = {
      id: `task-custom-${Date.now()}`,
      planId: activePlan.id,
      dayNumber: activePlan.tasks.length + 1,
      dayLabel: `Day ${activePlan.tasks.length + 1}`,
      title: newTaskTitle,
      topic: newTaskTopic || "Self Study",
      taskType: newTaskType,
      durationMinutes: newTaskDuration,
      completed: false,
      scheduledDate: newTaskDate,
      notes: "Custom study session added by student.",
    };

    setPlans((prev) =>
      prev.map((p) => (p.id === activePlan.id ? { ...p, tasks: [...p.tasks, newTask] } : p))
    );

    setNewTaskTitle("");
    setNewTaskTopic("");
    setIsAddTaskModalOpen(false);
  };

  // Generate New Plan via API
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    const selectedCourse = enrolledCourses.find((c) => c.code === selectedCourseCode);
    const courseTitle = selectedCourse ? selectedCourse.title : "Computer Science Course";

    const parsedTopics = topicsInput
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch("/api/ai/study-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode: selectedCourseCode,
          courseTitle,
          examDate,
          availableHoursPerDay: dailyHours,
          preferredDurationMinutes: preferredDuration,
          difficulty,
          topics: parsedTopics,
        }),
      });

      if (!res.ok) throw new Error("API call failed");

      const data = await res.json();
      if (data.plan) {
        setPlans((prev) => [data.plan, ...prev]);
        setActivePlanId(data.plan.id);
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      console.warn("Generating plan offline fallback:", err);
      // Offline fallback plan
      const fallbackPlan: StudyPlan = {
        id: `plan-gen-${Date.now()}`,
        courseCode: selectedCourseCode,
        courseTitle,
        examDate,
        availableHoursPerDay: dailyHours,
        preferredDurationMinutes: preferredDuration,
        difficulty,
        topics: parsedTopics,
        createdAt: new Date().toISOString().split("T")[0],
        totalHours: parsedTopics.length * dailyHours,
        tasks: parsedTopics.map((top, idx) => ({
          id: `task-gen-${Date.now()}-${idx}`,
          planId: `plan-gen-${Date.now()}`,
          dayNumber: idx + 1,
          dayLabel: `Day ${idx + 1}`,
          title: `Mastery Session: ${top}`,
          topic: top,
          taskType: idx === parsedTopics.length - 1 ? "Mock Examination" : "Practice Problems",
          durationMinutes: dailyHours * 60,
          completed: false,
          scheduledDate: examDate,
        })),
      };

      setPlans((prev) => [fallbackPlan, ...prev]);
      setActivePlanId(fallbackPlan.id);
      setIsCreateModalOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#050e1d] via-[#0a192f] to-[#122822] border border-slate-800 text-white shadow-xl shadow-slate-950/20">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Automated Revision & Task Scheduler</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            AI Study Planner & Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Personalized exam preparation roadmaps calibrated to your course syllabus & deadlines
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/30"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Create New Study Plan</span>
          </button>
        </div>
      </div>

      {/* 2. PLANNER KPI METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {/* Progress % */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Plan Progress</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black font-heading text-emerald-600">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Study Streak */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Study Streak</span>
          <div className="flex items-center gap-1.5 text-amber-600 mt-1">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
            <span className="text-2xl font-black font-heading text-slate-900">
              {studyStreakDays} Days
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            Consistent Daily Focus
          </span>
        </div>

        {/* Tasks Completed vs Total */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Tasks Completed</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-heading text-slate-900">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ {totalTasks} Tasks</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            {totalTasks - completedTasks} Tasks Remaining
          </span>
        </div>

        {/* Study Hours Tracker */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Hours Logged</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-heading text-iqra-blue-700">
              {completedStudyHours.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ {totalStudyHours.toFixed(1)}h</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Target: {activePlan?.availableHoursPerDay || 3} hrs/day
          </span>
        </div>

        {/* Target Exam Date */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Exam Date</span>
          <span className="text-sm font-black text-slate-900 block mt-1">
            {activePlan?.examDate || "Sept 22, 2026"}
          </span>
          <span className="text-[10px] text-rose-600 font-bold block">
            Midterm Term Exam
          </span>
        </div>
      </div>

      {/* 3. ACTIVE PLAN SELECTOR TABS & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] font-bold uppercase text-slate-400 px-2 shrink-0">
            Study Plans:
          </span>
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlanId(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2",
                activePlanId === p.id
                  ? "bg-iqra-navy-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <span>{p.courseCode}</span>
              <span className="text-[10px] opacity-75 font-normal truncate max-w-[120px]">
                {p.courseTitle}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Task</span>
          </button>
        </div>
      </div>

      {/* 4. STRUCTURED MULTI-DAY PLANNER VIEW */}
      {!activePlan || activePlan.tasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Study Plan Created</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first AI-powered study plan to automatically generate daily study sessions.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-iqra-navy-900 text-white text-xs font-bold shadow-md hover:bg-iqra-navy-800"
          >
            Create Study Plan
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-100 text-iqra-blue-800">
                  {activePlan.courseCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                  Difficulty: {activePlan.difficulty}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  Target Exam: {activePlan.examDate}
                </span>
              </div>
              <h2 className="text-xl font-black font-heading text-slate-900">
                {activePlan.courseTitle} — Detailed Study Schedule
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>
                {completedTasks} of {totalTasks} Tasks Finished
              </span>
            </div>
          </div>

          {/* List of Tasks Grouped by Day */}
          <div className="space-y-3">
            {activePlan.tasks.map((task) => {
              return (
                <div
                  key={task.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group",
                    task.completed
                      ? "bg-slate-50/70 border-slate-200 opacity-75"
                      : "bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-950/5"
                  )}
                >
                  {/* Left: Checkbox + Title + Topic */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={task.completed ? "Mark Incomplete" : "Mark Complete"}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                          {task.dayLabel}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            task.taskType === "Practice Problems"
                              ? "bg-blue-100 text-blue-800"
                              : task.taskType === "Mock Examination"
                              ? "bg-rose-100 text-rose-800"
                              : task.taskType === "Revise Weak Areas"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-emerald-100 text-emerald-800"
                          )}
                        >
                          {task.taskType}
                        </span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {task.scheduledDate}
                        </span>
                      </div>

                      <h4
                        className={cn(
                          "text-sm font-bold transition-colors",
                          task.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-900 group-hover:text-emerald-700"
                        )}
                      >
                        {task.title}
                      </h4>

                      {task.notes && (
                        <p className="text-xs text-slate-500 line-clamp-1">{task.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Duration & Actions */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.durationMinutes} mins</span>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. CREATE STUDY PLAN MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-slate-900">
                    Create AI Study Plan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auto-generate daily milestones tailored to your exam date
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Course Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Course / Subject</label>
              <select
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {enrolledCourses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Date & Daily Hours */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Target Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Daily Study Hours</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Perceived Difficulty</label>
              <div className="grid grid-cols-4 gap-2">
                {(["Easy", "Medium", "Hard", "Very Hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={cn(
                      "py-2 rounded-xl text-xs font-bold border transition-colors",
                      difficulty === diff
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Key Topics (One topic per line)
                </label>
                <span className="text-[10px] text-slate-400">Autofilled from syllabus</span>
              </div>
              <textarea
                rows={4}
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                placeholder="Enter syllabus topics..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed custom-scrollbar"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Schedule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADD CUSTOM TASK MODAL */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black font-heading text-slate-900">
                Add Custom Study Task
              </h3>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Task Title</label>
              <input
                type="text"
                placeholder="e.g. Review past midterm question 3"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Topic / Category</label>
              <input
                type="text"
                placeholder="e.g. Trees & BST"
                value={newTaskTopic}
                onChange={(e) => setNewTaskTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Task Type</label>
                <select
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value as StudyTaskType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Read Topic">Read Topic</option>
                  <option value="Watch Learning Material">Watch Learning Material</option>
                  <option value="Practice Problems">Practice Problems</option>
                  <option value="Review Notes">Review Notes</option>
                  <option value="Take Quiz">Take Quiz</option>
                  <option value="Revise Weak Areas">Revise Weak Areas</option>
                  <option value="Mock Examination">Mock Examination</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Estimated Duration</label>
                <select
                  value={newTaskDuration}
                  onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={90}>1.5 Hours</option>
                  <option value={120}>2 Hours</option>
                  <option value={180}>3 Hours</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddTaskModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomTask}
                disabled={!newTaskTitle.trim()}
                className="px-5 py-2 rounded-xl bg-iqra-navy-900 text-white text-xs font-bold hover:bg-iqra-navy-800 disabled:opacity-50"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
