"use client";

import React, { useState, useRef } from "react";
import {
  X,
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
  Eye,
  Edit3,
  Loader2,
  Sparkles,
  Phone,
  BookOpen,
} from "lucide-react";
import { getConvexClient, isConvexConfigured } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

export interface FacultyProfileData {
  fullName: string;
  designation: string;
  department: string;
  email: string;
  phone?: string;
  officeLocation?: string;
  officeHours?: string;
  specialization?: string;
  qualification?: string;
  bio?: string;
  profilePhoto?: string;
  employeeId?: string;
}

interface FacultyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: FacultyProfileData;
  onProfileUpdated: (updated: FacultyProfileData) => void;
  token?: string | null;
}

const DESIGNATION_OPTIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Senior Lecturer",
  "Lecturer",
  "Visiting Faculty",
  "Lab Instructor",
  "Research Fellow",
  "Department Chair",
  "Dean",
];

const DEPARTMENT_OPTIONS = [
  "Department of Computing & Artificial Intelligence",
  "Department of Software Engineering",
  "Department of Data Science & Cyber Security",
  "Department of Electrical Engineering",
  "Department of Business Administration",
  "Department of Media & Digital Communications",
  "Faculty of Social Sciences & Humanities",
];

export const FacultyProfileModal: React.FC<FacultyProfileModalProps> = ({
  isOpen,
  onClose,
  faculty,
  onProfileUpdated,
  token,
}) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Form State
  const [fullName, setFullName] = useState(faculty.fullName || "");
  const [designation, setDesignation] = useState(faculty.designation || "Assistant Professor");
  const [department, setDepartment] = useState(faculty.department || "Department of Computing & Artificial Intelligence");
  const [email, setEmail] = useState(faculty.email || "");
  const [phone, setPhone] = useState(faculty.phone || "+92 51 111 264 264");
  const [officeLocation, setOfficeLocation] = useState(faculty.officeLocation || "Faculty Block B, Office 201");
  const [officeHours, setOfficeHours] = useState(faculty.officeHours || "Mon-Thu 11:00 AM - 01:00 PM");
  const [specialization, setSpecialization] = useState(
    faculty.specialization || "Artificial Intelligence & Distributed Systems"
  );
  const [qualification, setQualification] = useState(faculty.qualification || "Ph.D. in Computer Science");
  const [bio, setBio] = useState(
    faculty.bio ||
      "Senior academic faculty member specializing in artificial intelligence, modern software architectures, and distributed systems at Iqra University Chak Shehzad Campus."
  );

  // Photo State
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(faculty.profilePhoto);
  const [profilePhotoStorageId, setProfilePhotoStorageId] = useState<string | undefined>(undefined);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Initials generator
  const getInitials = (nameStr: string) => {
    return nameStr
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "FA";
  };

  // Upload Photo to Convex Storage
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
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

      setProfilePhoto(photoUrl);
      setProfilePhotoStorageId(storageId);
      setPhotoSuccess("Profile picture uploaded successfully! Save to apply.");
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

  const handleRemovePhoto = () => {
    setProfilePhoto(undefined);
    setProfilePhotoStorageId(undefined);
    setPhotoSuccess("Profile photo removed. Fallback avatar will be shown.");
    setTimeout(() => setPhotoSuccess(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim()) {
      setSubmitError("Full Name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const client = getConvexClient();

      if (client && isConvexConfigured) {
        await client.mutation(api.users.updateFacultyProfile, {
          token: token || undefined,
          fullName: fullName.trim(),
          designation: designation.trim(),
          department: department.trim(),
          universityEmail: email.trim(),
          email: email.trim(),
          phone: phone.trim(),
          officeLocation: officeLocation.trim(),
          officeHours: officeHours.trim(),
          specialization: specialization.trim(),
          qualification: qualification.trim(),
          bio: bio.trim(),
          profilePhoto: profilePhoto || "",
          profilePhotoStorageId: profilePhotoStorageId,
        });
      }

      const updatedData: FacultyProfileData = {
        fullName: fullName.trim(),
        designation: designation.trim(),
        department: department.trim(),
        email: email.trim(),
        phone: phone.trim(),
        officeLocation: officeLocation.trim(),
        officeHours: officeHours.trim(),
        specialization: specialization.trim(),
        qualification: qualification.trim(),
        bio: bio.trim(),
        profilePhoto,
        employeeId: faculty.employeeId,
      };

      onProfileUpdated(updatedData);
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setSubmitError(err?.message || "Failed to save profile changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl bg-white dark:bg-[#0B1528] text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800/90 flex items-center justify-between bg-gradient-to-r from-slate-900 via-[#0a192f] to-[#0f274a] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Faculty Account
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {faculty.employeeId || "IQ-01"}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black font-heading text-white tracking-tight mt-0.5">
                Faculty Profile & Credentials
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl text-xs font-bold border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === "edit"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === "preview"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS / ALERTS */}
        {photoError && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{photoError}</span>
          </div>
        )}

        {photoSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{photoSuccess}</span>
          </div>
        )}

        {submitError && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {submitSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile successfully updated in database! Syncing dashboard...</span>
          </div>
        )}

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {activeTab === "preview" ? (
            /* PREVIEW CARD MODE */
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Preview Hero Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1528] via-[#102042] to-[#0D2A54] text-white p-6 shadow-xl border border-slate-800">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl ring-4 ring-white/10 shrink-0 overflow-hidden">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt={fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#0B1F3A] text-cyan-300 flex items-center justify-center font-black font-heading text-3xl">
                        {getInitials(fullName)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-cyan-400 text-[#0B1528]">
                      Official Academic Faculty
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                      {designation} {fullName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {bio}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{department}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-cyan-300">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{officeLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-500" />
                    Specialization & Research Focus
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {specialization}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                    Academic Qualification
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {qualification}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Student Consultation Hours
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {officeHours}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    Official Phone / Extension
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm font-mono">
                    {phone}
                  </p>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Click here to edit these details</span>
                </button>
              </div>
            </div>
          ) : (
            /* EDIT FORM MODE */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: PHOTO & BASIC INFO */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Personal Profile & Picture</span>
                </h4>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Circular Avatar with glow */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 shadow-lg ring-4 ring-white/10 overflow-hidden">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile Preview"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#0B1F3A] text-cyan-300 flex items-center justify-center font-black font-heading text-2xl">
                          {getInitials(fullName)}
                        </div>
                      )}
                    </div>

                    {isUploadingPhoto && (
                      <div className="absolute inset-0 bg-slate-950/70 rounded-full flex items-center justify-center text-white">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Faculty Headshot Photo
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload a high-resolution JPG, PNG, or WEBP (Max 5MB). Photo updates automatically across your dashboard banner, navigation bar, and user dropdown.
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
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
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        {isUploadingPhoto ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New Photo</span>
                          </>
                        )}
                      </button>

                      {profilePhoto && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Academic Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Faraz Ahsen"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Academic Designation *
                    </label>
                    <div className="relative">
                      <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        {DESIGNATION_OPTIONS.map((d) => (
                          <option key={d} value={d} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ACADEMIC CREDENTIALS */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Academic Affiliation & Specialization</span>
                </h4>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Department / Academic Faculty *
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {DEPARTMENT_OPTIONS.map((dept) => (
                        <option key={dept} value={dept} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Specialization & Focus Areas *
                      </label>
                      <input
                        type="text"
                        required
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="e.g. Artificial Intelligence & Distributed Systems"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Highest Academic Qualification *
                      </label>
                      <input
                        type="text"
                        required
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        placeholder="e.g. Ph.D. in Computer Science"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: CONTACT & OFFICE */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Contact Information & Campus Office</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Official University Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. faculty@iqra.edu.pk"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Office Location / Room *
                    </label>
                    <input
                      type="text"
                      required
                      value={officeLocation}
                      onChange={(e) => setOfficeLocation(e.target.value)}
                      placeholder="e.g. Faculty Block B, Office 201"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Office / Consultation Hours *
                    </label>
                    <input
                      type="text"
                      required
                      value={officeHours}
                      onChange={(e) => setOfficeHours(e.target.value)}
                      placeholder="e.g. Mon-Thu 11:00 AM - 01:00 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Official Extension / Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +92 51 111 264 264"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: PROFESSIONAL BIO */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Professional Bio & Academic Overview</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Displayed prominently in your Faculty Dashboard Hero Banner and student course syllabi.
                </p>
                <textarea
                  rows={4}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your academic background, research interests, and teaching philosophy..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed resize-y"
                />
              </div>

              {/* FORM ACTIONS */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
