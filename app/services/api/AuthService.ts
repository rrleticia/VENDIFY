// src/services/api/AuthService.ts
export async function signIn(_email: string, _password: string) {
  // mock simples
  return { ok: true, token: "mock-token" };
}
export async function signOut() {
  return { ok: true };
}
export async function me() {
  return { name: "Letícia Andrade", email: "leticia@example.com" };
}
