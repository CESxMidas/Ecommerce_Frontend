import { Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "./index.css";
import ProductZoom from "../ProductZoom";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { fetchProductById } from "../../services/productService";
import {
  computeDiscountLabel,
  getListPrice,
  getProductDisplayName,
  getSalePrice,
  isLicenseKeyProduct,
} from "../../utils/productSchema";
import { formatPrice, getProductImages } from "../../utils/products";

const ProductDetail = () => {
  const context = useContext(MyContext);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const data = await fetchProductById(id);

        if (!cancelled) {
          setProduct(data);
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
  const salePrice = getSalePrice(product);
  const listPrice = getListPrice(product);
  const discount = computeDiscountLabel(product);
  const vendor = product.vendor || product.brand || product.categoryName;
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
              <Breadcrumbs separator="›">
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
                <div className="productStars">★★★★★</div>

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
                  `${displayName} — genuine digital license with instant email delivery.`}
              </p>

              {/* STOCK */}
              <div className="flex items-center gap-3 flex-wrap mb-7">
                <span className="stockDot"></span>

                <span className="text-green-400 font-bold">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>

                <span className="text-white/50 text-sm">
                  Ready for instant delivery
                </span>
              </div>

              {/* VERSION */}
              <div className="mb-7">
                <h4 className="sectionTitle">Available Versions</h4>

                <div className="flex items-center gap-4">
                  <button
                    className="colorItem active"
                    style={{ background: "#2563eb" }}
                  ></button>

                  <button
                    className="colorItem"
                    style={{ background: "#111827" }}
                  ></button>

                  <button
                    className="colorItem"
                    style={{ background: "#dc2626" }}
                  ></button>
                </div>
              </div>

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
                  onClick={() => context.addToCart(product)}
                >
                  Add To Cart
                </button>

                <button
                  type="button"
                  className="buyNowBtn"
                  onClick={() => {
                    if (isLicenseKeyProduct(product)) {
                      context.purchaseLicenseProduct(product, quantity);
                      return;
                    }

                    context.addToCart(product, quantity);
                    context.setOpenCartPanel(true);
                  }}
                >
                  {isLicenseKeyProduct(product)
                    ? "Buy & Get Key"
                    : "Buy Now"}
                </button>
              </div>

              {/* FEATURES */}
              <div className="productFeatures flex flex-wrap gap-4">
                {isLicenseKeyProduct(product) && (
                  <div className="featureItem flex items-center justify-center gap-2">
                    🔑 Key format: {product.keyPrefix}-#####
                  </div>
                )}

                <div className="featureItem flex items-center justify-center gap-2">
                  ⚡ Instant Delivery
                </div>

                <div className="featureItem flex items-center justify-center gap-2">
                  🔒 Genuine License
                </div>

                <div className="featureItem flex items-center justify-center gap-2">
                  ♾ Lifetime Activation
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
                className={`tabBtn ${
                  activeTab === "description" ? "active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>

              <button
                className={`tabBtn ${
                  activeTab === "specifications" ? "active" : ""
                }`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>

              <button
                className={`tabBtn ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews (128)
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="productTabContent mt-8">
              {/* DESCRIPTION */}
              {activeTab === "description" && (
                <div className="descriptionContent">
                  <p className="mb-5">
                    Windows 11 Pro offers advanced security, business tools, and
                    optimized performance for professional users.
                  </p>

                  <p className="mb-5">
                    This license includes lifetime activation and supports
                    official Microsoft updates without subscription fees.
                  </p>

                  <p>
                    Instant delivery is available immediately after payment
                    confirmation.
                  </p>
                </div>
              )}

              {/* SPECIFICATIONS */}
              {activeTab === "specifications" && (
                <div className="space-y-4">
                  <div className="specItem">
                    <span className="specItemLeft">License Type</span>

                    <span className="specItemRight">Retail Key</span>
                  </div>

                  <div className="specItem">
                    <span className="specItemLeft">Activation</span>

                    <span className="specItemRight">Lifetime</span>
                  </div>

                  <div className="specItem">
                    <span className="specItemLeft">Delivery</span>

                    <span className="specItemRight">
                      Instant Email Delivery
                    </span>
                  </div>

                  <div className="specItem">
                    <span className="specItemLeft">Updates</span>

                    <span className="specItemRight">
                      Official Microsoft Updates
                    </span>
                  </div>
                </div>
              )}

              {/* REVIEWS */}
              {activeTab === "reviews" && (
                <div className="reviewsWrapper">
                  {/* REVIEW SUMMARY */}
                  <div className="reviewSummary">
                    <div className="reviewSummaryLeft">
                      <h2 className="reviewAverage">4.9</h2>

                      <div className="reviewStarsLarge">★★★★★</div>

                      <p className="reviewCount">Based on 128 reviews</p>
                    </div>

                    <div className="reviewSummaryRight">
                      <div className="ratingRow">
                        <span>5 Stars</span>

                        <div className="ratingBar">
                          <div
                            className="ratingFill"
                            style={{ width: "92%" }}
                          ></div>
                        </div>

                        <span>92%</span>
                      </div>

                      <div className="ratingRow">
                        <span>4 Stars</span>

                        <div className="ratingBar">
                          <div
                            className="ratingFill"
                            style={{ width: "6%" }}
                          ></div>
                        </div>

                        <span>6%</span>
                      </div>

                      <div className="ratingRow">
                        <span>3 Stars</span>

                        <div className="ratingBar">
                          <div
                            className="ratingFill"
                            style={{ width: "2%" }}
                          ></div>
                        </div>

                        <span>2%</span>
                      </div>
                    </div>
                  </div>

                  {/* WRITE REVIEW */}
                  <div className="writeReviewBox">
                    <h3 className="writeReviewTitle">Write a Review</h3>

                    <div className="reviewStarsSelect">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={rating >= star ? "active" : ""}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Your Name"
                      className="reviewInput"
                    />

                    <textarea
                      placeholder="Write your review..."
                      className="reviewTextarea"
                    ></textarea>

                    <button className="submitReviewBtn">Submit Review</button>
                  </div>

                  {/* REVIEW LIST */}
                  <div className="reviewList">
                    <div className="reviewItem">
                      <div className="reviewTop">
                        <div>
                          <h4 className="reviewUser">John Carter</h4>

                          <div className="reviewStars">★★★★★</div>
                        </div>

                        <span className="reviewDate">2 days ago</span>
                      </div>

                      <p className="reviewText">
                        Fast delivery and activation worked perfectly.
                      </p>
                    </div>

                    <div className="reviewItem">
                      <div className="reviewTop">
                        <div>
                          <h4 className="reviewUser">Alex Morgan</h4>

                          <div className="reviewStars">★★★★★</div>
                        </div>

                        <span className="reviewDate">5 days ago</span>
                      </div>

                      <p className="reviewText">
                        Genuine key and easy installation process.
                      </p>
                    </div>
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
