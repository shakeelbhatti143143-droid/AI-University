import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// ============================================================================
// BASELINE DEFAULT OFFICIAL PROFILE DATA
// Used if the database has not been initialized with custom profile yet.
// ============================================================================
const DEFAULT_PROFILE = {
  name: "Iqra University",
  campusName: "Chak Shezad Campus, Islamabad",
  tagline: "Where Your Future Begins — Your Journey Towards Excellence Starts Here",
  overview:
    "Chartered by the Federal Government of Pakistan and recognized by the Higher Education Commission (HEC) in the highest W4 category, Iqra University Chak Shezad Campus stands as Islamabad's premier hub for innovative learning, research advancement, and academic distinction.",
  vision:
    "To be an internationally recognized center of academic excellence and research that equips future generations with cutting-edge artificial intelligence, technological proficiency, entrepreneurial spirit, and human-centric values.",
  mission:
    "To impart state-of-the-art education, foster ground-breaking scientific and technological research, and nurture ethical leaders capable of navigating complex global challenges through critical thinking, interdisciplinary innovation, and public service.",
  coreValues: [
    {
      title: "Academic Distinction",
      description: "Rigorous standards, outcome-based education, and contemporary curriculum aligned with global frontiers.",
    },
    {
      title: "Innovation & Research",
      description: "Cultivating inquiry-driven research in artificial intelligence, engineering, computing, and social sciences.",
    },
    {
      title: "Integrity & Ethics",
      description: "Upholding uncompromising honesty, institutional transparency, and societal responsibility.",
    },
    {
      title: "Inclusive Community",
      description: "A welcoming, merit-driven environment empowering scholars from diverse backgrounds.",
    },
    {
      title: "Impactful Leadership",
      description: "Developing industry-ready graduates who transform communities, industries, and economies.",
    },
  ],
  academicPhilosophy:
    "Our pedagogy bridges foundational theoretical mastery with intensive hands-on lab experience, real-world industry capstone projects, and AI-assisted personalized mentorship. We ensure every scholar masters analytical problem-solving and rapid technological adaptation.",
  campusExperience:
    "Nestled along scenic Park Road in Chak Shezad, Islamabad, our state-of-the-art campus combines architectural elegance with modern smart classrooms, high-performance computing laboratories, digital research libraries, vibrant student societies, and serene green courtyards.",
  history:
    "Established through Federal Charter, Iqra University has consistently ranked among the top institutions for computer science, business administration, and higher education in Pakistan. Over 15,000 alumni drive progress across global tech enterprises, academia, and public service.",
  leadership: [
    {
      name: "Office of the Vice Chancellor",
      role: "Executive Leadership",
      designation: "Vice Chancellor",
      message:
        "Welcome to Iqra University Chak Shezad Campus. Here, we believe education is not merely the acquisition of facts, but the training of the mind to think, build, and lead with purpose.",
    },
    {
      name: "Dean of Faculty of Computing & Technology",
      role: "Academic Leadership",
      designation: "Dean",
      message:
        "Our computing and technology curricula are calibrated to the era of artificial intelligence, machine intelligence, and scalable systems.",
    },
  ],
  phone: "+92 51 111-264-264",
  helpline: "+92 51 111-264-636",
  email: "info@isb.iqra.edu.pk",
  admissionsEmail: "admissions@isb.iqra.edu.pk",
  address: "Park Road, Chak Shezad, Islamabad, 45550, Pakistan",
  city: "Islamabad",
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
};

const DEFAULT_LOCATION = {
  campusName: "Chak Shezad Campus Islamabad",
  address: "Park Road, Chak Shezad, Islamabad, 45550, Federal Capital Area, Pakistan",
  city: "Islamabad",
  latitude: 33.6766,
  longitude: 73.1388,
  googleMapsUrl: "https://maps.google.com/?q=Iqra+University+Chak+Shezad+Campus+Islamabad",
  embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13280.771965561109!2d73.1300!3d33.6766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfeb22a2757a69%3A0x89dc8ec25f9b48b7!2sIqra%20University%2C%20Islamabad%20Campus!5e0!3m2!1sen!2spk!4v1710000000000!5m2!1sen!2spk",
  directions: "Easily accessible via Park Road, Islamabad Highway, and Kashmir Highway. Public transit shuttles and campus buses operate on all major metropolitan routes.",
  phone: "+92 51 111-264-264",
  email: "info@isb.iqra.edu.pk",
  officeHours: "Monday to Friday: 08:30 AM – 04:30 PM (Saturday: 09:00 AM – 01:00 PM for Admissions)",
};

