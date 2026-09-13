import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

function generateRandomHex(length = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Submit a complete admission application
 */
export const submitApplication = mutation({
  args: {
    userId: v.id("users"),
    departmentId: v.optional(v.string()),
    degreeProgramId: v.optional(v.string()),
    personalInformation: v.object({
      fullName: v.string(),
      fatherName: v.string(),
      dateOfBirth: v.string(),
      gender: v.string(),
      cnic: v.string(),
      email: v.string(),
      phone: v.string(),
      alternatePhone: v.optional(v.string()),
      nationality: v.string(),
      domicile: v.string(),
      address: v.string(),
      city: v.string(),
      province: v.string(),
    }),
    academicInformation: v.object({
      degreeApplyingFor: v.string(),
      programType: v.string(),
      preferredCampus: v.string(),
      admissionType: v.string(),
      previousQualification: v.string(),
      schoolCollege: v.string(),
      boardUniversity: v.string(),
      passingYear: v.string(),
      totalMarks: v.string(),
      obtainedMarks: v.string(),
      percentage: v.string(),
    }),
    programPreferences: v.object({
      firstChoice: v.string(),
      secondChoice: v.string(),
      shift: v.string(),
      intake: v.string(),
    }),
    guardianInformation: v.object({
      guardianName: v.string(),
      relationship: v.string(),
      guardianCnic: v.string(),
      guardianPhone: v.string(),
      guardianEmail: v.optional(v.string()),
      occupation: v.string(),
      monthlyIncome: v.string(),
    }),
    documents: v.array(
      v.object({
        name: v.string(),
        documentType: v.string(),
        storageId: v.string(),
        fileName: v.string(),
        fileSize: v.number(),
        uploadedAt: v.number(),
      })
    ),
    finalDeclaration: v.object({
      hearAboutUs: v.string(),
      agreedTerms: v.boolean(),
      agreedDeclaration: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User account not found.");
    }

    if (!args.finalDeclaration.agreedTerms || !args.finalDeclaration.agreedDeclaration) {
      throw new Error("You must agree to the university terms and declaration before submitting.");
    }

    // Check if user already submitted an application
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing && (existing.status === "Pending" || existing.status === "Under Review" || existing.status === "Approved")) {
      throw new Error("You have already submitted an active admission application.");
    }

    // 1. Relational Department & Degree Program Validation
    let deptId = args.departmentId;
    let progId = args.degreeProgramId;
    let deptName = "";
    let progName = "";

    if (deptId && progId) {
      const deptRecord = await ctx.db.get(deptId as any);
      if (!deptRecord) {
        throw new Error("The selected department does not exist in the university database.");
      }
      if ((deptRecord as any).status !== "active") {
        throw new Error(`The department "${(deptRecord as any).name}" is not currently active for admissions.`);
      }

      const progRecord = await ctx.db.get(progId as any);
      if (!progRecord) {
        throw new Error("The selected degree program does not exist in the university database.");
      }
      if ((progRecord as any).status !== "active") {
        throw new Error(`The degree program "${(progRecord as any).name}" is not currently active for admissions.`);
      }

      // Verify that Degree Program strictly belongs to selected Department
      const progDeptId = (progRecord as any).departmentId;
      const progDeptName = (progRecord as any).department?.trim().toLowerCase();
      const targetDeptId = deptRecord._id;
      const targetDeptName = (deptRecord as any).name?.trim().toLowerCase();

      const belongs =
        (progDeptId && progDeptId === targetDeptId) ||
        (progDeptName && targetDeptName && progDeptName === targetDeptName);

      if (!belongs) {
        throw new Error(
          `Invalid academic configuration: Degree program "${(progRecord as any).name}" does not belong to the selected department "${(deptRecord as any).name}".`
        );
      }

      deptName = (deptRecord as any).name;
      progName = (progRecord as any).name;
    } else {
      // Lookup based on program name if legacy call
      const targetProgName = args.programPreferences.firstChoice || args.academicInformation.degreeApplyingFor;
      const foundProg = await ctx.db
        .query("academicPrograms")
        .filter((q) => q.eq(q.field("name"), targetProgName))
        .first();

      if (foundProg) {
        progId = foundProg._id;
        progName = foundProg.name;
        if (foundProg.departmentId) {
          deptId = foundProg.departmentId;
          const d = await ctx.db.get(foundProg.departmentId as any);
          if (d) deptName = (d as any).name;
        } else if (foundProg.department) {
          const d = await ctx.db
            .query("departments")
            .filter((q) => q.eq(q.field("name"), foundProg.department))
            .first();
          if (d) {
            deptId = d._id;
            deptName = d.name;
          }
        }
      }
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `APP-2026-${randomSuffix}`;
    const now = Date.now();

    const id = await ctx.db.insert("applications", {
      userId: args.userId,
      applicationId,
      departmentId: deptId,
      degreeProgramId: progId,
      personalInformation: args.personalInformation,
      academicInformation: {
        ...args.academicInformation,
        degreeApplyingFor: progName || args.academicInformation.degreeApplyingFor,
      },
      programPreferences: {
        ...args.programPreferences,
        firstChoice: progName || args.programPreferences.firstChoice,
      },
      guardianInformation: args.guardianInformation,
      documents: args.documents,
      finalDeclaration: args.finalDeclaration,
      status: "Pending",
      submittedAt: now,
    });

    // Notify applicant
    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: "Admission Application Received",
      message: `Your admission application (${applicationId}) has been successfully submitted and is currently pending review by the Admissions Committee.`,
      type: "admission",
      link: "/status",
      read: false,
      createdAt: now,
    });

    return { success: true, applicationId, id };
  },
});

