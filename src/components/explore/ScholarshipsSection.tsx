"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { useAuth } from "@/lib/auth-context";
import {
  calculateScholarship,
  StudentScholarshipResult,
} from "@/lib/scholarship";
import {
  Award,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  SlidersHorizontal,
  RotateCcw,
  LogIn,
  Info,
  BookOpen,
  TrendingUp,
  Building2,
  ArrowUpRight,
  ChevronRight,
  BadgePercent,
  CircleDollarSign,
  Trophy,
  LockKeyhole,
  Database,
} from "lucide-react";

interface ScholarshipsSectionProps {
  id?: string;
  className?: string;
  showFullBreadcrumbs?: boolean;
}

const SCHOLARSHIP_TIER_CARDS = [
  {
    tierId: "bronze",
    percentage: "20%",
    percentageNum: 20,
    cgpaRange: "3.50 – 3.74",
    title: "20% Scholarship",
    badgeLabel: "Bronze Merit",
    description:
      "Academic achievement scholarship for students maintaining a CGPA within this range.",
    icon: BookOpen,
    gradient: "from-indigo-500/15 via-indigo-400/5 to-transparent",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600",
    badge:
      "bg-indigo-50 text-indigo-700 border-indigo-200",
    accent: "bg-indigo-500",
    active:
      "ring-2 ring-indigo-400/60 border-indigo-300 shadow-[0_18px_50px_rgba(99,102,241,0.15)]",
  },
  {
    tierId: "silver",
    percentage: "40%",
    percentageNum: 40,
    cgpaRange: "3.75 – 3.89",
    title: "40% Scholarship",
    badgeLabel: "Silver Merit",
    description:
      "Higher academic performance qualifies the student for increased tuition support.",
    icon: Sparkles,
    gradient: "from-sky-500/15 via-sky-400/5 to-transparent",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-600",
    badge:
      "bg-sky-50 text-sky-700 border-sky-200",
    accent: "bg-sky-500",
    active:
      "ring-2 ring-sky-400/60 border-sky-300 shadow-[0_18px_50px_rgba(14,165,233,0.15)]",
  },
  {
    tierId: "gold",
    percentage: "60%",
    percentageNum: 60,
    cgpaRange: "3.90 – 3.95",
    title: "60% Scholarship",
    badgeLabel: "Gold Merit",
    description:
      "Outstanding academic performance qualifies for significant tuition support.",
    icon: GraduationCap,
    gradient: "from-amber-500/20 via-yellow-400/5 to-transparent",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
    badge:
      "bg-amber-50 text-amber-800 border-amber-200",
    accent: "bg-amber-400",
    active:
      "ring-2 ring-amber-400/70 border-amber-300 shadow-[0_18px_50px_rgba(245,158,11,0.18)]",
  },
  {
    tierId: "platinum",
    percentage: "85%",
    percentageNum: 85,
    cgpaRange: "4.00",
    title: "85% Scholarship",
    badgeLabel: "Platinum Award",
    description:
      "Exceptional academic performance qualifies for the highest available merit scholarship.",
    icon: Award,
    gradient: "from-emerald-500/20 via-teal-400/5 to-transparent",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    badge:
      "bg-emerald-50 text-emerald-800 border-emerald-200",
    accent: "bg-emerald-500",
    active:
      "ring-2 ring-emerald-400/70 border-emerald-300 shadow-[0_18px_50px_rgba(16,185,129,0.18)]",
  },
];

