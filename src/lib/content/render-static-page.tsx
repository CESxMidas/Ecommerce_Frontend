import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPageView from "@/components/commerce/static-page-view";
import { getStaticPage } from "@/lib/content/static-pages";
import { pageMetadata } from "@/lib/metadata";

export function staticPageMetadata(slug: string): Metadata {
  const content = getStaticPage(slug);
  if (!content) return { title: "Trang" };
  return pageMetadata(content.title, content.intro);
}

export function StaticPage({ slug }: { slug: string }) {
  const content = getStaticPage(slug);
  if (!content) notFound();
  return <StaticPageView content={content} />;
}
