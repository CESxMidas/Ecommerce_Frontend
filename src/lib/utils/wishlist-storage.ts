const GUEST_WISHLIST_KEY = "wishlist:guest";

type WishlistUser = { _id?: string; id?: string; email?: string } | null;

export function getUserWishlistKey(user: WishlistUser = null) {
  const userId = user?._id || user?.id || user?.email;
  return userId ? `wishlist:${String(userId)}` : GUEST_WISHLIST_KEY;
}

export function loadWishlist(user: WishlistUser = null) {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(getUserWishlistKey(user));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items: unknown[], user: WishlistUser = null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getUserWishlistKey(user), JSON.stringify(items));
}

export function clearStoredWishlist(user: WishlistUser = null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getUserWishlistKey(user), JSON.stringify([]));
}
