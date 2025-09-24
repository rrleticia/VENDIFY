// app/common/boot/persistProducts.ts
import { products } from "@common/mocks";
import { loadJSON, STORAGE_KEYS } from "@services/helpers/storage";

// Replace contents of products array with persisted estado, if present
const persisted = loadJSON<typeof products | null>(STORAGE_KEYS.products, null);
if (persisted && Array.isArray(persisted)) {
  // mutate in place to keep references intact
  (products as any).splice(0, (products as any).length, ...persisted);
}
