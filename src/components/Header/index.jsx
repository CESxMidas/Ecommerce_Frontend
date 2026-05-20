import { useState } from "react";
import { Link } from "react-router-dom";

import "./index.css";

// MUI
import Drawer from "@mui/material/Drawer";

// ICONS
import { MdOutlineLanguage } from "react-icons/md";

import {
  FaShoppingCart,
  FaHeart,
  FaBars,
} from "react-icons/fa";

import { BiGitCompare } from "react-icons/bi";

import { FiUser } from "react-icons/fi";

// COMPONENTS
import SearchBox from "../Search";

import Navigation from "./Navigation/Navigation";

import CategoryPanel from "./Navigation/CategoryPanel";

const Header = () => {
  const [openCategory, setOpenCategory] =
    useState(false);

  return (
    <header className="w-full headerWrapper">
      {/* ================= TOP STRIP ================= */}
      <div className="top-strip py-2">
        <div className="container flex items-center justify-between text-[12px] text-[var(--text-muted)]">
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
        <div className="container flex items-center justify-between gap-4">
          {/* LEFT */}
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

          {/* SEARCH */}
          <div className="hidden md:block w-[50%]">
            <SearchBox />
          </div>

          {/* RIGHT */}
          <div className="flex justify-end items-center gap-5 md:gap-8 text-[var(--text-muted)]">
            {/* LOGIN */}
            <div className="hidden lg:flex items-center gap-4 text-sm">
              <Link
                to="/login"
                className="loginBtnHeader"
              >
                <FiUser />
                Login
              </Link>

              <Link
                to="/register"
                className="registerBtnHeader"
              >
                Register
              </Link>
            </div>

            {/* ICONS */}
            <div className="flex items-center gap-5 md:gap-7 text-lg">
              {/* WISHLIST */}
              <div className="headerIcon">
                <FaHeart />

                <span className="headerBadge bg-red-500">
                  1
                </span>
              </div>

              {/* COMPARE */}
              <div className="headerIcon">
                <BiGitCompare />

                <span className="headerBadge bg-blue-500">
                  3
                </span>
              </div>

              {/* CART */}
              <div className="headerIcon">
                <FaShoppingCart />

                <span className="headerBadge bg-red-500">
                  2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="container mt-4 md:hidden">
          <SearchBox />
        </div>
      </div>

      {/* NAVIGATION */}
      <Navigation />

      {/* MOBILE CATEGORY DRAWER */}
      <Drawer
        anchor="left"
        open={openCategory}
        onClose={() =>
          setOpenCategory(false)
        }
        PaperProps={{
          sx: {
            background: "#071739",
            width: 320,
          },
        }}
      >
        <CategoryPanel />
      </Drawer>
    </header>
  );
};

export default Header;