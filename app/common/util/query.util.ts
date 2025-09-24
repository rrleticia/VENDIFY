import type { CategoryType, ProductType } from "@common/types";
import { categories, badges } from "@common/mocks/mocks";

function normalize(v: string | null | undefined): string {
  return (v ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function matchesQuery(
  product: ProductType,

  q: string,
  isPromotion: boolean
): boolean {
  const s = normalize(q);
  const categoryName =
    categories.find((c) => c.id === product.categoryId)?.name ?? "";
  const haystack = [product.name, categoryName, ...(product.tags ?? [])]
    .map(normalize)
    .join(" ");

  const textMatch = !s || haystack.includes(s);

  const promoId = badges.find((b) => b.slug === "promo")?.id;
  const promoMatch =
    !isPromotion || (!!promoId && (product.badgeIds ?? []).includes(promoId));

  return textMatch && promoMatch;
}

export function resolveCategoryParam(paramValue: string | null): string | null {
  if (!paramValue) return null;
  const id = paramValue.trim();
  return categories.some((c) => c.id === id) ? id : null;
}
