"use client";

import React, { useState } from "react";
import { X, User, Phone, Mail, MapPin, Check, AlertCircle } from "lucide-react";
import { StudentProfile } from "@/lib/dashboard-data";

interface EditProfileModalProps {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: Partial<StudentProfile>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [phone, setPhone] = useState(profile.phone);
  const [personalEmail, setPersonalEmail] = useState(profile.personalEmail);
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact);
  const [address, setAddress] = useState(profile.address);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      phone,
      personalEmail,
      emergencyContact,
      address,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-iqra-navy-950 to-iqra-navy-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black font-heading text-white">
              Edit Student Contact Information
            </h3>
            <p className="text-xs text-blue-200">
              Iqra University Chak Shehzad Student Portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Student contact information updated successfully!</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
            <strong>Note:</strong> Core academic details (Student ID, Degree Program, Department, and Official University Email) cannot be edited online and require Registrar approval.
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Personal Email Address
            </label>
            <input
              type="email"
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20 focus:border-iqra-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Mobile Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20 focus:border-iqra-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Emergency Guardian Contact
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20 focus:border-iqra-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Residential Postal Address (Islamabad / Rawalpindi)
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-iqra-blue-500/20 focus:border-iqra-blue-500"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
