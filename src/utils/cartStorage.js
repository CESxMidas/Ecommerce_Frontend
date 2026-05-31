import { getCartItemListPrice, getCartItemSalePrice } from "./productSchema";

const CART_KEY = "cart";

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);

    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function calcCartSummary(items) {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + getCartItemSalePrice(item) * item.quantity,
    0,
  );

  const savings = items.reduce((sum, item) => {
    const list = getCartItemListPrice(item);
    const sale = getCartItemSalePrice(item);

    if (!list) {
      return sum;
    }

    return sum + Math.max(0, list - sale) * item.quantity;
  }, 0);

  const tax = subtotal > 0 ? 2 : 0;
  const total = Math.max(0, subtotal + tax);

  return {
    count,
    subtotal,
    savings,
    tax,
    total,
  };
}
