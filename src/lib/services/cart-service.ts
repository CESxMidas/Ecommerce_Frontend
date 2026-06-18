import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { normalizeProduct } from "@/lib/utils/product-schema";
import type { CartItem } from "@/types/cart";

function normalizeCartItems(items: CartItem[] = []) {
  return items.map((item) => ({
    ...item,
    product: normalizeProduct(item.product as unknown as Record<string, unknown>)!,
  }));
}

export async function fetchCart() {
  const { data } = await apiClient.get<CartItem[]>(API_ENDPOINTS.cart.root);

  return normalizeCartItems(data);
}

export async function addToCart(
  productId: string,
  quantity = 1,
  variant: CartItem["variant"] = null,
) {
  const { data } = await apiClient.post<CartItem[]>(API_ENDPOINTS.cart.root, {
    productId,
    quantity,
    variant,
  });

  return normalizeCartItems(data);
}

export async function updateCartItem(
  productId: string,
  quantity: number,
  variant: CartItem["variant"] = null,
) {
  const { data } = await apiClient.put<CartItem[]>(
    API_ENDPOINTS.cart.item(productId),
    {
      quantity,
      variant,
      variantId: variant?.id || "",
    },
  );

  return normalizeCartItems(data);
}

export async function removeFromCart(
  productId: string,
  variant: CartItem["variant"] = null,
) {
  const { data } = await apiClient.delete<CartItem[]>(
    API_ENDPOINTS.cart.item(productId),
    {
      params: { variantId: variant?.id || "" },
    },
  );

  return normalizeCartItems(data);
}

export async function replaceCart(items: CartItem[]) {
  const { data } = await apiClient.put<CartItem[]>(API_ENDPOINTS.cart.root, {
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      variant: item.variant || null,
    })),
  });

  return normalizeCartItems(data);
}
