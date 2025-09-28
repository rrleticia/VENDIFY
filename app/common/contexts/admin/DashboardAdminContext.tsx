import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { summary } from "@services/api/AdminDashboardService";

type Summary = Awaited<ReturnType<typeof summary>>;

type Ctx = {
  loading: boolean;
  data: Summary | null;
  refresh: ()=>Promise<void>;
};

const Ctx = createContext<Ctx>({} as any);

function useValue(){
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Summary|null>(null);

  const refresh = useCallback(async ()=>{
    setLoading(true);
    try{
      setData(await summary());
    } finally { setLoading(false); }
  }, []);

  useEffect(()=>{ refresh(); }, [refresh]);

  return useMemo(()=>({ loading, data, refresh }), [loading, data, refresh]);
}

export function DashboardAdminProvider({ children }:{ children: React.ReactNode }){
  const value = useValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboardAdmin(){
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDashboardAdmin deve ser usado dentro de DashboardAdminProvider");
  return ctx;
}
