import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode[];
  gap?: number;
  cardWidth?: number;
};

export const CarouselScroll = ({
  children,
  gap = 32,
  cardWidth = 330,
}: Props) => {
  return (
    <Swiper
      effect="coverflow"
      grabCursor={true}
      centeredSlides={true}
      initialSlide={2}
      slidesPerView="auto"
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
        slideShadows: false,
      }}
      pagination={{ clickable: true }}
      modules={[EffectCoverflow, Pagination]}
      className="mb-16 w-full"
    >
      {children.map((child, index) => (
        <SwiperSlide
          key={index}
          className="!w-[330px]" // カードの幅を指定
          style={{
            width: cardWidth,
            marginRight: gap,
          }}
        >
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
