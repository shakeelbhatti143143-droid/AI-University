"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, AuthContextType, UserRole } from "@/types/auth";
import { getConvexClient, isConvexConfigured } from "./convex";
import { api } from "../../convex/_generated/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = "iu_cs_session_token";
const USER_STORAGE_KEY = "iu_cs_session_user";

export const FIXED_ADMIN_ACCOUNT = {
  name: "Shakeel Bhatti",
  email: "shakeelbhatti143143@gmail.com",
  role: "admin" as const,
  department: "Central University Administration & Registrar Office",
};

export const mapRawUserToUser = (raw: any): User => ({
  id: raw.id || raw._id,
  name: raw.name || "User",
  email: raw.email || "",
  personalEmail: raw.personalEmail,
  universityEmail: raw.universityEmail,
  role: raw.role as UserRole,
  accountStatus: raw.accountStatus as any,
  enrollmentId: raw.enrollmentId,
  department: raw.department,
  departmentId: raw.departmentId,
  degreeProgram: raw.degreeProgram,
  degreeProgramId: raw.degreeProgramId,
  currentSemester: raw.currentSemester,
  profilePhoto: raw.profilePhoto,
  designation: raw.designation,
  bio: raw.bio,
  phone: raw.phone,
  officeLocation: raw.officeLocation,
  officeHours: raw.officeHours,
  specialization: raw.specialization,
  qualification: raw.qualification,
  createdAt: raw.createdAt || Date.now(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const updateUserLocally = useCallback((updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!savedToken) return;

      const client = getConvexClient();
      if (client && isConvexConfigured) {
        const freshUser = await client.query(api.auth.getCurrentUser, { token: savedToken });
        if (freshUser) {
          const mapped = mapRawUserToUser(freshUser);
          setUser(mapped);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mapped));
        }
      }
    } catch (e) {
      console.warn("Failed to refresh user:", e);
    }
  }, []);

  // Load session from storage on startup and ensure admin is seeded
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }

        // Initialize admin account in database quietly
        const client = getConvexClient();
        if (client && isConvexConfigured) {
          try {
            await client.mutation(api.auth.ensureAdminAccount, {
              name: FIXED_ADMIN_ACCOUNT.name,
              email: FIXED_ADMIN_ACCOUNT.email,
              password: "adminPassword123!", // Standard default, changed when admin updates
            });
            // Ensure baseline administrative structure and LMS baseline if needed
            await client.mutation(api.academicManagement.seedInitialBaselineStructure, {});
            await client.mutation(api.lms.seedLmsBaselineData, {});
          } catch (err) {
            console.warn("Convex seeding check:", err);
          }

          if (savedToken) {
            const freshUser = await client.query(api.auth.getCurrentUser, { token: savedToken });
            if (freshUser) {
              const mapped = mapRawUserToUser(freshUser);
              setUser(mapped);
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mapped));
            } else if (savedUser) {
              // Token invalid in Convex
              // keep local if offline, or clear if desired
            }
          }
        }
      } catch (err) {
        console.error("Error reading saved session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string; code?: string; user?: User }> => {
    try {
      const client = getConvexClient();

      if (client && isConvexConfigured) {
        const result = await client.mutation(api.auth.login, {
          email,
          password,
        });

        // Handle structured responses (e.g. PASSWORD_SETUP_REQUIRED)
        if (result && "success" in result && (result as any).success === false) {
          return {
            success: false,
            code: (result as any).code,
            error: (result as any).message || "Authentication requirement not met.",
          };
        }

        if (result?.token && result?.user) {
          const authUser = mapRawUserToUser(result.user);

          setToken(result.token);
          setUser(authUser);

          if (rememberMe) {
            localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
          }
          return { success: true, user: authUser };
        }
      }

      return {
        success: false,
        error: "Backend authentication service is unavailable. Please check your connection.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Invalid university credentials. Please try again.",
      };
    }

  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "applicant"
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const client = getConvexClient();

      if (client && isConvexConfigured) {
        const result = await client.mutation(api.auth.register, {
          name,
          email,
          password,
          role: role as any,
        });

        if (result?.token && result?.user) {
          const authUser = mapRawUserToUser(result.user);

          setToken(result.token);
          setUser(authUser);

          localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
          return { success: true, user: authUser };
        }
      }

      return {
        success: false,
        error: "Registration service is currently offline. Please check connection.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Registration failed. Please check your details and retry.",
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const client = getConvexClient();
      if (client && isConvexConfigured && token) {
        try {
          await client.mutation(api.auth.logout, { token });
        } catch (e) {
          console.warn("Convex logout warning:", e);
        }
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: user?.role === "admin" || user?.role === "ADMIN" || user?.role === "super_admin" || user?.role === "SUPER_ADMIN",
        isStudent: user?.role === "student" || user?.role === "STUDENT",
        isFaculty: user?.role === "FACULTY" || user?.role === "faculty" || user?.role === "teacher",
        isApplicant: user?.role === "applicant",
        isConfigured: isConvexConfigured,
        login,
        register,
        logout,
        refreshUser,
        updateUserLocally,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
