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

import { FiUser } from "react-icons/fi";

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

      <div className="top-strip py-2">
        <div
          className="
            container
            flex
            items-center
            justify-between
            text-[12px]
            text-[var(--text-muted)]
          "
        >
          {/* LEFT */}

          <div>
            🔥 Get up to 50% off new season styles
          </div>

          {/* RIGHT */}

          <div className="hidden md:flex items-center gap-5">
            <span className="topLink">
              Help Center
            </span>

            <span className="topLink">
              Order Tracking
            </span>

            <div className="topLink flex items-center gap-1">
              <MdOutlineLanguage />

              EN
            </div>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE ================= */}

      <div className="middleHeader py-4">
        <div
          className="
            container
            flex
            items-center
            justify-between
            gap-4
          "
        >
          {/* ================= LEFT ================= */}

          <div className="flex items-center gap-3">
            {/* MOBILE MENU */}

            <button
              className="mobileMenuBtn lg:hidden"
              onClick={() =>
                setOpenCategory(true)
              }
            >
              <FaBars />
            </button>

            {/* LOGO */}

            <Link to="/">
              <h1 className="logoText">
                KEYSHOP
              </h1>
            </Link>
          </div>

          {/* ================= SEARCH ================= */}

          <div className="hidden md:block w-[50%]">
            <SearchBox />
          </div>

          {/* ================= RIGHT ================= */}

          <div
            className="
              flex
              justify-end
              items-center
              gap-5
              md:gap-8
              text-[var(--text-muted)]
            "
          >
            {/* ================= LOGIN AREA ================= */}

            <div
              className="
                hidden
                lg:flex
                items-center
                gap-4
                text-sm
              "
            >
              {context?.isLogin ? (
                <>
                  {/* USER BUTTON */}

                  <button
                    onClick={handleClick}
                    className="
                      flex
                      items-center
                      gap-2
                      text-white
                      hover:text-[var(--primary)]
                      transition-all
                    "
                  >
                    <FiUser />

                    <span className="text-sm font-[500]">
                      Hello,{" "}
                      {context?.user?.name ||
                        "User"}
                    </span>
                  </button>

                  {/* USER MENU */}

                  <Menu
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
                      className="
                        flex
                        gap-2
                        text-red-500
                      "
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
                    <FiUser />

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

            <div
              className="
                flex
                items-center
                gap-5
                md:gap-7
                text-lg
              "
            >
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

              <div className="headerIcon">
                <BiGitCompare />
              </div>

              {/* CART */}

              <div
                className="headerIcon"
                onClick={() =>
                  context.setOpenCartPanel(true)
                }
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

        <div className="container mt-4 md:hidden">
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