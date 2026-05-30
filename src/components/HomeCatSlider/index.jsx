import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

import { fetchCategories } from "../../services/categoryService";

import "./index.css";

const HomeCatSlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="mt-8 text-white/60 text-center">
        Loading categories...
      </p>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="homeCatSlider w-full mt-8">
      <div className="container mx-auto">
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

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          loop={categories.length > 5}
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
                <img
                  src={item.image}
                  alt={item.name}
                  className="category-image"
                />

                <div className="category-overlay"></div>

                <div className="category-content">
                  <h3>{item.name}</h3>

                  <Link to={`/productListing?category=${item.slug}`}>
                    Explore
                    {item.productCount > 0 && (
                      <small>{item.productCount} items</small>
                    )}
                  </Link>
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
