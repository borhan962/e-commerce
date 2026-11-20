"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, Star, ArrowUpRight, Loader2, AlertCircle, Bookmark } from "lucide-react";
import { IProduct } from "@/interfaces/product.interface";
import { AddToCart } from "@/services/addToCart.services";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/numberOfCart";
import { useWishlist } from "@/context/WishlistContext";

interface FeaturedProductsProps {
  products: IProduct[];
  title?: string;
  subtitle?: string;
}

export default function FeaturedProducts({
  products,
  title = "Featured Minimal Essentials",
  subtitle = "Precision engineered items for modern living, crafted with intention.",
}: FeaturedProductsProps) {
  // Access token from NextAuth session
  const { data: session } = useSession();
  const token = session?.accessToken;
  const { refreshCartCount, setCartCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showLoginToast, setShowLoginToast] = useState(false);

  const handleToggleBookmark = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 5000);
      return;
    }

    await toggleWishlist(productId);
  };

  async function handleAddToCart(e: React.MouseEvent, productId: string) {
    e.preventDefault();
    e.stopPropagation();

    // If user has no token, prompt them with the login toast
    if (!token) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 5000);
      return;
    }

    try {
      setLoadingId(productId);
      const res = await AddToCart(productId, token);
      setLoadingId(null);

      if (res?.status === "success" || res) {
        if (res?.numOfCartItems !== undefined) {
          setCartCount(res.numOfCartItems);
        } else {
          refreshCartCount();
        }

        setAddedIds((prev) => ({ ...prev, [productId]: true }));
        setTimeout(() => {
          setAddedIds((prev) => ({ ...prev, [productId]: false }));
        }, 2000);
      }
    } catch (err) {
      setLoadingId(null);
      console.error("Failed to add to cart:", err);
    }
  }

  return (
    <section id="featured" className="py-16 md:py-24 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#10B981] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              Curated Selection
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
              {title}
            </h2>
            <p className="text-sm text-[#6B7280] mt-2 max-w-xl">
              {subtitle}
            </p>
          </div>

          <Link
            href="/Products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors group"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Featured Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isAdded = !!addedIds[product._id];
            const isLoading = loadingId === product._id;
            const isBookmarked = isInWishlist(product._id);

            return (
              <div
                key={product._id}
                className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#D1D5DB] transition-all duration-200 p-4 flex flex-col group relative"
              >
                {/* Light Gray Image Container */}
                <div className="aspect-square bg-[#F3F4F6] rounded-xl overflow-hidden relative mb-4 flex items-center justify-center">
                  <Link
                    href={`/Products/${product._id}`}
                    className="w-full h-full relative block"
                  >
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Category Pill Over Image */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#111827] px-2.5 py-1 rounded-md border border-[#E5E7EB] pointer-events-none">
                    {product.category?.name || "Essential"}
                  </div>

                  {/* Bookmark Wishlist Icon Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleBookmark(e, product._id)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs border z-10 ${
                      isBookmarked
                        ? "bg-[#4F46E5] border-[#4F46E5] text-white hover:bg-[#4338CA] scale-105"
                        : "bg-white/90 backdrop-blur-xs border-[#E5E7EB] text-[#6B7280] hover:text-[#4F46E5] hover:border-[#4F46E5] hover:bg-white"
                    }`}
                    aria-label={isBookmarked ? "Remove from wishlist" : "Save to wishlist"}
                    title={isBookmarked ? "Remove from wishlist" : "Save to wishlist"}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </button>

                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute bottom-3 left-3 bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs pointer-events-none">
                      SAVE ${product.originalPrice - product.price}
                    </div>
                  )}
                </div>

                {/* Rating row */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-xs font-semibold text-[#111827]">
                    {product.ratingsAverage || 4.8}
                  </span>
                  <span className="text-[11px] text-[#9CA3AF]">
                    ({product.ratingsQuantity || 80})
                  </span>
                </div>

                {/* Dark Text Title */}
                <Link href={`/Products/${product._id}`}>
                  <h3 className="text-[#111827] font-semibold text-base line-clamp-1 group-hover:text-[#4F46E5] transition-colors">
                    {product.title}
                  </h3>
                </Link>

                {/* Description snippet */}
                <p className="text-xs text-[#6B7280] line-clamp-2 mt-1 mb-4 flex-1">
                  {product.description}
                </p>

                {/* Bottom Row: Price & Circular Add-to-Cart Icon */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6] mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#4F46E5]">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#9CA3AF] line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Small Circular Add-to-Cart Icon */}
                  <button
                    onClick={(e) => handleAddToCart(e, product._id)}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                      isAdded
                        ? "bg-[#10B981] text-white border-[#10B981]"
                        : isLoading
                        ? "bg-gray-100 text-[#4F46E5] border-[#E5E7EB]"
                        : "bg-white border-[#E5E7EB] text-[#111827] hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5]"
                    }`}
                    aria-label={`Add ${product.title} to cart`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#4F46E5]" />
                    ) : isAdded ? (
                      <Check className="w-4 h-4 animate-in zoom-in-50" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Login Required Toast Notification */}
      {showLoginToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-md">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-white">Login Required</p>
            <p className="text-xs text-gray-300 mt-0.5">
              You need to sign in first to add items to your cart.
            </p>
          </div>
          <Link
            href="/Login"
            className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => setShowLoginToast(false)}
            className="text-gray-400 hover:text-white text-sm p-1"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
