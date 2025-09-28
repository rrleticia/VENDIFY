import { CatalogService, LogsService } from "@app/services";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AdminProduct = {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  category: "roupas" | "bolsas" | "escritorio" | "outros";
  active: boolean;
};

type CatalogContextType = {
  products: AdminProduct[];
  loading: boolean;
  createProduct: (p: Omit<AdminProduct, "id">) => Promise<AdminProduct>;
  updateProduct: (
    id: string,
    patch: Partial<AdminProduct>
  ) => Promise<AdminProduct>;
  deleteProduct: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  const refresh = async () => {
    setLoading(true);
    const data = await CatalogService.list();
    setProducts(data);
    setLoading(false);
  };

  const createProduct: CatalogContextType["createProduct"] = async (p) => {
    const created = await CatalogService.create(p);
    setProducts((prev) => [created, ...prev]);
    LogsService.log({
      action: "create_product",
      entityId: created.id,
      details: { title: created.title },
    });
    return created;
  };

  const updateProduct: CatalogContextType["updateProduct"] = async (
    id,
    patch
  ) => {
    const updated = await CatalogService.update(id, patch);
    setProducts((prev) => prev.map((x) => (x.id === id ? updated : x)));
    LogsService.log({ action: "update_product", entityId: id, details: patch });
    return updated;
  };

  const deleteProduct: CatalogContextType["deleteProduct"] = async (id) => {
    await CatalogService.remove(id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
    LogsService.log({ action: "delete_product", entityId: id });
  };

  const value = useMemo(
    () => ({
      products,
      loading,
      createProduct,
      updateProduct,
      deleteProduct,
      refresh,
    }),
    [products, loading]
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
