"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  AlertCircle,
  Mail,
  User,
  GraduationCap,
  Building,
  Shield,
  Send,
  Loader2,
  Copy,
  Check,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/lib/auth-context";
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
  CredentialModal,
  CredentialButton,
} from "@/components/admin/credential";

interface ApplicationDoc {
  name: string;
  documentType: string;
  storageId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: number;
  url?: string;
}

interface ApplicationItem {
  _id: string;
  userId: string;
  applicationId: string;
  personalInformation: {
    fullName: string;
    fatherName: string;
    dateOfBirth: string;
    gender: string;
    cnic: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    nationality: string;
    domicile: string;
    address: string;
    city: string;
    province: string;
  };
  academicInformation: {
    degreeApplyingFor: string;
    programType: string;
    preferredCampus: string;
    admissionType: string;
    previousQualification: string;
    schoolCollege: string;
    boardUniversity: string;
    passingYear: string;
    totalMarks: string;
    obtainedMarks: string;
    percentage: string;
  };
  programPreferences: {
    firstChoice: string;
    secondChoice: string;
    shift: string;
    intake: string;
  };
  guardianInformation: {
    guardianName: string;
    relationship: string;
    guardianCnic: string;
    guardianPhone: string;
    guardianEmail?: string;
    occupation: string;
    monthlyIncome: string;
  };
  documents: ApplicationDoc[];
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
  submittedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  adminRemarks?: string;
  generatedUniversityEmail?: string;
  approvalEmailSent?: boolean;
  approvalEmailSentAt?: number;
  approvalEmailError?: string;
  approvalEmailRecipient?: string;
}

