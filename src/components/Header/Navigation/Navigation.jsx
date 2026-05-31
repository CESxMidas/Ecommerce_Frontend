import { useState } from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import {
  FaBars,
  FaChevronDown,
  FaHeadset,
  FaHome,
  FaNewspaper,
  FaShoppingBag,
  FaTag,
} from "react-icons/fa";

import CategoryPanel from "./CategoryPanel";

import "./Navigation.css";

const Navigation = () => {
  const [open, setOpen] = useState(false);

  const closeDrawer = () => setOpen(false);

  return (
    <>
      <nav className="navigationWrapper">
        <div className="container navigationInner">
          <div className="navLeft">
            <button
              type="button"
              className="categoryBtn"
              onClick={() => setOpen(true)}
            >
              <FaBars />
              All Categories
            </button>
          </div>

          <ul className="navMenu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <FaHome />
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/productListing" className="nav-link">
                <FaShoppingBag />
                Shop
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/deals?sort=popular" className="nav-link nav-link--deal">
                <FaTag />
                Deals
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/blog" className="nav-link">
                <FaNewspaper />
                Blog
              </Link>
            </li>

            <li className="nav-item group">
              <button type="button" className="nav-link">
                <FaHeadset />
                Support
                <FaChevronDown className="text-[11px]" />
              </button>

              <div className="submenu">
                <Link to="/help-center" className="submenu-item">
                  Help Center
                </Link>
                <Link to="/contact" className="submenu-item">
                  Contact Us
                </Link>
                <Link to="/track-order" className="submenu-item">
                  Track Order
                </Link>
                <Link to="/payment-policy" className="submenu-item">
                  Payment Policy
                </Link>
                <Link to="/returns" className="submenu-item">
                  Refund Policy
                </Link>
              </div>
            </li>
          </ul>

          <div className="navRight">
            <Link to="/track-order">Track Order</Link>
          </div>
        </div>
      </nav>

      <Drawer
        anchor="left"
        open={open}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            background: "#071739",
            width: 320,
          },
        }}
      >
        <CategoryPanel onNavigate={closeDrawer} />
      </Drawer>
    </>
  );
};

export default Navigation;
