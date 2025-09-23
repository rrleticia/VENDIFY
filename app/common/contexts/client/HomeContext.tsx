// src/contexts/HomeContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProductType } from "@common/types";
import {
  getHomeCollections,
  type HomeCollections,
} from "@services/api/HomeService";
import { useCart } from "@common/contexts"; // itens do carrinho, subtotal
import { useClientOrders } from "@common/contexts"; // lista de pedidos (para último pedido)
import { useProfile } from "@common/contexts"; // nome do usuário

type HomeState = {
  loading: boolean;
  banners: HomeCollections["banners"];
  featured: ProductType[];
  deals: ProductType[];
  bestRated: ProductType[];
  categories: string[];

  // Compostos de outros contextos:
  greetingName?: string;
  cartCount: number;
  cartSubtotal: number;
  lastOrderId?: string;
  lastOrderTotal?: number;
};

interface HomeCtx {
  state: HomeState;
  refresh: () => Promise<void>;
}

const HomeContext = createContext<HomeCtx | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HomeState>({
    loading: true,
    banners: [],
    featured: [],
    deals: [],
    bestRated: [],
    categories: [],
    greetingName: undefined,
    cartCount: 0,
    cartSubtotal: 0,
    lastOrderId: undefined,
    lastOrderTotal: undefined,
  });

  // Consome o que já existe nos outros contextos
  const { itemsCount, subtotal } = useCart(); // já exposto pelo CartContext :contentReference[oaicite:4]{index=4}
  const { orders } = useClientOrders(); // já exposto pelo OrdersContext :contentReference[oaicite:5]{index=5}
  const { store } = useProfile(); // já exposto pelo ProfileContext :contentReference[oaicite:6]{index=6}

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const home = await getHomeCollections();
      // último pedido por data
      const last = [...orders].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      )[0];

      setState({
        loading: false,
        ...home,
        greetingName: store?.user?.name,
        cartCount: itemsCount,
        cartSubtotal: subtotal,
        lastOrderId: last?.id,
        lastOrderTotal: last?.total,
      });
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, [orders, store?.user?.name, itemsCount, subtotal]);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo<HomeCtx>(
    () => ({ state, refresh: load }),
    [state, load]
  );
  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHome() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHome deve ser usado dentro de HomeProvider");
  return ctx;
}
