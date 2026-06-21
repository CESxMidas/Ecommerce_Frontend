"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useCartCore } from "@/components/providers/cart-provider";
import { useCartUi } from "@/components/providers/cart-ui-provider";
import SideDrawer from "@/components/ui/side-drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { checkoutCtaCompactClass } from "@/lib/ui/tokens";
import { formatPrice } from "@/lib/utils/format";
import {
  getCartItemSalePrice,
  getDeliveryLabel,
  getProductDisplayName,
  getProductThumbnail,
  getPurchaseVariants,
  isPhysicalProduct,
} from "@/lib/utils/product-schema";
import { cn } from "@/lib/utils";

export default function CartPanel() {
  const {
    cartItems,
    cartSummary,
    removeFromCart,
    updateCartQuantity,
    updateCartVariant,
  } = useCartCore();
  const { openCartPanel, setOpenCartPanel } = useCartUi();

  return (
    <SideDrawer
      open={openCartPanel}
      onClose={() => setOpenCartPanel(false)}
      anchor="right"
    >
      <div className="flex h-full flex-col text-white">
        <div className="flex items-center justify-between border-b border-keyshop-line px-5 py-4">
          <h4 className="text-lg font-extrabold">
            Giỏ hàng ({cartSummary.count})
          </h4>
          <button
            type="button"
            onClick={() => setOpenCartPanel(false)}
            className="rounded-lg p-2 hover:bg-white/5"
            aria-label="Đóng giỏ hàng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="keyshop-scrollbar flex-1 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Giỏ hàng trống"
              description="Thêm sản phẩm để bắt đầu thanh toán."
              actionLabel="Xem sản phẩm"
              actionHref="/products"
              className="border-none py-8"
            />
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const variants = getPurchaseVariants(item.product);
                const vendor = (item.product.vendor || item.product.brand || "").toUpperCase();

                return (
                  <div
                    key={`${item.productId}-${item.variant?.id || "default"}`}
                    className="relative rounded-card border border-keyshop-line bg-white/[0.03] p-3"
                  >
                    <div className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-control bg-white/10">
                        <Image
                          src={getProductThumbnail(item.product)}
                          alt={getProductDisplayName(item.product)}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      <div className="min-w-0 flex-1 pr-6">
                        {vendor ? (
                          <span className="inline-flex rounded-full border border-keyshop-blue/20 bg-keyshop-blue/15 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                            {vendor}
                          </span>
                        ) : null}
                        <h5 className="mt-1 line-clamp-2 text-sm font-bold">
                          {getProductDisplayName(item.product)}
                        </h5>
                        <p className="mt-1 text-[11px] text-keyshop-muted">
                          {getDeliveryLabel(item.product)}
                        </p>

                        {variants.length > 0 ? (
                          <div className="mt-2">
                            <p className="text-[11px] text-keyshop-muted">
                              {isPhysicalProduct(item.product) ? "Tùy chọn" : "Loại key"}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {variants.map((variant) => (
                                <button
                                  key={variant.id}
                                  type="button"
                                  onClick={() => updateCartVariant(item, variant)}
                                  className={cn(
                                    "rounded-full border px-2 py-1 text-[10px] font-extrabold",
                                    item.variant?.id === variant.id
                                      ? "border-keyshop-blue bg-keyshop-blue/20 text-white"
                                      : "border-keyshop-line text-keyshop-muted",
                                  )}
                                >
                                  {variant.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="font-extrabold text-sky-400">
                            {formatPrice(getCartItemSalePrice(item) * item.quantity)}
                          </span>
                          <div className="flex items-center rounded-control border border-keyshop-line">
                            <button
                              type="button"
                              className="px-2 py-1"
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.variant,
                                )
                              }
                              aria-label="Giảm số lượng"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-6 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="px-2 py-1"
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item.variant,
                                )
                              }
                              aria-label="Tăng số lượng"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="absolute right-3 top-3 text-keyshop-muted hover:text-red-400"
                      onClick={() => removeFromCart(item.productId, item.variant)}
                      aria-label="Xóa sản phẩm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 ? (
          <div className="border-t border-keyshop-line p-5">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-keyshop-muted">Tạm tính</span>
              <span className="text-xl font-extrabold">
                {formatPrice(cartSummary.subtotal)}
              </span>
            </div>
            {cartSummary.savings > 0 ? (
              <p className="mb-4 text-right text-xs font-semibold text-keyshop-green">
                Tiết kiệm {formatPrice(cartSummary.savings)}
              </p>
            ) : (
              <div className="mb-4" />
            )}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={() => setOpenCartPanel(false)}
                className={checkoutCtaCompactClass}
              >
                Thanh toán
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpenCartPanel(false)}
                className="keyshop-interactive flex h-[52px] w-full cursor-pointer items-center justify-center rounded-control border border-keyshop-line text-sm font-bold text-white transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/25"
              >
                Xem giỏ đầy đủ
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </SideDrawer>
  );
}
