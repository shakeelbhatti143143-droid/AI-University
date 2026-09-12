"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  FileText,
  Building,
  User,
  ExternalLink,
  LogOut,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UniversityLogo } from "@/components/ui/UniversityLogo";
import { Button } from "@/components/ui/Button";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

export default function ApplicationStatusPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const client = getConvexClient();
        if (client && isConvexConfigured) {
          const app = await client.query(api.applications.getMyApplication, {
            userId: user.id as any,
          });
          setApplication(app);
        }
      } catch (err: any) {
        console.error("Error fetching application:", err);
        setError("Failed to fetch application records.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchApplication();
    }
  }, [user, authLoading]);

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050e1d] text-white">
        <div className="w-10 h-10 border-2 border-iqra-gold-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400">Loading your admission application status...</p>
      </div>
    );
  }

  // If user not authenticated, prompt sign in or apply
  if (!user) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#050e1d] text-white">
        <header className="w-full border-b border-white/10 bg-[#050e1d]/90 py-4 px-6">
          <UniversityLogo variant="default" size="sm" />
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-5">
            <AlertCircle className="w-12 h-12 text-iqra-gold-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Applicant Authentication Required</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Please sign in with the account you used during registration to track your admission application status.
            </p>
            <div className="flex flex-col gap-2.5 pt-2">
              <Link href="/login">
                <Button variant="gold" size="md" className="w-full text-slate-950 font-bold rounded-xl">
                  Sign In to Check Status
                </Button>
              </Link>
              <Link href="/apply">
                <Button variant="outline" size="md" className="w-full border-white/20 text-slate-300 rounded-xl">
                  Start New Application
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If authenticated but no application found
  if (!application) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#050e1d] text-white">
        <header className="w-full border-b border-white/10 bg-[#050e1d]/90 py-4 px-6 flex items-center justify-between">
          <UniversityLogo variant="default" size="sm" />
          <Button variant="outline" size="sm" onClick={() => logout()} className="text-xs border-white/20">
            Sign Out
          </Button>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-5">
            <FileText className="w-12 h-12 text-blue-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">No Application Found</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              There is no active admission application associated with this account yet. Ready to join Iqra University?
            </p>
            <Link href="/apply">
              <Button variant="gold" size="md" className="w-full text-slate-950 font-bold rounded-xl">
                Start Admission Application
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isPending = application.status === "Pending";
  const isUnderReview = application.status === "Under Review";
  const isApproved = application.status === "Approved";
  const isRejected = application.status === "Rejected";

  return (
    <div className="min-h-screen w-full bg-[#050e1d] text-white flex flex-col selection:bg-iqra-blue-600 selection:text-white">
      {/* Top Bar */}
      <header className="w-full border-b border-white/10 bg-[#050e1d]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <UniversityLogo variant="default" size="sm" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Logged in as <strong className="text-white">{user.name}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              className="text-xs border-white/20 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 rounded-xl"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        {/* Status Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-xl shadow-2xl relative overflow-hidden ${
            isApproved
              ? "bg-emerald-950/25 border-emerald-500/40 shadow-emerald-900/20"
              : isRejected
              ? "bg-rose-950/25 border-rose-500/40 shadow-rose-900/20"
              : "bg-amber-950/20 border-amber-500/30 shadow-amber-900/10"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {isApproved && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Application Approved
                  </span>
                )}
                {isRejected && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
                    <XCircle className="w-3.5 h-3.5" />
                    Application Rejected
                  </span>
                )}
                {(isPending || isUnderReview) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    Status: {application.status}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  Ref: {application.applicationId}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
                {isApproved
                  ? "Congratulations! Your Admission is Approved"
                  : isRejected
                  ? "Admission Decision: Not Approved"
                  : "Application Under Review"}
              </h1>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[11px] text-slate-400">Submission Date</div>
              <div className="text-xs font-bold text-white">
                {new Date(application.submittedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Status Message as per prompt */}
          <div className="mt-5 text-sm sm:text-base leading-relaxed">
            {isPending && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                &ldquo;Your application is currently under review by the admissions team.&rdquo;
              </div>
            )}

            {isApproved && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 font-medium">
                  &ldquo;Congratulations! Your admission application has been approved.&rdquo;
                </div>

                {/* Generated Official University Credentials Card */}
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-emerald-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-iqra-gold-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Official University Account Issued</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-slate-400 block text-[11px] mb-1">Generated University Email:</span>
                      <strong className="text-iqra-gold-400 font-mono text-sm">
                        {application.generatedUniversityEmail || "Generated upon account setup"}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-slate-400 block text-[11px] mb-1">Academic Department:</span>
                      <strong className="text-white">Computing & Artificial Intelligence</strong>
                    </div>
                  </div>

                  {/* Password Setup Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Link href={`/setup-password?token=${user.personalEmail || ""}`} className="w-full sm:w-auto">
                      <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />} className="w-full text-slate-950 font-bold rounded-xl">
                        Set University Password Now
                      </Button>
                    </Link>

                    <Link href="/login" className="w-full sm:w-auto">
                      <Button variant="outline" size="md" className="w-full border-white/20 text-slate-300 rounded-xl">
                        Sign In with University Email
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                  &ldquo;Your application has not been approved. Please check the application remarks for more information.&rdquo;
                </div>
                {application.adminRemarks && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs">
                    <span className="text-slate-400 block mb-1 font-semibold">Admissions Committee Remarks:</span>
                    <p className="text-slate-200 italic">&ldquo;{application.adminRemarks}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Application Details Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5 text-xs">
            <h3 className="text-xs font-bold text-iqra-gold-400 uppercase tracking-wider border-b border-white/10 pb-2">
              Applicant Information
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-400">Applicant Name:</span>
              <span className="text-white font-medium">{application.personalInformation.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Father Name:</span>
              <span className="text-white">{application.personalInformation.fatherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CNIC:</span>
              <span className="text-white">{application.personalInformation.cnic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Registered Email:</span>
              <span className="text-white">{application.personalInformation.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Phone:</span>
              <span className="text-white">{application.personalInformation.phone}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5 text-xs">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider border-b border-white/10 pb-2">
              Program Details
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-400">First Choice:</span>
              <span className="text-white font-semibold">{application.programPreferences.firstChoice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Second Choice:</span>
              <span className="text-white">{application.programPreferences.secondChoice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Shift:</span>
              <span className="text-white">{application.programPreferences.shift}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Intake:</span>
              <span className="text-white">{application.programPreferences.intake} 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Campus:</span>
              <span className="text-white">Chak Shezad, Islamabad</span>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider border-b border-white/10 pb-2">
            Submitted Application Documents ({application.documents?.length || 0})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {application.documents?.map((doc: any, i: number) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-slate-300 truncate">{doc.name}</span>
                </div>
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-iqra-gold-400 hover:underline flex items-center gap-1 shrink-0 font-medium"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-500">Encrypted</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
