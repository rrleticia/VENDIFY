// @common/types/ProductType.ts
export type ProductType = {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  description?: string;
  // NOVOS CAMPOS
  rating?: number; // ex.: 4.5
  ratingsCount?: number; // ex.: 128
  tags?: string[]; // ex.: ["bluetooth", "sem fio", "promo"]
};
