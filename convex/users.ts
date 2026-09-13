import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get user by ID
 */
export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      personalEmail: user.personalEmail,
      universityEmail: user.universityEmail,
      role: user.role,
      accountStatus: user.accountStatus,
      enrollmentId: user.enrollmentId,
      department: user.department,
      profilePhoto: user.profilePhoto,
      passwordSetupToken: user.passwordSetupToken,
      passwordSetupTokenExpiresAt: user.passwordSetupTokenExpiresAt,
      createdAt: user.createdAt,
    };
  },
});

/**
 * Update user's profile photo
 */
export const updateProfilePhoto = mutation({
  args: {
    userId: v.id("users"),
    storageId: v.optional(v.string()),
    photoUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User record not found.");
    }

    await ctx.db.patch(args.userId, {
      profilePhoto: args.photoUrl,
      profilePhotoStorageId: args.storageId,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      photoUrl: args.photoUrl,
    };
  },
});

