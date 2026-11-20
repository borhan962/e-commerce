"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Share2,
  Bookmark,
} from "lucide-react";
import { IProduct } from "@/interfaces/product.interface";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/numberOfCart";
import { useWishlist } from "@/context/WishlistContext";
import { AddToCart } from "@/services/addToCart.services";

interface ProductDetailViewProps {
  product: IProduct;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const images = product.images?.length
    ? product.images.slice(0, 4)
    : [
        product.imageCover,
        product.imageCover,
        product.imageCover,
        product.imageCover,
      ];

  // Fill up to 4 thumbnails if less
  while (images.length < 4) {
    images.push(product.imageCover);
  }

  const [selectedImage, setSelectedImage] = useState(images[0] || product.imageCover);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || "#111827"
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] || "Standard"
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const colors = product.colors || ["#111827", "#4F46E5", "#10B981", "#E5E7EB"];
  const sizes = product.sizes || ["Standard", "Pro", "Max"];

  const { data: session } = useSession();
  const token = session?.accessToken;
  const { refreshCartCount, setCartCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product._id);

  const handleToggleWishlist = async () => {
    if (!token) {
      window.location.href = "/Login";
      return;
    }
    await toggleWishlist(product._id);
  };

  const handleAddToCart = async () => {
    if (!token) {
      window.location.href = "/Login";
      return;
    }

    setIsAdded(true);
    try {
      const res = await AddToCart(product._id, token);
      if (res?.numOfCartItems !== undefined) {
        setCartCount(res.numOfCartItems);
      } else {
        refreshCartCount();
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }

    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimalist Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#6B7280] mb-8">
          <Link href="/" className="hover:text-[#4F46E5] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/Products" className="hover:text-[#4F46E5] transition-colors">
            {product.category?.name || "Shop"}
          </Link>
          <span>/</span>
          <span className="text-[#111827] font-medium truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* Two-Column Product Detail Layout (12-column grid, 24px gutters) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* ================= LEFT COLUMN ================= */}
          {/* Features a large 628px square main product image with a row of 4 square thumbnails directly below it */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Large 628px Square Main Product Image on White Background with 12px Rounded Corners */}
            <div className="w-full max-w-[628px] aspect-square bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] shadow-sm relative overflow-hidden flex items-center justify-center p-6 group">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 628px"
                  className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Floating Stock Tag */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                In Stock & Ready to Ship
              </div>

              {/* Quick Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center shadow-xs transition-colors cursor-pointer z-10 ${
                  isWishlisted
                    ? "bg-[#4F46E5] border-[#4F46E5] text-white hover:bg-[#4338CA]"
                    : "bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#4F46E5] hover:border-[#4F46E5] hover:bg-[#F9FAFB]"
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Bookmark className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Row of 4 Square Thumbnails Directly Below It */}
            <div className="grid grid-cols-4 gap-4 mt-4 w-full max-w-[628px]">
              {images.map((img, idx) => {
                const isActive = selectedImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-xl bg-[#FFFFFF] border-2 p-2 relative overflow-hidden transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/20 shadow-xs"
                        : "border-[#E5E7EB] hover:border-[#D1D5DB] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} thumbnail ${idx + 1}`}
                      fill
                      sizes="140px"
                      className="object-contain p-1 rounded-lg"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          {/* Features 36px dark slate title, large indigo price, circular color swatches, rectangular size buttons, sticky quantity selector, massive vibrant indigo Add to Cart */}
          <div className="lg:col-span-6 space-y-6">
            {/* Category and Rating */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                {product.category?.name || "Premium Collection"}
              </span>

              {/* 36px Dark Slate Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#111827] leading-tight">
                {product.title}
              </h1>

              {/* Ratings and reviews */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#111827]">
                  {product.ratingsAverage || 4.9}
                </span>
                <span className="text-xs text-[#6B7280]">
                  ({product.ratingsQuantity || 128} verified reviews)
                </span>
              </div>
            </div>

            {/* Large Indigo Price Text */}
            <div className="flex items-baseline gap-3.5 py-2 border-y border-[#E5E7EB]">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#4F46E5]">
                ${product.price}.00
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base sm:text-lg text-[#9CA3AF] line-through">
                    ${product.originalPrice}.00
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#10B981]/15 text-[#10B981] text-xs font-bold">
                    Save ${product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              {product.description}
            </p>

            {/* Circular Color Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111827]">
                  Select Color
                </label>
                <span className="text-xs text-[#6B7280]">
                  Selected: <span className="font-medium text-[#111827]">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((color, i) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full transition-all duration-200 cursor-pointer shadow-2xs relative ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-[#4F46E5] scale-110"
                          : "hover:scale-105 border border-black/10"
                      }`}
                      aria-label={`Select color ${color}`}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check
                            className={`w-4 h-4 ${
                              color === "#FFFFFF" || color === "#E5E7EB"
                                ? "text-[#111827]"
                                : "text-white"
                            }`}
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rectangular Size Selection Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111827]">
                  Select Dimension / Size
                </label>
                <button type="button" className="text-xs text-[#4F46E5] hover:underline font-medium">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 px-5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#111827] text-white border-2 border-[#111827] shadow-xs"
                          : "bg-white text-[#111827] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Massive Vibrant Indigo 'Add to Cart' Button */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#111827] block">
                Quantity & Order
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Sticky Quantity Selector */}
                <div className="h-14 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-between px-3 w-full sm:w-36 shrink-0 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#111827] hover:bg-[#F9FAFB] disabled:opacity-40 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="font-bold text-[#111827] text-base px-2">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Massive Vibrant Indigo 'Add to Cart' Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 h-14 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer ${
                    isAdded
                      ? "bg-[#10B981] hover:bg-[#059669]"
                      : "bg-[#4F46E5] hover:bg-[#4338CA]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-6 h-6 animate-in zoom-in-50" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              <Link
                href="/cart"
                className="w-full h-12 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] text-[#111827] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
              >
                Proceed to Checkout
              </Link>
            </div>

            {/* Service & Assurance highlights */}
            <div className="pt-6 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span className="text-xs text-[#6B7280]">Free worldwide dispatch</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span className="text-xs text-[#6B7280]">30-day effortless returns</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="text-xs text-[#6B7280]">2-Year hardware warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

