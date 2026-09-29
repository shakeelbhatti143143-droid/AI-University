"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  FileText,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
  downloadUrl?: string;
  fileSize?: number;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title,
  downloadUrl,
  fileSize,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        else onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  if (!isOpen || !pdfUrl) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(50, prev - 25));
  const handleResetZoom = () => setZoomLevel(100);

  const finalDownloadUrl = downloadUrl || pdfUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={cn(
          "bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
          isFullscreen
            ? "w-screen h-screen fixed inset-0 rounded-none border-none"
            : "w-full max-w-5xl h-[92vh]"
        )}
      >
        {/* TOP TOOLBAR */}
        <header className="px-4 py-3 bg-[#0B1528] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">{title}</h3>
              <p className="text-[10px] text-slate-400">PDF Reader • Embedded Educational Document</p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 text-cyan-300 font-bold">{zoomLevel}%</span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Download Button */}
            <a
              href={finalDownloadUrl}
              download={title}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Close PDF"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* EMBEDDED PDF VIEWER CANVAS */}
        <div className="flex-1 bg-[#1a1f2c] overflow-auto flex items-center justify-center p-2 relative">
          <div
            className="w-full h-full transition-transform duration-150 origin-top flex items-center justify-center"
            style={{ transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1`}
              title={title}
              className="w-full h-full rounded-xl bg-white border border-slate-800 shadow-xl"
            />
          </div>
        </div>

        {/* FOOTER */}
        <footer className="px-4 py-2 bg-[#0B1528] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Scroll to navigate pages • Pinch or use +/- to zoom</span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open in External Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </footer>
      </div>
    </div>
  );
};
