import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helpers for Web Crypto SHA-256 with Salt
async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateRandomHex(length = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password: string, salt: string): Promise<string> {
  let hash = await sha256(`${salt}:${password}`);
  for (let i = 0; i < 50; i++) {
    hash = await sha256(`${hash}:${salt}`);
  }
  return hash;
}

/**
 * Register a new applicant account
 */
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.optional(v.union(v.literal("applicant"), v.literal("student"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const name = args.name.trim();
    const role = args.role || "applicant";

    if (!name || name.length < 2) {
      throw new Error("Name must be at least 2 characters long.");
    }

    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }

    if (args.password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      throw new Error("An account with this email address already exists. Please sign in instead.");
    }

    const salt = generateRandomHex(16);
    const passwordHash = await hashPassword(args.password, salt);
    const now = Date.now();

    const userId = await ctx.db.insert("users", {
      name,
      email,
      personalEmail: email,
      passwordHash,
      salt,
      role: role as any,
      accountStatus: role === "applicant" ? "pending_application" : "active",
      department: "Computing & Artificial Intelligence",
      createdAt: now,
      updatedAt: now,
    });

    // Create session (expires in 30 days)
    const token = generateRandomHex(32);
    const expiresAt = now + 30 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt,
      createdAt: now,
    });

    return {
      token,
      user: {
        id: userId,
        name,
        email,
        personalEmail: email,
        universityEmail: undefined,
        role: role as any,
        accountStatus: role === "applicant" ? ("pending_application" as const) : ("active" as const),
        enrollmentId: undefined,
        department: "Computing & Artificial Intelligence",
        createdAt: now,
      },
    };
  },
});

/**
 * Ensure default administrator account exists in database
 */
export const ensureAdminAccount = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    const salt = generateRandomHex(16);
    const passwordHash = await hashPassword(args.password, salt);
    const now = Date.now();

    let adminId = existing?._id;
    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        role: "admin",
        accountStatus: "active",
        passwordHash,
        salt,
        updatedAt: now,
      });
    } else {
      adminId = await ctx.db.insert("users", {
        name: args.name,
        email,
        passwordHash,
        salt,
        role: "admin",
        accountStatus: "active",
        department: "Central Administration & Registrar Office",
        createdAt: now,
        updatedAt: now,
      });
    }

    // Also guarantee default student account is seeded and ready
    const studentEmail = "student@isb.iqra.edu.pk";
    const existingStudent = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", studentEmail))
      .first();

    const studentSalt = generateRandomHex(16);
    const studentPasswordHash = await hashPassword("studentPassword123!", studentSalt);

    if (existingStudent) {
      await ctx.db.patch(existingStudent._id, {
        role: "student",
        accountStatus: "active",
        passwordHash: studentPasswordHash,
        salt: studentSalt,
        enrollmentId: existingStudent.enrollmentId || "IU-ISB-2024-0418",
        department: "Department of Computing & Artificial Intelligence",
        degreeProgram: "Bachelor of Science in Computer Science (BSCS)",
        currentSemester: 5,
        universityEmail: studentEmail,
      });
    } else {
      await ctx.db.insert("users", {
        name: "Muhammad Hamza Khan",
        email: studentEmail,
        personalEmail: "hamzakhan@gmail.com",
        universityEmail: studentEmail,
        passwordHash: studentPasswordHash,
        salt: studentSalt,
        role: "student",
        accountStatus: "active",
        enrollmentId: "IU-ISB-2024-0418",
        department: "Department of Computing & Artificial Intelligence",
        degreeProgram: "Bachelor of Science in Computer Science (BSCS)",
        currentSemester: 5,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { id: adminId, existing: Boolean(existing) };
  },
});

/**
 * Log in with email and password
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const rawEmail = args.email.trim().toLowerCase();

    // Look up user by login email or official university email
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", rawEmail))
      .first();

    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_universityEmail", (q) => q.eq("universityEmail", rawEmail))
        .first();
    }

    if (!user) {
      return {
        success: false as const,
        code: "INVALID_CREDENTIALS" as const,
        message: "Invalid credentials. Account not found.",
      };
    }

    // If user is an approved student with a university email, enforce university email login
    if (
      user.role === "student" &&
      user.universityEmail &&
      user.accountStatus === "active" &&
      rawEmail !== user.universityEmail.toLowerCase() &&
      rawEmail === user.personalEmail?.toLowerCase()
    ) {
      return {
        success: false as const,
        code: "UNIVERSITY_EMAIL_REQUIRED" as const,
        message: `Admission approved! Please sign in using your official university email: ${user.universityEmail}`,
      };
    }

    // Check if student has not set password yet
    if (user.role === "student" && user.accountStatus === "pending_password_setup") {
      return {
        success: false as const,
        code: "PASSWORD_SETUP_REQUIRED" as const,
        message:
          "Your admission was approved. Please set your university account password using the password setup link sent to your email.",
        universityEmail: user.universityEmail,
      };
    }

    // Verify account status
    if (user.accountStatus === "suspended") {
      return {
        success: false as const,
        code: "ACCOUNT_SUSPENDED" as const,
        message: "This account is currently deactivated or suspended. Please contact the university administration.",
      };
    }

    const computedHash = await hashPassword(args.password, user.salt);
    if (computedHash !== user.passwordHash) {
      return {
        success: false as const,
        code: "INVALID_CREDENTIALS" as const,
        message: "Invalid credentials. Password does not match.",
      };
    }

    const now = Date.now();
    const token = generateRandomHex(32);
    const expiresAt = now + 30 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: now,
    });

    return {
      success: true as const,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.universityEmail || user.email,
        personalEmail: user.personalEmail || user.email,
        universityEmail: user.universityEmail,
        role: user.role,
        accountStatus: user.accountStatus,
        enrollmentId: user.enrollmentId,
        department: user.department,
        departmentId: user.departmentId,
        degreeProgram: user.degreeProgram,
        degreeProgramId: user.degreeProgramId,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
      },
    };
  },
});

/**
 * Verify validity of a password setup token
 */
