// src/services/api/ProductService.ts
import type { Product, ShippingOption, FreightQuote } from "./types";
import { products } from "@common/mocks";
import { toProduct, toFreightQuote } from "./adapters";

export async function getProductById(id: string | number): Promise<Product> {
  const p = products.find((pp) => String(pp.id) === String(id));
  if (!p) throw new Error("Produto não encontrado");
  return p;
}

export async function getRelatedProducts(
  category?: string,
  currentId?: string | number
): Promise<Product[]> {
  const list = products.filter((p) =>
    !!category ? p.category === category : true
  );
  return list.filter((p) => String(p.id) !== String(currentId)).slice(0, 4);
}

export async function calcFreightForOptions(
  options: ShippingOption[],
  cep: string
): Promise<Partial<Record<ShippingOption["id"], FreightQuote>>> {
  // mock de cotação
  const map: Partial<Record<ShippingOption["id"], FreightQuote>> = {};
  for (const o of options) {
    if (o.id === "pickup")
      map[o.id] = { id: o.id, label: o.label, price: 0, etaDays: 0 };
    if (o.id === "correios")
      map[o.id] = { id: o.id, label: o.label, price: 29.9, etaDays: 6 };
    if (o.id === "carrier")
      map[o.id] = { id: o.id, label: o.label, price: 39.9, etaDays: 3 };
  }
  return map;
}
