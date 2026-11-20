"use client";

import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import { SwiperOptions } from "swiper/types";

interface SlideItem {
  src: string;
  label: string;
}

interface CommonSlideProps {
  slides: SlideItem[];
  variant?: "main" | "category";
  swiperOptions?: SwiperOptions;
}

export default function CommonSlider({
  slides,
  variant = "main",
  swiperOptions,
}: CommonSlideProps) {
  return (
    <div className="w-full">
      <Swiper
        {...swiperOptions}
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet !size-3 !border-2 border-[#4F46E5]/40",
          bulletActiveClass:
            "swiper-pagination-bullet-active !bg-[#4F46E5] !w-6 !rounded-full",
        }}
        modules={[Pagination]}
        className="mySwiper w-full rounded-xl overflow-hidden"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative">
            <div className="relative w-full h-80 sm:h-96 md:h-[450px]">
              <Image
                src={slide.src}
                fill
                className="object-cover"
                alt={slide.label || "slide"}
              />
            </div>
            {variant === "category" && (
              <h3 className="text-center font-semibold text-sm text-[#111827] mt-2">
                {slide.label}
              </h3>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