// ============================================================================
// PUBLIC QUERIES: UNIVERSITY PROFILE & METADATA
// ============================================================================

export const getUniversityProfile = query({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("universityProfile").first();
    if (profile) return profile;
    return {
      _id: "default-profile" as any,
      _creationTime: Date.now(),
      ...DEFAULT_PROFILE,
      updatedAt: Date.now(),
    };
  },
});

export const getUniversityLocation = query({
  args: {},
  handler: async (ctx) => {
    const location = await ctx.db.query("universityLocation").first();
    if (location) return location;
    return {
      _id: "default-location" as any,
      _creationTime: Date.now(),
      ...DEFAULT_LOCATION,
      updatedAt: Date.now(),
    };
  },
});

export const getExploreQuickStats = query({
  args: {},
  handler: async (ctx) => {
    const departments = await ctx.db
      .query("departments")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const academicPrograms = await ctx.db
      .query("academicPrograms")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const faculty = await ctx.db
      .query("faculty")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    const posts = await ctx.db
      .query("universityPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const events = await ctx.db
      .query("universityEvents")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const facilities = await ctx.db
      .query("universityFacilities")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    // Group programs by degree level
    const undergraduateCount = academicPrograms.filter((p) => p.degreeLevel === "Undergraduate").length;
    const graduateCount = academicPrograms.filter((p) => p.degreeLevel === "Graduate").length;
    const postgraduateCount = academicPrograms.filter((p) => p.degreeLevel === "Postgraduate").length;

    return {
      departmentsCount: departments.length,
      programsCount: academicPrograms.length,
      undergraduateCount,
      graduateCount,
      postgraduateCount,
      facultyCount: faculty.length,
      postsCount: posts.length,
      eventsCount: events.length,
      facilitiesCount: facilities.length,
      campusName: "Chak Shezad Campus",
      city: "Islamabad",
    };
  },
});

// ============================================================================
// PUBLIC QUERIES: UNIVERSITY POSTS (SOCIAL MEDIA FEED)
// ============================================================================

export const getPublishedPosts = query({
  args: {
    category: v.optional(v.string()),
    tag: v.optional(v.string()),
    search: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db
      .query("universityPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Sort by createdAt / publish date descending
    posts.sort((a, b) => b.createdAt - a.createdAt);

    if (args.category && args.category !== "All") {
      const cat = args.category.toLowerCase().trim();
      posts = posts.filter((p) => p.category.toLowerCase().trim() === cat);
    }

    if (args.isFeatured !== undefined) {
      posts = posts.filter((p) => p.isFeatured === args.isFeatured);
    }

    if (args.tag) {
      const tagLower = args.tag.toLowerCase().trim();
      posts = posts.filter((p) => p.tags.some((t) => t.toLowerCase().trim() === tagLower));
    }

    if (args.search && args.search.trim().length > 0) {
      const q = args.search.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (args.limit && args.limit > 0) {
      posts = posts.slice(0, args.limit);
    }

    return posts;
  },
});

export const getPostByIdOrSlug = query({
  args: {
    idOrSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const val = args.idOrSlug.trim();

    // Try finding by slug
    let post: Doc<"universityPosts"> | null = await ctx.db
      .query("universityPosts")
      .withIndex("by_slug", (q) => q.eq("slug", val))
      .first();

    // If not found by slug, try by ID if valid
    if (!post) {
      try {
        const found = await ctx.db.get(val as Id<"universityPosts">);
        if (found && "title" in found && "category" in found && "tags" in found) {
          post = found as Doc<"universityPosts">;
        }
      } catch {
        post = null;
      }
    }

    if (!post || post.status !== "published") {
      return null;
    }

    // Fetch related published posts
    const allPublished = await ctx.db
      .query("universityPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const related = allPublished
      .filter(
        (p) =>
          p._id !== post?._id &&
          (p.category === post?.category || p.tags.some((t) => post?.tags.includes(t)))
      )
      .slice(0, 3);

    return {
      post,
      related,
    };
  },
});

export const getPostCategories = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("universityPosts").collect();
    const categories = Array.from(new Set(posts.map((p) => p.category))).filter(Boolean);
    return categories.length > 0
      ? categories
      : [
          "University News",
          "Announcements",
          "Events",
          "Achievements",
          "Campus Life",
          "Academic",
          "Admission",
          "Research & AI",
        ];
  },
});

// ============================================================================
// PUBLIC QUERIES: EVENTS
// ============================================================================

export const getPublishedEvents = query({
  args: {
    upcomingOnly: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db
      .query("universityEvents")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const todayStr = new Date().toISOString().split("T")[0];

    if (args.upcomingOnly) {
      events = events.filter((e) => e.date >= todayStr);
      events.sort((a, b) => a.date.localeCompare(b.date));
    } else {
      events.sort((a, b) => b.date.localeCompare(a.date));
    }

    if (args.isFeatured !== undefined) {
      events = events.filter((e) => e.isFeatured === args.isFeatured);
    }

    if (args.limit && args.limit > 0) {
      events = events.slice(0, args.limit);
    }

    return events;
  },
});

// ============================================================================
// PUBLIC QUERIES: GALLERY
// ============================================================================

export const getGalleryImages = query({
  args: {
    category: v.optional(v.string()),
    featuredOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("universityGallery").collect();

    if (args.category && args.category !== "All") {
      items = items.filter((i) => i.category === args.category);
    }

    if (args.featuredOnly) {
      items = items.filter((i) => i.featured);
    }

    items.sort((a, b) => b.createdAt - a.createdAt);

    if (args.limit && args.limit > 0) {
      items = items.slice(0, args.limit);
    }

    return items;
  },
});

// ============================================================================
// PUBLIC QUERIES: FACILITIES
// ============================================================================

export const getCampusFacilities = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db
      .query("universityFacilities")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    if (args.category && args.category !== "All") {
      items = items.filter((i) => i.category === args.category);
    }

    items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  },
});

