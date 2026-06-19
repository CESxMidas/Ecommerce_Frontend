"use client";

import Image from "next/image";
import { useState } from "react";
import { SwiperSlide } from "swiper/react";

import KeyshopSwiper from "@/components/ui/keyshop-swiper";

import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const galleryImages =
    images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-card border border-keyshop-line bg-white/5">
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 1280px) 100vw, 42vw"
          priority
        />
      </div>

      <KeyshopSwiper
        navClassName="keyshop-swiper-nav-gallery"
        spaceBetween={14}
        slidesPerView={4}
        breakpoints={{
          0: { slidesPerView: 2.5 },
          576: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
        }}
      >
        {galleryImages.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <button
              type="button"
              onClick={() => setActiveImage(image)}
              className={cn(
                "relative aspect-square w-full overflow-hidden rounded-control border",
                activeImage === image
                  ? "border-keyshop-blue ring-2 ring-keyshop-blue/40"
                  : "border-keyshop-line",
              )}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          </SwiperSlide>
        ))}
      </KeyshopSwiper>
    </div>
  );
}
