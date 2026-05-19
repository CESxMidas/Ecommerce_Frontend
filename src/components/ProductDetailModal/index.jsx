import { useContext, useState } from "react";

import { MyContext } from "../../App";

import ProductZoom from "../ProductZoom";

import "./index.css";

const ProductDetailModal = () => {
  const context = useContext(MyContext);

  const [quantity, setQuantity] = useState(1);

  return (
    <div className="productDetailModalWrapper">
      {/* CLOSE BUTTON */}
      <button
        className="closeModalBtn"
        onClick={context.handleCloseProductDetailModal}
      >
        ✕
      </button>

      <div className="productModalContent">
        {/* LEFT */}
        <div className="productModalLeft">
          <ProductZoom />
        </div>

        {/* RIGHT */}
        <div className="productModalRight">
          {/* CATEGORY */}
          <div className="productCategory">Software License</div>

          {/* TITLE */}
          <h2 className="modalProductTitle">Windows 11 Pro Retail Key asdadasd</h2>

          {/* RATING */}
          <div className="modalRating">
            <div className="stars">★★★★★</div>

            <span>128 Reviews</span>
          </div>

          {/* PRICE */}
          <div className="modalPriceWrapper">
            <span className="modalPrice">$29.99</span>

            <span className="modalOldPrice">$99.99</span>

            <span className="modalDiscount">-70%</span>
          </div>

          {/* DESCRIPTION */}
          <p className="modalDescription">
            Windows 11 Pro Retail Key
 with lifetime validity and
            instant delivery.
          </p>

          {/* STOCK */}
          <div className="modalStock">
            <span className="stockDot"></span>

            <span className="stockText">In Stock</span>
          </div>
          {/* COLORS */}
          <div className="modalColorWrapper">
            <h5>Colors</h5>

            <div className="modalColors">
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

              <button
                className="colorItem"
                style={{ background: "#9333ea" }}
              ></button>
            </div>
          </div>

          {/* QUANTITY */}
          <div className="modalQuantityWrapper">
            <h5>Quantity</h5>

            <div className="quantityBox">
              <button
                className="quantityBtn"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </button>
              <div className="quantityInput">{quantity}</div>
              <button
                className="quantityBtn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="modalButtons">
            <button className="addCartBtn">Add To Cart</button>

            <button className="buyNowBtn">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
