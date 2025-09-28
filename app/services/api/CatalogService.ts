import type { AdminProduct } from "@common/contexts";
import { adminMocks } from "../../common/mocks/admin.mocks";

let PRODUCTS: AdminProduct[] = [...adminMocks.products];

export async function list(): Promise<AdminProduct[]> {
  return new Promise((r) => setTimeout(() => r([...PRODUCTS]), 250));
}

export async function create(
  p: Omit<AdminProduct, "id">
): Promise<AdminProduct> {
  const created: AdminProduct = { id: crypto.randomUUID(), ...p };
  PRODUCTS = [created, ...PRODUCTS];
  return new Promise((r) => setTimeout(() => r(created), 250));
}

export async function update(
  id: string,
  patch: Partial<AdminProduct>
): Promise<AdminProduct> {
  PRODUCTS = PRODUCTS.map((x) => (x.id === id ? { ...x, ...patch } : x));
  const updated = PRODUCTS.find((x) => x.id === id)!;
  return new Promise((r) => setTimeout(() => r(updated), 250));
}

export async function remove(id: string): Promise<void> {
  PRODUCTS = PRODUCTS.filter((x) => x.id !== id);
  return new Promise((r) => setTimeout(() => r(), 200));
}
