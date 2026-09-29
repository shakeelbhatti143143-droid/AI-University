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
  bio?: string;
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

// ============================================================================
// CAMPUS LIFE & RESOURCES TYPES AND DATA
// ============================================================================

export interface LearningResource {
  id: string;
  title: string;
  category: "Research Paper" | "Digital Book" | "AI & Data" | "Cheat Sheet" | "Development Tool" | "HEC Repository";
  description: string;
  link: string;
  fileType: string;
  fileSize?: string;
  tags: string[];
  department?: string;
  author?: string;
  publisher?: string;
  downloadsCount: number;
  featured?: boolean;
}

export interface CourseMaterialItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  weekNumber: number;
  topicTitle: string;
  title: string;
  description: string;
  materialType: "Lecture Slides" | "Reading Notes" | "Lab Manual" | "Source Code" | "Reference Material";
  fileUrl: string;
  fileType: "PDF" | "PPTX" | "ZIP" | "DOCX";
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: "Hackathon" | "Seminar" | "Workshop" | "Sports" | "Cultural" | "Career Fair";
  description: string;
  date: string;
  time: string;
  venue: string;
  campus: string;
  organizer: string;
  capacity: number;
  registeredCount: number;
  bannerGradient: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  registrationDeadline: string;
  isRegistered?: boolean;
  tags: string[];
}

export interface CareerOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  roleType: "Internship" | "Full-Time" | "Part-Time" | "Contract";
  workModel: "On-Site" | "Hybrid" | "Remote";
  location: string;
  stipendSalary: string;
  department: string;
  description: string;
  requirements: string[];
  skills: string[];
  deadline: string;
  applyUrl?: string;
  contactEmail?: string;
  applicantsCount: number;
  status: "Active" | "Closed";
  postedDate: string;
  featured?: boolean;
}

export const initialLearningResources: LearningResource[] = [
  {
    id: "res-1",
    title: "IEEE Xplore Digital Library & ACM Digital Computing Archive",
    category: "HEC Repository",
    description: "Official campus proxy access to over 5 million peer-reviewed journal articles, conference proceedings, and IEEE standards.",
    link: "https://ieeexplore.ieee.org",
    fileType: "WEB",
    tags: ["IEEE", "ACM", "Research", "Journals"],
    department: "Department of Computing & Artificial Intelligence",
    publisher: "Higher Education Commission Pakistan",
    downloadsCount: 1420,
    featured: true,
  },
  {
    id: "res-2",
    title: "Deep Learning with PyTorch: Foundations & Neural Architecture",
    category: "Digital Book",
    description: "Comprehensive university e-book detailing tensor operations, convolutional neural networks, and Transformer architectures.",
    link: "https://pytorch.org/tutorials/",
    fileType: "PDF",
    fileSize: "18.4 MB",
    tags: ["Deep Learning", "PyTorch", "AI", "Transformers"],
    department: "Department of Computing & Artificial Intelligence",
    author: "Dr. Eli Stevens & Luca Antiga",
    publisher: "Manning Publications",
    downloadsCount: 890,
    featured: true,
  },
  {
    id: "res-3",
    title: "Data Structures & Algorithms in C++ / Python Master Cheatsheet",
    category: "Cheat Sheet",
    description: "Quick-reference asymptotic complexity tables, pointer manipulation guides, and balanced binary search tree traversal routines.",
    link: "#",
    fileType: "PDF",
    fileSize: "3.2 MB",
    tags: ["DSA", "Big-O", "Algorithms", "Cheat Sheet"],
    downloadsCount: 2310,
    featured: false,
  },
  {
    id: "res-4",
    title: "Attention Is All You Need — Original Transformer Paper",
    category: "Research Paper",
    description: "Vaswani et al. landmark publication outlining the multi-head self-attention mechanism powering modern LLMs.",
    link: "https://arxiv.org/abs/1706.03762",
    fileType: "PDF",
    fileSize: "1.2 MB",
    tags: ["NLP", "Transformers", "Research", "arXiv"],
    author: "Vaswani, Shazeer, Parmar, et al.",
    publisher: "Cornell arXiv",
    downloadsCount: 1650,
  },
  {
    id: "res-5",
    title: "Distributed Systems & Cloud Computing Lab Setup Toolkit",
    category: "Development Tool",
    description: "Docker Compose configurations, Kubernetes local cluster templates, and Linux shell scripts for systems programming labs.",
    link: "#",
    fileType: "ZIP",
    fileSize: "45 MB",
    tags: ["Docker", "Kubernetes", "Cloud", "DevOps"],
    downloadsCount: 640,
  },
  {
    id: "res-6",
    title: "Modern Database Management & SQL Optimization Handbook",
    category: "Digital Book",
    description: "Principles of B-Tree indexing, ACID transaction isolation, query execution plans, and normalization best practices.",
    link: "#",
    fileType: "PDF",
    fileSize: "12.8 MB",
    tags: ["Databases", "SQL", "PostgreSQL", "Convex"],
    downloadsCount: 775,
  },
];

export const initialCourseMaterials: CourseMaterialItem[] = [
  {
    id: "mat-1",
    courseCode: "CS301",
    courseTitle: "Artificial Intelligence",
    weekNumber: 1,
    topicTitle: "Intelligent Agents & Problem Formulation",
    title: "Lecture 01: Introduction to AI & Rational Agents",
    description: "Overview of PEAS descriptors, environment types, state space representation, and search problem modeling.",
    materialType: "Lecture Slides",
    fileUrl: "#",
    fileType: "PPTX",
    fileSize: "4.8 MB",
    uploadedBy: "Dr. Farooq Tariq",
    uploadDate: "Sep 02, 2026",
  },
  {
    id: "mat-2",
    courseCode: "CS301",
    courseTitle: "Artificial Intelligence",
    weekNumber: 2,
    topicTitle: "Uninformed & Heuristic Search Strategies",
    title: "Lecture 02: A* Search, BFS, DFS & Admissible Heuristics",
    description: "Mathematical proof of A* optimality with consistent heuristics, tree search vs graph search algorithms.",
    materialType: "Lecture Slides",
    fileUrl: "#",
    fileType: "PPTX",
    fileSize: "6.1 MB",
    uploadedBy: "Dr. Farooq Tariq",
    uploadDate: "Sep 09, 2026",
  },
  {
    id: "mat-3",
    courseCode: "CS301",
    courseTitle: "Artificial Intelligence",
    weekNumber: 2,
    topicTitle: "Lab 02: Pathfinding in Grid Worlds",
    title: "Lab Manual 02: Python Implementation of A* Search",
    description: "Hands-on Jupyter notebook implementing PriorityQueue, Manhattan distance heuristic, and 8-puzzle solver.",
    materialType: "Lab Manual",
    fileUrl: "#",
    fileType: "ZIP",
    fileSize: "1.8 MB",
    uploadedBy: "Engr. Hamza Malik",
    uploadDate: "Sep 11, 2026",
  },
  {
    id: "mat-4",
    courseCode: "CS301",
    courseTitle: "Artificial Intelligence",
    weekNumber: 3,
    topicTitle: "Adversarial Search & Game Playing",
    title: "Lecture 03: Minimax Algorithm & Alpha-Beta Pruning",
    description: "Game trees, terminal states, utility functions, cutoff evaluations, and optimal pruning bounds.",
    materialType: "Reading Notes",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: "Dr. Farooq Tariq",
    uploadDate: "Sep 16, 2026",
  },
  {
    id: "mat-5",
    courseCode: "CS204",
    courseTitle: "Data Structures & Algorithms",
    weekNumber: 1,
    topicTitle: "Algorithmic Complexity & Abstract Data Types",
    title: "Lecture 01: Asymptotic Notations & Recurrence Relations",
    description: "Master theorem derivations, Big-O, Big-Omega, Big-Theta, space-time trade-off analysis.",
    materialType: "Lecture Slides",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "3.5 MB",
    uploadedBy: "Dr. Saima Nawaz",
    uploadDate: "Sep 03, 2026",
  },
  {
    id: "mat-6",
    courseCode: "CS204",
    courseTitle: "Data Structures & Algorithms",
    weekNumber: 2,
    topicTitle: "Dynamic Linear Data Structures",
    title: "Lab Manual 01: Singly and Doubly Linked Lists in C++",
    description: "Node pointers, dynamic memory allocation with malloc/new, memory leaks prevention with Valgrind.",
    materialType: "Lab Manual",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "1.5 MB",
    uploadedBy: "Engr. Bilal Qureshi",
    uploadDate: "Sep 10, 2026",
  },
  {
    id: "mat-7",
    courseCode: "SE302",
    courseTitle: "Software Engineering & Architecture",
    weekNumber: 1,
    topicTitle: "Agile Methodologies & Requirements Engineering",
    title: "Lecture 01: SCRUM Lifecycles & User Story Mapping",
    description: "Sprint planning, product backlogs, epic decomposition, acceptance criteria formulation.",
    materialType: "Lecture Slides",
    fileUrl: "#",
    fileType: "PPTX",
    fileSize: "5.2 MB",
    uploadedBy: "Prof. Asad Ullah",
    uploadDate: "Sep 04, 2026",
  },
];

