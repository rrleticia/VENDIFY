export type BadgeType = {
  id: string;
  slug: "promo" | "new" | "bestseller";
  label: "Promo" | "Novo" | "Mais vendido";
  color?: "error" | "primary" | "success";
};
