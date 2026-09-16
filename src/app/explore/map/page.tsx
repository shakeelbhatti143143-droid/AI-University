"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  MapPin,
  ArrowUpRight,
  PhoneCall,
  Clock,
  Building2,
  Bus,
  ShieldCheck,
} from "lucide-react";

export default function UniversityMapPage() {
  const location = useQuery(
    api.website.getUniversityLocation,
    isConvexConfigured ? {} : "skip"
  );

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Map & Location" }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#0b1f3a]" />
            <span>Campus Geography & Access</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900">
            University Location & Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Find driving directions, public transport access, and navigational coordinates for Iqra University Chak Shezad Campus Islamabad.
          </p>
        </div>

        {location?.googleMapsUrl && (
          <a
            href={location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] shadow-md shadow-[#0b1f3a]/20 shrink-0 self-start md:self-auto transition-all"
          >
            <span>Open in Google Maps</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Main Map Container */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 h-96 sm:h-[480px] relative">
        {location?.embedMapUrl ? (
          <iframe
            src={location.embedMapUrl}
            title="University Campus Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50">
            <div className="w-16 h-16 rounded-2xl bg-[#f0f4fa] border border-[#0b1f3a]/20 flex items-center justify-center text-[#0b1f3a] shadow-sm">
              <MapPin className="w-8 h-8 animate-bounce text-[#0b1f3a]" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="font-heading font-black text-lg text-slate-900">
                {location?.campusName || "Chak Shezad Campus Islamabad"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {location?.address || "Park Road, Chak Shezad, Islamabad, 45550, Pakistan"}
              </p>
            </div>
            {location?.googleMapsUrl && (
              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] shadow-xs transition-all"
              >
                <span>Navigate with Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Location Details & Directions Grid */}
      <div id="directions" className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-mt-24">
        {/* Physical Address */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#0b1f3a]" />
            <span>Official Address</span>
          </div>
          <div className="space-y-1 text-xs text-slate-600">
            <p className="font-bold text-slate-900 text-sm">
              {location?.campusName || "Chak Shezad Campus Islamabad"}
            </p>
            <p className="leading-relaxed">
              {location?.address || "Park Road, Chak Shezad, Islamabad, 45550, Federal Capital Area, Pakistan"}
            </p>
            <div className="pt-2 font-mono text-[11px] text-slate-500">
              GPS: {location?.latitude || "33.6766"}° N, {location?.longitude || "73.1388"}° E
            </div>
          </div>
        </div>

        {/* Directions & Transit */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Bus className="w-4 h-4 text-emerald-600" />
            <span>Public Transit & Access</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {location?.directions ||
              "Directly accessible via Park Road, Islamabad Highway, and Kashmir Highway. Metro bus feeder shuttles and university transport buses connect all major sectors of Islamabad and Rawalpindi."}
          </p>
          <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dedicated on-campus student & visitor parking</span>
          </div>
        </div>

        {/* Office Hours & Contact */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3a] uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#0b1f3a]" />
            <span>Campus Visiting Hours</span>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <p className="leading-relaxed">
              {location?.officeHours ||
                "Monday to Friday: 08:30 AM – 04:30 PM (Admissions Information Desk is open on Saturdays from 09:00 AM – 01:00 PM)"}
            </p>
            <div className="pt-1 flex items-center gap-2 text-slate-500">
              <PhoneCall className="w-3.5 h-3.5 text-[#0b1f3a]" />
              <span>{location?.phone || "+92 51 111-264-264"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