/**
 * Get application for the logged-in user
 */
export const getMyApplication = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db
      .query("applications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();

    if (!app) return null;

    // Resolve storage URLs for documents
    const documentsWithUrls = await Promise.all(
      app.documents.map(async (doc) => {
        const url = await ctx.storage.getUrl(doc.storageId);
        return {
          ...doc,
          url: url || "",
        };
      })
    );

    return {
      ...app,
      documents: documentsWithUrls,
    };
  },
});

/**
 * Get all pending applications for the admin dashboard
 */
export const getPendingApplications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("applications")
      .withIndex("by_status", (q) => q.eq("status", "Pending"))
      .order("desc")
      .collect();
  },
});

/**
 * Get all applications with counts & filters for the admin portal
 */
export const getAllApplications = query({
  args: {
    statusFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("applications").order("desc").collect();

    const counts = {
      total: all.length,
      pending: all.filter((a) => a.status === "Pending").length,
      underReview: all.filter((a) => a.status === "Under Review").length,
      approved: all.filter((a) => a.status === "Approved").length,
      rejected: all.filter((a) => a.status === "Rejected").length,
    };

    let filtered = all;
    if (args.statusFilter && args.statusFilter !== "All") {
      filtered = all.filter((a) => a.status === args.statusFilter);
    }

    return {
      applications: filtered,
      counts,
    };
  },
});

/**
 * Get complete application details by ID (including document preview URLs)
 */
export const getApplicationById = query({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.applicationId);
    if (!app) return null;

    const user = await ctx.db.get(app.userId);

    const documentsWithUrls = await Promise.all(
      app.documents.map(async (doc) => {
        const url = await ctx.storage.getUrl(doc.storageId);
        return {
          ...doc,
          url: url || "",
        };
      })
    );

    return {
      ...app,
      userEmail: user?.email,
      documents: documentsWithUrls,
    };
  },
});

/**
 * Approve an admission application
 * Generates unique university email, creates one-time setup token, marks status as Approved
 */
