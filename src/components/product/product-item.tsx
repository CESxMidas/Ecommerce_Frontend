"use client";

import Image from "next/image";
import Link from "next/link";
import { Expand, Heart, ShoppingCart, Shuffle, Star } from "lucide-react";
import { useState } from "react";

import ProductQuickViewModal from "@/components/product/product-quick-view-modal";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils/format";
import {
  computeDiscountLabel,
  getDefaultPurchaseVariant,
  getListPrice,
  getProductDisplayName,
  getProductThumbnail,
  getPurchaseVariants,
  getSalePrice,
  isPhysicalProduct,
  normalizeProduct,
} from "@/lib/utils/product-schema";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/api";

type ProductItemProps = {
  item: Product | Record<string, unknown>;
  index?: number;
};

export default function ProductItem({ item, index }: ProductItemProps) {
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } =
    useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const product = normalizeProduct(item as Record<string, unknown>);
  if (!product) return null;

  const salePrice = getSalePrice(product);
  const listPrice = getListPrice(product);
  const discount = computeDiscountLabel(product);
  const displayName = getProductDisplayName(product);
  const thumbnail = getProductThumbnail(product);
  const vendor = product.vendor || product.brand || product.categoryName;
  const variants = getPurchaseVariants(product);
  const defaultVariant = getDefaultPurchaseVariant(product);
  const featuredVariant =
    variants.length > 0
      ? variants.reduce((lowest, variant) =>
          Number(variant.price) < Number(lowest.price) ? variant : lowest,
        )
      : null;
  const displaySalePrice = featuredVariant?.price ?? salePrice;
  const displayListPrice = featuredVariant?.listPrice ?? listPrice;
  const colorVariants = variants.filter((variant) => variant.color);
  const href = `/products/${product.slug || product.id}`;
  const hasMultipleOptions = variants.length > 1;

  const handleAddToCart = () => {
    addToCart(product, 1, defaultVariant);
  };

  return (
    <article
      className={cn(
        "group keyshop-card-hover flex h-full min-w-0 flex-col overflow-hidden rounded-card border border-keyshop-line bg-product-card shadow-card backdrop-blur-[14px]",
        typeof index === "number" && "animate-fade-in-up motion-reduce:animate-none",
      )}
      style={
        typeof index === "number"
          ? { animationDelay: `${Math.min(index, 8) * 70}ms` }
          : undefined
      }
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="absolute left-3 top-3 z-20 flex max-w-[calc(100%-4.5rem)] flex-wrap gap-1.5">
          {discount ? (
            <span className="inline-flex min-h-6 items-center rounded-full bg-keyshop-danger px-2 text-[10px] font-bold text-white">
              {discount}
            </span>
          ) : null}
          {product.badge ? (
            <span className="inline-flex min-h-6 items-center rounded-full bg-green-300 px-2 text-[10px] font-bold text-green-950">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="absolute right-2 top-2 z-20 flex flex-col gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <IconActionButton
            active={isInWishlist(String(product.id))}
            onClick={() => toggleWishlist(product)}
            label="Yêu thích"
          >
            <Heart className="h-3.5 w-3.5" />
          </IconActionButton>
          <IconActionButton
            active={isInCompare(String(product.id))}
            onClick={() => toggleCompare(product)}
            label="So sánh"
          >
            <Shuffle className="h-3.5 w-3.5" />
          </IconActionButton>
          <IconActionButton
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setQuickViewOpen(true);
            }}
            label="Xem nhanh"
          >
            <Expand className="h-3.5 w-3.5" />
          </IconActionButton>
        </div>

        <Link href={href} className="block h-full w-full">
          <Image
            src={thumbnail || "/favicon.svg"}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-keyshop-muted">
          {vendor}
        </p>
        <Link
          href={href}
          className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-white hover:text-keyshop-blue"
        >
          {displayName}
        </Link>

        <div className="mt-2 flex min-h-[1.125rem] items-center gap-0.5 text-keyshop-muted">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                "h-3.5 w-3.5",
                index < Math.round(product.rating || 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/20",
              )}
            />
          ))}
          {product.reviewsCount > 0 ? (
            <span className="ml-1 text-[11px] text-keyshop-muted">
              ({product.reviewsCount})
            </span>
          ) : null}
        </div>

        <div className="mt-2.5 flex min-h-6 flex-nowrap items-center gap-1.5 overflow-hidden">
          {variants.length > 0 ? (
            isPhysicalProduct(product) && colorVariants.length > 0 ? (
              <>
                {colorVariants.slice(0, 4).map((variant) => (
                  <span
                    key={variant.id}
                    title={variant.name}
                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/25"
                    style={{ background: variant.color || undefined }}
                  />
                ))}
                {colorVariants.length > 4 ? (
                  <span className="shrink-0 text-[10px] text-keyshop-muted">
                    +{colorVariants.length - 4}
                  </span>
                ) : null}
              </>
            ) : (
              variants.slice(0, 3).map((variant) => (
                <span
                  key={variant.id}
                  title={variant.name}
                  className="inline-flex max-w-[5.5rem] shrink-0 items-center rounded-full border border-keyshop-line px-2 py-0.5 text-[10px] leading-none text-keyshop-muted"
                >
                  <span className="truncate">{variant.name}</span>
                </span>
              ))
            )
          ) : (
            <span className="invisible text-[10px]" aria-hidden="true">
              —
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {hasMultipleOptions ? (
              <span className="text-[11px] font-medium uppercase tracking-wide text-keyshop-muted">
             
              </span>
            ) : null}
            <span className="text-lg font-bold text-keyshop-blue">
              {formatPrice(displaySalePrice)}
            </span>
            {displayListPrice != null && displayListPrice > displaySalePrice ? (
              <span className="text-sm text-keyshop-muted line-through decoration-white/25">
                {formatPrice(displayListPrice)}
              </span>
            ) : null}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="keyshop-interactive inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-control bg-keyshop-blue px-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-keyshop-blue-hover"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Thêm vào giỏ
            </button>
            <Link
              href={href}
              className="inline-flex min-h-10 items-center justify-center rounded-control border border-keyshop-line px-3 text-xs font-semibold text-white transition hover:border-keyshop-blue/50 hover:text-keyshop-blue"
            >
              Xem
            </Link>
          </div>
        </div>
      </div>

      <ProductQuickViewModal
        open={quickViewOpen}
        product={item}
        onClose={() => setQuickViewOpen(false)}
      />
    </article>
  );
}

function IconActionButton({
  children,
  onClick,
  href,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  active?: boolean;
  label: string;
}) {
  const className = cn(
    "flex h-8 w-8 items-center justify-center rounded-full border border-keyshop-line bg-keyshop-bg/90 text-white transition-colors hover:bg-keyshop-blue",
    active && "bg-keyshop-blue",
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
