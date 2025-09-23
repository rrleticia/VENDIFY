import type { ProductType } from "./ProductType";

// Metadados extras do produto no admin
export type AdminProductInputType = Omit<ProductType, "id"> & {
  id?: string;
};
