import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/services/category.services";
import { ICategory } from "@/interfaces/category.interface";
import { ArrowRight } from "lucide-react";

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
            Explore Collections
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1">
            All Product Categories
          </h1>
          <p className="text-sm text-[#6B7280] mt-2">
            Browse through our curated catalog arranged by design and functional category.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat: ICategory) => (
            <Link
              key={cat._id}
              href={`/Category/${cat._id}`}
              className="group bg-white rounded-xl border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md transition-all overflow-hidden p-4 flex flex-col"
            >
              <div className="aspect-square bg-[#F3F4F6] rounded-xl overflow-hidden relative mb-4">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center justify-between mt-auto">
                <h3 className="font-semibold text-base text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                  {cat.name}
                </h3>
                <span className="w-8 h-8 rounded-full bg-[#F9FAFB] group-hover:bg-[#4F46E5] text-[#111827] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

