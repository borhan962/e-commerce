"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  ShoppingBag,
  Trash2,
  ArrowRight,
  User,
  UserPlus,
  Loader2,
  Star,
  Check,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/numberOfCart";
import { AddToCart } from "@/services/addToCart.services";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const { wishlistItems, removeFromWishlistDirect, isLoading } = useWishlist();
  const { setCartCount, refreshCartCount } = useCart();

  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});
  const [addingId, setAddingId] = React.useState<string | null>(null);

  const hasToken = !!session?.accessToken;

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.accessToken) return;

    setAddingId(productId);
    try {
      const res = await AddToCart(productId, session.accessToken);
      if (res?.numOfCartItems !== undefined) {
        setCartCount(res.numOfCartItems);
      } else {
        refreshCartCount();
      }

      setAddedIds((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to add from wishlist to cart:", err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
            <Link href="/" className="hover:text-[#4F46E5] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#111827] font-medium">Wishlist</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              My Wishlist
            </h1>
            <span className="text-sm font-semibold text-[#6B7280]">
              {hasToken
                ? `${wishlistItems.length} ${
                    wishlistItems.length === 1 ? "saved item" : "saved items"
                  }`
                : "0 items"}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-16 text-center max-w-lg mx-auto shadow-sm my-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin mb-3" />
            <p className="text-sm font-medium text-[#4B5563]">
              Loading your saved items...
            </p>
          </div>
        ) : !hasToken ? (
          /* Unauthenticated State */
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-12">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              Save Your Favorite Essentials
            </h2>
            <p className="text-sm text-[#6B7280] mt-2 mb-8 max-w-sm mx-auto leading-relaxed">
              Sign in to your account to view your saved wishlist items across all your devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/Login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-sm transition-all"
              >
                <User className="w-4 h-4" />
                <span>Sign in to your account</span>
              </Link>
              <Link
                href="/Register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] font-semibold text-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign up now</span>
              </Link>
            </div>
          </div>
        ) : wishlistItems.length === 0 ? (
          /* Authenticated but Empty Wishlist */
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center max-w-lg mx-auto shadow-sm my-12">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">
              Your Wishlist is Empty
            </h2>
            <p className="text-sm text-[#6B7280] mt-2 mb-8 max-w-sm mx-auto">
              You haven&apos;t saved any items yet. Explore our curated collections and bookmark products you love!
            </p>
            <Link
              href="/Products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Collections</span>
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const isAdded = !!addedIds[product._id];
              const isAdding = addingId === product._id;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#D1D5DB] transition-all p-4 flex flex-col group relative"
                >
                  {/* Image container */}
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

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#111827] px-2.5 py-1 rounded-md border border-[#E5E7EB]">
                      {product.category?.name || "Essential"}
                    </div>

                    {/* Remove from Wishlist Bookmark button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlistDirect(product._id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs text-rose-500 hover:text-rose-600 shadow-sm flex items-center justify-center hover:scale-110 transition-all cursor-pointer border border-[#E5E7EB]"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

                  {/* Title */}
                  <Link href={`/Products/${product._id}`}>
                    <h3 className="text-[#111827] font-semibold text-base line-clamp-1 group-hover:text-[#4F46E5] transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price & Add to Cart button */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6] mt-auto">
                    <span className="text-lg font-bold text-[#4F46E5]">
                      ${product.price}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product._id)}
                      disabled={isAdding}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                        isAdded
                          ? "bg-[#10B981] text-white"
                          : isAdding
                          ? "bg-gray-100 text-[#4F46E5]"
                          : "bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                      }`}
                    >
                      {isAdding ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
