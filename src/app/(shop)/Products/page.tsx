import React from "react";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import { getProducts } from "@/services/product.services";
import { getCategories } from "@/services/category.services";
import {getSpecificCategories} from "@/services/specificCategory.services"

import Link from "next/link";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);


  const specificCategory = categories?.[0]?._id ? await getSpecificCategories(categories[0]._id) : null;
  console.log(specificCategory);

  
  

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
            <Link href="/" className="hover:text-[#4F46E5]">Home</Link>
            <span>/</span>
            <span className="text-[#111827] font-medium">All Products</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827]">
            Explore All Essentials
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Browse our full studio catalog of minimalist hardware, accessories, and audio.
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <button className="px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shrink-0 shadow-xs">
            All Collections
          </button>
          {categories.map((cat:any) => (
            <Link href={`/Category/${cat._id}`}
              key={cat._id}
              className="px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#111827] text-xs font-medium shrink-0 hover:bg-[#F9FAFB] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* 4-Column Product Grid */}
        <FeaturedProducts
          products={products}
          title=""
          subtitle=""
        />
      </div>
    </div>
  );
}
