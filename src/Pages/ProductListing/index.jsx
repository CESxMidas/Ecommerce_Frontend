/* Pages/ProductListing/index.jsx */

import { useState } from "react";

import {
  Breadcrumbs,
  Button,
  Link,
  Menu,
  MenuItem,
  Pagination,
} from "@mui/material";

import { IoFilter } from "react-icons/io5";

import {
  BsLayoutTextWindowReverse,
  BsGrid,
  BsGrid3X3GapFill,
} from "react-icons/bs";

import Sidebar from "../../components/Sidebar";
import ProductItem from "../../components/ProductItem";

import products from "../../data/products.json";

import "./index.css";

const ProductListing = () => {
  const [gridCols, setGridCols] = useState(4);

  const [anchorEl, setAnchorEl] =
    useState(null);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <section className="productListing">

      {/* BREADCRUMB */}
      <div className="breadcrumbWrapper">
        <div className="container mx-auto px-6">

          <Breadcrumbs separator="›">

            <Link
              underline="hover"
              color="inherit"
              href="/"
            >
              Home
            </Link>

            <Link
              underline="hover"
              color="inherit"
              href="/"
            >
              Products
            </Link>

          </Breadcrumbs>

        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-6 mt-8">

        <div className="listingLayout">

          {/* SIDEBAR */}
          <div className="sidebarWrapper">
            <Sidebar />
          </div>

          {/* PRODUCT AREA */}
          <div className="productArea">

            {/* TOP BAR */}
            <div className="productTopBar">

              {/* LEFT */}
              <div className="col1">

                <Button
                  onClick={() => setGridCols(1)}
                  className={`gridBtn ${gridCols === 1
                    ? "active"
                    : ""
                    }`}
                >
                  <BsLayoutTextWindowReverse />
                </Button>

                <Button
                  onClick={() => setGridCols(2)}
                  className={`gridBtn ${gridCols === 2
                    ? "active"
                    : ""
                    }`}
                >
                  <BsGrid />
                </Button>

                <Button
                  onClick={() => setGridCols(4)}
                  className={`gridBtn ${gridCols === 4
                    ? "active"
                    : ""
                    }`}
                >
                  <BsGrid3X3GapFill />
                </Button>

                <span className="productCount">
                  Showing{" "}
                  {products.length} products
                </span>

              </div>

              {/* RIGHT */}
              <div className="col2">

                <Button className="filterBtn">
                  <IoFilter />

                  Filter
                </Button>

                <Button
                  onClick={handleOpenMenu}
                  className="sortBtn"
                >
                  <IoFilter />
                  Sort By
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                >

                  <MenuItem
                    onClick={handleCloseMenu}
                  >
                    Latest
                  </MenuItem>

                  <MenuItem
                    onClick={handleCloseMenu}
                  >
                    Price: Low to High
                  </MenuItem>

                  <MenuItem
                    onClick={handleCloseMenu}
                  >
                    Price: High to Low
                  </MenuItem>

                  <MenuItem
                    onClick={handleCloseMenu}
                  >
                    Popular
                  </MenuItem>

                </Menu>

              </div>

            </div>

            {/* TITLE */}
            <h2 className="listingTitle">
              Software Products
            </h2>

            <p className="listingSubtitle">
              Showing all premium software &
              digital products
            </p>

            {/* PRODUCT GRID */}
            <div
              className={`productGrid ${gridCols === 1
                ? "grid1"
                : gridCols === 2
                  ? "grid2"
                  : "grid4"
                }`}
            >

              {products.map((item) => (
                <ProductItem
                  key={item.id}
                  item={item}
                />
              ))}

            </div>

            {/* PAGINATION */}
            <div className="customPagination flex items-center justify-center mt-10">

              <Pagination
                count={10}
                showFirstButton
                showLastButton
              />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ProductListing;