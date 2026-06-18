import { Suspense } from "react";

import OrderDetailPageClient from "@/components/account/order-detail-page";

type Props = {
  params: { id: string };
};

export default function OrderDetailPage({ params }: Props) {
  const { id } = params;

  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading order...</p>}>
      <OrderDetailPageClient orderId={id} />
    </Suspense>
  );
}
