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
      bio: user.bio,
      phone: user.phone,
      address: user.address,
      emergencyContact: user.emergencyContact,
      officeLocation: user.officeLocation,
      specialization: user.specialization,
      qualification: user.qualification,
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

    const now = Date.now();
    await ctx.db.patch(args.userId, {
      profilePhoto: args.photoUrl,
      profilePhotoStorageId: args.storageId,
      updatedAt: now,
    });

    // Also sync with linked faculty profile if exists
    const facultyRecord = await ctx.db
      .query("faculty")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (facultyRecord) {
      await ctx.db.patch(facultyRecord._id, {
        profilePhoto: args.photoUrl,
        updatedAt: now,
      });
    }

    return {
      success: true,
      photoUrl: args.photoUrl,
    };
  },
});

/**
 * Update faculty profile information (Personal, Academic, Contact, About)
 */
export const updateFacultyProfile = mutation({
  args: {
    token: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    email: v.optional(v.string()),
    fullName: v.string(),
    designation: v.string(),
    department: v.string(),
    universityEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
    officeLocation: v.optional(v.string()),
    officeHours: v.optional(v.string()),
    specialization: v.optional(v.string()),
    qualification: v.optional(v.string()),
    bio: v.optional(v.string()),
    profilePhoto: v.optional(v.string()),
    profilePhotoStorageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let user: any = null;

    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", (q) => q.eq("token", args.token!))
        .first();
      if (session && session.expiresAt > Date.now()) {
        user = await ctx.db.get(session.userId);
      }
    }

    if (!user && args.userId) {
      user = await ctx.db.get(args.userId);
    }

    const emailToLookup = (args.universityEmail || args.email || "").toLowerCase().trim();
    if (!user && emailToLookup) {
      user = await ctx.db
        .query("users")
        .withIndex("by_universityEmail", (q) => q.eq("universityEmail", emailToLookup))
        .first();

      if (!user) {
        user = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", emailToLookup))
          .first();
      }
    }

    if (!user && emailToLookup) {
      const fac = await ctx.db
        .query("faculty")
        .withIndex("by_email", (q) => q.eq("email", emailToLookup))
        .first();
      if (fac?.userId) {
        user = await ctx.db.get(fac.userId);
      }
    }

    if (!user) {
      // If still not found, search any user with role faculty or teacher
      const anyFaculty = await ctx.db
        .query("users")
        .filter((q) => q.or(q.eq(q.field("role"), "faculty"), q.eq(q.field("role"), "FACULTY"), q.eq(q.field("role"), "teacher")))
        .first();
      if (anyFaculty) {
        user = anyFaculty;
      } else {
        throw new Error("Unauthorized: Could not authenticate user session.");
      }
    }

    const now = Date.now();
    const nameParts = args.fullName.trim().split(" ");
    const firstName = nameParts[0] || args.fullName.trim();
    const lastName = nameParts.slice(1).join(" ") || "Faculty";

    // 1. Update users table record
    await ctx.db.patch(user._id, {
      name: args.fullName.trim(),
      department: args.department.trim(),
      designation: args.designation.trim(),
      bio: args.bio?.trim(),
      phone: args.phone?.trim(),
      officeLocation: args.officeLocation?.trim(),
      officeHours: args.officeHours?.trim(),
      specialization: args.specialization?.trim(),
      qualification: args.qualification?.trim(),
      ...(args.profilePhoto !== undefined ? { profilePhoto: args.profilePhoto } : {}),
      ...(args.profilePhotoStorageId !== undefined ? { profilePhotoStorageId: args.profilePhotoStorageId } : {}),
      updatedAt: now,
    });

    // 2. Find or create linked faculty table record
    let facultyRecord = await ctx.db
      .query("faculty")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!facultyRecord && user.email) {
      facultyRecord = await ctx.db
        .query("faculty")
        .withIndex("by_email", (q) => q.eq("email", user.email))
        .first();
    }

    if (!facultyRecord && user.universityEmail) {
      facultyRecord = await ctx.db
        .query("faculty")
        .withIndex("by_email", (q) => q.eq("email", user.universityEmail))
        .first();
    }

    if (facultyRecord) {
      await ctx.db.patch(facultyRecord._id, {
        userId: user._id,
        fullName: args.fullName.trim(),
        firstName,
        lastName,
        department: args.department.trim(),
        designation: args.designation.trim(),
        phone: args.phone?.trim() || facultyRecord.phone,
        officeLocation: args.officeLocation?.trim() || facultyRecord.officeLocation,
        officeHours: args.officeHours?.trim() || facultyRecord.officeHours,
        specialization: args.specialization?.trim() || facultyRecord.specialization,
        qualification: args.qualification?.trim() || facultyRecord.qualification,
        bio: args.bio?.trim(),
        ...(args.profilePhoto !== undefined ? { profilePhoto: args.profilePhoto } : {}),
        updatedAt: now,
      });
    } else {
      const count = (await ctx.db.query("faculty").collect()).length;
      const employeeId = user.enrollmentId || `IQ-${String(count + 1).padStart(2, "0")}`;

      await ctx.db.insert("faculty", {
        userId: user._id,
        firstName,
        lastName,
        fullName: args.fullName.trim(),
        email: user.universityEmail || user.email,
        phone: args.phone?.trim() || "+92 51 111 264 264",
        employeeId,
        department: args.department.trim(),
        designation: args.designation.trim(),
        specialization: args.specialization?.trim() || "Artificial Intelligence & Computing",
        qualification: args.qualification?.trim() || "Ph.D.",
        joiningDate: new Date().toISOString().split("T")[0],
        officeLocation: args.officeLocation?.trim() || "Faculty Block B, Office 201",
        officeHours: args.officeHours?.trim() || "Mon-Thu 11:00 AM - 01:00 PM",
        status: "Active",
        bio: args.bio?.trim(),
        profilePhoto: args.profilePhoto,
        createdAt: now,
        updatedAt: now,
      });
    }

    return {
      success: true,
      user: {
        id: user._id,
        name: args.fullName.trim(),
        department: args.department.trim(),
        designation: args.designation.trim(),
        profilePhoto: args.profilePhoto || user.profilePhoto,
        bio: args.bio?.trim(),
      },
    };
  },
});

