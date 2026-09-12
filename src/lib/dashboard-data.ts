export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl: string;
  studentId: string;
  enrollmentNo: string;
  program: string;
  degreeLevel: string;
  department: string;
  faculty: string;
  campus: string;
  batch: string;
  currentSemester: string;
  academicSession: string;
  section: string;
  shift: string;
  status: "Active" | "Probation" | "Suspended";
  email: string;
  personalEmail: string;
  phone: string;
  emergencyContact: string;
  cnic: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  advisorName: string;
  advisorEmail: string;
  hecRegistrationNo: string;
  cgpa: number;
  currentGpa: number;
  totalCreditHours: number;
  completedCreditHours: number;
  remainingCreditHours: number;
  academicStanding: string;
}

export interface EnrolledCourse {
  id: string;
  code: string;
  title: string;
  creditHours: number;
  instructor: {
    name: string;
    designation: string;
    email: string;
    office: string;
  };
  section: string;
  progress: number;
  attendancePercentage: number;
  attendedLectures: number;
  totalLectures: number;
  pendingAssignments: number;
  totalAssignments: number;
  currentGrade: string;
  gradeStatus: "Excellent" | "Good" | "Average" | "At Risk";
  schedule: string;
  classroom: string;
  building: string;
  syllabus: string[];
}

export interface AvailableCourse {
  id: string;
  code: string;
  title: string;
  department: string;
  creditHours: number;
  instructor: string;
  prerequisites: string[];
  description: string;
  availableSeats: number;
  totalSeats: number;
  schedule: string;
  classroom: string;
  category: "Core" | "Elective" | "General";
}

export interface ScheduleSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  startTime: string;
  endTime: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  classroom: string;
  building: string;
  type: "Lecture" | "Lab" | "Tutorial";
}

export interface AttendanceRecord {
  id: string;
  date: string;
  courseCode: string;
  courseTitle: string;
  time: string;
  status: "Present" | "Absent" | "Late";
  topic: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  dueDate: string;
  dueTime: string;
  status: "Upcoming" | "Pending" | "Submitted" | "Overdue";
  priority: "High" | "Medium" | "Low";
  totalMarks: number;
  obtainedMarks?: number;
  weightage: string;
  description: string;
  submittedAt?: string;
  fileName?: string;
  rubricNotes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  sender: string;
  category: "Academic" | "Examination" | "Event" | "Administrative";
  content: string;
  isUrgent?: boolean;
}

export interface Examination {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  time: string;
  room: string;
  building: string;
  seatNumber: string;
  invigilator: string;
}

export function getBlankStudentProfile(user?: any): StudentProfile {
  return {
    id: user?.id || "student-profile",
    name: user?.name || "Student",
    avatarUrl: "",
    studentId: user?.enrollmentId || "Pending",
    enrollmentNo: user?.enrollmentId || "Pending",
    program: "BS Computer Science",
    degreeLevel: "Undergraduate",
    department: user?.department || "Computing & Artificial Intelligence",
    faculty: "Faculty of Computing & Information Technology",
    campus: "Chak Shezad Campus, Islamabad",
    batch: "2026",
    currentSemester: "Semester 1",
    academicSession: "Fall 2026",
    section: "A",
    shift: "Morning",
    status: "Active",
    email: user?.universityEmail || user?.email || "",
    personalEmail: user?.personalEmail || "",
    phone: "",
    emergencyContact: "",
    cnic: "",
    dateOfBirth: "",
    bloodGroup: "",
    address: "Islamabad, Pakistan",
    advisorName: "Academic Advisory Office",
    advisorEmail: "advising@isb.iqra.edu.pk",
    hecRegistrationNo: "HEC-Pending",
    cgpa: 0.0,
    currentGpa: 0.0,
    totalCreditHours: 134,
    completedCreditHours: 0,
    remainingCreditHours: 134,
    academicStanding: "Good Standing",
  };
}

export const initialStudentProfile: StudentProfile = getBlankStudentProfile();

// Completely empty collections - NO DUMMY/SAMPLE DATA
export const initialEnrolledCourses: EnrolledCourse[] = [];
export const initialAvailableCourses: AvailableCourse[] = [];
export const initialAssignments: Assignment[] = [];
export const upcomingExaminations: Examination[] = [];
export const recentAnnouncements: Announcement[] = [];
export interface AcademicActivity {
  id: string;
  title: string;
  category: string;
  date: string;
  timestamp: string;
  description: string;
  details?: string;
  status: string;
}

export interface SemesterRecord {
  semesterNumber: number;
  semesterName: string;
  session: string;
  semester?: string | number;
  status?: string;
  gpa: number;
  cgpa: number;
  creditHours: number;
  courses: Array<{
    code: string;
    title: string;
    creditHours: number;
    grade: string;
    gradePoints: number;
  }>;
}

export const semesterHistory: SemesterRecord[] = [];
export const attendanceHistory: any[] = [];
export const weeklySchedule: ScheduleSlot[] = [];
export const recentAcademicActivities: AcademicActivity[] = [];
