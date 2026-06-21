import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPageView from "@/components/commerce/static-page-view";
import { getStaticPage } from "@/lib/content/static-pages";
import { pageMetadata } from "@/lib/metadata";

const LEGAL_SLUGS = ["terms", "privacy-policy", "payment-policy", "cookie-policy"] as const;

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const content = getStaticPage(params.slug);
  if (!content) return { title: "Pháp lý" };
  return pageMetadata(content.title, content.intro);
}

export default function LegalPage({ params }: Props) {
  if (!LEGAL_SLUGS.includes(params.slug as (typeof LEGAL_SLUGS)[number])) {
    notFound();
  }

  const content = getStaticPage(params.slug);
  if (!content) notFound();

  return <StaticPageView content={content} />;
}
