import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductItem from "../ProductItem";
import "./index.css";
import products from "../../data/products.json";
const ProductSlider = ({ items = 5 }) => {
  return (
    <div className="productSlider mt-8">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop
        spaceBetween={18}
        slidesPerView={items}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
          },
          576: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: items,
          },
        }}
      >
        {products.map((item) => (
          <SwiperSlide key={item.id}>
            <ProductItem item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};  

export default ProductSlider;