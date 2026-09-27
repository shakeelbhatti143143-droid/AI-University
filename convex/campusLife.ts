import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// 1. LEARNING RESOURCES
// ---------------------------------------------------------------------------

export const getLearningResources = query({
  args: {
    category: v.optional(v.string()),
    department: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let resources = await ctx.db
      .query("learningResources")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    if (args.category && args.category !== "All") {
      resources = resources.filter((r) => r.category === args.category);
    }
    if (args.department && args.department !== "All") {
      resources = resources.filter(
        (r) => !r.department || r.department === args.department
      );
    }
    if (args.search && args.search.trim()) {
      const q = args.search.toLowerCase().trim();
      resources = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return resources.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const addLearningResource = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    description: v.string(),
    link: v.string(),
    fileType: v.string(),
    fileSize: v.optional(v.string()),
    tags: v.array(v.string()),
    department: v.optional(v.string()),
    author: v.optional(v.string()),
    publisher: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("learningResources", {
      ...args,
      downloadsCount: 0,
      status: "Active",
      createdAt: Date.now(),
    });
  },
});

export const incrementResourceDownload = mutation({
  args: {
    resourceId: v.id("learningResources"),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db.get(args.resourceId);
    if (!res) return null;
    await ctx.db.patch(args.resourceId, {
      downloadsCount: (res.downloadsCount || 0) + 1,
    });
    return true;
  },
});

// ---------------------------------------------------------------------------
// 2. COURSE MATERIALS
// ---------------------------------------------------------------------------

export const getCourseMaterials = query({
  args: {
    courseCode: v.optional(v.string()),
    weekNumber: v.optional(v.number()),
    materialType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let materials = await ctx.db.query("courseMaterials").collect();

    materials = materials.filter((m) => m.status === "Published");

    if (args.courseCode && args.courseCode !== "All") {
      materials = materials.filter(
        (m) => m.courseCode.toLowerCase() === args.courseCode?.toLowerCase()
      );
    }
    if (args.weekNumber && args.weekNumber > 0) {
      materials = materials.filter((m) => m.weekNumber === args.weekNumber);
    }
    if (args.materialType && args.materialType !== "All") {
      materials = materials.filter((m) => m.materialType === args.materialType);
    }

    return materials.sort((a, b) => a.weekNumber - b.weekNumber);
  },
});

export const addCourseMaterial = mutation({
  args: {
    courseCode: v.string(),
    courseTitle: v.string(),
    weekNumber: v.number(),
    topicTitle: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    materialType: v.union(
      v.literal("Lecture Slides"),
      v.literal("Reading Notes"),
      v.literal("Lab Manual"),
      v.literal("Source Code"),
      v.literal("Reference Material")
    ),
    fileUrl: v.string(),
    fileType: v.string(),
    fileSize: v.string(),
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("courseMaterials", {
      ...args,
      status: "Published",
      createdAt: Date.now(),
    });
  },
});

// ---------------------------------------------------------------------------
// 3. CAMPUS EVENTS & ACTIVITIES
// ---------------------------------------------------------------------------

export const getCampusEvents = query({
  args: {
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("campusEvents").collect();

    if (args.category && args.category !== "All") {
      events = events.filter((e) => e.category === args.category);
    }
    if (args.status && args.status !== "All") {
      events = events.filter((e) => e.status === args.status);
    }

    return events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  },
});

export const registerForEvent = mutation({
  args: {
    eventId: v.id("campusEvents"),
    studentId: v.string(),
    studentName: v.string(),
    studentEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    const alreadyRegistered = event.registeredStudents?.some(
      (s) => s.studentId === args.studentId || s.studentEmail === args.studentEmail
    );

    if (alreadyRegistered) {
      return { success: true, message: "You are already registered for this event." };
    }

    if (event.registeredCount >= event.capacity) {
      throw new Error("This event has reached full capacity.");
    }

    const updatedStudents = [
      ...(event.registeredStudents || []),
      {
        studentId: args.studentId,
        studentName: args.studentName,
        studentEmail: args.studentEmail,
        registeredAt: Date.now(),
      },
    ];

    await ctx.db.patch(args.eventId, {
      registeredCount: updatedStudents.length,
      registeredStudents: updatedStudents,
    });

    return {
      success: true,
      message: `Registration confirmed for ${event.title}!`,
      ticketNumber: `EVT-${Date.now().toString().slice(-6)}`,
    };
  },
});

export const addCampusEvent = mutation({
  args: {
    title: v.string(),
    category: v.union(
      v.literal("Hackathon"),
      v.literal("Seminar"),
      v.literal("Workshop"),
      v.literal("Sports"),
      v.literal("Cultural"),
      v.literal("Career Fair")
    ),
    description: v.string(),
    date: v.string(),
    time: v.string(),
    venue: v.string(),
    campus: v.string(),
    organizer: v.string(),
    capacity: v.number(),
    bannerUrl: v.optional(v.string()),
    registrationDeadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("campusEvents", {
      ...args,
      registeredCount: 0,
      registeredStudents: [],
      status: "Upcoming",
      createdAt: Date.now(),
    });
  },
});

// ---------------------------------------------------------------------------
// 4. CAREER & INTERNSHIPS
// ---------------------------------------------------------------------------

export const getCareerOpportunities = query({
  args: {
    roleType: v.optional(v.string()),
    workModel: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let jobs = await ctx.db
      .query("careerOpportunities")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    if (args.roleType && args.roleType !== "All") {
      jobs = jobs.filter((j) => j.roleType === args.roleType);
    }
    if (args.workModel && args.workModel !== "All") {
      jobs = jobs.filter((j) => j.workModel === args.workModel);
    }
    if (args.search && args.search.trim()) {
      const q = args.search.toLowerCase().trim();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.location.toLowerCase().includes(q)
      );
    }

    return jobs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const applyForOpportunity = mutation({
  args: {
    opportunityId: v.id("careerOpportunities"),
    studentId: v.string(),
    studentName: v.string(),
    studentEmail: v.string(),
    portfolioUrl: v.optional(v.string()),
    coverNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const opp = await ctx.db.get(args.opportunityId);
    if (!opp) throw new Error("Opportunity not found");

    await ctx.db.patch(args.opportunityId, {
      applicantsCount: (opp.applicantsCount || 0) + 1,
    });

    return {
      success: true,
      message: `Your application has been forwarded to ${opp.company} talent acquisition.`,
      referenceCode: `APP-CAR-${Date.now().toString().slice(-6)}`,
    };
  },
});

export const addCareerOpportunity = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    companyLogo: v.optional(v.string()),
    roleType: v.union(
      v.literal("Internship"),
      v.literal("Full-Time"),
      v.literal("Part-Time"),
      v.literal("Contract")
    ),
    workModel: v.union(v.literal("On-Site"), v.literal("Hybrid"), v.literal("Remote")),
    location: v.string(),
    stipendSalary: v.string(),
    department: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    skills: v.array(v.string()),
    deadline: v.string(),
    applyUrl: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("careerOpportunities", {
      ...args,
      applicantsCount: 0,
      status: "Active",
      createdAt: Date.now(),
    });
  },
});
