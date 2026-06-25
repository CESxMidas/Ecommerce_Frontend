/** Nhãn tiếng Việt — storefront */

export const ORDER_STATUS_VI: Record<string, string> = {
  PendingPayment: "Chờ thanh toán",
  Processing: "Đang xử lý",
  Shipped: "Đang giao hàng",
  Delivered: "Đã giao hàng",
  Cancelled: "Đã hủy",
  Failed: "Thất bại",
  Refunded: "Đã hoàn tiền",
  Pending: "Chờ xử lý",
};

export const PAYMENT_STATUS_VI: Record<string, string> = {
  paid: "Đã thanh toán",
  pending: "Chờ thanh toán",
  awaiting_cod: "Chờ thu COD",
  failed: "Thanh toán thất bại",
  refunded: "Đã hoàn tiền",
};

export const PAYMENT_METHOD_VI: Record<string, string> = {
  vnpay: "VNPay",
  momo: "MoMo",
  cod: "Thanh toán khi nhận (COD)",
  stripe: "Stripe",
  paypal: "PayPal",
  bank_transfer: "Chuyển khoản",
};

export const TICKET_STATUS_VI: Record<string, string> = {
  open: "Mới",
  pending: "Chờ phản hồi",
  resolved: "Đã xử lý",
  closed: "Đã đóng",
};

export const TICKET_PRIORITY_VI: Record<string, string> = {
  low: "Thấp",
  normal: "Bình thường",
  high: "Cao",
};

export const AUTHOR_ROLE_VI: Record<string, string> = {
  USER: "Bạn",
  CUSTOMER: "Bạn",
  ADMIN: "Quản trị",
  OWNER: "Quản trị",
  MANAGER: "Nhân viên hỗ trợ",
  STAFF: "Nhân viên hỗ trợ",
};

export function tOrderStatus(status?: string | null) {
  if (!status) return "—";
  return ORDER_STATUS_VI[status] ?? status;
}

export function tPaymentStatus(status?: string | null) {
  if (!status) return "—";
  return PAYMENT_STATUS_VI[status] ?? status;
}

export function tPaymentMethod(method?: string | null) {
  if (!method) return "—";
  return PAYMENT_METHOD_VI[method.toLowerCase()] ?? method;
}

export function tTicketStatus(status?: string | null) {
  if (!status) return "—";
  return TICKET_STATUS_VI[status] ?? status;
}

export function tTicketPriority(priority?: string | null) {
  if (!priority) return "—";
  return TICKET_PRIORITY_VI[priority] ?? priority;
}

export function tAuthorRole(role?: string | null) {
  if (!role) return "—";
  return AUTHOR_ROLE_VI[role] ?? role;
}
