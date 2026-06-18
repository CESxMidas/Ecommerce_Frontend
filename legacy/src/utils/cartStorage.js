import { getCartItemListPrice, getCartItemSalePrice } from "./productSchema";

const LEGACY_CART_KEY = "cart";
const GUEST_CART_KEY = "cart:guest";
const COMPLETED_CHECKOUT_KEY = "completedCheckoutAt";

export function getUserCartKey(user = null) {
  const userId = user?._id || user?.id || user?.email;

  return userId ? `cart:${String(userId)}` : GUEST_CART_KEY;
}

function migrateLegacyGuestCart() {
  const legacyCart = localStorage.getItem(LEGACY_CART_KEY);

  if (legacyCart && !localStorage.getItem(GUEST_CART_KEY)) {
    localStorage.setItem(GUEST_CART_KEY, legacyCart);
  }

  if (legacyCart) {
    localStorage.removeItem(LEGACY_CART_KEY);
  }
}

export function loadCart(user = null) {
  try {
    if (!user) {
      migrateLegacyGuestCart();
    }

    const raw = localStorage.getItem(getUserCartKey(user));

    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items, user = null) {
  localStorage.setItem(getUserCartKey(user), JSON.stringify(items));
}

export function clearStoredCart(user = null) {
  localStorage.setItem(getUserCartKey(user), JSON.stringify([]));
}

export function markCheckoutCompleted() {
  localStorage.setItem(COMPLETED_CHECKOUT_KEY, String(Date.now()));
}

export function consumeCheckoutCompleted() {
  const value = localStorage.getItem(COMPLETED_CHECKOUT_KEY);

  if (value) {
    localStorage.removeItem(COMPLETED_CHECKOUT_KEY);
  }

  return Boolean(value);
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
