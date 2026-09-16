"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  Globe,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Share2,
} from "lucide-react";

export default function ContactUniversityPage() {
  const profile = useQuery(api.website.getUniversityProfile, isConvexConfigured ? {} : "skip");
  const location = useQuery(api.website.getUniversityLocation, isConvexConfigured ? {} : "skip");

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Admissions Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Contact Directory" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <PhoneCall className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Admissions & Inquiries</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            Contact AI University
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Connect with our admissions counsellors, registrar office, and academic departments at Chak Shezad Campus Islamabad.
          </p>
        </div>

        <Link
          href="/apply"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] shadow-md shadow-[#0b1f3a]/20 shrink-0 self-start md:self-auto transition-all"
        >
          <span>Apply Online for 2026</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Telephone & Helplines */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#0b1f3a]/40 transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-black text-base text-slate-900">Helpline & Telephone</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Admissions UAN:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {profile?.helpline || "+92 51 111-264-264"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus Exchange:</span>
              <span className="font-mono text-slate-700">
                {profile?.phone || "+92 51 111-264-636"}
              </span>
            </div>
          </div>
        </div>

        {/* Email Directory */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#0b1f3a]/40 transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-black text-base text-slate-900">Official Email Channels</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Admissions Office:</span>
              <a
                href={`mailto:${profile?.admissionsEmail || "admissions@isb.iqra.edu.pk"}`}
                className="text-[#0b1f3a] hover:text-[#122b4e] font-semibold transition-colors"
              >
                {profile?.admissionsEmail || "admissions@isb.iqra.edu.pk"}
              </a>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">General Inquiries:</span>
              <a
                href={`mailto:${profile?.email || "info@isb.iqra.edu.pk"}`}
                className="text-[#0b1f3a] hover:text-[#122b4e] font-semibold transition-colors"
              >
                {profile?.email || "info@isb.iqra.edu.pk"}
              </a>
            </div>
          </div>
        </div>

        {/* Visiting Address & Hours */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#0b1f3a]/40 transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-black text-base text-slate-900">Campus Venue</h3>
          <div className="space-y-1 text-xs text-slate-600">
            <p className="leading-relaxed">
              {location?.address || "Park Road, Chak Shezad, Islamabad, 45550, Pakistan"}
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-medium">
              Visiting: {location?.officeHours || "Mon – Fri: 08:30 AM – 04:30 PM"}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form & Social Media */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inquiry Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-xl text-slate-900">
              Send an Official Admissions Inquiry
            </h3>
            <p className="text-xs text-slate-500">
              Submit your inquiry and our academic counsellors will contact you via email.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Inquiry Received</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for contacting Iqra University Chak Shezad Campus. An admissions counsellor will get back to you shortly.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0b1f3a] text-white hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 transition-all"
                  >
                    <option value="Admissions Inquiry">Admissions Inquiry</option>
                    <option value="Fee Structure Inquiry">Fee Structure Inquiry</option>
                    <option value="Degree Program Details">Degree Program Details</option>
                    <option value="Campus Visit Appointment">Campus Visit Appointment</option>
                    <option value="General Information">General Information</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ask your question or request guidance regarding admission eligibility, programs, or campus visits..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/15 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] shadow-md shadow-[#0b1f3a]/20 transition-all cursor-pointer"
              >
                <span>Submit Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Social Media & Key Office Links */}
        <div id="social" className="space-y-6 scroll-mt-24">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">
              Connect With Us
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Follow official university social channels for campus photos, tech news, live seminars, and event reels.
            </p>

            <div className="space-y-2 pt-2">
              {[
                { name: "LinkedIn", href: profile?.socialLinks?.linkedin || "https://linkedin.com", color: "hover:text-sky-600" },
                { name: "Facebook", href: profile?.socialLinks?.facebook || "https://facebook.com", color: "hover:text-blue-600" },
                { name: "Instagram", href: profile?.socialLinks?.instagram || "https://instagram.com", color: "hover:text-rose-600" },
                { name: "YouTube", href: profile?.socialLinks?.youtube || "https://youtube.com", color: "hover:text-red-600" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-[#f0f4fa] hover:border-[#0b1f3a]/30 border border-slate-200/80 text-xs text-slate-700 transition-colors ${s.color}`}
                >
                  <span className="font-semibold">{s.name}</span>
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
