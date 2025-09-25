// src/services/api/ProductService.ts
import type {
  ProductType,
  ShippingOptionType,
  FreightQuoteType,
} from "./types";
import { products } from "@common/mocks";
import { quoteFreight } from "../helpers/quoteFreight";

export async function getProductById(
  id: string | number
): Promise<ProductType> {
  const p = products.find((pp) => String(pp.id) === String(id));
  if (!p) throw new Error("Produto não encontrado");
  return p;
}

export async function getRelatedProducts(
  category?: string,
  currentId?: string | number
): Promise<ProductType[]> {
  const list = products.filter((p) =>
    !!category ? p.category === category : true
  );
  return list.filter((p) => String(p.id) !== String(currentId)).slice(0, 4);
}

export async function calcFreightForOptions(
  options: ShippingOptionType[],
  cep: string
): Promise<Partial<Record<ShippingOptionType["id"], FreightQuoteType>>> {
  const ids = options.map((o) => o.id);
  const quoted = await quoteFreight(ids, cep);
  const map: Partial<Record<ShippingOptionType["id"], FreightQuoteType>> = {};
  for (const o of options) {
    const q = quoted[o.id];
    if (q) map[o.id] = { id: q.id as any, label: q.label, price: q.price, etaDays: q.etaDays };
    else map[o.id] = { id: o.id as any, label: o.label, price: 0, etaDays: 0 };
  }
  return map;
}
