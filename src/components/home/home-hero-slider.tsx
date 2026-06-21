"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

import KeyshopSwiper from "@/components/ui/keyshop-swiper";

import { normalizeCommerceLink, resolveMediaUrl } from "@/lib/utils/image";
import type { Banner } from "@/types/api";

const fallbackSlides = [
  {
    id: "fallback-1",
    title: "Bộ sưu tập phần mềm cao cấp",
    subtitle:
      "Khám phá ứng dụng mạnh mẽ, công cụ năng suất và tiện ích cao cấp cho máy tính của bạn.",
    image: resolveMediaUrl(
      null,
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop",
    ),
    link: "/products",
  },
  {
    id: "fallback-2",
    title: "Trải nghiệm game thế hệ mới",
    subtitle:
      "Khám phá game thịnh hành, đồ họa đỉnh cao và phụ kiện gaming thiết yếu.",
    image: resolveMediaUrl(
      null,
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop",
    ),
    link: "/deals",
  },
];

type HomeHeroSliderProps = {
  banners: Banner[];
};

export default function HomeHeroSlider({ banners }: HomeHeroSliderProps) {
  const apiSlides = banners
    .filter((banner) => banner.placement === "home_slider")
    .map((banner) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle || "",
      image: resolveMediaUrl(
        banner.image,
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop",
      ),
      link: normalizeCommerceLink(banner.link),
    }));

  const slides = apiSlides.length > 0 ? apiSlides : fallbackSlides;

  return (
    <div className="mt-6 overflow-hidden rounded-[28px] border border-keyshop-line">
      <KeyshopSwiper
        className="home-hero-swiper"
        navClassName="keyshop-swiper-nav-hero"
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop={slides.length > 1}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[280px] w-full sm:h-[360px] md:h-[480px] lg:h-[540px]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-hero-overlay" />
              <div className="absolute inset-0 flex items-center px-5 sm:px-8 md:px-16 lg:px-20">
                <div className="hero-slide-content relative z-10 max-w-xl text-white">
                  <span className="inline-flex rounded-full bg-keyshop-blue px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                    Nổi bật
                  </span>
                  <h1 className="mt-4 text-2xl font-extrabold leading-tight sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                  {slide.subtitle ? (
                    <p className="mt-3 max-w-lg text-sm text-white/80 sm:mt-4 sm:text-base">
                      {slide.subtitle}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
                    <Link
                      href={slide.link}
                      className="keyshop-interactive rounded-control bg-keyshop-blue px-5 py-2.5 text-sm font-semibold hover:bg-keyshop-blue-hover sm:py-3"
                    >
                      Khám phá ngay
                    </Link>
                    <Link
                      href="/deals"
                      className="keyshop-interactive rounded-control border border-white/25 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 sm:py-3"
                    >
                      Tìm hiểu thêm
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </KeyshopSwiper>
    </div>
  );
}
