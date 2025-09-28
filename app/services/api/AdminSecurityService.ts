// app/services/api/AdminSecurityService.ts
import { adminRoleAssignments } from "@common/mocks_admin";
import { getAuth } from "@services/api/AdminAuthService";

export type AdminRole = "admin" | "editor" | "seller";

export function currentUserId(): string {
  const a = getAuth();
  return a?.userId ?? "guest";
}

export async function getRoles(userId?: string): Promise<AdminRole[]> {
  const id = userId ?? currentUserId();
  return adminRoleAssignments[id] ?? [];
}

export async function hasRole(role: AdminRole): Promise<boolean> {
  const roles = await getRoles();
  return roles.includes(role);
}
