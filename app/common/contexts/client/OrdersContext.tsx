import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { OrderType, OrderStatusType } from "@common/types";
import { products } from "@common/mocks";
import {
  listOrders,
  searchOrders,
  cancelOrder,
  reorder as svcReorder,
} from "@services/api/OrdersService";
import { useCart } from "@common/contexts/";

type Filters = {
  text: string;
  status: OrderStatusType | "ALL";
  start: string;
  end: string;
};

interface OrdersCtx {
  orders: OrderType[];
  loading: boolean;
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  refresh: () => Promise<void>;
  applyFilters: () => Promise<void>;
  cancel: (id: string) => Promise<void>;
  makeReorder: (orderId: string) => Promise<void>;
}

const Ctx = createContext<OrdersCtx | null>(null);

<<<<<<<< HEAD:app/common/contexts/client/OrdersContext.tsx
export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<OrderType[]>([]);
========
export function ClientOrdersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
>>>>>>>> 82c00265b44286a4cf7bd413917921aa91196f00:app/common/contexts/client/ClientOrdersContext.tsx
  const [loading, setLoading] = useState(true);
  const [filters, setFiltersState] = useState<Filters>({
    text: "",
    status: "ALL",
    start: "",
    end: "",
  });

  const { addToCart } = useCart();

  const setFilters = useCallback((f: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await listOrders());
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await searchOrders(filters));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const cancel = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setOrders(await cancelOrder(id));
    } finally {
      setLoading(false);
    }
  }, []);

  const makeReorder = useCallback(
    async (orderId: string) => {
      try {
        await svcReorder?.(orderId);
      } catch {
      }

      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      for (const it of order.items ?? []) {
        let prod = products.find(
          (p) => String(p.id) === String((it as any).productId ?? it.id)
        );
        if (!prod) {
          const name = String(it.name ?? "").toLowerCase();
          prod =
            products.find((p) => String(p.name).toLowerCase() === name) ||
            products.find((p) =>
              String(p.name).toLowerCase().startsWith(name.slice(0, 8))
            ) ||
            products.find((p) => String(p.name).toLowerCase().includes(name));
        }
        if (!prod) continue; 

        const qty = Number(it.qty ?? 1);
        const virtualStock =
          prod.stock !== undefined
            ? Math.max(prod.stock, qty)
            : Number.MAX_SAFE_INTEGER;
        await addToCart(String(prod.id), virtualStock, qty);
      }
    },
    [orders, addToCart]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<OrdersCtx>(
    () => ({
      orders,
      loading,
      filters,
      setFilters,
      refresh,
      applyFilters,
      cancel,
      makeReorder,
    }),
    [
      orders,
      loading,
      filters,
      setFilters,
      refresh,
      applyFilters,
      cancel,
      makeReorder,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClientOrders() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useOrders deve ser usado dentro de OrdersProvider");
  return ctx;
}
