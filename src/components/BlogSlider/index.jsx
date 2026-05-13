import { Swiper, SwiperSlide } from "swiper/react";

import {
  Navigation,
  Autoplay,
} from "swiper/modules";

import BlogItem from "../BlogItem";

import "swiper/css";
import "swiper/css/navigation";

import "./index.css";

const blogs = [
  {
    id: 1,
    category: "Windows",
    date: "12 May 2026",
    title: "How To Activate Windows 11 Pro",
    description:
      "Step-by-step guide for activating Windows securely and legally.",
    image:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 2,
    category: "Security",
    date: "13 May 2026",
    title: "Top Antivirus Software For PC",
    description:
      "Best premium antivirus solutions for gamers and developers.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 3,
    category: "AI Tools",
    date: "14 May 2026",
    title: "Best AI Tools For Developers",
    description:
      "Boost your coding workflow with the latest AI software.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 4,
    category: "Gaming",
    date: "15 May 2026",
    title: "Best Gaming Software In 2026",
    description:
      "Ultimate software collection for gamers and streamers.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
  },
];

const BlogSlider = () => {
  return (
    <section className="blogSliderSection mt-14">
      <div className="container mx-auto px-6">
        
        {/* HEADER */}
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

        {/* SWIPER */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={22}
          slidesPerView={3}
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