"use client";

import { useId, type ReactNode } from "react";
import { Swiper, type SwiperProps } from "swiper/react";
import { Navigation } from "swiper/modules";

import { cn } from "@/lib/utils";

import "swiper/css";

type KeyshopSwiperProps = Omit<SwiperProps, "navigation"> & {
  children: ReactNode;
  className?: string;
  navClassName?: string;
  showNavigation?: boolean;
};

function KeyshopChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5 stroke-keyshop-blue stroke-[2.5]"
    >
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KeyshopSwiper({
  children,
  className,
  navClassName,
  showNavigation = true,
  modules = [],
  ...swiperProps
}: KeyshopSwiperProps) {
  const uid = useId().replace(/:/g, "");
  const prevId = `keyshop-swiper-prev-${uid}`;
  const nextId = `keyshop-swiper-next-${uid}`;

  const mergedModules = [
    Navigation,
    ...modules.filter((module) => module !== Navigation),
  ];

  return (
    <div className={cn("keyshop-swiper relative", className)}>
      {showNavigation ? (
        <>
          <button
            type="button"
            id={prevId}
            aria-label="Previous slide"
            className={cn("keyshop-swiper-nav keyshop-swiper-nav-prev", navClassName)}
          >
            <KeyshopChevron direction="left" />
          </button>
          <button
            type="button"
            id={nextId}
            aria-label="Next slide"
            className={cn("keyshop-swiper-nav keyshop-swiper-nav-next", navClassName)}
          >
            <KeyshopChevron direction="right" />
          </button>
        </>
      ) : null}

      <Swiper
        {...swiperProps}
        modules={mergedModules}
        navigation={
          showNavigation
            ? {
                prevEl: `#${prevId}`,
                nextEl: `#${nextId}`,
              }
            : false
        }
      >
        {children}
      </Swiper>
    </div>
  );
}
