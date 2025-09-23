'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageSliderProps {
  images: string[];
  alt: string;
}

export default function ImageSlider({ images, alt }: ImageSliderProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={images.length > 1}
        className="h-96"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-96">
              <img
                src={image}
                alt={`${alt} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>

          <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div className="swiper-pagination-custom absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10"></div>
        </>
      )}

      <style jsx global>{`
        .swiper-pagination-bullet-custom {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          border-radius: 50% !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .swiper-pagination-bullet-custom:hover {
          background: rgba(255, 255, 255, 0.75) !important;
        }

        .swiper-pagination-bullet-active-custom {
          background: rgba(255, 255, 255, 1) !important;
        }

        .group:hover .swiper-button-prev-custom,
        .group:hover .swiper-button-next-custom {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}