import type { Metadata } from "next";

import CheckoutPageClient from "@/components/shop/checkout-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Checkout",
  "Complete your KEYSHOP order with secure payment.",
  { noIndex: true },
);

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
