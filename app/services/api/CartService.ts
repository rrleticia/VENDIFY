// src/services/CartService.ts
// Mock com persistência em localStorage. Troque por API real quando quiser.

export type ShippingMethodId =
  | "pickup"
  | "correios"
  | "carrier"
  | "pac"
  | "sedex";

export interface LineFreight {
  price: number; // valor do frete daquela linha (se aplicável)
  eta?: string; // estimativa textual
}

export interface LineMeta {
  shipping?: ShippingMethodId;
  cep?: string;
  freight?: LineFreight;
}

export interface CartLine {
  id: string; // productId como string
  qty: number;
  meta?: LineMeta; // { shipping, cep, freight }
}

const LS_KEY = "buyly.cart.v1";

function loadRaw(): CartLine[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}
function saveRaw(lines: CartLine[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(lines));
}

export async function getCart(): Promise<CartLine[]> {
  return loadRaw();
}

export async function addItem(
  productId: string | number,
  qty = 1,
  meta?: LineMeta
) {
  const id = String(productId);
  const lines = loadRaw();
  const i = lines.findIndex(
    (l) =>
      l.id === id && JSON.stringify(l.meta ?? {}) === JSON.stringify(meta ?? {})
  );
  if (i >= 0) lines[i].qty = Math.max(1, lines[i].qty + qty);
  else lines.push({ id, qty: Math.max(1, qty), meta });
  saveRaw(lines);
  return lines;
}

export async function setQty(
  productId: string | number,
  qty: number,
  meta?: LineMeta
) {
  const id = String(productId);
  let lines = loadRaw();
  lines = lines
    .map((l) =>
      l.id === id && JSON.stringify(l.meta ?? {}) === JSON.stringify(meta ?? {})
        ? { ...l, qty: Math.max(0, qty) }
        : l
    )
    .filter((l) => l.qty > 0);
  saveRaw(lines);
  return lines;
}

export async function removeItem(productId: string | number, meta?: LineMeta) {
  const id = String(productId);
  const lines = loadRaw().filter(
    (l) =>
      !(
        l.id === id &&
        JSON.stringify(l.meta ?? {}) === JSON.stringify(meta ?? {})
      )
  );
  saveRaw(lines);
  return lines;
}

export async function clearCart() {
  saveRaw([]);
  return [];
}
