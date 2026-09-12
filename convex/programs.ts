import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_PROGRAMS = [
  {
    code: "BS-CS",
    name: "BS Computer Science",
    degreeType: "Undergraduate" as const,
    campus: "Chak Shezad Campus, Islamabad",
    department: "Computing & Artificial Intelligence",
    availableIntakes: ["Fall", "Spring"],
    availableShifts: ["Morning", "Evening"],
    status: "active" as const,
  },
  {
    code: "BS-SE",
    name: "BS Software Engineering",
    degreeType: "Undergraduate" as const,
    campus: "Chak Shezad Campus, Islamabad",
    department: "Computing & Artificial Intelligence",
    availableIntakes: ["Fall", "Spring"],
    availableShifts: ["Morning", "Evening"],
    status: "active" as const,
  },
  {
    code: "BS-AI",
    name: "BS Artificial Intelligence",
    degreeType: "Undergraduate" as const,
    campus: "Chak Shezad Campus, Islamabad",
    department: "Computing & Artificial Intelligence",
    availableIntakes: ["Fall", "Spring"],
    availableShifts: ["Morning", "Evening"],
    status: "active" as const,
  },
  {
    code: "BS-AT",
    name: "BS Anesthesia",
    degreeType: "Undergraduate" as const,
    campus: "Chak Shezad Campus, Islamabad",
    department: "Allied Health Sciences",
    availableIntakes: ["Fall", "Spring"],
    availableShifts: ["Morning"],
    status: "active" as const,
  },
  {
    code: "BBA",
    name: "Bachelor of Business Administration (BBA)",
    degreeType: "Undergraduate" as const,
    campus: "Chak Shezad Campus, Islamabad",
    department: "Management & Social Sciences",
    availableIntakes: ["Fall", "Spring"],
    availableShifts: ["Morning", "Evening"],
    status: "active" as const,
  },
  {
    code: "BS-CY",
    name: "BS Cyber Security",
    degreeType: "Undergraduate" as const,
    campus: "Chak Shezad Campus, Islamabad",
    department: "Computing & Artificial Intelligence",
    availableIntakes: ["Fall", "Spring"],
    availableShifts: ["Morning", "Evening"],
    status: "active" as const,
  },
  {
    code: "BS-DS",
    name: "BS Data Science",
    degreeType: "Undergraduate" as const,
    campus: "Chak Shezad Campus, Islamabad",
    department: "Computing & Artificial Intelligence",
    availableIntakes: ["Fall", "Spring"],
    availableShifts: ["Morning", "Evening"],
    status: "active" as const,
  },
  {
    code: "MBA",
    name: "Master of Business Administration (MBA)",
    degreeType: "Graduate" as const,
    campus: "Chak Shezad Campus, Islamabad",
    department: "Management & Social Sciences",
    availableIntakes: ["Fall", "Spring"],
    availableShifts: ["Evening"],
    status: "active" as const,
  },
];

/**
 * Get all active programs, automatically seeding initial university programs if empty
 */
export const getPrograms = query({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("programs")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    if (existing.length > 0) {
      return existing;
    }

    // Return default in-memory list if not yet committed by mutation
    return DEFAULT_PROGRAMS.map((p, idx) => ({
      _id: `prog_${idx}` as any,
      _creationTime: Date.now(),
      ...p,
    }));
  },
});

/**
 * Seed programs table if empty
 */
export const seedPrograms = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("programs").take(1);
    if (existing.length > 0) {
      return { count: existing.length, seeded: false };
    }

    for (const prog of DEFAULT_PROGRAMS) {
      await ctx.db.insert("programs", prog);
    }

    return { count: DEFAULT_PROGRAMS.length, seeded: true };
  },
});
