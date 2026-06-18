const GUEST_WISHLIST_KEY = "wishlist:guest";

export function getUserWishlistKey(user) {
  const userId = user?._id || user?.id || user?.email;

  return userId ? `wishlist:${String(userId)}` : GUEST_WISHLIST_KEY;
}

export function loadWishlist(user = null) {
  try {
    const raw = localStorage.getItem(getUserWishlistKey(user));

    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items, user = null) {
  localStorage.setItem(getUserWishlistKey(user), JSON.stringify(items));
}
