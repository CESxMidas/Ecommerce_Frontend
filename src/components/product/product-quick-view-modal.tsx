"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Minus, Plus, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import OverlayModal from "@/components/ui/overlay-modal";
import { useCart } from "@/components/providers/cart-provider";
import apiClient from "@/lib/api/client";
import { formatPrice } from "@/lib/utils/format";
import { resolveMediaUrl } from "@/lib/utils/image";
import {
  computeDiscountLabel,
  getDeliveryLabel,
  getListPrice,
  getProductDisplayName,
  getProductImages,
  getPurchaseVariants,
  getSalePrice,
  getStockDetailLabel,
  getStockStatusLabel,
  isOutOfStock,
  isPhysicalProduct,
  normalizeProduct,
  resolvePurchaseVariant,
} from "@/lib/utils/product-schema";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/api";

type ProductQuickViewModalProps = {
  open: boolean;
  product: Product | Record<string, unknown> | null;
  onClose: () => void;
};

function getProductKey(product: Product | Record<string, unknown> | null) {
  if (!product) return "";

  const record = product as Record<string, unknown>;
  return String(record.slug || record.id || record.productId || "");
}

export default function ProductQuickViewModal({
  open,
  product: rawProduct,
  onClose,
}: ProductQuickViewModalProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [detailRaw, setDetailRaw] = useState<Record<string, unknown> | null>(null);

  const previewProduct = useMemo(
    () =>
      rawProduct
        ? normalizeProduct(rawProduct as Record<string, unknown>)
        : null,
    [rawProduct],
  );

  const product = useMemo(() => {
    if (detailRaw) {
      return normalizeProduct(detailRaw);
    }

    return previewProduct;
  }, [detailRaw, previewProduct]);

  const purchaseVariants = getPurchaseVariants(product);
  const defaultVariantId = purchaseVariants[0]?.id || "";
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open) {
      setDetailRaw(null);
      setLoading(false);
      return;
    }

    const productKey = getProductKey(rawProduct);
    if (!productKey) return;

    let cancelled = false;
    setLoading(true);

    apiClient
      .get(API_ENDPOINTS.products.detail(productKey))
      .then(({ data }) => {
        if (!cancelled && data && typeof data === "object") {
          setDetailRaw(data as Record<string, unknown>);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetailRaw(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, rawProduct]);

  useEffect(() => {
    if (!open) return;

    setSelectedVariantId(defaultVariantId);
    setQuantity(1);
  }, [open, product?.id, defaultVariantId]);

  if (!previewProduct || !product) {
    return null;
  }

  const selectedVariant = resolvePurchaseVariant(product, selectedVariantId);
  const salePrice = selectedVariant?.price ?? getSalePrice(product);
  const listPrice = selectedVariant?.listPrice ?? getListPrice(product);
  const discount = selectedVariant ? undefined : computeDiscountLabel(product);
  const displayName = getProductDisplayName(product);
  const vendor = product.vendor || product.brand || product.categoryName || "";
  const images = getProductImages(product).map((image) => resolveMediaUrl(image));
  const mainImage = resolveMediaUrl(images[0] || product.thumbnail);
  const href = `/products/${product.slug || product.id}`;
  const outOfStock = isOutOfStock(product);
  const maxQuantity = Math.max(1, Number(product.stock ?? 0));
  const stockStatusLabel = getStockStatusLabel(product);
  const stockDetailLabel = getStockDetailLabel(product);

  const handleAddToCart = async () => {
    await addToCart(product, quantity, selectedVariant);
    onClose();
  };

  return (
    <OverlayModal
      open={open}
      onClose={onClose}
      panelClassName="max-h-[92vh] w-full max-w-5xl overflow-y-auto sm:max-w-[min(100vw-2rem,64rem)]"
      ariaLabel={`Xem nhanh: ${displayName}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-keyshop-line px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-keyshop-blue">
            Xem nhanh
          </p>
          <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">{displayName}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng xem nhanh"
          className="flex h-11 w-11 items-center justify-center rounded-control text-keyshop-muted transition hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center p-10 text-keyshop-muted">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Đang tải thông tin sản phẩm...
        </div>
      ) : (
        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-card border border-keyshop-line bg-white/5">
            <Image
              src={mainImage}
              alt={displayName}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 90vw, 480px"
            />
          </div>

          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-keyshop-muted">
              {vendor}
            </p>

            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "h-4 w-4",
                    index < Math.round(product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-white/20",
                  )}
                />
              ))}
              {product.reviewsCount > 0 ? (
                <span className="ml-2 text-sm text-keyshop-muted">
                  ({product.reviewsCount} đánh giá)
                </span>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-extrabold text-keyshop-blue sm:text-3xl">
                {formatPrice(salePrice)}
              </span>
              {listPrice != null && listPrice > salePrice ? (
                <span className="text-lg text-keyshop-muted line-through decoration-white/25">
                  {formatPrice(listPrice)}
                </span>
              ) : null}
              {discount ? (
                <span className="rounded-full bg-keyshop-danger px-2.5 py-1 text-xs font-bold">
                  {discount}
                </span>
              ) : null}
            </div>

            <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/75">
              {product.description ||
                `${displayName} - ${getDeliveryLabel(product).toLowerCase()}.`}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  outOfStock ? "bg-red-400" : "bg-green-400",
                )}
              />
              <span
                className={cn(
                  "font-semibold",
                  outOfStock ? "text-red-400" : "text-green-400",
                )}
              >
                {stockStatusLabel}
              </span>
              <span className="text-keyshop-muted">{stockDetailLabel}</span>
              <span className="text-keyshop-muted">{getDeliveryLabel(product)}</span>
            </div>

            {purchaseVariants.length > 0 ? (
              <div className="mt-5">
                <h4 className="mb-2 text-sm font-semibold">
                  {isPhysicalProduct(product) ? "Tùy chọn" : "Loại key"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {purchaseVariants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={cn(
                        "rounded-control border px-3 py-2 text-left text-sm",
                        selectedVariant?.id === variant.id
                          ? "border-keyshop-blue bg-keyshop-blue/15"
                          : "border-keyshop-line hover:border-keyshop-blue/50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {variant.color ? (
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: variant.color || undefined }}
                          />
                        ) : null}
                        <span className="font-semibold">{variant.name}</span>
                      </div>
                      <small className="mt-0.5 block text-keyshop-muted">
                        {formatPrice(variant.price)}
                      </small>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-5">
              <h4 className="mb-2 text-sm font-semibold">Số lượng</h4>
              <div className="inline-flex items-center rounded-control border border-keyshop-line">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center disabled:opacity-40"
                  disabled={quantity === 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center disabled:opacity-40"
                  disabled={outOfStock || quantity >= maxQuantity}
                  onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="keyshop-interactive rounded-control bg-keyshop-blue px-5 py-3 text-sm font-semibold hover:bg-keyshop-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {outOfStock ? stockStatusLabel : "Thêm vào giỏ"}
              </button>
              <Link
                href={href}
                onClick={onClose}
                className="keyshop-interactive rounded-control border border-keyshop-line px-5 py-3 text-center text-sm font-semibold hover:border-keyshop-blue/50 hover:text-keyshop-blue"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      )}
    </OverlayModal>
  );
}
