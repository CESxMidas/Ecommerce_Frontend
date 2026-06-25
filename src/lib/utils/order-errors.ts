import {
  getToastErrorMessage,
  translateToastMessage,
} from "@/lib/utils/toast-error";

export function translateOrderError(
  message: string,
  fallback = "Không thể đặt hàng",
) {
  return translateToastMessage(message, fallback);
}

export function getCheckoutErrorMessage(
  error: unknown,
  fallback = "Không thể đặt hàng",
) {
  return getToastErrorMessage(error, fallback);
}

export function getAddToCartErrorMessage(productName: string) {
  return `Sản phẩm "${productName}" đã hết key/hết hàng.`;
}
