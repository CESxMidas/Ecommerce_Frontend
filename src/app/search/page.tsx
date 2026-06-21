import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Tìm kiếm",
  "Tìm key phần mềm và bản quyền số tại KEYSHOP.",
);

type Props = {
  searchParams: { q?: string };
};

export default function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim();
  if (q) {
    redirect(`/products?q=${encodeURIComponent(q)}`);
  }
  redirect("/products");
}
