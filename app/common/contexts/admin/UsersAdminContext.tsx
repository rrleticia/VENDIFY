import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { listUsers, addUser, setRoles, removeUser } from "@services/api/AdminUsersService";

type User = Awaited<ReturnType<typeof listUsers>>[number];
type Role = "admin"|"editor"|"seller";

type Ctx = {
  loading: boolean;
  users: User[];
  refresh: ()=>Promise<void>;
  create: (u: { name:string; email:string; roles: Role[] })=>Promise<void>;
  updateRoles: (id: string, roles: Role[])=>Promise<void>;
  remove: (id: string)=>Promise<void>;
};

const Ctx = createContext<Ctx>({} as any);

function useValue(){
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const refresh = useCallback(async ()=>{
    setLoading(true);
    try{
      setUsers(await listUsers());
    } finally { setLoading(false); }
  },[]);

  const create = useCallback(async (u: { name:string; email:string; roles: Role[] })=>{
    await addUser(u);
    await refresh();
  },[refresh]);

  const updateRoles = useCallback(async (id: string, roles: Role[])=>{
    await setRoles(id, roles);
    await refresh();
  },[refresh]);

  const remove = useCallback(async (id: string)=>{
    await removeUser(id);
    await refresh();
  },[refresh]);

  useEffect(()=>{ refresh(); }, [refresh]);

  return useMemo(()=>({ loading, users, refresh, create, updateRoles, remove }), [loading, users, refresh, create, updateRoles, remove]);
}

export function UsersAdminProvider({ children }:{ children: React.ReactNode }){
  const value = useValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUsersAdmin(){
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUsersAdmin deve ser usado dentro de UsersAdminProvider");
  return ctx;
}
