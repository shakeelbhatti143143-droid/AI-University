"use client";

import React from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Edit3,
  MapPin,
  FileBadge,
  Award,
  BookOpen,
  Hash,
  Contact,
  Heart,
  Briefcase,
  AlertCircle,
  Copy,
  Check,
  Camera,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { StudentProfile } from "@/lib/dashboard-data";

interface MyProfileSectionProps {
  profile: StudentProfile;
  onOpenEditProfile: () => void;
  onUploadPhoto?: (file: File) => Promise<string>;
}

export const MyProfileSection: React.FC<MyProfileSectionProps> = ({
  profile,
  onOpenEditProfile,
  onUploadPhoto,
}) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    if (!onUploadPhoto) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      await onUploadPhoto(file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload profile picture.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Profile Header Hero Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Navy Header Accent Top Band */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-iqra-navy-950 via-iqra-navy-900 to-iqra-blue-900" />

        <div className="relative pt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          {/* Avatar & Core Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Student Profile Photo */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-iqra-blue-600 to-iqra-navy-950 p-1 shadow-lg ring-4 ring-white relative overflow-hidden">
                <div className="w-full h-full rounded-xl bg-iqra-navy-900 flex items-center justify-center text-white text-3xl font-black font-heading overflow-hidden relative">
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  )}

                  {/* Hover Upload Overlay */}
                  {onUploadPhoto && (
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                      title="Upload Profile Picture"
                    >
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                      ) : (
                        <>
                          <Camera className="w-6 h-6 text-iqra-gold-400 mb-0.5" />
                          <span className="text-[10px] font-bold">Change</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Upload trigger button badge */}
              {onUploadPhoto && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute -top-1 -right-1 p-1.5 rounded-full bg-iqra-navy-950 hover:bg-iqra-blue-700 text-white ring-2 ring-white shadow-xs cursor-pointer transition-colors"
                  title="Upload profile picture"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-iqra-gold-400" />
                  )}
                </button>
              )}

              <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white ring-2 ring-white shadow-xs" title="Enrolled & Active Student">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
                  {profile.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {profile.status} Enrolled
                </span>
                {uploadSuccess && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-in fade-in flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Photo Updated
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-iqra-blue-700">
                {profile.program}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  <Hash className="w-3 h-3 text-slate-400" />
                  {profile.studentId}
                </span>
                <span>•</span>
                <span>{profile.campus}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">{profile.batch}</span>
              </div>

              {profile.bio && (
                <p className="text-xs text-slate-600 max-w-xl italic pt-1 leading-relaxed">
                  &ldquo;{profile.bio}&rdquo;
                </p>
              )}

              {uploadError && (
                <p className="text-xs font-bold text-rose-600 flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {uploadError}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onUploadPhoto && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                ) : (
                  <UploadCloud className="w-4 h-4 text-iqra-blue-700" />
                )}
                <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
              </button>
            )}

            <button
              onClick={onOpenEditProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold shadow-md shadow-slate-900/10 transition-all duration-200 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-iqra-gold-400" />
              <span>Edit Profile Information</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Personal Info & Academic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================================= */}
        {/* 1. ACADEMIC INFORMATION CARD */}
        {/* ========================================================================= */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-iqra-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Academic Credentials</h3>
                <p className="text-[11px] text-slate-500">Official institutional record</p>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-iqra-blue-800">
              HEC Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Student Registration ID
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-900">{profile.studentId}</span>
                <button
                  onClick={() => copyToClipboard(profile.studentId, "studentId")}
                  className="text-slate-400 hover:text-slate-700"
                  title="Copy Student ID"
                >
                  {copiedField === "studentId" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                HEC Registration #
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">{profile.hecRegistrationNo}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Degree Program
              </span>
              <span className="text-xs font-bold text-slate-900 block">{profile.program}</span>
              <span className="text-[11px] text-slate-500">{profile.degreeLevel}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Department & Faculty
              </span>
              <span className="text-xs font-bold text-slate-900 block">{profile.department}</span>
              <span className="text-[11px] text-slate-500">{profile.faculty}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Current Semester
              </span>
              <span className="text-xs font-bold text-emerald-600">{profile.currentSemester}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Current Academic Session
              </span>
              <span className="text-xs font-bold text-slate-900">{profile.academicSession}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Section & Shift
              </span>
              <span className="text-xs font-bold text-slate-900">{profile.section} • {profile.shift}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Campus Location
              </span>
              <span className="text-xs font-bold text-slate-900">Chak Shehzad, Islamabad</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-iqra-blue-700 block mb-1">
                Assigned Faculty Advisor
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">{profile.advisorName}</span>
                  <p className="text-[11px] text-slate-600">{profile.advisorEmail}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(profile.advisorEmail, "advisorEmail")}
                  className="text-xs font-semibold text-iqra-blue-700 hover:underline"
                >
                  {copiedField === "advisorEmail" ? "Copied" : "Copy Email"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PERSONAL INFORMATION CARD */}
        {/* ========================================================================= */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Personal & Contact Record</h3>
                <p className="text-[11px] text-slate-500">Student verified biodata</p>
              </div>
            </div>

            <span className="text-xs text-slate-400">Confidential</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                University Email Address (Official)
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-iqra-blue-700">{profile.email}</span>
                <button
                  onClick={() => copyToClipboard(profile.email, "univEmail")}
                  className="text-slate-400 hover:text-slate-700"
                  title="Copy University Email"
                >
                  {copiedField === "univEmail" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Personal Email Address
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-800">{profile.personalEmail}</span>
                <button
                  onClick={() => copyToClipboard(profile.personalEmail, "persEmail")}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {copiedField === "persEmail" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Mobile Phone Number
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">{profile.phone}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Emergency Guardian Contact
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">{profile.emergencyContact}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                National Identity Card (CNIC)
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">{profile.cnic}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Date of Birth & Blood Group
              </span>
              <span className="text-xs font-bold text-slate-900">{profile.dateOfBirth} • Group: {profile.bloodGroup}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Residential Postal Address
              </span>
              <span className="text-xs text-slate-800 font-medium">{profile.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
