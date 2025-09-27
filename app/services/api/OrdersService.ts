// src/services/api/OrdersService.ts
import type { OrderType } from "@common/types";
import { ordersMock } from "@common/mocks";

let DB: OrderType[] = ordersMock;

export async function listOrders(): Promise<OrderType[]> {
  return DB;
}

export async function searchOrders(filters: {
  text: string;
  status: OrderType["status"] | "ALL";
  start: string;
  end: string;
}): Promise<OrderType[]> {
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
  return { ok: true };
}