export const verifySetupToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      return { valid: false, message: "No token provided." };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_passwordSetupToken", (q) => q.eq("passwordSetupToken", args.token))
      .first();

    if (!user) {
      return { valid: false, message: "Invalid or expired password setup link." };
    }

    if (user.passwordSetupTokenExpiresAt && user.passwordSetupTokenExpiresAt < Date.now()) {
      return { valid: false, message: "This password setup link has expired. Please contact admissions." };
    }

    return {
      valid: true,
      name: user.name,
      universityEmail: user.universityEmail,
    };
  },
});

/**
 * Set official university account password using the secure setup token
 */
export const setupUniversityPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_passwordSetupToken", (q) => q.eq("passwordSetupToken", args.token))
      .first();

    if (!user) {
      throw new Error("Invalid or expired password setup link.");
    }

    if (user.passwordSetupTokenExpiresAt && user.passwordSetupTokenExpiresAt < Date.now()) {
      throw new Error("This password setup link has expired. Please contact admissions.");
    }

    const salt = generateRandomHex(16);
    const passwordHash = await hashPassword(args.newPassword, salt);
    const now = Date.now();

    // Update user password, clear token, and activate account
    await ctx.db.patch(user._id, {
      passwordHash,
      salt,
      accountStatus: "active",
      passwordSetupToken: undefined,
      passwordSetupTokenExpiresAt: undefined,
      updatedAt: now,
    });

    // Create notification
    await ctx.db.insert("notifications", {
      userId: user._id,
      title: "University Account Activated",
      message: "Your university account password has been successfully configured. You can now log into the Student Portal.",
      type: "security",
      link: "/login",
      read: false,
      createdAt: now,
    });

    return {
      success: true,
      universityEmail: user.universityEmail,
    };
  },
});

/**
 * Securely change password for currently authenticated user (Faculty, Student, Admin)
 */
export const changePassword = mutation({
  args: {
    token: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long.");
    }

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Session has expired. Please log in again.");
    }

    const user = await ctx.db.get(session.userId);
    if (!user) {
      throw new Error("User account not found.");
    }

    const currentHash = await hashPassword(args.currentPassword, user.salt);
    if (currentHash !== user.passwordHash) {
      throw new Error("The current password entered is incorrect.");
    }

    const newSalt = generateRandomHex(16);
    const newHash = await hashPassword(args.newPassword, newSalt);
    const now = Date.now();

    await ctx.db.patch(user._id, {
      passwordHash: newHash,
      salt: newSalt,
      updatedAt: now,
    });

    await ctx.db.insert("notifications", {
      userId: user._id,
      title: "Password Changed Successfully",
      message: "Your account password was updated successfully.",
      type: "security",
      read: false,
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Logout and remove session
 */
export const logout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

/**
 * Get current authenticated user by session token
 */
export const getCurrentUser = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    let facultyRecord = null;
    const isFacultyRole = user.role === "faculty" || user.role === "FACULTY" || user.role === "teacher";
    if (isFacultyRole) {
      facultyRecord = await ctx.db
        .query("faculty")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();

      if (!facultyRecord && user.email) {
        facultyRecord = await ctx.db
          .query("faculty")
          .withIndex("by_email", (q) => q.eq("email", user.email))
          .first();
      }
    }

    return {
      id: user._id,
      name: facultyRecord?.fullName || user.name,
      email: user.universityEmail || user.email,
      personalEmail: user.personalEmail || user.email,
      universityEmail: user.universityEmail,
      role: user.role,
      accountStatus: user.accountStatus,
      enrollmentId: user.enrollmentId,
      department: facultyRecord?.department || user.department,
      departmentId: user.departmentId,
      degreeProgram: user.degreeProgram,
      degreeProgramId: user.degreeProgramId,
      currentSemester: user.currentSemester || 1,
      profilePhoto: facultyRecord?.profilePhoto || user.profilePhoto,
      designation: facultyRecord?.designation || user.designation || (isFacultyRole ? "Assistant Professor" : undefined),
      bio: facultyRecord?.bio || user.bio,
      phone: facultyRecord?.phone || user.phone,
      officeLocation: facultyRecord?.officeLocation || user.officeLocation,
      officeHours: facultyRecord?.officeHours || user.officeHours,
      specialization: facultyRecord?.specialization || user.specialization,
      qualification: facultyRecord?.qualification || user.qualification,
      createdAt: user.createdAt,
    };
  },
});
