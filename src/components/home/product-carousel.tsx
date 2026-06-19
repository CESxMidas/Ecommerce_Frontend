"use client";

import { Autoplay } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

import KeyshopSwiper from "@/components/ui/keyshop-swiper";
import ProductItem from "@/components/product/product-item";
import type { Product } from "@/types/api";

type ProductCarouselProps = {
  products: Product[];
  limit?: number;
};

export default function ProductCarousel({ products, limit = 10 }: ProductCarouselProps) {
  const items = products.slice(0, limit);

  if (items.length === 0) {
    return <p className="mt-8 text-center text-keyshop-muted">No products available.</p>;
  }

  return (
    <KeyshopSwiper
      className="mt-8"
      modules={[Autoplay]}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      loop={items.length > 5}
      spaceBetween={20}
      breakpoints={{
        0: { slidesPerView: 1.15 },
        480: { slidesPerView: 1.5 },
        576: { slidesPerView: 2 },
        768: { slidesPerView: 2.4 },
        992: { slidesPerView: 3 },
        1200: { slidesPerView: 5 },
      }}
    >
      {items.map((item, index) => (
        <SwiperSlide key={item.id}>
          <ProductItem item={item} index={index} />
        </SwiperSlide>
      ))}
    </KeyshopSwiper>
  );
}
