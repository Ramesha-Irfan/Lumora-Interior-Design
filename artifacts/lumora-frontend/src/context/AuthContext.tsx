import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { setToken, clearToken, getToken, apiPost, apiPut, apiGet } from "@/services/api";

export interface User {
  name: string;
  username: string;
  email: string;
  plan: "Free" | "Pro" | "Premium";
  avatarInitials: string;
  avatarColor: string;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ ok: boolean; pending?: boolean; error?: string }>;
  verifyOtp: (email: string, code: string) => Promise<{ ok: boolean; error?: string }>;
  resendOtp: (email: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => Promise<void>;
}

interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    apiGet<User>("/auth/me")
      .then((u) => setUser(u))
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const signup = useCallback(
    async (data: SignupData): Promise<{ ok: boolean; pending?: boolean; error?: string }> => {
      try {
        await apiPost<{ pending: boolean }>("/auth/register", data);
        return { ok: true, pending: true };
      } catch (err) {
        return { ok: false, error: (err as Error).message };
      }
    },
    [],
  );

  const verifyOtp = useCallback(
    async (email: string, code: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await apiPost<AuthResponse>("/auth/verify-otp", { email, code });
        setToken(res.token);
        setUser(res.user);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: (err as Error).message };
      }
    },
    [],
  );

  const resendOtp = useCallback(
    async (email: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        await apiPost<{ ok: boolean }>("/auth/resend-otp", { email });
        return { ok: true };
      } catch (err) {
        return { ok: false, error: (err as Error).message };
      }
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await apiPost<AuthResponse>("/auth/login", { email, password });
        setToken(res.token);
        setUser(res.user);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: (err as Error).message };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (partial: Partial<User>): Promise<void> => {
    const updated = await apiPut<User>("/auth/me", partial);
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, signup, verifyOtp, resendOtp, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
