import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Autoplay } from "swiper/modules";
import BlogItem from "../BlogItem";
import { fetchBlogs } from "../../services/cmsService";
import "swiper/css";
import "swiper/css/navigation";
import "./index.css";

const fallbackBlogs = [
  {
    id: 1,
    category: "Windows",
    date: "12 May 2026",
    title: "How To Activate Windows 11 Pro",
    description:
      "Step-by-step guide for activating Windows securely and legally.",
    image: "/images/bypass/cerberus-banner.png",
  },
];

const BlogSlider = () => {
  const [blogs, setBlogs] = useState(fallbackBlogs);
  const canLoop = blogs.length > 3;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchBlogs();

        if (!cancelled && data.length > 0) {
          setBlogs(
            data.map((blog) => ({
              id: blog._id,
              category: blog.category,
              date: blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString()
                : "",
              title: blog.title,
              description: blog.description,
              image: blog.image,
            })),
          );
        }
      } catch {
        // keep fallback
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="blogSliderSection mt-14">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[34px] font-extrabold text-white">
              Latest Articles
            </h2>
            <p className="text-white/60 mt-2">
              News, guides and software updates
            </p>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop={canLoop}
          spaceBetween={22}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          className="blogSwiper"
        >
          {blogs.map((item) => (
            <SwiperSlide key={item.id}>
              <BlogItem item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BlogSlider;
