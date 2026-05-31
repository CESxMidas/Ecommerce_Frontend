import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import ProductZoom from "../ProductZoom";
import {
  computeDiscountLabel,
  getListPrice,
  getProductDisplayName,
  getProductTypeLabel,
  getPurchaseVariants,
  getSalePrice,
  getDeliveryLabel,
  isInstantCodeProduct,
  isPhysicalProduct,
  resolvePurchaseVariant,
} from "../../utils/productSchema";
import { formatPrice, getProductImages } from "../../utils/products";
import "./index.css";

const ProductDetailModal = () => {
  const context = useContext(MyContext);
  const product = context.selectedProduct;
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState("");

  useEffect(() => {
    const variants = getPurchaseVariants(product);
    setSelectedVariantId(variants[0]?.id || "");
    setQuantity(1);
  }, [product]);

  if (!product) {
    return null;
  }

  const images = getProductImages(product);
  const displayName = getProductDisplayName(product);
  const purchaseVariants = getPurchaseVariants(product);
  const selectedVariant = resolvePurchaseVariant(product, selectedVariantId);
  const salePrice = selectedVariant?.price ?? getSalePrice(product);
  const listPrice = selectedVariant?.listPrice ?? getListPrice(product);
  const discount = selectedVariant ? undefined : computeDiscountLabel(product);
  const vendor = product.vendor || product.brand || product.categoryName;
  const renderStars = (value) => {
    const fullStars = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));

    return "\u2605".repeat(fullStars).padEnd(5, "\u2606");
  };

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

          <div className="modalProductMeta">
            <span>{getProductTypeLabel(product)}</span>
            <span>{getDeliveryLabel(product)}</span>
            <span>{isPhysicalProduct(product) ? "COD available" : "VNPay required"}</span>
          </div>

          <div className="modalRating">
            <div className="stars">{renderStars(product.rating)}</div>
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
              `${displayName} with ${getDeliveryLabel(product).toLowerCase()}.`}
          </p>

          <div className="modalStock">
            <span className="stockDot"></span>
            <span className="stockText">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
            <span className="modalDeliveryText">{getDeliveryLabel(product)}</span>
          </div>

          {purchaseVariants.length > 0 && (
            <div className="modalVariantWrapper">
              <h5>Loại key</h5>
              <div className="modalVariantList">
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
              onClick={() => context.addToCart(product, quantity, selectedVariant)}
            >
              Add To Cart
            </button>

            <button
              type="button"
              className="buyNowBtn"
              onClick={() => {
                if (isInstantCodeProduct(product)) {
                  context.purchaseLicenseProduct(product, quantity, selectedVariant);
                  context.handleCloseProductDetailModal();
                  return;
                }

                context.addToCart(product, quantity, selectedVariant);
                context.handleCloseProductDetailModal();
                context.setOpenCartPanel(true);
              }}
            >
              {isInstantCodeProduct(product) ? "Buy & Get Code" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
