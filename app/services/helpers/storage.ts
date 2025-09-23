// app/services/helpers/storage.ts
export const STORAGE_KEYS = {
  products: "buyly.products",
  orders: "buyly.orders",
  adminUsers: "buyly.adminUsers",
  roles: "buyly.adminRoles",
  logs: "buyly.logs",
  emails: "buyly.emailQueue",
} as const;

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
