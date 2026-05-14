import { useState } from "react";

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
    <header className="w-full">
      {/* ================= TOP STRIP ================= */}
      <div className="py-2 bg-[var(--bg-soft)] border-b border-[var(--border)]">
        <div className="container flex items-center justify-between text-[12px] text-[var(--text-muted)]">
          {/* LEFT */}
          <div>
            🔥 Get up to 50% off new season styles
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-5">
            <span className="cursor-pointer hover:text-white transition">
              Help Center
            </span>

            <span className="cursor-pointer hover:text-white transition">
              Order Tracking
            </span>

            <div className="flex items-center gap-1 cursor-pointer hover:text-white transition">
              <MdOutlineLanguage />
              EN
            </div>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE ================= */}
      <div className="py-4 border-b border-[var(--border)]">
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
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              KEYSHOP
            </h1>
          </div>

          {/* SEARCH */}
          <div className="hidden md:block w-[50%]">
            <SearchBox />
          </div>

          {/* RIGHT */}
          <div className="flex justify-end items-center gap-5 md:gap-10 text-[var(--text-muted)]">
            {/* LOGIN */}
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <span className="cursor-pointer hover:text-white flex items-center gap-1 transition">
                <FiUser />
                Login
              </span>

              <span className="cursor-pointer hover:text-white transition">
                Register
              </span>
            </div>

            {/* ICONS */}
            <div className="flex items-center gap-5 md:gap-8 text-lg">
              {/* WISHLIST */}
              <div className="relative cursor-pointer">
                <FaHeart className="hover:text-red-400 transition" />

                <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              </div>

              {/* COMPARE */}
              <div className="relative cursor-pointer">
                <BiGitCompare className="hover:text-white transition" />

                <span className="absolute -top-2 -right-2 text-[10px] bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </div>

              {/* CART */}
              <div className="relative cursor-pointer">
                <FaShoppingCart className="hover:text-white transition" />

                <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
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