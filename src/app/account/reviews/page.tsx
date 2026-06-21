import type { Metadata } from "next";
import Link from "next/link";

import {
  AccountCard,
  AccountCardHeader,
  AccountEmptyState,
} from "@/components/account/account-ui";
import { pageMetadata, noIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata(
    "Đánh giá của tôi",
    "Xem và quản lý đánh giá sản phẩm bạn đã mua tại KEYSHOP.",
  ),
  ...noIndexMetadata,
};

export default function AccountReviewsPage() {
  return (
    <AccountCard>
      <AccountCardHeader
        title="Đánh giá của tôi"
        description="Viết đánh giá trực tiếp trên trang chi tiết sản phẩm sau khi mua hàng."
      />
      <AccountEmptyState
        title="Chưa có đánh giá nào"
        description="Mở sản phẩm đã mua, chọn tab Đánh giá và chia sẻ trải nghiệm. Đánh giá giúp cộng đồng chọn key phù hợp hơn."
        actionLabel="Xem đơn hàng"
        actionHref="/account/orders"
      />
      <p className="mt-6 text-center text-sm text-keyshop-muted">
        Hoặc{" "}
        <Link href="/products" className="text-keyshop-blue hover:underline">
          khám phá sản phẩm
        </Link>{" "}
        để mua và đánh giá.
      </p>
    </AccountCard>
  );
}