export const AdminPendingApplicationsSection: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, underReview: 0, approved: 0, rejected: 0 });
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Review Modal State
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isProcessingDecision, setIsProcessingDecision] = useState(false);
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [approvalResult, setApprovalResult] = useState<{
    universityEmail: string;
    setupToken: string;
    studentName: string;
    personalEmail: string;
    emailSent: boolean;
    error?: string;
    messageId?: string;
  } | null>(null);

  const [copiedToken, setCopiedToken] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Fetch applications from Convex
  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const res = await client.query(api.applications.getAllApplications, {
          statusFilter: statusFilter === "All" ? undefined : statusFilter,
        });
        if (res) {
          setApplications((res.applications as any) || []);
          setCounts(res.counts);
        }
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  // Open detail review modal
  const handleOpenReview = async (appId: string) => {
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const fullApp = await client.query(api.applications.getApplicationById, {
          applicationId: appId as any,
        });
        if (fullApp) {
          setSelectedApp(fullApp as any);
          setRemarks(fullApp.adminRemarks || "");
          setIsReviewOpen(true);
          setDecisionSuccess(null);
          setDecisionError(null);
          setApprovalResult(null);
          setResendStatus(null);
        }
      }
    } catch (e) {
      console.error("Error opening application:", e);
    }
  };

  // Approve application with Brevo email trigger
  const handleApprove = async () => {
    if (!selectedApp || !user) return;
    setIsProcessingDecision(true);
    setDecisionSuccess(null);
    setDecisionError(null);
    setResendStatus(null);
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const res = await client.action(api.applications.approveApplicationWithEmail, {
          applicationId: selectedApp._id as any,
          adminId: user.id,
          adminName: user.name || "Admissions Registrar",
          remarks: remarks.trim() || "Criteria verified and approved.",
          appUrl: typeof window !== "undefined" ? window.location.origin : undefined,
        });

        if (res.success) {
          setApprovalResult({
            universityEmail: res.generatedUniversityEmail,
            setupToken: res.setupToken,
            studentName: res.studentName,
            personalEmail: res.personalEmail,
            emailSent: true,
            messageId: res.messageId,
          });
          setDecisionSuccess("Application successfully approved and password setup email sent via Brevo!");
          await loadApplications();
        } else {
          setApprovalResult({
            universityEmail: res.generatedUniversityEmail || "",
            setupToken: res.setupToken || "",
            studentName: res.studentName || selectedApp.personalInformation.fullName,
            personalEmail: res.personalEmail || selectedApp.personalInformation.email,
            emailSent: false,
            error: res.emailError || res.message,
          });
          setDecisionError(res.message || "Application was approved, but the password setup email could not be sent.");
          await loadApplications();
        }
      }
    } catch (err: any) {
      setDecisionError(err?.message || "Failed to process admission approval.");
    } finally {
      setIsProcessingDecision(false);
    }
  };

  // Resend password setup email
  const handleResendEmail = async () => {
    if (!selectedApp) return;
    setIsResendingEmail(true);
    setResendStatus(null);
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const res = await client.action(api.applications.resendPasswordSetupEmail, {
          applicationId: selectedApp._id as any,
          appUrl: typeof window !== "undefined" ? window.location.origin : undefined,
        });
        if (res.success) {
          setResendStatus("Password setup email successfully resent via Brevo!");
          await loadApplications();
        } else {
          setResendStatus(`Failed to send email: ${res.message}`);
        }
      }
    } catch (err: any) {
      setResendStatus(`Failed to send email: ${err?.message || err}`);
    } finally {
      setIsResendingEmail(false);
    }
  };

  // Reject application
  const handleReject = async () => {
    if (!selectedApp || !user) return;
    if (!remarks.trim()) {
      alert("Please provide remarks / reason for rejection.");
      return;
    }
    if (!confirm("Are you sure you want to reject this application?")) return;

    setIsProcessingDecision(true);
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        await client.mutation(api.applications.rejectApplication, {
          applicationId: selectedApp._id as any,
          adminId: user.id,
          adminName: user.name || "Admissions Registrar",
          remarks: remarks.trim(),
        });
        setIsReviewOpen(false);
        await loadApplications();
      }
    } catch (err: any) {
      alert(err.message || "Failed to reject application.");
    } finally {
      setIsProcessingDecision(false);
    }
  };

  // Filtered by search query
  const displayedApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.personalInformation?.fullName?.toLowerCase().includes(q) ||
      app.applicationId?.toLowerCase().includes(q) ||
      app.personalInformation?.email?.toLowerCase().includes(q) ||
      app.academicInformation?.degreeApplyingFor?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <CredentialCard
          className={`cursor-pointer transition-colors ${statusFilter === "Pending" ? "!border-[#6a6050]" : ""}`}
          onClick={() => setStatusFilter("Pending")}
        >
          <div className="flex items-center justify-between text-[#D8D3C6] text-xs font-semibold mb-1">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-[#8a8272]" />
          </div>
          <div className="text-2xl font-serif text-[#F2EEE4]">{counts.pending}</div>
          <div className="text-[11px] text-[#8a8272] mt-0.5">Awaiting decision</div>
        </CredentialCard>

        <CredentialCard
          className={`cursor-pointer transition-colors ${statusFilter === "Approved" ? "!border-[#6a6050]" : ""}`}
          onClick={() => setStatusFilter("Approved")}
        >
          <div className="flex items-center justify-between text-[#7DAE7A] text-xs font-semibold mb-1">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4 text-[#7DAE7A]" />
          </div>
          <div className="text-2xl font-serif text-[#F2EEE4]">{counts.approved}</div>
          <div className="text-[11px] text-[#8a8272] mt-0.5">Official accounts created</div>
        </CredentialCard>

        <CredentialCard
          className={`cursor-pointer transition-colors ${statusFilter === "Rejected" ? "!border-[#6a6050]" : ""}`}
          onClick={() => setStatusFilter("Rejected")}
        >
          <div className="flex items-center justify-between text-[#E27878] text-xs font-semibold mb-1">
            <span>Rejected</span>
            <XCircle className="w-4 h-4 text-[#E27878]" />
          </div>
          <div className="text-2xl font-serif text-[#F2EEE4]">{counts.rejected}</div>
          <div className="text-[11px] text-[#8a8272] mt-0.5">Disapproved applications</div>
        </CredentialCard>

        <CredentialCard
          className={`cursor-pointer transition-colors ${statusFilter === "All" ? "!border-[#6a6050]" : ""}`}
          onClick={() => setStatusFilter("All")}
        >
          <div className="flex items-center justify-between text-[#D8D3C6] text-xs font-semibold mb-1">
            <span>Total Records</span>
            <FileText className="w-4 h-4 text-[#8a8272]" />
          </div>
          <div className="text-2xl font-serif text-[#F2EEE4]">{counts.total}</div>
          <div className="text-[11px] text-[#8a8272] mt-0.5">All applications</div>
        </CredentialCard>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1D1B18] p-3 rounded-[10px] border border-[#4a4335]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Pending", "Approved", "Rejected", "All"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all shrink-0 ${
                statusFilter === f
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335] font-semibold"
                  : "text-[#8a8272] hover:text-[#F2EEE4] hover:bg-[#23201b]/60"
              }`}
            >
              {f === "All" ? "All Applications" : f}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#8a8272] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1D1B18] border border-[#4a4335] rounded-[6px] pl-9 pr-4 py-1.5 text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#C9A25B]"
          />
        </div>
      </div>

      {/* Applications Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-[#1D1B18] rounded-[10px] border border-[#4a4335]">
          <Loader2 className="w-8 h-8 text-[#8a8272] animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#8a8272]">Loading admissions records from database...</p>
        </div>
      ) : displayedApps.length === 0 ? (
        <div className="p-12 text-center bg-[#1D1B18] rounded-[10px] border border-[#4a4335] space-y-2">
          <div className="w-12 h-12 rounded-[10px] bg-[#23201b] border border-[#4a4335] flex items-center justify-center mx-auto text-[#8a8272]">
            <FileText className="w-6 h-6 text-[#8a8272]" />
          </div>
          <h3 className="text-sm font-serif font-medium text-[#F2EEE4]">No applications found</h3>
          <p className="text-xs text-[#8a8272] max-w-sm mx-auto">
            There are currently no admission applications matching the &ldquo;{statusFilter}&rdquo; status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedApps.map((app) => (
            <CredentialCard key={app._id}>
              <CredentialHeader
                eyebrow={app.academicInformation?.programType || "ADMISSION"}
                referenceId={app.applicationId}
              />
              <CredentialTitle
                title={app.personalInformation?.fullName || "Candidate"}
                subheading={app.academicInformation?.degreeApplyingFor || app.programPreferences?.firstChoice}
              />
              <CredentialDetailList>
                <CredentialDetailRow
                  label="Email"
                  value={app.personalInformation?.email}
                  isLink
                />
                <CredentialDetailRow
                  label="Phone"
                  value={app.personalInformation?.phone}
                />
                <CredentialDetailRow
                  label="Shift & Intake"
                  value={`${app.programPreferences?.shift || "Morning"} • ${app.programPreferences?.intake || "2026"}`}
                />
                <CredentialDetailRow
                  label="Submitted"
                  value={new Date(app.submittedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                />
                {app.status === "Approved" && app.generatedUniversityEmail && (
                  <CredentialDetailRow
                    label="Univ. Email"
                    value={app.generatedUniversityEmail}
                    isLink
                  />
                )}
              </CredentialDetailList>

              <CredentialFooter
                status={{
                  label: app.status,
                  state:
                    app.status === "Approved"
                      ? "success"
                      : app.status === "Rejected"
                      ? "danger"
                      : "neutral",
                }}
                primaryAction={{
                  label: "Review Application",
                  onClick: () => handleOpenReview(app._id),
                }}
              />
            </CredentialCard>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <CredentialModal
        isOpen={isReviewOpen && !!selectedApp}
        onClose={() => setIsReviewOpen(false)}
        title={`Application Review: ${selectedApp?.personalInformation?.fullName || ""}`}
        eyebrow={selectedApp?.applicationId}
        maxWidth="3xl"
      >
        {selectedApp && (
          <div className="space-y-6 text-xs text-[#D8D3C6]">
            {/* Error Alert Box */}
            {decisionError && (
              <div className="p-4 rounded-[6px] bg-[#231b1b] border border-[#E27878]/40 text-[#E27878] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#E27878] shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <strong className="block font-bold text-[#F2EEE4]">{decisionError}</strong>
                  {approvalResult && (
                    <div className="text-xs space-y-2 bg-[#1D1B18] p-3.5 rounded-[6px] border border-[#4a4335]">
                      <div>
                        <span className="text-[#8a8272]">Assigned Student Email:</span>{" "}
                        <strong className="text-[#C9A25B] font-mono">{approvalResult.universityEmail}</strong>
                      </div>
                      <div>
                        <span className="text-[#8a8272]">Student Personal Email:</span>{" "}
                        <span className="text-[#F2EEE4] font-mono">{approvalResult.personalEmail}</span>
                      </div>
                      {approvalResult.error && (
                        <div className="text-[#E27878] text-[11px] font-mono bg-[#0e0d0b] p-2 rounded-[6px] border border-[#E27878]/30">
                          Brevo API Error: {approvalResult.error}
                        </div>
                      )}
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <CredentialButton
                          variant="secondary"
                          onClick={() => {
                            const link = `${window.location.origin}/setup-password?token=${approvalResult.setupToken}`;
                            navigator.clipboard.writeText(link);
                            setCopiedToken(true);
                            setTimeout(() => setCopiedToken(false), 2000);
                          }}
                        >
                          {copiedToken ? "Setup Link Copied!" : "Copy Password Setup Link"}
                        </CredentialButton>
                        <CredentialButton
                          variant="primary"
                          disabled={isResendingEmail}
                          onClick={handleResendEmail}
                        >
                          {isResendingEmail ? "Sending..." : "Retry Sending Email via Brevo"}
                        </CredentialButton>
                      </div>
                      {resendStatus && (
                        <div className="text-xs text-[#D8D3C6] pt-1 font-medium">{resendStatus}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Alert Box */}
            {decisionSuccess && (
              <div className="p-4 rounded-[6px] bg-[#1a231b] border border-[#7DAE7A]/40 text-[#7DAE7A] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#7DAE7A] shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <strong className="block font-bold text-[#F2EEE4]">{decisionSuccess}</strong>
                  {approvalResult && (
                    <div className="mt-2 text-xs space-y-2 bg-[#1D1B18] p-3 rounded-[6px] border border-[#4a4335]">
                      <div>
                        <span className="text-[#8a8272]">Official Student Email:</span>{" "}
                        <strong className="text-[#C9A25B] font-mono">{approvalResult.universityEmail}</strong>
                      </div>
                      <div>
                        <span className="text-[#8a8272]">Student Recipient Email:</span>{" "}
                        <span className="text-[#F2EEE4] font-mono">{approvalResult.personalEmail}</span>
                      </div>
                      <div className="pt-1 flex items-center gap-2">
                        <CredentialButton
                          variant="secondary"
                          onClick={() => {
                            const link = `${window.location.origin}/setup-password?token=${approvalResult.setupToken}`;
                            navigator.clipboard.writeText(link);
                            setCopiedToken(true);
                            setTimeout(() => setCopiedToken(false), 2000);
                          }}
                        >
                          {copiedToken ? "Setup Link Copied!" : "Copy Password Setup Link"}
                        </CredentialButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 1. Applicant Personal Information */}
            <div className="p-4 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] space-y-3">
              <h3 className="text-xs font-bold text-[#8a8272] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#4a4335] pb-2">
                <User className="w-4 h-4 text-[#8a8272]" />
                <span>Applicant Personal Information</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Full Name</span>
                  <strong className="text-[#F2EEE4] text-xs font-serif">{selectedApp.personalInformation.fullName}</strong>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Father / Guardian</span>
                  <span className="text-[#D8D3C6]">{selectedApp.personalInformation.fatherName}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Date of Birth</span>
                  <span className="text-[#D8D3C6]">{selectedApp.personalInformation.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Gender</span>
                  <span className="text-[#D8D3C6]">{selectedApp.personalInformation.gender}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">CNIC / B-Form</span>
                  <span className="text-[#D8D3C6] font-mono">{selectedApp.personalInformation.cnic}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Email Address</span>
                  <span className="text-[#C9A25B]">{selectedApp.personalInformation.email}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Phone Number</span>
                  <span className="text-[#D8D3C6]">{selectedApp.personalInformation.phone}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Alternate Phone</span>
                  <span className="text-[#D8D3C6]">{selectedApp.personalInformation.alternatePhone || "None"}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Nationality / Domicile</span>
                  <span className="text-[#D8D3C6]">
                    {selectedApp.personalInformation.nationality} / {selectedApp.personalInformation.domicile}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-[#8a8272] block text-[11px]">Address</span>
                  <span className="text-[#D8D3C6]">
                    {selectedApp.personalInformation.address}, {selectedApp.personalInformation.city},{" "}
                    {selectedApp.personalInformation.province}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Academic Information */}
            <div className="p-4 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] space-y-3">
              <h3 className="text-xs font-bold text-[#8a8272] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#4a4335] pb-2">
                <GraduationCap className="w-4 h-4 text-[#8a8272]" />
                <span>Academic History & Qualifications</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Applied Degree</span>
                  <strong className="text-[#F2EEE4] text-xs font-serif">{selectedApp.academicInformation.degreeApplyingFor}</strong>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Degree Type</span>
                  <span className="text-[#D8D3C6]">{selectedApp.academicInformation.programType}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Campus & Admission Type</span>
                  <span className="text-[#D8D3C6]">
                    {selectedApp.academicInformation.preferredCampus} ({selectedApp.academicInformation.admissionType})
                  </span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Previous Qualification</span>
                  <span className="text-[#D8D3C6]">{selectedApp.academicInformation.previousQualification}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#8a8272] block text-[11px]">School / College</span>
                  <span className="text-[#D8D3C6]">{selectedApp.academicInformation.schoolCollege}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Board / University</span>
                  <span className="text-[#D8D3C6]">{selectedApp.academicInformation.boardUniversity}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Passing Year</span>
                  <span className="text-[#D8D3C6]">{selectedApp.academicInformation.passingYear}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Marks & Percentage</span>
                  <strong className="text-[#F2EEE4] font-mono">
                    {selectedApp.academicInformation.obtainedMarks} / {selectedApp.academicInformation.totalMarks} (
                    {selectedApp.academicInformation.percentage})
                  </strong>
                </div>
              </div>
            </div>

            {/* 3. Program Preferences & Guardian Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] space-y-2">
                <h3 className="text-xs font-bold text-[#8a8272] uppercase tracking-wider border-b border-[#4a4335] pb-2">
                  Program Preferences
                </h3>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">First Choice</span>
                  <strong className="text-[#F2EEE4] font-serif">{selectedApp.programPreferences.firstChoice}</strong>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Second Choice</span>
                  <span className="text-[#D8D3C6]">{selectedApp.programPreferences.secondChoice}</span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Shift & Intake</span>
                  <span className="text-[#D8D3C6]">
                    {selectedApp.programPreferences.shift} Shift • {selectedApp.programPreferences.intake} 2026
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] space-y-2">
                <h3 className="text-xs font-bold text-[#8a8272] uppercase tracking-wider border-b border-[#4a4335] pb-2">
                  Guardian Information
                </h3>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Guardian Name</span>
                  <span className="text-[#F2EEE4] font-medium font-serif">
                    {selectedApp.guardianInformation.guardianName} ({selectedApp.guardianInformation.relationship})
                  </span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">CNIC & Contact</span>
                  <span className="text-[#D8D3C6] font-mono">
                    {selectedApp.guardianInformation.guardianCnic} • {selectedApp.guardianInformation.guardianPhone}
                  </span>
                </div>
                <div>
                  <span className="text-[#8a8272] block text-[11px]">Occupation & Income</span>
                  <span className="text-[#D8D3C6]">
                    {selectedApp.guardianInformation.occupation} ({selectedApp.guardianInformation.monthlyIncome})
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Documents */}
            <div className="p-4 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] space-y-3">
              <h3 className="text-xs font-bold text-[#8a8272] uppercase tracking-wider border-b border-[#4a4335] pb-2">
                Uploaded Documents ({selectedApp.documents?.length || 0})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedApp.documents?.map((doc, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-[#8a8272] shrink-0" />
                      <span className="truncate text-[#D8D3C6] font-medium">{doc.name}</span>
                    </div>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#C9A25B] hover:underline flex items-center gap-1 font-bold shrink-0 ml-2"
                      >
                        <span>Open File</span>
                        <ExternalLink className="w-3 h-3 text-[#C9A25B]" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-[#8a8272]">Storage Link Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Decision & Remarks Section */}
            <div className="p-5 rounded-[6px] bg-[#1D1B18] border border-[#4a4335] space-y-4">
              <h3 className="text-xs font-bold text-[#F2EEE4] uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#8a8272]" />
                <span>Administrative Decision & Remarks</span>
              </h3>

              <div>
                <label className="block text-[#8a8272] text-xs mb-1.5 font-medium">
                  Remarks / Justification (Logged with decision record):
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter approval criteria verification notes, or reason for rejection..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-[#1D1B18] border border-[#4a4335] rounded-[6px] p-3 text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#C9A25B]"
                />
              </div>

              {selectedApp.status === "Approved" ? (
                <div className="p-3.5 rounded-[6px] bg-[#1a231b] border border-[#7DAE7A]/40 text-[#7DAE7A] text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      ✓ Application has been <strong>Approved</strong> by {selectedApp.reviewedBy || "Registrar"}.
                    </div>
                    {selectedApp.generatedUniversityEmail && (
                      <span className="font-mono text-[#D8D3C6] font-bold bg-[#1D1B18] px-2.5 py-1 rounded-[6px] border border-[#4a4335]">
                        {selectedApp.generatedUniversityEmail}
                      </span>
                    )}
                  </div>
                  <div className="pt-2 border-t border-[#4a4335] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      {selectedApp.approvalEmailSent ? (
                        <span className="text-[#7DAE7A] flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7DAE7A]" />
                          Password setup email sent via Brevo to {selectedApp.personalInformation.email}
                        </span>
                      ) : selectedApp.approvalEmailError ? (
                        <span className="text-[#E27878] flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-[#E27878]" />
                          Email failed: {selectedApp.approvalEmailError}
                        </span>
                      ) : (
                        <span className="text-[#8a8272]">
                          Email dispatch pending or recorded.
                        </span>
                      )}
                    </div>
                    <CredentialButton
                      variant="secondary"
                      disabled={isResendingEmail}
                      onClick={handleResendEmail}
                    >
                      {isResendingEmail ? "Resending..." : "Resend Setup Email"}
                    </CredentialButton>
                  </div>
                  {resendStatus && (
                    <div className="text-[11px] text-[#D8D3C6] font-medium pt-1">
                      {resendStatus}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <CredentialButton
                    variant="danger"
                    disabled={isProcessingDecision}
                    onClick={handleReject}
                  >
                    Reject Application
                  </CredentialButton>

                  <CredentialButton
                    variant="primary"
                    disabled={isProcessingDecision}
                    onClick={handleApprove}
                  >
                    {isProcessingDecision ? "Processing..." : "Approve Application & Issue Email"}
                  </CredentialButton>
                </div>
              )}
            </div>
          </div>
        )}
      </CredentialModal>
    </div>
  );
};







