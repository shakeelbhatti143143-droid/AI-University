"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function UniversityEventsPage() {
  const [tab, setTab] = useState<"upcoming" | "all">("upcoming");

  const events = useQuery(
    api.website.getPublishedEvents,
    isConvexConfigured ? { upcomingOnly: tab === "upcoming" } : "skip"
  );

  const isLoading = events === undefined;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Events & Calendar" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Campus Engagement</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            University Events & Seminars
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Participate in distinguished guest speaker sessions, artificial intelligence workshops, hackathons, job fairs, and cultural festivities.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setTab("upcoming")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === "upcoming"
                ? "bg-[#0b1f3a] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa]"
            }`}
          >
            Upcoming Events
          </button>
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === "all"
                ? "bg-[#0b1f3a] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0b1f3a] hover:bg-[#f0f4fa]"
            }`}
          >
            All Scheduled Events
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-3 shadow-xs"
            >
              <div className="h-4 w-1/3 rounded bg-slate-100" />
              <div className="h-6 w-3/4 rounded bg-slate-200" />
              <div className="h-16 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && events.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 max-w-md mx-auto shadow-xs">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Events Scheduled</h3>
          <p className="text-xs text-slate-500">
            {tab === "upcoming"
              ? "There are currently no upcoming events on the campus calendar. Check back soon!"
              : "No events recorded in the system."}
          </p>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="p-6 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md group hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                {event.imageUrl && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 font-bold uppercase tracking-wider">
                    {event.category}
                  </span>
                  {event.isFeatured && (
                    <span className="text-[10px] font-bold text-[#0b1f3a] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#0b1f3a]" /> Featured
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-black text-lg text-slate-900 group-hover:text-[#0b1f3a] transition-colors">
                  {event.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#0b1f3a] shrink-0" />
                    <span className="font-mono font-bold text-slate-800">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {event.organizer || "AI University"}
                </span>

                {event.registrationUrl ? (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] shadow-xs transition-all"
                  >
                    <span>Register</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Open to All
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