// ============================================================================
// PUBLIC QUERIES: FEE STRUCTURES
// ============================================================================

export const getPublicFeeStructures = query({
  args: {
    degreeLevel: v.optional(v.string()),
    programName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let fees = await ctx.db
      .query("feeStructures")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    if (args.degreeLevel && args.degreeLevel !== "All") {
      fees = fees.filter((f) => f.degreeLevel === args.degreeLevel);
    }

    if (args.programName && args.programName !== "All") {
      fees = fees.filter((f) => f.programName.toLowerCase().includes(args.programName!.toLowerCase()));
    }

    fees.sort((a, b) => a.programName.localeCompare(b.programName));
    return fees;
  },
});

// ============================================================================
// PUBLIC SANITIZED QUERIES: FACULTY, DEPARTMENTS, PROGRAMS
// Respects security & privacy: no passwords, salts, tokens, or private hashes.
// ============================================================================

export const getPublicFacultyList = query({
  args: {
    department: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let faculty = await ctx.db
      .query("faculty")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    if (args.department && args.department !== "All") {
      const deptLower = args.department.toLowerCase().trim();
      faculty = faculty.filter((f) => f.department.toLowerCase().trim() === deptLower);
    }

    if (args.search && args.search.trim().length > 0) {
      const q = args.search.toLowerCase().trim();
      faculty = faculty.filter(
        (f) =>
          f.fullName.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.specialization.toLowerCase().includes(q) ||
          f.qualification.toLowerCase().includes(q)
      );
    }

    faculty.sort((a, b) => a.fullName.localeCompare(b.fullName));

    // Sanitize and return public safe view
    return faculty.map((f) => ({
      _id: f._id,
      fullName: f.fullName,
      firstName: f.firstName,
      lastName: f.lastName,
      designation: f.designation,
      department: f.department,
      specialization: f.specialization,
      qualification: f.qualification,
      officeLocation: f.officeLocation,
      officeHours: f.officeHours,
      email: f.email, // Official university email
      profilePhoto: f.profilePhoto,
      bio: f.bio,
    }));
  },
});

