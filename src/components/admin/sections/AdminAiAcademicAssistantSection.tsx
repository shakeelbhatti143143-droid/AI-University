"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  Sparkles,
  Bot,
  Brain,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Trash2,
  Edit3,
  Plus,
  ArrowRight,
  ShieldCheck,
  Download,
  UploadCloud,
  RefreshCw,
  Layers,
  Building2,
  GraduationCap,
  BookOpen,
  Calendar,
  Check,
  X,
  Search,
  Sliders,
  CheckCheck,
  History,
  Info,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";

interface DepartmentData {
  code: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
  isExisting?: boolean;
}

interface ProgramData {
  code: string;
  name: string;
  departmentCode: string;
  departmentName?: string;
  degreeLevel: "Undergraduate" | "Graduate" | "Postgraduate";
  duration: string;
  totalCreditHours: number;
  description?: string;
  isExisting?: boolean;
}

interface CourseData {
  id: string; // temporary client ID
  code: string;
  name: string;
  creditHours: number;
  semester: number;
  programCode: string;
  programName?: string;
  departmentCode?: string;
  description?: string;
  prerequisites: string[];
  courseType?: "Core" | "Elective" | "General" | "Lab";
  isExisting?: boolean;
}

interface ReviewFlag {
  entity: "department" | "program" | "course" | "semester";
  code?: string;
  field: string;
  issue: string;
}

interface ImportSummaryResult {
  departmentsCreated: number;
  departmentsSkipped: number;
  programsCreated: number;
  programsSkipped: number;
  coursesCreated: number;
  coursesSkipped: number;
  auditLogId: string;
  timestamp: number;
}

interface AdminAiAcademicAssistantSectionProps {
  existingDepartments?: any[];
  existingPrograms?: any[];
  existingCourses?: any[];
  onRefreshData?: () => Promise<void>;
  onNavigateTab?: (tab: any) => void;
}

export const AdminAiAcademicAssistantSection: React.FC<
  AdminAiAcademicAssistantSectionProps
