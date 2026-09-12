/**
 * Admin session for the admin panel.
 * The password is verified server-side; the returned session token is kept
 * in localStorage and required for every content save.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { adminLogin } from "@/lib/content.functions";

const SESSION_KEY = "portfolio:admin-session";
export const TOKEN_KEY = "portfolio:admin-token";

type Ctx = {
  ready: boolean;
  isAuthed: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setIsAuthed(
        window.localStorage.getItem(SESSION_KEY) === "true" &&
          Boolean(window.localStorage.getItem(TOKEN_KEY)),
      );
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await adminLogin({ data: { username, password } });
      if (!res.ok) return false;
      window.localStorage.setItem(SESSION_KEY, "true");
      window.localStorage.setItem(TOKEN_KEY, res.token);
      setIsAuthed(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(SESSION_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    setIsAuthed(false);
  }, []);

  const value = useMemo(() => ({ ready, isAuthed, login, logout }), [ready, isAuthed, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
