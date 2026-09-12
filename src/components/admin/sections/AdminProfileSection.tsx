"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Mail,
  Shield,
  KeyRound,
  Laptop,
  CheckCircle2,
  Calendar,
  Lock,
  Building2,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

export const AdminProfileSection: React.FC = () => {
  const [adminName, setAdminName] = useState("Shakeel Bhatti");
  const [adminEmail, setAdminEmail] = useState("shakeelbhatti143143@gmail.com");
  const [phone, setPhone] = useState("+92 300 1431430");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Profile Header Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-iqra-navy-950 via-iqra-navy-900 to-iqra-blue-900" />

        <div className="relative pt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-iqra-gold-500 to-amber-700 text-slate-950 font-black text-3xl sm:text-4xl flex items-center justify-center shadow-lg ring-4 ring-white shrink-0">
              SB
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
                  {adminName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-iqra-gold-500 text-slate-950">
                  Super Administrator
                </span>
              </div>

              <p className="text-sm font-semibold text-iqra-blue-700 font-mono">
                {adminEmail}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-iqra-blue-600" />
                  Chak Shehzad Campus, Islamabad
                </span>
                <span>•</span>
                <span>Role: Full University Administrative Authority</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Root Session
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Administrator Profile Details Form */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Administrator Information</h3>
            <span className="text-xs text-slate-400">Institutional Contact</span>
          </div>

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Administrator profile updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Administrator Full Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Registered Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-mono text-slate-500 cursor-not-allowed"
                title="Primary super administrator email is fixed to shakeelbhatti143143@gmail.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Contact Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Institutional Role & Department</label>
              <input
                type="text"
                value="Office of the Registrar & Central Administration"
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold transition-colors"
              >
                Save Profile Information
              </button>
            </div>
          </form>
        </div>

        {/* Change Administrator Password Form */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Change Admin Password & Credentials</h3>
            <span className="text-xs text-slate-400">Security Setting</span>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Password updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">New Administrator Password</label>
              <input
                type="password"
                placeholder="At least 8 characters with numbers & symbols"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-iqra-navy-900 hover:bg-iqra-blue-700 text-white font-bold transition-colors"
              >
                Update Secret Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Active Sessions and Devices */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Administrative Sessions & Devices</h3>
            <p className="text-[11px] text-slate-500">Security monitoring of authenticated access</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            2 Sessions Active
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-iqra-blue-700 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Windows 11 • Chrome 128 (Current Session)</p>
                <p className="text-[10px] text-slate-500">Islamabad, Pakistan • IP: 192.168.1.6 (Chak Shehzad)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600">Active Now</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">MacBook Pro • Safari 17.5</p>
                <p className="text-[10px] text-slate-500">Islamabad, Pakistan • Last accessed 2 days ago</p>
              </div>
            </div>
            <button
              onClick={() => alert("Session revoked.")}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Revoke Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
