/**
 * Institutional Merit Scholarship Logic & Tier Normalization
 * Iqra University - Chak Shehzad Campus, Islamabad
 *
 * Official CGPA Eligibility Policy:
 * - 3.50 – 3.74: 20% Tuition Scholarship (Bronze Merit Tier)
 * - 3.75 – 3.89: 40% Tuition Scholarship (Silver Merit Tier)
 * - 3.90 – 3.95: 60% Tuition Scholarship (Gold Merit Tier)
 * - 4.00:        85% Tuition Scholarship (Platinum Chancellor's Award)
 * - Below 3.50:  0% (Currently Not Eligible for merit-based scholarship)
 */

export interface ScholarshipTierInfo {
  tierId: "platinum" | "gold" | "silver" | "bronze" | "ineligible";
  tierName: string;
  minCgpa: number;
  maxCgpa: number;
  percentage: number;
  badgeLabel: string;
  badgeColor: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  description: string;
  awardTitle: string;
}

export interface StudentScholarshipResult {
  cgpa: number;
  rawCgpa: number;
  percentage: number;
  isEligible: boolean;
  tier: string;
  tierId: "platinum" | "gold" | "silver" | "bronze" | "ineligible";
  tierDetails: ScholarshipTierInfo;
  status: "Eligible" | "Not Eligible";
  explanation: string;
}

export const SCHOLARSHIP_TIERS: ScholarshipTierInfo[] = [
  {
    tierId: "platinum",
    tierName: "Chancellor's Distinction Award",
    awardTitle: "Platinum Merit Tier",
    minCgpa: 4.00,
    maxCgpa: 4.00,
    percentage: 85,
    badgeLabel: "85% Scholarship",
    badgeColor: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    cardBg: "bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50",
    borderColor: "border-emerald-500/40 hover:border-emerald-600",
    textColor: "text-emerald-900",
    accentColor: "#059669",
    description: "Awarded for exceptional academic distinction with a perfect 4.00 CGPA.",
  },
  {
    tierId: "gold",
    tierName: "President's Honor Scholarship",
    awardTitle: "Gold Merit Tier",
    minCgpa: 3.90,
    maxCgpa: 3.95,
    percentage: 60,
    badgeLabel: "60% Scholarship",
    badgeColor: "bg-amber-500/15 text-amber-800 border-amber-500/30",
    cardBg: "bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/50",
    borderColor: "border-amber-500/40 hover:border-amber-600",
    textColor: "text-amber-950",
    accentColor: "#d97706",
    description: "Awarded for superior academic achievement with a CGPA between 3.90 and 3.95.",
  },
  {
    tierId: "silver",
    tierName: "Dean's High Merit Scholarship",
    awardTitle: "Silver Merit Tier",
    minCgpa: 3.75,
    maxCgpa: 3.89,
    percentage: 40,
    badgeLabel: "40% Scholarship",
    badgeColor: "bg-sky-500/15 text-sky-800 border-sky-500/30",
    cardBg: "bg-gradient-to-br from-sky-50/80 via-white to-blue-50/50",
    borderColor: "border-sky-500/40 hover:border-sky-600",
    textColor: "text-sky-950",
    accentColor: "#0284c7",
    description: "Awarded for high scholastic merit with a CGPA between 3.75 and 3.89.",
  },
  {
    tierId: "bronze",
    tierName: "Dean's Merit Scholarship",
    awardTitle: "Bronze Merit Tier",
    minCgpa: 3.50,
    maxCgpa: 3.74,
    percentage: 20,
    badgeLabel: "20% Scholarship",
    badgeColor: "bg-indigo-500/15 text-indigo-800 border-indigo-500/30",
    cardBg: "bg-gradient-to-br from-indigo-50/80 via-white to-slate-50/50",
    borderColor: "border-indigo-500/40 hover:border-indigo-600",
    textColor: "text-indigo-950",
    accentColor: "#4f46e5",
    description: "Awarded for commendable academic merit with a CGPA between 3.50 and 3.74.",
  },
];

export const INELIGIBLE_TIER_INFO: ScholarshipTierInfo = {
  tierId: "ineligible",
  tierName: "Standard Academic Standing",
  awardTitle: "Not Eligible",
  minCgpa: 0.00,
  maxCgpa: 3.49,
  percentage: 0,
  badgeLabel: "Not Eligible",
  badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
  cardBg: "bg-white",
  borderColor: "border-slate-200",
  textColor: "text-slate-700",
  accentColor: "#64748b",
  description: "Merit-based scholarships require a minimum official published CGPA of 3.50.",
};

