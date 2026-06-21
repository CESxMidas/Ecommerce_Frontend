import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPageView from "@/components/commerce/static-page-view";
import { getStaticPage } from "@/lib/content/static-pages";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "FAQ — Câu hỏi thường gặp",
  "Giải đáp nhanh về mua hàng, thanh toán VNPay, nhận key và tài khoản KEYSHOP.",
);

export default function FaqPage() {
  const content = getStaticPage("faq");
  if (!content) notFound();
  return <StaticPageView content={content} />;
}
