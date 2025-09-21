// src/services/api/HomeService.ts
import { products, categories } from "@common/mocks";
import type { Product } from "@common/types";

export type HomeCollections = {
  banners: {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    cta?: { label: string; to: string };
  }[];
  featured: Product[]; // vitrine destaque
  deals: Product[]; // promoções (badge === "Promo")
  bestRated: Product[]; // melhor avaliados
  categories: string[]; // chips de categorias
};

export async function getHomeCollections(): Promise<HomeCollections> {
  // banners mockados (apenas aqui, não existem em outros contextos)
  const banners = [
    {
      id: "bn-1",
      title: "Linha Aurora",
      subtitle: "Teclados mecânicos em oferta",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
      cta: { label: "Ver teclados", to: "/catalog?category=Teclados" },
    },
    {
      id: "bn-2",
      title: "Setup Gamer",
      subtitle: "Mouses precisos para sua gameplay",
      image:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1600&auto=format&fit=crop",
      cta: { label: "Ver mouses", to: "/catalog?category=Mouses" },
    },
  ];

  const featured = products.slice(0, 4);
  const deals = products.filter((p) => p.badge === "Promo").slice(0, 8);
  const bestRated = [...products]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 8);

  return { banners, featured, deals, bestRated, categories };
}
