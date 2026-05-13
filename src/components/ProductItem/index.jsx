import {
  FaHeart,
  FaExchangeAlt,
  FaExpand,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

import "./index.css";

const ProductItem = ({ item }) => {
  return (
    <div className="productItem group">
      {/* IMAGE */}
      <div className="productImageWrapper">
        {/* BADGES */}
        <div className="productBadges">
          {item.discount && (
            <span className="discountBadge">
              {item.discount}
            </span>
          )}

          <span className="typeBadge">
            {item.tag}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="productActions">
          <button>
            <FaHeart />
          </button>

          <button>
            <FaExchangeAlt />
          </button>

          <button>
            <FaExpand />
          </button>

          <button>
            <FaShoppingCart />
          </button>
        </div>

        {/* IMAGE */}
        <img
          src={item.image}
          alt={item.title}
          className="productImage"
        />
      </div>

      {/* CONTENT */}
      <div className="productContent">
        <span className="brandName">
          {item.brand}
        </span>

        <h3>
          {item.title}
        </h3>

        {/* RATING */}
        <div className="ratingWrapper">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar key={star} />
          ))}
        </div>

        {/* PRICE */}
        <div className="priceWrapper">
          <span className="oldPrice">
            ${item.oldPrice}
          </span>

          <span className="newPrice">
            ${item.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;