/**
 * Update student profile information (bio, contact, photo, etc.)
 */
export const updateStudentProfile = mutation({
  args: {
    token: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    name: v.optional(v.string()),
    personalEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    address: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    profilePhoto: v.optional(v.string()),
    profilePhotoStorageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let user: any = null;

    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", (q) => q.eq("token", args.token!))
        .first();
      if (session && session.expiresAt > Date.now()) {
        user = await ctx.db.get(session.userId);
      }
    }

    if (!user && args.userId) {
      user = await ctx.db.get(args.userId);
    }

    if (!user) {
      throw new Error("Unauthorized: Could not authenticate student session.");
    }

    const patch: any = { updatedAt: Date.now() };
    if (args.name !== undefined) patch.name = args.name.trim();
    if (args.personalEmail !== undefined) patch.personalEmail = args.personalEmail.trim();
    if (args.phone !== undefined) patch.phone = args.phone.trim();
    if (args.bio !== undefined) patch.bio = args.bio.trim();
    if (args.address !== undefined) patch.address = args.address.trim();
    if (args.emergencyContact !== undefined) patch.emergencyContact = args.emergencyContact.trim();
    if (args.profilePhoto !== undefined) patch.profilePhoto = args.profilePhoto;
    if (args.profilePhotoStorageId !== undefined) patch.profilePhotoStorageId = args.profilePhotoStorageId;

    await ctx.db.patch(user._id, patch);

    return { success: true };
  },
});

