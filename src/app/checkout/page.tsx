import type { Metadata } from "next";

import CheckoutPageClient from "@/components/shop/checkout-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Thanh toán",
  "Hoàn tất đơn hàng KEYSHOP với thanh toán an toàn.",
  { noIndex: true },
);

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
