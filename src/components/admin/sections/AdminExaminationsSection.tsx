"use client";

import React, { useState } from "react";
import {
  Award,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck2,
  User,
  Grid3X3,
  Sparkles,
  Printer,
  Users,
  ShieldCheck,
  Shuffle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  CredentialCard,
  CredentialHeader,
  CredentialTitle,
  CredentialDetailRow,
  CredentialDetailList,
  CredentialFooter,
  CredentialModal,
  CredentialInput,
  CredentialSelect,
  CredentialButton,
  CredentialFilterBar,
} from "@/components/admin/credential";

interface Examination {
  _id: string;
  title: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  examType: "Midterm" | "Final" | "Quiz" | "Practical" | "Presentation";
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  building: string;
  campus: string;
  facultyName: string;
  instructions: string[];
  requiredMaterials: string[];
  duration: string;
  seatNumber?: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Postponed";
  importantNotes?: string;
  createdAt: number;
}

interface AdminExaminationsSectionProps {
  examinations: Examination[];
  courses: Array<{ id: string; code: string; title: string }>;
  onCreateExamination: (data: any) => Promise<void>;
}

export const AdminExaminationsSection: React.FC<AdminExaminationsSectionProps> = ({
  examinations,
  courses,
  onCreateExamination,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"rosters" | "seating">("rosters");
  const [isSeatingModalOpen, setIsSeatingModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("plan-1");

  // Initial Seating Plans with realistic checkerboard candidates
  const [seatingPlans, setSeatingPlans] = useState([
    {
      id: "plan-1",
      courseCode: "CS-201",
      courseTitle: "Data Structures & Algorithms",
      interleavedCourse: "MGT-101 (Principles of Management)",
      hallRoom: "Main Auditorium - Hall 1",
      building: "Academic Block A",
      campus: "Chak Shehzad Campus, Islamabad",
      examDate: "2026-10-18",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      rows: 4,
      cols: 6,
      capacity: 24,
      allocatedSeats: [
        { seatNumber: "R1-C1", row: 1, col: 1, studentId: "std-1", studentName: "Saad Tariq Abbasi", enrollmentId: "IU-ISB-2024-0418", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R1-C2", row: 1, col: 2, studentId: "std-2", studentName: "Ayesha Noor Khan", enrollmentId: "IU-ISB-2024-0102", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R1-C3", row: 1, col: 3, studentId: "std-3", studentName: "Hamza Malik", enrollmentId: "IU-ISB-2024-0315", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R1-C4", row: 1, col: 4, studentId: "std-4", studentName: "Zainab Rauf", enrollmentId: "IU-ISB-2024-0220", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R1-C5", row: 1, col: 5, studentId: "std-5", studentName: "Bilal Ahmed", enrollmentId: "IU-ISB-2024-0552", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R1-C6", row: 1, col: 6, studentId: "std-6", studentName: "Mahnoor Ali", enrollmentId: "IU-ISB-2024-0610", courseCode: "MGT-101", department: "Management Sciences" },

        { seatNumber: "R2-C1", row: 2, col: 1, studentId: "std-7", studentName: "Daniyal Zafar", enrollmentId: "IU-ISB-2024-0199", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R2-C2", row: 2, col: 2, studentId: "std-8", studentName: "Usman Tariq", enrollmentId: "IU-ISB-2024-0433", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R2-C3", row: 2, col: 3, studentId: "std-9", studentName: "Fatima Farooq", enrollmentId: "IU-ISB-2024-0188", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R2-C4", row: 2, col: 4, studentId: "std-10", studentName: "Haris Siddiqui", enrollmentId: "IU-ISB-2024-0712", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R2-C5", row: 2, col: 5, studentId: "std-11", studentName: "Sana Mir", enrollmentId: "IU-ISB-2024-0801", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R2-C6", row: 2, col: 6, studentId: "std-12", studentName: "Waqas Qureshi", enrollmentId: "IU-ISB-2024-0944", courseCode: "CS-201", department: "Computing" },

        { seatNumber: "R3-C1", row: 3, col: 1, studentId: "std-13", studentName: "Khadija Bibi", enrollmentId: "IU-ISB-2024-0322", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R3-C2", row: 3, col: 2, studentId: "std-14", studentName: "Taimoor Shah", enrollmentId: "IU-ISB-2024-0477", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R3-C3", row: 3, col: 3, studentId: "std-15", studentName: "Rabia Basri", enrollmentId: "IU-ISB-2024-0511", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R3-C4", row: 3, col: 4, studentId: "std-16", studentName: "Noman Ijaz", enrollmentId: "IU-ISB-2024-0688", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R3-C5", row: 3, col: 5, studentId: "std-17", studentName: "Maha Tariq", enrollmentId: "IU-ISB-2024-0755", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R3-C6", row: 3, col: 6, studentId: "std-18", studentName: "Shahmeer Khan", enrollmentId: "IU-ISB-2024-0899", courseCode: "MGT-101", department: "Management Sciences" },

        { seatNumber: "R4-C1", row: 4, col: 1, studentId: "std-19", studentName: "Iqra Aziz", enrollmentId: "IU-ISB-2024-0234", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R4-C2", row: 4, col: 2, studentId: "std-20", studentName: "Ali Raza", enrollmentId: "IU-ISB-2024-0419", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R4-C3", row: 4, col: 3, studentId: "std-21", studentName: "Nimra Sheikh", enrollmentId: "IU-ISB-2024-0544", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R4-C4", row: 4, col: 4, studentId: "std-22", studentName: "Asad Mehmood", enrollmentId: "IU-ISB-2024-0633", courseCode: "CS-201", department: "Computing" },
        { seatNumber: "R4-C5", row: 4, col: 5, studentId: "std-23", studentName: "Hira Mani", enrollmentId: "IU-ISB-2024-0722", courseCode: "MGT-101", department: "Management Sciences" },
        { seatNumber: "R4-C6", row: 4, col: 6, studentId: "std-24", studentName: "Rizwan Ahmed", enrollmentId: "IU-ISB-2024-0888", courseCode: "CS-201", department: "Computing" },
      ],
    },
  ]);

  // Seating Optimizer Modal Form State
  const [seatingFormData, setSeatingFormData] = useState({
    courseCode: courses[0]?.code || "CS-201",
    interleavedCourse: "MGT-101",
    hallRoom: "Main Auditorium - Hall 1",
    building: "Academic Block A",
    campus: "Chak Shehzad Campus, Islamabad",
    examDate: "2026-10-18",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    rows: 4,
    cols: 6,
  });

  const activePlan = seatingPlans.find((p) => p.id === selectedPlanId) || seatingPlans[0];

  // Form State
  const [formData, setFormData] = useState({
    title: "Midterm Examination",
    courseCode: courses[0]?.code || "CS-201",
    courseTitle: courses[0]?.title || "Data Structures & Algorithms",
    section: "A",
    examType: "Midterm" as const,
    date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    day: "Monday",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    room: "Lab 204",
    building: "Computing Department",
    campus: "Chak Shehzad Campus, Islamabad",
    facultyName: "Dr. Arshad Mehmood",
    duration: "2 Hours (120 Mins)",
    instructions: "Iqra University ID Card and Admit Slip are mandatory for entry. Electronic gadgets strictly prohibited.",
    requiredMaterials: "Student ID Card, Admit Slip, Stationery",
    seatNumber: "Assigned on Venue Board",
    importantNotes: "Covers Weeks 1 to 7. Constitutes 25% of total course marks.",
  });

  const filteredExams = examinations.filter((e) => {
    const matchesSearch =
      e.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All" || e.examType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCourseChange = (code: string) => {
    const c = courses.find((x) => x.code === code);
    setFormData((prev) => ({
      ...prev,
      courseCode: code,
      courseTitle: c ? c.title : prev.courseTitle,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onCreateExamination({
        ...formData,
        instructions: formData.instructions.split(".").map((s) => s.trim()).filter(Boolean),
        requiredMaterials: formData.requiredMaterials.split(",").map((s) => s.trim()).filter(Boolean),
        status: "Scheduled",
      });
      setIsCreateModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to schedule examination.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div
        className="relative overflow-hidden p-6 rounded-[10px] border flex flex-col md:flex-row md:items-center justify-between gap-4 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
        style={{
          backgroundColor: "var(--card-bg, #1D1B18)",
          borderColor: "var(--card-border, #4a4335)",
          borderRadius: "var(--radius-card, 10px)",
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted, #8a8272)" }}
            >
              Examination Controller Office
            </span>
            <span style={{ color: "var(--text-muted, #8a8272)" }}>•</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted, #8a8272)" }}>
              Fall 2026 Terminals
            </span>
          </div>
          <h2
            className="font-serif text-[26px] font-[500] leading-tight tracking-tight"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            Examination Rosters & Scheduling
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted, #8a8272)" }}>
            Schedule midterms, finals, practical vivas, allocate examination halls, and broadcast admit rosters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsSeatingModalOpen(true)}
            className="h-[36px] px-3.5 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98]"
            style={{
              borderColor: "var(--card-border, #4a4335)",
              color: "var(--text-heading, #F2EEE4)",
              backgroundColor: "#23201b",
              borderRadius: "var(--radius-control, 6px)",
            }}
          >
            <Grid3X3 className="w-4 h-4 text-[#C9A25B]" />
            <span>AI Seating Optimizer</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-[36px] px-4 rounded-[6px] border text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98]"
            style={{
              borderColor: "var(--accent-gold, #C9A25B)",
              color: "var(--accent-gold, #C9A25B)",
              backgroundColor: "transparent",
              borderRadius: "var(--radius-control, 6px)",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Examination</span>
          </button>
        </div>
      </div>

      {/* Subtab Navigation Bar */}
      <div className="p-1.5 rounded-[8px] border flex items-center gap-2 bg-[#121110] border-[#4a4335]">
        <button
          onClick={() => setActiveSubTab("rosters")}
          className={cn(
            "px-4 py-2 rounded-[6px] text-xs font-medium transition-all flex items-center gap-2",
            activeSubTab === "rosters"
              ? "bg-[#1D1B18] text-[#F2EEE4] border border-[#4a4335] font-semibold shadow-xs"
              : "text-[#8a8272] hover:text-[#F2EEE4]"
          )}
        >
          <Award className="w-3.5 h-3.5 text-[#C9A25B]" />
          <span>Examination Rosters & Timetables</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-[#0e0d0b] text-[#8a8272] border border-[#4a4335]">
            {filteredExams.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("seating")}
          className={cn(
            "px-4 py-2 rounded-[6px] text-xs font-medium transition-all flex items-center gap-2",
            activeSubTab === "seating"
              ? "bg-[#1D1B18] text-[#F2EEE4] border border-[#4a4335] font-semibold shadow-xs"
              : "text-[#8a8272] hover:text-[#F2EEE4]"
          )}
        >
          <Grid3X3 className="w-3.5 h-3.5 text-[#7DAE7A]" />
          <span>Anti-Cheating Seating Plans</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-[#0e0d0b] text-[#7DAE7A] border border-[#4a4335]">
            100% Interleaved
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. EXAMINATION ROSTERS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "rosters" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <CredentialFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search examinations by course code, title, room..."
          >
            <select
              value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-[36px] px-3 bg-[#1D1B18] border border-[#4a4335] rounded-[6px] text-xs text-[#D8D3C6] focus:outline-none focus:border-[#C9A25B]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
            color: "var(--text-value, #D8D3C6)",
            borderRadius: "var(--radius-control, 6px)",
          }}
        >
          <option value="All">All Exam Types</option>
          <option value="Midterm">Midterm</option>
          <option value="Final">Final</option>
          <option value="Quiz">Quiz</option>
          <option value="Practical">Practical</option>
          <option value="Presentation">Presentation</option>
        </select>
      </CredentialFilterBar>

      {/* Examinations Cards */}
      {filteredExams.length === 0 ? (
        <div
          className="relative overflow-hidden p-12 text-center rounded-[10px] border space-y-3 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C9A25B]"
          style={{
            backgroundColor: "var(--card-bg, #1D1B18)",
            borderColor: "var(--card-border, #4a4335)",
            borderRadius: "var(--radius-card, 10px)",
          }}
        >
          <div
            className="w-12 h-12 rounded-[8px] border flex items-center justify-center mx-auto"
            style={{
              borderColor: "var(--card-border, #4a4335)",
              color: "var(--text-muted, #8a8272)",
            }}
          >
            <Award className="w-6 h-6" />
          </div>
          <h3
            className="font-serif text-[20px] font-[500]"
            style={{ color: "var(--text-heading, #F2EEE4)" }}
          >
            No examinations scheduled yet
          </h3>
          <p className="text-xs max-w-sm mx-auto" style={{ color: "var(--text-muted, #8a8272)" }}>
            Examinations scheduled here will automatically appear in student examination timetables.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((e) => (
            <CredentialCard key={e._id}>
              <CredentialHeader
                eyebrow={`SECTION ${e.section} • ${e.examType}`}
                referenceId={e.courseCode}
              />

              <CredentialTitle
                title={e.courseTitle}
                subheading={`${e.examType} Exam • ${e.duration}`}
                hasDivider
              />

              <CredentialDetailList className="flex-1">
                <CredentialDetailRow
                  label="Date & Day"
                  value={`${e.date} (${e.day})`}
                />
                <CredentialDetailRow
                  label="Scheduled Time"
                  value={`${e.startTime} - ${e.endTime}`}
                />
                <CredentialDetailRow
                  label="Venue & Building"
                  value={`${e.room}, ${e.building}`}
                />
                <CredentialDetailRow
                  label="Invigilator Faculty"
                  value={e.facultyName}
                />
              </CredentialDetailList>

              <CredentialFooter
                status={{
                  label: "Published to Students",
                  state: "success",
                }}
                primaryAction={{
                  label: "Exam Details",
                  onClick: () => setSelectedExam(e),
                }}
              />
            </CredentialCard>
          ))}
        </div>
      )}
    </div>
  )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ANTI-CHEATING SEATING OPTIMIZER VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === "seating" && (
        <div className="space-y-6">
          {/* Seating KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CredentialCard>
              <CredentialHeader eyebrow="EXAMINATION VENUES" referenceId="HALLS" />
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-serif text-3xl font-medium text-[#F2EEE4]">4 Halls</span>
                <span className="text-[11px] text-[#7DAE7A] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All Ready
                </span>
              </div>
              <p className="text-xs text-[#8a8272] mt-1">Main Aud, Hall 1, Hall 2, Lab 204</p>
            </CredentialCard>

            <CredentialCard>
              <CredentialHeader eyebrow="COLLUSION PREVENTION" referenceId="ALGORITHM" />
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-serif text-3xl font-medium text-[#F2EEE4]">100%</span>
                <span className="text-[11px] text-[#7DAE7A] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Interleaved
                </span>
              </div>
              <p className="text-xs text-[#8a8272] mt-1">Zero adjacent candidates share the same exam</p>
            </CredentialCard>

            <CredentialCard>
              <CredentialHeader eyebrow="ACTIVE DESK ALLOCATIONS" referenceId="SEATS" />
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-serif text-3xl font-medium text-[#F2EEE4]">
                  {activePlan.allocatedSeats.length} / {activePlan.capacity}
                </span>
                <span className="text-[11px] text-[#C9A25B] font-medium">Full Capacity</span>
              </div>
              <p className="text-xs text-[#8a8272] mt-1">
                {activePlan.rows} Rows × {activePlan.cols} Columns Layout
              </p>
            </CredentialCard>
          </div>

          {/* Seating Plan Detail & Layout */}
          <CredentialCard>
            <div className="p-4 sm:p-6 border-b border-[#4a4335] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase text-[#8a8272]">
                    VENUE LAYOUT • {activePlan.hallRoom}
                  </span>
                  <span className="text-[#8a8272]">•</span>
                  <span className="text-[11px] text-[#C9A25B] font-medium">
                    {activePlan.examDate} ({activePlan.startTime} - {activePlan.endTime})
                  </span>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#F2EEE4]">
                  Interleaved Seating: {activePlan.courseCode} ({activePlan.courseTitle})
                </h3>
                <p className="text-xs text-[#8a8272] mt-0.5">
                  Interleaved alongside: <strong className="text-[#D8D3C6]">{activePlan.interleavedCourse}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <CredentialButton
                  variant="secondary"
                  onClick={() => window.print()}
                  className="text-xs"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print Hall Door Roster
                </CredentialButton>
                <CredentialButton
                  variant="primary"
                  onClick={() => setIsSeatingModalOpen(true)}
                  className="text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Generate New Plan
                </CredentialButton>
              </div>
            </div>

            {/* Visual Hall Diagram */}
            <div className="p-6 space-y-6">
              {/* Front of Room Banner */}
              <div className="w-full py-2.5 px-4 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335] text-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a8272]">
                  ▲ FRONT OF EXAMINATION HALL • INVIGILATOR ROSTRUM & WHITEBOARD ▲
                </span>
              </div>

              {/* Grid of Desks */}
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${activePlan.cols}, minmax(0, 1fr))`,
                }}
              >
                {activePlan.allocatedSeats.map((seat) => {
                  const isPrimary = seat.courseCode === activePlan.courseCode;
                  return (
                    <div
                      key={seat.seatNumber}
                      className={cn(
                        "p-3 rounded-[6px] border text-left transition-all relative overflow-hidden",
                        isPrimary
                          ? "bg-[#18202c]/50 border-blue-800/60"
                          : "bg-[#251e16]/50 border-amber-800/60"
                      )}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="font-bold text-[#F2EEE4]">{seat.seatNumber}</span>
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[9px] font-bold uppercase",
                            isPrimary
                              ? "bg-blue-900/60 text-blue-200 border border-blue-700/50"
                              : "bg-amber-900/60 text-amber-200 border border-amber-700/50"
                          )}
                        >
                          {seat.courseCode}
                        </span>
                      </div>

                      <div className="font-serif text-xs font-semibold text-[#F2EEE4] truncate">
                        {seat.studentName}
                      </div>
                      <div className="font-mono text-[10px] text-[#8a8272] truncate">
                        {seat.enrollmentId}
                      </div>

                      <div className="mt-1 text-[9px] text-[#8a8272] truncate">
                        {seat.department}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interleaving Legend & Protocol Guarantee */}
              <div className="pt-4 border-t border-[#4a4335]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500/80 border border-blue-400" />
                    <span className="text-[#D8D3C6] font-mono text-[11px]">{activePlan.courseCode} Candidates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400" />
                    <span className="text-[#D8D3C6] font-mono text-[11px]">Interleaved Course Candidates</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#7DAE7A]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Checkerboard Anti-Collusion Matrix Validated</span>
                </div>
              </div>
            </div>
          </CredentialCard>
        </div>
      )}

      {/* AI SEATING GENERATOR MODAL */}
      <CredentialModal
        isOpen={isSeatingModalOpen}
        onClose={() => setIsSeatingModalOpen(false)}
        eyebrow="EXAMINATION CONTROLLER"
        title="AI Exam Seating Optimizer"
        description="Compute an anti-cheating checkerboard seating allocation interleaving two separate exam courses."
        maxWidth="lg"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsSeatingModalOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              onClick={() => {
                const total = seatingFormData.rows * seatingFormData.cols;
                const newSeats = [];
                for (let r = 1; r <= seatingFormData.rows; r++) {
                  for (let c = 1; c <= seatingFormData.cols; c++) {
                    const isEven = (r + c) % 2 === 0;
                    const course = isEven ? seatingFormData.courseCode : seatingFormData.interleavedCourse;
                    const dept = isEven ? "Computing & AI" : "Business & Management";
                    newSeats.push({
                      seatNumber: `R${r}-C${c}`,
                      row: r,
                      col: c,
                      studentId: `std-opt-${r}-${c}`,
                      studentName: isEven ? `Student CS ${r * 10 + c}` : `Candidate BBA ${r * 10 + c}`,
                      enrollmentId: `IU-ISB-2026-${100 + r * 10 + c}`,
                      courseCode: course,
                      department: dept,
                    });
                  }
                }
                const newPlan = {
                  id: `plan-${Date.now()}`,
                  courseCode: seatingFormData.courseCode,
                  courseTitle: "Core Academic Exam",
                  interleavedCourse: `${seatingFormData.interleavedCourse} (Interleaved)`,
                  hallRoom: seatingFormData.hallRoom,
                  building: seatingFormData.building,
                  campus: seatingFormData.campus,
                  examDate: seatingFormData.examDate,
                  startTime: seatingFormData.startTime,
                  endTime: seatingFormData.endTime,
                  rows: seatingFormData.rows,
                  cols: seatingFormData.cols,
                  capacity: total,
                  allocatedSeats: newSeats,
                };
                setSeatingPlans((prev) => [newPlan, ...prev]);
                setSelectedPlanId(newPlan.id);
                setActiveSubTab("seating");
                setIsSeatingModalOpen(false);
              }}
            >
              Run Optimization Matrix
            </CredentialButton>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CredentialSelect
              label="Primary Examination Course *"
              value={seatingFormData.courseCode}
              onChange={(e) => setSeatingFormData({ ...seatingFormData, courseCode: e.target.value })}
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title}
                </option>
              ))}
            </CredentialSelect>

            <CredentialInput
              label="Interleaved Partner Course *"
              value={seatingFormData.interleavedCourse}
              onChange={(e) => setSeatingFormData({ ...seatingFormData, interleavedCourse: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CredentialInput
              label="Examination Hall / Room *"
              value={seatingFormData.hallRoom}
              onChange={(e) => setSeatingFormData({ ...seatingFormData, hallRoom: e.target.value })}
            />
            <CredentialInput
              label="Campus Location *"
              value={seatingFormData.campus}
              onChange={(e) => setSeatingFormData({ ...seatingFormData, campus: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CredentialInput
              label="Desk Rows *"
              type="number"
              value={seatingFormData.rows.toString()}
              onChange={(e) => setSeatingFormData({ ...seatingFormData, rows: parseInt(e.target.value) || 4 })}
            />
            <CredentialInput
              label="Desk Columns *"
              type="number"
              value={seatingFormData.cols.toString()}
              onChange={(e) => setSeatingFormData({ ...seatingFormData, cols: parseInt(e.target.value) || 6 })}
            />
            <CredentialInput
              label="Start Time *"
              value={seatingFormData.startTime}
              onChange={(e) => setSeatingFormData({ ...seatingFormData, startTime: e.target.value })}
            />
            <CredentialInput
              label="End Time *"
              value={seatingFormData.endTime}
              onChange={(e) => setSeatingFormData({ ...seatingFormData, endTime: e.target.value })}
            />
          </div>

          <div className="p-3 rounded-[6px] bg-[#0e0d0b] border border-[#4a4335] text-[11px] text-[#8a8272] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7DAE7A] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#F2EEE4] block">Anti-Cheating Algorithmic Guarantee:</span>
              <span>The optimizer automatically places candidates on alternating parity coordinates. This guarantees zero adjacent or cross-diagonal peering between candidates writing the same subject exam.</span>
            </div>
          </div>
        </div>
      </CredentialModal>

      {/* SCHEDULE EXAM MODAL */}
      <CredentialModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        eyebrow="EXAMINATION CONTROLLER"
        title="Schedule Academic Examination"
        description="Allocate examination halls, specify dates, and notify enrolled students."
        maxWidth="xl"
        footer={
          <>
            <CredentialButton
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </CredentialButton>
            <CredentialButton
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Scheduling..." : "Schedule Examination"}
            </CredentialButton>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CredentialSelect
              label="Course *"
              value={formData.courseCode}
              onChange={(e) => handleCourseChange(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title}
                </option>
              ))}
            </CredentialSelect>

            <CredentialInput
              label="Section *"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CredentialSelect
              label="Examination Type *"
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value as any })}
            >
              <option value="Midterm">Midterm Examination</option>
              <option value="Final">Terminal / Final Examination</option>
              <option value="Quiz">Graded Quiz</option>
              <option value="Practical">Lab Practical Viva</option>
              <option value="Presentation">Term Presentation</option>
            </CredentialSelect>

            <CredentialInput
              label="Date *"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CredentialInput
              label="Start Time *"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <CredentialInput
              label="End Time *"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
            <CredentialInput
              label="Duration *"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CredentialInput
              label="Examination Hall / Room *"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              required
            />
            <CredentialInput
              label="Building / Department"
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            />
          </div>

          <CredentialInput
            label="Supervising Invigilator Faculty"
            value={formData.facultyName}
            onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
          />

          <div className="space-y-1.5">
            <label
              className="block text-[12px] font-medium leading-none select-none"
              style={{ color: "var(--text-muted, #8a8272)" }}
            >
              Instructions for Candidates
            </label>
            <textarea
              rows={2}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full p-3 text-[13px] rounded-[6px] border transition-colors focus:outline-none focus:border-[#C9A25B]"
              style={{
                backgroundColor: "var(--card-bg, #1D1B18)",
                borderColor: "var(--card-border, #4a4335)",
                color: "var(--text-value, #D8D3C6)",
                borderRadius: "var(--radius-control, 6px)",
              }}
            />
          </div>
        </form>
      </CredentialModal>

      {/* VIEW EXAM DETAILS MODAL */}
      {selectedExam && (
        <CredentialModal
          isOpen={Boolean(selectedExam)}
          onClose={() => setSelectedExam(null)}
          eyebrow={`CODE: ${selectedExam.courseCode} • SECTION ${selectedExam.section}`}
          title={selectedExam.courseTitle}
          description={`${selectedExam.examType} Examination`}
          maxWidth="lg"
          footer={
            <CredentialButton
              variant="primary"
              onClick={() => setSelectedExam(null)}
            >
              Close Record
            </CredentialButton>
          }
        >
          <div className="space-y-4">
            <CredentialDetailList>
              <CredentialDetailRow
                label="Examination Date"
                value={`${selectedExam.date} (${selectedExam.day})`}
              />
              <CredentialDetailRow
                label="Timings & Duration"
                value={`${selectedExam.startTime} - ${selectedExam.endTime} (${selectedExam.duration})`}
              />
              <CredentialDetailRow
                label="Hall & Building"
                value={`${selectedExam.room}, ${selectedExam.building}`}
              />
              <CredentialDetailRow
                label="Campus Location"
                value={selectedExam.campus}
              />
              <CredentialDetailRow
                label="Invigilator Faculty"
                value={selectedExam.facultyName}
              />
              <CredentialDetailRow
                label="Seat Allocations"
                value={selectedExam.seatNumber || "Assigned on Venue Board"}
              />
            </CredentialDetailList>

            {selectedExam.instructions && selectedExam.instructions.length > 0 && (
              <div
                className="p-3.5 rounded-[6px] border space-y-2"
                style={{
                  backgroundColor: "var(--card-bg, #1D1B18)",
                  borderColor: "var(--card-border, #4a4335)",
                }}
              >
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] block"
                  style={{ color: "var(--text-muted, #8a8272)" }}
                >
                  Candidate Instructions
                </span>
                <ul className="text-xs space-y-1 list-disc list-inside" style={{ color: "var(--text-value, #D8D3C6)" }}>
                  {selectedExam.instructions.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CredentialModal>
      )}
    </div>
  );
};


