import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Convex Query: Pre-insertion validation of candidate academic structure.
 * Checks candidate departments, programs, and courses against existing database
 * records, flagging duplicates, missing parents, and schema anomalies.
 */
export const validateAcademicBatch = query({
  args: {
    departments: v.array(
      v.object({
        code: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        headOfDepartment: v.optional(v.string()),
      })
    ),
    programs: v.array(
      v.object({
        code: v.string(),
        name: v.string(),
        departmentCode: v.string(),
        departmentName: v.optional(v.string()),
        degreeLevel: v.optional(v.string()),
        duration: v.optional(v.string()),
        totalCreditHours: v.optional(v.number()),
        description: v.optional(v.string()),
      })
    ),
    courses: v.array(
      v.object({
        code: v.string(),
        name: v.string(),
        creditHours: v.number(),
        semester: v.number(),
        programCode: v.string(),
        programName: v.optional(v.string()),
        departmentCode: v.optional(v.string()),
        departmentName: v.optional(v.string()),
        description: v.optional(v.string()),
        prerequisites: v.optional(v.array(v.string())),
        courseType: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // 1. Fetch live DB catalog
    const existingDepartments = await ctx.db.query("departments").collect();
    const existingPrograms = await ctx.db.query("academicPrograms").collect();
    const existingCourses = await ctx.db.query("courses").collect();

    const existingDeptCodeSet = new Set(
      existingDepartments.map((d) => d.code.trim().toUpperCase())
    );
    const existingDeptNameSet = new Set(
      existingDepartments.map((d) => d.name.trim().toLowerCase())
    );
    const existingProgCodeSet = new Set(
      existingPrograms.map((p) => p.code.trim().toUpperCase())
    );
    const existingProgNameSet = new Set(
      existingPrograms.map((p) => p.name.trim().toLowerCase())
    );
    const existingCourseCodeSet = new Set(
      existingCourses.map((c) => c.code.trim().toUpperCase())
    );

    const issues: string[] = [];
    const warnings: string[] = [];

    // 2. Department Validation
    const batchDeptCodes = new Set<string>();
    const duplicateDeptsInDb: string[] = [];
    for (const dept of args.departments) {
      const code = dept.code.trim().toUpperCase();
      const name = dept.name.trim().toLowerCase();
      if (!code || !name) {
        issues.push(`Department has missing code or name.`);
      }
      if (batchDeptCodes.has(code)) {
        issues.push(`Duplicate department code "${code}" found in candidate import batch.`);
      }
      batchDeptCodes.add(code);

      if (existingDeptCodeSet.has(code) || existingDeptNameSet.has(name)) {
        duplicateDeptsInDb.push(dept.name);
      }
    }

    // 3. Program Validation
    const batchProgCodes = new Set<string>();
    const duplicateProgsInDb: string[] = [];
    for (const prog of args.programs) {
      const code = prog.code.trim().toUpperCase();
      const name = prog.name.trim().toLowerCase();
      const deptRef = prog.departmentCode.trim().toUpperCase();

      if (!code || !name) {
        issues.push(`Program has missing code or title.`);
      }
      if (batchProgCodes.has(code)) {
        issues.push(`Duplicate program code "${code}" found in candidate import batch.`);
      }
      batchProgCodes.add(code);

      if (existingProgCodeSet.has(code) || existingProgNameSet.has(name)) {
        duplicateProgsInDb.push(prog.name);
      }

      // Check parent department existence in batch or DB
      const deptExistsInDb =
        existingDeptCodeSet.has(deptRef) ||
        (prog.departmentName && existingDeptNameSet.has(prog.departmentName.trim().toLowerCase()));
      const deptExistsInBatch = batchDeptCodes.has(deptRef);

      if (!deptExistsInDb && !deptExistsInBatch) {
        warnings.push(
          `Program "${prog.name}" references department "${deptRef}" which is not found in existing DB or candidate batch.`
        );
      }
    }

    // 4. Course Validation
    const batchCourseCodes = new Set<string>();
    const duplicateCoursesInDb: string[] = [];
    const duplicateCoursesInBatch: string[] = [];

    for (const course of args.courses) {
      const code = course.code.trim().toUpperCase();
      const name = course.name.trim();
      const progRef = course.programCode.trim().toUpperCase();

      if (!code) {
        issues.push(`Course with title "${name || "Unnamed"}" is missing a course code.`);
      }
      if (!name) {
        issues.push(`Course "${code || "Unnamed"}" is missing a title/name.`);
      }
      if (course.creditHours < 1 || course.creditHours > 6) {
        issues.push(`Course "${code}" has invalid credit hours (${course.creditHours}). Must be 1-6.`);
      }
      if (course.semester < 1 || course.semester > 12) {
        issues.push(`Course "${code}" has invalid semester number (${course.semester}). Must be 1-12.`);
      }

      if (batchCourseCodes.has(code)) {
        duplicateCoursesInBatch.push(code);
      }
      batchCourseCodes.add(code);

      if (existingCourseCodeSet.has(code)) {
        duplicateCoursesInDb.push(code);
      }

      // Parent program reference check
      const progExistsInDb = existingProgCodeSet.has(progRef);
      const progExistsInBatch = batchProgCodes.has(progRef);
      if (!progExistsInDb && !progExistsInBatch && progRef) {
        warnings.push(`Course "${code}" references program "${progRef}" which was not detected.`);
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      duplicates: {
        departmentsInDb: duplicateDeptsInDb,
        programsInDb: duplicateProgsInDb,
        coursesInDb: duplicateCoursesInDb,
        coursesInBatch: duplicateCoursesInBatch,
      },
      stats: {
        departmentsTotal: args.departments.length,
        programsTotal: args.programs.length,
        coursesTotal: args.courses.length,
        coursesExisting: duplicateCoursesInDb.length,
        coursesNew: args.courses.length - duplicateCoursesInDb.length,
      },
    };
  },
});

/**
 * Convex Mutation: Atomic, Transactional Academic Batch Import.
 * Executes inside an ACID Convex transaction:
 * 1. Resolves or creates departments, maintaining relational foreign keys.
 * 2. Resolves or creates academic degree programs.
 * 3. Inserts verified course offerings with relational department and program IDs.
 * 4. Logs a comprehensive administrative audit record.
 */
export const importAcademicBatch = mutation({
  args: {
    departments: v.array(
      v.object({
        code: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        headOfDepartment: v.optional(v.string()),
        status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
      })
    ),
    programs: v.array(
      v.object({
        code: v.string(),
        name: v.string(),
        departmentCode: v.string(),
        departmentName: v.optional(v.string()),
        degreeLevel: v.optional(
          v.union(v.literal("Undergraduate"), v.literal("Graduate"), v.literal("Postgraduate"))
        ),
        duration: v.optional(v.string()),
        totalCreditHours: v.optional(v.number()),
        description: v.optional(v.string()),
        status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
      })
    ),
    courses: v.array(
      v.object({
        code: v.string(),
        name: v.string(),
        creditHours: v.number(),
        semester: v.number(),
        programCode: v.string(),
        programName: v.optional(v.string()),
        departmentCode: v.optional(v.string()),
        departmentName: v.optional(v.string()),
        description: v.optional(v.string()),
        prerequisites: v.optional(v.array(v.string())),
        courseType: v.optional(v.string()),
        status: v.optional(v.union(v.literal("Active"), v.literal("Inactive"))),
      })
    ),
    adminName: v.string(),
    adminEmail: v.string(),
    adminId: v.optional(v.string()),
    originalPrompt: v.optional(v.string()),
    sourceType: v.union(
      v.literal("ai_prompt"),
      v.literal("csv_upload"),
      v.literal("excel_upload"),
      v.literal("document_pdf")
    ),
    skipExistingDuplicates: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const skipExisting = args.skipExistingDuplicates ?? true;

    // Load existing DB tables for relationship resolution and duplicate detection
    const existingDepts = await ctx.db.query("departments").collect();
    const existingAcademicPrograms = await ctx.db.query("academicPrograms").collect();
    const existingCourses = await ctx.db.query("courses").collect();

    // --------------------------------------------------------------------------
    // 1. DEPARTMENTS RESOLUTION & INSERTION
    // --------------------------------------------------------------------------
    const deptMapByCode = new Map<string, { id: string; code: string; name: string }>();
    const deptMapByName = new Map<string, { id: string; code: string; name: string }>();

    for (const d of existingDepts) {
      const entry = { id: String(d._id), code: d.code, name: d.name };
      deptMapByCode.set(d.code.trim().toUpperCase(), entry);
      deptMapByName.set(d.name.trim().toLowerCase(), entry);
    }

    const createdDepartmentIds: string[] = [];
    const skippedDepartmentNames: string[] = [];

    for (const d of args.departments) {
      const code = d.code.trim().toUpperCase();
      const name = d.name.trim();
      const lowerName = name.toLowerCase();

      let existing = deptMapByCode.get(code) || deptMapByName.get(lowerName);

      if (existing) {
        skippedDepartmentNames.push(`${name} (${code})`);
      } else {
        // Create new department
        const newDeptId = await ctx.db.insert("departments", {
          code,
          name,
          description: d.description || `Department of ${name}`,
          headOfDepartment: d.headOfDepartment || undefined,
          status: d.status || "active",
          createdAt: now,
        });

        const entry = { id: String(newDeptId), code, name };
        deptMapByCode.set(code, entry);
        deptMapByName.set(lowerName, entry);
        createdDepartmentIds.push(String(newDeptId));
      }
    }

    // Default fallback department if none exists or none provided
    if (deptMapByCode.size === 0 && existingDepts.length > 0) {
      const first = existingDepts[0];
      const entry = { id: String(first._id), code: first.code, name: first.name };
      deptMapByCode.set(first.code.trim().toUpperCase(), entry);
      deptMapByName.set(first.name.trim().toLowerCase(), entry);
    }

    // --------------------------------------------------------------------------
    // 2. PROGRAMS RESOLUTION & INSERTION
    // --------------------------------------------------------------------------
    const progMapByCode = new Map<
      string,
      { id: string; code: string; name: string; departmentId: string; department: string }
    >();
    const progMapByName = new Map<
      string,
      { id: string; code: string; name: string; departmentId: string; department: string }
    >();

    for (const p of existingAcademicPrograms) {
      const entry = {
        id: String(p._id),
        code: p.code,
        name: p.name,
        departmentId: p.departmentId || "",
        department: p.department,
      };
      progMapByCode.set(p.code.trim().toUpperCase(), entry);
      progMapByName.set(p.name.trim().toLowerCase(), entry);
    }

    const createdProgramIds: string[] = [];
    const skippedProgramNames: string[] = [];

    for (const p of args.programs) {
      const code = p.code.trim().toUpperCase();
      const name = p.name.trim();
      const lowerName = name.toLowerCase();

      let existing = progMapByCode.get(code) || progMapByName.get(lowerName);

      if (existing) {
        skippedProgramNames.push(`${name} (${code})`);
      } else {
        // Resolve parent department
        const deptRef = p.departmentCode.trim().toUpperCase();
        const deptNameRef = p.departmentName?.trim().toLowerCase();
        let resolvedDept =
          deptMapByCode.get(deptRef) ||
          (deptNameRef ? deptMapByName.get(deptNameRef) : undefined) ||
          (deptMapByCode.size > 0 ? Array.from(deptMapByCode.values())[0] : null);

        const deptName = resolvedDept ? resolvedDept.name : "Computing & Technology";
        const deptId = resolvedDept ? resolvedDept.id : undefined;

        const degreeLevel = p.degreeLevel || "Undergraduate";
        const duration = p.duration || "4 Years (8 Semesters)";
        const totalCreditHours = p.totalCreditHours || 134;

        // Insert into academicPrograms
        const newProgId = await ctx.db.insert("academicPrograms", {
          code,
          name,
          department: deptName,
          departmentId: deptId,
          degreeLevel,
          duration,
          totalCreditHours,
          description: p.description || `${name} degree program curriculum.`,
          status: p.status || "active",
          createdAt: now,
        });

        // Also ensure record in admissions catalog (programs table) if not present
        const existingAdmissionsProg = await ctx.db
          .query("programs")
          .withIndex("by_code", (q) => q.eq("code", code))
          .first();

        if (!existingAdmissionsProg) {
          await ctx.db.insert("programs", {
            code,
            name,
            degreeType: degreeLevel,
            campus: "Islamabad Main Campus",
            department: deptName,
            availableIntakes: ["Fall", "Spring"],
            availableShifts: ["Morning", "Evening"],
            status: "active",
          });
        }

        const entry = {
          id: String(newProgId),
          code,
          name,
          departmentId: deptId || "",
          department: deptName,
        };
        progMapByCode.set(code, entry);
        progMapByName.set(lowerName, entry);
        createdProgramIds.push(String(newProgId));
      }
    }

    // --------------------------------------------------------------------------
    // 3. COURSES RESOLUTION & INSERTION
    // --------------------------------------------------------------------------
    const existingCourseCodes = new Set(
      existingCourses.map((c) => c.code.trim().toUpperCase())
    );

    const createdCourseIds: string[] = [];
    const skippedCourseCodes: string[] = [];
    const insertedCourseCodesInThisBatch = new Set<string>();

    for (const c of args.courses) {
      const code = c.code.trim().toUpperCase();
      const name = c.name.trim();

      if (!code || !name) continue;

      // Duplicate check against existing DB records or repeated batch entries
      if (existingCourseCodes.has(code) || insertedCourseCodesInThisBatch.has(code)) {
        if (skipExisting) {
          skippedCourseCodes.push(code);
          continue;
        }
      }

      // Resolve program
      const progRef = c.programCode.trim().toUpperCase();
      const progNameRef = c.programName?.trim().toLowerCase();
      let resolvedProg =
        progMapByCode.get(progRef) ||
        (progNameRef ? progMapByName.get(progNameRef) : undefined) ||
        (progMapByCode.size > 0 ? Array.from(progMapByCode.values())[0] : null);

      // Resolve department
      const deptRef = c.departmentCode?.trim().toUpperCase();
      const deptNameRef = c.departmentName?.trim().toLowerCase();
      let resolvedDept =
        (deptRef ? deptMapByCode.get(deptRef) : null) ||
        (deptNameRef ? deptMapByName.get(deptNameRef) : null) ||
        (resolvedProg?.departmentId ? deptMapByCode.get(resolvedProg.departmentId) : null) ||
        (deptMapByCode.size > 0 ? Array.from(deptMapByCode.values())[0] : null);

      const progName = resolvedProg ? resolvedProg.name : "Academic Curriculum";
      const progId = resolvedProg ? resolvedProg.id : undefined;
      const deptName = resolvedDept
        ? resolvedDept.name
        : resolvedProg
        ? resolvedProg.department
        : "Computing & Technology";
      const deptId = resolvedDept ? resolvedDept.id : undefined;

      const creditHours = Math.max(1, Math.min(6, Number(c.creditHours) || 3));
      const semester = Math.max(1, Math.min(12, Number(c.semester) || 1));
      const prerequisites = Array.isArray(c.prerequisites) ? c.prerequisites : [];
      const description =
        c.description?.trim() || `${name} (${code}) curriculum offering for ${progName}.`;

      const newCourseId = await ctx.db.insert("courses", {
        code,
        name,
        description,
        creditHours,
        department: deptName,
        departmentId: deptId,
        program: progName,
        programId: progId,
        degreeProgramId: progId,
        semester,
        prerequisites,
        status: c.status || "Active",
        createdAt: now,
        updatedAt: now,
      });

      insertedCourseCodesInThisBatch.add(code);
      createdCourseIds.push(String(newCourseId));
    }

    // --------------------------------------------------------------------------
    // 4. AUDIT LOG RECORDING
    // --------------------------------------------------------------------------
    const auditDetails = [
      `AI Academic Import (${args.sourceType.toUpperCase()}):`,
      `Created ${createdCourseIds.length} courses,`,
      `Created ${createdProgramIds.length} programs,`,
      `Created ${createdDepartmentIds.length} departments.`,
      skippedCourseCodes.length > 0
        ? `Skipped ${skippedCourseCodes.length} duplicate course(s).`
        : ``,
      args.originalPrompt ? `Prompt snippet: "${args.originalPrompt.slice(0, 120)}..."` : ``,
    ]
      .filter(Boolean)
      .join(" ");

    const auditLogId = await ctx.db.insert("auditLogs", {
      adminId: args.adminId || "admin",
      adminName: args.adminName,
      adminEmail: args.adminEmail,
      actionType: "create",
      module: "AI Academic Assistant",
      details: auditDetails,
      timestamp: now,
    });

    return {
      success: true,
      departmentsCreated: createdDepartmentIds.length,
      departmentsSkipped: skippedDepartmentNames.length,
      programsCreated: createdProgramIds.length,
      programsSkipped: skippedProgramNames.length,
      coursesCreated: createdCourseIds.length,
      coursesSkipped: skippedCourseCodes.length,
      auditLogId: String(auditLogId),
      timestamp: now,
    };
  },
});

/**
 * Convex Query: Retrieve historical AI Academic Data Assistant audit logs
 */
export const getAiImportAuditLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const allLogs = await ctx.db
      .query("auditLogs")
      .withIndex("by_module", (q) => q.eq("module", "AI Academic Assistant"))
      .order("desc")
      .take(limit);

    return allLogs;
  },
});
