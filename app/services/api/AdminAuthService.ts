import type { AdminRole, AdminUser } from "@common/contexts";

export function mockUser(role: AdminRole): AdminUser {
  return { id: "u-1", name: "Admin BUYLY", email: "admin@buyly.io", role };
}

export function getCurrentUser(): AdminUser {
  return mockUser("admin");
}

export async function signInAs(role: AdminRole): Promise<AdminUser> {
  return new Promise((r) => setTimeout(() => r(mockUser(role)), 250));
}

export async function signOut() {
  /* clear tokens if needed */
}
