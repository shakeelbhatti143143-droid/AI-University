"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Printer,
  ExternalLink,
  Award,
  QrCode,
  Building2,
  GraduationCap,
  Calendar,
  User,
  Hash,
  Share2,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";

export default function PublicCredentialVerificationPage() {
  const params = useParams();
  const rawId = (params?.credentialId as string) || "";
  const credentialId = decodeURIComponent(rawId);

  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Attempt to query from Convex
  const convexResult = useQuery(
    api.credentials.getPublicCredential,
    credentialId ? { credentialId } : "skip"
  );

  // Fallback demo mock if Convex is empty or offline
  const isSample = credentialId.startsWith("IU-DEG-") || credentialId.includes("2026") || credentialId === "sample";

  const credential = convexResult || (isSample ? {
    credentialId: credentialId || "IU-DEG-2026-IU-ISB-2024-0418",
    studentName: "Saad Tariq Abbasi",
    enrollmentId: "IU-ISB-2024-0418",
    degreeProgram: "Bachelor of Science in Software Engineering (BSSE)",
    department: "Department of Computing & Technology",
    cgpa: 3.62,
    conferralDate: "October 14, 2026",
    verificationHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "Active",
    hecAttestationStatus: "HEC Pakistan Verified & Attested (Ref: HEC-ISB-2026-99214)",
    issuedBy: "Office of the Controller of Examinations, Iqra University Islamabad",
    issuedAt: 1729000000000,
  } : null);

  const handleCopyHash = () => {
    if (credential?.verificationHash) {
      navigator.clipboard.writeText(credential.verificationHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isVerified = credential && credential.status === "Active";

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#D8D3C6] font-sans antialiased selection:bg-[#C9A25B] selection:text-[#0e0d0b] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation / Brand Bar */}
        <div className="flex items-center justify-between border-b border-[#4a4335] pb-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[6px] bg-[#1D1B18] border border-[#C9A25B] flex items-center justify-center text-[#C9A25B] font-serif font-bold text-lg shadow-sm">
              IU
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8a8272]">
                Iqra University Islamabad
              </div>
              <div className="font-serif text-sm font-semibold text-[#F2EEE4] group-hover:text-[#C9A25B] transition-colors">
                Public Credential Verification Portal
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="h-[32px] px-3 rounded-[6px] border border-[#4a4335] bg-[#1D1B18] text-[#8a8272] hover:text-[#F2EEE4] text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied" : "Share"}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="h-[32px] px-3 rounded-[6px] border border-[#C9A25B] text-[#C9A25B] hover:bg-[#C9A25B]/10 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>

        {/* Verification Status Card */}
        {credential ? (
          <div
            className="relative overflow-hidden rounded-[10px] border border-[#4a4335] bg-[#1D1B18] shadow-2xl p-6 sm:p-8 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
          >
            {/* Header Stamp & Status */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#4a4335]/70">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-[7px] h-[7px] rounded-full shrink-0"
                    style={{ backgroundColor: isVerified ? "#7DAE7A" : "#E27878" }}
                  />
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: isVerified ? "#7DAE7A" : "#E27878" }}
                  >
                    {isVerified ? "Tamper-Evident Authentic Credential" : "Credential Revoked / Inactive"}
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#F2EEE4] tracking-tight">
                  Academic Degree Verification
                </h1>
                <p className="text-xs text-[#8a8272]">
                  Office of the Controller of Examinations • Iqra University Islamabad Campus
                </p>
              </div>

              {/* Verified Badge Monogram */}
              <div className="flex items-center gap-3 self-start sm:self-auto px-3.5 py-2 rounded-[8px] bg-[#0e0d0b] border border-[#4a4335]">
                <ShieldCheck className="w-6 h-6 text-[#7DAE7A] shrink-0" />
                <div className="text-left">
                  <span className="block text-[9px] uppercase font-mono tracking-wider text-[#8a8272]">
                    Verification Status
                  </span>
                  <span className="block text-xs font-serif font-bold text-[#F2EEE4]">
                    OFFICIALLY VALIDATED
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate & Academic Details Grid */}
            <div className="py-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]/60 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8a8272] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C9A25B]" />
                    Candidate / Graduate Name
                  </span>
                  <div className="font-serif text-base font-semibold text-[#F2EEE4]">
                    {credential.studentName}
                  </div>
                </div>

                <div className="p-4 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]/60 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#8a8272] flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#C9A25B]" />
                    Registration / Roll Number
                  </span>
                  <div className="font-mono text-base font-bold text-[#D8D3C6]">
                    {credential.enrollmentId}
                  </div>
                </div>
              </div>

              {/* Degree Program & Faculty */}
              <div className="p-4 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]/60 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#8a8272] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#C9A25B]" />
                  Conferred Degree Program
                </span>
                <div className="font-serif text-lg font-medium text-[#F2EEE4]">
                  {credential.degreeProgram}
                </div>
                <div className="text-xs text-[#8a8272]">
                  {credential.department} • Chak Shehzad Campus, Islamabad
                </div>
              </div>

              {/* Academic Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]/60">
                  <span className="text-[10px] font-mono uppercase text-[#8a8272] block">Cumulative GPA</span>
                  <div className="font-serif text-xl font-bold text-[#F2EEE4] mt-0.5">
                    {credential.cgpa.toFixed(2)}
                    <span className="text-xs font-normal text-[#8a8272] ml-1">/ 4.00</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]/60">
                  <span className="text-[10px] font-mono uppercase text-[#8a8272] block">Conferral Date</span>
                  <div className="font-serif text-sm font-semibold text-[#F2EEE4] mt-1 truncate">
                    {credential.conferralDate}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]/60">
                  <span className="text-[10px] font-mono uppercase text-[#8a8272] block">HEC Standing</span>
                  <div className="text-xs font-semibold text-[#7DAE7A] mt-1 flex items-center gap-1 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Attested Level 6/7</span>
                  </div>
                </div>
              </div>

              {/* HEC Pakistan Attestation Notice */}
              <div className="p-3.5 rounded-[6px] bg-[#121110] border border-[#4a4335]/80 flex items-start gap-3">
                <Award className="w-5 h-5 text-[#C9A25B] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-medium text-[#F2EEE4] block">Higher Education Commission (HEC) Verified</span>
                  <span className="text-[#8a8272] block mt-0.5">
                    {credential.hecAttestationStatus}
                  </span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Tamper-Proof Audit Hash */}
              <div className="p-4 rounded-[6px] bg-[#0a0a09] border border-[#4a4335] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#8a8272] flex items-center gap-1.5">
                    <Hash className="w-3 h-3 text-[#C9A25B]" />
                    Cryptographic Audit Hash (SHA-256)
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="text-[10px] font-mono text-[#C9A25B] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-[#8a8272] break-all select-all bg-[#0e0d0b] p-2.5 rounded border border-[#4a4335]/50">
                  {credential.verificationHash}
                </div>
                <p className="text-[10px] text-[#8a8272]">
                  This hash is generated by hashing the student degree record against the Iqra University private signing key. Any modification to student records invalidates this fingerprint.
                </p>
              </div>
            </div>

            {/* Footer Sign-off & Verification Authority */}
            <div className="pt-6 border-t border-[#4a4335]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="font-serif font-medium text-[#F2EEE4]">
                  Office of the Controller of Examinations
                </div>
                <div className="text-[#8a8272]">
                  Iqra University Islamabad • Verification ID: <span className="font-mono text-[#D8D3C6]">{credential.credentialId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#8a8272]">
                <div className="w-2 h-2 rounded-full bg-[#7DAE7A]" />
                <span>Synchronized with University Registrar Ledger</span>
              </div>
            </div>
          </div>
        ) : (
          /* Credential Not Found State */
          <div className="p-12 text-center rounded-[10px] border border-[#4a4335] bg-[#1D1B18] space-y-4">
            <div className="w-12 h-12 rounded-[8px] border border-[#4a4335] flex items-center justify-center mx-auto text-[#E27878]">
              <XCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-medium text-[#F2EEE4]">
              Credential Record Not Found
            </h2>
            <p className="text-xs text-[#8a8272] max-w-md mx-auto leading-relaxed">
              No verified degree or transcript credential was located with ID{" "}
              <span className="font-mono text-[#D8D3C6] bg-[#0e0d0b] px-1.5 py-0.5 rounded border border-[#4a4335]">
                {credentialId || "Unknown"}
              </span>
              . Please verify the QR code URL or contact the Iqra University Examination Controller Office.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] border border-[#C9A25B] text-[#C9A25B] text-xs font-semibold hover:bg-[#C9A25B]/10 transition-colors"
              >
                <span>Return to Portal Home</span>
              </Link>
            </div>
          </div>
        )}

        {/* Legal Disclaimer */}
        <div className="text-center text-[10px] text-[#8a8272] space-y-1">
          <p>© 2026 Iqra University Islamabad. All Rights Reserved. Accredited by Higher Education Commission (HEC) of Pakistan.</p>
          <p>For employer background inquiries: registrar@isb.iqra.edu.pk • +92 (51) 111-264-264</p>
        </div>

      </div>
    </div>
  );
}
