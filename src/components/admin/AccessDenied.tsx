"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Lock, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "../ui/Button";

interface AccessDeniedProps {
  userRole?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  userRole,
  userEmail,
  onLogout,
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a192f] text-white p-4">
      <div className="max-w-md w-full rounded-3xl bg-white/5 border border-white/10 p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/30">
            HTTP 403 • ACCESS DENIED
          </span>
          <h2 className="text-2xl font-black font-heading text-white tracking-tight">
            Administrative Access Restricted
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The University Administrator Portal requires elevated institutional privileges. Your current authenticated session (<strong>{userEmail || "Guest"}</strong>, Role: <span className="font-mono text-amber-400 font-bold uppercase">{userRole || "Student"}</span>) is not authorized for administrative operations.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 text-left space-y-1">
          <p className="flex items-center gap-1.5 font-bold text-slate-300">
            <Lock className="w-3 h-3 text-iqra-gold-400" />
            <span>Role-Based Access Control (RBAC) Policy:</span>
          </p>
          <p className="leading-normal">
            Administrative access is strictly restricted to designated campus officials and the University Administrator: <span className="text-blue-300 font-mono">shakeelbhatti143143@gmail.com</span>.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          {userRole?.toLowerCase() === "faculty" || userRole?.toLowerCase() === "teacher" ? (
            <Link href="/faculty/dashboard" className="block w-full">
              <Button
                variant="gold"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="w-full text-xs font-bold rounded-xl"
              >
                Return to Faculty Portal
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard" className="block w-full">
              <Button
                variant="gold"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="w-full text-xs font-bold rounded-xl"
              >
                Return to Student Portal
              </Button>
            </Link>
          )}

          <Link href="/login" className="block w-full">
            <Button
              variant="outline"
              size="md"
              leftIcon={<LogIn className="w-4 h-4" />}
              className="w-full text-xs font-semibold rounded-xl border-white/20 hover:bg-white/10 text-white"
            >
              Sign In with Administrator Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
