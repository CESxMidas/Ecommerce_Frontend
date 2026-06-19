import type { Metadata } from "next";
import { Suspense } from "react";

import OrderDetailPageClient from "@/components/account/order-detail-page";

type Props = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Order Details",
  description: "View order items, payment status, and license keys.",
};

export default function OrderDetailPage({ params }: Props) {
  const { id } = params;

  return (
    <Suspense fallback={<p className="text-sm text-keyshop-muted">Loading order...</p>}>
      <OrderDetailPageClient orderId={id} />
    </Suspense>
  );
}
