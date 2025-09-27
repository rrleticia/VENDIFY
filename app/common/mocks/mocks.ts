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
  { id: "cat-ebooks", name: "E-books", slug: "ebooks", active: true },
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
  {
    id: 105,
    name: "JavaScript: O Guia Definitivo",
    image:
      "https://images.unsplash.com/photo-1687603917313-ccae1a289a9d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amF2YXNjcmlwdCUyMGNvZGV8ZW58MHx8MHx8fDA%3D",
    price: 49.9,
    rating: 4.7,
    badgeIds: ["badge-new"],
    categoryId: "cat-ebooks",
    stock: 999,
    tags: ["javascript", "programação", "desenvolvimento"],
    paymentMethods: ["PIX", "Cartão"],
    isDigital: true,
    downloadUrl: "https://storage.vendify.com/ebooks/javascript-guia-definitivo.pdf",
    fileSize: "12.5 MB",
    fileFormat: "PDF",
    pages: 854,
    description: "O guia mais completo para aprender JavaScript do básico ao avançado.",
    shippingOptions: [
      { id: "digital", label: "Download imediato", icon: "download" },
    ],
  },
  {
    id: 106,
    name: "Clean Code: Código Limpo",
    image:
      "https://images.squarespace-cdn.com/content/v1/63d40fe2cbd65e16cb8098b6/1678437282243-XL1EAF7FXW1KFY61HJ5V/why%2Blearn%2Bto%2Bcode.jpg",
    price: 39.9,
    rating: 4.9,
    badgeIds: ["badge-bestseller"],
    categoryId: "cat-ebooks",
    stock: 999,
    tags: ["clean code", "boas práticas", "programação"],
    paymentMethods: ["PIX", "Cartão"],
    isDigital: true,
    downloadUrl: "https://storage.vendify.com/ebooks/clean-code.epub",
    fileSize: "8.2 MB",
    fileFormat: "PDF",
    pages: 464,
    description: "Aprenda a escrever código limpo seguindo as melhores práticas de programação.",
    shippingOptions: [
      { id: "digital", label: "Download imediato", icon: "download" },
    ],
  },
  {
    id: 107,
    name: "React: Do Básico ao Avançado",
    image:
      "https://blog.fellyph.com.br/wp-content/uploads/2016/06/react-js.png",
    price: 34.9,
    rating: 4.6,
    badgeIds: ["badge-promo"],
    categoryId: "cat-ebooks",
    stock: 999,
    tags: ["react", "frontend", "javascript"],
    paymentMethods: ["PIX", "Cartão"],
    isDigital: true,
    downloadUrl: "https://storage.vendify.com/ebooks/react-basico-avancado.pdf",
    fileSize: "15.8 MB",
    fileFormat: "PDF",
    pages: 623,
    description: "Domine React.js com exemplos práticos e projetos reais.",
    shippingOptions: [
      { id: "digital", label: "Download imediato", icon: "download" },
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
      rua: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "Campina Grande",
      estado: "PB",
      cep: "58400-000",
    },
    payment: { method: "PIX" },
    shipment: { method: "Correios", tracking: "BR1234567890", etaDays: 5 },
    subtotal: 488.5,
    shipping: 0,
    discount: 0,
    total: 488.5,
  },
  // Pedido com ebook para demonstração
  {
    id: "ebook-001",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    status: "AVAILABLE",
    items: [
      {
        id: 105, // JavaScript: O Guia Definitivo
        name: "JavaScript: O Guia Definitivo",
        image: products.find((p) => p.id === 105)!.image,
        price: 49.9,
        qty: 1,
        isDigital: true,
        downloadUrl: "https://storage.vendify.com/ebooks/javascript-guia-definitivo.pdf",
        fileFormat: "PDF",
      },
    ],
    address: {
      name: "Letícia Andrade",
      rua: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "Campina Grande",
      estado: "PB",
      cep: "58400-000",
    },
    payment: { method: "PIX" },
    shipment: { method: "Digital", downloadAvailable: true },
    subtotal: 49.9,
    shipping: 0,
    discount: 0,
    total: 49.9,
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
