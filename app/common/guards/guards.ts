// app/pages/admin/guards.ts
import { hasRole } from "@services/api/AdminSecurityService";
import { isAuthenticated } from "@services/api/AdminAuthService";
import { redirect } from "react-router";

export async function requireRole(role: "admin"|"editor"|"seller") {
  if (!isAuthenticated()) {
    throw redirect("/admin/login");
  }
  const ok = await hasRole(role);
  if (!ok) throw redirect("/login?reason=forbidden");
  return null;
}