export const approveApplication = mutation({
  args: {
    applicationId: v.id("applications"),
    adminId: v.string(),
    adminName: v.string(),
    remarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.applicationId);
    if (!app) {
      throw new Error("Application record not found.");
    }

    if (app.status === "Approved") {
      throw new Error("This application has already been approved.");
    }

    const user = await ctx.db.get(app.userId);
    if (!user) {
      throw new Error("Applicant user record not found.");
    }

    // 1. Generate unique university email
    const nameParts = app.personalInformation.fullName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    let basePrefix = "student";
    if (nameParts.length >= 2) {
      basePrefix = `${nameParts[0]}.${nameParts[nameParts.length - 1]}`;
    } else if (nameParts.length === 1) {
      basePrefix = nameParts[0];
    }

    const domain = "isb.iqra.edu.pk";
    let candidateEmail = `${basePrefix}@${domain}`;
    let iteration = 1;

    // Verify uniqueness in database
    while (true) {
      const collision = await ctx.db
        .query("users")
        .withIndex("by_universityEmail", (q) => q.eq("universityEmail", candidateEmail))
        .first();

      if (!collision || collision._id === user._id) {
        break;
      }
      iteration++;
      candidateEmail = `${basePrefix}${iteration}@${domain}`;
    }

    const generatedUniversityEmail = candidateEmail;

    // 2. Generate secure single-use password setup token (expires in 48 hours)
    const setupToken = generateRandomHex(32);
    const expiresAt = Date.now() + 48 * 60 * 60 * 1000;

    // 3. Resolve Academic Department and Degree Program from real Admin database records
    let deptRecord = app.departmentId ? await ctx.db.get(app.departmentId as any) : null;
    let progRecord = app.degreeProgramId ? await ctx.db.get(app.degreeProgramId as any) : null;

    if (!progRecord && app.academicInformation?.degreeApplyingFor) {
      progRecord = await ctx.db
        .query("academicPrograms")
        .filter((q) => q.eq(q.field("name"), app.academicInformation.degreeApplyingFor))
        .first();
    }

    if (!deptRecord && progRecord) {
      if ((progRecord as any).departmentId) {
        deptRecord = await ctx.db.get((progRecord as any).departmentId as any);
      } else if ((progRecord as any).department) {
        deptRecord = await ctx.db
          .query("departments")
          .filter((q) => q.eq(q.field("name"), (progRecord as any).department))
          .first();
      }
    }

    const resolvedDeptId = deptRecord ? deptRecord._id : app.departmentId;
    const resolvedDeptName = deptRecord ? (deptRecord as any).name : (app.academicInformation as any)?.department || "Academic Department";
    const resolvedProgId = progRecord ? progRecord._id : app.degreeProgramId;
    const resolvedProgName = progRecord ? (progRecord as any).name : app.academicInformation?.degreeApplyingFor || "Degree Program";
    const deptCode = deptRecord ? (deptRecord as any).code : "CS";

    // 4. Generate student enrollment ID with actual department code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const enrollmentId = user.enrollmentId || `IU-${deptCode}-2026-${randomSuffix}`;

    const now = Date.now();

    // 5. Update user account preserving exact relational academic IDs
    await ctx.db.patch(user._id, {
      role: "student",
      universityEmail: generatedUniversityEmail,
      personalEmail: user.email,
      accountStatus: "pending_password_setup",
      passwordSetupToken: setupToken,
      passwordSetupTokenExpiresAt: expiresAt,
      enrollmentId,
      department: resolvedDeptName,
      departmentId: resolvedDeptId,
      degreeProgram: resolvedProgName,
      degreeProgramId: resolvedProgId,
      currentSemester: 1,
      updatedAt: now,
    });

    // 5. Update application status
    await ctx.db.patch(app._id, {
      status: "Approved",
      reviewedAt: now,
      reviewedBy: args.adminName,
      adminRemarks: args.remarks || "Admissions criteria verified and approved.",
      generatedUniversityEmail,
    });

    // 6. Log decision
    await ctx.db.insert("approvalDecisions", {
      applicationId: app._id,
      adminId: args.adminId,
      adminName: args.adminName,
      decision: "approve",
      previousStatus: app.status,
      newStatus: "Approved",
      remarks: args.remarks,
      generatedUniversityEmail,
      timestamp: now,
    });

    // 7. Create in-app approval notification with setup link
    await ctx.db.insert("notifications", {
      userId: user._id,
      title: "Congratulations! Admission Approved",
      message: `Your admission application (${app.applicationId}) has been approved! Your official university email is ${generatedUniversityEmail}. Please click here to set your university account password.`,
      type: "admission",
      link: `/setup-password?token=${setupToken}`,
      read: false,
      createdAt: now,
    });

    console.log(`[Admissions Approval] Approving application ${app.applicationId} for student "${app.personalInformation.fullName}" by admin "${args.adminName}"`);
    console.log(`[Token Generation] Generated secure password setup token for user ${user._id} (${user.email}), expires at ${new Date(expiresAt).toISOString()}`);

    return {
      success: true,
      applicationId: app.applicationId,
      generatedUniversityEmail,
      setupToken,
      studentName: app.personalInformation.fullName,
      personalEmail: user.email,
      userId: user._id,
    };
  },
});

