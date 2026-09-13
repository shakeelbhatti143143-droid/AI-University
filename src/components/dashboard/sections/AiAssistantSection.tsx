"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Layers,
} from "lucide-react";
import {
  StudentProfile,
  EnrolledCourse,
  Examination,
  Assignment,
  ChatMessage,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface AiAssistantSectionProps {
  profile: StudentProfile;
  courses: EnrolledCourse[];
  examinations: Examination[];
  assignments: Assignment[];
}

export const AiAssistantSection: React.FC<AiAssistantSectionProps> = ({
  profile,
  courses,
  examinations,
  assignments,
}) => {
  // Initial greeting message
  const initialMessages: ChatMessage[] = [
    {
      id: "msg-welcome",
      sender: "assistant",
      timestamp: "Just now",
      text: `Hello **${profile.name}**! 👋

I am your **Iqra University AI Assistant** for the **Chak Shehzad Campus**. I have direct, secure access to your academic profile, enrolled subjects, exam timetables, and assignment deadlines.

How can I help you today? You can select any quick question below or ask me anything directly.`,
      suggestions: [
        "What is my CGPA?",
        "Show my upcoming exams",
        "What classes do I have today?",
        "Explain my academic performance",
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Quick Action questions
  const quickActions = [
    "What is my CGPA?",
    "Show my upcoming exams",
    "What classes do I have today?",
    "Explain my academic performance",
    "Create a study plan",
    "Show my weak subjects",
    "How many credits have I completed?",
    "What assignments are due?",
  ];

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: {
            studentProfile: {
              name: profile.name,
              studentId: profile.studentId,
              program: profile.program,
              currentSemester: profile.currentSemester,
              academicSession: profile.academicSession,
              cgpa: profile.cgpa,
              currentGpa: profile.currentGpa,
              completedCreditHours: profile.completedCreditHours,
              totalCreditHours: profile.totalCreditHours,
              academicStanding: profile.academicStanding,
            },
            enrolledCourses: courses.map((c) => ({
              code: c.code,
              title: c.title,
              instructor: c.instructor.name,
              schedule: c.schedule,
              classroom: c.classroom,
              progress: c.progress,
              attendancePercentage: c.attendancePercentage,
              currentGrade: c.currentGrade,
            })),
            upcomingExams: examinations.map((e) => ({
              courseCode: e.courseCode,
              courseTitle: e.courseTitle,
              examType: e.examType,
              date: e.date,
              time: e.time,
              room: e.room,
              seatNumber: e.seatNumber,
            })),
            assignments: assignments.map((a) => ({
              title: a.title,
              courseCode: a.courseCode,
              dueDate: a.dueDate,
              status: a.status,
              priority: a.priority,
            })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: data.reply || "I have processed your request.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("AI chat error:", err);
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "assistant",
        text:
          "I apologize, but I encountered a momentary connection issue. Please verify your connection or try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Clear conversation
  const handleClearChat = () => {
    setMessages(initialMessages);
  };

  // Copy message text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple markdown renderer for AI responses
  const renderFormattedText = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-bold text-slate-900 text-sm mt-2 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      // Blockquote
      if (line.startsWith("> ")) {
        return (
          <div
            key={idx}
            className="p-2.5 my-2 rounded-xl bg-blue-50/70 border-l-4 border-iqra-blue-600 text-slate-700 text-xs"
          >
            {line.replace("> ", "")}
          </div>
        );
      }
      // Bullet list item
      if (line.startsWith("* ") || line.startsWith("- ")) {
        const itemText = line.replace(/^[\*\-]\s+/, "");
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1 text-xs text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-iqra-blue-600 mt-1.5 shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: formatInline(itemText) }} />
          </div>
        );
      }
      // Numbered list item
      if (/^\d+\.\s+/.test(line)) {
        return (
          <div key={idx} className="my-1.5 pl-1 text-xs text-slate-800">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Normal paragraph
      return (
        <p
          key={idx}
          className="text-xs text-slate-800 leading-relaxed my-0.5"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    });
  };

  // Helper for bold and inline code
  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-slate-900'>$1</strong>")
      .replace(/`([^`]+)`/g, "<code class='px-1.5 py-0.5 bg-slate-100 rounded text-iqra-blue-800 font-mono text-[11px]'>$1</code>");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#050e1d] via-[#0a192f] to-[#1a103c] border border-slate-800 text-white shadow-xl shadow-slate-950/20">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Iqra University Artificial Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            AI University Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Chak Shehzad Campus • Intelligently grounded in your live student portal data
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
            title="Reset conversation"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* 2. CHAT CONTAINER */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Chat Header Status */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-purple-900/20">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">IU Campus AI Copilot</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Authorized for: {profile.name} ({profile.studentId})
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Session • Student Privacy Protected</span>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-[#fafafa]/50">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3 max-w-3xl",
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs mt-1",
                    isUser
                      ? "bg-iqra-navy-900 text-white"
                      : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                  )}
                >
                  {isUser ? (
                    profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1.5 min-w-0">
                  <div
                    className={cn(
                      "p-4 rounded-2xl text-xs shadow-xs relative group",
                      isUser
                        ? "bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white rounded-tr-none"
                        : "bg-white border border-slate-200/90 text-slate-900 rounded-tl-none"
                    )}
                  >
                    {isUser ? (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="space-y-1">{renderFormattedText(msg.text)}</div>
                    )}

                    {/* Copy action on assistant message */}
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Timestamp & Suggestions */}
                  <div
                    className={cn(
                      "flex items-center gap-2 text-[10px] text-slate-400 px-1",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Optional message suggestion chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(sug)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200/90 text-[11px] font-semibold text-iqra-blue-700 transition-colors shadow-2xs flex items-center gap-1"
                        >
                          <span>{sug}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-iqra-blue-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-white border border-slate-200/90 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-iqra-blue-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 font-medium ml-2">
                  Searching campus records...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Buttons Bar */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/70 overflow-x-auto flex items-center gap-1.5 custom-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2 shrink-0">
            Quick Actions:
          </span>
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => handleSendMessage(action)}
              disabled={isLoading}
              className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your courses, schedule, CGPA, exams, or study plan..."
                disabled={isLoading}
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-iqra-blue-700 hover:from-purple-500 hover:to-iqra-blue-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-900/20 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
