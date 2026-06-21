import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPageView from "@/components/commerce/static-page-view";
import { getStaticPage } from "@/lib/content/static-pages";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Trung tâm trợ giúp",
  "Tổng hợp hướng dẫn mua hàng, thanh toán, giao key và hỗ trợ tại KEYSHOP.",
);

export default function HelpPage() {
  const content = getStaticPage("help-center");
  if (!content) notFound();
  return <StaticPageView content={content} />;
}
