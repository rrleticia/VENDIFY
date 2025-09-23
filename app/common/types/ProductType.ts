export type ProductType = {
  id: number | string;
  name: string;
  image: string;
  price: number;
  rating?: number;
  ratingsCount?: number;
  badge?: "Novo" | "Promo" | "Mais vendido";
  category: string;
  stock?: number;
  tags?: string[];
  description?: string;
  paymentMethods?: string[]; // ["PIX", "Cartão"...]
  shippingOptions?: {
    id: "pickup" | "correios" | "carrier";
    label: string;
    icon: "store" | "truck";
  }[];
};