export const ScholarshipsSection: React.FC<ScholarshipsSectionProps> = ({
  id = "scholarships",
  className = "",
}) => {
  const { user } = useAuth();

  const isStudent =
    user?.role === "student" || (user as any)?.role === "STUDENT";

  const studentKey = user?.enrollmentId || user?.id;

  const liveScholarship = useQuery(
    api.academicManagement.getStudentScholarshipEligibility,
    isConvexConfigured && isStudent && studentKey
      ? {
        userId: user?.id as any,
        studentId: studentKey,
      }
      : "skip"
  );

  const [simulatedCgpa, setSimulatedCgpa] = useState<number>(3.82);
  const [hasUserSimulated, setHasUserSimulated] = useState(false);

  useEffect(() => {
    if (
      liveScholarship?.cgpa !== undefined &&
      !hasUserSimulated
    ) {
      setSimulatedCgpa(liveScholarship.cgpa);
    }
  }, [liveScholarship?.cgpa, hasUserSimulated]);

  const simResult: StudentScholarshipResult =
    calculateScholarship(simulatedCgpa);

  const studentOfficialResult: StudentScholarshipResult | null =
    liveScholarship && liveScholarship.cgpa !== undefined
      ? calculateScholarship(liveScholarship.cgpa)
      : null;

  const boundaryPresets = [
    { label: "3.40", value: 3.4 },
    { label: "3.50", value: 3.5 },
    { label: "3.74", value: 3.74 },
    { label: "3.75", value: 3.75 },
    { label: "3.82", value: 3.82 },
    { label: "3.89", value: 3.89 },
    { label: "3.90", value: 3.9 },
    { label: "3.95", value: 3.95 },
    { label: "3.98", value: 3.98 },
    { label: "4.00", value: 4.0 },
  ];

  const activeTier = useMemo(() => {
    if (!simResult.isEligible) return null;

    return SCHOLARSHIP_TIER_CARDS.find(
      (tier) => tier.percentageNum === simResult.percentage
    );
  }, [simResult]);

  const handleCgpaChange = (value: number) => {
    const safeValue = Math.min(4, Math.max(0, value));

    setSimulatedCgpa(safeValue);
    setHasUserSimulated(true);
  };

  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden bg-[#f6f8fc] py-10 sm:py-14 lg:py-16 ${className}`}
    >
      {/* ================================================================
          BACKGROUND ATMOSPHERE
      ================================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -right-40 top-[30%] h-[32rem] w-[32rem] rounded-full bg-amber-300/10 blur-3xl" />
        <div className="absolute bottom-0 left-[35%] h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0b1f3a 1px, transparent 1px), linear-gradient(90deg, #0b1f3a 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">

        {/* ================================================================
            SECTION HEADER
        ================================================================ */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#0b1f3a]/10 bg-white/80 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#0b1f3a] shadow-sm backdrop-blur">
              <Award className="h-3 w-3 text-amber-500" />
              Merit-Based Scholarship Program
            </div>

            <h2 className="font-heading text-2xl font-black tracking-[-0.03em] text-[#071322] sm:text-3xl lg:text-4xl">
              Rewarding{" "}
              <span className="bg-gradient-to-r from-[#0b1f3a] via-[#173b69] to-[#0b1f3a] bg-clip-text text-transparent">
                Academic Excellence
              </span>
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              Iqra University recognizes academic achievement through
              structured merit-based tuition support calculated from officially
              published CGPA results.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2 shadow-sm backdrop-blur">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b1f3a] text-white shadow-md">
              <BadgePercent className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">
                Maximum Award
              </p>
              <p className="font-heading text-base font-black text-[#0b1f3a] sm:text-lg">
                85% Tuition
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================================================================
            HERO AREA
        ================================================================ */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 xl:gap-5">

          {/* ---------------------------------------------------------------
              IMAGE HERO
          --------------------------------------------------------------- */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="group relative min-h-[380px] overflow-hidden rounded-2xl border border-white/20 bg-[#071322] shadow-[0_20px_50px_rgba(7,19,34,0.15)] sm:min-h-[440px] sm:rounded-3xl xl:col-span-5 xl:min-h-[520px]"
          >
            <Image
              src="/images/scholarships-hero.png"
              alt="Iqra University graduating scholars holding diplomas"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 42vw"
              className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]"
            />

            {/* Image overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030b15] via-[#071322]/45 to-[#071322]/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071322]/50 via-transparent to-transparent" />

            {/* Top badge */}
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 sm:left-5 sm:right-5 sm:top-5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xl backdrop-blur-xl">
                <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
                Merit Awards
              </div>

              <div className="hidden items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-500/20 px-2.5 py-1.5 text-[9px] font-bold text-emerald-100 backdrop-blur-xl sm:inline-flex">
                <Sparkles className="h-3 w-3" />
                Up to 85%
              </div>
            </div>

            {/* Hero content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
              <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">
                <span className="h-px w-5 bg-amber-300/70" />
                Excellence Recognized
              </div>

              <h3 className="max-w-xl font-heading text-xl font-black leading-tight tracking-[-0.03em] text-white sm:text-2xl">
                Your performance can open the door to greater opportunity.
              </h3>

              <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-200">
                Merit scholarships are tied to officially published academic
                results and can be reflected in subsequent tuition
                calculations according to institutional policy.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.07] p-2 sm:p-2.5 backdrop-blur-xl">
                  <p className="text-base font-black text-white">4</p>
                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                    Merit Tiers
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.07] p-2 sm:p-2.5 backdrop-blur-xl">
                  <p className="text-base font-black text-white">85%</p>
                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                    Maximum
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.07] p-2 sm:p-2.5 backdrop-blur-xl">
                  <p className="text-base font-black text-white">4.00</p>
                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                    Top CGPA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              RIGHT CONTENT
          --------------------------------------------------------------- */}

          <div className="flex flex-col gap-4 xl:col-span-7">

            {/* Student status */}
            {isStudent ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-[#071322] p-4 text-white shadow-lg sm:p-5"
              >
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex flex-col gap-3 border-b border-white/10 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                          <ShieldCheck className="h-4 w-4 text-amber-300" />
                        </div>

                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-amber-300">
                            Student Scholarship
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            ID:{" "}
                            {liveScholarship?.studentId ||
                              user?.enrollmentId ||
                              "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${studentOfficialResult?.isEligible
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                        }`}
                    >
                      {studentOfficialResult?.isEligible ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}

                      {studentOfficialResult?.isEligible
                        ? "Eligible"
                        : "Currently Not Eligible"}
                    </span>
                  </div>

                  <div className="relative mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur-xl">
                      <p className="text-[8px] font-black uppercase tracking-[0.13em] text-slate-400">
                        Current CGPA
                      </p>

                      <p className="mt-1 font-mono text-2xl font-black tracking-tight text-white">
                        {studentOfficialResult
                          ? studentOfficialResult.cgpa.toFixed(2)
                          : "—"}
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-500">
                        4.00 scale
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur-xl">
                      <p className="text-[8px] font-black uppercase tracking-[0.13em] text-slate-400">
                        Scholarship
                      </p>

                      <p
                        className={`mt-1 font-mono text-2xl font-black tracking-tight ${studentOfficialResult?.isEligible
                            ? "text-emerald-300"
                            : "text-slate-400"
                          }`}
                      >
                        {studentOfficialResult?.isEligible
                          ? `${studentOfficialResult.percentage}%`
                          : "0%"}
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-500">
                        Tuition support
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur-xl">
                      <p className="text-[8px] font-black uppercase tracking-[0.13em] text-slate-400">
                        Merit Tier
                      </p>

                      <p className="mt-1.5 truncate text-xs font-black text-white">
                        {studentOfficialResult?.isEligible
                          ? studentOfficialResult.tier
                          : "Not Eligible"}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-[8px] text-slate-500">
                        {studentOfficialResult?.isEligible ? (
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="h-2.5 w-2.5 text-amber-400" />
                        )}

                        {studentOfficialResult?.isEligible
                          ? "Current eligibility"
                          : "Below 3.50 threshold"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-2.5 text-[9px] leading-4 text-slate-400">
                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-slate-500" />
                    <span>
                      {studentOfficialResult?.explanation ||
                        "Scholarship eligibility is derived from published academic records in the university database."}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-[#0b1f3a]/10 bg-white p-4 shadow-sm sm:p-4.5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0b1f3a] text-white shadow-md">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>

                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#0b1f3a]">
                        Enrolled Student Portal
                      </p>

                      <h3 className="mt-0.5 font-heading text-base font-black text-slate-900">
                        View your personalized eligibility
                      </h3>

                      <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-slate-500">
                        Sign in to view your published CGPA and scholarship
                        eligibility from the university database.
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0b1f3a] px-3.5 py-2 text-xs font-black text-white shadow-md shadow-[#0b1f3a]/15 transition-all hover:-translate-y-0.5 hover:bg-[#122b4e]"
                    >
                      <LogIn className="h-3 w-3" />
                      Student Sign In
                    </Link>

                    <a
                      href="#eligibility-calculator"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <SlidersHorizontal className="h-3 w-3" />
                      Simulate
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tier cards */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {SCHOLARSHIP_TIER_CARDS.map((card, index) => {
                const isStudentTier =
                  studentOfficialResult?.isEligible &&
                  studentOfficialResult.percentage === card.percentageNum;

                const isSimTier =
                  hasUserSimulated &&
                  simResult.isEligible &&
                  simResult.percentage === card.percentageNum;

                const isHighlighted = isStudentTier || isSimTier;

                return (
                  <motion.div
                    key={card.tierId}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                    whileHover={{ y: -3 }}
                    className={`group relative overflow-hidden rounded-2xl border bg-white p-3.5 shadow-sm transition-all duration-300 sm:p-4 ${isHighlighted
                        ? card.active
                        : "border-slate-200/80 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40"
                      }`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />

                    {isStudentTier && (
                      <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#071322] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-md">
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                        Your Tier
                      </div>
                    )}

                    {!isStudentTier && isSimTier && (
                      <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-md">
                        <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                        Simulated
                      </div>
                    )}

                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg} ${card.iconColor}`}
                        >
                          <card.icon className="h-4 w-4" />
                        </div>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${card.badge}`}
                        >
                          {card.badgeLabel}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <p className="font-mono text-2xl font-black tracking-[-0.04em] text-slate-900 sm:text-3xl">
                              {card.percentage}
                            </p>

                            <p className="mt-0.5 text-[8px] font-black uppercase tracking-wider text-slate-400">
                              Tuition Support
                            </p>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right">
                            <p className="text-[7px] font-bold uppercase tracking-wider text-slate-400">
                              Required
                            </p>
                            <p className="font-mono text-[10px] font-black text-slate-800">
                              {card.cgpaRange}
                            </p>
                          </div>
                        </div>

                        <h4 className="mt-2 text-xs font-black text-slate-900 sm:text-sm">
                          {card.title}
                        </h4>

                        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-500">
                          {card.description}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          Fee Reduction
                        </span>

                        <span className="font-mono text-[10px] font-black text-slate-800">
                          {card.percentage} OFF
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================================================================
            SIMULATOR
        ================================================================ */}

        <motion.div
          id="eligibility-calculator"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Simulator header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-[#071322] to-[#10294a] p-4 text-white sm:p-5 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-slate-200">
                  <SlidersHorizontal className="h-3 w-3 text-amber-300" />
                  Interactive Eligibility Simulator
                </div>

                <h3 className="font-heading text-lg font-black tracking-tight sm:text-xl">
                  Test your CGPA
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Adjust the CGPA to instantly preview the scholarship tier,
                  percentage, and eligibility status.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-xl">
                <Database className="h-3.5 w-3.5 text-slate-400" />

                <div>
                  <p className="text-[7px] font-black uppercase tracking-wider text-slate-500">
                    Calculation
                  </p>
                  <p className="text-[9px] font-bold text-slate-200">
                    Instant Preview
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-12 lg:p-6">

            {/* Controls */}
            <div className="space-y-4 lg:col-span-7">
              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="cgpa-input"
                    className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-700"
                  >
                    Adjust CGPA
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="hidden text-[9px] font-medium text-slate-400 sm:inline">
                      Direct Input
                    </span>

                    <div className="relative">
                      <input
                        id="cgpa-input"
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={simulatedCgpa}
                        onChange={(e) => {
                          const value = Number(e.target.value);

                          if (!Number.isNaN(value)) {
                            handleCgpaChange(value);
                          }
                        }}
                        className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center font-mono text-xs font-black text-[#071322] outline-none transition-all focus:border-[#0b1f3a] focus:bg-white focus:ring-4 focus:ring-[#0b1f3a]/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="2"
                    max="4"
                    step="0.01"
                    value={simulatedCgpa}
                    onChange={(e) =>
                      handleCgpaChange(Number(e.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0b1f3a]"
                    aria-label="CGPA simulator"
                  />

                  <div className="mt-2 flex justify-between font-mono text-[8px] font-bold text-slate-400 sm:text-[9px]">
                    <span>2.00</span>
                    <span className="text-indigo-600">3.50</span>
                    <span className="text-sky-600">3.75</span>
                    <span className="text-amber-600">3.90</span>
                    <span className="text-emerald-600">4.00</span>
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[8px] font-black uppercase tracking-[0.13em] text-slate-400">
                    Quick Test
                  </p>

                  <p className="text-[8px] text-slate-400">
                    Select a boundary
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {boundaryPresets.map((preset) => {
                    const active =
                      Math.abs(simulatedCgpa - preset.value) < 0.001;

                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setSimulatedCgpa(preset.value);
                          setHasUserSimulated(true);
                        }}
                        className={`rounded-lg border px-2.5 py-1.5 font-mono text-[9px] font-black transition-all ${active
                            ? "border-[#0b1f3a] bg-[#0b1f3a] text-white shadow-md"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-[#0b1f3a]"
                          }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset actions */}
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedCgpa(3.82);
                    setHasUserSimulated(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[9px] font-bold text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Example
                </button>

                {liveScholarship?.cgpa !== undefined && (
                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedCgpa(liveScholarship.cgpa);
                      setHasUserSimulated(false);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#eef3f9] px-2.5 py-1.5 text-[9px] font-bold text-[#0b1f3a] transition-colors hover:bg-[#e2eaf5]"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Use My CGPA
                  </button>
                )}
              </div>
            </div>

            {/* Result */}
            <div className="lg:col-span-5">
              <motion.div
                key={`${simResult.cgpa}-${simResult.percentage}`}
                initial={{ opacity: 0.7, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`relative h-full overflow-hidden rounded-xl border p-4 sm:p-4.5 ${simResult.isEligible
                    ? "border-[#0b1f3a]/15 bg-gradient-to-br from-[#f3f7fc] via-white to-emerald-50/30"
                    : "border-slate-200 bg-slate-50"
                  }`}
              >
                {activeTier && (
                  <div
                    className={`absolute right-0 top-0 h-28 w-28 rounded-full ${activeTier.accent} opacity-10 blur-3xl`}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                        Live Calculation
                      </p>

                      <h4 className="mt-0.5 font-heading text-base font-black text-slate-900">
                        {simResult.tier}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${simResult.isEligible
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-500"
                        }`}
                    >
                      {simResult.isEligible ? (
                        <CheckCircle2 className="h-2.5 w-2.5" />
                      ) : (
                        <XCircle className="h-2.5 w-2.5" />
                      )}

                      {simResult.status}
                    </span>
                  </div>

                  <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Tested CGPA
                      </p>

                      <p className="mt-1 font-mono text-2xl font-black tracking-tight text-[#071322]">
                        {simResult.cgpa.toFixed(2)}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border p-3 ${simResult.isEligible
                          ? "border-emerald-200 bg-emerald-50/70"
                          : "border-slate-200 bg-white"
                        }`}
                    >
                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                        Scholarship
                      </p>

                      <p
                        className={`mt-1 font-mono text-2xl font-black tracking-tight ${simResult.isEligible
                            ? "text-emerald-700"
                            : "text-slate-500"
                          }`}
                      >
                        {simResult.percentage}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Info className="h-3 w-3 text-[#0b1f3a]" />
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-700">
                        Criteria Explanation
                      </span>
                    </div>

                    <p className="text-[9px] leading-relaxed text-slate-500">
                      {simResult.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ================================================================
            SCHOLARSHIP CRITERIA
        ================================================================ */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-[#0b1f3a]">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  Scholarship Framework
                </div>

                <h3 className="font-heading text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                  Merit Scholarship Criteria
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
                  Overview of CGPA ranges and their corresponding scholarship
                  percentages.
                </p>
              </div>

              <div className="hidden items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[8px] font-bold text-slate-500 sm:flex">
                <LockKeyhole className="h-3 w-3" />
                Published Results
              </div>
            </div>
          </div>

          {/* Desktop/tablet table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-4 py-2.5 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
                    CGPA Range
                  </th>

                  <th className="px-4 py-2.5 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Award
                  </th>

                  <th className="px-4 py-2.5 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Merit Tier
                  </th>

                  <th className="px-4 py-2.5 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Academic Standing
                  </th>

                  <th className="px-4 py-2.5 text-right text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    range: "4.00",
                    award: "85%",
                    tier: "Platinum Chancellor's Award",
                    standing: "Chancellor's Gold Medalist",
                    color: "emerald",
                    active: simResult.cgpa === 4,
                  },
                  {
                    range: "3.90 – 3.95",
                    award: "60%",
                    tier: "Gold Merit Tier",
                    standing: "President's Honor List",
                    color: "amber",
                    active:
                      simResult.cgpa >= 3.9 &&
                      simResult.cgpa < 4,
                  },
                  {
                    range: "3.75 – 3.89",
                    award: "40%",
                    tier: "Silver Merit Tier",
                    standing: "Dean's High Honor List",
                    color: "sky",
                    active:
                      simResult.cgpa >= 3.75 &&
                      simResult.cgpa <= 3.89,
                  },
                  {
                    range: "3.50 – 3.74",
                    award: "20%",
                    tier: "Bronze Merit Tier",
                    standing: "Dean's Honor Roll",
                    color: "indigo",
                    active:
                      simResult.cgpa >= 3.5 &&
                      simResult.cgpa <= 3.74,
                  },
                  {
                    range: "Below 3.50",
                    award: "0%",
                    tier: "Standard Standing",
                    standing: "Good Standing / Academic Review",
                    color: "slate",
                    active: simResult.cgpa < 3.5,
                  },
                ].map((row) => (
                  <tr
                    key={row.range}
                    className={`transition-colors ${row.active
                        ? "bg-[#f4f7fb]"
                        : "hover:bg-slate-50/70"
                      }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {row.active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
                        )}

                        <span className="font-mono text-xs font-bold text-slate-900">
                          {row.range}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`font-mono text-sm font-bold ${row.color === "emerald"
                            ? "text-emerald-600"
                            : row.color === "amber"
                              ? "text-amber-600"
                              : row.color === "sky"
                                ? "text-sky-600"
                                : row.color === "indigo"
                                  ? "text-indigo-600"
                                  : "text-slate-500"
                          }`}
                      >
                        {row.award}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                      {row.tier}
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-500">
                      {row.standing}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${row.award === "0%"
                            ? "border-slate-200 bg-slate-100 text-slate-500"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                          }`}
                      >
                        {row.award === "0%" ? (
                          <XCircle className="h-2.5 w-2.5" />
                        ) : (
                          <CheckCircle2 className="h-2.5 w-2.5" />
                        )}

                        {row.award === "0%"
                          ? "Not Eligible"
                          : "Eligible"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile criteria cards */}
          <div className="space-y-2.5 p-3 md:hidden">
            {[
              {
                range: "4.00",
                award: "85%",
                tier: "Platinum Chancellor's Award",
                standing: "Chancellor's Gold Medalist",
                color: "emerald",
              },
              {
                range: "3.90 – 3.95",
                award: "60%",
                tier: "Gold Merit Tier",
                standing: "President's Honor List",
                color: "amber",
              },
              {
                range: "3.75 – 3.89",
                award: "40%",
                tier: "Silver Merit Tier",
                standing: "Dean's High Honor List",
                color: "sky",
              },
              {
                range: "3.50 – 3.74",
                award: "20%",
                tier: "Bronze Merit Tier",
                standing: "Dean's Honor Roll",
                color: "indigo",
              },
              {
                range: "Below 3.50",
                award: "0%",
                tier: "Standard Standing",
                standing: "Good Standing / Academic Review",
                color: "slate",
              },
            ].map((row) => (
              <div
                key={row.range}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-base font-black text-slate-900">
                      {row.range}
                    </p>

                    <p className="mt-0.5 text-[9px] font-bold text-slate-500">
                      {row.tier}
                    </p>
                  </div>

                  <span
                    className={`font-mono text-xl font-black ${row.color === "emerald"
                        ? "text-emerald-600"
                        : row.color === "amber"
                          ? "text-amber-600"
                          : row.color === "sky"
                            ? "text-sky-600"
                            : row.color === "indigo"
                              ? "text-indigo-600"
                              : "text-slate-500"
                      }`}
                  >
                    {row.award}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-slate-200 pt-2">
                  <span className="text-[9px] text-slate-500">
                    {row.standing}
                  </span>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[7px] font-black uppercase ${row.award === "0%"
                        ? "bg-slate-200 text-slate-500"
                        : "bg-emerald-100 text-emerald-700"
                      }`}
                  >
                    {row.award === "0%"
                      ? "Not Eligible"
                      : "Eligible"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ================================================================
            POLICY CARDS
        ================================================================ */}

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Official Results Only",
              text: "Scholarship calculations are based on published and verified academic results.",
            },
            {
              icon: TrendingUp,
              title: "Automatic Recalculation",
              text: "Eligibility can update when officially published academic results change.",
            },
            {
              icon: CircleDollarSign,
              title: "Tuition Application",
              text: "Eligible tuition support can be reflected according to institutional fee policy.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -3 }}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-300 hover:shadow-md sm:p-4.5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef3f9] text-[#0b1f3a] transition-colors group-hover:bg-[#0b1f3a] group-hover:text-white">
                  <item.icon className="h-4.5 w-4.5" />
                </div>

                <div>
                  <h4 className="font-heading text-xs font-black text-slate-900 sm:text-sm">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-[9px] leading-relaxed text-slate-500 sm:text-[10px]">
                    {item.text}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-end">
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0b1f3a]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================================================================
            FINAL CTA
        ================================================================ */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mt-5 overflow-hidden rounded-2xl bg-[#071322] p-4.5 shadow-md sm:p-6"
        >
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-amber-300">
                <Sparkles className="h-3 w-3" />
                Academic Excellence
              </div>

              <h3 className="font-heading text-lg font-black tracking-tight text-white sm:text-xl">
                Keep building your academic record.
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">
                Use the simulator to understand the published CGPA thresholds
                and sign in to view your own academic scholarship information.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {!isStudent && (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-black text-[#071322] transition-all hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  <LogIn className="h-3 w-3" />
                  Student Portal
                </Link>
              )}

              <a
                href="#eligibility-calculator"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.07] px-3.5 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                Check Eligibility
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScholarshipsSection;