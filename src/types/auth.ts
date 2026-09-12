export type UserRole = "applicant" | "student" | "teacher" | "admin" | "staff";

export type AccountStatus = "pending_application" | "pending_password_setup" | "active" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  personalEmail?: string;
  universityEmail?: string;
  role: UserRole;
  accountStatus?: AccountStatus;
  enrollmentId?: string;
  department?: string;
  createdAt: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isApplicant: boolean;
  isConfigured: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; code?: string; user?: User }>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
