import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ProductItem from "../ProductItem";

import "./index.css";

const products = [
  {
    id: 1,
    brand: "Microsoft",
    title: "Windows 11 Pro License Key",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    oldPrice: 59,
    price: 29,
    tag: "HOT",
    discount: "-50%",
  },
  {
    id: 2,
    brand: "Microsoft",
    title: "Office 365 Lifetime Account",
    image:
      "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=1200&auto=format&fit=crop",
    oldPrice: 99,
    price: 49,
    tag: "BEST",
  },
  {
    id: 3,
    brand: "Kaspersky",
    title: "Kaspersky Premium Security",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    oldPrice: 39,
    price: 19,
    tag: "NEW",
  },
  {
    id: 4,
    brand: "Steam",
    title: "Steam Wallet Global Code",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
    oldPrice: 15,
    price: 10,
    tag: "HOT",
  },
  {
    id: 5,
    brand: "Adobe",
    title: "Adobe Creative Cloud Suite",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    oldPrice: 129,
    price: 89,
    tag: "PRO",
  },
  {
    id: 6,
    brand: "NVIDIA",
    title: "GeForce NOW Ultimate Access",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    oldPrice: 25,
    price: 14,
    tag: "TOP",
  },
];

const ProductSlider = () => {
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
        slidesPerView={5}
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
            slidesPerView: 5,
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