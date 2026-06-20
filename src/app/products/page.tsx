import type { Metadata } from "next";
import { Suspense } from "react";

import ProductListing from "@/components/shop/product-listing";
import { getCategories, getProducts } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Duyệt key phần mềm và bản quyền số chính hãng.",
};

export const revalidate = 300;

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params: Record<string, string> = {};
  if (searchParams.category) params.category = searchParams.category;
  if (searchParams.q) params.q = searchParams.q;

  const [productsRes, categoriesRes] = await Promise.allSettled([
    getProducts(params),
    getCategories(),
  ]);

  const products =
    productsRes.status === "fulfilled" ? productsRes.value.products : [];
  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value.categories : [];

  return (
    <Suspense fallback={<div className="container py-16 text-keyshop-muted">Đang tải...</div>}>
      <ProductListing products={products} categories={categories} />
    </Suspense>
  );
}
