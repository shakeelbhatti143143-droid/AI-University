"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, Lock, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { PasswordStrength } from "../ui/PasswordStrength";
import { useAuth } from "@/lib/auth-context";

export const SignupForm: React.FC = () => {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const errors: typeof fieldErrors = {};

    if (!name.trim()) {
      errors.name = "Full name is required.";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      errors.email = "University email is required.";
    } else if (!email.includes("@")) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await register(name, email, password, "applicant");
      if (result.success) {
        router.push("/apply");
      } else {
        setErrorMessage(result.error || "Registration could not be completed.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3.5" noValidate>
      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Full Name */}
      <InputField
        id="signup-name"
        label="Full Name"
        type="text"
        placeholder="e.g. Shakeel Ahmed"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
        }}
        error={fieldErrors.name}
        leftIcon={<UserIcon className="w-4 h-4" />}
        autoComplete="name"
        required
      />

      {/* Email Address */}
      <InputField
        id="signup-email"
        label="Institutional Email Address"
        type="email"
        placeholder="student@iqra.edu.pk"
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

      {/* Password with live strength meter */}
      <div>
        <InputField
          id="signup-password"
          label="Create Password"
          isPassword
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
          }}
          error={fieldErrors.password}
          leftIcon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          required
        />
        <PasswordStrength password={password} />
      </div>

      {/* Confirm Password */}
      <InputField
        id="signup-confirm-password"
        label="Confirm Password"
        isPassword
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (fieldErrors.confirmPassword)
            setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
        }}
        error={fieldErrors.confirmPassword}
        leftIcon={<Lock className="w-4 h-4" />}
        autoComplete="new-password"
        required
      />

      {/* Submit Button */}
      <Button
        id="signup-submit-btn"
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold tracking-wide rounded-xl shadow-md shadow-blue-600/20 mt-3"
      >
        Create Student Account
      </Button>

      {/* Login Redirection */}
      <div className="text-center pt-2 text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-[#0066cc] hover:underline inline-flex items-center gap-1"
        >
          <span>Sign In Here</span>
        </Link>
      </div>
    </form>
  );
};
