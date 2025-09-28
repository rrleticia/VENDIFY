import { AdminAuthService } from "@app/services";
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AdminRole = "admin" | "editor" | "vendedor";
export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
} | null;

type AdminAuthContextType = {
  user: AdminUser;
  signInAs: (role: AdminRole) => Promise<void>;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser>(
    AdminAuthService.getCurrentUser()
  );

  const value = useMemo(
    () => ({
      user,
      signInAs: async (role: AdminRole) => {
        const u = await AdminAuthService.signInAs(role);
        setUser(u);
      },
      signOut: () => {
        AdminAuthService.signOut();
        setUser(null);
      },
    }),
    [user]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
