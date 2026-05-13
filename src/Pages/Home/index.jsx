import { useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { FaTruck } from "react-icons/fa";

import HomeSlider from "../../components/HomeSlider";
import HomeCatSlider from "../../components/HomeCatSlider";
import AdsBannerSlider from "../../components/AdsBannerSlider";


import "./index.css";
import ProductSlider from "../../components/ProductSlider";

const Home = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="home-page">
      {/* HERO */}
      <HomeSlider />

      {/* CATEGORY */}
      <HomeCatSlider />

      {/* POPULAR PRODUCTS */}
<section className="mt-12">
  <div className="container mx-auto px-6 ">
    <div className="popularProducts">
      {/* TOP BAR */}
      <div className="popularHeader">
        {/* LEFT */}
        <div className="leftSec">
          <h2>
            Popular Products
          </h2>

          <p>
            Do not miss the current offers until the end of March
          </p>
        </div>

        {/* RIGHT */}
        <div className="rightSection">
          <Tabs
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
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

      </div>

    </div>
    <ProductSlider />
  </div>
</section>

      {/* FREE SHIPPING */}
      <section className="mt-10">
        <div className="container mx-auto">
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
              Free Delivery Now On Your First Order and over $200
            </div>

            {/* RIGHT */}
            <div className="shipping-price">
              - Only $200*
            </div>
          </div>

          {/* ADS SLIDER */}
          <AdsBannerSlider />
        </div>
      </section>
    </div>
  );
};

export default Home;