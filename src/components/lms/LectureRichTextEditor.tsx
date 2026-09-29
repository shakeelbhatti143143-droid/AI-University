"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Quote,
  Eye,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LectureRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  required?: boolean;
}

export const LectureRichTextEditor: React.FC<LectureRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write detailed lecture notes, syllabus breakdown, or learning outcomes...",
  rows = 4,
  label,
  required = false,
}) => {
  const [activeMode, setActiveMode] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const applyFormatting = (prefix: string, suffix = "", defaultText = "text") => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;
    const nextVal = value.substring(0, start) + replacement + value.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  const handleAddLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (!url) return;
    applyFormatting("[", `](${url})`, "Link Title");
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveMode("edit")}
              className={cn(
                "px-2 py-0.5 rounded-md transition-colors flex items-center gap-1",
                activeMode === "edit"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("preview")}
              className={cn(
                "px-2 py-0.5 rounded-md transition-colors flex items-center gap-1",
                activeMode === "preview"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
        {/* TOOLBAR */}
        <div className="p-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center flex-wrap gap-0.5 text-slate-600 dark:text-slate-300 text-xs">
          <button
            type="button"
            onClick={() => applyFormatting("**", "**", "bold text")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting("*", "*", "italic text")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => applyFormatting("\n## ", "\n", "Heading")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting("\n### ", "\n", "Subheading")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => applyFormatting("\n- ", "\n", "List item")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Bulleted List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting("\n1. ", "\n", "Numbered item")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => applyFormatting("\n> ", "\n", "Quote")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting("\n```\n", "\n```\n", "code block")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Code Block"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleAddLink}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Add Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* INPUT OR PREVIEW */}
        {activeMode === "edit" ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 text-xs font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 border-none focus:outline-none custom-scrollbar leading-relaxed resize-y"
          />
        ) : (
          <div className="p-3 min-h-[100px] bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            <LectureContentRenderer content={value} />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * XSS-Safe, responsive formatted content renderer for students
 */
export const LectureContentRenderer: React.FC<{ content: string; className?: string }> = ({
  content,
  className,
}) => {
  if (!content) {
    return <p className="text-slate-400 italic text-xs">No lecture notes provided.</p>;
  }

  // Parse lines into simple structured markdown elements
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];

  const formatInlineText = (text: string) => {
    // Simple regex replacements for bold, italic, code, and link
    const parts: React.ReactNode[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderBoldAndItalics(text.substring(lastIndex, match.index)));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      const isSafe = linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("/");
      parts.push(
        isSafe ? (
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            {linkText}
          </a>
        ) : (
          linkText
        )
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(renderBoldAndItalics(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderBoldAndItalics = (text: string): React.ReactNode => {
    // Handle **bold** and *italic*
    const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return segments.map((seg, i) => {
      if (seg.startsWith("**") && seg.endsWith("**")) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{seg.slice(2, -2)}</strong>;
      }
      if (seg.startsWith("*") && seg.endsWith("*")) {
        return <em key={i} className="italic text-slate-800 dark:text-slate-200">{seg.slice(1, -1)}</em>;
      }
      if (seg.startsWith("`") && seg.endsWith("`")) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-300 font-mono text-[11px]">
            {seg.slice(1, -1)}
          </code>
        );
      }
      return seg;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${idx}`}
            className="p-3 my-2 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800"
          >
            <code>{codeBlockBuffer.join("\n")}</code>
          </pre>
        );
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={idx} className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2 mb-1">
          {formatInlineText(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={idx} className="font-black text-base text-slate-900 dark:text-white mt-3 mb-1 border-b border-slate-200 dark:border-slate-800 pb-1">
          {formatInlineText(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300 my-0.5">
          {formatInlineText(trimmed.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <li key={idx} className="ml-4 list-decimal text-slate-700 dark:text-slate-300 my-0.5">
          {formatInlineText(trimmed.replace(/^\d+\.\s/, ""))}
        </li>
      );
    } else if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={idx}
          className="border-l-4 border-blue-500 pl-3 my-1.5 italic text-slate-600 dark:text-slate-300"
        >
          {formatInlineText(trimmed.slice(2))}
        </blockquote>
      );
    } else if (trimmed === "") {
      elements.push(<div key={idx} className="h-1.5" />);
    } else {
      elements.push(
        <p key={idx} className="text-slate-700 dark:text-slate-300 my-1 leading-relaxed">
          {formatInlineText(line)}
        </p>
      );
    }
  });

  return <div className={cn("space-y-0.5", className)}>{elements}</div>;
};
