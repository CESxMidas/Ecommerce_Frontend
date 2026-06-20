import type { Metadata } from "next";
import { Suspense } from "react";

import OrdersPageClient from "@/components/account/orders-page";

export const metadata: Metadata = {
  title: "Đơn hàng",
  description: "Xem lịch sử đơn hàng và trạng thái thanh toán KEYSHOP.",
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-keyshop-muted">Đang tải đơn hàng...</p>}>
      <OrdersPageClient />
    </Suspense>
  );
}