/**
 * Normalizes and calculates the student's scholarship entitlement.
 *
 * Requirements met:
 * 1. Decimal CGPA values handled with 2-decimal precision normalization.
 * 2. Ranges do not overlap and have no gaps:
 *    - cgpa >= 4.00 -> 85%
 *    - 3.90 <= cgpa < 4.00 -> 60% (covers 3.90–3.95 and high honors < 4.00)
 *    - 3.75 <= cgpa < 3.90 -> 40% (3.75–3.89)
 *    - 3.50 <= cgpa < 3.75 -> 20% (3.50–3.74)
 *    - cgpa < 3.50 -> 0% (Not Eligible)
 * 3. Exact boundary testing:
 *    - 3.50 -> 20%
 *    - 3.74 -> 20%
 *    - 3.75 -> 40%
 *    - 3.89 -> 40%
 *    - 3.90 -> 60%
 *    - 3.95 -> 60%
 *    - 4.00 -> 85%
 */
export function calculateScholarship(rawCgpa: number | string | null | undefined): StudentScholarshipResult {
  if (rawCgpa === null || rawCgpa === undefined || rawCgpa === "") {
    return {
      cgpa: 0.0,
      rawCgpa: 0.0,
      percentage: 0,
      isEligible: false,
      tier: "Not Eligible",
      tierId: "ineligible",
      tierDetails: INELIGIBLE_TIER_INFO,
      status: "Not Eligible",
      explanation: "No official published CGPA is currently on record.",
    };
  }

  const parsed = typeof rawCgpa === "number" ? rawCgpa : parseFloat(String(rawCgpa));
  if (isNaN(parsed) || parsed < 0) {
    return {
      cgpa: 0.0,
      rawCgpa: 0.0,
      percentage: 0,
      isEligible: false,
      tier: "Not Eligible",
      tierId: "ineligible",
      tierDetails: INELIGIBLE_TIER_INFO,
      status: "Not Eligible",
      explanation: "Invalid CGPA record detected.",
    };
  }

  // Normalize to 2 decimal places (standard HEC Pakistan precision)
  const normalized = Math.round(parsed * 100) / 100;

  if (normalized >= 4.00) {
    const tier = SCHOLARSHIP_TIERS[0]; // platinum
    return {
      cgpa: normalized,
      rawCgpa: parsed,
      percentage: tier.percentage,
      isEligible: true,
      tier: tier.awardTitle,
      tierId: tier.tierId,
      tierDetails: tier,
      status: "Eligible",
      explanation: `Eligible for ${tier.percentage}% tuition scholarship based on exceptional academic distinction with a perfect 4.00 CGPA.`,
    };
  } else if (normalized >= 3.90) {
    const tier = SCHOLARSHIP_TIERS[1]; // gold (3.90–3.95, covering up to < 4.00 with zero gaps)
    return {
      cgpa: normalized,
      rawCgpa: parsed,
      percentage: tier.percentage,
      isEligible: true,
      tier: tier.awardTitle,
      tierId: tier.tierId,
      tierDetails: tier,
      status: "Eligible",
      explanation: `Eligible for ${tier.percentage}% tuition scholarship based on academic excellence with a published CGPA of ${normalized.toFixed(2)}.`,
    };
  } else if (normalized >= 3.75) {
    const tier = SCHOLARSHIP_TIERS[2]; // silver (3.75–3.89)
    return {
      cgpa: normalized,
      rawCgpa: parsed,
      percentage: tier.percentage,
      isEligible: true,
      tier: tier.awardTitle,
      tierId: tier.tierId,
      tierDetails: tier,
      status: "Eligible",
      explanation: `Eligible for ${tier.percentage}% tuition scholarship based on high academic merit with a published CGPA of ${normalized.toFixed(2)}.`,
    };
  } else if (normalized >= 3.50) {
    const tier = SCHOLARSHIP_TIERS[3]; // bronze (3.50–3.74)
    return {
      cgpa: normalized,
      rawCgpa: parsed,
      percentage: tier.percentage,
      isEligible: true,
      tier: tier.awardTitle,
      tierId: tier.tierId,
      tierDetails: tier,
      status: "Eligible",
      explanation: `Eligible for ${tier.percentage}% tuition scholarship based on academic merit with a published CGPA of ${normalized.toFixed(2)}.`,
    };
  } else {
    return {
      cgpa: normalized,
      rawCgpa: parsed,
      percentage: 0,
      isEligible: false,
      tier: "Not Eligible",
      tierId: "ineligible",
      tierDetails: INELIGIBLE_TIER_INFO,
      status: "Not Eligible",
      explanation: `Currently not eligible for merit-based scholarship. A minimum published CGPA of 3.50 is required (Current CGPA: ${normalized.toFixed(2)}).`,
    };
  }
}
