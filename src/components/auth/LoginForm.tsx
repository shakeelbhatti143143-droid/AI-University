"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle, ArrowRight, KeyRound } from "lucide-react";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { useAuth } from "@/lib/auth-context";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authNotice, setAuthNotice] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!email.includes("@")) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setAuthNotice(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await login(email, password, rememberMe);
      if (result.success && result.user) {
        if (result.user.role === "admin") {
          router.push("/admin");
        } else if (result.user.role === "student") {
          router.push("/dashboard");
        } else if (result.user.role === "applicant") {
          router.push("/status");
        } else {
          router.push("/dashboard");
        }
      } else {
        if (result.code === "PASSWORD_SETUP_REQUIRED") {
          setAuthNotice({
            title: "Admission Approved! Setup Your Password",
            message:
              result.error ||
              "Your admission was approved. Please set your university account password using the password setup link sent to your email.",
          });
        } else {
          setErrorMessage(result.error || "Authentication failed. Please check your credentials.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4" noValidate>
      {/* Password Setup Required Alert Box */}
      {authNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-900 text-xs">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <KeyRound className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="font-bold text-amber-800 text-xs">{authNotice.title}</div>
            <div className="text-amber-700 leading-relaxed">{authNotice.message}</div>
            <div className="pt-1.5 flex items-center gap-3">
              <Link
                href="/status"
                className="font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
              >
                <span>Check Application Status</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}


      {/* University / Account Email */}
      <InputField
        id="login-email"
        label="Official University Email / Registered Email"
        type="email"
        placeholder="student@isb.iqra.edu.pk or admin@..."
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
        }}
        error={fieldErrors.email}
        leftIcon={<Mail className="w-4 h-4" />}
        autoComplete="email"
        required
      />

      {/* Password */}
      <InputField
        id="login-password"
        label="Account Password"
        isPassword
        placeholder="Enter your password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
        }}
        error={fieldErrors.password}
        leftIcon={<Lock className="w-4 h-4" />}
        autoComplete="current-password"
        required
      />

      {/* Remember Me & Instructions */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 hover:text-slate-900">
          <input
            id="login-remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-[#0066cc] border-slate-300 focus:ring-blue-400 focus:ring-offset-0 cursor-pointer"
          />
          <span>Remember me</span>
        </label>

        <Link
          href="/status"
          className="text-xs text-slate-500 hover:text-[#0066cc] transition-colors"
        >
          Check Application Status
        </Link>
      </div>

      {/* Sign In Button */}
      <Button
        id="login-submit-btn"
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold tracking-wide rounded-xl shadow-md shadow-blue-600/20 mt-2"
      >
        Sign In to Portal
      </Button>


      {/* Admission Application Link */}
      <div className="text-center pt-2 text-xs text-slate-500">
        Applying for New Admission?{" "}
        <Link
          href="/apply"
          className="font-bold text-[#0066cc] hover:underline inline-flex items-center gap-1"
        >
          <span>Apply Online 2026</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </form>
  );
};
