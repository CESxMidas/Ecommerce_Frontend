import type { Metadata } from "next";

import CartPageClient from "@/components/shop/cart-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Shopping Cart",
  "Review items in your KEYSHOP cart before checkout.",
);

export default function CartPage() {
  return <CartPageClient />;
}
