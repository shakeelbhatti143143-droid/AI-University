import { NextRequest, NextResponse } from "next/server";

interface AcademicAiRequestPayload {
  prompt?: string;
  documentText?: string;
  documentName?: string;
  context?: {
    existingDepartments?: Array<{ code: string; name: string }>;
    existingPrograms?: Array<{ code: string; name: string }>;
  };
}

interface StructuredDepartment {
  code: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
}

interface StructuredProgram {
  code: string;
  name: string;
  departmentCode: string;
  departmentName?: string;
  degreeLevel: "Undergraduate" | "Graduate" | "Postgraduate";
  duration: string;
  totalCreditHours: number;
  description?: string;
}

interface StructuredCourse {
  code: string;
  name: string;
  creditHours: number;
  semester: number;
  programCode: string;
  programName?: string;
  departmentCode?: string;
  description?: string;
  prerequisites?: string[];
  courseType?: "Core" | "Elective" | "General" | "Lab";
}

interface ReviewFlag {
  entity: "department" | "program" | "course" | "semester";
  code?: string;
  field: string;
  issue: string;
}

interface StructuredAcademicResponse {
  departments: StructuredDepartment[];
  programs: StructuredProgram[];
  semesters: Array<{ number: number; programCode: string }>;
  courses: StructuredCourse[];
  reviewFlags: ReviewFlag[];
  sourceSummary?: string;
  confidenceScore?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: AcademicAiRequestPayload = await req.json();
    const prompt = body.prompt?.trim() || "";
    const docText = body.documentText?.trim() || "";

    const combinedInput = [
      prompt ? `ADMIN PROMPT:\n${prompt}` : "",
      docText ? `CURRICULUM DOCUMENT TEXT (${body.documentName || "Uploaded Document"}):\n${docText}` : "",
    ]
      .filter(Boolean)
      .join("\n\n---\n\n");

    if (!combinedInput) {
      return NextResponse.json(
        { error: "Please provide an academic prompt or upload a curriculum document." },
        { status: 400 }
      );
    }

    const existingDepts = body.context?.existingDepartments || [];
    const existingProgs = body.context?.existingPrograms || [];

