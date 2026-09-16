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
  // Dynamic Academic Progression Fields
  gradePoints?: number;
  status?: string;
  resultStatus?: string;
  curriculumProgress?: string;
  isCompleted?: boolean;
  isPassed?: boolean;
  isFailed?: boolean;
  marks?: number;
  percentage?: number;
  semester?: number;
  publishedAt?: number;
}

export interface ProgressionCourseItem {
  code: string;
  title: string;
  creditHours: number;
  grade: string;
  gradePoints: number;
  marks?: number;
  percentage?: number;
  status: "Passed" | "Failed" | "In Progress";
  resultStatus: "Published" | "Pending";
  isPassed: boolean;
  isFailed: boolean;
}

export interface SemesterProgressionItem {
  semesterNumber: number;
  semesterLabel: string;
  status: "Passed" | "In Progress" | "Failed Courses" | "Available" | "Locked";
  statusLabel: string;
  isPassed: boolean;
  isUnlocked: boolean;
  gpa: number;
  creditHours: number;
  passedCreditHours: number;
  totalCoursesCount: number;
  completedCoursesCount: number;
  failedCoursesCount: number;
  pendingCoursesCount: number;
  courses: ProgressionCourseItem[];
  unlockMessage?: string;
}

export interface StudentProgressionData {
  studentId: string;
  name: string;
  email: string;
  department: string;
  degreeProgram: string;
  currentSemester: number;
  highestPassedSemester: number;
  nextEligibleSemester: number;
  isGraduated: boolean;
  cgpa: number;
  currentGpa: number;
  completedCreditHours: number;
  remainingCreditHours: number;
  totalDegreeCredits: number;
  degreeProgress: number;
  academicStanding: string;
  totalPassedCoursesCount: number;
  totalFailedCoursesCount: number;
  failedCoursesList: Array<{
    code: string;
    title: string;
    semester: number;
    grade: string;
    gradePoints: number;
    percentage: number;
    remarks: string;
  }>;
  congratulationsNotification?: {
    title: string;
    message: string;
    targetSemester: number;
    ctaText: string;
  } | null;
  semesters: SemesterProgressionItem[];
}

export interface AvailableCourse {
  id: string;
  code: string;
  title: string;
  department: string;
  departmentId?: string;
  program?: string;
  programId?: string;
  degreeProgramId?: string;
  creditHours: number;
  semester?: number;
  instructor: string;
  instructorDesignation?: string;
  prerequisites: string[];
  description: string;
  availableSeats: number;
  totalSeats: number;
  schedule: string;
  classroom: string;
  category: "Core" | "Elective" | "General";
  registrationStatus?: "None" | "Pending" | "Approved" | "Rejected" | "Dropped";
  registrationId?: string;
  registrationRemarks?: string;
  registeredAt?: number;
  isEnrolled?: boolean;
  isPending?: boolean;
  isRejected?: boolean;
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
  courseId?: string;
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
  teacher?: string;
  facultyName?: string;
  createdAt?: number;
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

export type ExamType = "Midterm" | "Final" | "Quiz" | "Practical" | "Presentation";
export type ExamStatus = "Upcoming" | "Completed" | "In Progress" | "Cancelled";

export interface Examination {
  id: string;
  courseCode: string;
  courseTitle: string;
  examType: ExamType;
  date: string; // YYYY-MM-DD
  day: string; // e.g. "Tuesday"
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "12:00 PM"
  time: string; // "10:00 AM – 12:00 PM"
  room: string;
  roomNumber: string;
  building: string;
  campus: string;
  instructor: string;
  seatNumber?: string;
  invigilator?: string;
  status: ExamStatus;
  instructions: string[];
  requiredMaterials: string[];
  duration: string;
  importantNotes: string;
}

export interface MarksBreakdown {
  assignments: { obtained: number; total: number; weightage: number };
  quizzes: { obtained: number; total: number; weightage: number };
  midterm: { obtained: number; total: number; weightage: number };
  final: { obtained: number; total: number; weightage: number };
  attendance: { obtained: number; total: number; weightage: number };
}

export interface CourseResult {
  code: string;
  title: string;
  creditHours: number;
  marks: number;
  percentage: number;
  grade: string;
  gradePoints: number;
  status: "Passed" | "Failed" | "In Progress";
  breakdown: MarksBreakdown;
  instructor?: string;
}

export interface SemesterResultRecord {
  semesterNumber: number;
  semesterName: string;
  session: string;
  gpa: number;
  cgpa: number;
  creditHours: number;
  totalMarks: number;
  averagePercentage: number;
  coursesCompleted: number;
  coursesFailed: number;
  academicStanding: string;
  courses: CourseResult[];
}

export type SemesterRecord = SemesterResultRecord;

export type StudyTaskType =
  | "Read Topic"
  | "Watch Learning Material"
  | "Practice Problems"
  | "Review Notes"
  | "Take Quiz"
  | "Revise Weak Areas"
  | "Mock Examination";

export interface StudyTask {
  id: string;
  planId: string;
  dayNumber: number;
  dayLabel: string;
  title: string;
  topic: string;
  taskType: StudyTaskType;
  durationMinutes: number;
  completed: boolean;
  notes?: string;
  scheduledDate: string;
}

export interface StudyPlan {
  id: string;
  courseCode: string;
  courseTitle: string;
  examDate: string;
  availableHoursPerDay: number;
  preferredDurationMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  topics: string[];
  createdAt: string;
  totalHours: number;
  tasks: StudyTask[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface AcademicActivity {
  id: string;
  title: string;
  timestamp: string;
  details: string;
  type?: string;
}

export function getBlankStudentProfile(user?: any): StudentProfile {
  return {
    id: user?.id || "student-profile",
    name: user?.name || "Student",
    avatarUrl: "",
    studentId: user?.enrollmentId || "Pending",
    enrollmentNo: user?.enrollmentId || "Pending",
    program: "Bachelor of Science in Computer Science (BSCS)",
    degreeLevel: "Undergraduate",
    department: user?.department || "Department of Computing & Artificial Intelligence",
    faculty: "Faculty of Computing & Information Technology",
    campus: "Chak Shehzad Campus, Islamabad",
    batch: "Fall 2024",
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
    bloodGroup: "N/A",
    address: "Islamabad, Pakistan",
    advisorName: "Department Chair",
    advisorEmail: "advisor@isb.iqra.edu.pk",
    hecRegistrationNo: "HEC-IU-Pending",
    cgpa: 0.0,
    currentGpa: 0.0,
    totalCreditHours: 134,
    completedCreditHours: 0,
    remainingCreditHours: 134,
    academicStanding: "Enrolled",
  };
}

export const initialStudentProfile: StudentProfile = getBlankStudentProfile();

// Clean database-backed initial arrays — ZERO HARDCODED DUMMY DATA
export const initialEnrolledCourses: EnrolledCourse[] = [];
export const initialAvailableCourses: AvailableCourse[] = [];
export const initialAssignments: Assignment[] = [];
export const upcomingExaminations: Examination[] = [];
export const recentAnnouncements: Announcement[] = [];
export const semesterHistory: SemesterRecord[] = [];
export const semesterResultsData: SemesterResultRecord[] = [];
export const initialStudyPlans: StudyPlan[] = [];
export const attendanceHistory: any[] = [];
export const weeklySchedule: ScheduleSlot[] = [];
export const recentAcademicActivities: AcademicActivity[] = [];

