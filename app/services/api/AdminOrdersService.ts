// app/services/api/AdminOrdersService.ts
import type { OrderType } from "./types";
import { ordersMock } from "@common/mocks";
import { adminActivityLogs, adminEmailQueue } from "@common/mocks_admin";

let DB: OrderType[] = ordersMock;

const wait = (ms:number)=> new Promise(r=>setTimeout(r, ms));

export async function overview(): Promise<{ total:number; pending:number; paid:number; cancelled:number; shipped:number; delivered:number; picking:number; }>{ 
  await wait(100);
  const total = DB.length;
  const tally = (s: OrderType["status"]) => DB.filter(o=>o.status===s).length;
  return {
    total,
    pending: tally("PENDING"),
    paid: tally("PAID"),
    cancelled: tally("CANCELED"),
    shipped: tally("SHIPPED"),
    delivered: tally("DELIVERED"),
    picking: tally("PICKING"),
  };
}

export async function listAll(): Promise<OrderType[]> {
  await wait(120);
  return DB;
}

export async function setStatus(id: string, status: OrderType["status"]): Promise<OrderType> {
  await wait(140);
  const idx = DB.findIndex(o=>o.id===id);
  if (idx<0) throw new Error("Pedido não encontrado");
  DB[idx] = { ...DB[idx], status };
  adminActivityLogs.push({ id: crypto.randomUUID(), at: new Date().toISOString(), userId: "u-admin", action: "ORDER_STATUS", details: JSON.stringify({ id, status }) });
  adminEmailQueue.push({
    id: crypto.randomUUID(),
    to: "cliente@example.com",
    subject: `Atualização do pedido ${id}`,
    body: `Seu pedido agora está: ${status}`,
    status: "queued",
    at: new Date().toISOString(),
  });
  return DB[idx];
}
