import type { AddressType } from "./AddressType";

export type OrderStatusType =
  | "PENDING"
  | "PAID"
  | "PICKING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "AVAILABLE";

export type OrderItemType = {
  id: number | string; 
  name: string;
  image: string;
  price: number;
  qty: number;
  isDigital?: boolean; 
  downloadUrl?: string; 
  fileFormat?: string;
};

export type PaymentType = { method: "PIX" | "CARD"; last4?: string };

export type ShipmentType = {
  method: "Correios" | "Transportadora" | "Retirada" | "Digital";
  tracking?: string;
  etaDays?: number;
  downloadAvailable?: boolean; 
};

export type OrderType = {
  id: string;
  createdAt: string;
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
