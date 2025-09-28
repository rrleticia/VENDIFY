// app/services/api/AdminDashboardService.ts
import { products, ordersMock } from "@common/mocks";
import type { OrderType } from "./types";

function sumOrder(o: OrderType): number {
  return (o.items ?? []).reduce((acc, it) => acc + Number(it.price || 0) * Number(it.qty || 0), 0);
}

export async function summary() {
  // Simple in-memory computation (no IO here); kept async for consistency
  const activeProducts = products.length;

  const counts = {
    totalOrders: ordersMock.length,
    pending: 0,
    paid: 0,
    picking: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  let totalSales = 0;
  for (const o of ordersMock) {
    counts[o.status.toLowerCase() as keyof typeof counts] += 1 as any;
    // Consider vendas efetivas as PAID/SHIPPED/DELIVERED
    if (o.status === "PAID" || o.status === "SHIPPED" || o.status === "DELIVERED") {
      totalSales += sumOrder(o);
    }
  }

  return {
    activeProducts,
    totalSales,
    ...counts,
  };
}