> = ({
  existingDepartments = [],
  existingPrograms = [],
  existingCourses = [],
  onRefreshData,
  onNavigateTab,
}) => {
  const { user } = useAuth();

  // Input method tabs
  const [activeInputTab, setActiveInputTab] = useState<"prompt" | "spreadsheet" | "document">("prompt");

  // Prompt state
  const [promptText, setPromptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [apiEngineUsed, setApiEngineUsed] = useState<string>("");

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileParsing, setFileParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Structured preview state (Pre-Insertion)
  const [previewDepartments, setPreviewDepartments] = useState<DepartmentData[]>([]);
  const [previewPrograms, setPreviewPrograms] = useState<ProgramData[]>([]);
  const [previewCourses, setPreviewCourses] = useState<CourseData[]>([]);
  const [reviewFlags, setReviewFlags] = useState<ReviewFlag[]>([]);
  const [activePreviewTab, setActivePreviewTab] = useState<"overview" | "semesters" | "courses" | "programs" | "departments">("semesters");
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<number | "all">("all");
  const [courseSearchFilter, setCourseSearchFilter] = useState("");

  // Editing state in preview
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseEditForm, setCourseEditForm] = useState<Partial<CourseData>>({});

  // Approval & Import state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummaryResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Existing entity sets for fast matching
  const existingDeptCodes = useMemo(
    () => new Set(existingDepartments.map((d) => d.code?.trim().toUpperCase())),
    [existingDepartments]
  );
  const existingProgCodes = useMemo(
    () => new Set(existingPrograms.map((p) => p.code?.trim().toUpperCase())),
    [existingPrograms]
  );
  const existingCourseCodes = useMemo(
    () => new Set(existingCourses.map((c) => c.code?.trim().toUpperCase())),
    [existingCourses]
  );

  // Calculate review issues & duplicate warnings
  const validationReport = useMemo(() => {
    const issues: string[] = [];
    const duplicateCourses: string[] = [];

    previewCourses.forEach((c) => {
      if (!c.code) issues.push(`Found course with missing course code.`);
      if (!c.name) issues.push(`Course "${c.code}" is missing a title.`);
      if (c.creditHours < 1 || c.creditHours > 6) {
        issues.push(`Course "${c.code}" has invalid credit hours (${c.creditHours}).`);
      }
      if (existingCourseCodes.has(c.code.trim().toUpperCase())) {
        duplicateCourses.push(c.code);
      }
    });

    return {
      issues,
      duplicateCourses,
      duplicateCount: duplicateCourses.length,
      newCoursesCount: previewCourses.length - duplicateCourses.length,
    };
  }, [previewCourses, existingCourseCodes]);

  // Sample prompt templates
  const promptTemplates = [
    {
      title: "BS Computer Science (8 Semesters HEC)",
      prompt:
        "Create the BS Computer Science program under the Department of Computer Science. It has 8 semesters (134 total credit hours). Add the following courses semester-wise:\nSemester 1: CS-101 Programming Fundamentals (4 cr), CS-102 Introduction to Computing (3 cr), MTH-101 Calculus (3 cr), ENG-101 English Composition (3 cr), PHY-101 Applied Physics (3 cr).\nSemester 2: CS-103 Object Oriented Programming (4 cr, Prereq: CS-101), CS-104 Digital Logic Design (3 cr), MTH-102 Linear Algebra (3 cr), ENG-102 Communication Skills (3 cr), ISL-101 Islamic Studies (2 cr).\nSemester 3: CS-201 Data Structures & Algorithms (4 cr, Prereq: CS-103), CS-202 Computer Organization & Assembly (3 cr), CS-203 Discrete Structures (3 cr), MTH-201 Probability & Statistics (3 cr).\nSemester 4: CS-204 Operating Systems (4 cr, Prereq: CS-201), CS-205 Database Systems (4 cr), CS-206 Design & Analysis of Algorithms (3 cr, Prereq: CS-201), MTH-202 Differential Equations (3 cr).",
    },
    {
      title: "BS Artificial Intelligence (Computing Faculty)",
      prompt:
        "Create the BS Artificial Intelligence program under the Department of Computing & AI. Degree level is Undergraduate with 8 semesters and 130 credit hours.\nSemester 1: AI-101 Introduction to AI (3 cr), CS-101 Programming Fundamentals (4 cr), MTH-101 Calculus (3 cr), ENG-101 English (3 cr).\nSemester 2: CS-102 Object Oriented Programming (4 cr), MTH-102 Linear Algebra (3 cr), AI-102 Data Science Fundamentals (3 cr), CS-103 Discrete Math (3 cr).\nSemester 3: AI-201 Machine Learning Foundations (4 cr), CS-201 Data Structures (4 cr), MTH-201 Multivariable Calculus (3 cr).\nSemester 4: AI-202 Deep Learning & Neural Networks (4 cr, Prereq: AI-201), AI-203 Computer Vision (3 cr), CS-205 Database Systems (4 cr).",
    },
    {
      title: "Department of Cyber Security & Forensics",
      prompt:
        "Establish the Department of Cyber Security with code CY under Faculty of Computing. Create the BS Cyber Security program (8 semesters, 134 credit hours).\nSemester 1: CY-101 Fundamentals of Cyber Security (3 cr), CS-101 Programming (4 cr), MTH-101 Calculus (3 cr).\nSemester 2: CY-102 Secure Software Development (3 cr), CS-102 OOP (4 cr), CY-103 Network Security Essentials (3 cr).\nSemester 3: CY-201 Cryptography & Network Security (4 cr), CS-201 Data Structures (4 cr), CY-202 Ethical Hacking & Pen Testing (3 cr).\nSemester 4: CY-203 Digital Forensics & Incident Response (4 cr), CS-204 Operating Systems (4 cr).",
    },
  ];

  // ----------------------------------------------------------------------------
  // 1. GENERATE FROM NATURAL LANGUAGE PROMPT
  // ----------------------------------------------------------------------------
  const handleGenerateFromPrompt = async () => {
    if (!promptText.trim()) {
      setErrorMessage("Please enter an academic curriculum prompt.");
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationStep("Connecting to Google Gemini API...");

    try {
      setTimeout(() => setGenerationStep("Structuring departments, degree programs & courses..."), 1200);
      setTimeout(() => setGenerationStep("Resolving relational foreign keys & validating prerequisites..."), 2400);

      const res = await fetch("/api/ai/academic-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          context: {
            existingDepartments: existingDepartments.map((d) => ({ code: d.code, name: d.name })),
            existingPrograms: existingPrograms.map((p) => ({ code: p.code, name: p.name })),
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to generate academic structure.");
      }

      setApiEngineUsed(json.engine || "Google Gemini Intelligence");
      populatePreviewState(json.data);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while communicating with AI.");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  // ----------------------------------------------------------------------------
  // 2. PARSE EXCEL / CSV SPREADSHEET
  // ----------------------------------------------------------------------------
  const handleSpreadsheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setFileParsing(true);
    setErrorMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (rawRows.length === 0) {
        throw new Error("The uploaded spreadsheet contains no data rows.");
      }

      // Parse columns
      const deptsMap = new Map<string, DepartmentData>();
      const progsMap = new Map<string, ProgramData>();
      const parsedCourses: CourseData[] = [];
      const flags: ReviewFlag[] = [];

      rawRows.forEach((row, idx) => {
        // Try to read standard column names (case-insensitive)
        const getVal = (keys: string[]) => {
          for (const k of Object.keys(row)) {
            const normalized = k.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
            for (const target of keys) {
              if (normalized === target) return String(row[k]).trim();
            }
          }
          return "";
        };

        const deptCode = getVal(["deptcode", "departmentcode", "dept"]) || "CS";
        const deptName = getVal(["deptname", "departmentname", "department"]) || `Department of ${deptCode}`;
        const progCode = getVal(["progcode", "programcode", "program"]) || "BSCS";
        const progName = getVal(["progname", "programname", "degreetitle"]) || `Bachelor of Science in ${progCode}`;
        const semVal = parseInt(getVal(["semester", "sem", "term"]) || "1", 10);
        const courseCode = getVal(["coursecode", "code", "subjectcode"]);
        const courseTitle = getVal(["coursetitle", "title", "coursename", "name", "subject"]);
        const creditVal = parseInt(getVal(["credithours", "credit", "credits", "ch"]) || "3", 10);
        const prereqRaw = getVal(["prerequisites", "prereq", "prerequisite"]);
        const desc = getVal(["description", "syllabus", "details"]);

        if (!courseCode && !courseTitle) return;

        // Collect department
        if (!deptsMap.has(deptCode.toUpperCase())) {
          deptsMap.set(deptCode.toUpperCase(), {
            code: deptCode.toUpperCase(),
            name: deptName,
            description: `Academic Department`,
          });
        }

        // Collect program
        if (!progsMap.has(progCode.toUpperCase())) {
          progsMap.set(progCode.toUpperCase(), {
            code: progCode.toUpperCase(),
            name: progName,
            departmentCode: deptCode.toUpperCase(),
            departmentName: deptName,
            degreeLevel: "Undergraduate",
            duration: "4 Years (8 Semesters)",
            totalCreditHours: 134,
          });
        }

        const prereqs = prereqRaw
          ? prereqRaw.split(/[,;|]/).map((p) => p.trim()).filter(Boolean)
          : [];

        parsedCourses.push({
          id: `course-${Date.now()}-${idx}`,
          code: (courseCode || `${deptCode}-10${idx}`).toUpperCase(),
          name: courseTitle || `Course ${courseCode}`,
          creditHours: Math.max(1, Math.min(6, isNaN(creditVal) ? 3 : creditVal)),
          semester: Math.max(1, Math.min(12, isNaN(semVal) ? 1 : semVal)),
          programCode: progCode.toUpperCase(),
          programName: progName,
          departmentCode: deptCode.toUpperCase(),
          description: desc || `${courseTitle} (${courseCode}) academic offering.`,
          prerequisites: prereqs,
          courseType: "Core",
        });
      });

      if (parsedCourses.length === 0) {
        throw new Error("Could not detect any valid course rows in the spreadsheet.");
      }

      setApiEngineUsed("High-Speed Spreadsheet Parser (Local Engine)");
      populatePreviewState({
        departments: Array.from(deptsMap.values()),
        programs: Array.from(progsMap.values()),
        courses: parsedCourses,
        reviewFlags: flags,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to parse spreadsheet file.");
    } finally {
      setFileParsing(false);
    }
  };

  // Download Sample Spreadsheet
  const handleDownloadSampleSpreadsheet = () => {
    const sampleData = [
      {
        "Department Code": "CS",
        "Department Name": "Department of Computer Science",
        "Program Code": "BSCS",
        "Program Name": "Bachelor of Science in Computer Science",
        "Semester": 1,
        "Course Code": "CS-101",
        "Course Title": "Programming Fundamentals",
        "Credit Hours": 4,
        "Prerequisites": "",
        "Description": "Foundational programming paradigms in C++ / Python.",
      },
      {
        "Department Code": "CS",
        "Department Name": "Department of Computer Science",
        "Program Code": "BSCS",
        "Program Name": "Bachelor of Science in Computer Science",
        "Semester": 1,
        "Course Code": "MTH-101",
        "Course Title": "Calculus & Analytical Geometry",
        "Credit Hours": 3,
        "Prerequisites": "",
        "Description": "Derivatives, integrals, and vector analysis.",
      },
      {
        "Department Code": "CS",
        "Department Name": "Department of Computer Science",
        "Program Code": "BSCS",
        "Program Name": "Bachelor of Science in Computer Science",
        "Semester": 2,
        "Course Code": "CS-103",
        "Course Title": "Object Oriented Programming",
        "Credit Hours": 4,
        "Prerequisites": "CS-101",
        "Description": "Object orientation, polymorphism, inheritance, and abstractions.",
      },
      {
        "Department Code": "CS",
        "Department Name": "Department of Computer Science",
        "Program Code": "BSCS",
        "Program Name": "Bachelor of Science in Computer Science",
        "Semester": 3,
        "Course Code": "CS-201",
        "Course Title": "Data Structures & Algorithms",
        "Credit Hours": 4,
        "Prerequisites": "CS-103",
        "Description": "Trees, graphs, dynamic programming, sorting, and search algorithms.",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Academic Catalog");
    XLSX.writeFile(workbook, "iqra_university_academic_curriculum_template.xlsx");
  };

  // ----------------------------------------------------------------------------
  // 3. PARSE CURRICULUM DOCUMENT (PDF / TXT)
  // ----------------------------------------------------------------------------
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setFileParsing(true);
    setErrorMessage(null);

    try {
      const text = await file.text();
      if (!text || text.trim().length < 20) {
        throw new Error("The uploaded file does not contain readable text.");
      }

      setIsGenerating(true);
      setGenerationStep("Analyzing curriculum document with Gemini...");

      const res = await fetch("/api/ai/academic-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: text,
          documentName: file.name,
          context: {
            existingDepartments: existingDepartments.map((d) => ({ code: d.code, name: d.name })),
            existingPrograms: existingPrograms.map((p) => ({ code: p.code, name: p.name })),
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to extract curriculum from document.");
      }

      setApiEngineUsed(json.engine || "Gemini Document Intelligence");
      populatePreviewState(json.data);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process curriculum document.");
    } finally {
      setFileParsing(false);
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  // Helper to populate preview
  const populatePreviewState = (data: any) => {
    const depts: DepartmentData[] = (data.departments || []).map((d: any) => ({
      code: d.code?.trim().toUpperCase() || "CS",
      name: d.name?.trim() || "Department of Computer Science",
      description: d.description,
      headOfDepartment: d.headOfDepartment,
      isExisting: existingDeptCodes.has(d.code?.trim().toUpperCase()),
    }));

    const progs: ProgramData[] = (data.programs || []).map((p: any) => ({
      code: p.code?.trim().toUpperCase() || "BSCS",
      name: p.name?.trim() || "Degree Program",
      departmentCode: p.departmentCode?.trim().toUpperCase() || depts[0]?.code || "CS",
      departmentName: p.departmentName || depts[0]?.name,
      degreeLevel: p.degreeLevel || "Undergraduate",
      duration: p.duration || "4 Years (8 Semesters)",
      totalCreditHours: p.totalCreditHours || 134,
      description: p.description,
      isExisting: existingProgCodes.has(p.code?.trim().toUpperCase()),
    }));

    const crs: CourseData[] = (data.courses || []).map((c: any, i: number) => {
      const code = c.code?.trim().toUpperCase() || `CS-10${i}`;
      return {
        id: `course-${Date.now()}-${i}`,
        code,
        name: c.name?.trim() || `Course ${code}`,
        creditHours: c.creditHours || 3,
        semester: c.semester || 1,
        programCode: c.programCode?.trim().toUpperCase() || progs[0]?.code || "BSCS",
        programName: c.programName || progs[0]?.name,
        departmentCode: c.departmentCode?.trim().toUpperCase() || depts[0]?.code || "CS",
        description: c.description,
        prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites : [],
        courseType: c.courseType || "Core",
        isExisting: existingCourseCodes.has(code),
      };
    });

    setPreviewDepartments(depts);
    setPreviewPrograms(progs);
    setPreviewCourses(crs);
    setReviewFlags(data.reviewFlags || []);
    setActivePreviewTab("semesters");
  };

  // ----------------------------------------------------------------------------
  // INLINE COURSE EDITING IN PREVIEW
  // ----------------------------------------------------------------------------
  const handleStartEditCourse = (course: CourseData) => {
    setEditingCourseId(course.id);
    setCourseEditForm({ ...course });
  };

  const handleSaveEditCourse = (id: string) => {
    setPreviewCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedCode = (courseEditForm.code || c.code).trim().toUpperCase();
          return {
            ...c,
            ...courseEditForm,
            code: updatedCode,
            creditHours: Number(courseEditForm.creditHours) || c.creditHours,
            semester: Number(courseEditForm.semester) || c.semester,
            isExisting: existingCourseCodes.has(updatedCode),
          };
        }
        return c;
      })
    );
    setEditingCourseId(null);
  };

  const handleDeleteCourse = (id: string) => {
    setPreviewCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddNewCourse = () => {
    const newSem = selectedSemesterFilter === "all" ? 1 : selectedSemesterFilter;
    const progCode = previewPrograms[0]?.code || "BSCS";
    const deptCode = previewDepartments[0]?.code || "CS";
    const newId = `new-course-${Date.now()}`;
    const newCode = `${deptCode}-${newSem}99`;

    const newCourse: CourseData = {
      id: newId,
      code: newCode,
      name: "New Academic Subject",
      creditHours: 3,
      semester: newSem,
      programCode: progCode,
      departmentCode: deptCode,
      description: "Academic subject description.",
      prerequisites: [],
      courseType: "Core",
      isExisting: existingCourseCodes.has(newCode),
    };

    setPreviewCourses((prev) => [...prev, newCourse]);
    handleStartEditCourse(newCourse);
  };

  // ----------------------------------------------------------------------------
  // APPROVAL & CONVEX TRANSACTION
  // ----------------------------------------------------------------------------
  const handleApproveAndImport = async () => {
    if (previewCourses.length === 0) {
      setErrorMessage("There are no courses to import.");
      return;
    }

    setIsImporting(true);
    setErrorMessage(null);

    try {
      const client = getConvexClient();
      if (!client || !isConvexConfigured) {
        throw new Error("Convex client is not configured.");
      }

      // Execute atomic transaction on Convex
      const result = await client.mutation(api.academicAiImporter.importAcademicBatch, {
        departments: previewDepartments.map((d) => ({
          code: d.code,
          name: d.name,
          description: d.description,
          headOfDepartment: d.headOfDepartment,
          status: "active" as const,
        })),
        programs: previewPrograms.map((p) => ({
          code: p.code,
          name: p.name,
          departmentCode: p.departmentCode,
          departmentName: p.departmentName,
          degreeLevel: p.degreeLevel,
          duration: p.duration,
          totalCreditHours: p.totalCreditHours,
          description: p.description,
          status: "active" as const,
        })),
        courses: previewCourses.map((c) => ({
          code: c.code,
          name: c.name,
          creditHours: c.creditHours,
          semester: c.semester,
          programCode: c.programCode,
          programName: c.programName,
          departmentCode: c.departmentCode,
          description: c.description,
          prerequisites: c.prerequisites,
          status: "Active" as const,
        })),
        adminName: user?.name || "Shakeel Bhatti",
        adminEmail: user?.email || "shakeelbhatti143143@gmail.com",
        adminId: user?.id ? String(user.id) : undefined,
        originalPrompt: promptText || uploadedFile?.name || "Direct Import",
        sourceType:
          activeInputTab === "spreadsheet"
            ? "excel_upload"
            : activeInputTab === "document"
            ? "document_pdf"
            : "ai_prompt",
        skipExistingDuplicates: true,
      });

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setImportSummary(result);
      setIsApprovalModalOpen(false);

      // Refresh parent admin stores if provided
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to execute database batch import transaction.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setPreviewDepartments([]);
    setPreviewPrograms([]);
    setPreviewCourses([]);
    setReviewFlags([]);
    setImportSummary(null);
    setPromptText("");
    setUploadedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (docInputRef.current) docInputRef.current.value = "";
  };

  // Filtered courses for preview
  const filteredPreviewCourses = useMemo(() => {
    return previewCourses.filter((c) => {
      const matchesSemester =
        selectedSemesterFilter === "all" || c.semester === selectedSemesterFilter;
      const matchesSearch =
        !courseSearchFilter ||
        c.code.toLowerCase().includes(courseSearchFilter.toLowerCase()) ||
        c.name.toLowerCase().includes(courseSearchFilter.toLowerCase());
      return matchesSemester && matchesSearch;
    });
  }, [previewCourses, selectedSemesterFilter, courseSearchFilter]);

  // Unique semesters detected
  const uniqueSemesters = useMemo(() => {
    const sems = new Set<number>();
    previewCourses.forEach((c) => sems.add(c.semester));
    return Array.from(sems).sort((a, b) => a - b);
  }, [previewCourses]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ------------------------------------------------------------------------ */}
      {/* HEADER BANNER */}
      {/* ------------------------------------------------------------------------ */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Google Gemini Intelligence
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold text-slate-400">
                Institutional Academic Structuring Assistant
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACID Transactions Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              AI Academic Data Assistant
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Convert natural language curriculum descriptions, accredited syllabi, or spreadsheet files into real, relational university records. Safely inspect, edit, validate, and atomically import departments, degree programs, and courses into the active database catalog.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200">
              <Building2 className="w-4 h-4 text-iqra-gold-400" />
              <span>{existingDepartments.length} Depts in DB</span>
              <span className="text-slate-500">|</span>
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{existingCourses.length} Courses</span>
            </div>

            {previewCourses.length > 0 && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Start New Batch</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed space-y-1">
            <p className="font-bold">System Notice</p>
            <p>{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-rose-400 hover:text-rose-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------------ */}
      {/* POST-IMPORT SUCCESS SUMMARY CARD */}
      {/* ------------------------------------------------------------------------ */}
      {importSummary && (
        <div className="p-6 rounded-3xl bg-emerald-950/40 border-2 border-emerald-500/60 shadow-xl space-y-5 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <CheckCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Transaction Completed Atomically
              </span>
              <h2 className="text-xl font-black font-heading text-white">
                Academic Catalog Successfully Synchronized
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-1">
              <span className="text-slate-400">Departments Created</span>
              <p className="text-2xl font-black text-emerald-300 font-heading">
                {importSummary.departmentsCreated}
              </p>
              <span className="text-[10px] text-slate-400">
                {importSummary.departmentsSkipped} existing linked
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-1">
              <span className="text-slate-400">Degree Programs Created</span>
              <p className="text-2xl font-black text-emerald-300 font-heading">
                {importSummary.programsCreated}
              </p>
              <span className="text-[10px] text-slate-400">
                {importSummary.programsSkipped} existing linked
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-1">
              <span className="text-slate-400">Courses Added to Catalog</span>
              <p className="text-2xl font-black text-emerald-300 font-heading">
                {importSummary.coursesCreated}
              </p>
              <span className="text-[10px] text-slate-400">
                {importSummary.coursesSkipped} duplicates skipped
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-1">
              <span className="text-slate-400">Audit Reference</span>
              <p className="text-xs font-mono font-bold text-slate-300 truncate">
                {importSummary.auditLogId}
              </p>
              <span className="text-[10px] text-slate-400">Recorded in audit logs</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab?.("courses")}
              className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Inspect in Courses Catalog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab?.("departments")}
              className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Inspect Programs Catalog</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-2xl bg-transparent hover:bg-white/10 text-slate-300 text-xs font-semibold ml-auto transition-all"
            >
              Dismiss & Import Another
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------ */}
      {/* INPUT METHODS CONTAINER (If no preview active or creating new) */}
      {/* ------------------------------------------------------------------------ */}
      {previewCourses.length === 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          {/* Method selector tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveInputTab("prompt")}
                className={cn(
                  "px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2",
                  activeInputTab === "prompt"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Sparkles className="w-4 h-4" />
                <span>Natural Language AI Prompt</span>
              </button>

              <button
                onClick={() => setActiveInputTab("spreadsheet")}
                className={cn(
                  "px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2",
                  activeInputTab === "spreadsheet"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel / CSV Spreadsheet</span>
              </button>

              <button
                onClick={() => setActiveInputTab("document")}
                className={cn(
                  "px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2",
                  activeInputTab === "document"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <FileText className="w-4 h-4" />
                <span>Curriculum Document (.pdf / .txt)</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Authorized Verification</span>
            </div>
          </div>

          {/* TAB 1: NATURAL LANGUAGE AI PROMPT */}
          {activeInputTab === "prompt" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>AI Curriculum Prompt Specification</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Natural language input parsed by Google Gemini
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    rows={6}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe the academic structure you want to create... e.g. Create the BS Computer Science program under the Computer Science department. It has 8 semesters. Add the following courses semester-wise with course codes and credit hours..."
                    className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 placeholder:text-slate-400 leading-relaxed shadow-inner"
                  />
                </div>
              </div>

              {/* Sample Templates */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-500" />
                  Quick Academic Templates (Click to Populate):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {promptTemplates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPromptText(tmpl.prompt)}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-300 text-left transition-all group space-y-1"
                    >
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 line-clamp-1">
                        {tmpl.title}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-2">
                        {tmpl.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Interactive preview and editing will be shown prior to database insertion.</span>
                </div>

                <button
                  type="button"
                  disabled={isGenerating || !promptText.trim()}
                  onClick={handleGenerateFromPrompt}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{generationStep || "Generating Academic Structure..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Academic Structure</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EXCEL / CSV SPREADSHEET */}
          {activeInputTab === "spreadsheet" && (
            <div className="space-y-4">
              <div className="p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-50/80 text-center flex flex-col items-center justify-center gap-3 relative transition-all">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Upload University Curriculum Spreadsheet
                  </p>
                  <p className="text-xs text-slate-500 max-w-md">
                    Directly parses structured tabular academic courses (.xlsx, .xls, .csv). Immediately normalizes relationships without LLM latency.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleSpreadsheetUpload}
                  className="hidden"
                  id="spreadsheet-upload-input"
                />

                <div className="flex items-center gap-3 pt-2">
                  <label
                    htmlFor="spreadsheet-upload-input"
                    className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md transition-all"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Select Spreadsheet File</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleDownloadSampleSpreadsheet}
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Download Excel Template</span>
                  </button>
                </div>

                {fileParsing && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Parsing spreadsheet structure & verifying columns...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CURRICULUM DOCUMENT (.pdf, .txt) */}
          {activeInputTab === "document" && (
            <div className="space-y-4">
              <div className="p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 text-center flex flex-col items-center justify-center gap-3 relative transition-all">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner">
                  <FileText className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Upload University Curriculum Document
                  </p>
                  <p className="text-xs text-slate-500 max-w-md">
                    Upload official course catalog documents (.txt, .md, .pdf syllabus). Gemini AI extracts semester allocations and course codes.
                  </p>
                </div>

                <input
                  ref={docInputRef}
                  type="file"
                  accept=".txt, .md, .pdf"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload-input"
                />

                <div className="flex items-center gap-3 pt-2">
                  <label
                    htmlFor="document-upload-input"
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md transition-all"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Curriculum Document</span>
                  </label>
                </div>

                {isGenerating && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{generationStep || "Reading document with Gemini AI..."}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------ */}
      {/* PREVIEW & INLINE EDITING INTERFACE (Mandatory Step Before DB Write) */}
      {/* ------------------------------------------------------------------------ */}
      {previewCourses.length > 0 && (
        <div className="space-y-5 animate-in fade-in-50 duration-300">
          {/* Summary Metric Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Departments
              </span>
              <p className="text-2xl font-black font-heading text-slate-900">
                {previewDepartments.length}
              </p>
              <span className="text-[10px] text-slate-500">
                {previewDepartments.filter((d) => d.isExisting).length} existing in DB
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Degree Programs
              </span>
              <p className="text-2xl font-black font-heading text-slate-900">
                {previewPrograms.length}
              </p>
              <span className="text-[10px] text-slate-500">
                {previewPrograms.filter((p) => p.isExisting).length} existing in DB
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Semesters Mapped
              </span>
              <p className="text-2xl font-black font-heading text-slate-900">
                {uniqueSemesters.length}
              </p>
              <span className="text-[10px] text-slate-500">Semesters 1 through {Math.max(...uniqueSemesters, 1)}</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Courses Detected
              </span>
              <p className="text-2xl font-black font-heading text-indigo-600">
                {previewCourses.length}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold">
                {validationReport.newCoursesCount} New • {validationReport.duplicateCount} Existing
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Review Flags
              </span>
              <p className={cn(
                "text-2xl font-black font-heading",
                reviewFlags.length > 0 ? "text-amber-600" : "text-emerald-600"
              )}>
                {reviewFlags.length}
              </p>
              <span className="text-[10px] text-slate-500">
                {reviewFlags.length > 0 ? "Requires admin check" : "Ready for approval"}
              </span>
            </div>
          </div>

          {/* Validation / Review Flags Alerts */}
          {reviewFlags.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Review Flags Detected by Intelligence Engine ({reviewFlags.length})</span>
              </div>
              <ul className="text-xs space-y-1 pl-6 list-disc text-amber-800">
                {reviewFlags.map((flag, idx) => (
                  <li key={idx}>
                    {flag.code && <span className="font-mono font-bold mr-1">[{flag.code}]</span>}
                    {flag.issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Duplicate Protection Notice */}
          {validationReport.duplicateCount > 0 && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Duplicate Protection Active:</strong> {validationReport.duplicateCount} course(s) already exist in your database (e.g. {validationReport.duplicateCourses.slice(0, 3).join(", ")}). Existing records will be safely preserved while relational program links are verified.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-lg font-bold bg-blue-200 text-blue-950 text-[10px] shrink-0">
                Safe Upsert
              </span>
            </div>
          )}

          {/* Preview Navigation Tabs & Filtering Bar */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setActivePreviewTab("semesters")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0",
                  activePreviewTab === "semesters"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Semester-wise Matrix</span>
              </button>

              <button
                onClick={() => setActivePreviewTab("courses")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0",
                  activePreviewTab === "courses"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>All Courses ({previewCourses.length})</span>
              </button>

              <button
                onClick={() => setActivePreviewTab("programs")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0",
                  activePreviewTab === "programs"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Programs ({previewPrograms.length})</span>
              </button>

              <button
                onClick={() => setActivePreviewTab("departments")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0",
                  activePreviewTab === "departments"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Departments ({previewDepartments.length})</span>
              </button>
            </div>

            {/* Actions & Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter courses by code or title..."
                  value={courseSearchFilter}
                  onChange={(e) => setCourseSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-56 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleAddNewCourse}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------------------ */}
          {/* TAB: SEMESTER-WISE MATRIX */}
          {/* ------------------------------------------------------------------------ */}
          {activePreviewTab === "semesters" && (
            <div className="space-y-4">
              {/* Semester quick filter chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedSemesterFilter("all")}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-semibold transition-all",
                    selectedSemesterFilter === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  All Semesters
                </button>
                {uniqueSemesters.map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemesterFilter(sem)}
                    className={cn(
                      "px-3 py-1 rounded-xl text-xs font-semibold transition-all",
                      selectedSemesterFilter === sem
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    Semester {sem}
                  </button>
                ))}
              </div>

              {/* Grouped by Semesters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uniqueSemesters
                  .filter((s) => selectedSemesterFilter === "all" || selectedSemesterFilter === s)
                  .map((sem) => {
                    const semCourses = previewCourses.filter((c) => c.semester === sem);
                    const totalCredits = semCourses.reduce((acc, c) => acc + c.creditHours, 0);

                    return (
                      <div
                        key={sem}
                        className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center">
                              {sem}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900">
                              Semester {sem}
                            </h3>
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {totalCredits} Credit Hours • {semCourses.length} Subjects
                          </span>
                        </div>

                        <div className="space-y-2">
                          {semCourses.map((c) => (
                            <div
                              key={c.id}
                              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 flex items-center justify-between gap-3 text-xs group transition-all"
                            >
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">
                                    {c.code}
                                  </span>
                                  {c.isExisting && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                      In DB
                                    </span>
                                  )}
                                  {c.prerequisites.length > 0 && (
                                    <span className="text-[10px] text-slate-400">
                                      Prereq: {c.prerequisites.join(", ")}
                                    </span>
                                  )}
                                </div>
                                <p className="font-semibold text-slate-900 truncate">
                                  {c.name}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                                  {c.creditHours} CH
                                </span>
                                <button
                                  onClick={() => handleStartEditCourse(c)}
                                  className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white transition-all"
                                  title="Edit course"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(c.id)}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white transition-all"
                                  title="Remove course"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------------ */}
          {/* TAB: COMPREHENSIVE COURSES TABLE */}
          {/* ------------------------------------------------------------------------ */}
          {activePreviewTab === "courses" && (
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5 pl-5">Code</th>
                      <th className="p-3.5">Course Title</th>
                      <th className="p-3.5 text-center">Semester</th>
                      <th className="p-3.5 text-center">Credits</th>
                      <th className="p-3.5">Prerequisites</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPreviewCourses.map((c) => {
                      const isEditing = editingCourseId === c.id;

                      if (isEditing) {
                        return (
                          <tr key={c.id} className="bg-indigo-50/50">
                            <td className="p-2.5 pl-5">
                              <input
                                type="text"
                                value={courseEditForm.code || ""}
                                onChange={(e) =>
                                  setCourseEditForm({ ...courseEditForm, code: e.target.value })
                                }
                                className="w-24 p-1.5 rounded border border-indigo-300 font-mono text-xs font-bold"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={courseEditForm.name || ""}
                                onChange={(e) =>
                                  setCourseEditForm({ ...courseEditForm, name: e.target.value })
                                }
                                className="w-full p-1.5 rounded border border-indigo-300 text-xs"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="number"
                                min={1}
                                max={12}
                                value={courseEditForm.semester || 1}
                                onChange={(e) =>
                                  setCourseEditForm({
                                    ...courseEditForm,
                                    semester: parseInt(e.target.value, 10),
                                  })
                                }
                                className="w-14 p-1.5 rounded border border-indigo-300 text-xs text-center"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="number"
                                min={1}
                                max={6}
                                value={courseEditForm.creditHours || 3}
                                onChange={(e) =>
                                  setCourseEditForm({
                                    ...courseEditForm,
                                    creditHours: parseInt(e.target.value, 10),
                                  })
                                }
                                className="w-14 p-1.5 rounded border border-indigo-300 text-xs text-center"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                placeholder="CS-101, CS-102"
                                value={(courseEditForm.prerequisites || []).join(", ")}
                                onChange={(e) =>
                                  setCourseEditForm({
                                    ...courseEditForm,
                                    prerequisites: e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean),
                                  })
                                }
                                className="w-32 p-1.5 rounded border border-indigo-300 text-xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <span className="text-[10px] text-indigo-700 font-bold">Editing</span>
                            </td>
                            <td className="p-2.5 pr-5 text-right space-x-1">
                              <button
                                onClick={() => handleSaveEditCourse(c.id)}
                                className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold text-xs"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCourseId(null)}
                                className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 text-xs"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 pl-5 font-mono font-bold text-indigo-700">
                            {c.code}
                          </td>
                          <td className="p-3 font-semibold text-slate-900">
                            {c.name}
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                              Sem {c.semester}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-800">
                            {c.creditHours}
                          </td>
                          <td className="p-3 text-slate-500">
                            {c.prerequisites.length > 0
                              ? c.prerequisites.join(", ")
                              : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="p-3">
                            {c.isExisting ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                Already In DB
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Ready to Insert
                              </span>
                            )}
                          </td>
                          <td className="p-3 pr-5 text-right space-x-1">
                            <button
                              onClick={() => handleStartEditCourse(c)}
                              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(c.id)}
                              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------------ */}
          {/* TAB: PROGRAMS */}
          {/* ------------------------------------------------------------------------ */}
          {activePreviewTab === "programs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previewPrograms.map((p, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {p.code}
                    </span>
                    {p.isExisting ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Existing in DB
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        New Program
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Department</span>
                      <span className="font-semibold">{p.departmentCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Degree Level</span>
                      <span className="font-semibold">{p.degreeLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Duration</span>
                      <span className="font-semibold">{p.duration}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Credits</span>
                      <span className="font-semibold">{p.totalCreditHours} CH</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ------------------------------------------------------------------------ */}
          {/* TAB: DEPARTMENTS */}
          {/* ------------------------------------------------------------------------ */}
          {activePreviewTab === "departments" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previewDepartments.map((d, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {d.code}
                    </span>
                    {d.isExisting ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Existing Department
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        New Department
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{d.name}</h4>
                  <p className="text-xs text-slate-500">{d.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* ------------------------------------------------------------------------ */}
          {/* MANDATORY ACTION BAR: CANCEL & APPROVE & IMPORT */}
          {/* ------------------------------------------------------------------------ */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-4 z-20">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm">
                  Ready for Administrative Approval
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  {previewCourses.length} Records Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Data will only be written to Convex after your final approval.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                disabled={isImporting}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Cancel / Reset
              </button>

              <button
                type="button"
                disabled={isImporting || previewCourses.length === 0}
                onClick={() => setIsApprovalModalOpen(true)}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Import</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------ */}
      {/* FINAL CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------------------ */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Confirm Academic Import</span>
              </div>
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                You are about to commit the following verified academic structure into the live Iqra University database:
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span>Departments to insert:</span>
                  <span className="font-bold text-slate-900">
                    {previewDepartments.filter((d) => !d.isExisting).length} new
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Programs to insert:</span>
                  <span className="font-bold text-slate-900">
                    {previewPrograms.filter((p) => !p.isExisting).length} new
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Courses to insert:</span>
                  <span className="font-bold text-emerald-600 font-sans">
                    {validationReport.newCoursesCount} new records
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duplicates skipped:</span>
                  <span className="font-bold text-amber-600 font-sans">
                    {validationReport.duplicateCount} existing
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-900 text-[11px]">
                <strong>Traceability Guarantee:</strong> An immutable audit log entry will be recorded under your name (<strong>{user?.name || "Administrator"}</strong>).
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isImporting}
                onClick={() => setIsApprovalModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isImporting}
                onClick={handleApproveAndImport}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Committing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Execute Import</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
