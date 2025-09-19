// services/fetchWithAuth.ts
import { getToken } from "./tokenManager";

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const token = getToken();

  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers,
  });
}
