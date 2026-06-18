import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { normalizeProducts } from "../utils/productSchema";

export async function fetchWishlist() {
  const { data } = await apiClient.get(API_ENDPOINTS.wishlist.root);

  return normalizeProducts(data);
}

export async function replaceWishlist(productIds = []) {
  const { data } = await apiClient.put(API_ENDPOINTS.wishlist.root, {
    productIds,
  });

  return normalizeProducts(data);
}

export async function addToWishlist(productId) {
  const { data } = await apiClient.post(API_ENDPOINTS.wishlist.root, {
    productId,
  });

  return normalizeProducts(data);
}

export async function removeFromWishlist(productId) {
  const { data } = await apiClient.delete(
    API_ENDPOINTS.wishlist.item(productId),
  );

  return normalizeProducts(data);
}
