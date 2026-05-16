import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "./index.css";

const categories = [
  {
    id: 1,
    name: "Games",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Software",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Security",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Mobile Apps",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Cloud",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  },
];

const HomeCatSlider = () => {
  return (
    <div className="homeCatSlider w-full mt-8">
      <div className="container mx-auto">
        {/* HEADER */}
        <div className="homeCatHeader">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Browse Categories
            </h2>

            <p className="text-white/50 mt-1">
              Explore trending categories and collections
            </p>
          </div>
        </div>

        {/* SWIPER */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={20}
          slidesPerView={5}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
            },
            480: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1280: {
              slidesPerView: 5,
            },
          }}
        >
          {categories.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="category-card">
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="category-image"
                />

                {/* OVERLAY */}
                <div className="category-overlay"></div>

                {/* CONTENT */}
                <div className="category-content">
                  <h3>{item.name}</h3>

                  <button>
                    Explore
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;