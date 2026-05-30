import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { normalizeProduct } from "../utils/productSchema";

function normalizeCartItems(items = []) {
  return items.map((item) => ({
    ...item,
    product: normalizeProduct(item.product),
  }));
}

export async function fetchCart() {
  const { data } = await apiClient.get(API_ENDPOINTS.cart.root);

  return normalizeCartItems(data);
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await apiClient.post(API_ENDPOINTS.cart.root, {
    productId,
    quantity,
  });

  return normalizeCartItems(data);
}

export async function updateCartItem(productId, quantity) {
  const { data } = await apiClient.put(
    API_ENDPOINTS.cart.item(productId),
    { quantity },
  );

  return normalizeCartItems(data);
}

export async function removeFromCart(productId) {
  const { data } = await apiClient.delete(
    API_ENDPOINTS.cart.item(productId),
  );

  return normalizeCartItems(data);
}

export async function replaceCart(items) {
  const { data } = await apiClient.put(API_ENDPOINTS.cart.root, {
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  });

  return normalizeCartItems(data);
}
