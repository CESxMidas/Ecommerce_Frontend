import { tOrderStatus, tPaymentMethod, tPaymentStatus } from "@/lib/constants/vi";
import type { Order } from "@/lib/services/order-service";

type OrderStatusFields = Pick<
  Order,
  "status" | "statusLabel" | "paymentStatus" | "paymentStatusLabel" | "paymentMethod"
>;

/** Nhãn trạng thái đơn hiển thị cho khách — ưu tiên nhãn từ API, fallback Việt hóa */
export function formatOrderDisplayStatus(order: OrderStatusFields) {
  if (order.paymentStatus === "failed") {
    return order.paymentStatusLabel ?? tPaymentStatus("failed");
  }

  if (order.status === "PendingPayment") {
    return order.statusLabel ?? tOrderStatus("PendingPayment");
  }

  if (order.paymentStatus === "pending" && order.paymentMethod === "vnpay") {
    return "Đang chờ thanh toán";
  }

  if (order.statusLabel) {
    return order.statusLabel;
  }

  if (order.status) {
    return tOrderStatus(order.status);
  }

  if (order.paymentStatus) {
    return order.paymentStatusLabel ?? tPaymentStatus(order.paymentStatus);
  }

  return "—";
}

export function formatOrderPaymentStatus(order: OrderStatusFields) {
  if (order.paymentStatusLabel) {
    return order.paymentStatusLabel;
  }

  if (order.paymentStatus) {
    return tPaymentStatus(order.paymentStatus);
  }

  if (order.paymentMethod) {
    return tPaymentMethod(order.paymentMethod);
  }

  return "Chờ thanh toán";
}

export function formatOrderPaymentSummary(order: OrderStatusFields) {
  const method = order.paymentMethod ? tPaymentMethod(order.paymentMethod) : null;
  const status = formatOrderPaymentStatus(order);

  if (method && status !== "—") {
    return `${method} · ${status}`;
  }

  return method || status;
}
