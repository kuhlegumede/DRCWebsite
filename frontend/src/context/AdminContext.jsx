import { createContext, useContext, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api";

const AdminContext = createContext(null);
const SESSION_KEY = "drc_admin_session"; // { token, expiresAtUtc }

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.expiresAtUtc) return null;
    if (new Date(parsed.expiresAtUtc) <= new Date()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AdminProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  async function login(password) {
    try {
      const data = await api.login(password);
      const newSession = { token: data.token, expiresAtUtc: data.expiresAtUtc };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      return { success: true };
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { success: false, error: "Incorrect password. Please try again." };
      }
      return { success: false, error: err.message || "Sign-in failed. Please try again." };
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  const isAdmin = Boolean(session);

  return (
    <AdminContext.Provider
      value={{ isAdmin, ready, token: session?.token ?? null, login, logout }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
