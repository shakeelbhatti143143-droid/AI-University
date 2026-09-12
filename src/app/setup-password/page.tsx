"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  KeyRound,
} from "lucide-react";
import { UniversityLogo } from "@/components/ui/UniversityLogo";
import { Button } from "@/components/ui/Button";
import { InputField, InputThemeContext } from "@/components/ui/InputField";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

function SetupPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [studentInfo, setStudentInfo] = useState<{ name?: string; universityEmail?: string }>({});
  const [verifyError, setVerifyError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activatedEmail, setActivatedEmail] = useState("");

  // Verify setup token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        setVerifyError("No password setup token found in this link. Please use the link sent to your registered email.");
        return;
      }

      try {
        const client = getConvexClient();
        if (client && isConvexConfigured) {
          const res = await client.query(api.auth.verifySetupToken, { token });
          if (res && res.valid) {
            setIsValidToken(true);
            setStudentInfo({
              name: res.name,
              universityEmail: res.universityEmail,
            });
          } else {
            setVerifyError(res?.message || "This password setup link is invalid or has expired.");
          }
        } else {
          // If offline preview mode, allow testing
          setIsValidToken(true);
          setStudentInfo({ name: "Student", universityEmail: "student@isb.iqra.edu.pk" });
        }
      } catch (err: any) {
        console.error("Token verification error:", err);
        setVerifyError("Failed to verify setup token. Please contact the Admissions Office.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newPassword || newPassword.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const res = await client.mutation(api.auth.setupUniversityPassword, {
          token,
          newPassword,
        });

        if (res.success) {
          setActivatedEmail(res.universityEmail || studentInfo.universityEmail || "");
          setIsSuccess(true);
        }
      } else {
        setIsSuccess(true);
        setActivatedEmail(studentInfo.universityEmail || "student@isb.iqra.edu.pk");
      }
    } catch (err: any) {
      setFormError(err.message || "Could not set password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050e1d] text-white flex flex-col selection:bg-iqra-blue-600 selection:text-white">
      {/* Header Bar */}
      <header className="w-full border-b border-white/10 bg-[#050e1d]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <UniversityLogo variant="default" size="sm" />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs text-slate-300">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <InputThemeContext.Provider value="dark">
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        {isLoading ? (
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-iqra-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Verifying secure password setup token...</p>
          </div>
        ) : !isValidToken ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-3xl bg-white/[0.03] border border-rose-500/30 text-center space-y-4"
          >
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Invalid Setup Link</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{verifyError}</p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" size="md" className="w-full border-white/20 text-slate-300 rounded-xl">
                  Go to Login
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-3xl bg-white/[0.03] border border-emerald-500/30 text-center space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Account Successfully Activated
              </span>
              <h2 className="text-2xl font-black font-heading text-white">
                University Password Configured
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your official Iqra University student account is now active. Please sign into the student portal using your university email and password.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-left text-xs">
              <span className="text-slate-400 block text-[11px] mb-0.5">Your Official University Email:</span>
              <strong className="text-iqra-gold-400 font-mono text-sm">{activatedEmail}</strong>
            </div>

            <Link href="/login">
              <Button
                variant="gold"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
                className="w-full text-slate-950 font-bold rounded-xl"
              >
                Sign In to Student Portal
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0a1628]/95 border border-white/15 backdrop-blur-xl shadow-2xl shadow-blue-950/50 space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-iqra-gold-500/20 border border-iqra-gold-500/30 flex items-center justify-center mx-auto mb-2 text-iqra-gold-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black font-heading text-white">
                Set Your University Account Password
              </h1>
              <p className="text-xs text-slate-400">
                Welcome, <strong className="text-white">{studentInfo.name}</strong>! Configure a secure password for your official university email account.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300">
              <span className="text-slate-400 block text-[11px]">Official University Email:</span>
              <strong className="text-iqra-gold-400 font-mono">{studentInfo.universityEmail}</strong>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <InputField
                  id="newPassword"
                  label="New Password"
                  isPassword
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <PasswordStrength password={newPassword} />
              </div>

              <InputField
                id="confirmPassword"
                label="Confirm New Password"
                isPassword
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isSubmitting}
                className="w-full text-slate-950 font-bold rounded-xl mt-4"
              >
                Activate University Account
              </Button>
            </form>
          </motion.div>
        )}
      </main>
      </InputThemeContext.Provider>
    </div>
  );
}

export default function SetupPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050e1d] text-white">
          <div className="w-10 h-10 border-2 border-iqra-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SetupPasswordContent />
    </Suspense>
  );
}
