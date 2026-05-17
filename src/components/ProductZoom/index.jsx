import { useState } from "react";

import InnerImageZoom from "react-inner-image-zoom";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

import "./index.css";

const ProductZoom = () => {
  const images = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop",

    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop",

    "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?q=80&w=2000&auto=format&fit=crop",

    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2000&auto=format&fit=crop",
  ];

  const [activeImage, setActiveImage] = useState(
    images[0]
  );

  return (
    <div className="productZoomWrapper">

      {/* MAIN IMAGE */}
      <div className="mainZoomImage">
        <InnerImageZoom
          src={activeImage}
          zoomSrc={activeImage}
          zoomType="hover"
          zoomScale={1}
          hideHint
        />
      </div>

      {/* THUMBNAILS */}
      <div className="thumbSlider">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={14}
          slidesPerView={4}
          breakpoints={{
            0: {
              slidesPerView: 2.5,
            },

            576: {
              slidesPerView: 3,
            },

            768: {
              slidesPerView: 4,
            },
          }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className={`thumbItem ${activeImage === img
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setActiveImage(img)
                }
              >
                <img
                  src={img}
                  alt={`thumb-${index}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
};

export default ProductZoom;