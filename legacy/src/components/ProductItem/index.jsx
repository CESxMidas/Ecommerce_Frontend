import {
  FaHeart,
  FaExchangeAlt,
  FaExpand,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../App";
import {
  computeDiscountLabel,
  getListPrice,
  getProductDisplayName,
  getProductThumbnail,
  getPurchaseVariants,
  getSalePrice,
  isPhysicalProduct,
} from "../../utils/productSchema";
import { formatPrice } from "../../utils/products";
import "./index.css";

const ProductItem = ({ item }) => {
  const context = useContext(MyContext);
  const salePrice = getSalePrice(item);
  const listPrice = getListPrice(item);
  const discount = computeDiscountLabel(item);
  const displayName = getProductDisplayName(item);
  const thumbnail = getProductThumbnail(item);
  const vendor = item.vendor || item.brand || item.categoryName;
  const variants = getPurchaseVariants(item);
  const minVariantPrice =
    variants.length > 0
      ? Math.min(...variants.map((variant) => Number(variant.price) || salePrice))
      : salePrice;
  const colorVariants = variants.filter((variant) => variant.color);

  return (
    <div className="productItem flex">
      <div className="productImageWrapper">
        <div className="productBadges">
          {discount && <span className="discountBadge">{discount}</span>}

          {(item.badge || item.tag) && (
            <span className="typeBadge">{item.badge || item.tag}</span>
          )}

        </div>

        <div className="productActions">
          <button
            type="button"
            onClick={() => context.toggleWishlist(item)}
            className={context.isInWishlist(item.id) ? "active" : ""}
          >
            <FaHeart />
          </button>

          <button
            type="button"
            onClick={() => context.toggleCompare(item)}
            className={context.isInCompare(item.id) ? "active" : ""}
            aria-label="Compare product"
          >
            <FaExchangeAlt />
          </button>

          <button
            type="button"
            onClick={() => context.handleOpenProductDetailModal(item)}
          >
            <FaExpand />
          </button>

          <button type="button" onClick={() => context.addToCart(item)}>
            <FaShoppingCart />
          </button>
        </div>

        <Link to={`/product/${item.slug || item.id}`}>
          <img
            src={thumbnail}
            alt={displayName}
            className="productImage"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="productItemContent">
        <span className="brandName">{vendor}</span>

        <Link to={`/product/${item.slug || item.id}`} className="productTitleLink">
          <h3>{displayName}</h3>
        </Link>

        <div className="ratingWrapper">
          {Array.from({ length: 5 }).map((_, index) => (
            <FaStar
              key={index}
              className={
                index < Math.round(item.rating || 0) ? "starFilled" : ""
              }
            />
          ))}
        </div>

        {variants.length > 0 && (
          <div className="productVariantPreview">
            <span>
              {isPhysicalProduct(item)
                ? `${variants.length} color options`
                : `${variants.length} plans, monthly default`}
            </span>
            {colorVariants.length > 0 && (
              <div className="productSwatches" aria-label="Available colors">
                {colorVariants.slice(0, 4).map((variant) => (
                  <i
                    key={variant.id}
                    title={variant.name}
                    style={{ background: variant.color }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="priceWrapper">
          {listPrice != null && (
            <span className="oldPrice">{formatPrice(listPrice)}</span>
          )}

          <span className="newPrice">
            {variants.length > 0
              ? ` ${formatPrice(minVariantPrice)}`
              : formatPrice(salePrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
