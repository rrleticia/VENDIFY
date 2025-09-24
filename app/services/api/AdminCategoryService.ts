// app/services/api/AdminCategoryService.ts
import { saveJSON, STORAGE_KEYS } from "@services/helpers/storage";
import { categories, products } from "@common/mocks";
import type { CategoryType } from "./types";

const wait = (ms:number)=> new Promise(r=>setTimeout(r, ms));

export async function listCategories(): Promise<CategoryType[]> {
  await wait(80);
  return categories;
}

export async function createCategory(input: Omit<CategoryType, "id">): Promise<CategoryType> {
  await wait(120);
  const newItem: CategoryType = { ...input, id: crypto.randomUUID() };
  (categories as CategoryType[]).push(newItem);
  saveJSON(STORAGE_KEYS.categories, categories);
  return newItem;
}

export async function updateCategory(id: string, patch: Partial<Omit<CategoryType,"id">>): Promise<CategoryType> {
  await wait(120);
  const idx = categories.findIndex(c => c.id === id);
  if (idx < 0) throw new Error("Categoria não encontrada");
  const updated = { ...categories[idx], ...patch };
  (categories as CategoryType[])[idx] = updated;
  saveJSON(STORAGE_KEYS.categories, categories);
  return updated;
}

export async function deleteCategory(id: string): Promise<{ok:true}> {
  await wait(120);
  const idx = categories.findIndex(c => c.id === id);
  if (idx < 0) throw new Error("Categoria não encontrada");
  const linked = products.some(p => p.categoryId === id);
  if (linked) throw new Error("Não é possível excluir: há produtos vinculados a esta categoria.");
  (categories as CategoryType[]).splice(idx,1);
  saveJSON(STORAGE_KEYS.categories, categories);
  return { ok: true };
}
