import type { Metadata } from "next";

import TrackOrderPageClient from "@/components/commerce/track-order-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Track Order",
  "Track your KEYSHOP order status with your order ID.",
);

export default function TrackOrderPage() {
  return <TrackOrderPageClient />;
}
