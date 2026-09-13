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
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"]),

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
});

