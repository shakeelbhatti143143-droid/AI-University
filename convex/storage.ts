import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Generate an upload URL for secure file storage
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Get download/view URL for a stored document
 */
export const getDocumentUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
