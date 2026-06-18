import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPageView from "@/components/commerce/static-page-view";
import { getStaticPage } from "@/lib/content/static-pages";

const titles: Record<string, string> = {
  terms: "Terms of Service",
  "privacy-policy": "Privacy Policy",
  "payment-policy": "Payment Policy",
};

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return Object.keys(titles).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const content = getStaticPage(params.slug);
  return {
    title: content?.title || titles[params.slug] || params.slug,
    description: content?.intro,
  };
}

export default function LegalPage({ params }: Props) {
  const content = getStaticPage(params.slug);
  if (!content || !titles[params.slug]) notFound();

  return <StaticPageView content={content} />;
}
