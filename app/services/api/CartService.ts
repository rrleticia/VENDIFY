// src/services/api/CartService.ts
import type { OrderItem } from "./types";

// linhas cruas do carrinho (id == product.id)
export type LineMeta = Record<string, any>;
export type CartLine = { id: string | number; qty: number; meta?: LineMeta };

// mocks simples de armazenamento local (troque pelo seu fetch/axios)
const KEY = "__cart_lines__";

function read(): CartLine[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(lines: CartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(lines));
}

export async function getCart(): Promise<CartLine[]> {
  return read();
}
export async function addItem(id: string | number, qty = 1, meta?: LineMeta) {
  const lines = read();
  const idx = lines.findIndex((l) => String(l.id) === String(id));
  if (idx >= 0) lines[idx].qty += qty;
  else lines.push({ id, qty, meta });
  write(lines);
}
export async function setQty(
  id: string | number,
  qty: number,
  meta?: LineMeta
) {
  const lines = read().map((l) =>
    String(l.id) === String(id) ? { ...l, qty, meta } : l
  );
  write(lines);
}
export async function removeItem(id: string | number) {
  write(read().filter((l) => String(l.id) !== String(id)));
}
export async function clearCart() {
  write([]);
}
