import React from "react";
import Drawer from "@mui/material/Drawer";
import {
  FaHome,
  FaTag,
  FaChevronDown,
  FaChevronRight,
  FaWindows
} from "react-icons/fa";
import { MdGames, MdSecurity } from "react-icons/md";
import CategoryPanel from "./CategoryPanel";
import "./Navigation.css";
const Navigation = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      {/* NAVBAR */}
      <div className="navigationWrapper">
        <div className="container navigationInner">
          {/* LEFT */}
          <div className="navLeft">
            {/* CATEGORY */}
            <button
              onClick={() => setOpen(true)}
              className="categoryBtn"
            >
              ☰ All Categories
            </button>
          </div>

          {/* MENU */}
          <ul
            className="navMenu"
          >
            {/* HOME */}
            <li className="nav-item">
              <a href="/" className="nav-link">
                <FaHome />
                Home
              </a>
            </li>

            {/* GAMES */}
            <li className="nav-item relative group">
              <button className="nav-link">
                <MdGames />
                Games

                <FaChevronDown className="text-[11px]" />
              </button>

              <div className="submenu">
                <div className="relative group/sub">
                  <button className="submenu-item">
                    Action Games

                    <FaChevronRight className="text-[11px]" />
                  </button>

                  <div className="submenu-child">
                    <a
                      href="/"
                      className="submenu-item"
                    >
                      Steam Games
                    </a>

                    <a
                      href="/"
                      className="submenu-item"
                    >
                      PUBG
                    </a>

                    <a
                      href="/"
                      className="submenu-item"
                    >
                      CS2
                    </a>

                    <a
                      href="/"
                      className="submenu-item"
                    >
                      GTA V
                    </a>

                    <a
                      href="/"
                      className="submenu-item"
                    >
                      Dota 2
                    </a>
                  </div>
                </div>

                <a
                  href="/"
                  className="submenu-item"
                >
                  RPG Games
                </a>

                <a
                  href="/"
                  className="submenu-item"
                >
                  Strategy Games
                </a>
              </div>
            </li>

            {/* SOFTWARE */}
            <li className="nav-item relative group">
              <button className="nav-link">
                <MdSecurity />
                Software

                <FaChevronDown className="text-[11px]" />
              </button>

              <div className="submenu w-[260px]">
                <a
                  href="/"
                  className="submenu-item"
                >
                  Windows 11
                </a>

                <a
                  href="/"
                  className="submenu-item"
                >
                  Office 365
                </a>

                <a
                  href="/"
                  className="submenu-item"
                >
                  Adobe Suite
                </a>

                <a
                  href="/"
                  className="submenu-item"
                >
                  Antivirus
                </a>
              </div>
            </li>

            {/* WINDOWS */}
            <li className="nav-item">
              <a href="/" className="nav-link">
                <FaWindows />
                Windows
              </a>
            </li>

            {/* DEALS */}
            <li className="nav-item">
              <a href="/" className="nav-link">
                <FaTag />
                Deals
              </a>
            </li>
          </ul>

          {/* RIGHT */}
          <div className="navRight">
            🔥 Free International Delivery
          </div>
        </div>
      </div>

      {/* CATEGORY DRAWER */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            background: "#071739",
            width: 320,
          },
        }}
      >
        <CategoryPanel />
      </Drawer>
    </div>
  );
};

export default Navigation;