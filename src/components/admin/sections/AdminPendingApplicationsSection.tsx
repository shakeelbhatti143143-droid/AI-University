"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  Eye,
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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/lib/auth-context";

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
      alert("Please provide rejection remarks explaining the admissions decision.");
      return;
    }
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
        setDecisionSuccess("Application has been marked as Rejected.");
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
        <div
          onClick={() => setStatusFilter("Pending")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "Pending"
              ? "bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold mb-1">
            <span>Pending Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black font-heading text-white">{counts.pending}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting decision</div>
        </div>

        <div
          onClick={() => setStatusFilter("Approved")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "Approved"
              ? "bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-1">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black font-heading text-white">{counts.approved}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Official accounts created</div>
        </div>

        <div
          onClick={() => setStatusFilter("Rejected")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "Rejected"
              ? "bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-rose-400 text-xs font-semibold mb-1">
            <span>Rejected</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black font-heading text-white">{counts.rejected}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Disapproved applications</div>
        </div>

        <div
          onClick={() => setStatusFilter("All")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "All"
              ? "bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/10"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-blue-400 text-xs font-semibold mb-1">
            <span>Total Records</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black font-heading text-white">{counts.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">All applications</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Pending", "Approved", "Rejected", "All"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                statusFilter === f
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {f === "All" ? "All Applications" : f}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Applications Table / Cards */}
      {isLoading ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading admissions records from database...</p>
        </div>
      ) : displayedApps.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No applications found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are currently no admission applications in the database matching the &ldquo;{statusFilter}&rdquo; status.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">App ID</th>
                  <th className="py-3.5 px-4">Applied Program</th>
                  <th className="py-3.5 px-4">Campus</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayedApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{app.personalInformation?.fullName}</div>
                      <div className="text-[11px] text-slate-400">{app.personalInformation?.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-iqra-gold-400">
                      {app.applicationId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">
                        {app.academicInformation?.degreeApplyingFor || app.programPreferences?.firstChoice}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {app.programPreferences?.shift} • {app.programPreferences?.intake}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">Chak Shezad</td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(app.submittedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          app.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : app.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            app.status === "Approved"
                              ? "bg-emerald-400"
                              : app.status === "Rejected"
                              ? "bg-rose-400"
                              : "bg-amber-400 animate-pulse"
                          }`}
                        />
                        <span>{app.status}</span>
                      </span>
                      {app.status === "Approved" && (
                        <div className="mt-0.5">
                          {app.approvalEmailSent ? (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                              <Mail className="w-2.5 h-2.5" />
                              <span>Email sent</span>
                            </span>
                          ) : app.approvalEmailError ? (
                            <span className="text-[10px] text-rose-400 flex items-center gap-1 font-medium" title={app.approvalEmailError}>
                              <AlertCircle className="w-2.5 h-2.5" />
                              <span>Email failed</span>
                            </span>
                          ) : null}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => handleOpenReview(app._id)}
                        className="text-slate-950 font-bold text-xs rounded-xl px-3"
                      >
                        View Application
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL APPLICATION REVIEW MODAL */}
      {/* ========================================================================= */}
      {isReviewOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#071328] border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Application Review</h2>
                    <span className="font-mono text-xs text-iqra-gold-400 font-bold">
                      [{selectedApp.applicationId}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Submitted on{" "}
                    {new Date(selectedApp.submittedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              {/* Error Alert Box */}
              {decisionError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <strong className="block font-bold text-rose-200">
                      {decisionError}
                    </strong>
                    {approvalResult && (
                      <div className="text-xs space-y-2 bg-black/40 p-3.5 rounded-xl border border-rose-500/20">
                        <div>
                          <span className="text-slate-400">Assigned Student Email:</span>{" "}
                          <strong className="text-iqra-gold-400 font-mono">
                            {approvalResult.universityEmail}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Student Personal Email:</span>{" "}
                          <span className="text-slate-200 font-mono">
                            {approvalResult.personalEmail}
                          </span>
                        </div>
                        {approvalResult.error && (
                          <div className="text-rose-400 text-[11px] font-mono bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
                            Brevo API Error: {approvalResult.error}
                          </div>
                        )}
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={() => {
                              const link = `${window.location.origin}/setup-password?token=${approvalResult.setupToken}`;
                              navigator.clipboard.writeText(link);
                              setCopiedToken(true);
                              setTimeout(() => setCopiedToken(false), 2000);
                            }}
                            leftIcon={copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] py-1.5"
                          >
                            {copiedToken ? "Setup Link Copied!" : "Copy Password Setup Link"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            disabled={isResendingEmail}
                            isLoading={isResendingEmail}
                            onClick={handleResendEmail}
                            leftIcon={<Send className="w-3.5 h-3.5" />}
                            className="text-[11px] py-1.5 border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                          >
                            Retry Sending Email via Brevo
                          </Button>
                        </div>
                        {resendStatus && (
                          <div className="text-xs text-amber-300 pt-1 font-medium">{resendStatus}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Success Alert Box */}
              {decisionSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <strong className="block font-bold">{decisionSuccess}</strong>
                    {approvalResult && (
                      <div className="mt-2 text-xs space-y-2 bg-black/40 p-3 rounded-xl border border-emerald-500/20">
                        <div>
                          <span className="text-slate-400">Official Student Email:</span>{" "}
                          <strong className="text-iqra-gold-400 font-mono">
                            {approvalResult.universityEmail}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Student Recipient Email:</span>{" "}
                          <span className="text-slate-200 font-mono">
                            {approvalResult.personalEmail}
                          </span>
                        </div>
                        <div className="pt-1 flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={() => {
                              const link = `${window.location.origin}/setup-password?token=${approvalResult.setupToken}`;
                              navigator.clipboard.writeText(link);
                              setCopiedToken(true);
                              setTimeout(() => setCopiedToken(false), 2000);
                            }}
                            leftIcon={copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] py-1.5"
                          >
                            {copiedToken ? "Setup Link Copied!" : "Copy Password Setup Link"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* 1. Applicant Personal Information */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-iqra-gold-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <User className="w-4 h-4" />
                  <span>Applicant Personal Information</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Full Name</span>
                    <strong className="text-white text-xs">{selectedApp.personalInformation.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Father / Guardian</span>
                    <span className="text-slate-200">{selectedApp.personalInformation.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                    <span className="text-slate-200">{selectedApp.personalInformation.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Gender</span>
                    <span className="text-slate-200">{selectedApp.personalInformation.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">CNIC / B-Form</span>
                    <span className="text-slate-200 font-mono">{selectedApp.personalInformation.cnic}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email Address</span>
                    <span className="text-slate-200">{selectedApp.personalInformation.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone Number</span>
                    <span className="text-slate-200">{selectedApp.personalInformation.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Alternate Phone</span>
                    <span className="text-slate-200">{selectedApp.personalInformation.alternatePhone || "None"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nationality / Domicile</span>
                    <span className="text-slate-200">
                      {selectedApp.personalInformation.nationality} / {selectedApp.personalInformation.domicile}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-slate-400 block text-[11px]">Address</span>
                    <span className="text-slate-200">
                      {selectedApp.personalInformation.address}, {selectedApp.personalInformation.city},{" "}
                      {selectedApp.personalInformation.province}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Academic Information */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Academic History & Qualifications</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Applied Degree</span>
                    <strong className="text-white text-xs">{selectedApp.academicInformation.degreeApplyingFor}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Degree Type</span>
                    <span className="text-slate-200">{selectedApp.academicInformation.programType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Campus & Admission Type</span>
                    <span className="text-slate-200">
                      {selectedApp.academicInformation.preferredCampus} ({selectedApp.academicInformation.admissionType})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Previous Qualification</span>
                    <span className="text-slate-200">{selectedApp.academicInformation.previousQualification}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">School / College</span>
                    <span className="text-slate-200">{selectedApp.academicInformation.schoolCollege}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Board / University</span>
                    <span className="text-slate-200">{selectedApp.academicInformation.boardUniversity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Passing Year</span>
                    <span className="text-slate-200">{selectedApp.academicInformation.passingYear}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Marks & Percentage</span>
                    <strong className="text-iqra-gold-400 font-mono">
                      {selectedApp.academicInformation.obtainedMarks} / {selectedApp.academicInformation.totalMarks} (
                      {selectedApp.academicInformation.percentage})
                    </strong>
                  </div>
                </div>
              </div>

              {/* 3. Program Preferences & Guardian Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                    Program Preferences
                  </h3>
                  <div>
                    <span className="text-slate-400 block text-[11px]">First Choice</span>
                    <strong className="text-white">{selectedApp.programPreferences.firstChoice}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Second Choice</span>
                    <span className="text-slate-200">{selectedApp.programPreferences.secondChoice}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Shift & Intake</span>
                    <span className="text-slate-200">
                      {selectedApp.programPreferences.shift} Shift • {selectedApp.programPreferences.intake} 2026
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                    Guardian Information
                  </h3>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Guardian Name</span>
                    <span className="text-white font-medium">
                      {selectedApp.guardianInformation.guardianName} ({selectedApp.guardianInformation.relationship})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">CNIC & Contact</span>
                    <span className="text-slate-200 font-mono">
                      {selectedApp.guardianInformation.guardianCnic} • {selectedApp.guardianInformation.guardianPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Occupation & Income</span>
                    <span className="text-slate-200">
                      {selectedApp.guardianInformation.occupation} ({selectedApp.guardianInformation.monthlyIncome})
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Documents with Direct Preview Links */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Uploaded Documents ({selectedApp.documents?.length || 0})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedApp.documents?.map((doc, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="truncate text-slate-300 font-medium">{doc.name}</span>
                      </div>
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-iqra-gold-400 hover:text-white flex items-center gap-1 font-bold shrink-0 ml-2"
                        >
                          <span>Open File</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-500">Storage Link Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Decision & Remarks Section */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-iqra-gold-400" />
                  <span>Administrative Decision & Remarks</span>
                </h3>

                <div>
                  <label className="block text-slate-400 text-xs mb-1.5 font-medium">
                    Remarks / Justification (Logged with decision record):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter approval criteria verification notes, or reason for rejection..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {selectedApp.status === "Approved" ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        ✓ Application has been <strong>Approved</strong> by {selectedApp.reviewedBy || "Registrar"}.
                      </div>
                      {selectedApp.generatedUniversityEmail && (
                        <span className="font-mono text-iqra-gold-400 font-bold bg-black/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          {selectedApp.generatedUniversityEmail}
                        </span>
                      )}
                    </div>
                    <div className="pt-2 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        {selectedApp.approvalEmailSent ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Password setup email sent via Brevo to {selectedApp.personalInformation.email}
                          </span>
                        ) : selectedApp.approvalEmailError ? (
                          <span className="text-rose-400 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                            Email failed: {selectedApp.approvalEmailError}
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            Email dispatch pending or recorded.
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        disabled={isResendingEmail}
                        isLoading={isResendingEmail}
                        onClick={handleResendEmail}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                        className="text-[11px] py-1 border-white/20 text-slate-200 hover:bg-white/10"
                      >
                        Resend Setup Email
                      </Button>
                    </div>
                    {resendStatus && (
                      <div className="text-[11px] text-amber-300 font-medium pt-1">
                        {resendStatus}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="md"
                      disabled={isProcessingDecision}
                      onClick={handleReject}
                      leftIcon={<XCircle className="w-4 h-4 text-rose-400" />}
                      className="w-full sm:w-auto border-rose-500/30 hover:bg-rose-500/10 text-rose-300 rounded-xl"
                    >
                      Reject Application
                    </Button>

                    <Button
                      variant="gold"
                      size="md"
                      isLoading={isProcessingDecision}
                      onClick={handleApprove}
                      rightIcon={<CheckCircle2 className="w-4 h-4 text-slate-950" />}
                      className="w-full sm:w-auto text-slate-950 font-black rounded-xl px-6"
                    >
                      Approve Application & Issue Email
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
