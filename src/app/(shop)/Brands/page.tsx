import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BrandsPage() {
  const brands = [
    { name: "Acoustic Minimal", items: 24, desc: "Audiophile precision components and transducers." },
    { name: "Komorebi Living", items: 42, desc: "Japanese minimalist home accents and organic linens." },
    { name: "Vanguard Studio", items: 18, desc: "Horological craftsmanship and surgical titanium watches." },
    { name: "Nordic Atelier", items: 31, desc: "Ergonomic leather bags and modular commute packs." },
    { name: "Aura Ambient", items: 15, desc: "Smart ambient luminescence and diffused sound devices." },
    { name: "Strata Active", items: 27, desc: "Featherlight breathable knit footwear and apparel." },
  ];

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
            Makers & Studios
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1">
            Featured Partner Brands
          </h1>
          <p className="text-sm text-[#6B7280] mt-2">
            Selected independent design studios dedicated to minimalist industrial craft.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md transition-all p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center font-bold text-lg mb-4">
                  {brand.name[0]}
                </div>
                <h3 className="text-xl font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                  {brand.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-[#F3F4F6] mt-6 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#111827]">{brand.items} Products</span>
                <Link
                  href="/Products"
                  className="text-[#4F46E5] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