export const initialCampusEvents: CampusEvent[] = [
  {
    id: "evt-1",
    title: "Annual AI University Hackathon 2026: GenAI & Robotics",
    category: "Hackathon",
    description: "36-hour non-stop flagship hackathon tackling real-world healthcare, sustainable energy, and automated agents. Cash prizes of PKR 500,000 and direct internship interviews with industry sponsors.",
    date: "2026-10-15",
    time: "09:00 AM - Next Day 09:00 PM",
    venue: "Main Auditorium & Computing Complex",
    campus: "Chak Shehzad Campus, Islamabad",
    organizer: "ACM Student Chapter & Faculty of Computing",
    capacity: 250,
    registeredCount: 184,
    bannerGradient: "from-blue-600 via-indigo-600 to-purple-700",
    status: "Upcoming",
    registrationDeadline: "2026-10-10",
    tags: ["Hackathon", "AI", "PKR 500k Prize", "ACM"],
  },
  {
    id: "evt-2",
    title: "Industry Keynote: Scaling Large Language Models in Production",
    category: "Seminar",
    description: "Distinguished guest lecture by Principal AI Engineer at Silicon Valley AI Labs on low-latency inference, model quantization, and distributed GPU serving.",
    date: "2026-09-28",
    time: "02:00 PM - 04:30 PM",
    venue: "Executive Seminar Hall B-Block",
    campus: "Chak Shehzad Campus, Islamabad",
    organizer: "Department of Artificial Intelligence",
    capacity: 120,
    registeredCount: 95,
    bannerGradient: "from-emerald-600 via-teal-600 to-cyan-700",
    status: "Upcoming",
    registrationDeadline: "2026-09-26",
    tags: ["Keynote", "LLMs", "Silicon Valley", "GPU"],
  },
  {
    id: "evt-3",
    title: "Hands-on Workshop: Cloud-Native Microservices with Docker & Convex",
    category: "Workshop",
    description: "Interactive technical bootcamp covering real-time backend reactivity, containerized deployment, CI/CD pipelines, and secure API gateways.",
    date: "2026-10-04",
    time: "11:00 AM - 03:00 PM",
    venue: "Software Engineering Lab 04",
    campus: "Chak Shehzad Campus, Islamabad",
    organizer: "Google Developer Student Club (GDSC)",
    capacity: 60,
    registeredCount: 48,
    bannerGradient: "from-amber-500 via-orange-600 to-red-600",
    status: "Upcoming",
    registrationDeadline: "2026-10-02",
    tags: ["Workshop", "Docker", "Convex", "GDSC"],
  },
  {
    id: "evt-4",
    title: "Inter-Department Cricket Championship & Sports Gala 2026",
    category: "Sports",
    description: "Annual sports tournament featuring T20 cricket, badminton, table tennis, and chess championships with faculty and student teams.",
    date: "2026-10-22",
    time: "08:30 AM - 05:00 PM",
    venue: "University Sports Arena & Cricket Grounds",
    campus: "Chak Shehzad Campus, Islamabad",
    organizer: "Directorate of Sports & Student Affairs",
    capacity: 500,
    registeredCount: 310,
    bannerGradient: "from-emerald-700 to-green-900",
    status: "Upcoming",
    registrationDeadline: "2026-10-18",
    tags: ["Sports", "Cricket", "Trophy", "Campus Spirit"],
  },
  {
    id: "evt-5",
    title: "Fall Career & Placement Expo: 45+ Tech Companies On Campus",
    category: "Career Fair",
    description: "Meet talent scouts, technical recruiters, and engineering managers from top national and multinational IT companies, fintechs, and software houses.",
    date: "2026-11-05",
    time: "10:00 AM - 05:00 PM",
    venue: "Central Courtyard & Exhibition Hall",
    campus: "Chak Shehzad Campus, Islamabad",
    organizer: "Office of Career Placement & Corporate Linkages",
    capacity: 800,
    registeredCount: 420,
    bannerGradient: "from-violet-600 via-purple-700 to-pink-700",
    status: "Upcoming",
    registrationDeadline: "2026-11-01",
    tags: ["Career Fair", "Jobs", "Interviews", "Networking"],
  },
];

