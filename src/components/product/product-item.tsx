"use client";

import Image from "next/image";
import Link from "next/link";
import { Expand, Heart, ShoppingCart, Shuffle, Star } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils/format";
import {
  computeDiscountLabel,
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
};

export default function ProductItem({ item }: ProductItemProps) {
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } =
    useCart();

  const product = normalizeProduct(item as Record<string, unknown>);
  if (!product) return null;

  const salePrice = getSalePrice(product);
  const listPrice = getListPrice(product);
  const discount = computeDiscountLabel(product);
  const displayName = getProductDisplayName(product);
  const thumbnail = getProductThumbnail(product);
  const vendor = product.vendor || product.brand || product.categoryName;
  const variants = getPurchaseVariants(product);
  const minVariantPrice =
    variants.length > 0
      ? Math.min(...variants.map((variant) => Number(variant.price) || salePrice))
      : salePrice;
  const colorVariants = variants.filter((variant) => variant.color);
  const href = `/products/${product.slug || product.id}`;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-card border border-keyshop-line bg-product-card shadow-card backdrop-blur-[14px]">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="absolute left-4 top-4 z-20 flex max-w-[calc(100%-5rem)] flex-wrap gap-2">
          {discount ? (
            <span className="inline-flex min-h-7 items-center rounded-full bg-[#ff4d4f] px-2.5 text-[11px] font-bold text-white">
              {discount}
            </span>
          ) : null}
          {product.badge ? (
            <span className="inline-flex min-h-7 items-center rounded-full bg-green-300 px-2.5 text-[11px] font-bold text-green-950">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <ActionButton
            active={isInWishlist(String(product.id))}
            onClick={() => toggleWishlist(product)}
            label="Wishlist"
          >
            <Heart className="h-4 w-4" />
          </ActionButton>
          <ActionButton
            active={isInCompare(String(product.id))}
            onClick={() => toggleCompare(product)}
            label="Compare"
          >
            <Shuffle className="h-4 w-4" />
          </ActionButton>
          <ActionButton href={href} label="View">
            <Expand className="h-4 w-4" />
          </ActionButton>
          <ActionButton onClick={() => addToCart(product)} label="Add to cart">
            <ShoppingCart className="h-4 w-4" />
          </ActionButton>
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
        <p className="text-xs font-semibold uppercase tracking-wide text-keyshop-muted">
          {vendor}
        </p>
        <Link href={href} className="mt-2 line-clamp-2 text-sm font-semibold text-white hover:text-keyshop-blue">
          {displayName}
        </Link>

        <div className="mt-2 flex items-center gap-0.5 text-keyshop-muted">
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
        </div>

        {variants.length > 0 ? (
          <div className="mt-3 text-xs text-keyshop-muted">
            <p>
              {isPhysicalProduct(product)
                ? `${variants.length} color options`
                : `${variants.length} plans, monthly default`}
            </p>
            {colorVariants.length > 0 ? (
              <div className="mt-2 flex gap-1.5">
                {colorVariants.slice(0, 4).map((variant) => (
                  <span
                    key={variant.id}
                    title={variant.name}
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ background: variant.color || undefined }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto flex items-end gap-2 pt-4">
          {listPrice != null ? (
            <span className="text-sm text-keyshop-muted line-through">
              {formatPrice(listPrice)}
            </span>
          ) : null}
          <span className="text-lg font-bold text-keyshop-blue">
            {variants.length > 0 ? formatPrice(minVariantPrice) : formatPrice(salePrice)}
          </span>
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  children,
  onClick,
  href,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  label: string;
}) {
  const className = cn(
    "flex h-9 w-9 items-center justify-center rounded-full border border-keyshop-line bg-keyshop-bg/90 text-white transition-colors hover:bg-keyshop-blue",
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
