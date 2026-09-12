import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(), // primary login email or applicant email
    personalEmail: v.optional(v.string()),
    universityEmail: v.optional(v.string()), // official university email once approved
    passwordHash: v.string(),
    salt: v.string(),
    role: v.union(
      v.literal("applicant"),
      v.literal("student"),
      v.literal("teacher"),
      v.literal("admin"),
      v.literal("staff")
    ),
    accountStatus: v.optional(
      v.union(
        v.literal("pending_application"),
        v.literal("pending_password_setup"),
        v.literal("active"),
        v.literal("suspended")
      )
    ),
    enrollmentId: v.optional(v.string()),
    department: v.optional(v.string()),
    passwordSetupToken: v.optional(v.string()),
    passwordSetupTokenExpiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_universityEmail", ["universityEmail"])
    .index("by_role", ["role"])
    .index("by_passwordSetupToken", ["passwordSetupToken"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),

  programs: defineTable({
    code: v.string(),
    name: v.string(),
    degreeType: v.union(
      v.literal("Undergraduate"),
      v.literal("Graduate"),
      v.literal("Postgraduate")
    ),
    campus: v.string(),
    department: v.string(),
    availableIntakes: v.array(v.string()), // ["Spring", "Fall"]
    availableShifts: v.array(v.string()), // ["Morning", "Evening"]
    status: v.union(v.literal("active"), v.literal("inactive")),
  })
    .index("by_code", ["code"])
    .index("by_status", ["status"]),

  applications: defineTable({
    userId: v.id("users"),
    applicationId: v.string(), // e.g. APP-2026-1042
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
    status: v.union(
      v.literal("Pending"),
      v.literal("Under Review"),
      v.literal("Approved"),
      v.literal("Rejected")
    ),
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    adminRemarks: v.optional(v.string()),
    generatedUniversityEmail: v.optional(v.string()),
    approvalEmailSent: v.optional(v.boolean()),
    approvalEmailSentAt: v.optional(v.number()),
    approvalEmailError: v.optional(v.string()),
    approvalEmailRecipient: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_applicationId", ["applicationId"])
    .index("by_status", ["status"]),

  approvalDecisions: defineTable({
    applicationId: v.id("applications"),
    adminId: v.string(),
    adminName: v.string(),
    decision: v.union(v.literal("approve"), v.literal("reject")),
    previousStatus: v.string(),
    newStatus: v.string(),
    remarks: v.optional(v.string()),
    generatedUniversityEmail: v.optional(v.string()),
    approvalEmailSent: v.optional(v.boolean()),
    approvalEmailSentAt: v.optional(v.number()),
    approvalEmailError: v.optional(v.string()),
    approvalEmailRecipient: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_applicationId", ["applicationId"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("admission"),
      v.literal("system"),
      v.literal("academic"),
      v.literal("security")
    ),
    link: v.optional(v.string()),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  universityVideos: defineTable({
    title: v.string(),
    description: v.string(),
    videoStorageId: v.string(),
    videoFileName: v.string(),
    videoFileSize: v.number(),
    thumbnailStorageId: v.optional(v.string()),
    thumbnailFileName: v.optional(v.string()),
    status: v.union(v.literal("published"), v.literal("draft")),
    displayOrder: v.number(),
    duration: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_displayOrder", ["displayOrder"])
    .index("by_status_and_order", ["status", "displayOrder"]),
});

