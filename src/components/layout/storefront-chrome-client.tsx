"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

export default function StorefrontChromeClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = pathname.startsWith("/auth/");

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="keyshop-scrollbar flex-1 bg-keyshop-bg">{children}</main>
      <SiteFooter />
    </>
  );
}