export const getPublicFacultyById = query({
  args: {
    id: v.id("faculty"),
  },
  handler: async (ctx, args) => {
    const f = await ctx.db.get(args.id);
    if (!f || f.status !== "Active") return null;

    // Fetch courses taught by this faculty member
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    const facultyCourses = courses
      .filter((c) => (c as any).facultyId === f._id || c.facultyName === f.fullName || (c as any).instructorId === f._id)
      .map((c) => ({
        _id: c._id,
        code: c.code,
        name: c.name,
        creditHours: c.creditHours,
        department: c.department,
        semester: c.semester,
        description: c.description,
      }));

    return {
      _id: f._id,
      fullName: f.fullName,
      designation: f.designation,
      department: f.department,
      specialization: f.specialization,
      qualification: f.qualification,
      officeLocation: f.officeLocation,
      officeHours: f.officeHours,
      email: f.email,
      phone: f.phone,
      profilePhoto: f.profilePhoto,
      bio: f.bio,
      courses: facultyCourses,
    };
  },
});

export const getPublicAcademicPrograms = query({
  args: {
    degreeLevel: v.optional(v.string()),
    department: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let progs = await ctx.db
      .query("academicPrograms")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    if (args.degreeLevel && args.degreeLevel !== "All") {
      progs = progs.filter((p) => p.degreeLevel === args.degreeLevel);
    }

    if (args.department && args.department !== "All") {
      const deptLower = args.department.toLowerCase().trim();
      progs = progs.filter((p) => p.department.toLowerCase().trim() === deptLower);
    }

    if (args.search && args.search.trim().length > 0) {
      const q = args.search.toLowerCase().trim();
      progs = progs.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.degreeLevel.toLowerCase().includes(q)
      );
    }

    progs.sort((a, b) => a.name.localeCompare(b.name));
    return progs;
  },
});

export const getPublicProgramById = query({
  args: {
    id: v.id("academicPrograms"),
  },
  handler: async (ctx, args) => {
    const prog = await ctx.db.get(args.id);
    if (!prog || prog.status !== "active") return null;

    // Fetch related department
    const dept = await ctx.db
      .query("departments")
      .filter((q) => q.eq(q.field("name"), prog.department))
      .first();

    // Fetch courses belonging to this program
    const allCourses = await ctx.db
      .query("courses")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    const programCourses = allCourses.filter(
      (c) => (c as any).program === prog.name || (c as any).degreeProgramId === prog._id || (c as any).programId === prog.code
    );

    // Fetch fee structure if configured
    const fees = await ctx.db
      .query("feeStructures")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .filter((q) => q.eq(q.field("programName"), prog.name))
      .collect();

    return {
      program: prog,
      department: dept,
      courses: programCourses,
      fees,
    };
  },
});

export const getPublicDepartments = query({
  args: {},
  handler: async (ctx) => {
    const depts = await ctx.db
      .query("departments")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const allPrograms = await ctx.db
      .query("academicPrograms")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const allFaculty = await ctx.db
      .query("faculty")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    return depts.map((d) => {
      const programs = allPrograms.filter(
        (p) => p.department === d.name || (p as any).departmentId === d.code || (p as any).departmentId === d._id
      );
      const faculty = allFaculty.filter(
        (f) => f.department === d.name || (f as any).departmentId === d.code || (f as any).departmentId === d._id
      );
      return {
        ...d,
        programsCount: programs.length,
        facultyCount: faculty.length,
      };
    });
  },
});

export const getPublicDepartmentById = query({
  args: {
    id: v.id("departments"),
  },
  handler: async (ctx, args) => {
    const dept = await ctx.db.get(args.id);
    if (!dept || dept.status !== "active") return null;

    const allPrograms = await ctx.db
      .query("academicPrograms")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const programs = allPrograms.filter(
      (p) => p.department === dept.name || (p as any).departmentId === dept.code || (p as any).departmentId === dept._id
    );

    const allFaculty = await ctx.db
      .query("faculty")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    const faculty = allFaculty
      .filter((f) => f.department === dept.name || (f as any).departmentId === dept.code || (f as any).departmentId === dept._id)
      .map((f) => ({
        _id: f._id,
        fullName: f.fullName,
        designation: f.designation,
        specialization: f.specialization,
        email: f.email,
        profilePhoto: f.profilePhoto,
        officeLocation: f.officeLocation,
      }));

    return {
      department: dept,
      programs,
      faculty,
    };
  },
});

// ============================================================================
// GLOBAL EXPLORE UNIFIED SEARCH
// ============================================================================

