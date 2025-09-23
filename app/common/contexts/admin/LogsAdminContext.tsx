import React, { createContext, useContext, useEffect, useCallback, useState, useMemo } from "react";
import { listActivity, listEmailQueue } from "@services/api/AdminLogsService";

type Log = Awaited<ReturnType<typeof listActivity>>[number];
type Mail = Awaited<ReturnType<typeof listEmailQueue>>[number];

type Ctx = {
  loading: boolean;
  logs: Log[];
  emails: Mail[];
  refresh: ()=>Promise<void>;
};

const Ctx = createContext<Ctx>({} as any);

function useValue(){
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [emails, setEmails] = useState<Mail[]>([]);

  const refresh = useCallback(async ()=>{
    setLoading(true);
    try{
      const [l, e] = await Promise.all([listActivity(), listEmailQueue()]);
      setLogs(l); setEmails(e);
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(()=>{ refresh(); }, [refresh]);

  return useMemo(()=>({ loading, logs, emails, refresh }), [loading, logs, emails, refresh]);
}

export function LogsAdminProvider({ children }:{ children: React.ReactNode }){
  const value = useValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLogsAdmin(){
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLogsAdmin deve ser usado dentro de LogsAdminProvider");
  return ctx;
}
