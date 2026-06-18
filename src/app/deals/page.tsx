import type { Metadata } from "next";
import { Suspense } from "react";

import ProductListing from "@/components/shop/product-listing";
import { getCategories, getProducts } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Deals",
  description: "Special deals on digital products and license keys.",
};

export const revalidate = 300;

export default async function DealsPage() {
  const [productsRes, categoriesRes] = await Promise.allSettled([
    getProducts(),
    getCategories(),
  ]);

  const products =
    productsRes.status === "fulfilled" ? productsRes.value.products : [];
  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value.categories : [];

  return (
    <Suspense fallback={<div className="container py-16 text-keyshop-muted">Loading...</div>}>
      <ProductListing products={products} categories={categories} mode="deals" />
    </Suspense>
  );
}
