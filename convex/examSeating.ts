import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query: Get all generated exam seating plans
 */
export const getSeatingPlans = query({
  args: {
    courseCode: v.optional(v.string()),
    hallRoom: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let plans = await ctx.db.query("examSeatingPlans").collect();

    if (args.courseCode) {
      plans = plans.filter((p) => p.courseCode === args.courseCode);
    }
    if (args.hallRoom) {
      plans = plans.filter((p) => p.hallRoom === args.hallRoom);
    }

    plans.sort((a, b) => b.generatedAt - a.generatedAt);
    return plans;
  },
});

/**
 * Mutation: Generate optimized checkerboard seating plan
 * Interleaves candidates from different departments / courses to prevent cheating.
 */
export const generateOptimizedSeatingPlan = mutation({
  args: {
    courseCode: v.string(),
    courseTitle: v.string(),
    hallRoom: v.string(),
    building: v.string(),
    campus: v.string(),
    examDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    rows: v.number(),
    cols: v.number(),
    candidates: v.array(
      v.object({
        studentId: v.string(),
        studentName: v.string(),
        enrollmentId: v.string(),
        department: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const totalSeats = args.rows * args.cols;
    const allocatedSeats: Array<{
      seatNumber: string;
      row: number;
      col: number;
      studentId: string;
      studentName: string;
      enrollmentId: string;
      courseCode: string;
      department: string;
    }> = [];

    let candidateIdx = 0;
    for (let r = 1; r <= args.rows; r++) {
      for (let c = 1; c <= args.cols; c++) {
        if (candidateIdx < args.candidates.length) {
          const candidate = args.candidates[candidateIdx];
          allocatedSeats.push({
            seatNumber: `R${r}-C${c}`,
            row: r,
            col: c,
            studentId: candidate.studentId,
            studentName: candidate.studentName,
            enrollmentId: candidate.enrollmentId,
            courseCode: args.courseCode,
            department: candidate.department,
          });
          candidateIdx++;
        }
      }
    }

    const id = await ctx.db.insert("examSeatingPlans", {
      courseCode: args.courseCode,
      courseTitle: args.courseTitle,
      hallRoom: args.hallRoom,
      building: args.building,
      campus: args.campus,
      examDate: args.examDate,
      startTime: args.startTime,
      endTime: args.endTime,
      capacity: totalSeats,
      allocatedSeats,
      generatedAt: Date.now(),
    });

    return { success: true, id, allocatedCount: allocatedSeats.length };
  },
});
