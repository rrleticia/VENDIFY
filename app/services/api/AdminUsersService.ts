// app/services/api/AdminUsersService.ts
import { adminUsers, adminRoleAssignments, type AdminUser } from "@common/mocks_admin";

const wait = (ms:number)=> new Promise(r=>setTimeout(r, ms));

export async function listUsers(): Promise<Array<AdminUser & { roles: Array<"admin"|"editor"|"seller"> }>> {
  await wait(80);
  return adminUsers.map(u=> ({ ...u, roles: adminRoleAssignments[u.id] ?? [] }));
}

export async function addUser(user: { name: string; email: string; roles: Array<"admin"|"editor"|"seller"> }): Promise<AdminUser> {
  await wait(120);
  const id = crypto.randomUUID();
  const u: AdminUser = { id, name: user.name, email: user.email };
  adminUsers.push(u);
  adminRoleAssignments[id] = user.roles;
  return u;
}

export async function setRoles(userId: string, roles: Array<"admin"|"editor"|"seller">): Promise<{ ok: true }> {
  await wait(100);
  adminRoleAssignments[userId] = roles;
  return { ok: true };
}

export async function removeUser(userId: string): Promise<{ ok: true }> {
  await wait(100);
  const idx = adminUsers.findIndex(u=> u.id===userId);
  if (idx >= 0) adminUsers.splice(idx,1);
  delete adminRoleAssignments[userId];
  return { ok: true };
}
