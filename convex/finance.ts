import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query: Get all fee challans for administrative finance view
 */
export const getAllChallansAdmin = query({
  args: {
    status: v.optional(v.union(v.literal("Unpaid"), v.literal("Paid"), v.literal("Overdue"), v.literal("Installment"))),
    semester: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let challans = await ctx.db.query("feeChallans").collect();

    if (args.status) {
      challans = challans.filter((c) => c.status === args.status);
    }
    if (args.semester) {
      challans = challans.filter((c) => c.semester === args.semester);
    }

    // Sort by createdAt descending
    challans.sort((a, b) => b.createdAt - a.createdAt);
    return challans;
  },
});

/**
 * Query: Get student specific fee challans
 */
export const getStudentChallans = query({
  args: {
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    const challans = await ctx.db
      .query("feeChallans")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .collect();

    challans.sort((a, b) => b.createdAt - a.createdAt);
    return challans;
  },
});

/**
 * Mutation: Create a single fee challan
 */
export const createFeeChallan = mutation({
  args: {
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    department: v.string(),
    degreeProgram: v.string(),
    semester: v.string(),
    issueDate: v.string(),
    dueDate: v.string(),
    breakdown: v.object({
      tuitionFee: v.number(),
      labCharges: v.number(),
      libraryFee: v.number(),
      examinationFee: v.number(),
      scholarshipDiscount: v.number(),
      lateFine: v.number(),
      totalPayable: v.number(),
    }),
    status: v.union(v.literal("Unpaid"), v.literal("Paid"), v.literal("Overdue"), v.literal("Installment")),
  },
  handler: async (ctx, args) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const challanNo = `IU-2026-FEE-${randomSuffix}`;

    const id = await ctx.db.insert("feeChallans", {
      ...args,
      challanNo,
      createdAt: Date.now(),
    });

    return { success: true, id, challanNo };
  },
});

/**
 * Mutation: Mark a challan as Paid
 */
export const markChallanPaid = mutation({
  args: {
    challanId: v.id("feeChallans"),
    paymentMethod: v.union(
      v.literal("Kuickpay"),
      v.literal("1-Link"),
      v.literal("Bank Branch"),
      v.literal("JazzCash"),
      v.literal("Online Card")
    ),
    transactionReference: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.challanId, {
      status: "Paid",
      paymentMethod: args.paymentMethod,
      transactionReference: args.transactionReference,
      paidAt: Date.now(),
    });

    return { success: true };
  },
});
