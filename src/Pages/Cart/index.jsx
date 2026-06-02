import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { FaTrashAlt, FaArrowLeft, FaLock } from "react-icons/fa";
import { MyContext } from "../../App";
import { validateCoupon } from "../../services/cmsService";
import {
  computeDiscountLabel,
  getDeliveryLabel,
  getCartItemListPrice,
  getCartItemSalePrice,
  getProductDisplayName,
  getProductThumbnail,
  getPurchaseVariants,
  isPhysicalProduct,
} from "../../utils/productSchema";
import { formatPrice } from "../../utils/products";
import "./index.css";

const Cart = () => {
  const context = useContext(MyContext);
  const { cartItems, cartSummary } = context;
  const isEmpty = cartItems.length === 0;
  const hasDigitalItems = cartItems.some(
    (item) => !isPhysicalProduct(item.product),
  );
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("appliedCoupon") || "null");
    } catch {
      return null;
    }
  });

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      context.openAlertBox("error", "Enter a coupon code");
      return;
    }

    if (!context.isLogin) {
      context.openAlertBox("error", "Please login to apply a coupon");
      return;
    }

    try {
      const result = await validateCoupon(
        couponCode.trim(),
        cartSummary.subtotal,
      );

      localStorage.setItem("appliedCoupon", JSON.stringify(result));
      setAppliedCoupon(result);
      context.openAlertBox("success", "Coupon applied");
    } catch (error) {
      context.openAlertBox("error", error.message || "Invalid coupon");
    }
  };

  const displayTotal = appliedCoupon
    ? appliedCoupon.total + (cartSummary.subtotal > 0 ? 2 : 0)
    : cartSummary.total;

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
              {cartItems.map((item) => {
                const variants = getPurchaseVariants(item.product);
                const itemSalePrice = getCartItemSalePrice(item);
                const itemListPrice = getCartItemListPrice(item);

                return (
                <div className="cartItem" key={`${item.productId}-${item.variant?.id || "default"}`}>
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
                      <span>{getDeliveryLabel(item.product)}</span>
                      <span>
                        {isPhysicalProduct(item.product)
                          ? "COD eligible"
                          : "VNPay required"}
                      </span>
                    </div>

                    {variants.length > 0 && (
                      <div className="cartVariantSelect">
                        <span>{isPhysicalProduct(item.product) ? "Option" : "Key type"}</span>
                        <div className="cartVariantPills">
                          {variants.map((variant) => (
                            <button
                              type="button"
                              key={variant.id}
                              className={item.variant?.id === variant.id ? "active" : ""}
                              onClick={() => context.updateCartVariant(item, variant)}
                            >
                              {variant.color && (
                                <i style={{ background: variant.color }} />
                              )}
                              <b>{variant.name}</b>
                              <small>{formatPrice(variant.price)}</small>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="cartPriceBox">
                      {itemListPrice != null && (
                        <span className="oldPrice">
                          {formatPrice(itemListPrice)}
                        </span>
                      )}

                      <span className="cartPrice">
                        {formatPrice(itemSalePrice)}
                      </span>

                      {!item.variant && computeDiscountLabel(item.product) && (
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
                            item.quantity - 1,
                            item.variant,
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
                            item.quantity + 1,
                            item.variant,
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="cartTotal">
                      {formatPrice(
                        itemSalePrice * item.quantity
                      )}
                    </div>

                    <button
                      type="button"
                      className="removeBtn"
                      onClick={() =>
                        context.removeFromCart(item.productId, item.variant)
                      }
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              );
              })}
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
                  <span>Included</span>
                </div>

                {cartSummary.tax > 0 && (
                  <div className="summaryRow">
                    <span>Tax</span>
                    <span>{formatPrice(cartSummary.tax)}</span>
                  </div>
                )}

                <div className="summaryDivider"></div>

                {appliedCoupon?.discount > 0 && (
                  <div className="summaryRow">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span className="discount">
                      -{formatPrice(appliedCoupon.discount)}
                    </span>
                  </div>
                )}

                <div className="summaryDivider"></div>

                <div className="summaryTotal">
                  <span>Total</span>
                  <span>{formatPrice(displayTotal)}</span>
                </div>

                <div className="couponBox">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                  />
                  <button type="button" onClick={applyCoupon}>
                    Apply
                  </button>
                </div>

                <Link to="/checkout" className="checkoutBtn">
                  Proceed to secure checkout
                </Link>

                <div className="secureText">
                  <FaLock />
                  <span>
                    {hasDigitalItems
                      ? "Digital products require online payment before delivery"
                      : "VNPay or COD available for physical products"}
                  </span>
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
