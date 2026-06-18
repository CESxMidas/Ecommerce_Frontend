"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import type { Banner } from "@/types/api";

const fallbackAds = [
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
];

type AdsCarouselProps = {
  banners: Banner[];
  items?: number;
};

export default function AdsCarousel({ banners, items = 3 }: AdsCarouselProps) {
  const ads =
    banners.filter((banner) => banner.placement === "ads").length > 0
      ? banners
          .filter((banner) => banner.placement === "ads")
          .map((banner) => ({ image: banner.image, link: banner.link || "/products" }))
      : fallbackAds.map((image) => ({ image, link: "/products" }));

  return (
    <section className="mt-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={ads.length > items}
        spaceBetween={18}
        slidesPerView={items}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1200: { slidesPerView: items },
        }}
      >
        {ads.map((ad, index) => (
          <SwiperSlide key={`${ad.image}-${index}`}>
            <Link
              href={ad.link}
              className="group relative block overflow-hidden rounded-[18px]"
            >
              <Image
                src={ad.image}
                alt="Promotion banner"
                width={600}
                height={190}
                className="h-[190px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
