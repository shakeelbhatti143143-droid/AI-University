import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get notifications for the authenticated user
 */
export const getMyNotifications = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(20);
  },
});

/**
 * Mark notification as read
 */
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
    return { success: true };
  },
});
