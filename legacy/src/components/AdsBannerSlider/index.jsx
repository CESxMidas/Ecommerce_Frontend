import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import BannerBox from "../BannerBox";
import { fetchBanners } from "../../services/cmsService";
import "swiper/css";
import "swiper/css/navigation";
import "./index.css";

const fallbackAds = [
  "/images/bypass/cerberus-banner.png",
  "/images/bypass/snake-app.png",
  "/images/bypass/cerberus-banner.png",
];

const AdsBannerSlider = ({ items = 4 }) => {
  const [ads, setAds] = useState(fallbackAds);
  const maxSlidesPerView = Math.max(Number(items) || 1, 3);
  const canLoop = ads.length > maxSlidesPerView;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchBanners("ads");

        if (!cancelled && data.length > 0) {
          setAds(data.map((banner) => banner.image));
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
    <section className="adsBannerSlider mt-10">
      <div className="w-full">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={canLoop}
          spaceBetween={18}
          slidesPerView={items}
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
              slidesPerView: items,
            },
          }}
          className="ads-swiper"
        >
          {ads.map((img, index) => (
            <SwiperSlide key={`${img}-${index}`}>
              <BannerBox img={img} link="/" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AdsBannerSlider;
