// CartPanel/index.jsx

import { useContext } from "react";
import Drawer from "@mui/material/Drawer";
import { IoClose } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import "./index.css";
import { Link } from "react-router-dom";
const CartPanel = () => {
  const context = useContext(MyContext);

  return (
    <Drawer
      anchor="right"
      open={context.openCartPanel}
      onClose={() => context.setOpenCartPanel(false)}
      PaperProps={{
        sx: {
          width: 420,
          background: "#020817",
        },
      }}
    >
      <div className="cartPanel">
        {/* TOP */}
        <div className="cartPanelTop">
          <h4>Shopping Cart (2)</h4>

          <button onClick={() => context.setOpenCartPanel(false)}>
            <IoClose />
          </button>
        </div>

        {/* BODY */}
        <div className="cartPanelBody">
          {/* ITEM */}
          <div className="cartItem">
            <div className="cartItemImage">
              <img
                src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1000&auto=format&fit=crop"
                alt=""
              />
            </div>

            <div className="cartItemInfo">
              <h5>Windows 11 Pro Retail Key</h5>

              <span className="cartItemCategory">Software License</span>

              <div className="cartItemBottom">
                <div className="cartItemPrice">$29.99</div>

                <div className="cartQty">Qty: 1</div>
              </div>
            </div>

            <button className="removeCartItem">
              <FaTrashAlt />
            </button>
          </div>

          {/* ITEM */}
          <div className="cartItem">
            <div className="cartItemImage">
              <img
                src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000&auto=format&fit=crop"
                alt=""
              />
            </div>

            <div className="cartItemInfo">
              <h5>PlayStation Gift Card</h5>

              <span className="cartItemCategory">Digital Gift Card</span>

              <div className="cartItemBottom">
                <div className="cartItemPrice">$50.00</div>

                <div className="cartQty">Qty: 2</div>
              </div>
            </div>

            <button className="removeCartItem">
              <FaTrashAlt />
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="cartPanelFooter">
          <div className="cartSubtotal">
            <span>Subtotal</span>

            <h3>$129.99</h3>
          </div>

          <button className="checkoutBtn">Proceed To Checkout</button>

          <Link
            to="/cart"
            className="viewCartBtn"
            onClick={() => context.setOpenCartPanel(false)}
          >
            View Full Cart
          </Link>
        </div>
      </div>
    </Drawer>
  );
};

export default CartPanel;
