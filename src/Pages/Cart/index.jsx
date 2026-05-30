import { Link } from "react-router-dom";
import { useContext } from "react";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
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

const Cart = () => {
  const context = useContext(MyContext);
  const { cartItems, cartSummary } = context;
  const isEmpty = cartItems.length === 0;

  return (
    <section className="cartPage">
      <div className="container">
        <div className="cartTop">
          <div>
            <h2>Shopping Cart</h2>
            <p>
              You have {cartSummary.count} item
              {cartSummary.count !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <Link to="/productListing" className="continueShopping">
            <FaArrowLeft />
            Continue Shopping
          </Link>
        </div>

        {isEmpty ? (
          <div className="cartLeft" style={{ padding: "48px 24px", textAlign: "center" }}>
            <p style={{ marginBottom: 16, color: "rgba(255,255,255,0.7)" }}>
              Your cart is empty.
            </p>
            <Link to="/productListing" className="continueShopping">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cartWrapper">
            <div className="cartLeft">
              {cartItems.map((item) => (
                <div className="cartItem" key={item.productId}>
                  <div className="cartItemImage">
                    <img
                      src={getProductThumbnail(item.product)}
                      alt={getProductDisplayName(item.product)}
                    />
                  </div>

                  <div className="cartItemInfo">
                    <span className="cartCategory">
                      {(item.product.vendor || item.product.brand || "").toUpperCase()}
                    </span>

                    <h4>{getProductDisplayName(item.product)}</h4>

                    <div className="cartMeta">
                      <span>Platform: PC</span>
                      <span>Delivery: Instant</span>
                    </div>

                    <div className="cartPriceBox">
                      {getListPrice(item.product) != null && (
                        <span className="oldPrice">
                          {formatPrice(getListPrice(item.product))}
                        </span>
                      )}

                      <span className="cartPrice">
                        {formatPrice(getSalePrice(item.product))}
                      </span>

                      {computeDiscountLabel(item.product) && (
                        <span className="discountBadge">
                          {computeDiscountLabel(item.product)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cartActions">
                    <div className="cartQuantity">
                      <button
                        type="button"
                        onClick={() =>
                          context.updateCartQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          context.updateCartQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="cartTotal">
                      {formatPrice(
                        getSalePrice(item.product) * item.quantity
                      )}
                    </div>

                    <button
                      type="button"
                      className="removeBtn"
                      onClick={() =>
                        context.removeFromCart(item.productId)
                      }
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cartRight">
              <div className="summaryCard">
                <h3>Order Summary</h3>

                <div className="summaryRow">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSummary.subtotal)}</span>
                </div>

                {cartSummary.savings > 0 && (
                  <div className="summaryRow">
                    <span>Discount</span>
                    <span className="discount">
                      -{formatPrice(cartSummary.savings)}
                    </span>
                  </div>
                )}

                <div className="summaryRow">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>

                {cartSummary.tax > 0 && (
                  <div className="summaryRow">
                    <span>Tax</span>
                    <span>{formatPrice(cartSummary.tax)}</span>
                  </div>
                )}

                <div className="summaryDivider"></div>

                <div className="summaryTotal">
                  <span>Total</span>
                  <span>{formatPrice(cartSummary.total)}</span>
                </div>

                <div className="couponBox">
                  <input type="text" placeholder="Coupon code" />
                  <button type="button">Apply</button>
                </div>

                <Link to="/checkout" className="checkoutBtn">
                  Proceed To Checkout
                </Link>

                <button type="button" className="paypalBtn">
                  Pay With PayPal
                </button>

                <div className="secureText">
                  🔒 Secure Checkout Guaranteed
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
