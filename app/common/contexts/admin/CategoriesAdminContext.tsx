import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CategoryType } from "@common/types";
import { listCategories, createCategory, updateCategory, deleteCategory } from "@services/api/AdminCategoryService";

type Ctx = {
  loading: boolean;
  categories: CategoryType[];
  refresh: ()=>Promise<void>;
  create: (data: Omit<CategoryType,"id">)=>Promise<CategoryType>;
  update: (id: string, patch: Partial<Omit<CategoryType,"id">>)=>Promise<CategoryType>;
  remove: (id: string)=>Promise<{ok:true}>;
};

const CategoriesAdminContext = createContext<Ctx | null>(null);

export function useCategoriesAdmin() {
  const ctx = useContext(CategoriesAdminContext);
  if (!ctx) throw new Error("useCategoriesAdmin must be used inside provider");
  return ctx;
}

export function CategoriesAdminProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const refresh = useCallback(async ()=>{
    setLoading(true);
    try { setCategories(await listCategories()); }
    finally { setLoading(false); }
  },[]);

  useEffect(()=>{ void refresh(); }, [refresh]);

  const create = useCallback(async (data: Omit<CategoryType,"id">)=>{
    const res = await createCategory(data);
    await refresh();
    return res;
  },[refresh]);

  const update = useCallback(async (id: string, patch: Partial<Omit<CategoryType,"id">>)=>{
    const res = await updateCategory(id, patch);
    await refresh();
    return res;
  },[refresh]);

  const remove = useCallback(async (id: string)=>{
    const res = await deleteCategory(id);
    await refresh();
    return res;
  },[refresh]);

  const value = useMemo<Ctx>(()=>({
    loading, categories, refresh, create, update, remove
  }), [loading, categories, refresh, create, update, remove]);

  return <CategoriesAdminContext.Provider value={value}>{children}</CategoriesAdminContext.Provider>;
}
