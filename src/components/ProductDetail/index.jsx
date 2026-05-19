import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
import "./index.css";
import ProductZoom from "../ProductZoom";
import { useState } from "react";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
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
                <Link underline="hover" color="inherit" href="/">
                  Home
                </Link>

                <Link underline="hover" color="inherit" href="/">
                  Products
                </Link>

                <Link underline="hover" color="inherit" href="/">
                  Windows 11 Pro
                </Link>
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
              <ProductZoom image="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop" />
            </div>

            {/* RIGHT */}
            <div className="w-full xl:w-[58%] text-white pt-1">
              {/* CATEGORY */}
              <div className="productCategory">Software License</div>

              {/* TITLE */}
              <h1 className="text-[28px] leading-[40px] md:text-[34px] md:leading-[46px] xl:text-[38px] xl:leading-[52px] font-extrabold mb-5">
                Windows 11 Pro Retail Key
                <br />
                Lifetime Activation
              </h1>

              {/* META */}
              <div className="flex items-center gap-4 flex-wrap mb-5">
                <div className="productStars">★★★★★</div>

                <span className="text-white/55 text-sm">128 Reviews</span>

                <span className="text-green-400 font-bold text-sm">
                  1.2k Sold
                </span>
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-4 flex-wrap mb-6">
                <span className="text-[34px] md:text-[40px] font-extrabold text-blue-500">
                  $29.99
                </span>

                <span className="text-white/30 text-[20px] line-through">
                  $99.99
                </span>

                <span className="discountBadge">-70%</span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-white/70 text-[15px] leading-[30px] mb-6 max-w-full xl:max-w-[88%]">
                Genuine Windows 11 Pro license with lifetime activation. Instant
                email delivery and official Microsoft update support.
              </p>

              {/* STOCK */}
              <div className="flex items-center gap-3 flex-wrap mb-7">
                <span className="stockDot"></span>

                <span className="text-green-400 font-bold">In Stock</span>

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
                <button className="addCartBtn">Add To Cart</button>

                <button className="buyNowBtn">Buy Now</button>
              </div>

              {/* FEATURES */}
              <div className="productFeatures flex flex-wrap gap-4">
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
