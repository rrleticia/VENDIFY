// src/common/mocks.ts

import type {
  ProductType,
  OrderType,
  UserType,
  CardType,
  AddressType,
} from "@common/types";

// ---------- Produtos e categorias ----------
export const products: ProductType[] = [
  {
    id: 101,
    name: "Fone Bluetooth XY-300",
    image: "https://m.media-amazon.com/images/I/61g+jV15o8L.jpg",
    price: 149.9,
    rating: 4.5,
    badge: "Promo",
    category: "Acessórios",
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
    badge: "Mais vendido",
    category: "Teclados",
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
    badge: "Novo",
    category: "Mouses",
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
    category: "Mochilas",
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

export const categories: string[] = [
  "Acessórios",
  "Teclados",
  "Mouses",
  "Mochilas",
  "Escritório",
];

// ---------- Pedidos (ids dos itens == ids dos produtos acima) ----------
export const ordersMock: OrderType[] = [
  {
    id: "#2025-0001",
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
    line1: "Rua das Flores, 123",
    city: "Campina Grande",
    state: "PB",
    zip: "58400-000",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Trabalho",
    line1: "Av. Principal, 456 - Sala 201",
    city: "João Pessoa",
    state: "PB",
    zip: "58000-000",
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
