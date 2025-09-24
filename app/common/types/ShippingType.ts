// src/common/types/ShippingType.ts

export type ShippingMethodId = "pickup" | "correios" | "carrier";
export type ShippingKindType = ShippingMethodId;

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
