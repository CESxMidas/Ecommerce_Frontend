"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { Banner } from "@/types/api";

const fallbackSlides = [
  {
    id: "1",
    title: "Premium Software Collection",
    subtitle:
      "Discover powerful applications, productivity tools and premium utilities for your PC.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Next Generation Gaming",
    subtitle:
      "Explore trending games, ultra graphics experiences and gaming essentials.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
  },
];

type HomeHeroSliderProps = {
  banners: Banner[];
};

export default function HomeHeroSlider({ banners }: HomeHeroSliderProps) {
  const slides =
    banners.filter((banner) => banner.placement === "home_slider").length > 0
      ? banners
          .filter((banner) => banner.placement === "home_slider")
          .map((banner) => ({
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle || "",
            image: banner.image,
          }))
      : fallbackSlides;

  return (
    <div className="mt-6 overflow-hidden rounded-[28px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop={slides.length > 1}
        className="h-[320px] md:h-[540px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative flex h-[320px] items-center bg-cover bg-center px-6 md:h-[540px] md:px-20"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-hero-overlay" />
              <div className="relative z-10 max-w-xl text-white">
                <span className="inline-flex rounded-full bg-keyshop-blue px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Featured
                </span>
                <h1 className="mt-6 text-3xl font-extrabold leading-tight md:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-lg text-sm text-white/75 md:text-base">
                  {slide.subtitle}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="rounded-control bg-keyshop-blue px-5 py-3 text-sm font-semibold hover:bg-keyshop-blue-hover"
                  >
                    Explore Now
                  </Link>
                  <Link
                    href="/deals"
                    className="rounded-control border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