export const searchExplore = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase().trim();
    if (!q || q.length < 2) {
      return {
        faculty: [],
        programs: [],
        departments: [],
        posts: [],
        events: [],
      };
    }

    const allFaculty = await ctx.db
      .query("faculty")
      .withIndex("by_status", (sub) => sub.eq("status", "Active"))
      .collect();

    const faculty = allFaculty
      .filter(
        (f) =>
          f.fullName.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.specialization.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((f) => ({
        _id: f._id,
        fullName: f.fullName,
        designation: f.designation,
        department: f.department,
        profilePhoto: f.profilePhoto,
      }));

    const allPrograms = await ctx.db
      .query("academicPrograms")
      .withIndex("by_status", (sub) => sub.eq("status", "active"))
      .collect();

    const programs = allPrograms
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.degreeLevel.toLowerCase().includes(q)
      )
      .slice(0, 6);

    const allDepts = await ctx.db
      .query("departments")
      .withIndex("by_status", (sub) => sub.eq("status", "active"))
      .collect();

    const departments = allDepts
      .filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
      .slice(0, 6);

    const allPosts = await ctx.db
      .query("universityPosts")
      .withIndex("by_status", (sub) => sub.eq("status", "published"))
      .collect();

    const posts = allPosts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 6);

    const allEvents = await ctx.db
      .query("universityEvents")
      .withIndex("by_status", (sub) => sub.eq("status", "published"))
      .collect();

    const events = allEvents
      .filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
      .slice(0, 6);

    return {
      faculty,
      programs,
      departments,
      posts,
      events,
    };
  },
});

// ============================================================================
// ADMIN QUERIES & MUTATIONS: WEBSITE CONTENT MANAGEMENT
// ============================================================================

// --- Posts Admin ---
export const getAllPostsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("universityPosts").collect();
    posts.sort((a, b) => b.createdAt - a.createdAt);
    return posts;
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    authorName: v.string(),
    authorRole: v.optional(v.string()),
    publishDate: v.string(),
    eventDate: v.optional(v.string()),
    tags: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    isFeatured: v.boolean(),
    coverImage: v.optional(v.string()),
    coverImageStorageId: v.optional(v.string()),
    additionalImages: v.array(v.string()),
    additionalImageStorageIds: v.optional(v.array(v.string())),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    if (!title) throw new Error("Post title is required.");

    // Generate URL slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const now = Date.now();
    const id = await ctx.db.insert("universityPosts", {
      title,
      slug,
      content: args.content.trim(),
      coverImage: args.coverImage,
      coverImageStorageId: args.coverImageStorageId,
      additionalImages: args.additionalImages,
      additionalImageStorageIds: args.additionalImageStorageIds,
      category: args.category.trim() || "University News",
      authorName: args.authorName.trim() || args.adminName,
      authorRole: args.authorRole || "University Administration",
      publishDate: args.publishDate || new Date().toISOString().split("T")[0],
      eventDate: args.eventDate,
      tags: args.tags,
      status: args.status,
      isFeatured: args.isFeatured,
      views: 0,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "University Posts",
      details: `Created post: "${title}" [Status: ${args.status}]`,
      timestamp: now,
    });

    return { success: true, id };
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("universityPosts"),
    title: v.string(),
    content: v.string(),
    category: v.string(),
    authorName: v.string(),
    authorRole: v.optional(v.string()),
    publishDate: v.string(),
    eventDate: v.optional(v.string()),
    tags: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    isFeatured: v.boolean(),
    coverImage: v.optional(v.string()),
    coverImageStorageId: v.optional(v.string()),
    additionalImages: v.array(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Post not found.");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      content: args.content.trim(),
      category: args.category.trim(),
      authorName: args.authorName.trim(),
      authorRole: args.authorRole,
      publishDate: args.publishDate,
      eventDate: args.eventDate,
      tags: args.tags,
      status: args.status,
      isFeatured: args.isFeatured,
      coverImage: args.coverImage,
      coverImageStorageId: args.coverImageStorageId,
      additionalImages: args.additionalImages,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "University Posts",
      details: `Updated post: "${args.title}" [Status: ${args.status}]`,
      timestamp: now,
    });

    return { success: true };
  },
});

