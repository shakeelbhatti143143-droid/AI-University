"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Printer,
  Calendar,
  Building2,
  Check,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialFooter,
  CredentialButton,
  CredentialModal,
} from "@/components/admin/credential";

export interface FeeChallanRecord {
  id: string;
  challanNo: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  department: string;
  degreeProgram: string;
  semester: string;
  issueDate: string;
  dueDate: string;
  breakdown: {
    tuitionFee: number;
    labCharges: number;
    libraryFee: number;
    examinationFee: number;
    scholarshipDiscount: number;
    lateFine: number;
    totalPayable: number;
  };
  status: "Unpaid" | "Paid" | "Overdue" | "Installment";
  paymentMethod?: string;
  transactionReference?: string;
  paidAt?: string;
}

const INITIAL_CHALLANS: FeeChallanRecord[] = [
  {
    id: "fc-1",
    challanNo: "IU-2026-FEE-88219",
    studentId: "st-101",
    studentName: "Hamza Tariq",
    enrollmentId: "IU-2026-CS-0101",
    department: "Department of Computer Science",
    degreeProgram: "BS Computer Science",
    semester: "Fall 2026",
    issueDate: "2026-09-01",
    dueDate: "2026-09-25",
    breakdown: {
      tuitionFee: 110000,
      labCharges: 15000,
      libraryFee: 5000,
      examinationFee: 10000,
      scholarshipDiscount: 20000,
      lateFine: 0,
      totalPayable: 120000,
    },
    status: "Paid",
    paymentMethod: "Kuickpay (1-Link)",
    transactionReference: "KP-9948291038",
    paidAt: "2026-09-12",
  },
  {
    id: "fc-2",
    challanNo: "IU-2026-FEE-88220",
    studentId: "st-102",
    studentName: "Fatima Noor",
    enrollmentId: "IU-2026-AI-0102",
    department: "Department of Artificial Intelligence",
    degreeProgram: "BS Artificial Intelligence",
    semester: "Fall 2026",
    issueDate: "2026-09-01",
    dueDate: "2026-09-25",
    breakdown: {
      tuitionFee: 125000,
      labCharges: 20000,
      libraryFee: 5000,
      examinationFee: 10000,
      scholarshipDiscount: 0,
      lateFine: 0,
      totalPayable: 160000,
    },
    status: "Unpaid",
  },
  {
    id: "fc-3",
    challanNo: "IU-2026-FEE-88221",
    studentId: "st-103",
    studentName: "Bilal Ahmed",
    enrollmentId: "IU-2026-SE-0103",
    department: "Department of Software Engineering",
    degreeProgram: "BS Software Engineering",
    semester: "Fall 2026",
    issueDate: "2026-09-01",
    dueDate: "2026-09-15",
    breakdown: {
      tuitionFee: 115000,
      labCharges: 15000,
      libraryFee: 5000,
      examinationFee: 10000,
      scholarshipDiscount: 15000,
      lateFine: 2500,
      totalPayable: 132500,
    },
    status: "Overdue",
  },
  {
    id: "fc-4",
    challanNo: "IU-2026-FEE-88222",
    studentId: "st-104",
    studentName: "Zainab Shah",
    enrollmentId: "IU-2026-EE-0104",
    department: "Department of Electrical Engineering",
    degreeProgram: "BS Electrical Engineering",
    semester: "Fall 2026",
    issueDate: "2026-09-01",
    dueDate: "2026-09-25",
    breakdown: {
      tuitionFee: 105000,
      labCharges: 25000,
      libraryFee: 5000,
      examinationFee: 10000,
      scholarshipDiscount: 35000,
      lateFine: 0,
      totalPayable: 110000,
    },
    status: "Paid",
    paymentMethod: "Bank Branch (HBL)",
    transactionReference: "HBL-ISB-4819",
    paidAt: "2026-09-08",
  },
];

