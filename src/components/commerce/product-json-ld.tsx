import {
  getListPrice,
  getProductDisplayName,
  getProductThumbnail,
  getSalePrice,
  isOutOfStock,
  normalizeProduct,
} from "@/lib/utils/product-schema";
import type { Product } from "@/types/api";

type ProductJsonLdProps = {
  product: Product;
  url: string;
};

export function ProductJsonLd({ product: rawProduct, url }: ProductJsonLdProps) {
  const product = normalizeProduct(rawProduct as unknown as Record<string, unknown>);
  if (!product) return null;

  const name = getProductDisplayName(product);
  const image = getProductThumbnail(product);
  const price = getSalePrice(product);
  const listPrice = getListPrice(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: product.description || rawProduct.seoDescription || rawProduct.description,
    image: product.images?.length ? product.images : image ? [image] : undefined,
    sku: product.sku,
    brand: product.brand || product.vendor
      ? { "@type": "Brand", name: product.brand || product.vendor }
      : undefined,
    aggregateRating:
      product.reviewsCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "VND",
      price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: isOutOfStock(product)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      ...(listPrice != null && listPrice > price
        ? { priceSpecification: { "@type": "UnitPriceSpecification", price: listPrice } }
        : {}),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
