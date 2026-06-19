import type { Metadata } from "next";

import ComparePageClient from "@/components/commerce/compare-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Compare Products",
  "Compare software keys and digital products side by side.",
);

export default function ComparePage() {
  return <ComparePageClient />;
}
