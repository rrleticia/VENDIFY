import type { AdminProduct } from "../../client/common/contexts/CatalogContext";
import type { AdminOrder } from "../contexts/admin/AdminOrdersContext";
import type { AdminCustomer } from "../../client/common/contexts/CustomersContext";

export const adminMocks: {
  products: AdminProduct[];
  customers: AdminCustomer[];
  orders: AdminOrder[];
} = {
  products: [
    {
      id: "p1",
      title: "Camiseta Básica",
      description: "Algodão 100%",
      images: ["/img/camisa1.jpg"],
      price: 59.9,
      stock: 42,
      category: "roupas",
      active: true,
    },
    {
      id: "p2",
      title: "Bolsa Casual",
      description: "Couro sintético",
      images: ["/img/bolsa1.jpg"],
      price: 189.9,
      stock: 10,
      category: "bolsas",
      active: true,
    },
    {
      id: "p3",
      title: "Caderno A4 200fls",
      description: "Papel 90g/m²",
      images: ["/img/caderno1.jpg"],
      price: 24.5,
      stock: 120,
      category: "escritorio",
      active: true,
    },
  ],
  customers: [
    {
      id: "c1",
      name: "João Silva",
      email: "joao@ex.com",
      phone: "+55 83 99999-1111",
      createdAt: new Date().toISOString(),
      orderCount: 3,
    },
    {
      id: "c2",
      name: "Maria Souza",
      email: "maria@ex.com",
      createdAt: new Date().toISOString(),
      orderCount: 1,
    },
  ],
  orders: [
    {
      id: "o1",
      customerId: "c1",
      items: [
        { productId: "p1", title: "Camiseta Básica", qty: 2, price: 59.9 },
      ],
      total: 119.8,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "o2",
      customerId: "c2",
      items: [{ productId: "p2", title: "Bolsa Casual", qty: 1, price: 189.9 }],
      total: 189.9,
      status: "paid",
      createdAt: new Date().toISOString(),
    },
  ],
};
