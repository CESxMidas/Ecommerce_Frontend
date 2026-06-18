import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailView from "@/components/product/product-detail-view";
import { getProductById } from "@/lib/api/server";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProductById(params.id);

    return {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images?.length ? [product.images[0]] : [product.thumbnail],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export const revalidate = 300;

export default async function ProductDetailPage({ params }: Props) {
  try {
    const product = await getProductById(params.id);
    return <ProductDetailView product={product} />;
  } catch {
    notFound();
  }
}
