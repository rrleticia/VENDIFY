// src/common/types.ts

// --- Perfil ---

// --- Checkout / Frete ---
export type ShippingKindType = "pickup" | "pac" | "sedex";

export type PaymentKindType = "pix" | "card";

export type ShippingMethodId = "pickup" | "correios" | "carrier";

export type ShippingOptionType = {
  id: ShippingMethodId;
  label: string;
  icon: "store" | "truck";
};

export type FreightQuoteType = {
  id: ShippingMethodId;
  label: string;
  price: number;
  etaDays: number;
};
