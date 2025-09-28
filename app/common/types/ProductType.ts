<<<<<<< HEAD
export type ProductType = {
  id: number | string;
  name: string;
  image: string;
  price: number;
  rating?: number;
  ratingsCount?: number;
  categoryId: string;
  badgeIds?: string[];
  stock?: number;
  tags?: string[];
  description?: string;
  paymentMethods?: string[];
  shippingOptions?: import("./ShippingType").ShippingOptionType[];
  isDigital?: boolean;
  downloadUrl?: string;
  fileSize?: string; 
  fileFormat?: string; 
  pages?: number;
};
=======
export type ProductType = {
  id: number | string;
  name: string;
  image: string;
  price: number;
  rating?: number;
  ratingsCount?: number;
  badge?: "Novo" | "Promo" | "Mais vendido";
  category: string;
  stock: number;
  tags?: string[];
  description?: string;
  paymentMethods?: string[]; // ["PIX", "Cartão"...]
  shippingOptions?: {
    id: "pickup" | "correios" | "carrier";
    label: string;
    icon: "store" | "truck";
  }[];
};
>>>>>>> 82c00265b44286a4cf7bd413917921aa91196f00
