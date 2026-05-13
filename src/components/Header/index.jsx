import "./index.css";

// ICONS
import { MdOutlineLanguage } from "react-icons/md";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { BiGitCompare } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import SearchBox from "../Search";
import Navigation from "./Navigation/Navigation";

const Header = () => {
  return (
    <header className="w-full">
      {/* ================= TOP STRIP ================= */}
      <div className="py-2 bg-[var(--bg-soft)] border-b border-[var(--border)]">
        <div className="container flex items-center justify-between text-[12px] text-[var(--text-muted)]">
          <div>🔥 Get up to 50% off new season styles</div>

          <div className="flex items-center gap-5">
            <span className="cursor-pointer hover:text-white">Help Center</span>
            <span className="cursor-pointer hover:text-white">
              Order Tracking
            </span>

            <div className="flex items-center gap-1 cursor-pointer hover:text-white">
              <MdOutlineLanguage />
              EN
            </div>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE ================= */}
      <div className="py-4 border-b border-[var(--border)]">
        <div className="container flex items-center">
          {/* LOGO */}
          <div className="w-[20%]">
            <h1 className="text-2xl font-bold text-white">KEYSHOP</h1>
          </div>

          {/* SEARCH */}
          <div className="w-[50%]">
            <SearchBox />
          </div>

          {/* AUTH + ICONS */}
          <div className="w-[30%] flex justify-end items-center gap-10 text-[var(--text-muted)]">
            {/* LOGIN */}
            <div className="flex items-center gap-6 text-sm">
              <span className="cursor-pointer hover:text-white flex items-center gap-1">
                <FiUser />
                Login
              </span>
              <span className="cursor-pointer hover:text-white">Register</span>
            </div>

            {/* ICONS */}
            <div className="flex items-center gap-10 text-lg">
              <div className="relative cursor-pointer">
                <FaHeart className="hover:text-red-400 transition" />
                <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              </div>

              <div className="relative cursor-pointer">
                <BiGitCompare className="hover:text-white transition" />
                <span className="absolute -top-2 -right-2 text-[10px] bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </div>

              <div className="relative cursor-pointer">
                <FaShoppingCart className="hover:text-white transition" />
                <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </header>
  );
};

export default Header;