export const AdminFinanceSection: React.FC = () => {
  const [challans, setChallans] = useState<FeeChallanRecord[]>(INITIAL_CHALLANS);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState<FeeChallanRecord | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Kuickpay");

  // Form states for new challan
  const [formStudentName, setFormStudentName] = useState("");
  const [formEnrollmentId, setFormEnrollmentId] = useState("");
  const [formDepartment, setFormDepartment] = useState("Department of Computer Science");
  const [formDegreeProgram, setFormDegreeProgram] = useState("BS Computer Science");
  const [formTuition, setFormTuition] = useState("110000");
  const [formLab, setFormLab] = useState("15000");
  const [formScholarship, setFormScholarship] = useState("0");

  const filteredChallans = challans.filter((c) => {
    const matchesFilter = statusFilter === "All" || c.status === statusFilter;
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.challanNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.enrollmentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalBilled = challans.reduce((sum, c) => sum + c.breakdown.totalPayable, 0);
  const totalCollected = challans
    .filter((c) => c.status === "Paid")
    .reduce((sum, c) => sum + c.breakdown.totalPayable, 0);
  const totalPending = challans
    .filter((c) => c.status === "Unpaid")
    .reduce((sum, c) => sum + c.breakdown.totalPayable, 0);
  const totalOverdue = challans
    .filter((c) => c.status === "Overdue")
    .reduce((sum, c) => sum + c.breakdown.totalPayable, 0);

  const handleMarkAsPaid = () => {
    if (!selectedChallan) return;
    setChallans((prev) =>
      prev.map((c) =>
        c.id === selectedChallan.id
          ? {
              ...c,
              status: "Paid",
              paymentMethod,
              transactionReference: paymentRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
              paidAt: new Date().toISOString().split("T")[0],
            }
          : c
      )
    );
    setIsPaymentModalOpen(false);
    setSelectedChallan(null);
    setPaymentRef("");
  };

  const handleCreateChallan = (e: React.FormEvent) => {
    e.preventDefault();
    const tuition = Number(formTuition) || 0;
    const lab = Number(formLab) || 0;
    const scholarship = Number(formScholarship) || 0;
    const total = tuition + lab + 5000 + 10000 - scholarship;

    const newRecord: FeeChallanRecord = {
      id: `fc-${Date.now()}`,
      challanNo: `IU-2026-FEE-${Math.floor(10000 + Math.random() * 90000)}`,
      studentId: `st-${Date.now().toString().slice(-4)}`,
      studentName: formStudentName,
      enrollmentId: formEnrollmentId,
      department: formDepartment,
      degreeProgram: formDegreeProgram,
      semester: "Fall 2026",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "2026-10-15",
      breakdown: {
        tuitionFee: tuition,
        labCharges: lab,
        libraryFee: 5000,
        examinationFee: 10000,
        scholarshipDiscount: scholarship,
        lateFine: 0,
        totalPayable: total,
      },
      status: "Unpaid",
    };

    setChallans([newRecord, ...challans]);
    setIsGenerateModalOpen(false);
    setFormStudentName("");
    setFormEnrollmentId("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <CredentialCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#8a8272] flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-[#8a8272]" />
                Institutional Bursar & Financial SIS
              </span>
              <span className="text-xs text-[#4a4335]">•</span>
              <span className="text-xs font-semibold text-[#8a8272]">Accounts Department</span>
            </div>
            <h2 className="text-2xl font-serif font-medium text-[#F2EEE4] tracking-tight">
              Fee Challans, Invoicing & Bursar Ledger
            </h2>
            <p className="text-xs text-[#8a8272] mt-1">
              Semester tuition invoicing, 1-Link bank challan reconciliation, installment scheduling, and scholarship concessions.
            </p>
          </div>

          <CredentialButton
            variant="primary"
            onClick={() => setIsGenerateModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Issue New Fee Challan</span>
          </CredentialButton>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#4a4335]">
          <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]">
            <span className="text-[10px] font-mono uppercase text-[#8a8272] block">Total Billed</span>
            <span className="text-2xl font-serif text-[#F2EEE4] mt-1 block">
              PKR {(totalBilled / 1000).toFixed(0)}k
            </span>
            <span className="text-[10px] text-[#8a8272] mt-0.5 block">{challans.length} active challans</span>
          </div>

          <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]">
            <span className="text-[10px] font-mono uppercase text-[#7DAE7A] block">Collected Revenue</span>
            <span className="text-2xl font-serif text-[#7DAE7A] mt-1 block">
              PKR {(totalCollected / 1000).toFixed(0)}k
            </span>
            <span className="text-[10px] text-[#8a8272] mt-0.5 block">
              {((totalCollected / (totalBilled || 1)) * 100).toFixed(1)}% recovery rate
            </span>
          </div>

          <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]">
            <span className="text-[10px] font-mono uppercase text-[#B8963E] block">Pending Dues</span>
            <span className="text-2xl font-serif text-[#F2EEE4] mt-1 block">
              PKR {(totalPending / 1000).toFixed(0)}k
            </span>
            <span className="text-[10px] text-[#8a8272] mt-0.5 block">Awaiting payment verification</span>
          </div>

          <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335]">
            <span className="text-[10px] font-mono uppercase text-[#E27878] block">Overdue Default</span>
            <span className="text-2xl font-serif text-[#E27878] mt-1 block">
              PKR {(totalOverdue / 1000).toFixed(0)}k
            </span>
            <span className="text-[10px] text-[#8a8272] mt-0.5 block">Late fee fine triggered</span>
          </div>
        </div>
      </CredentialCard>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1D1B18] border border-[#4a4335] rounded-[10px] p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8272]" />
          <input
            type="text"
            placeholder="Search student, challan # or enrollment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#4a4335]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["All", "Paid", "Unpaid", "Overdue"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all shrink-0",
                statusFilter === st
                  ? "bg-[#23201b] text-[#F2EEE4] border border-[#4a4335]"
                  : "text-[#8a8272] hover:text-[#F2EEE4] hover:bg-[#23201b]"
              )}
            >
              {st} ({st === "All" ? challans.length : challans.filter((c) => c.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Challans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChallans.map((c) => (
          <CredentialCard key={c.id}>
            <CredentialHeader
              eyebrow={c.semester}
              referenceId={c.challanNo}
            />

            <CredentialTitle
              title={c.studentName}
              subheading={`${c.enrollmentId} • ${c.degreeProgram}`}
            />

            <div className="space-y-2 my-3 text-xs">
              <div className="flex justify-between text-[#8a8272]">
                <span>Tuition & Examination Fee</span>
                <span className="font-mono text-[#D8D3C6]">
                  PKR {(c.breakdown.tuitionFee + c.breakdown.examinationFee).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#8a8272]">
                <span>Lab & Library Charges</span>
                <span className="font-mono text-[#D8D3C6]">
                  PKR {(c.breakdown.labCharges + c.breakdown.libraryFee).toLocaleString()}
                </span>
              </div>
              {c.breakdown.scholarshipDiscount > 0 && (
                <div className="flex justify-between text-[#7DAE7A]">
                  <span>Merit Scholarship Discount</span>
                  <span className="font-mono">- PKR {c.breakdown.scholarshipDiscount.toLocaleString()}</span>
                </div>
              )}
              {c.breakdown.lateFine > 0 && (
                <div className="flex justify-between text-[#E27878]">
                  <span>Late Submission Surcharge</span>
                  <span className="font-mono">+ PKR {c.breakdown.lateFine.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#4a4335] flex justify-between font-medium">
                <span className="text-[#F2EEE4]">Net Payable Amount</span>
                <span className="font-mono font-bold text-sm text-[#F2EEE4]">
                  PKR {c.breakdown.totalPayable.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#8a8272] flex items-center justify-between pb-3 pt-1 border-t border-[#4a4335]">
              <span>Due: {c.dueDate}</span>
              {c.paidAt && (
                <span className="text-[#7DAE7A] font-mono">
                  Settled: {c.paidAt} ({c.paymentMethod})
                </span>
              )}
            </div>

            <CredentialFooter
              status={{
                label: c.status === "Paid" ? "Paid & Reconciled" : c.status === "Overdue" ? "Overdue Default" : "Awaiting Payment",
                state: c.status === "Paid" ? "success" : c.status === "Overdue" ? "danger" : "neutral",
              }}
              primaryAction={
                c.status !== "Paid"
                  ? {
                      label: "Verify Payment",
                      onClick: () => {
                        setSelectedChallan(c);
                        setIsPaymentModalOpen(true);
                      },
                    }
                  : {
                      label: "Print Challan Copy",
                      onClick: () => window.print(),
                    }
              }
            />
          </CredentialCard>
        ))}
      </div>

      {/* Manual Payment Verification Modal */}
      {isPaymentModalOpen && selectedChallan && (
        <CredentialModal
          isOpen={true}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedChallan(null);
          }}
          title="Bursar Fee Settlement & Verification"
          eyebrow="TRANSACTION RECEIPT"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335] space-y-1">
              <p className="font-serif text-sm font-medium text-[#F2EEE4]">
                {selectedChallan.studentName} ({selectedChallan.enrollmentId})
              </p>
              <p className="text-[11px] font-mono text-[#8a8272]">
                Challan Ref: {selectedChallan.challanNo} • Total: PKR {selectedChallan.breakdown.totalPayable.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-[#8a8272] mb-1 font-medium">Payment Settlement Channel</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] text-xs text-[#F2EEE4] focus:outline-none focus:border-[#4a4335]"
              >
                <option value="Kuickpay (1-Link)">Kuickpay / 1-Link Online Bill</option>
                <option value="Bank Branch (HBL)">Habib Bank Limited (HBL Branch Deposit)</option>
                <option value="Meezan Bank">Meezan Bank Cash Deposit</option>
                <option value="JazzCash / EasyPaisa">JazzCash / EasyPaisa Mobile OTC</option>
                <option value="Debit/Credit Card">Direct Campus POS Card Terminal</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8a8272] mb-1 font-medium">Bank Transaction / Scroll ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. HBL-DEP-948102 or KP-8849102"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] font-mono text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#4a4335]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#4a4335]">
              <CredentialButton
                variant="secondary"
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setSelectedChallan(null);
                }}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="primary"
                onClick={handleMarkAsPaid}
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Confirm & Reconcile Payment
              </CredentialButton>
            </div>
          </div>
        </CredentialModal>
      )}

      {/* Create New Challan Modal */}
      {isGenerateModalOpen && (
        <CredentialModal
          isOpen={true}
          onClose={() => setIsGenerateModalOpen(false)}
          title="Issue Semester Fee Challan"
          eyebrow="ACCOUNTS DEPARTMENT"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateChallan} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8a8272] mb-1 font-medium">Student Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Khan"
                value={formStudentName}
                onChange={(e) => setFormStudentName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#4a4335]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8a8272] mb-1 font-medium">Enrollment ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IU-2026-CS-0105"
                  value={formEnrollmentId}
                  onChange={(e) => setFormEnrollmentId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] font-mono text-xs text-[#F2EEE4] placeholder-[#8a8272] focus:outline-none focus:border-[#4a4335]"
                />
              </div>

              <div>
                <label className="block text-[#8a8272] mb-1 font-medium">Tuition Fee (PKR) *</label>
                <input
                  type="number"
                  required
                  value={formTuition}
                  onChange={(e) => setFormTuition(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] font-mono text-xs text-[#F2EEE4] focus:outline-none focus:border-[#4a4335]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8a8272] mb-1 font-medium">Lab Charges (PKR)</label>
                <input
                  type="number"
                  value={formLab}
                  onChange={(e) => setFormLab(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] font-mono text-xs text-[#F2EEE4] focus:outline-none focus:border-[#4a4335]"
                />
              </div>

              <div>
                <label className="block text-[#8a8272] mb-1 font-medium">Scholarship Concession (PKR)</label>
                <input
                  type="number"
                  value={formScholarship}
                  onChange={(e) => setFormScholarship(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0d0b] border border-[#4a4335] rounded-[6px] font-mono text-xs text-[#F2EEE4] focus:outline-none focus:border-[#4a4335]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#4a4335]">
              <CredentialButton
                variant="secondary"
                onClick={() => setIsGenerateModalOpen(false)}
              >
                Cancel
              </CredentialButton>
              <CredentialButton
                variant="primary"
                onClick={() => {}}
              >
                <Receipt className="w-3.5 h-3.5 mr-1" />
                Generate & Dispatch Challan
              </CredentialButton>
            </div>
          </form>
        </CredentialModal>
      )}
    </div>
  );
};
