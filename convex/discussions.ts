import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query: Retrieve discussions for a specific course
 */
export const getDiscussionsByCourse = query({
  args: {
    courseCode: v.string(),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let threads = await ctx.db
      .query("courseDiscussions")
      .withIndex("by_courseCode", (q) => q.eq("courseCode", args.courseCode))
      .collect();

    if (args.tag && args.tag !== "All") {
      threads = threads.filter((t) => t.tag === args.tag);
    }

    threads.sort((a, b) => b.createdAt - a.createdAt);
    return threads;
  },
});

/**
 * Query: Get discussion thread details and all replies
 */
export const getDiscussionThread = query({
  args: {
    discussionId: v.id("courseDiscussions"),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.discussionId);
    if (!thread) return null;

    const replies = await ctx.db
      .query("discussionReplies")
      .withIndex("by_discussionId", (q) => q.eq("discussionId", args.discussionId))
      .collect();

    replies.sort((a, b) => a.createdAt - b.createdAt);

    return { thread, replies };
  },
});

/**
 * Mutation: Create a new discussion post
 */
export const postDiscussion = mutation({
  args: {
    courseId: v.string(),
    courseCode: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorRole: v.union(v.literal("student"), v.literal("faculty"), v.literal("admin")),
    title: v.string(),
    content: v.string(),
    tag: v.union(
      v.literal("#Assignment"),
      v.literal("#Lecture"),
      v.literal("#ExamPrep"),
      v.literal("#Project"),
      v.literal("#General")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("courseDiscussions", {
      ...args,
      upvotes: [],
      isResolved: false,
      hasInstructorEndorsed: false,
      replyCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    return { success: true, id };
  },
});

/**
 * Mutation: Post a reply to a discussion
 */
export const postReply = mutation({
  args: {
    discussionId: v.id("courseDiscussions"),
    authorId: v.string(),
    authorName: v.string(),
    authorRole: v.union(v.literal("student"), v.literal("faculty"), v.literal("admin")),
    content: v.string(),
    isInstructorEndorsed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.discussionId);
    if (!thread) throw new Error("Thread not found");

    const isEndorsed = args.authorRole === "faculty" || args.isInstructorEndorsed || false;

    await ctx.db.insert("discussionReplies", {
      discussionId: args.discussionId,
      authorId: args.authorId,
      authorName: args.authorName,
      authorRole: args.authorRole,
      content: args.content,
      isInstructorEndorsed: isEndorsed,
      upvotes: [],
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.discussionId, {
      replyCount: (thread.replyCount || 0) + 1,
      hasInstructorEndorsed: thread.hasInstructorEndorsed || isEndorsed,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mutation: Toggle upvote on a post or reply
 */
export const toggleUpvote = mutation({
  args: {
    discussionId: v.id("courseDiscussions"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.discussionId);
    if (!thread) return;

    let upvotes = thread.upvotes || [];
    if (upvotes.includes(args.userId)) {
      upvotes = upvotes.filter((id) => id !== args.userId);
    } else {
      upvotes.push(args.userId);
    }

    await ctx.db.patch(args.discussionId, { upvotes });
    return { upvotesCount: upvotes.length };
  },
});
