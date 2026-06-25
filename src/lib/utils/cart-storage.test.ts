import { beforeEach, describe, expect, it } from "vitest";

import {
  calcCartSummary,
  getPayableCartTotal,
  getUserCartKey,
  loadCart,
  saveCart,
} from "@/lib/utils/cart-storage";
import { mockCartItem } from "@/test/fixtures/commerce";

describe("cart-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("calculates cart totals correctly", () => {
    const items = [mockCartItem(2), mockCartItem(1)];
    items[1].productId = "990002";
    items[1].product = { ...items[0].product, salePrice: 100000, price: 100000 };

    const summary = calcCartSummary(items);

    expect(summary.count).toBe(3);
    expect(summary.subtotal).toBe(199000 * 2 + 100000);
    expect(summary.total).toBe(summary.subtotal);
  });

  it("persists guest cart in localStorage", () => {
    const items = [mockCartItem(1)];
    saveCart(items, null);

    expect(loadCart(null)).toHaveLength(1);
    expect(getUserCartKey(null)).toBe("cart:guest");
  });

  it("applies coupon total when subtotal matches", () => {
    const summary = calcCartSummary([mockCartItem(2)]);

    const payable = getPayableCartTotal(summary, {
      code: "QA10",
      type: "percent",
      value: 10,
      discount: 39800,
      subtotal: summary.subtotal,
      total: summary.subtotal - 39800,
    });

    expect(payable).toBe(summary.subtotal - 39800);
  });

  it("returns empty cart when storage is corrupted", () => {
    localStorage.setItem("cart:guest", "{invalid-json");
    expect(loadCart(null)).toEqual([]);
  });
});