export const deletePost = mutation({
  args: {
    id: v.id("universityPosts"),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Post not found.");

    await ctx.db.delete(args.id);

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "delete",
      module: "University Posts",
      details: `Deleted post: "${existing.title}"`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

export const togglePostFeatured = mutation({
  args: {
    id: v.id("universityPosts"),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isFeatured: args.isFeatured,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// --- Events Admin ---
export const getAllEventsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("universityEvents").collect();
    events.sort((a, b) => b.createdAt - a.createdAt);
    return events;
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.string(),
    imageUrl: v.optional(v.string()),
    registrationUrl: v.optional(v.string()),
    organizer: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("cancelled")),
    isFeatured: v.boolean(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("universityEvents", {
      title: args.title.trim(),
      description: args.description.trim(),
      category: args.category.trim(),
      date: args.date,
      time: args.time.trim(),
      location: args.location.trim(),
      imageUrl: args.imageUrl,
      registrationUrl: args.registrationUrl,
      organizer: args.organizer || "AI University Event Committee",
      status: args.status,
      isFeatured: args.isFeatured,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "University Events",
      details: `Created event: "${args.title}" scheduled for ${args.date}`,
      timestamp: now,
    });

    return { success: true, id };
  },
});

export const updateEvent = mutation({
  args: {
    id: v.id("universityEvents"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.string(),
    imageUrl: v.optional(v.string()),
    registrationUrl: v.optional(v.string()),
    organizer: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("cancelled")),
    isFeatured: v.boolean(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      description: args.description.trim(),
      category: args.category.trim(),
      date: args.date,
      time: args.time.trim(),
      location: args.location.trim(),
      imageUrl: args.imageUrl,
      registrationUrl: args.registrationUrl,
      organizer: args.organizer,
      status: args.status,
      isFeatured: args.isFeatured,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "University Events",
      details: `Updated event: "${args.title}"`,
      timestamp: now,
    });

    return { success: true };
  },
});

export const deleteEvent = mutation({
  args: {
    id: v.id("universityEvents"),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (existing) {
      await ctx.db.delete(args.id);
      await ctx.db.insert("auditLogs", {
        adminId: "admin",
        adminName: args.adminName,
        adminEmail: args.adminEmail,
        actionType: "delete",
        module: "University Events",
        details: `Deleted event: "${existing.title}"`,
        timestamp: Date.now(),
      });
    }
    return { success: true };
  },
});

// --- Gallery Admin ---
export const getAllGalleryAdmin = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("universityGallery").collect();
    items.sort((a, b) => b.createdAt - a.createdAt);
    return items;
  },
});

export const addGalleryImage = mutation({
  args: {
    title: v.string(),
    category: v.union(
      v.literal("Campus"),
      v.literal("Events"),
      v.literal("Students"),
      v.literal("Faculty"),
      v.literal("Facilities"),
      v.literal("Activities")
    ),
    imageUrl: v.string(),
    storageId: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.boolean(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("universityGallery", {
      title: args.title.trim(),
      category: args.category,
      imageUrl: args.imageUrl.trim(),
      storageId: args.storageId,
      description: args.description?.trim(),
      featured: args.featured,
      createdAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "University Gallery",
      details: `Added gallery photo: "${args.title}" [${args.category}]`,
      timestamp: now,
    });

    return { success: true, id };
  },
});

export const deleteGalleryImage = mutation({
  args: {
    id: v.id("universityGallery"),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (item) {
      await ctx.db.delete(args.id);
      await ctx.db.insert("auditLogs", {
        adminId: "admin",
        adminName: args.adminName,
        adminEmail: args.adminEmail,
        actionType: "delete",
        module: "University Gallery",
        details: `Deleted gallery photo: "${item.title}"`,
        timestamp: Date.now(),
      });
    }
    return { success: true };
  },
});

// --- Facilities Admin ---
export const getAllFacilitiesAdmin = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("universityFacilities").collect();
    items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  },
});

export const createFacility = mutation({
  args: {
    name: v.string(),
    category: v.union(
      v.literal("Academic"),
      v.literal("Research"),
      v.literal("Student Life"),
      v.literal("Sports"),
      v.literal("Administrative"),
      v.literal("Other")
    ),
    description: v.string(),
    location: v.string(),
    imageUrl: v.optional(v.string()),
    icon: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("universityFacilities", {
      name: args.name.trim(),
      category: args.category,
      description: args.description.trim(),
      location: args.location.trim(),
      imageUrl: args.imageUrl,
      icon: args.icon,
      status: args.status,
      createdAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Campus Facilities",
      details: `Added facility: "${args.name}"`,
      timestamp: now,
    });

    return { success: true, id };
  },
});

