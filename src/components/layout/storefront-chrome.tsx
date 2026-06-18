import { getCategories } from "@/lib/api/server";

import StorefrontChromeClient from "./storefront-chrome-client";

export default async function StorefrontChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories } = await getCategories();

  return (
    <StorefrontChromeClient categories={categories}>
      {children}
    </StorefrontChromeClient>
  );
}
