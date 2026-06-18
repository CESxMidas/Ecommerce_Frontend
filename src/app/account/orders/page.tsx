import { Suspense } from "react";

import OrdersPageClient from "@/components/account/orders-page";

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading orders...</p>}>
      <OrdersPageClient />
    </Suspense>
  );
}
