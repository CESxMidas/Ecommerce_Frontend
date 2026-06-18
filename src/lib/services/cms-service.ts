import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { AppliedCoupon } from "@/types/cart";

export async function validateCoupon(code: string, subtotal: number) {
  const { data } = await apiClient.post<AppliedCoupon>(
    API_ENDPOINTS.coupons.validate,
    {
      code,
      subtotal,
    },
  );

  return data;
}
