// services/ProductService.ts
import { API_URL } from "./config";
import { fetchWithAuth } from "./fetchWithAuth";

export async function getProducts() {
  const response = await fetchWithAuth(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
}
