const WISHLIST_KEY = "wishlist";

export function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);

    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}
