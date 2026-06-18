import { useEffect, useState } from "react";
import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { fetchBanners } from "../../services/cmsService";
import "./index.css";

const fallbackSlides = [
  {
    id: 1,
    title: "Premium Software Collection",
    subtitle:
      "Discover powerful applications, productivity tools and premium utilities for your PC.",
    image: "/images/bypass/cerberus-banner.png",
  },
  {
    id: 2,
    title: "Next Generation Gaming",
    subtitle:
      "Explore trending games, ultra graphics experiences and gaming essentials.",
    image: "/images/bypass/snake-app.png",
  },
  {
    id: 3,
    title: "Creative Digital Workspace",
    subtitle:
      "Everything you need for editing, design, development and creativity.",
    image: "/images/bypass/cerberus-banner.png",
  },
];

const HomeSlider = () => {
  const [slides, setSlides] = useState(fallbackSlides);
  const canLoop = slides.length > 1;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchBanners("home_slider");

        if (!cancelled && data.length > 0) {
          setSlides(
            data.map((banner) => ({
              id: banner._id,
              title: banner.title,
              subtitle: banner.subtitle,
              image: banner.image,
            })),
          );
        }
      } catch {
        // keep fallback slides
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-6">
      <div className="home-slider">
        <Swiper
          modules={[
            Navigation,
            Pagination,
            Autoplay,
          ]}
          navigation
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 4500,

            disableOnInteraction: false,
          }}
          loop={canLoop}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="slide"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className="slide-overlay"></div>

                <div className="slide-content">
                  <span className="slider-badge">
                    FEATURED
                  </span>

                  <h1 className="slider-title">
                    {slide.title}
                  </h1>

                  <p className="slider-description">
                    {slide.subtitle}
                  </p>

                  <div className="slider-buttons">
                    <button className="primary-btn">
                      Explore Now
                    </button>

                    <button className="secondary-btn">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