export const initialCareerOpportunities: CareerOpportunity[] = [
  {
    id: "job-1",
    title: "Junior Full-Stack AI Engineer (Next.js & Python)",
    company: "Devsinc Global Technologies",
    roleType: "Full-Time",
    workModel: "Hybrid",
    location: "Islamabad, Pakistan",
    stipendSalary: "PKR 110,000 - 150,000 / month",
    department: "Computer Science / Software Engineering",
    description: "Devsinc is hiring driven fresh graduates and final-year students for building enterprise AI dashboards, Next.js web applications, and scalable vector retrieval pipelines.",
    requirements: [
      "Proficiency in TypeScript, React / Next.js, and Tailwind CSS",
      "Solid understanding of RESTful APIs and asynchronous state handling",
      "Familiarity with Python (FastAPI/Flask) and LangChain or OpenAI/Gemini SDKs",
      "Minimum CGPA 3.0 or strong project portfolio",
    ],
    skills: ["TypeScript", "Next.js", "Python", "Docker", "Tailwind CSS"],
    deadline: "2026-10-20",
    applyUrl: "https://careers.devsinc.com",
    contactEmail: "talent@devsinc.com",
    applicantsCount: 38,
    status: "Active",
    postedDate: "Sep 12, 2026",
    featured: true,
  },
  {
    id: "job-2",
    title: "Machine Learning Research Intern (Computer Vision)",
    company: "National Center of Artificial Intelligence (NCAI)",
    roleType: "Internship",
    workModel: "On-Site",
    location: "NUST H-12 / Chak Shehzad Labs, Islamabad",
    stipendSalary: "PKR 45,000 / month stipend",
    department: "Artificial Intelligence & Data Science",
    description: "Paid 3-month research internship focusing on autonomous drone surveillance, edge YOLO model optimization, and synthetic dataset generation.",
    requirements: [
      "Currently enrolled in 5th-8th semester of BS CS / BS AI / BS SE",
      "Strong mathematical foundations in Linear Algebra, Probability & Calculus",
      "Hands-on experience with PyTorch or TensorFlow",
      "Publication ambition and curiosity for scientific research",
    ],
    skills: ["PyTorch", "OpenCV", "Python", "Computer Vision", "YOLO"],
    deadline: "2026-10-08",
    applyUrl: "https://ncai.gov.pk/careers",
    contactEmail: "internships@ncai.gov.pk",
    applicantsCount: 62,
    status: "Active",
    postedDate: "Sep 10, 2026",
    featured: true,
  },
  {
    id: "job-3",
    title: "Frontend Developer Intern (React 19 & Modern Web)",
    company: "Afiniti Technologies",
    roleType: "Internship",
    workModel: "Hybrid",
    location: "Islamabad, Pakistan",
    stipendSalary: "PKR 50,000 / month stipend",
    department: "Software Engineering",
    description: "Join our UI/UX and Frontend engineering squad crafting responsive customer intelligence dashboards with ultra-clean modern design systems.",
    requirements: [
      "Deep understanding of modern JavaScript (ES6+), HTML5, and CSS3",
      "Working knowledge of React hooks, state management, and component architecture",
      "Attention to detail regarding responsive layouts and cross-browser quirks",
    ],
    skills: ["React", "JavaScript", "CSS Grid/Flexbox", "Git", "Figma"],
    deadline: "2026-10-15",
    applyUrl: "https://afiniti.com/careers",
    applicantsCount: 44,
    status: "Active",
    postedDate: "Sep 14, 2026",
  },
  {
    id: "job-4",
    title: "Associate DevOps & Cloud Infrastructure Engineer",
    company: "10Pearls Pakistan",
    roleType: "Full-Time",
    workModel: "Remote",
    location: "Islamabad / Remote Nationwide",
    stipendSalary: "PKR 120,000 - 160,000 / month",
    department: "Computer Science / Information Technology",
    description: "Opportunity for talented graduates to manage AWS and Azure Kubernetes workloads, automate Terraform infrastructure as code, and establish robust CI/CD pipelines.",
    requirements: [
      "Familiarity with Linux systems administration and Bash scripting",
      "Basic understanding of Docker containers and Kubernetes primitives",
      "Knowledge of Git workflows and GitHub Actions",
    ],
    skills: ["Linux", "Docker", "AWS", "CI/CD", "Kubernetes"],
    deadline: "2026-10-25",
    applyUrl: "https://10pearls.com/careers",
    applicantsCount: 29,
    status: "Active",
    postedDate: "Sep 08, 2026",
  },
  {
    id: "job-5",
    title: "Data Analyst & Business Intelligence Intern",
    company: "Jazz (Veon Telecom)",
    roleType: "Internship",
    workModel: "On-Site",
    location: "Jazz HQ, F-8 Markaz, Islamabad",
    stipendSalary: "PKR 40,000 / month stipend",
    department: "Data Science / Computing / Business Analytics",
    description: "Analyze customer telemetry data, write complex SQL aggregations, and build PowerBI dashboards for executive decision support.",
    requirements: [
      "Strong SQL skills (joins, window functions, aggregations)",
      "Experience with Power BI or Tableau",
      "Intermediate Python data manipulation (Pandas, NumPy)",
    ],
    skills: ["SQL", "Power BI", "Pandas", "Excel", "Data Modeling"],
    deadline: "2026-10-18",
    applyUrl: "https://jazz.com.pk/careers",
    applicantsCount: 51,
    status: "Active",
    postedDate: "Sep 15, 2026",
  },
];

