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
      v.literal("STUDENT"),
      v.literal("teacher"),
      v.literal("faculty"),
      v.literal("FACULTY"),
      v.literal("admin"),
      v.literal("ADMIN"),
      v.literal("super_admin"),
      v.literal("SUPER_ADMIN"),
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
    departmentId: v.optional(v.string()),
    degreeProgram: v.optional(v.string()),
    degreeProgramId: v.optional(v.string()),
    currentSemester: v.optional(v.number()),
    passwordSetupToken: v.optional(v.string()),
    passwordSetupTokenExpiresAt: v.optional(v.number()),
    profilePhoto: v.optional(v.string()),
    profilePhotoStorageId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_universityEmail", ["universityEmail"])
    .index("by_role", ["role"])
    .index("by_departmentId", ["departmentId"])
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
    .index("by_departmentId", ["departmentId"])
    .index("by_degreeProgramId", ["degreeProgramId"])
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

  // --------------------------------------------------------------------------
  // ACADEMIC MANAGEMENT & UNIVERSITY SIS TABLES
  // --------------------------------------------------------------------------

  departments: defineTable({
    code: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    headOfDepartment: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_status", ["status"]),

  academicPrograms: defineTable({
    code: v.string(),
    name: v.string(),
    department: v.string(),
    departmentId: v.optional(v.string()),
    degreeLevel: v.union(
      v.literal("Undergraduate"),
      v.literal("Graduate"),
      v.literal("Postgraduate")
    ),
    duration: v.string(),
    totalCreditHours: v.number(),
    description: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_department", ["department"])
    .index("by_departmentId", ["departmentId"])
    .index("by_status", ["status"]),

  faculty: defineTable({
    userId: v.optional(v.id("users")),
    firstName: v.string(),
    lastName: v.string(),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    employeeId: v.string(),
    department: v.string(),
    departmentId: v.optional(v.string()),
    designation: v.union(
      v.literal("Professor"),
      v.literal("Associate Professor"),
      v.literal("Assistant Professor"),
      v.literal("Lecturer"),
      v.literal("Visiting Faculty"),
      v.literal("Lab Instructor")
    ),
    specialization: v.string(),
    qualification: v.string(),
    joiningDate: v.string(),
    officeLocation: v.string(),
    officeHours: v.string(),
    status: v.union(v.literal("Active"), v.literal("Inactive"), v.literal("On Leave")),
    profilePhoto: v.optional(v.string()),
    bio: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_employeeId", ["employeeId"])
    .index("by_department", ["department"])
    .index("by_status", ["status"])
    .index("by_email", ["email"])
    .index("by_userId", ["userId"]),

  courses: defineTable({
    code: v.string(),
    name: v.string(),
    description: v.string(),
    creditHours: v.number(),
    department: v.string(),
    departmentId: v.optional(v.string()),
    program: v.string(),
    programId: v.optional(v.string()),
    degreeProgramId: v.optional(v.string()),
    semester: v.number(),
    prerequisites: v.array(v.string()),
    facultyId: v.optional(v.string()),
    instructorId: v.optional(v.string()),
    facultyName: v.optional(v.string()),
    status: v.union(v.literal("Active"), v.literal("Inactive")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_department", ["department"])
    .index("by_departmentId", ["departmentId"])
    .index("by_programId", ["programId"])
    .index("by_degreeProgramId", ["degreeProgramId"])
    .index("by_department_and_program", ["departmentId", "programId"])
    .index("by_instructorId", ["instructorId"])
    .index("by_status", ["status"]),

  courseSections: defineTable({
    courseId: v.string(),
    courseCode: v.string(),
    courseName: v.string(),
    section: v.string(),
    semester: v.string(),
    academicYear: v.string(),
    facultyId: v.optional(v.string()),
    facultyName: v.optional(v.string()),
    room: v.string(),
    building: v.string(),
    campus: v.string(),
    days: v.array(v.string()),
    startTime: v.string(),
    endTime: v.string(),
    capacity: v.number(),
    enrolledCount: v.number(),
    status: v.union(v.literal("Active"), v.literal("Closed"), v.literal("Cancelled")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_courseId", ["courseId"])
    .index("by_courseCode", ["courseCode"])
    .index("by_status", ["status"]),

  courseRegistrations: defineTable({
    studentId: v.string(),
    studentName: v.string(),
    studentEmail: v.string(),
    enrollmentId: v.string(),
    courseId: v.string(),
    sectionId: v.optional(v.string()),
    courseCode: v.string(),
    courseTitle: v.string(),
    creditHours: v.number(),
    semester: v.string(),
    departmentId: v.optional(v.string()),
    degreeProgramId: v.optional(v.string()),
    academicTerm: v.optional(v.string()),
    status: v.union(
      v.literal("Pending"),
      v.literal("Approved"),
      v.literal("Rejected"),
      v.literal("Dropped")
    ),
    registeredAt: v.number(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    approvedAt: v.optional(v.number()),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    remarks: v.optional(v.string()),
  })
    .index("by_studentId", ["studentId"])
    .index("by_courseCode", ["courseCode"])
    .index("by_status", ["status"])
    .index("by_student_and_status", ["studentId", "status"])
    .index("by_student_and_course", ["studentId", "courseCode"]),

  classSchedules: defineTable({
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    section: v.string(),
    facultyId: v.optional(v.string()),
    facultyName: v.string(),
    day: v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday")
    ),
    startTime: v.string(),
    endTime: v.string(),
    room: v.string(),
    building: v.string(),
    campus: v.string(),
    type: v.union(v.literal("Lecture"), v.literal("Lab"), v.literal("Tutorial")),
    createdAt: v.number(),
  })
    .index("by_courseCode", ["courseCode"])
    .index("by_day", ["day"]),

  attendanceRecords: defineTable({
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    section: v.string(),
    date: v.string(), // YYYY-MM-DD
    time: v.string(),
    status: v.union(v.literal("Present"), v.literal("Absent"), v.literal("Late")),
    topic: v.optional(v.string()),
    recordedBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_studentId", ["studentId"])
    .index("by_courseCode", ["courseCode"])
    .index("by_student_and_course", ["studentId", "courseCode"]),

  assignments: defineTable({
    title: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    section: v.string(),
    facultyId: v.optional(v.string()),
    facultyName: v.string(),
    description: v.string(),
    dueDate: v.string(),
    dueTime: v.string(),
    totalMarks: v.number(),
    weightage: v.string(),
    attachmentUrl: v.optional(v.string()),
    status: v.union(v.literal("Active"), v.literal("Closed"), v.literal("Draft")),
    createdAt: v.number(),
  })
    .index("by_courseCode", ["courseCode"])
    .index("by_status", ["status"]),

  assignmentSubmissions: defineTable({
    assignmentId: v.id("assignments"),
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    fileName: v.string(),
    fileUrl: v.optional(v.string()),
    submittedAt: v.number(),
    status: v.union(v.literal("Submitted"), v.literal("Graded"), v.literal("Late")),
    obtainedMarks: v.optional(v.number()),
    maxMarks: v.number(),
    feedback: v.optional(v.string()),
    gradedAt: v.optional(v.number()),
    gradedBy: v.optional(v.string()),
  })
    .index("by_assignmentId", ["assignmentId"])
    .index("by_studentId", ["studentId"]),

  examinations: defineTable({
    title: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    section: v.string(),
    examType: v.union(
      v.literal("Midterm"),
      v.literal("Final"),
      v.literal("Quiz"),
      v.literal("Practical"),
      v.literal("Presentation")
    ),
    date: v.string(), // YYYY-MM-DD
    day: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    room: v.string(),
    building: v.string(),
    campus: v.string(),
    facultyName: v.string(),
    instructions: v.array(v.string()),
    requiredMaterials: v.array(v.string()),
    duration: v.string(),
    seatNumber: v.optional(v.string()),
    status: v.union(
      v.literal("Scheduled"),
      v.literal("Completed"),
      v.literal("Cancelled"),
      v.literal("Postponed")
    ),
    importantNotes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_courseCode", ["courseCode"])
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  academicResults: defineTable({
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    courseId: v.string(),
    courseCode: v.string(),
    courseTitle: v.string(),
    section: v.string(),
    semester: v.string(), // e.g. "Fall 2026"
    assignmentMarks: v.number(),
    quizMarks: v.number(),
    midtermMarks: v.number(),
    finalMarks: v.number(),
    attendanceMarks: v.number(),
    totalMarks: v.number(),
    percentage: v.number(),
    grade: v.string(), // "A", "B+", etc.
    gradePoints: v.number(), // 4.0, 3.33, etc.
    creditHours: v.number(),
    status: v.union(
      v.literal("Draft"),
      v.literal("Submitted"),
      v.literal("Reviewed"),
      v.literal("Approved"),
      v.literal("Published")
    ),
    publishedAt: v.optional(v.number()),
    publishedBy: v.optional(v.string()),
    remarks: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_studentId", ["studentId"])
    .index("by_courseCode", ["courseCode"])
    .index("by_status", ["status"])
    .index("by_student_and_status", ["studentId", "status"]),

  announcements: defineTable({
    title: v.string(),
    message: v.string(),
    sender: v.string(),
    category: v.union(
      v.literal("University"),
      v.literal("Department"),
      v.literal("Course"),
      v.literal("Exam"),
      v.literal("Student-specific")
    ),
    targetAudience: v.string(), // e.g. "All Students", "Computing", etc.
    department: v.optional(v.string()),
    courseCode: v.optional(v.string()),
    priority: v.union(v.literal("High"), v.literal("Normal"), v.literal("Urgent")),
    publishDate: v.string(),
    expiryDate: v.optional(v.string()),
    status: v.union(v.literal("Published"), v.literal("Draft"), v.literal("Archived")),
    createdAt: v.number(),
    createdByRole: v.optional(v.union(v.literal("ADMIN"), v.literal("FACULTY"))),
    createdByUserId: v.optional(v.string()),
    visibility: v.optional(
      v.union(v.literal("PUBLIC"), v.literal("INTERNAL"), v.literal("AUTHENTICATED"))
    ),
    isFeatured: v.optional(v.boolean()),
    imageUrl: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_visibility_status", ["visibility", "status"])
    .index("by_createdByRole", ["createdByRole"]),

  auditLogs: defineTable({
    adminId: v.string(),
    adminName: v.string(),
    adminEmail: v.string(),
    actionType: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("status_change"),
      v.literal("approve"),
      v.literal("reject"),
      v.literal("publish"),
      v.literal("unpublish")
    ),
    module: v.string(),
    details: v.string(),
    entityAffected: v.optional(v.string()),
    previousValue: v.optional(v.string()),
    newValue: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_module", ["module"]),

  // --------------------------------------------------------------------------
<<<<<<< Updated upstream
  // UNIVERSITY PUBLIC PORTAL & WEBSITE MANAGEMENT
  // --------------------------------------------------------------------------

  universityProfile: defineTable({
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
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  }),

  universityPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    coverImageStorageId: v.optional(v.string()),
    additionalImages: v.array(v.string()),
    additionalImageStorageIds: v.optional(v.array(v.string())),
    category: v.string(),
    authorName: v.string(),
    authorRole: v.optional(v.string()),
    publishDate: v.string(),
    eventDate: v.optional(v.string()),
    tags: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    isFeatured: v.boolean(),
    views: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_featured", ["isFeatured"])
    .index("by_status_and_featured", ["status", "isFeatured"]),

  universityEvents: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    date: v.string(), // YYYY-MM-DD
    time: v.string(),
    location: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.string()),
    registrationUrl: v.optional(v.string()),
    organizer: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("cancelled")),
    isFeatured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_date", ["date"])
    .index("by_featured", ["isFeatured"]),

  universityGallery: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"]),

  universityFacilities: defineTable({
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
    imageStorageId: v.optional(v.string()),
    icon: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"]),

  feeStructures: defineTable({
    programId: v.optional(v.string()),
    programName: v.string(),
    degreeLevel: v.string(), // e.g. "Undergraduate", "Graduate", "Postgraduate"
    department: v.optional(v.string()),
    semester: v.string(), // e.g. "Per Semester", "First Semester", "Annual"
    feeType: v.string(), // e.g. "Tuition Fee", "Admission Fee", "Registration Fee", "Exam Fee", "Semester Package"
    amount: v.number(),
    currency: v.string(), // "PKR", "USD"
    description: v.optional(v.string()),
    effectiveDate: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_degreeLevel", ["degreeLevel"])
    .index("by_programName", ["programName"]),

  universityLocation: defineTable({
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
    updatedAt: v.number(),
  }),
=======
  // CAMPUS LIFE, RESOURCES & CAREERS
  // --------------------------------------------------------------------------

  learningResources: defineTable({
    title: v.string(),
    category: v.string(), // "Research Paper", "Digital Book", "AI & Data", "Cheat Sheet", "Development Tool"
    description: v.string(),
    link: v.string(),
    storageId: v.optional(v.string()),
    fileType: v.string(), // "PDF", "EPUB", "WEB", "ZIP"
    fileSize: v.optional(v.string()),
    tags: v.array(v.string()),
    department: v.optional(v.string()),
    author: v.optional(v.string()),
    publisher: v.optional(v.string()),
    downloadsCount: v.number(),
    status: v.union(v.literal("Active"), v.literal("Archived")),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_department", ["department"])
    .index("by_status", ["status"]),

  courseMaterials: defineTable({
    courseId: v.optional(v.string()),
    courseCode: v.string(),
    courseTitle: v.string(),
    weekNumber: v.number(), // 1 - 16
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
    fileType: v.string(), // "PDF", "PPTX", "ZIP", "DOCX"
    fileSize: v.string(),
    uploadedBy: v.string(),
    status: v.union(v.literal("Published"), v.literal("Draft")),
    createdAt: v.number(),
  })
    .index("by_courseCode", ["courseCode"])
    .index("by_course_and_week", ["courseCode", "weekNumber"])
    .index("by_materialType", ["materialType"]),

  campusEvents: defineTable({
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
    date: v.string(), // YYYY-MM-DD
    time: v.string(), // e.g. "10:00 AM - 04:00 PM"
    venue: v.string(),
    campus: v.string(),
    organizer: v.string(),
    capacity: v.number(),
    registeredCount: v.number(),
    registeredStudents: v.array(
      v.object({
        studentId: v.string(),
        studentName: v.string(),
        studentEmail: v.string(),
        registeredAt: v.number(),
      })
    ),
    bannerUrl: v.optional(v.string()),
    status: v.union(v.literal("Upcoming"), v.literal("Ongoing"), v.literal("Completed"), v.literal("Cancelled")),
    registrationDeadline: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_date", ["date"]),

  careerOpportunities: defineTable({
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
    department: v.string(), // e.g. "Computer Science", "Software Engineering", "AI & DS"
    description: v.string(),
    requirements: v.array(v.string()),
    skills: v.array(v.string()),
    deadline: v.string(), // YYYY-MM-DD
    applyUrl: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    applicantsCount: v.number(),
    status: v.union(v.literal("Active"), v.literal("Closed")),
    createdAt: v.number(),
  })
    .index("by_roleType", ["roleType"])
    .index("by_status", ["status"])
    .index("by_deadline", ["deadline"]),

  // --------------------------------------------------------------------------
  // 1. ACADEMIC INTELLIGENCE & EARLY WARNING ALERTS
  // --------------------------------------------------------------------------
  academicAlerts: defineTable({
    studentId: v.string(),
    enrollmentId: v.string(),
    studentName: v.string(),
    studentEmail: v.string(),
    department: v.string(),
    degreeProgram: v.string(),
    currentSemester: v.number(),
    riskLevel: v.union(v.literal("High"), v.literal("Moderate"), v.literal("Low")),
    riskScore: v.number(), // 0 - 100
    triggerFactors: v.array(v.string()),
    currentAttendance: v.number(),
    cgpa: v.number(),
    interventionStatus: v.union(
      v.literal("Pending"),
      v.literal("Notice Sent"),
      v.literal("Counseling Scheduled"),
      v.literal("Resolved")
    ),
    aiRecommendation: v.optional(v.string()),
    advisorNotes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_studentId", ["studentId"])
    .index("by_riskLevel", ["riskLevel"])
    .index("by_interventionStatus", ["interventionStatus"]),

  // --------------------------------------------------------------------------
  // 2. FINANCIAL SIS & FEE CHALLANS
  // --------------------------------------------------------------------------
  feeChallans: defineTable({
    challanNo: v.string(), // e.g. "IU-2026-FEE-88219"
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    department: v.string(),
    degreeProgram: v.string(),
    semester: v.string(), // "Fall 2026"
    issueDate: v.string(), // "2026-09-01"
    dueDate: v.string(), // "2026-09-25"
    breakdown: v.object({
      tuitionFee: v.number(),
      labCharges: v.number(),
      libraryFee: v.number(),
      examinationFee: v.number(),
      scholarshipDiscount: v.number(),
      lateFine: v.number(),
      totalPayable: v.number(),
    }),
    status: v.union(
      v.literal("Unpaid"),
      v.literal("Paid"),
      v.literal("Overdue"),
      v.literal("Installment")
    ),
    paymentMethod: v.optional(
      v.union(
        v.literal("Kuickpay"),
        v.literal("1-Link"),
        v.literal("Bank Branch"),
        v.literal("JazzCash"),
        v.literal("Online Card")
      )
    ),
    transactionReference: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_challanNo", ["challanNo"])
    .index("by_studentId", ["studentId"])
    .index("by_status", ["status"])
    .index("by_semester", ["semester"]),

  // --------------------------------------------------------------------------
  // 3. VERIFIABLE DIGITAL CREDENTIALS & DEGREES
  // --------------------------------------------------------------------------
  verifiableCredentials: defineTable({
    credentialId: v.string(), // e.g. "IU-DEG-2026-1042"
    studentId: v.string(),
    studentName: v.string(),
    enrollmentId: v.string(),
    degreeProgram: v.string(),
    department: v.string(),
    cgpa: v.number(),
    conferralDate: v.string(),
    verificationHash: v.string(), // SHA-256 fingerprint
    status: v.union(v.literal("Valid"), v.literal("Revoked"), v.literal("Suspended")),
    hecAttestationStatus: v.string(), // e.g. "HEC-Recognized & Verified"
    issuedBy: v.string(),
    issuedAt: v.number(),
  })
    .index("by_credentialId", ["credentialId"])
    .index("by_studentId", ["studentId"])
    .index("by_status", ["status"]),

  // --------------------------------------------------------------------------
  // 4. EXAMINATION SEATING PLANS
  // --------------------------------------------------------------------------
  examSeatingPlans: defineTable({
    examId: v.optional(v.id("examinations")),
    courseCode: v.string(),
    courseTitle: v.string(),
    hallRoom: v.string(),
    building: v.string(),
    campus: v.string(),
    examDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    capacity: v.number(),
    allocatedSeats: v.array(
      v.object({
        seatNumber: v.string(), // e.g. "R1-C1"
        row: v.number(),
        col: v.number(),
        studentId: v.string(),
        studentName: v.string(),
        enrollmentId: v.string(),
        courseCode: v.string(),
        department: v.string(),
      })
    ),
    generatedAt: v.number(),
  })
    .index("by_courseCode", ["courseCode"])
    .index("by_hallRoom", ["hallRoom"]),

  // --------------------------------------------------------------------------
  // 5. COURSE DISCUSSION FORUMS & ACADEMIC Q&A
  // --------------------------------------------------------------------------
  courseDiscussions: defineTable({
    courseId: v.string(),
    courseCode: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorRole: v.union(
      v.literal("student"),
      v.literal("faculty"),
      v.literal("admin")
    ),
    title: v.string(),
    content: v.string(),
    tag: v.union(
      v.literal("#Assignment"),
      v.literal("#Lecture"),
      v.literal("#ExamPrep"),
      v.literal("#Project"),
      v.literal("#General")
    ),
    upvotes: v.array(v.string()), // user IDs
    isResolved: v.boolean(),
    hasInstructorEndorsed: v.boolean(),
    replyCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_courseCode", ["courseCode"])
    .index("by_tag", ["tag"]),

  discussionReplies: defineTable({
    discussionId: v.id("courseDiscussions"),
    authorId: v.string(),
    authorName: v.string(),
    authorRole: v.union(
      v.literal("student"),
      v.literal("faculty"),
      v.literal("admin")
    ),
    content: v.string(),
    isInstructorEndorsed: v.boolean(),
    upvotes: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_discussionId", ["discussionId"]),
>>>>>>> Stashed changes
});

