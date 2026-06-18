"use client";

import Link from "next/link";
import { Trash2, X } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import SideDrawer from "@/components/ui/side-drawer";
import { formatPrice } from "@/lib/utils/format";
import {
  getCartItemSalePrice,
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
    openCartPanel,
    setOpenCartPanel,
    removeFromCart,
    updateCartQuantity,
    updateCartVariant,
  } = useCart();

  return (
    <SideDrawer
      open={openCartPanel}
      onClose={() => setOpenCartPanel(false)}
      anchor="right"
    >
      <div className="flex h-full flex-col text-white">
        <div className="flex items-center justify-between border-b border-keyshop-line px-5 py-4">
          <h4 className="text-lg font-semibold">Shopping Cart ({cartSummary.count})</h4>
          <button
            type="button"
            onClick={() => setOpenCartPanel(false)}
            className="rounded-lg p-2 hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 ? (
            <p className="py-10 text-center text-sm text-keyshop-muted">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const variants = getPurchaseVariants(item.product);

                return (
                  <div
                    key={`${item.productId}-${item.variant?.id || "default"}`}
                    className="relative flex gap-4 rounded-card border border-keyshop-line bg-white/[0.03] p-3"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-control bg-white/10">
                      <img
                        src={getProductThumbnail(item.product)}
                        alt={getProductDisplayName(item.product)}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 pr-8">
                      <h5 className="line-clamp-2 text-sm font-semibold">
                        {getProductDisplayName(item.product)}
                      </h5>
                      <p className="mt-1 text-xs text-keyshop-muted">
                        {item.product?.vendor || item.product?.brand}
                      </p>

                      {variants.length > 0 ? (
                        <div className="mt-2">
                          <p className="text-xs text-keyshop-muted">
                            {isPhysicalProduct(item.product) ? "Option" : "Key type"}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {variants.map((variant) => (
                              <button
                                key={variant.id}
                                type="button"
                                onClick={() => updateCartVariant(item, variant)}
                                className={cn(
                                  "rounded-full border px-2 py-1 text-[11px]",
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
                        <span className="font-semibold text-keyshop-blue">
                          {formatPrice(getCartItemSalePrice(item) * item.quantity)}
                        </span>
                        <div className="flex items-center rounded-control border border-keyshop-line">
                          <button
                            type="button"
                            className="px-2.5 py-1"
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.variant,
                              )
                            }
                          >
                            -
                          </button>
                          <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="px-2.5 py-1"
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.variant,
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="absolute right-3 top-3 text-keyshop-muted hover:text-red-400"
                      onClick={() => removeFromCart(item.productId, item.variant)}
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
            <div className="mb-4 flex items-center justify-between">
              <span className="text-keyshop-muted">Subtotal</span>
              <h3 className="text-xl font-bold">{formatPrice(cartSummary.subtotal)}</h3>
            </div>
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={() => setOpenCartPanel(false)}
                className="block rounded-control bg-keyshop-blue py-3 text-center text-sm font-semibold text-white hover:bg-keyshop-blue-hover"
              >
                Proceed To Checkout
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpenCartPanel(false)}
                className="block rounded-control border border-keyshop-line py-3 text-center text-sm font-semibold text-white hover:bg-white/5"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </SideDrawer>
  );
}
