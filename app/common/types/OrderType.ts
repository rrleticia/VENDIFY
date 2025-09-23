import type { AddressType } from "./AddressType";

// --- Pedido ---
export type OrderStatusType =
  | "PENDING"
  | "PAID"
  | "PICKING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export type OrderItemType = {
  id: number | string; // deve bater com Product.id
  name: string;
  image: string;
  price: number;
  qty: number;
};

export type PaymentType = { method: "PIX" | "CARD"; last4?: string };

export type ShipmentType = {
  method: "Correios" | "Transportadora" | "Retirada";
  tracking?: string;
  etaDays?: number;
};

export type OrderType = {
  id: string; // ex.: #2025-0001
  createdAt: string; // ISO
  status: OrderStatusType;
  items: OrderItemType[];
  address: AddressType;
  payment: PaymentType;
  shipment: ShipmentType;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  canceledAt?: string;
};
