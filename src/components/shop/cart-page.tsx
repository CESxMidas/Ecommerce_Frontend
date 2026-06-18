"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useCart } from "@/components/providers/cart-provider";
import { validateCoupon } from "@/lib/services/cms-service";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/format";
import {
  computeDiscountLabel,
  getCartItemListPrice,
  getCartItemSalePrice,
  getDeliveryLabel,
  getProductDisplayName,
  getProductThumbnail,
  getPurchaseVariants,
  isPhysicalProduct,
} from "@/lib/utils/product-schema";
import type { AppliedCoupon } from "@/types/cart";

const checkoutCtaClass =
  "flex h-[58px] w-full items-center justify-center rounded-[18px] bg-gradient-to-br from-keyshop-blue-hover to-keyshop-blue text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-glow";

export default function CartPageClient() {
  const {
    cartItems,
    cartSummary,
    isAuthenticated,
    removeFromCart,
    updateCartQuantity,
    updateCartVariant,
  } = useCart();

  const isEmpty = cartItems.length === 0;
  const hasDigitalItems = cartItems.some(
    (item) => !isPhysicalProduct(item.product),
  );

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      return JSON.parse(localStorage.getItem("appliedCoupon") || "null");
    } catch {
      return null;
    }
  });

  const hasValidCoupon =
    appliedCoupon &&
    cartSummary.subtotal > 0 &&
    Number(appliedCoupon.subtotal) === Number(cartSummary.subtotal);
  const effectiveCoupon = hasValidCoupon ? appliedCoupon : null;

  useEffect(() => {
    if (appliedCoupon && !hasValidCoupon) {
      localStorage.removeItem("appliedCoupon");
    }
  }, [appliedCoupon, hasValidCoupon]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter a coupon code");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to apply a coupon");
      return;
    }

    try {
      const result = await validateCoupon(couponCode.trim(), cartSummary.subtotal);

      localStorage.setItem("appliedCoupon", JSON.stringify(result));
      setAppliedCoupon(result);
      toast.success("Coupon applied");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid coupon");
    }
  };

  const displayTotal = effectiveCoupon
    ? effectiveCoupon.total + (cartSummary.subtotal > 0 ? 2 : 0)
    : cartSummary.total;

  return (
    <section className="container py-10 pb-16 md:py-[50px]">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-white md:text-[42px]">Shopping Cart</h1>
          <p className="mt-1 text-[15px] text-keyshop-muted">
            You have {cartSummary.count} item{cartSummary.count !== 1 ? "s" : ""} in your cart
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex h-[52px] items-center gap-2.5 rounded-control border border-keyshop-line bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-keyshop-blue-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      {isEmpty ? (
        <div className="rounded-card border border-dashed border-keyshop-line py-16 text-center">
          <p className="text-keyshop-muted">Your cart is empty.</p>
          <Link href="/products" className={cn(checkoutCtaClass, "mx-auto mt-4 max-w-xs")}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const variants = getPurchaseVariants(item.product);
              const itemSalePrice = getCartItemSalePrice(item);
              const itemListPrice = getCartItemListPrice(item);
              const vendor = (item.product.vendor || item.product.brand || "").toUpperCase();

              return (
                <div
                  key={`${item.productId}-${item.variant?.id || "default"}`}
                  className="rounded-card border border-keyshop-line bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-keyshop-blue/35 hover:bg-white/[0.045]"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start">
                    <div className="group relative mx-auto h-[140px] w-full shrink-0 overflow-hidden rounded-[18px] bg-white/10 md:mx-0 md:h-[140px] md:w-[150px]">
                      <Image
                        src={getProductThumbnail(item.product)}
                        alt={getProductDisplayName(item.product)}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="150px"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div>
                        {vendor ? (
                          <span className="inline-flex rounded-full border border-keyshop-blue/20 bg-keyshop-blue/15 px-3.5 py-2 text-xs font-bold text-sky-400">
                            {vendor}
                          </span>
                        ) : null}
                        <h3 className="mt-2 line-clamp-2 text-2xl font-bold text-white">
                          {getProductDisplayName(item.product)}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-keyshop-muted">
                          <span>{getDeliveryLabel(item.product)}</span>
                          <span>
                            {isPhysicalProduct(item.product)
                              ? "COD eligible"
                              : "VNPay required"}
                          </span>
                        </div>
                      </div>

                      {variants.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-keyshop-muted">
                            {isPhysicalProduct(item.product) ? "Option" : "Key type"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {variants.map((variant) => {
                              const isActive = item.variant?.id === variant.id;
                              const color = variant.color;

                              return (
                                <button
                                  key={variant.id}
                                  type="button"
                                  className={cn(
                                    "rounded-full border px-3 py-2 text-left text-xs font-extrabold transition",
                                    isActive
                                      ? "border-keyshop-blue bg-keyshop-blue/20 text-white"
                                      : "border-keyshop-line bg-white/[0.03] text-white/80 hover:border-keyshop-blue/40",
                                  )}
                                  onClick={() => updateCartVariant(item, variant)}
                                >
                                  <span className="flex items-center gap-2">
                                    {color ? (
                                      <span
                                        className="h-3.5 w-3.5 rounded-full border-2 border-white/75"
                                        style={{ backgroundColor: color }}
                                      />
                                    ) : null}
                                    {variant.name}
                                  </span>
                                  <span className="mt-1 block text-keyshop-blue">
                                    {formatPrice(variant.price)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}

                      <div className="flex flex-wrap items-center gap-2">
                        {itemListPrice != null ? (
                          <span className="text-2xl text-white/35 line-through">
                            {formatPrice(itemListPrice)}
                          </span>
                        ) : null}
                        <span className="text-[28px] font-extrabold text-keyshop-blue">
                          {formatPrice(itemSalePrice)}
                        </span>
                        {!item.variant && computeDiscountLabel(item.product) ? (
                          <span className="rounded-full bg-red-500/15 px-3 py-1.5 text-sm font-bold text-red-400">
                            {computeDiscountLabel(item.product)}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                      <div className="flex items-center rounded-2xl border border-keyshop-line bg-white/[0.04]">
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center text-white transition hover:bg-white/8"
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variant,
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-10 text-center font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center text-white transition hover:bg-white/8"
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variant,
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-2xl font-extrabold text-white">
                        {formatPrice(itemSalePrice * item.quantity)}
                      </p>

                      <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/15 text-red-400 transition hover:bg-red-500 hover:text-white"
                        onClick={() => removeFromCart(item.productId, item.variant)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-fit rounded-card border border-keyshop-line bg-white/[0.03] p-7 backdrop-blur-md lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-white">Order Summary</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-keyshop-muted">Subtotal</span>
                <span className="text-white">{formatPrice(cartSummary.subtotal)}</span>
              </div>

              {cartSummary.savings > 0 ? (
                <div className="flex justify-between">
                  <span className="text-keyshop-muted">Discount</span>
                  <span className="text-keyshop-green">
                    -{formatPrice(cartSummary.savings)}
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between">
                <span className="text-keyshop-muted">Delivery</span>
                <span className="text-white">Included</span>
              </div>

              {cartSummary.tax > 0 ? (
                <div className="flex justify-between">
                  <span className="text-keyshop-muted">Tax</span>
                  <span className="text-white">{formatPrice(cartSummary.tax)}</span>
                </div>
              ) : null}

              {effectiveCoupon?.discount ? (
                <div className="flex justify-between">
                  <span className="text-keyshop-muted">
                    Coupon ({effectiveCoupon.code})
                  </span>
                  <span className="text-keyshop-green">
                    -{formatPrice(effectiveCoupon.discount)}
                  </span>
                </div>
              ) : null}

              <div className="my-6 h-px bg-keyshop-line" />

              <div className="flex justify-between text-2xl font-extrabold text-white">
                <span>Total</span>
                <span>{formatPrice(displayTotal)}</span>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  className="h-14 flex-1 rounded-2xl border border-keyshop-line bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-keyshop-blue focus:ring-4 focus:ring-keyshop-blue/15"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="h-14 min-w-24 rounded-2xl bg-keyshop-blue-hover px-5 text-sm font-bold text-white transition hover:bg-keyshop-blue"
                >
                  Apply
                </button>
              </div>

              <Link href="/checkout" className={checkoutCtaClass}>
                Proceed to secure checkout
              </Link>

              <div className="rounded-[14px] border border-sky-400/20 bg-keyshop-blue/10 px-3 py-2.5 text-center text-[13px] text-keyshop-muted">
                <div className="flex items-start justify-center gap-2">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                  <span>
                    {hasDigitalItems
                      ? "Digital products require online payment before delivery"
                      : "VNPay or COD available for physical products"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
