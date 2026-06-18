"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import type { Product } from "@/types/api";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Button
      type="button"
      onClick={() => addToCart(product as unknown as Record<string, unknown>, 1)}
    >
      Add to Cart
    </Button>
  );
}
