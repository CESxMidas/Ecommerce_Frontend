import type { Metadata } from "next";
import Link from "next/link";

import {
  CommerceHero,
  CommercePage,
  CommercePanel,
} from "@/components/commerce/commerce-ui";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Hướng dẫn",
  "Hướng dẫn mua key, kích hoạt phần mềm và sử dụng KEYSHOP.",
);

const guides = [
  {
    title: "Cách mua và nhận key",
    href: "/faq",
    body: "Quy trình từ chọn sản phẩm đến nhận key trong tài khoản.",
  },
  {
    title: "Thanh toán VNPay",
    href: "/legal/payment-policy",
    body: "Hướng dẫn thanh toán online cho sản phẩm số.",
  },
  {
    title: "Tra cứu đơn hàng",
    href: "/track-order",
    body: "Kiểm tra trạng thái đơn không cần đăng nhập.",
  },
  {
    title: "Blog & tin tức",
    href: "/blog",
    body: "Cập nhật sản phẩm mới và mẹo sử dụng phần mềm.",
  },
];

export default function GuidesPage() {
  return (
    <CommercePage>
      <CommerceHero
        kicker="Tài nguyên"
        title="Hướng dẫn"
        description="Tổng hợp hướng dẫn giúp bạn mua và sử dụng bản quyền số dễ dàng hơn."
      />
      <CommercePanel>
        <ul className="space-y-4">
          {guides.map((guide) => (
            <li key={guide.href}>
              <Link
                href={guide.href}
                className="block rounded-card border border-keyshop-line bg-white/[0.03] p-5 transition hover:border-keyshop-blue/35"
              >
                <h2 className="text-lg font-bold text-white">{guide.title}</h2>
                <p className="mt-1 text-sm text-keyshop-muted">{guide.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </CommercePanel>
    </CommercePage>
  );
}
