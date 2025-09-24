import type {
  ProductType,
  OrderType,
  OrderItemType,
  AddressType,
  CardType,
  UserType,
  FreightQuoteType,
  ShippingOptionType,
} from "../api/types";

// Exemplos de adapters genéricos — ajuste aos seus campos reais se diferirem:

export function toProduct(dto: any): ProductType {
  return {
    id: dto.id,
    name: dto.name ?? dto.title,
    image: dto.image ?? dto.thumbnail,
    price: Number(dto.price ?? 0),
    rating: dto.rating,
    ratingsCount: dto.ratingsCount,
    badge: dto.badge,
    category: dto.category,
    stock: dto.stock,
    tags: dto.tags,
    description: dto.description,
    paymentMethods: dto.paymentMethods,
    shippingOptions: dto.shippingOptions,
  };
}

export function toOrderItem(dto: any): OrderItemType {
  return {
    id: dto.productId ?? dto.id, // garante que seja o MESMO id do catálogo
    name: dto.name,
    image: dto.image,
    price: Number(dto.price ?? dto.unitPrice ?? 0),
    qty: Number(dto.qty ?? dto.quantity ?? 1),
  };
}

export function toOrder(dto: any): OrderType {
  return {
    id: dto.id,
    createdAt: dto.createdAt ?? dto.created_at,
    status: dto.status,
    items: (dto.items ?? []).map(toOrderItem),
    address: toAddress(dto.address),
    payment: dto.payment,
    shipment: dto.shipment,
    subtotal: Number(dto.subtotal ?? 0),
    shipping: Number(dto.shipping ?? 0),
    discount: Number(dto.discount ?? 0),
    total: Number(dto.total ?? 0),
    canceledAt: dto.canceledAt ?? dto.canceled_at,
  };
}

export function toAddress(dto: any): AddressType {
  return {
    id: dto.id,
    name: dto.name,
    label: dto.label,
    line1: dto.line1 ?? dto.street,
    line2: dto.line2,
    city: dto.city,
    state: dto.state,
    zip: dto.zip ?? dto.postalCode,
    isDefault: Boolean(dto.isDefault ?? dto.default),
  };
}

export function toCard(dto: any): CardType {
  return {
    id: dto.id,
    brand: dto.brand,
    last4: String(dto.last4 ?? "").slice(-4),
    holder: dto.holder,
    expMonth: Number(dto.expMonth ?? dto.exp_month),
    expYear: Number(dto.expYear ?? dto.exp_year),
    isDefault: Boolean(dto.isDefault),
  };
}

export function toUser(dto: any): UserType {
  return {
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    cpf: dto.cpf,
    birth: dto.birth,
    avatar: dto.avatar,
    newsletter: Boolean(dto.newsletter),
    twoFA: Boolean(dto.twoFA),
    marketingPush: Boolean(dto.marketingPush),
    marketingEmail: Boolean(dto.marketingEmail),
    marketingSMS: Boolean(dto.marketingSMS),
  };
}

export function toFreightQuote(dto: any): FreightQuoteType {
  return {
    id: dto.id,
    label: dto.label,
    price: Number(dto.price ?? 0),
    etaDays: Number(dto.etaDays ?? dto.eta_days ?? 0),
  };
}

export function toShippingOption(dto: any): ShippingOptionType {
  return { id: dto.id, label: dto.label, icon: dto.icon };
}
