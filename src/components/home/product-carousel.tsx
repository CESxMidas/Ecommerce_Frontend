"use client";

import { Autoplay } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

import KeyshopSwiper from "@/components/ui/keyshop-swiper";
import ProductItem from "@/components/product/product-item";
import { useCanQuickView } from "@/lib/hooks/use-media-query";
import type { Product } from "@/types/api";

type ProductCarouselProps = {
  products: Product[];
  limit?: number;
};

export default function ProductCarousel({ products, limit = 10 }: ProductCarouselProps) {
  const canQuickView = useCanQuickView();
  const items = products.slice(0, limit);

  if (items.length === 0) {
    return <p className="mt-8 text-center text-keyshop-muted">No products available.</p>;
  }

  return (
    <KeyshopSwiper
      className="keyshop-product-carousel mt-8"
      modules={[Autoplay]}
      showNavigation
      autoplay={
        canQuickView ? { delay: 3500, disableOnInteraction: false } : false
      }
      loop={canQuickView && items.length > 5}
      spaceBetween={16}
      watchOverflow
      breakpoints={{
        0: { slidesPerView: 1, spaceBetween: 16 },
        480: { slidesPerView: 1.15, spaceBetween: 16 },
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 2.4, spaceBetween: 20 },
        992: { slidesPerView: 3, spaceBetween: 20 },
        1200: { slidesPerView: 5, spaceBetween: 20 },
      }}
    >
      {items.map((item) => (
        <SwiperSlide key={item.id} className="!h-auto">
          <ProductItem item={item} />
        </SwiperSlide>
      ))}
    </KeyshopSwiper>
  );
}
