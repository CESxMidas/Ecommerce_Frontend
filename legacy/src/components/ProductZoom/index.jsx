import { useState } from "react";

import InnerImageZoom from "react-inner-image-zoom";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

import "./index.css";

const DEFAULT_IMAGES = [
  "/images/bypass/cerberus-banner.png",
  "/images/bypass/snake-app.png",
  "/images/bypass/cerberus-banner.png",
  "/images/bypass/snake-app.png",
];

const ProductZoom = ({ images: imagesProp }) => {
  const images =
    imagesProp?.length > 0 ? imagesProp : DEFAULT_IMAGES;

  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="productZoomWrapper">
      <div className="mainZoomImage">
        <InnerImageZoom
          src={activeImage}
          zoomSrc={activeImage}
          zoomType="hover"
          zoomScale={1}
          hideHint
        />
      </div>

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
            <SwiperSlide key={`${img}-${index}`}>
              <div
                className={`thumbItem ${
                  activeImage === img ? "active" : ""
                }`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`thumb-${index}`} loading="lazy" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductZoom;
