// src/common/types/ShippingType.ts

export type ShippingMethodId = "pickup" | "correios" | "carrier" | "digital";
export type ShippingKindType = ShippingMethodId;

export type ShippingOptionType = {
  id: ShippingMethodId;
  label: string;
  icon: "store" | "truck" | "download";
};

export type FreightQuoteType = {
  id: ShippingMethodId;
  label: string;
  price: number;
  etaDays: number;
};
