"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2,
  Loader2,
  FileCheck,
  Lock,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UniversityLogo } from "@/components/ui/UniversityLogo";
import { Button } from "@/components/ui/Button";
import { InputField, InputThemeContext } from "@/components/ui/InputField";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

interface DepartmentItem {
  _id: string;
  name: string;
  code: string;
  headOfDepartment?: string;
  status: "active" | "inactive";
}

interface ProgramItem {
  _id: string;
  name: string;
  code: string;
  degreeLevel?: string;
  department: string;
  departmentId?: string;
  status: "active" | "inactive";
}

interface UploadedDoc {
  name: string;
  documentType: string;
  storageId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: number;
}

const DOCUMENT_TYPES = [
  { id: "photo", label: "Recent Passport-size Photo", required: true, accept: "image/*" },
  { id: "cnic", label: "CNIC / B-Form Document", required: true, accept: "image/*,application/pdf" },
  { id: "matric_cert", label: "Matric / O-Level Certificate", required: true, accept: "image/*,application/pdf" },
  { id: "inter_cert", label: "Intermediate / A-Level Certificate", required: true, accept: "image/*,application/pdf" },
  { id: "matric_marksheet", label: "Matric Mark Sheet", required: true, accept: "image/*,application/pdf" },
  { id: "inter_marksheet", label: "Intermediate Mark Sheet", required: true, accept: "image/*,application/pdf" },
  { id: "other", label: "Other Supporting Documents (Optional)", required: false, accept: "image/*,application/pdf" },
];

