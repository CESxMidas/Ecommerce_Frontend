"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

import KeyshopSwiper from "@/components/ui/keyshop-swiper";

import { flattenLeafCategories } from "@/lib/utils/category-utils";
import type { Category } from "@/types/api";

const fallbackImages: Record<string, string> = {
  accounts:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
};

type HomeCategorySliderProps = {
  categories: Category[];
};

export default function HomeCategorySlider({ categories }: HomeCategorySliderProps) {
  const displayCategories = flattenLeafCategories(categories);
  if (displayCategories.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Browse Categories</h2>
        <p className="mt-1 text-keyshop-muted">
          Explore trending categories and collections
        </p>
      </div>

      <KeyshopSwiper
        className="keyshop-category-carousel"
        modules={[Autoplay]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={displayCategories.length > 5}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {displayCategories.map((category) => {
          const count = (category as Category & { productCount?: number }).productCount;
          const image =
            category.image ||
            fallbackImages[category.slug] ||
            fallbackImages.accounts;

          return (
            <SwiperSlide key={category.id}>
              <div className="group relative h-56 overflow-hidden rounded-card transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
                <Image
                  src={image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  sizes="20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-lg font-bold">{category.name}</h3>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="mt-2 inline-flex items-center gap-2 text-sm text-keyshop-blue hover:text-keyshop-blue-hover"
                  >
                    Explore
                    {count ? <small className="text-keyshop-muted">{count} items</small> : null}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </KeyshopSwiper>
    </div>
  );
}
