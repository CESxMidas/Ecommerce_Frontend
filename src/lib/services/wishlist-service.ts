import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { normalizeProduct } from "@/lib/utils/product-schema";
import type { NormalizedProduct } from "@/types/cart";

function normalizeWishlistItems(
  items: Record<string, unknown>[] = [],
): NormalizedProduct[] {
  const result: NormalizedProduct[] = [];

  for (const item of items) {
    const normalized = normalizeProduct(item);

    if (normalized) {
      result.push(normalized);
    }
  }

  return result;
}

export async function fetchWishlist() {
  const { data } = await apiClient.get<Record<string, unknown>[]>(
    API_ENDPOINTS.wishlist.root,
  );

  return normalizeWishlistItems(data);
}

export async function addToWishlist(productId: string | number) {
  const { data } = await apiClient.post<Record<string, unknown>[]>(
    API_ENDPOINTS.wishlist.root,
    { productId: Number(productId) },
  );

  return normalizeWishlistItems(data);
}

export async function removeFromWishlist(productId: string | number) {
  const { data } = await apiClient.delete<Record<string, unknown>[]>(
    API_ENDPOINTS.wishlist.item(String(productId)),
  );

  return normalizeWishlistItems(data);
}

export async function replaceWishlist(productIds: Array<string | number>) {
  const { data } = await apiClient.put<Record<string, unknown>[]>(
    API_ENDPOINTS.wishlist.root,
    {
      productIds: productIds.map((id) => Number(id)),
    },
  );

  return normalizeWishlistItems(data);
}
