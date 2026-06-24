"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import ProductGallery from "@/components/product/product-gallery";
import { TrustSignals } from "@/components/commerce/trust-signals";
import { useCart } from "@/components/providers/cart-provider";
import { StarRating } from "@/components/ui/star-rating";
import {
  fetchProductReviews,
  submitProductReview,
  type ProductReview,
} from "@/lib/services/review-service";
import { formatPrice } from "@/lib/utils/format";
import {
  computeDiscountLabel,
  getDeliveryLabel,
  getListPrice,
  getProductDisplayName,
  getProductImages,
  getProductTypeLabel,
  getPurchaseVariants,
  getSalePrice,
  getStockDetailLabel,
  getStockStatusLabel,
  isInstantCodeProduct,
  isLicenseKeyProduct,
  isOutOfStock,
  isPhysicalProduct,
  normalizeProduct,
  resolvePurchaseVariant,
} from "@/lib/utils/product-schema";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/api";

type ProductDetailViewProps = {
  product: Product;
};

function renderStars(rating: number, size: "md" | "lg" = "md") {
  return <StarRating rating={rating} size={size} />;
}

export default function ProductDetailView({ product: rawProduct }: ProductDetailViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } =
    useCart();

  const product = useMemo(
    () => normalizeProduct(rawProduct as unknown as Record<string, unknown>),
    [rawProduct],
  );

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">(
    "description",
  );
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const purchaseVariants = getPurchaseVariants(product);
  const defaultVariantId = purchaseVariants[0]?.id || "";
  const selectedVariant = product
    ? resolvePurchaseVariant(product, selectedVariantId)
    : null;
  const salePrice = selectedVariant?.price ?? getSalePrice(product);
  const listPrice = selectedVariant?.listPrice ?? getListPrice(product);
  const discount = selectedVariant ? undefined : computeDiscountLabel(product);
  const displayName = getProductDisplayName(product);
  const vendor = product?.vendor || product?.brand || product?.categoryName || "";
  const images = getProductImages(product);
  const outOfStock = isOutOfStock(product);
  const maxQuantity = Math.max(1, Number(product?.stock ?? 0));
  const stockStatusLabel = getStockStatusLabel(product);
  const stockDetailLabel = getStockDetailLabel(product);

  useEffect(() => {
    setSelectedVariantId(defaultVariantId);
  }, [product?.id, defaultVariantId]);

  useEffect(() => {
    if (!product?.id) return;

    let cancelled = false;

    const loadReviews = async () => {
      setReviewsLoading(true);
      try {
        const data = await fetchProductReviews(String(product.id));
        if (!cancelled) setReviews(data);
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [product?.id]);

  const writtenReviewCount = reviews.length;
  const writtenReviewRating =
    writtenReviewCount > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        writtenReviewCount
      : 0;
  const reviewSummaryRating =
    writtenReviewCount > 0 ? writtenReviewRating : Number(product?.rating || 0);

  const specifications = useMemo(() => {
    if (!product) return [] as const;

    return [
      ["SKU", product.sku],
      ["Loại sản phẩm", getProductTypeLabel(product)],
      ["Hình thức giao", getDeliveryLabel(product)],
      ["Danh mục", product.categoryName],
      ["Tồn kho", stockDetailLabel],
    ] as const;
  }, [product, stockDetailLabel]);

  if (!product) {
    return (
      <div className="container py-16 text-center text-keyshop-muted">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  const handleBuyNow = async () => {
    const added = await addToCart(product, quantity, selectedVariant);
    if (added) router.push("/checkout");
  };

  const handleSubmitReview = async () => {
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để viết đánh giá");
      router.push("/auth/login");
      return;
    }

    if (rating < 1) {
      toast.error("Vui lòng chọn số sao");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Vui lòng viết đánh giá");
      return;
    }

    setSubmittingReview(true);
    try {
      await submitProductReview(String(product.id), {
        rating,
        comment: reviewComment.trim(),
      });
      const data = await fetchProductReviews(String(product.id));
      setReviews(data);
      setReviewComment("");
      setRating(0);
      toast.success("Đánh giá đã được gửi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gửi đánh giá không thành công");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="pb-20">
      <section className="border-b border-keyshop-line bg-white/[0.02] py-4">
        <nav aria-label="Breadcrumb" className="container flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-keyshop-muted">
          <Link href="/" className="hover:text-white">
            Trang chủ
          </Link>
          <span aria-hidden>›</span>
          <Link href="/products" className="hover:text-white">
            Sản phẩm
          </Link>
          <span aria-hidden>›</span>
          <span className="max-w-full truncate text-white" aria-current="page">
            {displayName}
          </span>
        </nav>
      </section>

      <section className="container py-10">
        <div className="grid gap-10 xl:grid-cols-[42%_58%]">
          <ProductGallery images={images} alt={displayName} />

          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-keyshop-blue">
              {vendor}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl xl:text-[38px]">
              {displayName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
              <span className="text-sm text-keyshop-muted">
                {writtenReviewCount} đánh giá
              </span>
              <span className="text-sm font-bold text-green-400">{product.categoryName}</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-extrabold text-keyshop-blue sm:text-4xl">
                {formatPrice(salePrice)}
              </span>
              {listPrice != null ? (
                <span className="text-xl text-white/30 line-through">
                  {formatPrice(listPrice)}
                </span>
              ) : null}
              {discount ? (
                <span className="rounded-full bg-keyshop-danger px-3 py-1 text-xs font-bold">
                  {discount}
                </span>
              ) : null}
            </div>

            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-white/70">
              {product.description ||
                `${displayName} - ${getDeliveryLabel(product).toLowerCase()}.`}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  outOfStock ? "bg-red-400" : "bg-green-400",
                )}
              />
              <span
                className={cn(
                  "font-bold",
                  outOfStock ? "text-red-400" : "text-green-400",
                )}
              >
                {stockStatusLabel}
              </span>
              <span className="text-sm text-keyshop-muted">{stockDetailLabel}</span>
              <span className="text-sm text-keyshop-muted">{getDeliveryLabel(product)}</span>
            </div>

            {purchaseVariants.length > 0 ? (
              <div className="mt-7">
                <h4 className="mb-3 font-semibold">
                  {isPhysicalProduct(product) ? "Tùy chọn" : "Loại key"}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {purchaseVariants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={cn(
                        "rounded-control border px-4 py-3 text-left",
                        selectedVariant?.id === variant.id
                          ? "border-keyshop-blue bg-keyshop-blue/15"
                          : "border-keyshop-line hover:border-keyshop-blue/50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {variant.color ? (
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ background: variant.color || undefined }}
                          />
                        ) : null}
                        <strong className="text-sm">{variant.name}</strong>
                      </div>
                      <small className="mt-1 block text-keyshop-muted">
                        {formatPrice(variant.price)}
                      </small>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-7">
              <h4 className="mb-3 font-semibold">Số lượng</h4>
              <div className="inline-flex items-center rounded-control border border-keyshop-line">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/30"
                  disabled={quantity === 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Giảm số lượng"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-12 text-center" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/30"
                  disabled={outOfStock || quantity >= maxQuantity}
                  onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                  aria-label="Tăng số lượng"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                disabled={outOfStock}
                onClick={() => addToCart(product, quantity, selectedVariant)}
                className="inline-flex min-h-11 items-center rounded-control bg-keyshop-blue px-6 font-semibold hover:bg-keyshop-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {outOfStock ? stockStatusLabel : "Thêm vào giỏ"}
              </button>
              <button
                type="button"
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="inline-flex min-h-11 items-center rounded-control border border-keyshop-blue px-6 font-semibold text-keyshop-blue hover:bg-keyshop-blue/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {outOfStock
                  ? stockStatusLabel
                  : isInstantCodeProduct(product)
                    ? "Mua và nhận mã"
                    : "Mua ngay"}
              </button>
              <button
                type="button"
                onClick={() => toggleCompare(product)}
                className="rounded-control border border-keyshop-line px-6 py-3 font-semibold hover:bg-white/5"
              >
                {isInCompare(String(product.id)) ? "Bỏ so sánh" : "So sánh"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="inline-flex items-center justify-center gap-2 rounded-control border border-keyshop-line px-6 py-3 font-semibold hover:bg-white/5"
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isInWishlist(String(product.id)) && "fill-red-400 text-red-400",
                  )}
                />
                Yêu thích
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {isLicenseKeyProduct(product) ? (
                <FeaturePill>
                  Key giao từ kho · {product.keyPrefix || "KEY"}-#####
                </FeaturePill>
              ) : null}
              <FeaturePill>{getDeliveryLabel(product)}</FeaturePill>
              <FeaturePill>
                {isPhysicalProduct(product) ? "Hỗ trợ COD" : "Thanh toán VNPay"}
              </FeaturePill>
            </div>

            <TrustSignals className="mt-6" />
          </div>
        </div>
      </section>

      <section className="container pb-10">
        <div className="border-b border-white/10">
          <div className="flex flex-wrap gap-6">
            {[
              ["description", "Mô tả"],
              ["specifications", "Thông số"],
              ["reviews", `Đánh giá (${writtenReviewCount})`],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={cn(
                  "border-b-2 pb-4 text-sm font-semibold transition-colors",
                  activeTab === id
                    ? "border-keyshop-blue text-white"
                    : "border-transparent text-keyshop-muted hover:text-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {activeTab === "description" ? (
            <div className="max-w-3xl text-white/75 leading-7">
              {product.description || "Chưa có mô tả sản phẩm."}
            </div>
          ) : null}

          {activeTab === "specifications" ? (
            <div className="max-w-2xl space-y-3">
              {specifications.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 rounded-control border border-keyshop-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-keyshop-muted">{label}</span>
                  <span className="break-words font-medium text-white sm:text-right">{value}</span>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "reviews" ? (
            <div className="space-y-8">
              <div className="rounded-card border border-keyshop-line bg-white/[0.03] p-6">
                <h2 className="text-3xl font-extrabold sm:text-4xl">{reviewSummaryRating.toFixed(1)}</h2>
                <div className="mt-2 flex items-center gap-1">
                  {renderStars(reviewSummaryRating, "lg")}
                </div>
                <p className="mt-2 text-sm text-keyshop-muted">
                  Dựa trên {writtenReviewCount} đánh giá
                </p>
              </div>

              {session?.user ? (
                <div className="rounded-card border border-keyshop-line bg-white/[0.03] p-6">
                  <h3 className="font-semibold">Viết đánh giá</h3>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setRating(index + 1)}
                        aria-label={`Chọn ${index + 1} sao`}
                        className="flex h-11 w-11 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/40"
                      >
                        <Star
                          className={cn(
                            "h-5 w-5",
                            index < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white/20",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    className="mt-4 w-full rounded-control border border-keyshop-line bg-transparent px-4 py-3 text-sm outline-none focus:border-keyshop-blue"
                  />
                  <button
                    type="button"
                    disabled={submittingReview}
                    onClick={handleSubmitReview}
                    className="mt-4 rounded-control bg-keyshop-blue px-5 py-2.5 text-sm font-semibold hover:bg-keyshop-blue-hover disabled:opacity-60"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              ) : (
                <p className="text-keyshop-muted">
                  <Link href="/auth/login" className="text-keyshop-blue hover:underline">
                    Đăng nhập
                  </Link>{" "}
                  để viết đánh giá.
                </p>
              )}

              <div className="space-y-4">
                {reviewsLoading ? (
                  <p className="text-keyshop-muted">Đang tải đánh giá...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-keyshop-muted">Chưa có đánh giá nào.</p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id || review._id}
                      className="rounded-card border border-keyshop-line bg-white/[0.03] p-5"
                    >
                      <div className="flex items-center gap-2">
                        {renderStars(Number(review.rating || 0))}
                        <span className="text-sm text-keyshop-muted">
                          {review.userName || "Khách hàng"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-white/80">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-keyshop-line bg-white/[0.03] px-4 py-2 text-sm text-white/80">
      {children}
    </span>
  );
}
