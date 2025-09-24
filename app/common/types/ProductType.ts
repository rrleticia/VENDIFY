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
  paymentMethods?: string[]; // ["PIX", "Cartão"...]
  shippingOptions?: import("./ShippingType").ShippingOptionType[];
};
