import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../lib/axios";
import type { AuthUser, LoginPayload } from "../types";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the session on mount (page refresh / first load).
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get<AuthUser>("/user");
        if (!cancelled) setUser(data);
      } catch {
        // Invalid/expired token — treat as logged out.
        if (!cancelled) {
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginPayload) => {
    const { data } = await api.post("/login", credentials);

    const token: string | undefined = data?.token;
    if (!token) {
      throw new Error("Login response did not include a token.");
    }

    localStorage.setItem("auth_token", token);

    try {
      // Prefer the user returned by /login; fall back to /user.
      if (data?.user) {
        setUser(data.user as AuthUser);
      } else {
        const { data: userData } = await api.get<AuthUser>("/user");
        setUser(userData);
      }
    } catch (error) {
      // Don't leave a token behind if we can't resolve the user.
      localStorage.removeItem("auth_token");
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // If your API exposes POST /logout, it will be called here.
      // If it returns 404, we ignore it — the token is cleared regardless.
      await api.post("/logout");
    } catch {
      // Ignore — logging out client-side is what matters.
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}