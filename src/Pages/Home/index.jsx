import { useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { FaTruck } from "react-icons/fa";

import HomeSlider from "../../components/HomeSlider";
import HomeCatSlider from "../../components/HomeCatSlider";
import AdsBannerSlider from "../../components/AdsBannerSlider";
import ProductSlider from "../../components/ProductSlider";
import BlogSlider from "../../components/BlogSlider";

import "./index.css";

/* =========================================
   PRODUCT SECTION
========================================= */

const ProductSection = ({
  title,
  subtitle,
  showTabs = false,
  ads = 0,
  productItems = 5,
}) => {
  const [value, setValue] = useState(0);

  return (
    <section className="mt-16 lg:mt-20">
      <div className="container mx-auto px-4 lg:px-6">
        {/* HEADER */}
        <div className="popularProducts">
          <div className="popularHeader">
            {/* LEFT */}
            <div className="leftSec">
              <h2>{title}</h2>

              {subtitle && <p>{subtitle}</p>}
            </div>

            {/* RIGHT */}
            {showTabs && (
              <div className="rightSection">
                <Tabs
                  value={value}
                  onChange={(e, newValue) =>
                    setValue(newValue)
                  }
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  className="customTabs"
                >
                  <Tab label="Games" />
                  <Tab label="Software" />
                  <Tab label="Antivirus" />
                  <Tab label="Windows" />
                  <Tab label="Office" />
                  <Tab label="Development" />
                  <Tab label="Cloud" />
                  <Tab label="Mobile Apps" />
                  <Tab label="Design" />
                  <Tab label="AI Tools" />
                </Tabs>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCTS */}
        <ProductSlider items={productItems} />

        {/* ADS */}
        {ads > 0 && (
          <AdsBannerSlider items={ads} />
        )}
      </div>
    </section>
  );
};

/* =========================================
   SHIPPING BANNER
========================================= */

const ShippingBanner = () => {
  return (
    <section className="mt-16 lg:mt-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="freeShipping">
          {/* LEFT */}
          <div className="shipping-left">
            <div className="shipping-icon">
              <FaTruck />
            </div>

            <div>
              <h3>FREE SHIPPING</h3>
            </div>
          </div>

          {/* CENTER */}
          <div className="shipping-center">
            Free Delivery Now On Your First Order
            and over $200
          </div>

          {/* RIGHT */}
          <div className="shipping-price">
            - Only $200*
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================
   HOME PAGE
========================================= */

const Home = () => {
  return (
    <div className="home-page">
      <div className="container mx-auto px-4 lg:px-6">
        {/* HERO */}
        <HomeSlider />

        {/* CATEGORY */}
        <HomeCatSlider />
      </div>

      {/* POPULAR */}
      <ProductSection
        title="Popular Products"
        subtitle="Do not miss the current offers until the end of March"
        showTabs={true}
        ads={3}
        productItems={5}
      />

      {/* SHIPPING */}
      <ShippingBanner />

      {/* LATEST */}
      <ProductSection
        title="Latest Products"
        subtitle="Newest software and digital products"
        ads={2}
        productItems={6}
      />

      {/* FEATURED */}
      <ProductSection
        title="Featured Products"
        subtitle="Top featured premium collections"
        productItems={5}
      />

      {/* BLOG */}
      <section className="mt-16 lg:mt-20 pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <BlogSlider />
        </div>
      </section>
    </div>
  );
};

export default Home;