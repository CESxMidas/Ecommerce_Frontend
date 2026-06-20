"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import type { Category } from "@/types/api";

export default function StorefrontChromeClient({
  categories,
  children,
}: {
  categories: Category[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = pathname.startsWith("/auth/");

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="flex-1 bg-keyshop-bg">{children}</main>
      <SiteFooter />
    </>
  );
}