/**
 * Reject an admission application with remarks
 */
export const rejectApplication = mutation({
  args: {
    applicationId: v.id("applications"),
    adminId: v.string(),
    adminName: v.string(),
    remarks: v.string(),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.applicationId);
    if (!app) {
      throw new Error("Application record not found.");
    }

    const now = Date.now();

    await ctx.db.patch(app._id, {
      status: "Rejected",
      reviewedAt: now,
      reviewedBy: args.adminName,
      adminRemarks: args.remarks,
    });

    await ctx.db.insert("approvalDecisions", {
      applicationId: app._id,
      adminId: args.adminId,
      adminName: args.adminName,
      decision: "reject",
      previousStatus: app.status,
      newStatus: "Rejected",
      remarks: args.remarks,
      timestamp: now,
    });

    await ctx.db.insert("notifications", {
      userId: app.userId,
      title: "Admission Application Status Update",
      message: `Your admission application (${app.applicationId}) has been reviewed. Remarks: ${args.remarks}`,
      type: "admission",
      link: "/status",
      read: false,
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Mutation: Update email sending status on the application and latest approval decision
 */
export const updateApprovalEmailStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    sent: v.boolean(),
    recipient: v.string(),
    error: v.optional(v.string()),
    messageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.applicationId);
    if (!app) return { success: false, message: "Application not found" };

    const now = Date.now();
    await ctx.db.patch(app._id, {
      approvalEmailSent: args.sent,
      approvalEmailSentAt: now,
      approvalEmailRecipient: args.recipient,
      approvalEmailError: args.error,
    });

    // Also update decision log if exists
    const decision = await ctx.db
      .query("approvalDecisions")
      .withIndex("by_applicationId", (q) => q.eq("applicationId", app._id))
      .order("desc")
      .first();

    if (decision) {
      await ctx.db.patch(decision._id, {
        approvalEmailSent: args.sent,
        approvalEmailSentAt: now,
        approvalEmailRecipient: args.recipient,
        approvalEmailError: args.error,
      });
    }

    return { success: true };
  },
});

/**
 * Action: Full Admission Approval & Brevo Email Dispatch Workflow
 * 1. Executes the mutation to approve application and generate setup token
 * 2. Immediately triggers Brevo email sending
 * 3. Returns structured error if email fails, or confirmation when successful
 */
