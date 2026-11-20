import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

export default function Footer() {
  const features = [
    {
      icon: Truck,
      title: "Global Express Delivery",
      desc: "Fast, reliable door-to-door shipping across 120+ countries",
    },
    {
      icon: RotateCcw,
      title: "30-Day Effortless Returns",
      desc: "Instant pre-paid returns label included in every box",
    },
    {
      icon: ShieldCheck,
      title: "100% Authentic Guarantee",
      desc: "Verified craftsmanship and manufacturer backed warranty",
    },
    {
      icon: Headphones,
      title: "24/7 Dedicated Support",
      desc: "Direct line to our personal shopping & technical team",
    },
  ];

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E5E7EB] mt-24">
      {/* Value Proposition Highlights */}
      <div className="border-b border-[#E5E7EB] bg-[#F9FAFB]/50 py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-all">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111827]">{item.title}</h4>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand info (4 cols) */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                V
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#111827]">
                VELOCE<span className="text-[#4F46E5]">.</span>
              </span>
            </Link>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-sm">
              Curating elevated modern lifestyle goods, acoustic technology, and bespoke minimalist essentials with uncompromising quality.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#111827] tracking-wider uppercase block mb-3">
                Join our private editorial
              </span>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-11 px-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
                <button
                  type="button"
                  className="h-11 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Nav column 1 (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-sm font-semibold text-[#111827]">Collections</h5>
            <ul className="space-y-2.5 text-sm text-[#6B7280]">
              <li><Link href="/Products" className="hover:text-[#4F46E5] transition-colors">Audio & Sound</Link></li>
              <li><Link href="/Products" className="hover:text-[#4F46E5] transition-colors">Minimal Footwear</Link></li>
              <li><Link href="/Products" className="hover:text-[#4F46E5] transition-colors">Watches & Accs</Link></li>
              <li><Link href="/Products" className="hover:text-[#4F46E5] transition-colors">Urban Bags</Link></li>
              <li><Link href="/Products" className="hover:text-[#4F46E5] transition-colors">Home Living</Link></li>
            </ul>
          </div>

          {/* Nav column 2 (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-sm font-semibold text-[#111827]">Customer Care</h5>
            <ul className="space-y-2.5 text-sm text-[#6B7280]">
              <li><Link href="/cart" className="hover:text-[#4F46E5] transition-colors">Your Order Status</Link></li>
              <li><Link href="/cart" className="hover:text-[#4F46E5] transition-colors">Track Delivery</Link></li>
              <li><Link href="#" className="hover:text-[#4F46E5] transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="#" className="hover:text-[#4F46E5] transition-colors">Size & Fit Guide</Link></li>
              <li><Link href="#" className="hover:text-[#4F46E5] transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Nav column 3 (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-sm font-semibold text-[#111827]">Account</h5>
            <ul className="space-y-2.5 text-sm text-[#6B7280]">
              <li><Link href="/Login" className="hover:text-[#4F46E5] transition-colors">Sign In</Link></li>
              <li><Link href="/Register" className="hover:text-[#4F46E5] transition-colors">Create Account</Link></li>
              <li><Link href="/cart" className="hover:text-[#4F46E5] transition-colors">Shopping Bag</Link></li>
              <li><Link href="#" className="hover:text-[#4F46E5] transition-colors">Membership Rewards</Link></li>
            </ul>
          </div>

          {/* Nav column 4 (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-sm font-semibold text-[#111827]">Company</h5>
            <ul className="space-y-2.5 text-sm text-[#6B7280]">
              <li><Link href="#" className="hover:text-[#4F46E5] transition-colors">About Veloce</Link></li>
              <li><Link href="#" className="hover:text-[#4F46E5] transition-colors">Sustainability</Link></li>
              <li><Link href="#" className="hover:text-[#4F46E5] transition-colors">Editorial Journal</Link></li>
              <li><Link href="#" className="hover:text-[#4F46E5] transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-16 pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <p>© {new Date().getFullYear()} VELOCE Studio Inc. All rights reserved. Designed for modern web standard.</p>
          <div className="flex items-center gap-6">
            <span>Security: 256-bit SSL</span>
            <span>Currency: USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
