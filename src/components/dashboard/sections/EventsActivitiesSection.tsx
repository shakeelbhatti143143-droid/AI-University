"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Award,
  Sparkles,
  Ticket,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  Share2,
  Trophy,
  PartyPopper,
  QrCode,
  Tag,
  Printer,
  Flame,
} from "lucide-react";
import { CampusEvent, StudentProfile } from "@/lib/dashboard-data";

interface EventsActivitiesSectionProps {
  events: CampusEvent[];
  profile: StudentProfile;
}

export const EventsActivitiesSection: React.FC<EventsActivitiesSectionProps> = ({
  events: initialEventsList,
  profile,
}) => {
  const [events, setEvents] = useState<CampusEvent[]>(initialEventsList);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeView, setActiveView] = useState<"All" | "MyEvents">("All");
  const [registeringEvent, setRegisteringEvent] = useState<CampusEvent | null>(null);
  const [registeredTickets, setRegisteredTickets] = useState<
    Array<{
      eventId: string;
      ticketId: string;
      registeredAt: string;
    }>
  >([]);
  const [activeTicketModal, setActiveTicketModal] = useState<{
    event: CampusEvent;
    ticketId: string;
  } | null>(null);

  // Live Hackathon Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 28,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const target = new Date("2026-10-15T09:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    "All",
    "Hackathon",
    "Seminar",
    "Workshop",
    "Sports",
    "Cultural",
    "Career Fair",
  ];

  const registeredEventIds = new Set(registeredTickets.map((t) => t.eventId));

  const filteredEvents = events.filter((e) => {
    if (activeView === "MyEvents") {
      return registeredEventIds.has(e.id);
    }
    const matchCat =
      selectedCategory === "All" || e.category === selectedCategory;
    return matchCat;
  });

  const handleRegisterConfirm = (event: CampusEvent) => {
    const ticketId = `IU-TKT-${Date.now().toString().slice(-6)}`;
    setRegisteredTickets((prev) => [
      ...prev,
      {
        eventId: event.id,
        ticketId,
        registeredAt: new Date().toLocaleDateString(),
      },
    ]);

    // Update capacity count
    setEvents((prev) =>
      prev.map((item) =>
        item.id === event.id
          ? {
              ...item,
              registeredCount: Math.min(item.capacity, item.registeredCount + 1),
            }
          : item
      )
    );

    // Trigger Festive Confetti Celebration!
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"],
      });
    } catch {
      // safe fallback
    }

    setRegisteringEvent(null);
    setActiveTicketModal({
      event,
      ticketId,
    });
  };

  const featuredEvent = events.find((e) => e.category === "Hackathon") || events[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase flex items-center gap-1">
              <PartyPopper className="w-3 h-3" />
              Campus Life & Activities
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Iqra University Islamabad</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Events, Hackathons & Seminars
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Participate in tech hackathons, industry keynotes, gaming fests, and inter-university competitions.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveView("All")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === "All"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Explore Events ({events.length})
          </button>
          <button
            onClick={() => setActiveView("MyEvents")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === "MyEvents"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-amber-600" />
            My Passes ({registeredTickets.length})
          </button>
        </div>
      </div>

      {/* Featured Flagship Event Hero Card (When in All view) */}
      {activeView === "All" && featuredEvent && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-7 sm:p-9 shadow-xl border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                Flagship Campus Hackathon
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-600 fill-red-600" />
                PKR 500,000 Prizes
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-heading leading-tight tracking-tight">
              {featuredEvent.title}
            </h3>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed line-clamp-3">
              {featuredEvent.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-white/90 pt-1">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Calendar className="w-3.5 h-3.5 text-yellow-300" />
                {featuredEvent.date}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Clock className="w-3.5 h-3.5 text-yellow-300" />
                {featuredEvent.time}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <MapPin className="w-3.5 h-3.5 text-yellow-300" />
                {featuredEvent.venue}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              {registeredEventIds.has(featuredEvent.id) ? (
                <div className="px-5 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  Pass Confirmed
                </div>
              ) : (
                <button
                  onClick={() => setRegisteringEvent(featuredEvent)}
                  className="px-6 py-3 rounded-2xl bg-white text-indigo-900 font-extrabold text-xs hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-indigo-700" />
                  Claim Free Student Pass
                </button>
              )}
              <span className="text-xs text-white/80 font-semibold">
                {featuredEvent.capacity - featuredEvent.registeredCount} spots remaining
              </span>
            </div>
          </div>

          {/* Dynamic Live Hackathon Countdown Clock */}
          <div className="relative z-10 w-full lg:w-auto bg-black/25 backdrop-blur-md rounded-3xl p-5 border border-white/15 space-y-3 text-center shrink-0 shadow-inner">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold text-xs">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} />
              <span>HACKATHON LAUNCH COUNTDOWN</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                <div className="text-2xl font-black font-mono text-yellow-300">{timeLeft.days}</div>
                <div className="text-[10px] uppercase font-bold text-blue-200">Days</div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                <div className="text-2xl font-black font-mono text-yellow-300">
                  {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
                </div>
                <div className="text-[10px] uppercase font-bold text-blue-200">Hours</div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                <div className="text-2xl font-black font-mono text-yellow-300">
                  {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
                </div>
                <div className="text-[10px] uppercase font-bold text-blue-200">Mins</div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                <div className="text-2xl font-black font-mono text-yellow-300">
                  {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                </div>
                <div className="text-[10px] uppercase font-bold text-blue-200">Secs</div>
              </div>
            </div>

            <p className="text-[11px] text-blue-200/80">
              Chak Shehzad Computing Labs • 36h Sprint
            </p>
          </div>
        </div>
      )}

      {/* Categories Filter (When in All view) */}
      {activeView === "All" && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {activeView === "MyEvents" ? "No Registered Passes Yet" : "No Events Found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {activeView === "MyEvents"
              ? "You haven't reserved tickets for any upcoming events yet. Explore upcoming hackathons and claim your free pass."
              : "No events match this category right now. Check back soon for fresh campus happenings."}
          </p>
          {activeView === "MyEvents" && (
            <button
              onClick={() => setActiveView("All")}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-all"
            >
              Browse All Events
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const isRegistered = registeredEventIds.has(evt.id);
            const userTicket = registeredTickets.find((t) => t.eventId === evt.id);
            const spotsLeft = Math.max(0, evt.capacity - evt.registeredCount);

            return (
              <div
                key={evt.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {evt.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-50 text-amber-700">
                      {spotsLeft} spots left
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  {/* Logistics Meta */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{evt.date}</span>
                      <span className="text-slate-400">•</span>
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-500">By {evt.organizer}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {evt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-blue-50 text-blue-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-slate-100">
                  {isRegistered ? (
                    <button
                      onClick={() =>
                        setActiveTicketModal({
                          event: evt,
                          ticketId: userTicket?.ticketId || "IU-TKT-PASS",
                        })
                      }
                      className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      View Digital Pass ({userTicket?.ticketId})
                    </button>
                  ) : (
                    <button
                      onClick={() => setRegisteringEvent(evt)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      Reserve Pass (Free)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register Confirmation Modal */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 uppercase">
                  Confirm RSVP
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {registeringEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setRegisteringEvent(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <p className="font-semibold text-slate-700">Student Pass Details:</p>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Name</span>
                  <span className="font-bold text-slate-800">{profile.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Student ID</span>
                  <span className="font-bold text-slate-800">{profile.studentId}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                  <span className="font-medium text-slate-800">{profile.email}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              By confirming, your campus admission ticket will be generated with a verifiable check-in code. Attendance will be recorded for campus credit.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRegisteringEvent(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRegisterConfirm(registeringEvent)}
                className="flex-1 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-xs"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Ticket Pass Modal */}
      {activeTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 text-center overflow-hidden">
            {/* Holographic Top Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -mx-6 -mt-6 p-4 text-white text-center">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-yellow-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL CAMPUS ADMISSION PASS</span>
              </div>
              <h3 className="text-sm font-black text-white mt-1 leading-snug truncate px-2">
                {activeTicketModal.event.title}
              </h3>
            </div>

            <div className="pt-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-200">
                ✓ Verified Student Registration
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Pass ID: <span className="font-mono font-bold text-slate-800">{activeTicketModal.ticketId}</span>
              </p>
            </div>

            {/* Perforated Divider Line with Authentic Notches */}
            <div className="relative py-2 -mx-6">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-6 h-6 rounded-full bg-black/60" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-6 h-6 rounded-full bg-black/60" />
              <div className="w-full border-t-2 border-dashed border-slate-300" />
            </div>

            {/* Scannable QR Code Canvas */}
            <div className="p-4 bg-slate-950 rounded-2xl text-white space-y-2.5 shadow-md">
              <div className="w-36 h-36 bg-white rounded-2xl mx-auto flex items-center justify-center p-2.5 shadow-inner">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <p className="text-[10px] text-amber-400 font-mono uppercase tracking-widest">
                • Present at Turnstile Gate •
              </p>
            </div>

            {/* Pass Attendee Info Card */}
            <div className="text-xs text-slate-600 space-y-1 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-slate-800">{activeTicketModal.event.date} ({activeTicketModal.event.time})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Venue:</span>
                <span className="font-bold text-slate-800">{activeTicketModal.event.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Attendee:</span>
                <span className="font-bold text-slate-800">{profile.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
              <button
                onClick={() => setActiveTicketModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
