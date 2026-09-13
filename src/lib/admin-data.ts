export interface AdminStudent {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  department: string;
  campus: string;
  batch: string;
  semester: string;
  semesterNumber: number;
  status: "Active" | "Probation" | "Suspended";
  cgpa: number;
  currentGpa: number;
  completedCreditHours: number;
  totalCreditHours: number;
  remainingCreditHours: number;
  academicStanding: string;
  attendancePercentage: number;
  warningsCount: number;
  enrolledCourseCodes: string[];
  enrollmentDate: string;
  emergencyContact: string;
  cnic: string;
}

export interface AdminCourse {
  id: string;
  code: string;
  title: string;
  department: string;
  departmentId?: string;
  program?: string;
  programId?: string;
  degreeProgramId?: string;
  creditHours: number;
  semester: number;
  instructor: string;
  instructorId?: string;
  instructorEmail: string;
  enrolledCount: number;
  capacity: number;
  status: "Active" | "Inactive";
  schedule: string;
  classroom: string;
  building: string;
  attendanceRate: number;
  assignmentCount: number;
  prerequisites: string[];
  description: string;
}

export interface RegistrationPeriod {
  id: string;
  session: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  maxCreditHours: number;
  allowOverload: boolean;
}

export interface RegistrationRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  department?: string;
  program?: string;
  semester?: number;
  cgpa?: number;
  courseId?: string;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  section?: string;
  type?: "Add" | "Drop";
  reason?: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt?: string;
  requestedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
  adminRemarks?: string;
}

export interface AdminScheduleSlot {
  id: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  startTime: string;
  endTime: string;
  classroom: string;
  building: string;
  section: string;
  semester?: string | number;
  type: "Lecture" | "Lab" | "Tutorial";
}

export interface AdminAttendanceLog {
  id: string;
  date: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  classroom?: string;
  timeSlot?: string;
  totalEnrolled?: number;
  totalStudents?: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount?: number;
  percentage?: number;
  topicsCovered?: string;
  topic?: string;
  section?: string;
  isLocked?: boolean;
  markedBy?: string;
}

export interface AdminAssignment {
  id: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  dueDate: string;
  dueTime: string;
  issueDate?: string;
  submissionType?: string;
  instructions?: string;
  totalSubmissions?: number;
  submissionsCount?: number;
  totalEnrolled?: number;
  isPublished?: boolean;
  gradedSubmissions?: number;
  pendingSubmissions?: number;
  totalMarks: number;
  status?: "Active" | "Closed" | "Draft";
  weightage: string;
}

export interface AdminSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseCode?: string;
  submittedAt: string;
  status: "Graded" | "Pending" | "Late";
  obtainedMarks?: number;
  marksAwarded?: number;
  maxMarks?: number;
  totalMarks: number;
  fileName: string;
  feedback?: string;
  instructorFeedback?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  actionType: "create" | "update" | "delete" | "status_change" | "approve" | "reject";
  module: string;
  details: string;
}

export const initialRegistrationPeriod: RegistrationPeriod = {
  id: "reg-fall-2026",
  session: "Fall 2026",
  startDate: "2026-09-01",
  endDate: "2026-09-30",
  isOpen: true,
  maxCreditHours: 18,
  allowOverload: false,
};

// Clean real empty states - NO DUMMY DATA
export const initialAdminStudents: AdminStudent[] = [];
export const initialAdminCourses: AdminCourse[] = [];
export const initialRegistrationRequests: RegistrationRequest[] = [];
export const initialAdminSchedule: AdminScheduleSlot[] = [];
export const initialAdminAttendanceLogs: AdminAttendanceLog[] = [];
export const initialAdminAssignments: AdminAssignment[] = [];
export const initialAdminSubmissions: AdminSubmission[] = [];
export const initialAuditLogs: AuditLog[] = [];

/**
 * Schedule Conflict Detector
 */
export function detectScheduleConflict(
  existingSlots: AdminScheduleSlot[],
  candidate: AdminScheduleSlot,
  ignoreId?: string
): { hasConflict: boolean; message?: string; type?: "instructor" | "classroom" | "time" } {
  const parseTimeToMinutes = (timeStr: string): number => {
    const parts = timeStr.trim().split(" ");
    if (parts.length < 2) return 0;
    const [hours, minutes] = parts[0].split(":").map(Number);
    const isPM = parts[1].toUpperCase() === "PM";
    let h = hours;
    if (isPM && h !== 12) h += 12;
    if (!isPM && h === 12) h = 0;
    return h * 60 + minutes;
  };

  const candStart = parseTimeToMinutes(candidate.startTime);
  const candEnd = parseTimeToMinutes(candidate.endTime);

  for (const slot of existingSlots) {
    if (ignoreId && slot.id === ignoreId) continue;
    if (slot.day !== candidate.day) continue;

    const slotStart = parseTimeToMinutes(slot.startTime);
    const slotEnd = parseTimeToMinutes(slot.endTime);

    const isOverlapping = candStart < slotEnd && candEnd > slotStart;

    if (isOverlapping) {
      if (
        slot.classroom.toLowerCase().trim() === candidate.classroom.toLowerCase().trim() &&
        slot.building.toLowerCase().trim() === candidate.building.toLowerCase().trim()
      ) {
        return {
          hasConflict: true,
          type: "classroom",
          message: `Classroom Conflict: "${candidate.classroom}" is already reserved for "${slot.courseCode} (${slot.courseTitle})" on ${candidate.day} at ${slot.startTime} - ${slot.endTime}.`,
        };
      }

      if (slot.instructor.toLowerCase().trim() === candidate.instructor.toLowerCase().trim()) {
        return {
          hasConflict: true,
          type: "instructor",
          message: `Instructor Conflict: "${candidate.instructor}" is already scheduled to teach "${slot.courseCode}" in "${slot.classroom}" on ${candidate.day} at ${slot.startTime} - ${slot.endTime}.`,
        };
      }
    }
  }

  return { hasConflict: false };
}

export const detectScheduleConflicts = detectScheduleConflict;
