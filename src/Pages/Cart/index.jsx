import { Link } from "react-router-dom";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import "./index.css";
const Cart = () => {
  return (
    <section className="cartPage">
      <div className="container">
        {/* TOP */}
        <div className="cartTop">
          <div>
            <h2>Shopping Cart</h2>
            <p>You have 2 items in your cart</p>
          </div>
          <Link to="/productListing" className="continueShopping">
            <FaArrowLeft />
            Continue Shopping
          </Link>
        </div>
        {/* CONTENT */}
        <div className="cartWrapper">
          {/* LEFT */}
          <div className="cartLeft">
            {/* ITEM */}
            <div className="cartItem">
              <div className="cartItemImage">
                <img
                  src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop"
                  alt=""
                />
              </div>

              <div className="cartItemInfo">
                <span className="cartCategory">SOFTWARE</span>

                <h4>Windows 11 Pro Retail License Key</h4>

                <div className="cartMeta">
                  <span>Platform: PC</span>

                  <span>Digital Delivery</span>
                </div>

                <div className="cartPrice">$29.99</div>
              </div>

              <div className="cartActions">
                {/* QUANTITY */}
                <div className="cartQuantity">
                  <button>-</button>

                  <span>1</span>

                  <button>+</button>
                </div>

                {/* TOTAL */}
                <div className="cartTotal">$29.99</div>

                {/* REMOVE */}
                <button className="removeBtn">
                  <FaTrashAlt />
                </button>
              </div>
            </div>

            {/* ITEM */}
            <div className="cartItem">
              <div className="cartItemImage">
                <img
                  src="https://images.unsplash.com/photo-1603481546238-487240415921?q=80&w=1200&auto=format&fit=crop"
                  alt=""
                />
              </div>

              <div className="cartItemInfo">
                <span className="cartCategory">GAME</span>

                <h4>Minecraft Java & Bedrock Edition</h4>

                <div className="cartMeta">
                  <span>Platform: PC</span>

                  <span>Instant Activation</span>
                </div>

                <div className="cartPrice">$18.99</div>
              </div>

              <div className="cartActions">
                {/* QUANTITY */}
                <div className="cartQuantity">
                  <button>-</button>

                  <span>1</span>

                  <button>+</button>
                </div>

                {/* TOTAL */}
                <div className="cartTotal">$18.99</div>

                {/* REMOVE */}
                <button className="removeBtn">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="cartRight">
            <div className="summaryCard">
              <h3>Order Summary</h3>

              <div className="summaryRow">
                <span>Subtotal</span>

                <span>$48.98</span>
              </div>

              <div className="summaryRow">
                <span>Discount</span>

                <span className="discount">-$5.00</span>
              </div>

              <div className="summaryRow">
                <span>Delivery</span>

                <span>Free</span>
              </div>

              <div className="summaryDivider"></div>

              <div className="summaryTotal">
                <span>Total</span>

                <span>$43.98</span>
              </div>

              {/* COUPON */}
              <div className="couponBox">
                <input type="text" placeholder="Coupon code" />

                <button>Apply</button>
              </div>

              {/* BUTTONS */}
              <button className="checkoutBtn">Proceed To Checkout</button>

              <button className="paypalBtn">Pay With PayPal</button>

              {/* SAFE */}
              <div className="secureText">🔒 Secure Checkout Guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
