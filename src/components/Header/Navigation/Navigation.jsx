import React from "react";
import { FaHome, FaTag, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { MdGames, MdSecurity } from "react-icons/md";
import { FaWindows } from "react-icons/fa";
import CategoryPanel from "./CategoryPanel";
import "./navigation.css";
const Navigation = () => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (value) => () => {
    setOpen(value);
  };

  return (
    <div>
      {/* NAVBAR */}
      <div className="py-3 border-b border-white/10 bg-[#071739]">
        <div className="container flex items-center justify-between gap-6">
          {/* LEFT CATEGORY */}
          <div className="w-[18%]">
            <button
              onClick={toggleDrawer(true)}
              className="w-full h-[48px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
            >
              ☰ All Categories
            </button>
          </div>

          {/* MENU */}
          <ul className="w-[55%] flex items-center gap-6 text-[15px] font-medium text-white/70">
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

              {/* LEVEL 1 */}
              <div className="submenu">
                {/* ACTION GAMES */}
                <div className="relative group/sub">
                  <button className="submenu-item">
                    Action Games
                    <FaChevronRight className="text-[11px]" />
                  </button>

                  {/* LEVEL 2 */}
                  <div className="submenu-child">
                    <a href="/" className="submenu-item">
                      Steam Games
                    </a>

                    <a href="/" className="submenu-item">
                      PUBG
                    </a>

                    <a href="/" className="submenu-item">
                      CS2
                    </a>

                    <a href="/" className="submenu-item">
                      GTA V
                    </a>

                    <a href="/" className="submenu-item">
                      Dota 2
                    </a>
                  </div>
                </div>

                <a href="/" className="submenu-item">
                  RPG Games
                </a>

                <a href="/" className="submenu-item">
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
                <a href="/" className="submenu-item">
                  Windows 11
                </a>

                <a href="/" className="submenu-item">
                  Office 365
                </a>

                <a href="/" className="submenu-item">
                  Adobe Suite
                </a>

                <a href="/" className="submenu-item">
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
          <div className="w-[27%] text-right text-sm font-medium text-blue-400">
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
