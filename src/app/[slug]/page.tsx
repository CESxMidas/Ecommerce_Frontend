import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPageView from "@/components/commerce/static-page-view";
import { getStaticPage } from "@/lib/content/static-pages";

const titles: Record<string, string> = {
  about: "Giới thiệu",
  contact: "Liên hệ",
};

const allowedSlugs = Object.keys(titles);

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return allowedSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const content = getStaticPage(params.slug);
  return {
    title: content?.title || titles[params.slug] || "Trang",
    description: content?.intro,
  };
}

export default function StaticContentPage({ params }: Props) {
  if (!allowedSlugs.includes(params.slug)) {
    notFound();
  }

  const content = getStaticPage(params.slug);
  if (!content) notFound();

  return <StaticPageView content={content} />;
}
