import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { staticPageMetadata, StaticPage } from "@/lib/content/render-static-page";

/** Brand pages — /about và /contact đã tách route riêng để giảm compile graph */
const BRAND_SLUGS = [
  "our-story",
  "careers",
  "partners",
  "store-locator",
] as const;

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return BRAND_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  if (!BRAND_SLUGS.includes(params.slug as (typeof BRAND_SLUGS)[number])) {
    return { title: "Trang" };
  }
  return staticPageMetadata(params.slug);
}

export default function BrandPage({ params }: Props) {
  if (!BRAND_SLUGS.includes(params.slug as (typeof BRAND_SLUGS)[number])) {
    notFound();
  }

  return <StaticPage slug={params.slug} />;
}
