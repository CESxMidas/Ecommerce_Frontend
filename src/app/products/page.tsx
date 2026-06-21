import type { Metadata } from "next";
import { Suspense } from "react";

import ProductListing from "@/components/shop/product-listing";
import { ProductListingSkeleton } from "@/components/ui/skeleton";
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
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = searchParams.page || "1";
  const params: Record<string, string> = {
    page,
    limit: "12",
  };

  if (searchParams.category) params.category = searchParams.category;
  if (searchParams.q) params.q = searchParams.q;
  if (searchParams.sort) params.sort = searchParams.sort;
  if (searchParams.brand) params.brand = searchParams.brand;
  if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
  if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;

  const [productsRes, categoriesRes] = await Promise.allSettled([
    getProducts(params),
    getCategories(),
  ]);

  const productsPayload =
    productsRes.status === "fulfilled"
      ? productsRes.value
      : { products: [], total: 0, page: 1, totalPages: 1, limit: 12 };
  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value.categories : [];

  return (
    <Suspense fallback={<ProductListingSkeleton />}>
      <ProductListing
        products={productsPayload.products}
        categories={categories}
        pagination={{
          page: productsPayload.page ?? Number(page),
          totalPages: productsPayload.totalPages ?? 1,
          totalItems: productsPayload.total ?? productsPayload.products.length,
          limit: productsPayload.limit ?? 12,
        }}
      />
    </Suspense>
  );
}
