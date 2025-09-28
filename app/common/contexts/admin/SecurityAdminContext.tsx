import React, { createContext, useContext, useMemo } from "react";
import type { AdminRole } from "@services/api/AdminSecurityService";
import { currentUserId, getRoles, hasRole } from "@services/api/AdminSecurityService";

type Ctx = {
  userId: string;
  roles: AdminRole[];
  can: (r: AdminRole)=> boolean;
};

const Ctx = createContext<Ctx>({} as any);

export function SecurityAdminProvider({ children }:{ children: React.ReactNode }){
  const userId = currentUserId();
  const [roles, setRoles] = React.useState<AdminRole[]>([]);
  React.useEffect(()=>{
    getRoles().then(setRoles).catch(()=> setRoles([]));
  },[]);
  const can = (r: AdminRole)=> roles.includes(r);
  const value = useMemo(()=>({ userId, roles, can }), [userId, roles]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSecurityAdmin(){
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSecurityAdmin deve ser usado dentro de SecurityAdminProvider");
  return ctx;
}
