// src/services/api/OrdersService.ts
import type { OrderType } from "./types";
import { ordersMock } from "@common/mocks";

let DB: OrderType[] = ordersMock; // pode trocar por fetch no backend

export async function listOrders(): Promise<OrderType[]> {
  return DB;
}

export async function searchOrders(filters: {
  text: string;
  status: OrderType["status"] | "ALL";
  start: string;
  end: string;
}): Promise<OrderType[]> {
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

export async function cancelOrder(id: string): Promise<OrderType[]> {
  DB = DB.map((o) =>
    o.id === id
      ? { ...o, status: "CANCELED", canceledAt: new Date().toISOString() }
      : o
  );
  return DB;
}

export async function reorder(_id: string): Promise<{ ok: true }> {
  // opcional — no front a recomposição do carrinho já está garantida
  return { ok: true };
}

export async function createOrder(order: Partial<OrderType>): Promise<OrderType> {
  // cria id simples se não houver
  const id = order.id ?? `#${new Date().getFullYear()}-${String(
    Date.now()
  ).slice(-6)}`;
  const created: OrderType = {
    id,
    createdAt: new Date().toISOString(),
    status: (order.status as any) ?? "PENDING",
    items: (order.items as OrderType["items"]) ?? [],
    address: (order.address as OrderType["address"]) as any,
    payment: (order.payment as OrderType["payment"]) as any,
    shipment: (order.shipment as OrderType["shipment"]) as any,
    subtotal: (order.subtotal as number) ?? 0,
    shipping: (order.shipping as number) ?? 0,
    discount: (order.discount as number) ?? 0,
    total: (order.total as number) ?? 0,
  };
  DB = [created, ...DB];
  return created;
}
