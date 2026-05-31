import { useState, useContext } from "react";

import { Link } from "react-router-dom";

import { MyContext } from "../../App";

import "./index.css";

// ================= MUI =================

import Drawer from "@mui/material/Drawer";

import Menu from "@mui/material/Menu";

import MenuItem from "@mui/material/MenuItem";

// ================= ICONS =================

import { MdOutlineLanguage } from "react-icons/md";

import {
  FaShoppingCart,
  FaHeart,
  FaBars,
} from "react-icons/fa";

import { BiGitCompare } from "react-icons/bi";

import { FiUser, FiLogIn } from "react-icons/fi";

import { FaRegUser } from "react-icons/fa";

import { IoBagCheckOutline } from "react-icons/io5";

import { IoMdHeartEmpty } from "react-icons/io";

// ================= COMPONENTS =================

import SearchBox from "../Search";

import Navigation from "./Navigation/Navigation";

import CategoryPanel from "./Navigation/CategoryPanel";

const Header = () => {
  // ================= CATEGORY DRAWER =================

  const [openCategory, setOpenCategory] =
    useState(false);

  // ================= USER MENU =================

  const [anchorEl, setAnchorEl] =
    useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // ================= CONTEXT =================

  const context = useContext(MyContext);

  return (
    <header className="w-full headerWrapper">
      {/* ================= TOP STRIP ================= */}

      <div className="top-strip">
        <div className="container topStripInner">
          {/* LEFT */}

          <div className="topStripMessage">
            Verified software keys. Instant digital delivery.
          </div>

          {/* RIGHT */}

          <div className="topStripLinks">
            <Link to="/help-center" className="topLink">
              Help Center
            </Link>

            <Link to="/track-order" className="topLink">
              Order Tracking
            </Link>

            <div className="topLink flex items-center gap-1">
              <MdOutlineLanguage />

              EN
            </div>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE ================= */}

      <div className="middleHeader">
        <div className="container headerMain">
          {/* ================= LEFT ================= */}

          <div className="headerBrand">
            {/* MOBILE MENU */}

            <button
              className="mobileMenuBtn"
              onClick={() =>
                setOpenCategory(true)
              }
            >
              <FaBars />
            </button>

            {/* LOGO */}

            <Link to="/" className="logoLink">
              <span className="logoText">KEYSHOP</span>
              <span className="logoSubText">Digital licenses</span>
            </Link>
          </div>

          {/* ================= SEARCH ================= */}

          <div className="headerSearch">
            <SearchBox />
          </div>

          {/* ================= RIGHT ================= */}

          <div className="headerRight">
            {/* ================= LOGIN AREA ================= */}

            <div className="headerAuth">
              {context?.isLogin ? (
                <>
                  {/* USER BUTTON */}

                  <button
                    onClick={handleClick}
                    className="userMenuBtn"
                  >
                    <FiUser />

                    <span className="userMenuName">
                      Hello,{" "}
                      {context?.user?.name ||
                        "User"}
                    </span>
                  </button>

                  {/* USER MENU */}

                  <Menu
                    className="headerMenu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{
                      horizontal: "right",
                      vertical: "top",
                    }}
                    anchorOrigin={{
                      horizontal: "right",
                      vertical: "bottom",
                    }}
                  >
                    {/* ACCOUNT */}

                    <MenuItem
                      component={Link}
                      to="/myAccount"
                      onClick={handleClose}
                      className="flex gap-2"
                    >
                      <FaRegUser />

                      My Account
                    </MenuItem>

                    {/* ORDERS */}

                    <MenuItem
                      component={Link}
                      to="/orders"
                      onClick={handleClose}
                      className="flex gap-2"
                    >
                      <IoBagCheckOutline />

                      Orders
                    </MenuItem>

                    {/* WISHLIST */}

                    <MenuItem
                      component={Link}
                      to="/my-list"
                      onClick={handleClose}
                      className="flex gap-2"
                    >
                      <IoMdHeartEmpty />

                      My Wishlist
                    </MenuItem>

                    {/* LOGOUT */}

                    <MenuItem
                      onClick={() => {
                        handleClose();

                        context.logout();
                      }}
                      className="logoutMenuItem flex gap-2"
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {/* LOGIN */}

                  <Link
                    to="/login"
                    className="loginBtnHeader"
                  >
                    <FiLogIn />

                    Login
                  </Link>

                  {/* REGISTER */}

                  <Link
                    to="/register"
                    className="registerBtnHeader"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* ================= ICONS ================= */}

            <div className="headerActions">
              {/* WISHLIST */}

              <Link to="/my-list" className="headerIcon">
                <FaHeart />

                {context.wishlist?.length > 0 && (
                  <span className="headerBadge bg-red-500">
                    {context.wishlist.length}
                  </span>
                )}
              </Link>

              {/* COMPARE */}

              <Link to="/compare" className="headerIcon">
                <BiGitCompare />
              </Link>

              {/* CART */}

              <div
                className="headerIcon"
                onClick={() =>
                  context.setOpenCartPanel(true)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    context.setOpenCartPanel(true);
                  }
                }}
              >
                <FaShoppingCart />

                {context.cartSummary?.count > 0 && (
                  <span className="headerBadge bg-red-500">
                    {context.cartSummary.count}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE SEARCH ================= */}

        <div className="container mobileSearch">
          <SearchBox />
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}

      <Navigation />

      {/* ================= MOBILE CATEGORY DRAWER ================= */}

      <Drawer
        anchor="left"
        open={openCategory}
        onClose={() =>
          setOpenCategory(false)
        }
        PaperProps={{
          sx: {
            background: "#071739",

            width: "min(320px, 100vw)",
          },
        }}
      >
        <CategoryPanel onNavigate={() => setOpenCategory(false)} />
      </Drawer>
    </header>
  );
};

export default Header;
