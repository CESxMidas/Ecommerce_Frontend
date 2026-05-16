import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
import "./index.css";
import ProductZoom from "../ProductZoom";
const ProductDetail = () => {
  return (
    <div>
      <section className="py-5 pb-0">
        <div className="container">
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
        </div>
        <div className="container flex gap-4">
          <div className="productZoomContainer">
            <ProductZoom image="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2200&auto=format&fit=crop" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
