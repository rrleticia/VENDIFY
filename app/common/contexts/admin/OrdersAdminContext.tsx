import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import type { OrderType } from "@common/types";
import { overview, listAll, setStatus } from "@services/api/AdminOrdersService";

type Summary = Awaited<ReturnType<typeof overview>>;

type Ctx = {
  loading: boolean;
  summary: Summary | null;
  orders: OrderType[];
  refresh: ()=>Promise<void>;
  updateStatus: (id: string, status: OrderType["status"])=>Promise<void>;
};

const Ctx = createContext<Ctx>({} as any);

function useValue(){
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary|null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);

  const refresh = useCallback(async ()=>{
    setLoading(true);
    try{
      const [s, all] = await Promise.all([overview(), listAll()]);
      setSummary(s); setOrders(all);
    } finally{
      setLoading(false);
    }
  },[]);

  const updateStatus = useCallback(async (id:string, status: OrderType["status"])=>{
    await setStatus(id, status);
    await refresh();
  },[refresh]);

  useEffect(()=>{ refresh(); }, [refresh]);

  return useMemo(()=>({ loading, summary, orders, refresh, updateStatus }), [loading, summary, orders, refresh, updateStatus]);
}

export function OrdersAdminProvider({ children }:{ children: React.ReactNode }){
  const value = useValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrdersAdmin(){
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOrdersAdmin deve ser usado dentro de OrdersAdminProvider");
  return ctx;
}
