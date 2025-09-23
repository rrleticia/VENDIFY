// =================================================
// admin/guards/RoleGuard.tsx
// =================================================
import { useAdminAuth } from "@common/contexts";
import type { ReactNode } from "react";

import { Navigate, useLocation } from "react-router";

export function RoleGuard({
  roles,
  children,
}: {
  roles: Array<"admin" | "editor" | "vendedor">;
  children: ReactNode;
}) {
  const { user } = useAdminAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (!roles.includes(user.role)) return <Navigate to="/403" replace />;
  return <>{children}</>;
}
