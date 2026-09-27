"use client";

import React, { useState } from "react";
import {
  Receipt,
  CreditCard,
  Printer,
  CheckCircle2,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { StudentProfile } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface FeeChallanSectionProps {
  profile: StudentProfile;
}

export const FeeChallanSection: React.FC<FeeChallanSectionProps> = ({ profile }) => {
  const [selectedChallanIndex, setSelectedChallanIndex] = useState(0);

  const studentChallans = [
    {
      challanNo: "IU-2026-FEE-88219",
      semester: "Fall 2026",
      issueDate: "September 01, 2026",
      dueDate: "September 25, 2026",
      status: "Paid",
      paymentMethod: "Kuickpay (1-Link)",
      transactionRef: "KP-9948291038",
      paidDate: "September 12, 2026",
      breakdown: {
        tuitionFee: 110000,
        labCharges: 15000,
        libraryFee: 5000,
        examinationFee: 10000,
        scholarshipDiscount: 20000,
        totalPayable: 120000,
      },
    },
    {
      challanNo: "IU-2026-FEE-74190",
      semester: "Spring 2026",
      issueDate: "February 01, 2026",
      dueDate: "February 25, 2026",
      status: "Paid",
      paymentMethod: "HBL Branch Cash",
      transactionRef: "HBL-ISB-3091",
      paidDate: "February 18, 2026",
      breakdown: {
        tuitionFee: 110000,
        labCharges: 15000,
        libraryFee: 5000,
        examinationFee: 10000,
        scholarshipDiscount: 20000,
        totalPayable: 120000,
      },
    },
  ];

  const currentChallan = studentChallans[selectedChallanIndex];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-iqra-navy-950 via-iqra-navy-900 to-iqra-blue-900 text-white p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold">
            <Receipt className="w-3.5 h-3.5" />
            <span>Accounts &amp; Bursar SIS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Fee Vouchers &amp; Bank Challans
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Download institutional 3-part bank challans, verify 1-Link Kuickpay consumer IDs, and view payment settlement history.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Printer className="w-4 h-4 text-cyan-300" />
          <span>Print Official Bank Challan</span>
        </button>
      </div>

      {/* Invoice Overview & Challan History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Challans List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Bursar Billing History
          </h3>

          {studentChallans.map((ch, idx) => (
            <div
              key={ch.challanNo}
              onClick={() => setSelectedChallanIndex(idx)}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer shadow-xs",
                selectedChallanIndex === idx
                  ? "bg-iqra-blue-50 border-iqra-blue-300 shadow-iqra-blue-100/60"
                  : "bg-white border-slate-200 hover:border-iqra-blue-200 hover:shadow-sm"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-slate-400">{ch.challanNo}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  {ch.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {ch.semester} Semester Fee
              </h4>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400">Net Amount:</span>
                <span className="font-mono font-bold text-slate-700">
                  PKR {ch.breakdown.totalPayable.toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {/* Payment Channels Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-iqra-blue-500" />
              Authorized Payment Channels
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Payable via any 1-Link ATM, Internet Banking, Kuickpay (Consumer ID: 1042 + Enrollment ID), or cash over the counter at any Habib Bank Limited (HBL) or Meezan Bank branch across Pakistan.
            </p>
          </div>
        </div>

        {/* Right: Detailed 3-Part Bank Challan Sheet */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            {/* Challan Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Challan No: {currentChallan.challanNo}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                  Iqra University Official Fee Challan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic Term: <strong className="text-slate-700">{currentChallan.semester}</strong> • Due: {currentChallan.dueDate}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  STATUS: {currentChallan.status.toUpperCase()}
                </span>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Txn Ref: {currentChallan.transactionRef}
                </p>
              </div>
            </div>

            {/* Student Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wide">Student Name</span>
                <span className="font-semibold text-slate-800 truncate block">{profile.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wide">Enrollment ID</span>
                <span className="font-mono text-slate-700 block">{profile.studentId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wide">Degree Program</span>
                <span className="text-slate-700 truncate block">{profile.program}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wide">Campus</span>
                <span className="text-slate-700 block">{profile.campus}</span>
              </div>
            </div>

            {/* Itemized Fee Breakdown Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Description / Fee Head</th>
                    <th className="py-2.5 px-4 text-right">Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4">Tuition Fee (Semester Dues)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium">
                      {currentChallan.breakdown.tuitionFee.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4">Computing Laboratory &amp; High-Performance Cloud Access</td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium">
                      {currentChallan.breakdown.labCharges.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4">Digital Library &amp; IEEE / ACM Repository Subscription</td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium">
                      {currentChallan.breakdown.libraryFee.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4">Semester Examination &amp; Assessment Fee</td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium">
                      {currentChallan.breakdown.examinationFee.toLocaleString()}
                    </td>
                  </tr>
                  {currentChallan.breakdown.scholarshipDiscount > 0 && (
                    <tr className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                      <td className="py-2.5 px-4 font-medium">Merit-Based Academic Scholarship Waiver</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold">
                        - {currentChallan.breakdown.scholarshipDiscount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-iqra-blue-600 text-white font-semibold">
                    <td className="py-3 px-4 text-sm font-bold rounded-bl-xl">Total Net Amount Payable</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-base rounded-br-xl">
                      PKR {currentChallan.breakdown.totalPayable.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3-Part Layout Stamp Verification Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[10px] text-slate-500 border-t border-slate-100">
              <div className="p-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center space-y-1">
                <span className="font-bold uppercase text-slate-600 block text-xs">Bank Copy</span>
                <p>Retained by collecting branch at deposit</p>
                <div className="h-8 border-b border-slate-200 mt-3" />
                <span className="block text-[9px] pt-1 text-slate-400">Cashier Signature &amp; Stamp</span>
              </div>

              <div className="p-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center space-y-1">
                <span className="font-bold uppercase text-slate-600 block text-xs">Accounts Copy</span>
                <p>Submitted to Bursar office by student</p>
                <div className="h-8 border-b border-slate-200 mt-3" />
                <span className="block text-[9px] pt-1 text-slate-400">Bursar Seal &amp; Signature</span>
              </div>

              <div className="p-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center space-y-1">
                <span className="font-bold uppercase text-slate-600 block text-xs">Student Copy</span>
                <p>Personal record of payment verification</p>
                <div className="h-8 border-b border-slate-200 mt-3" />
                <span className="block text-[9px] pt-1 text-slate-400">Electronic Reconciliation ID</span>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>This challan is digitally authenticated by the Iqra University Accounts &amp; Bursar Department. Verify at <span className="font-mono text-iqra-blue-600">accounts.isb.iqra.edu.pk</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
