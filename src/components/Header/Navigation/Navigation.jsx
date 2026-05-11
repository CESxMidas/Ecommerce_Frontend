import CategoryPanel from "./CategoryPanel";

import { MdGames, MdSecurity } from "react-icons/md";

import { FaHome, FaTag } from "react-icons/fa";

import "./Navigation.css";
import React from "react";
const Navigation = () => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (value) => () => {
    setOpen(value);
  };

  return (
    <div>
      {/* NAV */}
      <div className="py-3 border-b border-[var(--border)]">
        <div className="container flex items-center">
          {/* CATEGORY */}
          <div className="w-[20%]">
            <button onClick={toggleDrawer(true)} className="btn w-full">
              ☰ All Categories
            </button>
          </div>

          {/* MENU */}
          <ul className="w-[50%] flex gap-8 pl-6 text-sm text-[var(--text-muted)] nav-menu">
            <li>
              <FaHome /> Home
            </li>
            <li>
              <MdGames /> Games
            </li>
            <li>
              <MdSecurity /> Software
            </li>
            <li>Windows</li>
            <li>
              <FaTag /> Deals
            </li>
          </ul>

          {/* INFO */}
          <div className="w-[30%] text-right text-sm text-[var(--accent)]">
            🔥 Free International Delivery
          </div>
        </div>
      </div>

      {/* DRAWER */}
      <CategoryPanel open={open} toggleDrawer={toggleDrawer} />
    </div>
  );
};

export default Navigation;
