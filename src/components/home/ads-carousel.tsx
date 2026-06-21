"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

import KeyshopSwiper from "@/components/ui/keyshop-swiper";

import { normalizeCommerceLink, resolveMediaUrl } from "@/lib/utils/image";
import type { Banner } from "@/types/api";

const fallbackAds = [
  {
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    link: "/products",
    title: "Hardware promotion",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    link: "/products",
    title: "Software promotion",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    link: "/deals",
    title: "Gaming promotion",
  },
];

type AdsCarouselProps = {
  banners: Banner[];
  items?: number;
};

export default function AdsCarousel({ banners, items = 3 }: AdsCarouselProps) {
  const apiAds = banners
    .filter((banner) => banner.placement === "ads")
    .map((banner) => ({
      image: resolveMediaUrl(
        banner.image,
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
      ),
      link: normalizeCommerceLink(banner.link),
      title: banner.title || "Promotion banner",
    }));

  const ads = apiAds.length > 0 ? apiAds : fallbackAds;

  return (
    <section className="mt-10">
      <KeyshopSwiper
        className="keyshop-ads-carousel"
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={ads.length > items}
        spaceBetween={18}
        slidesPerView={items}
        breakpoints={{
          0: { slidesPerView: 1.15 },
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1200: { slidesPerView: items },
        }}
      >
        {ads.map((ad, index) => (
          <SwiperSlide key={`${ad.image}-${index}`}>
            <Link
              href={ad.link}
              className="group relative block aspect-[16/7] overflow-hidden rounded-[18px] border border-keyshop-line"
            >
              <Image
                src={ad.image}
                alt={ad.title}
                fill
                sizes="(max-width: 768px) 90vw, 33vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </Link>
          </SwiperSlide>
        ))}
      </KeyshopSwiper>
    </section>
  );
}
