"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Autoplay } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

import KeyshopSwiper from "@/components/ui/keyshop-swiper";

import { resolveMediaUrl } from "@/lib/utils/image";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop";

const fallbackBlogs: BlogPost[] = [
  {
    id: "fallback-1",
    title: "How To Activate Windows 11 Pro",
    slug: "how-to-activate-windows-11-pro",
    excerpt: "Step-by-step guide for activating Windows securely and legally.",
    content: "Step-by-step guide for activating Windows securely and legally.",
    image: FALLBACK_IMAGE,
    category: "Guide",
    publishedAt: "2026-05-12",
  },
];

function formatBlogDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

type BlogCarouselProps = {
  blogs: BlogPost[];
};

export default function BlogCarousel({ blogs }: BlogCarouselProps) {
  const items = blogs.length > 0 ? blogs : fallbackBlogs;

  return (
    <section className="mt-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white md:text-[34px]">
            Latest Articles
          </h2>
          <p className="mt-2 text-keyshop-muted">News, guides and software updates</p>
        </div>
        <Link
          href="/blog"
          className="keyshop-interactive inline-flex items-center gap-2 text-sm font-semibold text-keyshop-blue hover:text-keyshop-blue-hover"
        >
          View all articles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <KeyshopSwiper
        modules={[Autoplay]}
        loop={items.length > 3}
        spaceBetween={22}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1.08 },
          640: { slidesPerView: 1.4 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
      >
        {items.map((blog, index) => {
          const image = resolveMediaUrl(blog.image, FALLBACK_IMAGE);
          const formattedDate = formatBlogDate(blog.publishedAt);
          const excerpt =
            blog.excerpt ||
            blog.content ||
            "Read the latest guide from KEYSHOP.";

          return (
            <SwiperSlide key={blog.id} className="!h-auto">
              <article
                className={cn(
                  "keyshop-card-hover group flex h-full flex-col overflow-hidden rounded-card border border-keyshop-line bg-white/[0.03]",
                  "animate-fade-in-up motion-reduce:animate-none",
                )}
                style={{ animationDelay: `${Math.min(index, 5) * 80}ms` }}
              >
                <Link
                  href={`/blog/${blog.id}`}
                  className="relative block aspect-[16/10] overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 768px) 90vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  {blog.category ? (
                    <span className="absolute left-4 top-4 rounded-full bg-keyshop-blue/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {blog.category}
                    </span>
                  ) : null}
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  {formattedDate ? (
                    <div className="mb-3 flex items-center gap-2 text-xs text-keyshop-muted">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <time dateTime={blog.publishedAt}>{formattedDate}</time>
                    </div>
                  ) : null}

                  <Link href={`/blog/${blog.id}`} className="block">
                    <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug text-white transition-colors group-hover:text-keyshop-blue">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="mt-2 line-clamp-3 min-h-[4.5rem] flex-1 text-sm leading-6 text-keyshop-muted">
                    {excerpt}
                  </p>

                  <Link
                    href={`/blog/${blog.id}`}
                    className="keyshop-interactive mt-4 inline-flex items-center gap-2 text-sm font-semibold text-keyshop-blue hover:text-keyshop-blue-hover"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </KeyshopSwiper>
    </section>
  );
}
