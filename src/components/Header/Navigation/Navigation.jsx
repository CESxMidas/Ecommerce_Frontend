import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { FaHome, FaTag, FaChevronDown } from "react-icons/fa";

import CategoryPanel from "./CategoryPanel";
import { fetchCategories } from "../../../services/categoryService";
import {
  getCategoryIcon,
  getCategoryListingUrl,
} from "../../../utils/categoryUtils";

import "./Navigation.css";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchCategories();

        if (!cancelled) {
          setCategories(data);
        }
      } catch {
        if (!cancelled) {
          setCategories([]);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const closeDrawer = () => setOpen(false);

  return (
    <div>
      <div className="navigationWrapper">
        <div className="container navigationInner">
          <div className="navLeft">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="categoryBtn"
            >
              ☰ All Categories
            </button>
          </div>

          <ul className="navMenu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <FaHome />
                Home
              </Link>
            </li>

            {categories.map((category) => (
              <li
                key={category.id}
                className={`nav-item${category.children?.length ? " relative group" : ""}`}
              >
                {category.children?.length > 0 ? (
                  <>
                    <button type="button" className="nav-link">
                      {getCategoryIcon(category.icon, "nav-link-icon")}
                      {category.name}
                      <FaChevronDown className="text-[11px]" />
                    </button>

                    <div className="submenu">
                      <Link
                        to={getCategoryListingUrl(category)}
                        className="submenu-item submenu-item--all"
                        onClick={closeDrawer}
                      >
                        All {category.name}
                        {category.productCount > 0 && (
                          <span className="navCount">
                            {category.productCount}
                          </span>
                        )}
                      </Link>

                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          to={getCategoryListingUrl(child)}
                          className="submenu-item"
                          onClick={closeDrawer}
                        >
                          {child.name}
                          {child.productCount > 0 && (
                            <span className="navCount">
                              {child.productCount}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={getCategoryListingUrl(category)}
                    className="nav-link"
                  >
                    {getCategoryIcon(category.icon, "nav-link-icon")}
                    {category.name}
                  </Link>
                )}
              </li>
            ))}

            <li className="nav-item">
              <Link to="/productListing?sort=popular" className="nav-link">
                <FaTag />
                Deals
              </Link>
            </li>
          </ul>

          <div className="navRight">
            🔥 Free International Delivery
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Navigation;
