// app/services/api/AdminCatalogService.ts
import type { ProductType } from "./types";
import { products } from "@common/mocks";
import { saveJSON, STORAGE_KEYS } from "@services/helpers/storage";
import { adminActivityLogs } from "@common/mocks_admin";

const wait = (ms:number)=> new Promise(r=>setTimeout(r, ms));

export async function listProducts(): Promise<ProductType[]> {
  await wait(120);
  return products;
}

export async function createProduct(p: ProductType): Promise<ProductType> {
  await wait(160);
  (products as ProductType[]).push(p);
  saveJSON(STORAGE_KEYS.products, products);
  adminActivityLogs.push({ id: crypto.randomUUID(), at: new Date().toISOString(), userId: "u-admin", action: "PRODUCT_CREATE", details: JSON.stringify({ id: p.id, name: p.name }) });
  return p;
}

export async function updateProduct(id: ProductType["id"], patch: Partial<ProductType>): Promise<ProductType> {
  await wait(160);
  const idx = products.findIndex((x)=> String(x.id)===String(id));
  if (idx<0) throw new Error("Produto não encontrado");
  const updated = { ...products[idx], ...patch };
  (products as ProductType[])[idx] = updated;
  saveJSON(STORAGE_KEYS.products, products);
  adminActivityLogs.push({ id: crypto.randomUUID(), at: new Date().toISOString(), userId: "u-admin", action: "PRODUCT_UPDATE", details: JSON.stringify({ id }) });
  return updated;
}

export async function deleteProduct(id: ProductType["id"]): Promise<{ok:true}> {
  await wait(120);
  const idx = products.findIndex((x)=> String(x.id)===String(id));
  if (idx<0) throw new Error("Produto não encontrado");
  (products as ProductType[]).splice(idx,1);
  saveJSON(STORAGE_KEYS.products, products);
  adminActivityLogs.push({ id: crypto.randomUUID(), at: new Date().toISOString(), userId: "u-admin", action: "PRODUCT_DELETE", details: JSON.stringify({ id }) });
  return { ok: true };
}

// Emula upload: apenas devolve uma URL blob/placeholder; UI deve salvar via updateProduct
export async function uploadProductImage(id: ProductType["id"], file: File): Promise<string> {
  await wait(200);
  const url = typeof URL !== "undefined" && file ? URL.createObjectURL(file) : `https://picsum.photos/seed/${id}/600/400`;
  return url;
}
