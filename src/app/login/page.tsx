"use client";

import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="IQRA UNIVERSITY"
      subtitle="CHAK SHEZAD CAMPUS"
      badgeText="STUDENT PANEL"
    >
      <LoginForm />
    </AuthLayout>
  );
}
