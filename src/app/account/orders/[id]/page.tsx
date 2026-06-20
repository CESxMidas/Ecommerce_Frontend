import type { Metadata } from "next";
import { Suspense } from "react";

import OrderDetailPageClient from "@/components/account/order-detail-page";

type Props = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng",
  description: "Xem sản phẩm, trạng thái thanh toán và key license.",
};

export default function OrderDetailPage({ params }: Props) {
  const { id } = params;

  return (
    <Suspense fallback={<p className="text-sm text-keyshop-muted">Đang tải đơn hàng...</p>}>
      <OrderDetailPageClient orderId={id} />
    </Suspense>
  );
}
