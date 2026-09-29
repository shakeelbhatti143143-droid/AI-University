"use client";

import React, { useState, useRef } from "react";
import {
  User,
  Building2,
  Mail,
  MapPin,
  Clock,
  Award,
  GraduationCap,
  Briefcase,
  Camera,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Loader2,
  ShieldCheck,
  Calendar,
  Sparkles,
  Phone,
  BookOpen,
} from "lucide-react";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { FacultyProfileData } from "../FacultyProfileModal";

interface FacultyProfileSectionProps {
  faculty: FacultyProfileData;
  onOpenEditModal: () => void;
  onProfileUpdated: (updated: FacultyProfileData) => void;
  token?: string | null;
}

export const FacultyProfileSection: React.FC<FacultyProfileSectionProps> = ({
  faculty,
  onOpenEditModal,
  onProfileUpdated,
  token,
}) => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (nameStr: string) => {
    return nameStr
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "FA";
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image size exceeds 5 MB. Please choose a smaller photo.");
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setPhotoError(null);
      setPhotoSuccess(null);

      const client = getConvexClient();
      if (!client || !isConvexConfigured) {
        throw new Error("Convex backend connection is not configured.");
      }

      // Step 1: Generate direct upload URL
      const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {});
      if (!uploadUrl) {
        throw new Error("Could not acquire secure upload ticket.");
      }

      // Step 2: Upload binary
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!res.ok) {
        throw new Error("File upload failed on server.");
      }

      const { storageId } = await res.json();
      if (!storageId) {
        throw new Error("Storage identifier not returned.");
      }

      // Step 3: Get public view URL
      const photoUrl = await client.query(api.storage.getDocumentUrl, { storageId });
      if (!photoUrl) {
        throw new Error("Could not retrieve URL for uploaded photo.");
      }

      // Step 4: Update profile in database
      await client.mutation(api.users.updateFacultyProfile, {
        token: token || undefined,
        fullName: faculty.fullName,
        designation: faculty.designation,
        department: faculty.department,
        universityEmail: faculty.email,
        email: faculty.email,
        phone: faculty.phone,
        officeLocation: faculty.officeLocation,
        officeHours: faculty.officeHours,
        specialization: faculty.specialization,
        qualification: faculty.qualification,
        bio: faculty.bio,
        profilePhoto: photoUrl,
        profilePhotoStorageId: storageId,
      });

      const updated = {
        ...faculty,
        profilePhoto: photoUrl,
      };

      onProfileUpdated(updated);
      setPhotoSuccess("Profile picture updated and saved to database!");
      setTimeout(() => setPhotoSuccess(null), 3000);
    } catch (err: any) {
      console.error("Photo upload error:", err);
      setPhotoError(err?.message || "Failed to upload image.");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setIsUploadingPhoto(true);
      const client = getConvexClient();
      if (client && isConvexConfigured) {
        await client.mutation(api.users.updateFacultyProfile, {
          token: token || undefined,
          fullName: faculty.fullName,
          designation: faculty.designation,
          department: faculty.department,
          universityEmail: faculty.email,
          phone: faculty.phone,
          officeLocation: faculty.officeLocation,
          officeHours: faculty.officeHours,
          specialization: faculty.specialization,
          qualification: faculty.qualification,
          bio: faculty.bio,
          profilePhoto: "",
        });
      }

      const updated = {
        ...faculty,
        profilePhoto: undefined,
      };

      onProfileUpdated(updated);
      setPhotoSuccess("Profile photo removed. Initial avatar restored.");
      setTimeout(() => setPhotoSuccess(null), 2500);
    } catch (err: any) {
      setPhotoError(err?.message || "Failed to remove photo.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Alert / Status */}
      {photoError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{photoError}</span>
        </div>
      )}

      {photoSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{photoSuccess}</span>
        </div>
      )}

      {/* HERO PROFILE CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1528] via-[#102042] to-[#0D2A54] text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* CIRCULAR PROFILE IMAGE */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 shadow-2xl shadow-cyan-500/25 ring-4 ring-white/10 overflow-hidden">
                {faculty.profilePhoto ? (
                  <img
                    src={faculty.profilePhoto}
                    alt={faculty.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0B1F3A] to-[#122B4E] text-cyan-300 flex items-center justify-center font-black font-heading text-3xl sm:text-4xl shadow-inner">
                    {getInitials(faculty.fullName)}
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                title="Change Profile Photo"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* FACULTY HEADLINE & BADGES */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-cyan-400 text-[#0B1528] shadow-sm">
                  Official Academic Faculty
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {faculty.employeeId || "IQ-01"}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Faculty Profile
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
                {faculty.designation} {faculty.fullName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {faculty.bio || "Senior faculty member and researcher at Iqra University Chak Shehzad Campus."}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{faculty.department}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-cyan-300">
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{faculty.email}</span>
                </div>
                {faculty.officeLocation && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{faculty.officeLocation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* EDIT BUTTONS */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 self-center md:self-auto">
            <button
              onClick={onOpenEditModal}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Complete Profile</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 flex items-center justify-center gap-2 transition-colors"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Change Photo</span>
            </button>

            {faculty.profilePhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-5 py-2 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Academic Credentials */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1528] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Academic Credentials & Specialization</span>
            </h3>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Official Designation:
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {faculty.designation}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Academic Faculty / Department:
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {faculty.department}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Primary Research Specialization:
              </span>
              <p className="font-bold text-blue-600 dark:text-cyan-400">
                {faculty.specialization || "Artificial Intelligence & Distributed Systems"}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Highest Academic Qualification:
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {faculty.qualification || "Ph.D. in Computer Science"}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Campus Office & Consultation */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1528] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-600" />
              <span>Campus Office & Consultation</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Chak Shehzad Campus
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Official University Email:
              </span>
              <p className="font-bold text-slate-900 dark:text-white font-mono">
                {faculty.email}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Office Location:
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {faculty.officeLocation || "Faculty Block B, Office 201"}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Student Consultation / Office Hours:
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {faculty.officeHours || "Mon-Thu 11:00 AM - 01:00 PM"}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Official Phone / Campus Extension:
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {faculty.phone || "+92 51 111 264 264"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
