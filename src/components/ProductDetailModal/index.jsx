import { useContext, useState } from "react";
import { MyContext } from "../../App";
import ProductZoom from "../ProductZoom";
import {
  computeDiscountLabel,
  getListPrice,
  getProductDisplayName,
  getSalePrice,
  isLicenseKeyProduct,
} from "../../utils/productSchema";
import { formatPrice, getProductImages } from "../../utils/products";
import "./index.css";

const ProductDetailModal = () => {
  const context = useContext(MyContext);
  const product = context.selectedProduct;
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return null;
  }

  const images = getProductImages(product);
  const displayName = getProductDisplayName(product);
  const salePrice = getSalePrice(product);
  const listPrice = getListPrice(product);
  const discount = computeDiscountLabel(product);
  const vendor = product.vendor || product.brand || product.categoryName;

  return (
    <div className="productDetailModalWrapper">
      <button
        type="button"
        className="closeModalBtn"
        onClick={context.handleCloseProductDetailModal}
      >
        ✕
      </button>

      <div className="productModalContent">
        <div className="productModalLeft">
          <ProductZoom key={product.id} images={images} />
        </div>

        <div className="productModalRight">
          <div className="productCategory">{vendor}</div>

          <h2 className="modalProductTitle">{displayName}</h2>

          <div className="modalRating">
            <div className="stars">★★★★★</div>
            <span>{product.reviewsCount || 0} Reviews</span>
          </div>

          <div className="modalPriceWrapper">
            <span className="modalPrice">{formatPrice(salePrice)}</span>

            {listPrice != null && (
              <span className="modalOldPrice">{formatPrice(listPrice)}</span>
            )}

            {discount && <span className="modalDiscount">{discount}</span>}
          </div>

          <p className="modalDescription">
            {product.description ||
              `${displayName} with lifetime validity and instant delivery.`}
          </p>

          <div className="modalStock">
            <span className="stockDot"></span>
            <span className="stockText">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="modalQuantityWrapper">
            <h5>Quantity</h5>

            <div className="quantityBox">
              <button
                type="button"
                className="quantityBtn"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </button>

              <div className="quantityInput">{quantity}</div>

              <button
                type="button"
                className="quantityBtn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="modalButtons">
            <button
              type="button"
              className="addCartBtn"
              onClick={() => context.addToCart(product, quantity)}
            >
              Add To Cart
            </button>

            <button
              type="button"
              className="buyNowBtn"
              onClick={() => {
                if (isLicenseKeyProduct(product)) {
                  context.purchaseLicenseProduct(product, quantity);
                  context.handleCloseProductDetailModal();
                  return;
                }

                context.addToCart(product, quantity);
                context.handleCloseProductDetailModal();
                context.setOpenCartPanel(true);
              }}
            >
              {isLicenseKeyProduct(product) ? "Buy & Get Key" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
