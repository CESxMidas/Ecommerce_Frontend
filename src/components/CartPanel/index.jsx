import { useContext } from "react";
import Drawer from "@mui/material/Drawer";
import { IoClose } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import {
  getProductDisplayName,
  getProductThumbnail,
  getSalePrice,
} from "../../utils/productSchema";
import { formatPrice } from "../../utils/products";
import "./index.css";
import { Link } from "react-router-dom";

const CartPanel = () => {
  const context = useContext(MyContext);
  const { cartItems, cartSummary } = context;

  return (
    <Drawer
      anchor="right"
      open={context.openCartPanel}
      onClose={() => context.setOpenCartPanel(false)}
      PaperProps={{
        sx: {
          width: "min(420px, 100vw)",
          background: "#020817",
        },
      }}
    >
      <div className="cartPanel">
        <div className="cartPanelTop">
          <h4>Shopping Cart ({cartSummary.count})</h4>

          <button
            type="button"
            onClick={() => context.setOpenCartPanel(false)}
          >
            <IoClose />
          </button>
        </div>

        <div className="cartPanelBody">
          {cartItems.length === 0 ? (
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                textAlign: "center",
                padding: "24px 12px",
              }}
            >
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div className="cartItem" key={item.productId}>
                <div className="cartItemImage">
                  <img
                    src={getProductThumbnail(item.product)}
                    alt={getProductDisplayName(item.product)}
                  />
                </div>

                <div className="cartItemInfo">
                  <h5>{getProductDisplayName(item.product)}</h5>

                  <span className="cartItemCategory">
                    {item.product.vendor || item.product.brand}
                  </span>

                  <div className="cartItemMeta">
                    <span>Qty: {item.quantity}</span>
                  </div>

                  <div className="cartItemBottom">
                    <div className="cartItemPrice">
                      {formatPrice(
                        getSalePrice(item.product) * item.quantity
                      )}
                    </div>

                    <div className="cartQtyBox">
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
                  </div>
                </div>

                <button
                  type="button"
                  className="removeCartItem"
                  onClick={() =>
                    context.removeFromCart(item.productId)
                  }
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cartPanelFooter">
            <div className="cartSubtotal">
              <span>Subtotal</span>
              <h3>{formatPrice(cartSummary.subtotal)}</h3>
            </div>

            <div className="cartPanelActions">
              <Link
                to="/checkout"
                className="checkoutBtn"
                onClick={() => context.setOpenCartPanel(false)}
              >
                Proceed To Checkout
              </Link>

              <Link
                to="/cart"
                className="viewCartBtn"
                onClick={() => context.setOpenCartPanel(false)}
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartPanel;
