// services/tokenManager.ts

const KEY_ACCESS_TOKEN = "APP_ACCESS_TOKEN";

export function getToken(): string | null {
  return localStorage.getItem(KEY_ACCESS_TOKEN);
}

export function setToken(token: string): void {
  localStorage.setItem(KEY_ACCESS_TOKEN, token);
}

export function clearToken(): void {
  localStorage.removeItem(KEY_ACCESS_TOKEN);
}
