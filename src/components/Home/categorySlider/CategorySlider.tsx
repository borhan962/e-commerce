"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { ICategory } from "@/interfaces/category.interface";

interface CategorySliderProps {
  categories: ICategory[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="categories" className="py-12 border-y border-[#E5E7EB] bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row with navigation arrows */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4F46E5] mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
              Browse By Category
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] flex items-center justify-center text-[#111827] transition-colors shadow-2xs"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] flex items-center justify-center text-[#111827] transition-colors shadow-2xs"
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel of Circular Category Icons */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth focus:outline-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/Category/${cat._id}`}
              className="flex flex-col items-center gap-3 shrink-0 group focus:outline-none"
            >
              {/* Circular Category Icon Container */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#FFFFFF] border-2 border-[#E5E7EB] group-hover:border-[#4F46E5] group-hover:shadow-md transition-all duration-300 p-1 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-[#F3F4F6]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 96px, 112px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Category Name */}
              <span className="text-xs sm:text-sm font-semibold text-[#111827] group-hover:text-[#4F46E5] transition-colors text-center whitespace-nowrap max-w-[120px] truncate">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
