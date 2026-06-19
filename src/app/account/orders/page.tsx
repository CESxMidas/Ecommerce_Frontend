import type { Metadata } from "next";
import { Suspense } from "react";

import OrdersPageClient from "@/components/account/orders-page";

export const metadata: Metadata = {
  title: "Orders",
  description: "View your KEYSHOP order history and payment status.",
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-keyshop-muted">Loading orders...</p>}>
      <OrdersPageClient />
    </Suspense>
  );
}
