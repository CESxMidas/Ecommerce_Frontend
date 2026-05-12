import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import BannerBox from "../BannerBox";

import "swiper/css";
import "swiper/css/navigation";

import "./index.css";

const AdsBannerSlider = () => {
  return (
    <section className="adsBannerSlider mt-10">
      <div className="w-full">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          spaceBetween={18}
          slidesPerView={4}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
            },
            576: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 4,
            },
          }}
          className="ads-swiper"
        >

          <SwiperSlide>
            <BannerBox
              img="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop"
              link="/"
            />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBox
              img="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
              link="/"
            />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBox
              img="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200&auto=format&fit=crop"
              link="/"
            />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBox
              img="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop"
              link="/"
            />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBox
              img="https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop"
              link="/"
            />
          </SwiperSlide>

        </Swiper>
      </div>
    </section>
  );
};

export default AdsBannerSlider;