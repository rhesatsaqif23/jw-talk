"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "../types";
import {
  clearAccessToken,
  getAccessToken,
  saveAccessToken,
} from "../lib/session";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        if (pathname?.startsWith("/chat")) router.push("/login");
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch (err) {
        clearAccessToken();
        if (pathname?.startsWith("/chat")) router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [pathname, router]);

  const login = async (credentials: any) => {
    const res = await api.post("/auth/login", credentials);
    saveAccessToken(res.data.data.token);
    setUser(res.data.data.user);
    router.push("/chat");
  };

  const register = async (data: any) => {
    await api.post("/auth/register", data);
    router.push("/login");
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
