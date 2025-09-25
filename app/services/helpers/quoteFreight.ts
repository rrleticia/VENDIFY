import { API_URL, USE_CORREIOS } from "./config";

type QuoteMap = Partial<Record<string, { id: string; label: string; price: number; etaDays: number }>>;

/**
 * Quote freight for given shipping option ids and cep.
 * If environment variable VITE_USE_CORREIOS is set, this will attempt to call
 * a Correios-compatible endpoint under the configured API_URL (developer must provide it).
 * Otherwise falls back to a simple local mock.
 */
export async function quoteFreight(optionIds: string[], cep: string): Promise<QuoteMap> {
  if (USE_CORREIOS) {
    try {
      const res = await fetch(`${API_URL}/freight/correios/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIds, cep }),
      });
      if (!res.ok) throw new Error("Correios quote failed");
      const data = await res.json();
      // expect data to be an array of { id, label, price, etaDays }
      const map: QuoteMap = {};
      for (const d of data) map[d.id] = { id: d.id, label: d.label, price: Number(d.price), etaDays: Number(d.etaDays ?? 0) };
      return map;
    } catch (e) {
      // fallback to local mock
      console.warn("Correios quote failed, falling back to mock", e);
    }
  }

  // local mock: simple deterministic prices based on option id
  const map: QuoteMap = {};
  for (const id of optionIds) {
    if (id === "pickup") map[id] = { id, label: "Retirada no local", price: 0, etaDays: 0 };
    else if (id === "correios") map[id] = { id, label: "Correios", price: 29.9, etaDays: 6 };
    else if (id === "carrier") map[id] = { id, label: "Transportadora", price: 39.9, etaDays: 3 };
    else map[id] = { id, label: id, price: 19.9, etaDays: 5 };
  }
  return map;
}

export type { QuoteMap };
