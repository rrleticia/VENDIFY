// src/services/ProductService.ts
// Camada de I/O (API). Hoje: mock. Amanhã: fetch/axios.

export type ShippingMethodId = "pickup" | "correios" | "carrier";

export interface FreightQuote {
  price: number; // BRL
  eta: string; // estimativa textual
}

export interface ShippingOption {
  id: ShippingMethodId;
  label: string;
  icon: "store" | "truck";
}

export interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
  stock?: number;
  rating?: number;
  ratingsCount?: number;
  paymentMethods?: string[];
  tags?: string[];
  shippingOptions?: ShippingOption[];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ===== Mock (mantém suas regras atuais de frete) =====
async function mockCalcFrete(cep: string, methodId: ShippingMethodId) {
  await sleep(600);
  const first = Number(cep[0] || 9);
  const regionFactor =
    [1.0, 1.05, 1.08, 1.1, 1.12, 1.15, 1.18, 1.2, 1.25, 1.3][first] ?? 1.22;

  if (methodId === "pickup") return { price: 0, eta: "Imediata" };
  if (methodId === "correios") {
    const base = 18 + (first % 5) * 6; // 18–42
    return { price: Math.round(base * regionFactor), eta: "3–7 dias úteis" };
  }
  const base = 25 + (first % 6) * 5; // 25–55
  return { price: Math.round(base * regionFactor), eta: "2–5 dias úteis" };
}

// ===== API pública do Service =====
export async function getProductById(
  id: string | number
): Promise<Product | null> {
  // Depois: GET /products/:id
  const { products } = await import("@common/mocks");
  return products.find((p: any) => String(p.id) === String(id)) ?? null;
}

export async function getRelatedProducts(
  category?: string,
  currentId?: string | number
): Promise<Product[]> {
  // Depois: GET /products?category=...
  const { products } = await import("@common/mocks");
  if (!category) return [];
  return products
    .filter(
      (p: any) => p.category === category && String(p.id) !== String(currentId)
    )
    .slice(0, 8);
}

export async function calcFreightForOptions(
  cep: string,
  options: ShippingOption[]
): Promise<Record<ShippingMethodId, FreightQuote>> {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) throw new Error("CEP inválido");

  const out: Partial<Record<ShippingMethodId, FreightQuote>> = {};
  for (const opt of options) out[opt.id] = await mockCalcFrete(clean, opt.id);
  return out as Record<ShippingMethodId, FreightQuote>;
}

// Stubs para integrações reais (ex.: ViaCEP)
export async function lookupAddress(_cep: string) {
  return null;
}