    const existingContextStr = [
      existingDepts.length > 0
        ? `Existing University Departments in Database:\n${existingDepts.map((d) => `- Code: "${d.code}", Name: "${d.name}"`).join("\n")}`
        : "",
      existingProgs.length > 0
        ? `Existing Academic Programs in Database:\n${existingProgs.map((p) => `- Code: "${p.code}", Name: "${p.name}"`).join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const systemInstruction = `You are the Official University Academic Data Architecture AI for Iqra University.
Your task is to parse unstructured natural language descriptions, curriculum outlines, or academic syllabi into a STRICT, production-grade JSON academic catalog matching the university database schema.

DATABASE SCHEMA RULES:
1. Departments:
   - "code": short uppercase code (e.g. "CS", "SE", "BBA", "EE", "AI").
   - "name": full official name (e.g. "Department of Computer Science").
   - "description": concise description.
   - If an existing department matches the description, reuse its exact code and name.

2. Programs:
   - "code": short program code (e.g. "BSCS", "BSSE", "BSAI", "BBA", "MSCS").
   - "name": official degree title (e.g. "Bachelor of Science in Computer Science").
   - "departmentCode": the department code it belongs to.
   - "degreeLevel": MUST be one of "Undergraduate", "Graduate", "Postgraduate". Default to "Undergraduate" if Bachelor/BS, "Graduate" if MS/MPhil/Master, "Postgraduate" if PhD.
   - "duration": e.g. "4 Years (8 Semesters)" or "2 Years (4 Semesters)".
   - "totalCreditHours": integer total credit hours (e.g. 130 to 136 for BS, 30 to 36 for MS). Calculate sum of courses or standard HEC guideline.

3. Semesters:
   - Array of objects: { "number": 1..12, "programCode": "BSCS" }

4. Courses:
   - "code": unique academic course code (e.g. "CS-101", "CS-202", "MTH-101", "ENG-101", "HU-101"). Ensure hyphens or standard formatting.
   - "name": official course title (e.g. "Programming Fundamentals", "Data Structures & Algorithms").
   - "creditHours": integer between 1 and 6. Usually 3 or 4.
   - "semester": integer semester number (1 to 8, etc.).
   - "programCode": the program code this course belongs to.
   - "departmentCode": the department code.
   - "prerequisites": array of course codes (e.g. ["CS-101"] or empty array []).
   - "courseType": "Core" | "Elective" | "General" | "Lab".
   - "description": academic course catalog synopsis (1-2 sentences).

5. Strict Anti-Hallucination & Review Flags:
   - DO NOT invent nonexistent course codes if missing; format logically or mark in "reviewFlags".
   - If semester is ambiguous or missing in the source text, place in Semester 1 and add an entry in "reviewFlags":
     { "entity": "course", "code": courseCode, "field": "semester", "issue": "Semester was not explicitly specified; defaulted to Semester 1. Please verify." }
   - If credit hours are missing, default to 3 and add an entry in "reviewFlags".
   - If prerequisite is uncertain, flag it.

OUTPUT SPECIFICATION:
You MUST respond with a single valid JSON object with EXACTLY this structure:
{
  "departments": [ ... ],
  "programs": [ ... ],
  "semesters": [ ... ],
  "courses": [ ... ],
  "reviewFlags": [ ... ],
  "sourceSummary": "Brief overview of what was extracted",
  "confidenceScore": 0.95
}
Do NOT include markdown backticks or any conversational text outside the JSON.`;

        const geminiPrompt = `${systemInstruction}

${existingContextStr ? `EXISTING REPOSITORY CONTEXT:\n${existingContextStr}\n` : ""}

SOURCE DATA TO EXTRACT:
${combinedInput}
`;

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

        const geminiRes = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: geminiPrompt }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
              maxOutputTokens: 8192,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (rawText) {
            const sanitized = cleanJsonText(rawText);
            const parsed = JSON.parse(sanitized);

            const normalized = normalizeAcademicStructure(parsed, existingDepts, existingProgs);
            return NextResponse.json({
              success: true,
              data: normalized,
              engine: "Google Gemini 1.5 Flash (Structured Mode)",
            });
          }
        } else {
          console.warn("Gemini API returned error status:", geminiRes.status, await geminiRes.text());
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, activating resilient campus parser:", geminiError);
      }
    }

    // --------------------------------------------------------------------------
    // RESILIENT CAMPUS INTELLIGENCE PARSER (Fallback / Offline Guarantee)
    // --------------------------------------------------------------------------
    const fallbackParsed = parseWithCampusRulesEngine(combinedInput, existingDepts, existingProgs);

    return NextResponse.json({
      success: true,
      data: fallbackParsed,
      engine: geminiKey
        ? "Campus Academic Extraction Engine (Resilient Fallback)"
        : "Campus Academic Parser (Direct Engine - Set GEMINI_API_KEY for Advanced LLM)",
    });
  } catch (error: any) {
    console.error("AI Academic Assistant Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process academic structure with AI." },
      { status: 500 }
    );
  }
}

/**
 * Remove markdown code blocks if the LLM returned ```json ... ```
 */
function cleanJsonText(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Validates, repairs, and cross-references parsed JSON into standard types
 */
function normalizeAcademicStructure(
  parsed: any,
  existingDepts: Array<{ code: string; name: string }>,
  existingProgs: Array<{ code: string; name: string }>
): StructuredAcademicResponse {
  const departments: StructuredDepartment[] = [];
  const programs: StructuredProgram[] = [];
  const courses: StructuredCourse[] = [];
  const reviewFlags: ReviewFlag[] = Array.isArray(parsed.reviewFlags) ? parsed.reviewFlags : [];

  // 1. Normalize Departments
  if (Array.isArray(parsed.departments)) {
    for (const d of parsed.departments) {
      if (!d.name && !d.code) continue;
      const code = (d.code || d.name.slice(0, 3)).trim().toUpperCase();
      const name = (d.name || `Department of ${code}`).trim();
      departments.push({
        code,
        name,
        description: d.description || `Department of ${name}`,
        headOfDepartment: d.headOfDepartment || undefined,
      });
    }
  }

  // Ensure at least one department if programs exist
  if (departments.length === 0 && existingDepts.length > 0) {
    departments.push({
      code: existingDepts[0].code,
      name: existingDepts[0].name,
      description: `Existing University Department`,
    });
  } else if (departments.length === 0) {
    departments.push({
      code: "CS",
      name: "Department of Computer Science",
      description: "Faculty of Computing & Information Technology",
    });
  }

  const primaryDeptCode = departments[0].code;
  const primaryDeptName = departments[0].name;

  // 2. Normalize Programs
  if (Array.isArray(parsed.programs)) {
    for (const p of parsed.programs) {
      if (!p.name && !p.code) continue;
      const code = (p.code || p.name.replace(/[^A-Z]/g, "").slice(0, 5)).trim().toUpperCase();
      const name = (p.name || `Program ${code}`).trim();
      const deptCode = (p.departmentCode || primaryDeptCode).trim().toUpperCase();

      let degreeLevel: "Undergraduate" | "Graduate" | "Postgraduate" = "Undergraduate";
      if (
        p.degreeLevel === "Graduate" ||
        p.degreeLevel === "Postgraduate" ||
        p.degreeLevel === "Undergraduate"
      ) {
        degreeLevel = p.degreeLevel;
      } else if (/MS|Master|MPhil/i.test(name)) {
        degreeLevel = "Graduate";
      } else if (/PhD|Doctorate/i.test(name)) {
        degreeLevel = "Postgraduate";
      }

      programs.push({
        code,
        name,
        departmentCode: deptCode,
        departmentName: p.departmentName || primaryDeptName,
        degreeLevel,
        duration: p.duration || "4 Years (8 Semesters)",
        totalCreditHours: Number(p.totalCreditHours) || 134,
        description: p.description || `${name} degree program.`,
      });
    }
  }

  if (programs.length === 0 && existingProgs.length > 0) {
    programs.push({
      code: existingProgs[0].code,
      name: existingProgs[0].name,
      departmentCode: primaryDeptCode,
      departmentName: primaryDeptName,
      degreeLevel: "Undergraduate",
      duration: "4 Years (8 Semesters)",
      totalCreditHours: 134,
      description: "Academic Degree Program",
    });
  } else if (programs.length === 0) {
    programs.push({
      code: "BSCS",
      name: "Bachelor of Science in Computer Science",
      departmentCode: primaryDeptCode,
      departmentName: primaryDeptName,
      degreeLevel: "Undergraduate",
      duration: "4 Years (8 Semesters)",
      totalCreditHours: 134,
      description: "Undergraduate Bachelor of Science curriculum.",
    });
  }

  const primaryProgCode = programs[0].code;
  const primaryProgName = programs[0].name;

  // 3. Normalize Courses
  const detectedSemesters = new Set<number>();

  if (Array.isArray(parsed.courses)) {
    for (const c of parsed.courses) {
      if (!c.name && !c.code) continue;
      const code = (c.code || "CS-100").trim().toUpperCase();
      const name = (c.name || code).trim();
      const semester = Math.max(1, Math.min(12, Number(c.semester) || 1));
      const creditHours = Math.max(1, Math.min(6, Number(c.creditHours) || 3));
      const progCode = (c.programCode || primaryProgCode).trim().toUpperCase();
      const deptCode = (c.departmentCode || primaryDeptCode).trim().toUpperCase();

      detectedSemesters.add(semester);

      courses.push({
        code,
        name,
        creditHours,
        semester,
        programCode: progCode,
        programName: c.programName || primaryProgName,
        departmentCode: deptCode,
        description: c.description || `${name} (${code})`,
        prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites : [],
        courseType: c.courseType || "Core",
      });
    }
  }

  // Derive semesters list
  const maxSemester = Math.max(1, ...Array.from(detectedSemesters));
  const semesterCount = Math.max(maxSemester, 4);
  const semesters = Array.from({ length: semesterCount }, (_, i) => ({
    number: i + 1,
    programCode: primaryProgCode,
  }));

  return {
    departments,
    programs,
    semesters,
    courses,
    reviewFlags,
    sourceSummary: parsed.sourceSummary || `Extracted ${courses.length} courses across ${departments.length} department(s) and ${programs.length} program(s).`,
    confidenceScore: parsed.confidenceScore || 0.95,
  };
}

/**
 * Intelligent Academic Natural Language & Curriculum Parser
 * Extracts departments, degree programs, semesters, courses, credit hours,
 * and prerequisites when external LLM is offline or not configured.
 */
function parseWithCampusRulesEngine(
  text: string,
  existingDepts: Array<{ code: string; name: string }>,
  existingProgs: Array<{ code: string; name: string }>
): StructuredAcademicResponse {
  const departments: StructuredDepartment[] = [];
  const programs: StructuredProgram[] = [];
  const courses: StructuredCourse[] = [];
  const reviewFlags: ReviewFlag[] = [];

  // Detect Department
  let deptName = "Department of Computer Science";
  let deptCode = "CS";

  const deptMatch = text.match(
    /(?:under (?:the )?|department of |faculty of )([A-Za-z &]+?)(?:department|program|\.|\n|$)/i
  );
  if (deptMatch && deptMatch[1]?.trim()) {
    const rawDept = deptMatch[1].trim();
    if (!rawDept.toLowerCase().includes("program") && rawDept.length > 2) {
      deptName = rawDept.startsWith("Department") ? rawDept : `Department of ${rawDept}`;
      deptCode = rawDept
        .replace(/[^A-Za-z]/g, " ")
        .split(/\s+/)
        .filter((w) => !["of", "and", "the"].includes(w.toLowerCase()))
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 4) || "DEPT";
    }
  }

  departments.push({
    code: deptCode,
    name: deptName,
    description: `Official ${deptName} Curriculum Catalog`,
  });

  // Detect Program
  let progName = "Bachelor of Science in Computer Science";
  let progCode = "BSCS";

  const progMatch = text.match(
    /(?:create (?:the )?|program:? |curriculum for )([A-Za-z0-9 &]+?)(?:program|under|\.|\n|with|has|$)/i
  );
  if (progMatch && progMatch[1]?.trim()) {
    const rawProg = progMatch[1].trim();
    if (rawProg.length > 3) {
      progName = rawProg;
      if (/bs|bachelor/i.test(rawProg) && /computer science/i.test(rawProg)) progCode = "BSCS";
      else if (/software engineering/i.test(rawProg)) progCode = "BSSE";
      else if (/artificial intelligence/i.test(rawProg)) progCode = "BSAI";
      else if (/cyber security|cybersecurity/i.test(rawProg)) progCode = "BSCY";
      else if (/data science/i.test(rawProg)) progCode = "BSDS";
      else if (/business administration|bba/i.test(rawProg)) progCode = "BBA";
      else {
        progCode = rawProg
          .replace(/[^A-Za-z]/g, " ")
          .split(/\s+/)
          .filter((w) => !["of", "in", "and", "the"].includes(w.toLowerCase()))
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 5) || "PROG";
      }
    }
  }

  programs.push({
    code: progCode,
    name: progName,
    departmentCode: deptCode,
    departmentName: deptName,
    degreeLevel: /ms|master|mphil/i.test(progName) ? "Graduate" : "Undergraduate",
    duration: "4 Years (8 Semesters)",
    totalCreditHours: 134,
    description: `${progName} comprehensive academic degree curriculum.`,
  });

  // Extract Courses: Lines or sentences with course codes or titles
  const extractedCourses: StructuredCourse[] = [];
  const semBlocks = text.split(/(?:Semester|Term)\s*(\d+)\s*[:\-\u2013]/i);

  if (semBlocks.length > 1) {
    for (let i = 1; i < semBlocks.length; i += 2) {
      const semNum = Math.max(1, Math.min(12, parseInt(semBlocks[i], 10) || 1));
      const semContent = semBlocks[i + 1] || "";
      const courseRegex =
        /([A-Z]{2,5}[-\s]?\d{3}[A-Z]?)\s*[:\-\u2013]?\s*([^,\(\)\n\.]+?)(?:\s*\(\s*(\d+)\s*(?:cr|credit|credits|ch)?(?:\s*,\s*prereq(?:uisite)?s?[:\s]*([^)]+))?\s*\)|(?=,\s*[A-Z]{2,5}|\.|\n|$))/gi;
      let match;
      while ((match = courseRegex.exec(semContent)) !== null) {
        const code = match[1].toUpperCase().replace(/\s+/, "-");
        let name = match[2].trim().replace(/^[:\-\u2013|\s]+|[:\-\u2013|\s]+$/g, "");
        const ch = Math.max(1, Math.min(6, parseInt(match[3] || "3", 10) || 3));
        const prereqRaw = match[4] || "";
        const prerequisites = prereqRaw
          ? prereqRaw.split(/[,&]/).map((p) => p.trim()).filter(Boolean)
          : [];

        if (name.length > 1 && !/create the|department of|program/i.test(name)) {
          extractedCourses.push({
            code,
            name,
            creditHours: ch,
            semester: semNum,
            programCode: progCode,
            programName: progName,
            departmentCode: deptCode,
            description: `${name} (${code}) curriculum offering for ${progName}.`,
            prerequisites,
            courseType: "Core",
          });
        }
      }
    }
  }

  // If semester blocks didn't capture courses, try line-by-line / global matching
  if (extractedCourses.length === 0) {
    const lines = text.split(/\r?\n|;/);
    let currentSemester = 1;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const semHeaderMatch = trimmed.match(/(?:semester|term)\s*(\d+)/i);
      if (semHeaderMatch) {
        currentSemester = parseInt(semHeaderMatch[1], 10);
      }

      const codeMatch = trimmed.match(/\b([A-Z]{2,5}[-\s]?\d{3}[A-Z]?)\b/i);
      if (codeMatch) {
        const detectedCode = codeMatch[1].toUpperCase().replace(/\s+/, "-");
        let titlePart = trimmed
          .replace(new RegExp(codeMatch[0], "i"), "")
          .replace(/semester\s*\d+[:\-\s]*/i, "")
          .replace(/^\d+[\.\-\)]\s*/, "")
          .trim();

        let creditHours = 3;
        const creditMatch = trimmed.match(/\((\d+)\s*(?:cr|credit|ch)?\)|(\d+)\s*(?:cr|credit|credits|credit hours|ch)\b/i);
        if (creditMatch) {
          creditHours = parseInt(creditMatch[1] || creditMatch[2], 10);
        }

        titlePart = titlePart
          .replace(/\(\d+.*?\)/g, "")
          .replace(/[:\-\u2013|]+$/, "")
          .replace(/^[:\-\u2013|]+/, "")
          .trim();

        if (!titlePart || titlePart.length < 2) {
          titlePart = `Academic Course ${detectedCode}`;
        }

        extractedCourses.push({
          code: detectedCode,
          name: titlePart,
          creditHours: Math.max(1, Math.min(6, creditHours)),
          semester: currentSemester,
          programCode: progCode,
          programName: progName,
          departmentCode: deptCode,
          description: `${titlePart} (${detectedCode}) foundational academic syllabus.`,
          prerequisites: [],
          courseType: "Core",
        });
      }
    }
  }

  courses.push(...extractedCourses);

  // If no courses were extracted from raw text, generate a comprehensive realistic template
  if (courses.length === 0) {
    const defaultCurriculum = [
      { code: "CS-101", name: "Programming Fundamentals", ch: 4, sem: 1 },
      { code: "CS-102", name: "Introduction to Computing", ch: 3, sem: 1 },
      { code: "MTH-101", name: "Calculus & Analytical Geometry", ch: 3, sem: 1 },
      { code: "ENG-101", name: "Functional English & Communication", ch: 3, sem: 1 },
      { code: "PHY-101", name: "Applied Physics", ch: 3, sem: 1 },

      { code: "CS-103", name: "Object Oriented Programming", ch: 4, sem: 2 },
      { code: "CS-104", name: "Digital Logic Design", ch: 3, sem: 2 },
      { code: "MTH-102", name: "Linear Algebra", ch: 3, sem: 2 },
      { code: "ENG-102", name: "Technical Writing & Presentation", ch: 3, sem: 2 },
      { code: "ISL-101", name: "Islamic / Pakistan Studies", ch: 2, sem: 2 },

      { code: "CS-201", name: "Data Structures & Algorithms", ch: 4, sem: 3 },
      { code: "CS-202", name: "Computer Organization & Assembly", ch: 3, sem: 3 },
      { code: "CS-203", name: "Discrete Structures", ch: 3, sem: 3 },
      { code: "MTH-201", name: "Probability & Statistics", ch: 3, sem: 3 },

      { code: "CS-204", name: "Operating Systems", ch: 4, sem: 4 },
      { code: "CS-205", name: "Database Systems", ch: 4, sem: 4 },
      { code: "CS-206", name: "Design & Analysis of Algorithms", ch: 3, sem: 4 },
      { code: "MTH-202", name: "Differential Equations", ch: 3, sem: 4 },
    ];

    for (const item of defaultCurriculum) {
      courses.push({
        code: item.code,
        name: item.name,
        creditHours: item.ch,
        semester: item.sem,
        programCode: progCode,
        programName: progName,
        departmentCode: deptCode,
        description: `${item.name} (${item.code}) curriculum offering for ${progName}.`,
        prerequisites: item.code === "CS-103" ? ["CS-101"] : item.code === "CS-201" ? ["CS-103"] : [],
        courseType: "Core",
      });
    }

    reviewFlags.push({
      entity: "course",
      field: "catalog",
      issue: "No specific individual courses were detected in the input. Generated HEC foundational curriculum for review.",
    });
  }

  const detectedSemesters = new Set(courses.map((c) => c.semester));
  const maxSem = Math.max(8, ...Array.from(detectedSemesters));
  const semesters = Array.from({ length: maxSem }, (_, i) => ({
    number: i + 1,
    programCode: progCode,
  }));

  return {
    departments,
    programs,
    semesters,
    courses,
    reviewFlags,
    sourceSummary: `Parsed ${courses.length} courses across ${departments.length} department(s) and ${programs.length} program(s).`,
    confidenceScore: 0.9,
  };
}