export const updateFacility = mutation({
  args: {
    id: v.id("universityFacilities"),
    name: v.string(),
    category: v.union(
      v.literal("Academic"),
      v.literal("Research"),
      v.literal("Student Life"),
      v.literal("Sports"),
      v.literal("Administrative"),
      v.literal("Other")
    ),
    description: v.string(),
    location: v.string(),
    imageUrl: v.optional(v.string()),
    icon: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name.trim(),
      category: args.category,
      description: args.description.trim(),
      location: args.location.trim(),
      imageUrl: args.imageUrl,
      icon: args.icon,
      status: args.status,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Campus Facilities",
      details: `Updated facility: "${args.name}"`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

export const deleteFacility = mutation({
  args: {
    id: v.id("universityFacilities"),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (item) {
      await ctx.db.delete(args.id);
      await ctx.db.insert("auditLogs", {
        adminId: "admin",
        adminName: args.adminName,
        adminEmail: args.adminEmail,
        actionType: "delete",
        module: "Campus Facilities",
        details: `Deleted facility: "${item.name}"`,
        timestamp: Date.now(),
      });
    }
    return { success: true };
  },
});

// --- Fees Admin ---
export const getAllFeesAdmin = query({
  args: {},
  handler: async (ctx) => {
    const fees = await ctx.db.query("feeStructures").collect();
    fees.sort((a, b) => a.programName.localeCompare(b.programName));
    return fees;
  },
});

export const createFeeStructure = mutation({
  args: {
    programName: v.string(),
    programId: v.optional(v.string()),
    degreeLevel: v.string(),
    department: v.optional(v.string()),
    semester: v.string(),
    feeType: v.string(),
    amount: v.number(),
    currency: v.string(),
    description: v.optional(v.string()),
    effectiveDate: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("feeStructures", {
      programName: args.programName.trim(),
      programId: args.programId,
      degreeLevel: args.degreeLevel.trim(),
      department: args.department,
      semester: args.semester.trim(),
      feeType: args.feeType.trim(),
      amount: args.amount,
      currency: args.currency.trim().toUpperCase() || "PKR",
      description: args.description?.trim(),
      effectiveDate: args.effectiveDate.trim(),
      status: args.status,
      createdAt: now,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "Fee Structure",
      details: `Created fee entry: ${args.programName} - ${args.feeType} (${args.currency} ${args.amount})`,
      timestamp: now,
    });

    return { success: true, id };
  },
});

export const updateFeeStructure = mutation({
  args: {
    id: v.id("feeStructures"),
    programName: v.string(),
    programId: v.optional(v.string()),
    degreeLevel: v.string(),
    department: v.optional(v.string()),
    semester: v.string(),
    feeType: v.string(),
    amount: v.number(),
    currency: v.string(),
    description: v.optional(v.string()),
    effectiveDate: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      programName: args.programName.trim(),
      programId: args.programId,
      degreeLevel: args.degreeLevel.trim(),
      department: args.department,
      semester: args.semester.trim(),
      feeType: args.feeType.trim(),
      amount: args.amount,
      currency: args.currency.trim().toUpperCase(),
      description: args.description?.trim(),
      effectiveDate: args.effectiveDate.trim(),
      status: args.status,
    });

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Fee Structure",
      details: `Updated fee entry for ${args.programName}`,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

export const deleteFeeStructure = mutation({
  args: {
    id: v.id("feeStructures"),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (item) {
      await ctx.db.delete(args.id);
      await ctx.db.insert("auditLogs", {
        adminId: "admin",
        adminName: args.adminName,
        adminEmail: args.adminEmail,
        actionType: "delete",
        module: "Fee Structure",
        details: `Deleted fee entry for ${item.programName}`,
        timestamp: Date.now(),
      });
    }
    return { success: true };
  },
});

// --- Profile & Location Admin ---
export const updateUniversityProfile = mutation({
  args: {
    name: v.string(),
    campusName: v.string(),
    tagline: v.string(),
    overview: v.string(),
    vision: v.string(),
    mission: v.string(),
    coreValues: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      })
    ),
    academicPhilosophy: v.string(),
    campusExperience: v.string(),
    history: v.string(),
    leadership: v.array(
      v.object({
        name: v.string(),
        role: v.string(),
        designation: v.string(),
        message: v.optional(v.string()),
        photoUrl: v.optional(v.string()),
      })
    ),
    phone: v.string(),
    helpline: v.string(),
    email: v.string(),
    admissionsEmail: v.string(),
    address: v.string(),
    city: v.string(),
    socialLinks: v.object({
      facebook: v.optional(v.string()),
      twitter: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      instagram: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("universityProfile").first();
    const now = Date.now();

    const data = {
      name: args.name.trim(),
      campusName: args.campusName.trim(),
      tagline: args.tagline.trim(),
      overview: args.overview.trim(),
      vision: args.vision.trim(),
      mission: args.mission.trim(),
      coreValues: args.coreValues,
      academicPhilosophy: args.academicPhilosophy.trim(),
      campusExperience: args.campusExperience.trim(),
      history: args.history.trim(),
      leadership: args.leadership,
      phone: args.phone.trim(),
      helpline: args.helpline.trim(),
      email: args.email.trim(),
      admissionsEmail: args.admissionsEmail.trim(),
      address: args.address.trim(),
      city: args.city.trim(),
      socialLinks: args.socialLinks,
      updatedAt: now,
      updatedBy: args.adminName,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("universityProfile", data);
    }

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "University Profile",
      details: "Updated official university profile and public overview.",
      timestamp: now,
    });

    return { success: true };
  },
});

export const updateUniversityLocation = mutation({
  args: {
    campusName: v.string(),
    address: v.string(),
    city: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    googleMapsUrl: v.string(),
    embedMapUrl: v.optional(v.string()),
    directions: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    officeHours: v.optional(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("universityLocation").first();
    const now = Date.now();

    const data = {
      campusName: args.campusName.trim(),
      address: args.address.trim(),
      city: args.city.trim(),
      latitude: args.latitude,
      longitude: args.longitude,
      googleMapsUrl: args.googleMapsUrl.trim(),
      embedMapUrl: args.embedMapUrl?.trim(),
      directions: args.directions?.trim(),
      phone: args.phone?.trim(),
      email: args.email?.trim(),
      officeHours: args.officeHours?.trim(),
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("universityLocation", data);
    }

    await ctx.db.insert("auditLogs", {
      adminId: "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "update",
      module: "Campus Location",
      details: "Updated university campus coordinates, address, and map configuration.",
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Public query for Explore University announcements (strictly Admin + Published + Public).
 */
export const getPublicAnnouncements = query({
  args: {
    limit: v.optional(v.number()),
    isFeatured: v.optional(v.boolean()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allPublished = await ctx.db
      .query("announcements")
      .withIndex("by_status", (q) => q.eq("status", "Published"))
      .order("desc")
      .collect();

    const publicAnnouncements = allPublished.filter((anc) => {
      // 1. Mandatory status check
      if (anc.status !== "Published") return false;

      // 2. Reject any course-specific or student-specific notices
      if (anc.courseCode) return false;
      if (anc.category === "Course" || anc.category === "Student-specific") return false;

      // 3. Reject faculty announcements
      if (anc.createdByRole === "FACULTY") return false;
      if (anc.sender && anc.sender.toLowerCase().includes("course instructor")) return false;

      // 4. Check visibility (must be explicitly PUBLIC or legacy admin official notice)
      if (anc.visibility) {
        if (anc.visibility !== "PUBLIC") return false;
      } else {
        const isOfficialAdmin =
          anc.createdByRole === "ADMIN" ||
          (anc.sender &&
            (anc.sender.toLowerCase().includes("registrar") ||
              anc.sender.toLowerCase().includes("admin") ||
              anc.sender.toLowerCase().includes("university")));
        if (!isOfficialAdmin) return false;
      }

      // 5. Featured filter (if requested)
      if (args.isFeatured !== undefined) {
        if (Boolean(anc.isFeatured) !== args.isFeatured) return false;
      }

      // 6. Category filter (if requested)
      if (args.category && args.category !== "All") {
        if (anc.category !== args.category) return false;
      }

      return true;
    });

    if (args.limit && args.limit > 0) {
      return publicAnnouncements.slice(0, args.limit);
    }

    return publicAnnouncements;
  },
});

