import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export async function validateCoupon(code, subtotal) {
  const { data } = await apiClient.post(API_ENDPOINTS.coupons.validate, {
    code,
    subtotal,
  });

  return data;
}

export async function fetchBanners(placement) {
  const { data } = await apiClient.get(API_ENDPOINTS.banners.list, {
    params: placement ? { placement } : {},
  });

  return data;
}

export async function fetchBlogs() {
  const { data } = await apiClient.get(API_ENDPOINTS.blogs.list);

  return data;
}

export async function fetchBlogById(id) {
  const { data } = await apiClient.get(API_ENDPOINTS.blogs.detail(id));

  return data;
}
