"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
      {/* Background ambient subtle gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-100/40 via-emerald-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bold 64px Heading & CTA (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Minimal Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#10B981]"></span>
              <span className="text-xs font-semibold text-[#111827] tracking-wide uppercase">
                New 2026 Studio Collection
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            </div>

            {/* Bold 64px Dark Slate Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#111827] tracking-tight leading-[1.08]">
              Elevate your daily ritual with pure form.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#6B7280] max-w-xl font-normal leading-relaxed">
              Designed with obsessive attention to tactile acoustics, natural materials, and timeless minimalism. Discover handcrafted essentials built for modern living.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/Products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#categories"
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] text-[#111827] font-semibold text-base transition-all"
              >
                Browse Categories
              </Link>
            </div>

            {/* Trust metrics bar */}
            <div className="pt-6 border-t border-[#E5E7EB] flex flex-wrap items-center gap-8 text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="font-medium text-[#111827]">2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>
                <span className="font-medium text-[#111827]">Carbon Neutral Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-[#111827]">4.9 / 5.0</span>
                <span>(12,400+ reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cutout Lifestyle Product Image Floating (lg:col-span-5) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              {/* Decorative backplate */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-tr from-[#FFFFFF] to-[#F3F4F6] border border-[#E5E7EB] shadow-xl rotate-1"></div>

              {/* Main Cutout Lifestyle Product Image */}
              <div className="relative z-10 w-[88%] h-[88%] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85"
                  alt="Studio Wireless Noise Cancelling Headphones"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>

              {/* Floating Glassmorphism Badge 1 - Top Left */}
              <div className="absolute -top-3 -left-3 z-20 bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-xl p-3.5 shadow-lg flex items-center gap-3 animate-bounce [animation-duration:4s]">
                <div className="w-9 h-9 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-bold text-sm">
                  NEW
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111827]">Studio Acoustic Pro</p>
                  <p className="text-[11px] font-medium text-[#4F46E5]">$249.00 USD</p>
                </div>
              </div>

              {/* Floating Badge 2 - Bottom Right */}
              <div className="absolute -bottom-4 -right-2 z-20 bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-xl p-3.5 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-[#10B981] flex items-center justify-center">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#111827]">Award Winning</span>
                  </div>
                  <p className="text-[11px] text-[#6B7280]">iF Design Winner 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

