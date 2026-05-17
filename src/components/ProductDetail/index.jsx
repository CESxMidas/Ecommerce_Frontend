import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
import "./index.css";
import ProductZoom from "../ProductZoom";
import { useState } from "react";
const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  return (
    <div>
      <section className="py-5 pb-0">
        <div className="container">
          <div className="breadcrumbWrapper">
            <div className="container mx-auto px-6">
              <Breadcrumbs separator="›">
                <Link underline="hover" color="inherit" href="/">
                  Home
                </Link>
                <Link underline="hover" color="inherit" href="/">
                  Products
                </Link>
              </Breadcrumbs>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6">
          <div className="flex gap-8 mt-10 items-start">
            {/* LEFT */}
            <div className="w-[40%]">
              <ProductZoom image="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop" />
            </div>
            {/* RIGHT */}
            <div className="w-[60%] productDetailContent text-white">

              {/* CATEGORY */}
              <div className="productCategory">
                Software License
              </div>

              {/* TITLE */}
              <h1 className="productDetailTitle">
                Windows 11 Pro Retail Key Lifetime Activation
              </h1>

              {/* META */}
              <div className="productMeta">

                <div className="productStars">
                  ★★★★★
                </div>

                <span className="productReview">
                  128 Reviews
                </span>

                <span className="productSold">
                  1.2k Sold
                </span>

              </div>

              {/* PRICE */}
              <div className="productPriceWrapper">

                <span className="productPrice">
                  $29.99
                </span>

                <span className="productOldPrice">
                  $99.99
                </span>

                <span className="productDiscount">
                  -70%
                </span>

              </div>

              {/* DESCRIPTION */}
              <p className="productDescription">
                Genuine Windows 11 Pro activation key with lifetime validity.
                Instant delivery via email after payment confirmation.
                Supports all languages and official Microsoft updates.
              </p>

              {/* STOCK */}
              <div className="productStock">

                <span className="stockDot"></span>

                <span className="stockText">
                  In Stock
                </span>

                <span className="stockSub">
                  Ready for instant delivery
                </span>

              </div>

              {/* COLORS */}
              <div className="productColorWrapper">

                <h4 className="productSectionTitle">
                  Available Versions
                </h4>

                <div className="productColors">

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
              <div className="quantityWrapper">

                <h4 className="productSectionTitle">
                  Quantity
                </h4>

                <div className="quantityBox">

                  <button
                    className="quantityBtn"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                  >
                    -
                  </button>

                  <div className="quantityInput">
                    {quantity}
                  </div>

                  <button
                    className="quantityBtn"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>

                </div>

              </div>
              {/* BUTTONS */}
              <div className="productButtons">

                <button className="addCartBtn">
                  Add To Cart
                </button>

                <button className="buyNowBtn">
                  Buy Now
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
