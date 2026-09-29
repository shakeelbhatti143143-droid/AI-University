"use client";

import React from "react";
import { ShieldCheck, Award, MapPin, Users } from "lucide-react";
import { StatCard, StatItem } from "./StatCard";

const STATS_ITEMS: StatItem[] = [
  {
    id: "charter",
    label: "CHARTER",
    primaryValue: "Federal Government",
    description: "Government of Pakistan",
    icon: ShieldCheck,
  },
  {
    id: "hec-w4",
    label: "HEC W4",
    primaryValue: "Highest Recognition",
    description: "Highest W4 Category",
    icon: Award,
  },
  {
    id: "location",
    label: "LOCATION",
    primaryValue: "Chak Shehzad",
    description: "Park Road, Islamabad",
    icon: MapPin,
  },
  {
    id: "scholars",
    label: "SCHOLARS",
    primaryValue: "15,000+",
    description: "Alumni & Graduates",
    icon: Users,
  },
];

interface UniversityStatsProps {
  className?: string;
}

export const UniversityStats: React.FC<UniversityStatsProps> = ({ className = "" }) => {
  return (
    <div className={`w-full max-w-4xl xl:max-w-5xl ${className}`}>
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {STATS_ITEMS.map((item, index) => (
          <StatCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};
