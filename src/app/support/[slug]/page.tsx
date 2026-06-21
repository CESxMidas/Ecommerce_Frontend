import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPageView from "@/components/commerce/static-page-view";
import { getStaticPage } from "@/lib/content/static-pages";
import { pageMetadata } from "@/lib/metadata";

const SUPPORT_SLUGS = ["returns", "shipping", "help-center"] as const;

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return SUPPORT_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const content = getStaticPage(params.slug);
  if (!content) return { title: "Hỗ trợ" };
  return pageMetadata(content.title, content.intro);
}

export default function SupportPage({ params }: Props) {
  if (!SUPPORT_SLUGS.includes(params.slug as (typeof SUPPORT_SLUGS)[number])) {
    notFound();
  }

  const content = getStaticPage(params.slug);
  if (!content) notFound();

  return <StaticPageView content={content} />;
}
