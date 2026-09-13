import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all active degree programs created by Admin in academicPrograms table.
 * Strictly database-driven with ZERO dummy, mock, or fallback data.
 */
export const getPrograms = query({
  args: {
    departmentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allPrograms = await ctx.db
      .query("academicPrograms")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    if (!args.departmentId) {
      return allPrograms;
    }

    const targetDept = await ctx.db.get(args.departmentId as any);
    const targetDeptName = targetDept ? (targetDept as any).name?.trim().toLowerCase() : null;

    return allPrograms.filter((p) => {
      if (p.departmentId && p.departmentId === args.departmentId) return true;
      if (targetDeptName && p.department && p.department.trim().toLowerCase() === targetDeptName) return true;
      return false;
    });
  },
});

