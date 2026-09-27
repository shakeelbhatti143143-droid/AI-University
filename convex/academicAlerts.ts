import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query: Get all active academic alerts
 */
export const getAcademicAlerts = query({
  args: {
    riskLevel: v.optional(v.union(v.literal("High"), v.literal("Moderate"), v.literal("Low"))),
  },
  handler: async (ctx, args) => {
    let alerts = await ctx.db.query("academicAlerts").collect();

    if (args.riskLevel) {
      alerts = alerts.filter((a) => a.riskLevel === args.riskLevel);
    }

    // Sort by riskScore descending (highest risk first)
    alerts.sort((a, b) => b.riskScore - a.riskScore);
    return alerts;
  },
});

/**
 * Query: Get alerts for a specific student
 */
export const getStudentAlerts = query({
  args: {
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("academicAlerts")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});

/**
 * Mutation: Record or update an academic alert
 */
export const upsertAcademicAlert = mutation({
  args: {
    studentId: v.string(),
    enrollmentId: v.string(),
    studentName: v.string(),
    studentEmail: v.string(),
    department: v.string(),
    degreeProgram: v.string(),
    currentSemester: v.number(),
    riskLevel: v.union(v.literal("High"), v.literal("Moderate"), v.literal("Low")),
    riskScore: v.number(),
    triggerFactors: v.array(v.string()),
    currentAttendance: v.number(),
    cgpa: v.number(),
    interventionStatus: v.union(
      v.literal("Pending"),
      v.literal("Notice Sent"),
      v.literal("Counseling Scheduled"),
      v.literal("Resolved")
    ),
    aiRecommendation: v.optional(v.string()),
    advisorNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("academicAlerts")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return { success: true, id: existing._id };
    }

    const id = await ctx.db.insert("academicAlerts", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return { success: true, id };
  },
});

/**
 * Mutation: Update intervention status and notes
 */
export const updateIntervention = mutation({
  args: {
    alertId: v.id("academicAlerts"),
    status: v.union(
      v.literal("Pending"),
      v.literal("Notice Sent"),
      v.literal("Counseling Scheduled"),
      v.literal("Resolved")
    ),
    advisorNotes: v.optional(v.string()),
    aiRecommendation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alertId, {
      interventionStatus: args.status,
      ...(args.advisorNotes !== undefined && { advisorNotes: args.advisorNotes }),
      ...(args.aiRecommendation !== undefined && { aiRecommendation: args.aiRecommendation }),
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});
