"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import type { BlogPost } from "@/types/api";

const fallbackBlogs = [
  {
    id: "1",
    title: "How To Activate Windows 11 Pro",
    excerpt: "Step-by-step guide for activating Windows securely and legally.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    publishedAt: "2026-05-12",
  },
];

type BlogCarouselProps = {
  blogs: BlogPost[];
};

export default function BlogCarousel({ blogs }: BlogCarouselProps) {
  const items = blogs.length > 0 ? blogs : fallbackBlogs;

  return (
    <section className="mt-14">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-white md:text-[34px]">
          Latest Articles
        </h2>
        <p className="mt-2 text-keyshop-muted">News, guides and software updates</p>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        loop={items.length > 3}
        spaceBetween={22}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1.1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
      >
        {items.map((blog) => (
          <SwiperSlide key={blog.id}>
            <article className="group overflow-hidden rounded-card border border-keyshop-line bg-white/[0.03]">
              <Link href={`/blog/${blog.id}`} className="relative block h-48 overflow-hidden">
                <img
                  src={blog.image || fallbackBlogs[0].image}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </Link>
              <div className="p-5">
                {blog.publishedAt ? (
                  <div className="mb-3 flex items-center gap-2 text-xs text-keyshop-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  </div>
                ) : null}
                <Link href={`/blog/${blog.id}`}>
                  <h3 className="text-lg font-bold text-white hover:text-keyshop-blue">
                    {blog.title}
                  </h3>
                </Link>
                <p className="mt-2 line-clamp-3 text-sm text-keyshop-muted">{blog.excerpt}</p>
                <Link
                  href={`/blog/${blog.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-keyshop-blue hover:text-keyshop-blue-hover"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
