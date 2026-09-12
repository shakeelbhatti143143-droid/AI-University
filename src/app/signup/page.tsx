"use client";

import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="IQRA UNIVERSITY"
      subtitle="CHAK SHEZAD CAMPUS"
      badgeText="STUDENT REGISTRATION"
    >
      <div className="mb-4 text-center">
        <h2 className="text-sm font-bold text-slate-800">
          Begin Your Academic Journey
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
          Create your verified account and become part of the Iqra University Chak Shezad Campus community.
        </p>
      </div>
      <SignupForm />
    </AuthLayout>
  );
}
