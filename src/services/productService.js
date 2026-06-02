import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { normalizeProduct, normalizeProducts } from "../utils/productSchema";

export async function fetchProducts(params = {}) {
  const { data } = await apiClient.get(API_ENDPOINTS.products.list, {
    params,
  });

  if (data && Array.isArray(data.items)) {
    return normalizeProducts(data.items);
  }

  return normalizeProducts(data);
}

export async function fetchProductById(idOrSlug) {
  const { data } = await apiClient.get(
    API_ENDPOINTS.products.detail(idOrSlug),
  );

  return normalizeProduct(data);
}
