const ORDER_ERROR_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /hết key trong kho/i,
    message: "Sản phẩm đã hết key trong kho. Vui lòng thử lại sau.",
  },
  {
    pattern: /không đủ key trong kho/i,
    message: "Sản phẩm đã hết key trong kho. Vui lòng thử lại sau.",
  },
  {
    pattern: /not enough license keys in pool/i,
    message: "Sản phẩm đã hết key trong kho. Vui lòng thử lại sau.",
  },
  {
    pattern: /hết hàng/i,
    message: "Sản phẩm đã hết hàng.",
  },
  {
    pattern: /insufficient stock/i,
    message: "Sản phẩm đã hết hàng.",
  },
  {
    pattern: /stock failed/i,
    message: "Không đủ tồn kho để hoàn tất đơn hàng.",
  },
];

export function translateOrderError(message: string, fallback = "Không thể đặt hàng") {
  const trimmed = message.trim();

  if (!trimmed) {
    return fallback;
  }

  for (const entry of ORDER_ERROR_PATTERNS) {
    if (entry.pattern.test(trimmed)) {
      return entry.message;
    }
  }

  return trimmed;
}

export function getCheckoutErrorMessage(error: unknown, fallback = "Không thể đặt hàng") {
  if (error instanceof Error && error.message) {
    return translateOrderError(error.message, fallback);
  }

  return fallback;
}

export function getAddToCartErrorMessage(productName: string) {
  return `Sản phẩm "${productName}" đã hết key/hết hàng.`;
}
