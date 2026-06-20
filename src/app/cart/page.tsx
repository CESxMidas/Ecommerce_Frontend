import type { Metadata } from "next";

import CartPageClient from "@/components/shop/cart-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Giỏ hàng",
  "Xem lại sản phẩm trong giỏ trước khi thanh toán.",
);

export default function CartPage() {
  return <CartPageClient />;
}
