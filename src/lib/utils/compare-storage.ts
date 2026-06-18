import { normalizeProduct } from "@/lib/utils/product-schema";
import type { NormalizedProduct } from "@/types/cart";

const COMPARE_KEY = "compareProducts";
export const MAX_COMPARE_ITEMS = 4;

export function loadCompare(): NormalizedProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    const items: NormalizedProduct[] = [];

    for (const entry of parsed) {
      const normalized = normalizeProduct(entry as Record<string, unknown>);
      if (normalized) {
        items.push(normalized);
      }
      if (items.length >= MAX_COMPARE_ITEMS) {
        break;
      }
    }

    return items;
  } catch {
    return [];
  }
}

export function saveCompare(items: NormalizedProduct[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    COMPARE_KEY,
    JSON.stringify((items || []).slice(0, MAX_COMPARE_ITEMS)),
  );
}
