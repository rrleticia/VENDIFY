import { EmailService, LogsService, OrdersService } from "@app/services";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AdminOrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "canceled";
export type AdminOrder = {
  id: string;
  customerId: string;
  items: Array<{
    productId: string;
    title: string;
    qty: number;
    price: number;
  }>;
  total: number;
  status: AdminOrderStatus;
  createdAt: string;
};

type OrdersContextType = {
  orders: AdminOrder[];
  loading: boolean;
  updateStatus: (id: string, status: AdminOrderStatus) => Promise<void>;
  refresh: () => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function AdminOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  const refresh = async () => {
    setLoading(true);
    const data = await OrdersService.list();
    setOrders(data);
    setLoading(false);
  };

  const updateStatus: OrdersContextType["updateStatus"] = async (
    id,
    status
  ) => {
    const updated = await OrdersService.updateStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    LogsService.log({
      action: "update_order_status",
      entityId: id,
      details: { status },
    });
    await EmailService.sendOrderStatusEmail(updated.id, updated.status);
  };

  const value = useMemo(
    () => ({ orders, loading, updateStatus, refresh }),
    [orders, loading]
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useAdminOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
