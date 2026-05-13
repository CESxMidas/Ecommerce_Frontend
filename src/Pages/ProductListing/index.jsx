import { Breadcrumbs, Link } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ProductItem from "../../components/ProductItem";
import "./index.css";
import products from "../../data/products.json";

const ProductListing = () => {
  return (
    <section className="productListing">
      {/* BREADCRUMB */}
      <div className="breadcrumbWrapper">
        <div className="container mx-auto px-6">
          <Breadcrumbs separator="›">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/">
              Products
            </Link>
          </Breadcrumbs>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-6 mt-8">
        <div className="flex gap-6">
          {/* SIDEBAR */}
          <div className="w-[22%]">
            <Sidebar />
          </div>

          {/* PRODUCT AREA */}
          <div className="w-[78%] productArea">
            <h2 className="text-[26px] font-bold text-white">
              Software Products
            </h2>
            <p className="text-white/60 mt-2 mb-6">
              Showing all premium software & digital products
            </p>
            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((item) => (
                <ProductItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
