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
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
  CredentialInput,
  CredentialButton,
} from "@/components/admin/credential";

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
      {/* Profile Header Card */}
      <CredentialCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-[8px] bg-[#23201b] border border-[#C9A25B] text-[#C9A25B] font-serif text-3xl flex items-center justify-center shrink-0">
              SB
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-serif font-medium text-[#F2EEE4] tracking-tight">
                  {adminName}
                </h2>
                <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#8a8272] border border-[#4a4335] px-2 py-0.5 rounded-[4px]">
                  SUPER_ADMIN
                </span>
              </div>

              <p className="text-xs font-mono text-[#C9A25B]">
                {adminEmail}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8a8272] pt-1">
                <span className="flex items-center gap-1 text-[#D8D3C6]">
                  <Building2 className="w-3.5 h-3.5 text-[#8a8272]" />
                  Chak Shehzad Campus, Islamabad
                </span>
                <span>•</span>
                <span>Role: Full University Administrative Authority</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335] text-[#7DAE7A] text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DAE7A] animate-pulse" />
            <span>Active Root Session</span>
          </div>
        </div>
      </CredentialCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Administrator Profile Details Form */}
        <CredentialCard>
          <CredentialHeader eyebrow="ACCOUNT" referenceId="PROFILE" />
          <CredentialTitle
            title="Administrator Information"
            subheading="Institutional Contact Dossier"
          />

          {profileSuccess && (
            <div className="p-3 my-3 rounded-[6px] bg-[#1a231b] border border-[#7DAE7A]/40 text-[#7DAE7A] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7DAE7A]" />
              <span>Administrator profile updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs mt-3">
            <CredentialInput
              label="Administrator Full Name"
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
            />

            <CredentialInput
              label="Registered Admin Email"
              type="email"
              value={adminEmail}
              readOnly
            />

            <CredentialInput
              label="Contact Phone Number"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <CredentialInput
              label="Institutional Role & Department"
              type="text"
              value="Office of the Registrar & Central Administration"
              readOnly
            />

            <div className="pt-2 flex justify-end">
              <CredentialButton variant="primary">
                Save Profile Information
              </CredentialButton>
            </div>
          </form>
        </CredentialCard>

        {/* Change Administrator Password Form */}
        <CredentialCard>
          <CredentialHeader eyebrow="SECURITY" referenceId="CREDENTIALS" />
          <CredentialTitle
            title="Change Admin Password"
            subheading="Authentication Key Setting"
          />

          {passwordSuccess && (
            <div className="p-3 my-3 rounded-[6px] bg-[#1a231b] border border-[#7DAE7A]/40 text-[#7DAE7A] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7DAE7A]" />
              <span>Password updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs mt-3">
            <CredentialInput
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <CredentialInput
              label="New Administrator Password"
              type="password"
              placeholder="At least 8 characters with numbers & symbols"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <CredentialInput
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2 flex justify-end">
              <CredentialButton variant="primary">
                Update Secret Password
              </CredentialButton>
            </div>
          </form>
        </CredentialCard>
      </div>

      {/* Active Sessions and Devices */}
      <CredentialCard>
        <div className="flex items-center justify-between pb-3 border-b border-[#4a4335] mb-4">
          <div>
            <h3 className="text-sm font-serif font-medium text-[#F2EEE4]">
              Active Administrative Sessions & Devices
            </h3>
            <p className="text-[11px] text-[#8a8272]">Security monitoring of authenticated access</p>
          </div>
          <span className="text-[11px] font-mono text-[#7DAE7A] bg-[#0e0d0b] px-2.5 py-1 rounded-[4px] border border-[#4a4335]">
            2 Sessions Active
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[6px] bg-[#23201b] text-[#8a8272] flex items-center justify-center border border-[#4a4335]">
                <Laptop className="w-5 h-5 text-[#8a8272]" />
              </div>
              <div>
                <p className="font-medium text-[#F2EEE4]">Windows 11 • Chrome 128 (Current Session)</p>
                <p className="text-[10px] text-[#8a8272]">Islamabad, Pakistan • IP: 192.168.1.6 (Chak Shehzad)</p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#7DAE7A]">Active Now</span>
          </div>

          <div className="p-3.5 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[6px] bg-[#23201b] text-[#8a8272] flex items-center justify-center border border-[#4a4335]">
                <Laptop className="w-5 h-5 text-[#8a8272]" />
              </div>
              <div>
                <p className="font-medium text-[#F2EEE4]">MacBook Pro • Safari 17.5</p>
                <p className="text-[10px] text-[#8a8272]">Islamabad, Pakistan • Last accessed 2 days ago</p>
              </div>
            </div>
            <CredentialButton
              variant="danger"
              onClick={() => alert("Session revoked.")}
            >
              Revoke Session
            </CredentialButton>
          </div>
        </div>
      </CredentialCard>
    </div>
  );
};



