import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Public Query: Retrieve all published university videos for the landing page
 * Resolves persistent storage download URLs for the video stream and poster thumbnail.
 */
export const getPublishedVideos = query({
  args: {},
  handler: async (ctx) => {
    const videos = await ctx.db
      .query("universityVideos")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Sort by displayOrder ascending
    videos.sort((a, b) => a.displayOrder - b.displayOrder);

    // Resolve storage download URLs
    const resolvedVideos = await Promise.all(
      videos.map(async (v) => {
        const videoUrl = await ctx.storage.getUrl(v.videoStorageId);
        const thumbnailUrl = v.thumbnailStorageId
          ? await ctx.storage.getUrl(v.thumbnailStorageId)
          : null;

        return {
          _id: v._id,
          _creationTime: v._creationTime,
          title: v.title,
          description: v.description,
          videoUrl,
          thumbnailUrl,
          duration: v.duration,
          displayOrder: v.displayOrder,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
        };
      })
    );

    // Only return items with valid video URLs
    return resolvedVideos.filter((item) => item.videoUrl !== null);
  },
});

/**
 * Admin Query: Retrieve all university videos (both Published and Draft)
 * Includes full administrative metadata and storage identifiers.
 */
export const getAllVideosAdmin = query({
  args: {},
  handler: async (ctx) => {
    const videos = await ctx.db
      .query("universityVideos")
      .collect();

    videos.sort((a, b) => a.displayOrder - b.displayOrder);

    const resolvedVideos = await Promise.all(
      videos.map(async (v) => {
        const videoUrl = await ctx.storage.getUrl(v.videoStorageId);
        const thumbnailUrl = v.thumbnailStorageId
          ? await ctx.storage.getUrl(v.thumbnailStorageId)
          : null;

        return {
          _id: v._id,
          _creationTime: v._creationTime,
          title: v.title,
          description: v.description,
          videoStorageId: v.videoStorageId,
          videoFileName: v.videoFileName,
          videoFileSize: v.videoFileSize,
          thumbnailStorageId: v.thumbnailStorageId,
          thumbnailFileName: v.thumbnailFileName,
          videoUrl,
          thumbnailUrl,
          status: v.status,
          displayOrder: v.displayOrder,
          duration: v.duration,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
          createdBy: v.createdBy,
        };
      })
    );

    return resolvedVideos;
  },
});

/**
 * Admin Mutation: Create a new university video entry
 */
export const createVideo = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    videoStorageId: v.string(),
    videoFileName: v.string(),
    videoFileSize: v.number(),
    thumbnailStorageId: v.optional(v.string()),
    thumbnailFileName: v.optional(v.string()),
    status: v.union(v.literal("published"), v.literal("draft")),
    duration: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    if (!title) {
      throw new Error("Video title is required.");
    }

    if (!args.videoStorageId) {
      throw new Error("Video file upload is required.");
    }

    // Determine the next display order
    const existing = await ctx.db.query("universityVideos").collect();
    const maxOrder = existing.reduce((max, item) => Math.max(max, item.displayOrder), -1);
    const nextOrder = maxOrder + 1;

    const now = Date.now();
    const videoId = await ctx.db.insert("universityVideos", {
      title,
      description: args.description.trim(),
      videoStorageId: args.videoStorageId,
      videoFileName: args.videoFileName,
      videoFileSize: args.videoFileSize,
      thumbnailStorageId: args.thumbnailStorageId,
      thumbnailFileName: args.thumbnailFileName,
      status: args.status,
      displayOrder: nextOrder,
      duration: args.duration?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
      createdBy: args.createdBy || "Super Admin",
    });

    return { success: true, id: videoId };
  },
});

/**
 * Admin Mutation: Update an existing video entry
 */
export const updateVideo = mutation({
  args: {
    id: v.id("universityVideos"),
    title: v.string(),
    description: v.string(),
    videoStorageId: v.optional(v.string()),
    videoFileName: v.optional(v.string()),
    videoFileSize: v.optional(v.number()),
    thumbnailStorageId: v.optional(v.string()),
    thumbnailFileName: v.optional(v.string()),
    status: v.union(v.literal("published"), v.literal("draft")),
    duration: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (!video) {
      throw new Error("Video not found.");
    }

    const title = args.title.trim();
    if (!title) {
      throw new Error("Video title is required.");
    }

    // If a new video file was uploaded, clean up old storage file
    if (args.videoStorageId && args.videoStorageId !== video.videoStorageId) {
      try {
        await ctx.storage.delete(video.videoStorageId);
      } catch (err) {
        console.warn("Could not delete previous video file:", err);
      }
    }

    // If a new thumbnail was uploaded, clean up old thumbnail storage file
    if (
      args.thumbnailStorageId &&
      video.thumbnailStorageId &&
      args.thumbnailStorageId !== video.thumbnailStorageId
    ) {
      try {
        await ctx.storage.delete(video.thumbnailStorageId);
      } catch (err) {
        console.warn("Could not delete previous thumbnail file:", err);
      }
    }

    const now = Date.now();
    await ctx.db.patch(args.id, {
      title,
      description: args.description.trim(),
      ...(args.videoStorageId && {
        videoStorageId: args.videoStorageId,
        videoFileName: args.videoFileName || video.videoFileName,
        videoFileSize: args.videoFileSize ?? video.videoFileSize,
      }),
      ...(args.thumbnailStorageId !== undefined && {
        thumbnailStorageId: args.thumbnailStorageId,
        thumbnailFileName: args.thumbnailFileName,
      }),
      status: args.status,
      ...(args.displayOrder !== undefined && { displayOrder: args.displayOrder }),
      duration: args.duration?.trim() || undefined,
      updatedAt: now,
    });

    return { success: true };
  },
});

/**
 * Admin Mutation: Delete a video and clean up its associated storage assets
 */
export const deleteVideo = mutation({
  args: {
    id: v.id("universityVideos"),
  },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (!video) {
      throw new Error("Video not found.");
    }

    // Clean up stored video file
    try {
      await ctx.storage.delete(video.videoStorageId);
    } catch (err) {
      console.warn("Could not delete stored video file:", err);
    }

    // Clean up stored thumbnail if exists
    if (video.thumbnailStorageId) {
      try {
        await ctx.storage.delete(video.thumbnailStorageId);
      } catch (err) {
        console.warn("Could not delete stored thumbnail file:", err);
      }
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Admin Mutation: Toggle published / draft status
 */
export const toggleVideoStatus = mutation({
  args: {
    id: v.id("universityVideos"),
  },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (!video) {
      throw new Error("Video not found.");
    }

    const newStatus = video.status === "published" ? "draft" : "published";
    await ctx.db.patch(args.id, {
      status: newStatus,
      updatedAt: Date.now(),
    });

    return { success: true, status: newStatus };
  },
});

/**
 * Admin Mutation: Bulk update display order
 */
export const reorderVideos = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.id("universityVideos"),
        displayOrder: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      await ctx.db.patch(item.id, {
        displayOrder: item.displayOrder,
        updatedAt: Date.now(),
      });
    }
    return { success: true };
  },
});
