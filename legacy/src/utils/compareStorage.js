import { normalizeProduct } from "./productSchema";

const COMPARE_KEY = "compareProducts";
const MAX_COMPARE_ITEMS = 4;

export function loadCompare() {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.map(normalizeProduct).filter(Boolean).slice(0, MAX_COMPARE_ITEMS)
      : [];
  } catch {
    return [];
  }
}

export function saveCompare(items) {
  localStorage.setItem(
    COMPARE_KEY,
    JSON.stringify((items || []).slice(0, MAX_COMPARE_ITEMS)),
  );
}

export { MAX_COMPARE_ITEMS };
