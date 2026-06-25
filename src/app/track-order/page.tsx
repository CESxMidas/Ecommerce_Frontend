import type { Metadata } from "next";

import TrackOrderPageClient from "@/components/commerce/track-order-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Tra cứu đơn hàng",
  "Tra cứu trạng thái đơn hàng KEYSHOP bằng mã đơn và email hoặc số điện thoại.",
);

export default function TrackOrderPage() {
  return <TrackOrderPageClient />;
}