export default function AdmissionApplicationPage() {
  const router = useRouter();
  const { user, login, register, isLoading: authLoading } = useAuth();

  // Active step: 0 = Account Creation, 1 = Personal, 2 = Academic, 3 = Program & Preferences, 4 = Guardian, 5 = Documents, 6 = Review & Declaration, 7 = Confirmed
  const [step, setStep] = useState<number>(0);

  // Dynamic Database Departments & Degree Programs
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [departmentSearch, setDepartmentSearch] = useState<string>("");

  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");

  // Step 0: Account Creation (for visitors without account)
  const [accName, setAccName] = useState("");
  const [accEmail, setAccEmail] = useState("");
  const [accPassword, setAccPassword] = useState("");
  const [accConfirmPassword, setAccConfirmPassword] = useState("");
  const [accLoading, setAccLoading] = useState(false);
  const [accError, setAccError] = useState("");

  // Step 1: Personal Info
  const [personal, setPersonal] = useState({
    fullName: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "Male",
    cnic: "",
    email: "",
    phone: "",
    alternatePhone: "",
    nationality: "Pakistani",
    domicile: "Islamabad",
    address: "",
    city: "Islamabad",
    province: "Islamabad Capital Territory",
  });

  // Step 2: Academic Info
  const [academic, setAcademic] = useState({
    degreeApplyingFor: "",
    programType: "Undergraduate",
    preferredCampus: "Chak Shezad Campus, Islamabad",
    admissionType: "Regular",
    previousQualification: "Intermediate",
    schoolCollege: "",
    boardUniversity: "Federal Board (FBISE)",
    passingYear: "2024",
    totalMarks: "1100",
    obtainedMarks: "",
    percentage: "",
  });

  // Step 3: Program Preferences
  const [preferences, setPreferences] = useState({
    firstChoice: "",
    secondChoice: "",
    shift: "Morning",
    intake: "Fall",
  });

  // Step 4: Guardian Info
  const [guardian, setGuardian] = useState({
    guardianName: "",
    relationship: "Father",
    guardianCnic: "",
    guardianPhone: "",
    guardianEmail: "",
    occupation: "",
    monthlyIncome: "100,000 - 200,000 PKR",
  });

  // Step 5: Documents
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  // Step 6: Final Declaration
  const [declaration, setDeclaration] = useState({
    hearAboutUs: "University Website / Social Media",
    agreedTerms: false,
    agreedDeclaration: false,
  });

  // Errors & UI state
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    applicationId: string;
    submittedAt: number;
    program: string;
  } | null>(null);

  // Sync logged in user details to personal form
  useEffect(() => {
    if (user) {
      setPersonal((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.personalEmail || user.email,
      }));
      // If user is already authenticated and step is 0, advance to step 1
      if (step === 0) {
        setStep(1);
      }
    }
  }, [user, step]);

  // 1. Fetch real active Departments from Convex database
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const client = getConvexClient();
        if (client && isConvexConfigured) {
          const depts = await client.query(api.academicManagement.getDepartments, {});
          const activeDepts = (depts || []).filter((d: any) => d.status === "active");
          setDepartments(activeDepts as DepartmentItem[]);
        }
      } catch (err) {
        console.warn("Failed to fetch departments:", err);
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  // 2. Fetch real active Degree Programs dynamically whenever selected department changes
  useEffect(() => {
    if (!selectedDeptId) {
      setPrograms([]);
      setSelectedProgramId("");
      return;
    }

    const fetchProgramsForDept = async () => {
      setLoadingPrograms(true);
      try {
        const client = getConvexClient();
        if (client && isConvexConfigured) {
          const progs = await client.query(api.academicManagement.getDegreeProgramsByDepartment, {
            departmentId: selectedDeptId,
          });
          const activeProgs = (progs || []).filter((p: any) => p.status === "active");
          setPrograms(activeProgs as ProgramItem[]);
          if (activeProgs.length > 0) {
            setSelectedProgramId(activeProgs[0]._id);
            setAcademic((prev) => ({ ...prev, degreeApplyingFor: activeProgs[0].name }));
            setPreferences((prev) => ({
              ...prev,
              firstChoice: activeProgs[0].name,
              secondChoice: activeProgs[1]?.name || activeProgs[0].name,
            }));
          } else {
            setSelectedProgramId("");
            setAcademic((prev) => ({ ...prev, degreeApplyingFor: "" }));
            setPreferences((prev) => ({ ...prev, firstChoice: "", secondChoice: "" }));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch degree programs for department:", err);
        setPrograms([]);
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchProgramsForDept();
  }, [selectedDeptId]);

  // Calculate percentage automatically
  useEffect(() => {
    const total = parseFloat(academic.totalMarks);
    const obt = parseFloat(academic.obtainedMarks);
    if (!isNaN(total) && !isNaN(obt) && total > 0 && obt >= 0) {
      const pct = ((obt / total) * 100).toFixed(2);
      setAcademic((prev) => ({ ...prev, percentage: `${pct}%` }));
    }
  }, [academic.totalMarks, academic.obtainedMarks]);

  // Step 0: Create Account & start application
  const handleAccountCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccError("");

    if (!accName.trim()) {
      setAccError("Please enter your full name.");
      return;
    }
    if (!accEmail.trim() || !accEmail.includes("@")) {
      setAccError("Please provide a valid email address.");
      return;
    }
    if (accPassword.length < 6) {
      setAccError("Password must be at least 6 characters.");
      return;
    }
    if (accPassword !== accConfirmPassword) {
      setAccError("Passwords do not match.");
      return;
    }

    setAccLoading(true);
    try {
      const res = await register(accName, accEmail, accPassword, "applicant");
      if (res.success) {
        setPersonal((prev) => ({
          ...prev,
          fullName: accName,
          email: accEmail,
        }));
        setStep(1);
      } else {
        setAccError(res.error || "Could not create account.");
      }
    } catch (err: any) {
      setAccError(err.message || "An unexpected error occurred.");
    } finally {
      setAccLoading(false);
    }
  };

  // Document Upload Handler via Convex Storage
  const handleFileUpload = async (docType: typeof DOCUMENT_TYPES[0], file: File) => {
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    setUploadingDocId(docType.id);
    try {
      const client = getConvexClient();
      if (!client || !isConvexConfigured) {
        throw new Error("Storage client is not configured.");
      }

      // 1. Generate signed upload URL from Convex
      const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {});

      // 2. Upload raw file to URL
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("File upload failed on storage server.");
      }

      const { storageId } = await response.json();

      // 3. Add to uploaded documents list
      const newDoc: UploadedDoc = {
        name: docType.label,
        documentType: docType.id,
        storageId,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: Date.now(),
      };

      setDocuments((prev) => [...prev.filter((d) => d.documentType !== docType.id), newDoc]);
    } catch (err: any) {
      alert(err.message || "Failed to upload document. Please retry.");
    } finally {
      setUploadingDocId(null);
    }
  };

  // Validations per step
  const validateStep = (currentStep: number): boolean => {
    setFormError("");
    if (currentStep === 1) {
      if (!personal.fullName.trim() || !personal.fatherName.trim()) {
        setFormError("Full Name and Father's Name are required.");
        return false;
      }
      if (!personal.cnic.trim()) {
        setFormError("CNIC / B-Form number is required.");
        return false;
      }
      if (!personal.phone.trim()) {
        setFormError("Valid contact phone number is required.");
        return false;
      }
      if (!personal.address.trim()) {
        setFormError("Residential address is required.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!academic.schoolCollege.trim()) {
        setFormError("Previous School / College name is required.");
        return false;
      }
      if (!academic.obtainedMarks.trim()) {
        setFormError("Obtained Marks or CGPA is required.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!selectedDeptId) {
        setFormError("Please select an academic department.");
        return false;
      }
      if (!selectedProgramId) {
        setFormError("Please select a degree program belonging to your chosen department.");
        return false;
      }
    }

    if (currentStep === 4) {
      if (!guardian.guardianName.trim() || !guardian.guardianPhone.trim()) {
        setFormError("Guardian Name and Phone Number are required.");
        return false;
      }
      if (!guardian.guardianCnic.trim()) {
        setFormError("Guardian CNIC number is required.");
        return false;
      }
    }

    if (currentStep === 5) {
      const missingRequired = DOCUMENT_TYPES.filter(
        (dt) => dt.required && !documents.some((d) => d.documentType === dt.id)
      );
      if (missingRequired.length > 0) {
        setFormError(`Please upload all required documents: ${missingRequired.map((m) => m.label).join(", ")}.`);
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setFormError("");
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit application
  const handleSubmitApplication = async () => {
    if (!declaration.agreedTerms || !declaration.agreedDeclaration) {
      setFormError("You must read and accept the university terms and declaration before submitting.");
      return;
    }

    if (!user) {
      setFormError("Please sign in or register to submit your application.");
      return;
    }

    if (!selectedDeptId || !selectedProgramId) {
      setFormError("Please select a valid academic department and degree program.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const client = getConvexClient();
      if (!client || !isConvexConfigured) {
        throw new Error("Backend service is not configured.");
      }

      const selectedProg = programs.find((p) => p._id === selectedProgramId);
      const chosenProgramName = selectedProg?.name || preferences.firstChoice;

      const res = await client.mutation(api.applications.submitApplication, {
        userId: user.id as any,
        departmentId: selectedDeptId,
        degreeProgramId: selectedProgramId,
        personalInformation: personal,
        academicInformation: {
          ...academic,
          degreeApplyingFor: chosenProgramName,
        },
        programPreferences: {
          ...preferences,
          firstChoice: chosenProgramName,
        },
        guardianInformation: guardian,
        documents,
        finalDeclaration: declaration,
      });

      if (res.success) {
        setSubmissionResult({
          applicationId: res.applicationId,
          submittedAt: Date.now(),
          program: chosenProgramName,
        });
        setStep(7); // Confirmed screen
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to submit application. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { title: "Account", icon: Lock },
    { title: "Personal", icon: User },
    { title: "Academic", icon: GraduationCap },
    { title: "Program", icon: Building },
    { title: "Guardian", icon: Users },
    { title: "Documents", icon: Upload },
    { title: "Review", icon: FileCheck },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050e1d] text-white flex flex-col selection:bg-iqra-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="w-full border-b border-white/10 bg-[#050e1d]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <UniversityLogo variant="default" size="sm" />

          <div className="flex items-center gap-3">
            <Link href="/status" className="text-xs text-blue-300 hover:text-white transition-colors">
              Check Application Status
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <InputThemeContext.Provider value="dark">
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-iqra-gold-400" />
            <span>Admissions Academic Session 2026</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white">
            Online Admission Application
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Iqra University Chak Shezad Campus, Islamabad • Chartered by Federal Government
          </p>
        </div>

        {/* Stepper Progress Bar (only if not on confirmation screen) */}
        {step < 7 && (
          <div className="mb-10 w-full overflow-x-auto pb-2">
            <div className="flex items-center justify-between min-w-[580px] px-2">
              {stepsList.map((st, idx) => {
                const Icon = st.icon;
                const isCompleted = step > idx;
                const isCurrent = step === idx;

                return (
                  <React.Fragment key={st.title}>
                    <div className="flex flex-col items-center gap-1.5 relative">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                            : isCurrent
                            ? "bg-iqra-gold-500 text-slate-950 font-bold ring-4 ring-iqra-gold-500/30 scale-105"
                            : "bg-white/5 border border-white/20 text-slate-400"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          isCurrent ? "text-iqra-gold-400 font-bold" : isCompleted ? "text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>

                    {idx < stepsList.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                          step > idx ? "bg-emerald-500" : "bg-white/10"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div className="flex-1 font-medium">{formError}</div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 0: ACCOUNT CREATION (If user is not logged in) */}
        {/* ========================================================================= */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-[#0a1628]/95 border border-white/15 backdrop-blur-xl shadow-2xl shadow-blue-950/50"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-iqra-gold-500/20 border border-iqra-gold-500/30 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-iqra-gold-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Create Applicant Account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Register to track your admission status and access your application anytime.
              </p>
            </div>

            {accError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {accError}
              </div>
            )}

            <form onSubmit={handleAccountCreate} className="space-y-4">
              <InputField
                id="acc-name"
                label="Full Name / Applicant Name"
                type="text"
                placeholder="e.g. Shakeel Ahmed"
                value={accName}
                onChange={(e) => setAccName(e.target.value)}
                required
              />

              <InputField
                id="acc-email"
                label="Personal Email Address"
                type="email"
                placeholder="applicant@gmail.com"
                value={accEmail}
                onChange={(e) => setAccEmail(e.target.value)}
                required
              />

              <div>
                <InputField
                  id="acc-password"
                  label="Password"
                  isPassword
                  placeholder="At least 6 characters"
                  value={accPassword}
                  onChange={(e) => setAccPassword(e.target.value)}
                  required
                />
                <PasswordStrength password={accPassword} />
              </div>

              <InputField
                id="acc-confirm-password"
                label="Confirm Password"
                isPassword
                placeholder="Re-enter your password"
                value={accConfirmPassword}
                onChange={(e) => setAccConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={accLoading}
                className="w-full text-slate-950 font-bold rounded-xl mt-4"
              >
                Create Account & Continue
              </Button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400">Already registered? </span>
                <Link href="/login" className="text-xs text-iqra-gold-400 hover:underline font-bold">
                  Sign In
                </Link>
              </div>
            </form>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: PERSONAL INFORMATION */}
        {/* ========================================================================= */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
          >
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-iqra-gold-400" />
                <span>1. Personal Information</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide your identity and demographic details as per official documents (CNIC / B-Form / Matric).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="fullName"
                label="Full Name (As per Matric/CNIC)"
                value={personal.fullName}
                onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                required
              />

              <InputField
                id="fatherName"
                label="Father / Guardian Name"
                value={personal.fatherName}
                onChange={(e) => setPersonal({ ...personal, fatherName: e.target.value })}
                required
              />

              <InputField
                id="dob"
                label="Date of Birth"
                type="date"
                value={personal.dateOfBirth}
                onChange={(e) => setPersonal({ ...personal, dateOfBirth: e.target.value })}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gender</label>
                <select
                  value={personal.gender}
                  onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                  className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <InputField
                id="cnic"
                label="CNIC / B-Form Number"
                placeholder="XXXXX-XXXXXXX-X"
                value={personal.cnic}
                onChange={(e) => setPersonal({ ...personal, cnic: e.target.value })}
                required
              />

              <InputField
                id="email"
                label="Personal Email Address"
                type="email"
                value={personal.email}
                onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                required
              />

              <InputField
                id="phone"
                label="Primary Phone Number"
                placeholder="+92 300 1234567"
                value={personal.phone}
                onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                required
              />

              <InputField
                id="altPhone"
                label="Alternate Phone Number (Optional)"
                placeholder="+92 321 7654321"
                value={personal.alternatePhone}
                onChange={(e) => setPersonal({ ...personal, alternatePhone: e.target.value })}
              />

              <InputField
                id="nationality"
                label="Nationality"
                value={personal.nationality}
                onChange={(e) => setPersonal({ ...personal, nationality: e.target.value })}
                required
              />

              <InputField
                id="domicile"
                label="Domicile District"
                value={personal.domicile}
                onChange={(e) => setPersonal({ ...personal, domicile: e.target.value })}
                required
              />

              <div className="md:col-span-2">
                <InputField
                  id="address"
                  label="Complete Residential Address"
                  value={personal.address}
                  onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
                  required
                />
              </div>

              <InputField
                id="city"
                label="City"
                value={personal.city}
                onChange={(e) => setPersonal({ ...personal, city: e.target.value })}
                required
              />

              <InputField
                id="province"
                label="Province"
                value={personal.province}
                onChange={(e) => setPersonal({ ...personal, province: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center justify-end pt-4">
              <Button
                variant="gold"
                size="md"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="rounded-xl px-6 text-slate-950 font-bold"
              >
                Save & Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ACADEMIC INFORMATION */}
        {/* ========================================================================= */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
          >
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-iqra-gold-400" />
                <span>2. Academic Background</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your previous educational achievements, board, marks, and passing year.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Program Type</label>
                <select
                  value={academic.programType}
                  onChange={(e) => setAcademic({ ...academic, programType: e.target.value })}
                  className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Campus</label>
                <input
                  type="text"
                  readOnly
                  value="Chak Shezad Campus, Islamabad"
                  className="w-full bg-[#0a172d]/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admission Type</label>
                <select
                  value={academic.admissionType}
                  onChange={(e) => setAcademic({ ...academic, admissionType: e.target.value })}
                  className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                >
                  <option value="Regular">Regular</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Previous Qualification</label>
                <select
                  value={academic.previousQualification}
                  onChange={(e) => setAcademic({ ...academic, previousQualification: e.target.value })}
                  className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                >
                  <option value="Intermediate">Intermediate (FSc Pre-Engineering / ICS / Pre-Medical)</option>
                  <option value="A-Level">A-Level</option>
                  <option value="Matric">Matric</option>
                  <option value="O-Level">O-Level</option>
                  <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                  <option value="Master's Degree">Master&apos;s Degree</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <InputField
                  id="schoolCollege"
                  label="School / College Name"
                  placeholder="e.g. Islamabad Model College for Boys / Roots College International"
                  value={academic.schoolCollege}
                  onChange={(e) => setAcademic({ ...academic, schoolCollege: e.target.value })}
                  required
                />
              </div>

              <InputField
                id="boardUniversity"
                label="Board / Awarding University"
                placeholder="e.g. FBISE Islamabad / Cambridge International"
                value={academic.boardUniversity}
                onChange={(e) => setAcademic({ ...academic, boardUniversity: e.target.value })}
                required
              />

              <InputField
                id="passingYear"
                label="Passing Year"
                type="number"
                placeholder="2024"
                value={academic.passingYear}
                onChange={(e) => setAcademic({ ...academic, passingYear: e.target.value })}
                required
              />

              <InputField
                id="totalMarks"
                label="Total Marks / Total CGPA"
                placeholder="1100"
                value={academic.totalMarks}
                onChange={(e) => setAcademic({ ...academic, totalMarks: e.target.value })}
                required
              />

              <InputField
                id="obtainedMarks"
                label="Obtained Marks / CGPA"
                placeholder="945"
                value={academic.obtainedMarks}
                onChange={(e) => setAcademic({ ...academic, obtainedMarks: e.target.value })}
                required
              />

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Calculated Percentage / Standing</label>
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-blue-300 text-sm font-bold flex items-center justify-between">
                  <span>Score Percentage:</span>
                  <span className="text-iqra-gold-400 font-mono text-base">{academic.percentage || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="md"
                onClick={handleBack}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                className="rounded-xl border-white/20 text-slate-300"
              >
                Back
              </Button>
              <Button
                variant="gold"
                size="md"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="rounded-xl px-6 text-slate-950 font-bold"
              >
                Save & Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PROGRAM SELECTION & PREFERENCES */}
        {/* ========================================================================= */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
          >
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-iqra-gold-400" />
                <span>3. Degree & Program Selection</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose your desired academic programs dynamically retrieved from the University database.
              </p>
            </div>

            <div className="space-y-5">
              {/* 1. Dynamic Searchable Department Dropdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Select Department <span className="text-rose-400">*</span>
                  </label>
                  {loadingDepartments && (
                    <span className="text-[11px] text-iqra-gold-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Fetching departments...
                    </span>
                  )}
                </div>

                {loadingDepartments ? (
                  <div className="p-4 rounded-2xl bg-[#0a172d]/80 border border-white/10 text-xs text-blue-300 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-iqra-gold-400" />
                    <span>Loading verified academic departments from database...</span>
                  </div>
                ) : departments.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>No departments are currently available for applications.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {departments.length > 4 && (
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Filter departments by name or code..."
                          value={departmentSearch}
                          onChange={(e) => setDepartmentSearch(e.target.value)}
                          className="w-full bg-[#071120] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-iqra-gold-500"
                        />
                      </div>
                    )}
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-iqra-gold-500"
                    >
                      <option value="">-- Select Academic Department --</option>
                      {departments
                        .filter(
                          (d) =>
                            d.name.toLowerCase().includes(departmentSearch.toLowerCase()) ||
                            d.code.toLowerCase().includes(departmentSearch.toLowerCase())
                        )
                        .map((dept) => (
                          <option key={dept._id} value={dept._id}>
                            {dept.name} ({dept.code}){dept.headOfDepartment ? ` • HOD: ${dept.headOfDepartment}` : ""}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 2. Dynamic Dependent Degree Program Dropdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Degree Program <span className="text-rose-400">*</span>
                  </label>
                  {loadingPrograms && (
                    <span className="text-[11px] text-iqra-gold-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading programs...
                    </span>
                  )}
                </div>

                {!selectedDeptId ? (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Please select an academic department above to view available degree programs.</span>
                  </div>
                ) : loadingPrograms ? (
                  <div className="p-4 rounded-2xl bg-[#0a172d]/80 border border-white/10 text-xs text-blue-300 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-iqra-gold-400" />
                    <span>Retrieving programs belonging to selected department...</span>
                  </div>
                ) : programs.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>No degree programs are available for this department.</span>
                  </div>
                ) : (
                  <select
                    value={selectedProgramId}
                    onChange={(e) => {
                      const pId = e.target.value;
                      setSelectedProgramId(pId);
                      const chosen = programs.find((p) => p._id === pId);
                      if (chosen) {
                        setAcademic((prev) => ({ ...prev, degreeApplyingFor: chosen.name }));
                        setPreferences((prev) => ({ ...prev, firstChoice: chosen.name }));
                      }
                    }}
                    className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-iqra-gold-500"
                  >
                    <option value="">-- Select Degree Program --</option>
                    {programs.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.code}) — {p.degreeLevel || "Undergraduate"}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 3. Second Choice Program (Optional within same department) */}
              {programs.length > 1 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Second Choice Degree Program (Optional)
                  </label>
                  <select
                    value={preferences.secondChoice}
                    onChange={(e) => setPreferences({ ...preferences, secondChoice: e.target.value })}
                    className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                  >
                    <option value="">-- No Second Choice --</option>
                    {programs
                      .filter((p) => p._id !== selectedProgramId)
                      .map((p) => (
                        <option key={`second-${p._id}`} value={p.name}>
                          {p.name} ({p.code})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Shift</label>
                  <select
                    value={preferences.shift}
                    onChange={(e) => setPreferences({ ...preferences, shift: e.target.value })}
                    className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                  >
                    <option value="Morning">Morning Shift</option>
                    <option value="Evening">Evening Shift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Intake</label>
                  <select
                    value={preferences.intake}
                    onChange={(e) => setPreferences({ ...preferences, intake: e.target.value })}
                    className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                  >
                    <option value="Fall">Fall 2026</option>
                    <option value="Spring">Spring 2026</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="md"
                onClick={handleBack}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                className="rounded-xl border-white/20 text-slate-300"
              >
                Back
              </Button>
              <Button
                variant="gold"
                size="md"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="rounded-xl px-6 text-slate-950 font-bold"
              >
                Save & Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: GUARDIAN INFORMATION */}
        {/* ========================================================================= */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
          >
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-iqra-gold-400" />
                <span>4. Parent / Guardian Information</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide emergency contact and guardian details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="guardianName"
                label="Guardian Full Name"
                value={guardian.guardianName}
                onChange={(e) => setGuardian({ ...guardian, guardianName: e.target.value })}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Relationship to Applicant</label>
                <select
                  value={guardian.relationship}
                  onChange={(e) => setGuardian({ ...guardian, relationship: e.target.value })}
                  className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </div>

              <InputField
                id="guardianCnic"
                label="Guardian CNIC Number"
                placeholder="XXXXX-XXXXXXX-X"
                value={guardian.guardianCnic}
                onChange={(e) => setGuardian({ ...guardian, guardianCnic: e.target.value })}
                required
              />

              <InputField
                id="guardianPhone"
                label="Guardian Contact Phone"
                placeholder="+92 300 0000000"
                value={guardian.guardianPhone}
                onChange={(e) => setGuardian({ ...guardian, guardianPhone: e.target.value })}
                required
              />

              <InputField
                id="guardianEmail"
                label="Guardian Email (Optional)"
                type="email"
                placeholder="guardian@example.com"
                value={guardian.guardianEmail}
                onChange={(e) => setGuardian({ ...guardian, guardianEmail: e.target.value })}
              />

              <InputField
                id="occupation"
                label="Occupation / Profession"
                placeholder="e.g. Government Officer / Business Owner / Engineer"
                value={guardian.occupation}
                onChange={(e) => setGuardian({ ...guardian, occupation: e.target.value })}
                required
              />

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Monthly Household Income</label>
                <select
                  value={guardian.monthlyIncome}
                  onChange={(e) => setGuardian({ ...guardian, monthlyIncome: e.target.value })}
                  className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                >
                  <option value="Under 50,000 PKR">Under 50,000 PKR</option>
                  <option value="50,000 - 100,000 PKR">50,000 - 100,000 PKR</option>
                  <option value="100,000 - 200,000 PKR">100,000 - 200,000 PKR</option>
                  <option value="200,000 - 400,000 PKR">200,000 - 400,000 PKR</option>
                  <option value="Above 400,000 PKR">Above 400,000 PKR</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="md"
                onClick={handleBack}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                className="rounded-xl border-white/20 text-slate-300"
              >
                Back
              </Button>
              <Button
                variant="gold"
                size="md"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="rounded-xl px-6 text-slate-950 font-bold"
              >
                Save & Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: DOCUMENTS UPLOAD */}
        {/* ========================================================================= */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
          >
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-iqra-gold-400" />
                <span>5. Secure Document Uploads</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload clear scans or photos of the required academic transcripts and identity proofs (Max 5MB each).
              </p>
            </div>

            <div className="space-y-3">
              {DOCUMENT_TYPES.map((docType) => {
                const uploaded = documents.find((d) => d.documentType === docType.id);
                const isUploading = uploadingDocId === docType.id;

                return (
                  <div
                    key={docType.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          uploaded ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-400"
                        }`}
                      >
                        {uploaded ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-white">{docType.label}</span>
                          {docType.required && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {uploaded ? (
                            <span className="text-emerald-400 font-medium">
                              ✓ {uploaded.fileName} ({(uploaded.fileSize / 1024).toFixed(1)} KB)
                            </span>
                          ) : (
                            "Accepted formats: JPG, PNG, PDF (Max 5MB)"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {uploaded && (
                        <button
                          type="button"
                          onClick={() => setDocuments(documents.filter((d) => d.documentType !== docType.id))}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept={docType.accept}
                          disabled={isUploading}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(docType, e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            uploaded
                              ? "bg-white/10 hover:bg-white/20 text-white"
                              : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30"
                          } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : uploaded ? (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Replace</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload File</span>
                            </>
                          )}
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="md"
                onClick={handleBack}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                className="rounded-xl border-white/20 text-slate-300"
              >
                Back
              </Button>
              <Button
                variant="gold"
                size="md"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="rounded-xl px-6 text-slate-950 font-bold"
              >
                Review Application
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: APPLICATION REVIEW & FINAL DECLARATION */}
        {/* ========================================================================= */}
        {step === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
          >
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-iqra-gold-400" />
                <span>6. Complete Application Review</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Carefully review all submitted details before final submission. Click Edit on any section to modify.
              </p>
            </div>

            {/* Review Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Info Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-iqra-gold-400">
                    Personal Information
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-blue-400 hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-400">Full Name:</span> <strong className="text-white">{personal.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Father Name:</span> {personal.fatherName}
                  </div>
                  <div>
                    <span className="text-slate-400">CNIC / B-Form:</span> {personal.cnic}
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span> {personal.email}
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span> {personal.phone}
                  </div>
                  <div>
                    <span className="text-slate-400">Address:</span> {personal.address}, {personal.city}
                  </div>
                </div>
              </div>

              {/* Academic Background Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Academic Background
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-blue-400 hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-400">Qualification:</span> {academic.previousQualification}
                  </div>
                  <div>
                    <span className="text-slate-400">Institute:</span> {academic.schoolCollege}
                  </div>
                  <div>
                    <span className="text-slate-400">Board/Univ:</span> {academic.boardUniversity}
                  </div>
                  <div>
                    <span className="text-slate-400">Passing Year:</span> {academic.passingYear}
                  </div>
                  <div>
                    <span className="text-slate-400">Marks:</span> {academic.obtainedMarks} / {academic.totalMarks} ({academic.percentage})
                  </div>
                </div>
              </div>

              {/* Program Preferences Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Program Preferences
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs text-blue-400 hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-400">1st Choice:</span> <strong className="text-white">{preferences.firstChoice}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">2nd Choice:</span> {preferences.secondChoice}
                  </div>
                  <div>
                    <span className="text-slate-400">Shift:</span> {preferences.shift}
                  </div>
                  <div>
                    <span className="text-slate-400">Intake:</span> {preferences.intake} 2026
                  </div>
                  <div>
                    <span className="text-slate-400">Campus:</span> Chak Shezad Campus, Islamabad
                  </div>
                </div>
              </div>

              {/* Guardian Info Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Guardian Information
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="text-xs text-blue-400 hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-400">Guardian Name:</span> {guardian.guardianName} ({guardian.relationship})
                  </div>
                  <div>
                    <span className="text-slate-400">CNIC:</span> {guardian.guardianCnic}
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span> {guardian.guardianPhone}
                  </div>
                  <div>
                    <span className="text-slate-400">Occupation:</span> {guardian.occupation}
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Uploaded Documents ({documents.length})
                </span>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="text-xs text-blue-400 hover:underline font-medium"
                >
                  Edit Documents
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {documents.map((d) => (
                  <div key={d.storageId} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{d.name} ({d.fileName})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Declaration & Terms Checkboxes */}
            <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">How did you hear about us?</label>
                <select
                  value={declaration.hearAboutUs}
                  onChange={(e) => setDeclaration({ ...declaration, hearAboutUs: e.target.value })}
                  className="w-full bg-[#0a172d] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-iqra-gold-500"
                >
                  <option value="University Website / Social Media">University Website / Social Media</option>
                  <option value="Friends or Family">Friends or Family</option>
                  <option value="Education Expo / Seminar">Education Expo / Seminar</option>
                  <option value="Newspaper / Billboard">Newspaper / Billboard</option>
                  <option value="Alumni Recommendation">Alumni Recommendation</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={declaration.agreedTerms}
                    onChange={(e) => setDeclaration({ ...declaration, agreedTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-iqra-gold-500 bg-[#0a172d] border-white/20 focus:ring-0"
                  />
                  <span>
                    I confirm that all information and documents provided in this application are authentic and accurate.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={declaration.agreedDeclaration}
                    onChange={(e) => setDeclaration({ ...declaration, agreedDeclaration: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-iqra-gold-500 bg-[#0a172d] border-white/20 focus:ring-0"
                  />
                  <span>
                    I accept the rules, regulations, and fee policies of Iqra University Chak Shezad Campus, Islamabad.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="md"
                onClick={handleBack}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                className="rounded-xl border-white/20 text-slate-300"
              >
                Back
              </Button>
              <Button
                variant="gold"
                size="lg"
                isLoading={isSubmitting}
                onClick={handleSubmitApplication}
                rightIcon={<CheckCircle2 className="w-5 h-5 text-slate-950" />}
                className="rounded-xl px-8 text-slate-950 font-black shadow-xl shadow-iqra-gold-500/20"
              >
                Submit Application
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 7: APPLICATION SUBMITTED CONFIRMATION */}
        {/* ========================================================================= */}
        {step === 7 && submissionResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                Status: Pending Review
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
                Application Submitted Successfully
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your admission application has been successfully submitted and is currently under review by the Admissions Committee.
              </p>
            </div>

            {/* Application Summary Card */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Application Reference ID:</span>
                <span className="text-iqra-gold-400 font-mono font-bold text-sm">
                  {submissionResult.applicationId}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Applied Degree Program:</span>
                <span className="text-white font-semibold">{submissionResult.program}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Campus:</span>
                <span className="text-white">Chak Shezad Campus, Islamabad</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Submission Date:</span>
                <span className="text-slate-300">
                  {new Date(submissionResult.submittedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/status" className="w-full sm:w-auto">
                <Button variant="gold" size="md" className="w-full text-slate-950 font-bold rounded-xl px-6">
                  View Application Status
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full border-white/20 text-slate-300 rounded-xl">
                  Return to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
        </main>
      </InputThemeContext.Provider>
    </div>
  );
}
