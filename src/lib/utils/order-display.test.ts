import { describe, expect, it } from "vitest";

import {
  formatOrderDisplayStatus,
  formatOrderPaymentStatus,
  formatOrderPaymentSummary,
} from "@/lib/utils/order-display";

describe("order-display", () => {
  it("việt hóa trạng thái đơn từ API label", () => {
    expect(
      formatOrderDisplayStatus({
        status: "Processing",
        statusLabel: "Đang xử lý",
        paymentStatus: "paid",
      }),
    ).toBe("Đang xử lý");
  });

  it("việt hóa trạng thái đơn khi không có label từ API", () => {
    expect(
      formatOrderDisplayStatus({
        status: "Delivered",
        paymentStatus: "paid",
      }),
    ).toBe("Đã giao hàng");
  });

  it("ưu tiên thất bại thanh toán", () => {
    expect(
      formatOrderDisplayStatus({
        status: "PendingPayment",
        paymentStatus: "failed",
      }),
    ).toBe("Thanh toán thất bại");
  });

  it("việt hóa trạng thái thanh toán", () => {
    expect(
      formatOrderPaymentStatus({
        paymentStatus: "paid",
        paymentStatusLabel: "Đã thanh toán",
      }),
    ).toBe("Đã thanh toán");

    expect(
      formatOrderPaymentStatus({
        paymentStatus: "pending",
      }),
    ).toBe("Chờ thanh toán");
  });

  it("tổng hợp phương thức và trạng thái thanh toán", () => {
    expect(
      formatOrderPaymentSummary({
        paymentMethod: "vnpay",
        paymentStatus: "paid",
        paymentStatusLabel: "Đã thanh toán",
      }),
    ).toBe("VNPay · Đã thanh toán");
  });
});
