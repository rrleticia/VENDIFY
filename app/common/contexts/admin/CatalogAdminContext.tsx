import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import type { ProductType } from "@common/types";
import { listProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from "@services/api/AdminCatalogService";

type Ctx = {
  loading: boolean;
  products: ProductType[];
  refresh: ()=>Promise<void>;
  create: (p: ProductType)=>Promise<ProductType>;
  update: (id: ProductType["id"], patch: Partial<ProductType>)=>Promise<ProductType>;
  remove: (id: ProductType["id"])=>Promise<{ok:true}>;
  upload: (id: ProductType["id"], f: File)=>Promise<string>;
};

const Ctx = createContext<Ctx>({} as any);

function useValue(){
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);

  const refresh = useCallback(async ()=>{
    setLoading(true);
    try{
      setProducts(await listProducts());
    } finally {
      setLoading(false);
    }
  },[]);

  const create = useCallback(async (p: ProductType)=>{
    const res = await createProduct(p);
    setProducts(prev=> [...prev, res]);
    return res;
  },[]);

  const update = useCallback(async (id: ProductType["id"], patch: Partial<ProductType>)=>{
    const res = await updateProduct(id, patch);
    setProducts(prev=> prev.map(x=> String(x.id)===String(id)? res : x));
    return res;
  },[]);

  const remove = useCallback(async (id: ProductType["id"])=>{
    const res = await deleteProduct(id);
    setProducts(prev=> prev.filter(x=> String(x.id)!==String(id)));
    return res;
  },[]);

  const upload = useCallback(async (id: ProductType["id"], f: File)=>{
    return uploadProductImage(id, f);
  },[]);

  useEffect(()=>{ refresh(); }, [refresh]);

  return useMemo(()=>({ loading, products, refresh, create, update, remove, upload }), [loading, products, refresh, create, update, remove, upload]);
}

export function CatalogAdminProvider({ children }:{ children: React.ReactNode }){
  const value = useValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalogAdmin(){
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCatalogAdmin deve ser usado dentro de CatalogAdminProvider");
  return ctx;
}
