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
  getSalePrice,
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

        <div className="priceWrapper">
          {listPrice != null && (
            <span className="oldPrice">{formatPrice(listPrice)}</span>
          )}

          <span className="newPrice">{formatPrice(salePrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
