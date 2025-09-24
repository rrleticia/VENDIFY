// src/common/mocks.ts

import type {
  ProductType,
  OrderType,
  UserType,
  CardType,
  AddressType,
  CategoryType,
  BadgeType,
} from "@common/types";

// ---------- Catálogo e entidades ----------
export const categories: CategoryType[] = [
  { id: "cat-audio", name: "Fones", slug: "fones", active: true },
  {
    id: "cat-peripherals",
    name: "Periféricos",
    slug: "perifericos",
    active: true,
  },
  { id: "cat-monitors", name: "Monitores", slug: "monitores", active: true },
  { id: "cat-mouses", name: "Mouses", slug: "mouses", active: true },
  { id: "cat-misc", name: "Outros", slug: "outros", active: true },
];

export const badges: BadgeType[] = [
  { id: "badge-promo", slug: "promo", label: "Promo", color: "error" },
  { id: "badge-new", slug: "new", label: "Novo", color: "primary" },
  {
    id: "badge-bestseller",
    slug: "bestseller",
    label: "Mais vendido",
    color: "success",
  },
];

// ---------- Produtos ----------
export const products: ProductType[] = [
  {
    id: 101,
    name: "Fone Bluetooth XY-300",
    image: "https://m.media-amazon.com/images/I/61g+jV15o8L.jpg",
    price: 149.9,
    rating: 4.5,
    badgeIds: ["badge-promo"],
    categoryId: "cat-audio",
    stock: 30,
    tags: ["bluetooth", "fone", "audio"],
    paymentMethods: ["PIX", "Cartão"],
    shippingOptions: [
      { id: "pickup", label: "Retirada no local", icon: "store" },
      { id: "correios", label: "Correios", icon: "truck" },
      { id: "carrier", label: "Transportadora", icon: "truck" },
    ],
  },
  {
    id: 102,
    name: "Teclado Mecânico Aurora",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",
    price: 299.0,
    rating: 4.8,
    badgeIds: ["badge-bestseller"],
    categoryId: "cat-peripherals",
    stock: 15,
    tags: ["teclado", "mecânico", "aurora"],
    paymentMethods: ["PIX", "Cartão"],
    shippingOptions: [
      { id: "pickup", label: "Retirada no local", icon: "store" },
      { id: "correios", label: "Correios", icon: "truck" },
      { id: "carrier", label: "Transportadora", icon: "truck" },
    ],
  },
  {
    id: 103,
    name: "Mouse Gamer Helios",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1400&auto=format&fit=crop",
    price: 189.5,
    rating: 4.2,
    badgeIds: ["badge-new"],
    categoryId: "cat-mouses",
    stock: 20,
    tags: ["mouse", "gamer"],
    paymentMethods: ["PIX", "Cartão"],
    shippingOptions: [
      { id: "pickup", label: "Retirada no local", icon: "store" },
      { id: "correios", label: "Correios", icon: "truck" },
      { id: "carrier", label: "Transportadora", icon: "truck" },
    ],
  },
  {
    id: 104,
    name: "Mochila Urbana Pro",
    image:
      "https://www.kawaiies.com/cdn/shop/products/kawaiies-plushies-plush-softtoy-large-pastel-waterproof-backpack-handbag-bag-pink-784000.jpg?v=1678836044",
    price: 219.9,
    rating: 4.6,
    categoryId: "cat-misc",
    stock: 12,
    tags: ["mochila", "urbana"],
    paymentMethods: ["PIX", "Cartão"],
    shippingOptions: [
      { id: "pickup", label: "Retirada no local", icon: "store" },
      { id: "correios", label: "Correios", icon: "truck" },
      { id: "carrier", label: "Transportadora", icon: "truck" },
    ],
  },
];

// ---------- Pedidos (ids dos itens == ids dos produtos acima) ----------
export const ordersMock: OrderType[] = [
  {
    id: "fe3898cc-1814-417e-abbd-4324b9f8cbf5",
    createdAt: new Date().toISOString(),
    status: "PAID",
    items: [
      {
        id: 102, // Teclado Mecânico Aurora
        name: "Teclado Mecânico Aurora",
        image: products.find((p) => p.id === 102)!.image,
        price: 299.0,
        qty: 1,
      },
      {
        id: 103, // Mouse Gamer Helios
        name: "Mouse Gamer Helios",
        image: products.find((p) => p.id === 103)!.image,
        price: 189.5,
        qty: 1,
      },
    ],
    address: {
      name: "Letícia Andrade",
      line1: "Rua das Flores, 123",
      city: "Campina Grande",
      state: "PB",
      zip: "58400-000",
    },
    payment: { method: "PIX" },
    shipment: { method: "Correios", tracking: "BR1234567890", etaDays: 5 },
    subtotal: 488.5,
    shipping: 0,
    discount: 0,
    total: 488.5,
  },
];

// ---------- Perfil ----------
export const mockUser: UserType = {
  name: "Letícia Andrade",
  email: "leticia@example.com",
  phone: "(83) 99999-9999",
  cpf: "000.111.222-33",
  birth: "2000-01-10",
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
  newsletter: true,
  twoFA: false,
  marketingPush: true,
  marketingEmail: true,
  marketingSMS: false,
};

export const mockAddresses: AddressType[] = [
  {
    id: "addr-1",
    label: "Casa",
    rua: "Rua das Flores",
    numero: "123",
    complemento: "Apto 302",
    bairro: "Centro",
    cidade: "Campina Grande",
    estado: "PB",
    cep: "58400-000",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Trabalho",
    rua: "Av. Principal",
    numero: "456",
    complemento: "Sala 201",
    bairro: "Bairro Novo",
    cidade: "João Pessoa",
    estado: "PB",
    cep: "58000-000",
  },
];

export const mockCards: CardType[] = [
  {
    id: "card-1",
    brand: "Visa",
    last4: "8421",
    holder: "LETICIA A",
    expMonth: 9,
    expYear: 2027,
    isDefault: true,
  },
  {
    id: "card-2",
    brand: "Mastercard",
    last4: "1103",
    holder: "LETICIA A",
    expMonth: 2,
    expYear: 2026,
  },
];