export const approveApplicationWithEmail = action({
  args: {
    applicationId: v.id("applications"),
    adminId: v.string(),
    adminName: v.string(),
    remarks: v.optional(v.string()),
    appUrl: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    console.log(`[Approval Workflow] Starting approval with email for application: ${args.applicationId}`);

    // Step 1: Approve application and generate credentials
    let approvalResult: any;
    try {
      approvalResult = await ctx.runMutation(api.applications.approveApplication, {
        applicationId: args.applicationId,
        adminId: args.adminId,
        adminName: args.adminName,
        remarks: args.remarks,
      });
    } catch (err: any) {
      console.error("[Approval Workflow Error] Mutation failed:", err?.message || err);
      return {
        success: false,
        code: "APPROVAL_MUTATION_FAILED",
        message: err?.message || "Failed to update admission application status.",
      };
    }

    if (!approvalResult || !approvalResult.success) {
      return {
        success: false,
        code: "APPROVAL_FAILED",
        message: "Application could not be approved.",
      };
    }

    console.log(`[Approval Workflow] Application approved. Now dispatching Brevo setup email to ${approvalResult.personalEmail}`);

    // Step 2: Dispatch password setup email via Brevo
    const emailResult = await ctx.runAction(api.emails.sendPasswordSetupEmail, {
      applicationId: args.applicationId,
      studentName: approvalResult.studentName,
      studentEmail: approvalResult.personalEmail,
      universityEmail: approvalResult.generatedUniversityEmail,
      setupToken: approvalResult.setupToken,
      appUrl: args.appUrl,
      applicationRefId: approvalResult.applicationId,
    });

    if (!emailResult.success) {
      console.error(`[Approval Workflow Warning] Email dispatch failed: ${emailResult.message}`);
      return {
        success: false,
        code: "EMAIL_SEND_FAILED",
        message: "Application was approved, but the password setup email could not be sent.",
        emailError: emailResult.message,
        applicationId: approvalResult.applicationId,
        generatedUniversityEmail: approvalResult.generatedUniversityEmail,
        studentName: approvalResult.studentName,
        personalEmail: approvalResult.personalEmail,
        setupToken: approvalResult.setupToken,
        emailSent: false,
      };
    }

    console.log(`[Approval Workflow Success] Complete flow succeeded! MessageId: ${emailResult.messageId}`);
    return {
      success: true,
      code: "APPROVED_AND_EMAILED",
      message: "Application was approved and password setup email was sent successfully to student.",
      applicationId: approvalResult.applicationId,
      generatedUniversityEmail: approvalResult.generatedUniversityEmail,
      studentName: approvalResult.studentName,
      personalEmail: approvalResult.personalEmail,
      setupToken: approvalResult.setupToken,
      emailSent: true,
      messageId: emailResult.messageId,
    };
  },
});

/**
 * Action: Resend password setup email if previously failed or requested
 */
export const resendPasswordSetupEmail = action({
  args: {
    applicationId: v.id("applications"),
    appUrl: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    const app = await ctx.runQuery(api.applications.getApplicationById, {
      applicationId: args.applicationId,
    });

    if (!app) {
      return { success: false, message: "Application record not found." };
    }

    if (app.status !== "Approved") {
      return { success: false, message: "Only approved applications can receive a password setup email." };
    }

    const user = await ctx.runQuery(api.users.getUserById, { userId: app.userId });
    if (!user) {
      return { success: false, message: "User account not found." };
    }

    if (!user.passwordSetupToken) {
      return {
        success: false,
        message: "No active password setup token found. The student's account password may already be configured.",
      };
    }

    const emailResult = await ctx.runAction(api.emails.sendPasswordSetupEmail, {
      applicationId: args.applicationId,
      studentName: app.personalInformation.fullName,
      studentEmail: user.personalEmail || user.email || app.personalInformation.email,
      universityEmail: app.generatedUniversityEmail || user.universityEmail || "",
      setupToken: user.passwordSetupToken,
      appUrl: args.appUrl,
      applicationRefId: app.applicationId,
    });

    return emailResult;
  },
});

