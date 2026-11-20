import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpecificCategory, getProductsByCategory } from "@/services/specificCategory.services";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import { ArrowLeft, Sparkles, Layers } from "lucide-react";

interface CategoryDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SpecificCategoryPage({ params }: CategoryDetailPageProps) {
  const { id } = await params;
  const category = await getSpecificCategory(id);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(id);

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#6B7280] mb-8">
          <Link href="/" className="hover:text-[#4F46E5] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/Category" className="hover:text-[#4F46E5] transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-[#111827] font-semibold">{category.name}</span>
        </nav>

        {/* Category Hero Banner */}
        <div className="relative overflow-hidden bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 mb-12 shadow-xs">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-xs font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>Category Collection</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                Explore handcrafted minimalist pieces and studio essentials specifically curated in the {category.name} catalog.
              </p>
              <div className="pt-2 flex items-center justify-center md:justify-start gap-4 text-xs font-medium text-[#4B5563]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  {products.length} {products.length === 1 ? "Product" : "Products"} Available
                </span>
                <span>•</span>
                <Link
                  href="/Category"
                  className="text-[#4F46E5] hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  All Categories
                </Link>
              </div>
            </div>

            {/* Category Image Avatar */}
            <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-2xl bg-[#F9FAFB] border-2 border-[#E5E7EB] overflow-hidden relative shadow-md shrink-0 p-2">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 160px, 208px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products in this category */}
        {products.length > 0 ? (
          <FeaturedProducts
            products={products}
            title={`${category.name} Essentials`}
            subtitle={`Showing all ${products.length} products found in this category.`}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">
              No Products Found Yet
            </h3>
            <p className="text-sm text-[#6B7280] mt-2 mb-6">
              New arrivals in {category.name} are coming soon. Check out our other collections in the meantime.
            </p>
            <Link
              href="/Products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#4F46E5] text-white text-sm font-semibold hover:bg-[#4338CA] transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
