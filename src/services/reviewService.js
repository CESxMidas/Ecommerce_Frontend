import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export async function fetchProductReviews(productId) {
  const { data } = await apiClient.get(
    API_ENDPOINTS.products.reviews(productId),
    { skipAuth: true },
  );

  return data;
}

export async function submitProductReview(productId, payload) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.products.reviews(productId),
    payload,
  );

  return data;
}
