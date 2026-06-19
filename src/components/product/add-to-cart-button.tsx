"use client";

import { useCart } from "@/components/providers/cart-provider";
import type { Product } from "@/types/api";
import { cn } from "@/lib/utils";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product as unknown as Record<string, unknown>, 1)}
      className={cn(
        "inline-flex min-h-[42px] items-center justify-center rounded-control px-4 text-xs font-extrabold uppercase tracking-wide",
        "bg-keyshop-blue-hover text-white transition hover:bg-keyshop-blue",
      )}
    >
      Add to cart
    </button>
  );
}
