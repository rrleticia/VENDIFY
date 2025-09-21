// src/common/types.ts

// --- Catálogo / Produto ---
export type Product = {
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

// --- Pedido ---
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PICKING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export type OrderItem = {
  id: number | string; // deve bater com Product.id
  name: string;
  image: string;
  price: number;
  qty: number;
};

export type Address = {
  id?: string;
  name?: string; // usado em Orders
  label?: string; // usado em Profile
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
};

export type Payment = { method: "PIX" | "CARD"; last4?: string };

export type Shipment = {
  method: "Correios" | "Transportadora" | "Retirada";
  tracking?: string;
  etaDays?: number;
};

export type Order = {
  id: string; // ex.: #2025-0001
  createdAt: string; // ISO
  status: OrderStatus;
  items: OrderItem[];
  address: Address;
  payment: Payment;
  shipment: Shipment;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  canceledAt?: string;
};

// --- Perfil ---
export type Card = {
  id: string;
  brand: "Visa" | "Mastercard" | "Elo" | "Amex";
  last4: string;
  holder: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
};

export type User = {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  birth?: string; // yyyy-mm-dd
  avatar?: string;
  newsletter?: boolean;
  twoFA?: boolean;
  marketingPush?: boolean;
  marketingEmail?: boolean;
  marketingSMS?: boolean;
};

// --- Checkout / Frete ---
export type ShippingKind = "pickup" | "pac" | "sedex";

export type PaymentKind = "pix" | "card";

export type ShippingMethodId = "pickup" | "correios" | "carrier";

export type ShippingOption = {
  id: ShippingMethodId;
  label: string;
  icon: "store" | "truck";
};

export type FreightQuote = {
  id: ShippingMethodId;
  label: string;
  price: number;
  etaDays: number;
};
