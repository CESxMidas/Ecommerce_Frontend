import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./index.css";

const slides = [
  {
    id: 1,
    title: "Premium Software Collection",
    description:
      "Discover powerful applications, productivity tools and premium utilities for your PC.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Next Generation Gaming",
    description:
      "Explore trending games, ultra graphics experiences and gaming essentials.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Creative Digital Workspace",
    description:
      "Everything you need for editing, design, development and creativity.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
  },
];

const HomeSlider = () => {
  return (
    <div className="w-full mt-6">
      <div className="home-slider rounded-[28px] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          loop
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="slide"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* OVERLAY */}
                <div className="slide-overlay"></div>

                {/* CONTENT */}
                <div className="relative z-10 max-w-[620px] text-white">
                  <span className="slider-badge">
                    FEATURED
                  </span>

                  <h1 className="slider-title">
                    {slide.title}
                  </h1>

                  <p className="slider-description">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-8">
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