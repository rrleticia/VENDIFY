// app/services/api/AdminAuthService.ts
import { saveJSON, loadJSON, STORAGE_KEYS } from "@services/helpers/storage";

type AuthState = { userId: string; email: string; name: string } | null;

const KEY = "buyly.admin.auth";

export function getAuth(): AuthState {
  return loadJSON<AuthState>(KEY, null);
}

export function isAuthenticated(): boolean {
  return !!getAuth();
}

export function login(email: string, password: string): { ok: boolean; message?: string } {
  // Simple fixed credential per requirements
  if (email === "admin@gmail.com" && password === "admin") {
    const state: AuthState = { userId: "u-admin", email, name: "Admin Root" };
    saveJSON(KEY, state);
    return { ok: true };
  }
  return { ok: false, message: "Credenciais inválidas" };
}

export function logout(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
  }
}
