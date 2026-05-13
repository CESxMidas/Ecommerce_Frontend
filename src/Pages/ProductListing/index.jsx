import {
  Breadcrumbs,
  Link,
} from "@mui/material";

import Sidebar from "../../components/Sidebar";

import "./index.css";

const ProductListing = () => {
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
        <div className="flex gap-6">
          {/* SIDEBAR */}
          <div className="w-[20%]">
            <Sidebar />
          </div>

          {/* PRODUCT AREA */}
          <div className="w-[80%] productArea">
            <h2 className="text-[26px] font-bold text-white">
              Software Products
            </h2>

            <p className="text-white/60 mt-2">
              Showing all premium software &
              digital products
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;