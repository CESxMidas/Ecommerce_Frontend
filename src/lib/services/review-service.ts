import apiClient, { type ApiRequestConfig } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export type ProductReview = {
  id?: string;
  _id?: string;
  rating: number;
  comment?: string;
  userName?: string;
  createdAt?: string;
};

export async function fetchProductReviews(productId: string) {
  const { data } = await apiClient.get<ProductReview[]>(
    API_ENDPOINTS.products.reviews(productId),
    { skipAuth: true } as ApiRequestConfig,
  );

  return Array.isArray(data) ? data : [];
}

export async function submitProductReview(
  productId: string,
  payload: { rating: number; comment: string },
) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.products.reviews(productId),
    payload,
  );

  return data;
}
