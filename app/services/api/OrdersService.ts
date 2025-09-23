// src/services/api/OrdersService.ts
import type { Order } from "./types";
import { adminMocks, ordersMock } from "@common/mocks";
import { toOrder } from "../func/adapters";
import type { AdminOrder, AdminOrderStatus } from "@common/contexts";

let DB: Order[] = ordersMock; // pode trocar por fetch no backend

export async function listOrders(): Promise<Order[]> {
  return DB;
}

export async function searchOrders(filters: {
  text: string;
  status: Order["status"] | "ALL";
  start: string;
  end: string;
}): Promise<Order[]> {
  // filtro simples, espelhando seu OrdersPage
  const t = (filters.text || "").toLowerCase();
  const start = filters.start
    ? new Date(`${filters.start}T00:00:00`).getTime()
    : null;
  const end = filters.end
    ? new Date(`${filters.end}T23:59:59`).getTime()
    : null;

  return DB.filter((o) => {
    const matchText =
      !t ||
      o.id.toLowerCase().includes(t) ||
      o.items.some((it) => it.name.toLowerCase().includes(t));
    const matchStatus = filters.status === "ALL" || o.status === filters.status;
    const time = new Date(o.createdAt).getTime();
    const matchAfter = start == null || time >= start;
    const matchBefore = end == null || time <= end;
    return matchText && matchStatus && matchAfter && matchBefore;
  });
}

export async function cancelOrder(id: string): Promise<Order[]> {
  DB = DB.map((o) =>
    o.id === id
      ? { ...o, status: "CANCELED", canceledAt: new Date().toISOString() }
      : o
  );
  return DB;
}

export async function reorder(id: string): Promise<{ ok: true }> {
  // opcional — no front a recomposição do carrinho já está garantida
  return { ok: true };
}

let ORDERS: AdminOrder[] = [...adminMocks.orders];

export async function list(): Promise<AdminOrder[]> {
  return new Promise((r) => setTimeout(() => r([...ORDERS]), 250));
}

export async function updateStatus(
  id: string,
  status: AdminOrderStatus
): Promise<AdminOrder> {
  ORDERS = ORDERS.map((o) => (o.id === id ? { ...o, status } : o));
  const updated = ORDERS.find((o) => o.id === id)!;
  return new Promise((r) => setTimeout(() => r(updated), 200));
}
