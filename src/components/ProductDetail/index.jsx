import { Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./index.css";
import ProductZoom from "../ProductZoom";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { fetchProductById } from "../../services/productService";
import {
  fetchProductReviews,
  submitProductReview,
} from "../../services/reviewService";
import {
  computeDiscountLabel,
  getDeliveryLabel,
  getPurchaseVariants,
  getListPrice,
  getProductDisplayName,
  getProductTypeLabel,
  getSalePrice,
  isInstantCodeProduct,
  isLicenseKeyProduct,
  isPhysicalProduct,
  resolvePurchaseVariant,
} from "../../utils/productSchema";
import { formatPrice, getProductImages } from "../../utils/products";

const ProductDetail = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const maxReviewLength = 500;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const data = await fetchProductById(id);

        if (!cancelled) {
          setProduct(data);
          const variants = getPurchaseVariants(data);
          setSelectedVariantId(variants[0]?.id || "");
        }
      } catch (error) {
        if (!cancelled) {
          setProduct(null);
          setLoadError(error.message || "Failed to load product");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product?.id) {
      return;
    }

    let cancelled = false;

    const loadReviews = async () => {
      setReviewsLoading(true);

      try {
        const data = await fetchProductReviews(product.id);

        if (!cancelled) {
          setReviews(data);
        }
      } catch {
        if (!cancelled) {
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setReviewsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [product?.id]);

  const handleSubmitReview = async () => {
    if (!context.isLogin) {
      context.openAlertBox("error", "Please login to write a review");
      navigate("/login");
      return;
    }

    if (rating < 1) {
      context.openAlertBox("error", "Please select a rating");
      return;
    }

    if (!reviewComment.trim()) {
      context.openAlertBox("error", "Please write your review");
      return;
    }

    if (reviewComment.trim().length > maxReviewLength) {
      context.openAlertBox(
        "error",
        `Review must be ${maxReviewLength} characters or less`,
      );
      return;
    }

    try {
      setSubmittingReview(true);

      await submitProductReview(product.id, {
        rating,
        comment: reviewComment.trim(),
      });

      const [reviewData, updatedProduct] = await Promise.all([
        fetchProductReviews(product.id),
        fetchProductById(product.id),
      ]);

      setReviews(reviewData);
      setProduct(updatedProduct);
      setReviewComment("");
      setRating(0);
      context.openAlertBox("success", "Review submitted");
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Failed to submit review",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatReviewDate = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleDateString();
  };

  const renderStars = (value) => {
    const fullStars = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));

    return "\u2605".repeat(fullStars).padEnd(5, "\u2606");
  };

  const buildSpecifications = (item) => {
    const specs = [
      ["Product type", getProductTypeLabel(item)],
      ["Delivery", getDeliveryLabel(item)],
      ["Payment", isPhysicalProduct(item) ? "VNPay or COD" : "VNPay required"],
      ["Vendor", item.vendor || item.brand || "-"],
      ["Category", item.categoryName || "-"],
      ["SKU", item.sku || "-"],
    ];

    if (item.productType === "license_key" && item.keyPrefix) {
      specs.push(["Key format", `${item.keyPrefix}-#####`]);
    }

    Object.entries(item.attributes || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;

      specs.push([
        key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (char) => char.toUpperCase()),
        String(value),
      ]);
    });

    return specs;
  };

  const handleBuyNow = async () => {
    const variant = resolvePurchaseVariant(product, selectedVariantId);

    if (isInstantCodeProduct(product)) {
      context.purchaseLicenseProduct(product, quantity, variant);
      return;
    }

    const added = await context.addToCart(product, quantity, variant);

    if (added) {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="productDetailSection pb-20">
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="productDetailSection pb-20">
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <p className="mb-4">
            {loadError || "Product not found."}
          </p>

          <Link
            to="/productListing"
            className="text-blue-400 hover:text-blue-300"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const images = getProductImages(product);
  const displayName = getProductDisplayName(product);
  const purchaseVariants = getPurchaseVariants(product);
  const selectedVariant = resolvePurchaseVariant(product, selectedVariantId);
  const salePrice = selectedVariant?.price ?? getSalePrice(product);
  const listPrice = selectedVariant?.listPrice ?? getListPrice(product);
  const discount = selectedVariant
    ? undefined
    : computeDiscountLabel(product);
  const vendor = product.vendor || product.brand || product.categoryName;
  const specifications = buildSpecifications(product);
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="productDetailSection pb-20">
      {/* ========================= */}
      {/* BREADCRUMB */}
      {/* ========================= */}

      <section className="py-5 pb-0">
        <div className="container">
          <div className="breadcrumbWrapper">
            <div className="container mx-auto px-4 lg:px-6">
              <Breadcrumbs separator=">">
                <MuiLink
                  component={Link}
                  to="/"
                  underline="hover"
                  color="inherit"
                >
                  Home
                </MuiLink>

                <MuiLink
                  component={Link}
                  to="/productListing"
                  underline="hover"
                  color="inherit"
                >
                  Products
                </MuiLink>

                <MuiLink underline="hover" color="inherit">
                  {displayName}
                </MuiLink>
              </Breadcrumbs>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* PRODUCT TOP */}
      {/* ========================= */}

      <section className="productTopSection">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="productTopWrapper flex flex-col xl:flex-row gap-10 xl:gap-16 mt-10 xl:mt-14 items-start">
            {/* LEFT */}
            <div className="w-full xl:w-[42%]">
              <ProductZoom key={product.id} images={images} />
            </div>

            {/* RIGHT */}
            <div className="w-full xl:w-[58%] text-white pt-1">
              {/* CATEGORY */}
              <div className="productCategory">{vendor}</div>

              {/* TITLE */}
              <h1 className="text-[28px] leading-[40px] md:text-[34px] md:leading-[46px] xl:text-[38px] xl:leading-[52px] font-extrabold mb-5">
                {displayName}
              </h1>

              {/* META */}
              <div className="flex items-center gap-4 flex-wrap mb-5">
                <div className="productStars">{renderStars(product.rating)}</div>

                <span className="text-white/55 text-sm">
                  {product.reviewsCount || 0} Reviews
                </span>

                <span className="text-green-400 font-bold text-sm">
                  {product.categoryName}
                </span>
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-4 flex-wrap mb-6">
                <span className="text-[34px] md:text-[40px] font-extrabold text-blue-500">
                  {formatPrice(salePrice)}
                </span>

                {listPrice != null && (
                  <span className="text-white/30 text-[20px] line-through">
                    {formatPrice(listPrice)}
                  </span>
                )}

                {discount && (
                  <span className="discountBadge">{discount}</span>
                )}
              </div>

              {/* DESCRIPTION */}
              <p className="text-white/70 text-[15px] leading-[30px] mb-6 max-w-full xl:max-w-[88%]">
                {product.description ||
                  `${displayName} - ${getDeliveryLabel(product).toLowerCase()}.`}
              </p>

              {/* STOCK */}
              <div className="flex items-center gap-3 flex-wrap mb-7">
                <span className="stockDot"></span>

                <span className="text-green-400 font-bold">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>

                <span className="text-white/50 text-sm">
                  {getDeliveryLabel(product)}
                </span>
              </div>

              {purchaseVariants.length > 0 && (
                <div className="mb-7">
                  <h4 className="sectionTitle">Loại key</h4>

                  <div className="productVariantList">
                    {purchaseVariants.map((variant) => (
                      <button
                        type="button"
                        key={variant.id}
                        className={selectedVariant?.id === variant.id ? "active" : ""}
                        onClick={() => setSelectedVariantId(variant.id)}
                      >
                        <strong>{variant.name}</strong>
                        <small>{formatPrice(variant.price)}</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QUANTITY */}
              <div className="mb-6">
                <h4 className="sectionTitle">Quantity</h4>

                <div className="quantityBox">
                  <button
                    className="quantityBtn"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                  >
                    -
                  </button>

                  <div className="quantityInput">{quantity}</div>

                  <button className="quantityBtn" onClick={increaseQuantity}>
                    +
                  </button>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 mb-9">
                <button
                  type="button"
                  className="addCartBtn"
                  onClick={() =>
                    context.addToCart(product, quantity, selectedVariant)
                  }
                >
                  Add To Cart
                </button>

                <button
                  type="button"
                  className="buyNowBtn"
                  onClick={handleBuyNow}
                >
                  {isInstantCodeProduct(product)
                    ? "Buy & Get Code"
                    : "Buy Now"}
                </button>

                <button
                  type="button"
                  className="buyNowBtn"
                  onClick={() => context.toggleCompare(product)}
                >
                  {context.isInCompare(product.id)
                    ? "Remove Compare"
                    : "Compare"}
                </button>
              </div>

              {/* FEATURES */}
              <div className="productFeatures flex flex-wrap gap-4">
                {isLicenseKeyProduct(product) && (
                  <div className="featureItem flex items-center justify-center gap-2">
                    Key format: {product.keyPrefix}-#####
                  </div>
                )}

                <div className="featureItem flex items-center justify-center gap-2">
                  {getDeliveryLabel(product)}
                </div>

                <div className="featureItem flex items-center justify-center gap-2">
                  {isPhysicalProduct(product) ? "COD available" : "VNPay required"}
                </div>

                <div className="featureItem flex items-center justify-center gap-2">
                  {product.productType === "manual_service"
                    ? "Support processed"
                    : "Order support"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* PRODUCT TABS */}
      {/* ========================= */}

      <section className="productTabsSection">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="productTabsWrapper">
            {/* TAB NAV */}
            <div className="productTabsNav flex items-center gap-8 border-b border-white/10 pb-5 flex-wrap">
              <button
                className={`tabBtn ${activeTab === "description" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>

              <button
                className={`tabBtn ${activeTab === "specifications" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>

              <button
                className={`tabBtn ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviewsCount || 0})
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="productTabContent mt-8">
              {/* DESCRIPTION */}
              {activeTab === "description" && (
                <div className="descriptionContent">
                  {product.description ? (
                    <p className="mb-5">{product.description}</p>
                  ) : (
                    <p className="mb-5">No description available.</p>
                  )}
                </div>
              )}

              {/* SPECIFICATIONS */}
              {activeTab === "specifications" && (
                <div className="space-y-4">
                  {specifications.map(([label, value]) => (
                    <div className="specItem" key={label}>
                      <span className="specItemLeft">{label}</span>

                      <span className="specItemRight">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* REVIEWS */}
              {activeTab === "reviews" && (
                <div className="reviewsWrapper">
                  {/* REVIEW SUMMARY */}
                  <div className="reviewSummary">
                    <div className="reviewSummaryLeft">
                      <h2 className="reviewAverage">
                        {product.rating?.toFixed(1) || "0.0"}
                      </h2>

                      <div className="reviewStarsLarge">
                        {renderStars(product.rating || 0)}
                      </div>

                      <p className="reviewCount">
                        Based on {product.reviewsCount || 0} reviews
                      </p>
                    </div>
                  </div>

                  {/* WRITE REVIEW */}
                  {context.isLogin ? (
                    <div className="writeReviewBox">
                      <h3 className="writeReviewTitle">Write a Review</h3>

                      <div className="reviewStarsSelect">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={rating >= star ? "active" : ""}
                            onClick={() => setRating(star)}
                          >
                            {"\u2605"}
                          </span>
                        ))}
                      </div>

                      <textarea
                        placeholder="Write your review..."
                        className="reviewTextarea"
                        maxLength={maxReviewLength}
                        value={reviewComment}
                        onChange={(event) =>
                          setReviewComment(event.target.value)
                        }
                      ></textarea>

                      <div className="reviewMeta">
                        {reviewComment.trim().length}/{maxReviewLength}
                      </div>

                      <button
                        type="button"
                        className="submitReviewBtn"
                        onClick={handleSubmitReview}
                        disabled={
                          submittingReview || rating < 1 || !reviewComment.trim()
                        }
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  ) : (
                    <div className="writeReviewBox">
                      <h3 className="writeReviewTitle">Want to write a review?</h3>

                      <button
                        type="button"
                        className="submitReviewBtn"
                        onClick={() => navigate("/login")}
                      >
                        Login to Review
                      </button>
                    </div>
                  )}

                  {/* REVIEW LIST */}
                  <div className="reviewList">
                    {reviewsLoading ? (
                      <p>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                      <p>No reviews yet. Be the first to review.</p>
                    ) : (
                      reviews.map((review) => (
                        <div className="reviewItem" key={review.id}>
                          <div className="reviewTop">
                            <div>
                              <h4 className="reviewUser">
                                {review.userName}
                              </h4>

                              <div className="reviewStars">
                                {renderStars(review.rating)}
                              </div>
                            </div>

                            <span className="reviewDate">
                              {formatReviewDate(review.createdAt)}
                            </span>
                          </div>

                          <p className="reviewText">
                            {review.comment || "No comment."}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
