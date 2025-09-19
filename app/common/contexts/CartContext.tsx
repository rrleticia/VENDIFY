// src/contexts/CartContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products } from "@common/mocks";
import {
  type CartLine,
  type LineMeta,
  getCart,
  addItem as svcAdd,
  setQty as svcSetQty,
  removeItem as svcRemove,
  clearCart as svcClear,
} from "../services/CartService";

type ProductLite = {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock?: number;
  category?: string;
};

export type CartResolvedItem = {
  product: ProductLite;
  qty: number;
  meta?: LineMeta;
  lineTotal: number; // price * qty
};

interface CartState {
  items: CartResolvedItem[];
  loading: boolean;
}

interface CartCtx {
  state: CartState;
  addToCart: (
    productId: string | number,
    qty?: number,
    meta?: LineMeta
  ) => Promise<void>;
  setQty: (
    productId: string | number,
    qty: number,
    meta?: LineMeta
  ) => Promise<void>;
  remove: (productId: string | number, meta?: LineMeta) => Promise<void>;
  clear: () => Promise<void>;
  subtotal: number;
  itemsCount: number;
}

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [], loading: true });

  const hydrate = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const raw = await getCart();
    const resolved: CartResolvedItem[] = raw
      .map((l: CartLine) => {
        const p = products.find((pp) => String(pp.id) === String(l.id));
        if (!p) return null;
        const product: ProductLite = {
          id: String(p.id),
          name: p.name,
          price: p.price,
          image: p.image,
          stock: p.stock,
          category: p.category,
        };
        return {
          product,
          qty: l.qty,
          meta: l.meta,
          lineTotal: p.price * l.qty,
        };
      })
      .filter(Boolean) as CartResolvedItem[];
    setState({ items: resolved, loading: false });
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const addToCart = useCallback(
    async (productId: string | number, qty = 1, meta?: LineMeta) => {
      await svcAdd(productId, qty, meta);
      await hydrate();
    },
    [hydrate]
  );

  const setQty = useCallback(
    async (productId: string | number, qty: number, meta?: LineMeta) => {
      await svcSetQty(productId, qty, meta);
      await hydrate();
    },
    [hydrate]
  );

  const remove = useCallback(
    async (productId: string | number, meta?: LineMeta) => {
      await svcRemove(productId, meta);
      await hydrate();
    },
    [hydrate]
  );

  const clear = useCallback(async () => {
    await svcClear();
    await hydrate();
  }, [hydrate]);

  const subtotal = useMemo(
    () => state.items.reduce((acc, it) => acc + it.lineTotal, 0),
    [state.items]
  );
  const itemsCount = useMemo(
    () => state.items.reduce((acc, it) => acc + it.qty, 0),
    [state.items]
  );

  const value: CartCtx = {
    state,
    addToCart,
    setQty,
    remove,
    clear,
    subtotal,
    itemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
