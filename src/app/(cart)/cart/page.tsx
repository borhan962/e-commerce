"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Tag,
  CheckCircle,
  ArrowLeft,
  User,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/numberOfCart";
import CheckoutModal from "@/components/cart/CheckoutModal";
import {
  getCartUser,
  updateCartItemQuantity,
  removeCartItem,
  clearUserCart,
} from "@/services/cartUser.services";

export interface ICartItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    id?: string;
    title: string;
    imageCover: string;
    category?: {
      name: string;
    };
    brand?: {
      name: string;
    };
    ratingsAverage?: number;
  };
}

export interface ICartData {
  _id: string;
  cartOwner: string;
  products: ICartItem[];
  totalCartPrice: number;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const { setCartCount } = useCart();
  const [cart, setCart] = useState<ICartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const hasToken = !!session?.accessToken;

  // Fetch real cart data from RouteMisr API
  useEffect(() => {
    async function fetchCart() {
      if (session?.accessToken) {
        setIsLoading(true);
        const res = await getCartUser(session.accessToken);
        if (res?.data) {
          setCart(res.data);
          if (res?.numOfCartItems !== undefined) {
            setCartCount(res.numOfCartItems);
          } else if (res?.data?.products) {
            setCartCount(res.data.products.length);
          }
        } else {
          setCart(null);
          setCartCount(0);
        }
        setIsLoading(false);
      } else if (status === "unauthenticated") {
        setCart(null);
        setCartCount(0);
        setIsLoading(false);
      }
    }

    if (status !== "loading") {
      fetchCart();
    }
  }, [session?.accessToken, status, setCartCount]);

  // Update item quantity on RouteMisr API
  const handleUpdateQuantity = async (productId: string, newCount: number) => {
    if (!session?.accessToken) return;
    if (newCount <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setUpdatingId(productId);
    const res = await updateCartItemQuantity(productId, newCount, session.accessToken);
    if (res?.data) {
      setCart(res.data);
      if (res?.numOfCartItems !== undefined) {
        setCartCount(res.numOfCartItems);
      }
    }
    setUpdatingId(null);
  };

  // Remove a single product from cart
  const handleRemoveItem = async (productId: string) => {
    if (!session?.accessToken) return;
    setUpdatingId(productId);
    const res = await removeCartItem(productId, session.accessToken);
    if (res?.data) {
      setCart(res.data);
      if (res?.numOfCartItems !== undefined) {
        setCartCount(res.numOfCartItems);
      } else if (res?.data?.products) {
        setCartCount(res.data.products.length);
      }
    }
    setUpdatingId(null);
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    await clearUserCart(session.accessToken);
    setCart(null);
    setCartCount(0);
    setIsLoading(false);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "VELOCE20") {
      setPromoApplied(true);
      setDiscountAmount(0.2); // 20%
    } else if (promoCode.trim().length > 0) {
      setPromoApplied(true);
      setDiscountAmount(0.1);
    }
  };

  const cartProducts = cart?.products || [];
  const subtotal = cart?.totalCartPrice || 0;
  const discount = subtotal * discountAmount;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const estimatedTax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + estimatedTax;

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
            <Link href="/" className="hover:text-[#4F46E5] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111827] font-medium">Shopping Bag</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Shopping Cart
            </h1>
            <span className="text-sm font-semibold text-[#6B7280]">
              {hasToken ? `${cartProducts.length} ${cartProducts.length === 1 ? "item" : "items"}` : "0 items"}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-16 text-center max-w-lg mx-auto shadow-sm my-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin mb-3" />
            <p className="text-sm font-medium text-[#4B5563]">Loading your cart from server...</p>
          </div>
        ) : !hasToken ? (
          /* Unauthenticated State: Show your cart is empty + Sign in / Sign up buttons */
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-12">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              Your Cart is Empty
            </h2>
            <p className="text-sm text-[#6B7280] mt-2 mb-8 max-w-sm mx-auto leading-relaxed">
              Looks like you haven&apos;t logged in yet. Please sign in to your account or create a new one to start shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/Login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-sm hover:shadow transition-all active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign in to your account</span>
              </Link>
              <Link
                href="/Register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] text-[#111827] font-semibold text-sm transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign up now</span>
              </Link>
            </div>
          </div>
        ) : cartProducts.length === 0 ? (
          /* Authenticated but Empty Cart */
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center max-w-lg mx-auto shadow-sm my-12">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Your Bag is Empty</h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Looks like you haven&apos;t added any items to your shopping cart yet.
            </p>
            <Link
              href="/Products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm transition-all shadow-sm"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Asymmetrical Two-Column Shopping Cart Layout with Real API Data */
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* ================= LEFT COLUMN (65% Width) ================= */}
            <div className="w-full lg:w-[65%] space-y-4">
              {/* Real Stacked Cart Item Rows from RouteMisr API */}
              {cartProducts.map((item) => {
                const isUpdating = updatingId === item.product?._id;

                return (
                  <div
                    key={item._id}
                    className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 transition-all hover:border-[#D1D5DB] relative"
                  >
                    {/* Product Thumbnail Image */}
                    <Link
                      href={`/Products/${item.product?._id}`}
                      className="w-[120px] h-[120px] rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] shrink-0 relative overflow-hidden flex items-center justify-center p-2 group"
                    >
                      <Image
                        src={item.product?.imageCover || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"}
                        alt={item.product?.title || "Product"}
                        fill
                        sizes="120px"
                        className="object-contain p-1 rounded-lg group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                      {item.product?.category?.name && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5]">
                          {item.product.category.name}
                        </span>
                      )}
                      <Link href={`/Products/${item.product?._id}`}>
                        <h3 className="text-[#111827] font-semibold text-base sm:text-lg truncate hover:text-[#4F46E5] transition-colors">
                          {item.product?.title}
                        </h3>
                      </Link>
                      {item.product?.brand?.name && (
                        <p className="text-xs text-[#6B7280]">
                          Brand: <strong className="text-[#111827]">{item.product.brand.name}</strong>
                        </p>
                      )}
                      {/* Price */}
                      <div className="pt-1">
                        <span className="text-lg font-bold text-[#4F46E5]">
                          ${item.price}.00
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper Controls & Red Remove Icon */}
                    <div className="flex items-center gap-4 shrink-0">
                      {/* Stepper */}
                      <div className="h-10 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl flex items-center justify-between px-2 w-28 shadow-xs">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateQuantity(item.product?._id, item.count - 1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-[#111827] hover:bg-[#F9FAFB] transition-colors disabled:opacity-40 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-sm text-[#111827]">
                          {isUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4F46E5]" />
                          ) : (
                            item.count
                          )}
                        </span>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateQuantity(item.product?._id, item.count + 1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-[#111827] hover:bg-[#F9FAFB] transition-colors disabled:opacity-40 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Red Remove Icon */}
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleRemoveItem(item.product?._id)}
                        className="p-2.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-40 cursor-pointer"
                        title="Remove product"
                        aria-label={`Remove ${item.product?.title}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Actions Row */}
              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/Products"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-xs font-semibold text-[#6B7280] hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* ================= RIGHT COLUMN (35% Width) ================= */}
            {/* Sticky Pure White Order Summary Card */}
            <div className="w-full lg:w-[35%]">
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] shadow-sm p-6 lg:sticky lg:top-24 space-y-6">
                <h2 className="text-xl font-bold text-[#111827] pb-4 border-b border-[#E5E7EB]">
                  Order Summary
                </h2>

                {/* Pricing Rows */}
                <div className="space-y-3.5 text-sm text-[#6B7280]">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#111827]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-[#10B981]">
                      <span>Discount ({discountAmount * 100}%)</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-[#111827]">
                      {shipping === 0 ? (
                        <span className="text-[#10B981] font-bold">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-[#111827]">
                      ${estimatedTax.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo Code Input Field */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111827] mb-2">
                    Promo Code
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. VELOCE20"
                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all uppercase font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="h-11 px-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] text-sm font-semibold text-[#111827] transition-all cursor-pointer shadow-2xs"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold mt-2">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Promo applied successfully!
                    </p>
                  )}
                </form>

                {/* Grand Total Row */}
                <div className="pt-4 border-t border-[#E5E7EB] flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-[#111827] block">Total</span>
                    <span className="text-xs text-[#6B7280]">Including taxes & shipping</span>
                  </div>
                  <span className="text-2xl font-extrabold text-[#111827]">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Prominent Emerald Green 'Checkout' Button */}
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full h-14 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Trust Badges */}
                <div className="pt-2 border-t border-[#F3F4F6] flex flex-col gap-2.5 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-2 text-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>256-bit Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[#9CA3AF] text-xs font-semibold">
                    <span>Apple Pay</span>
                    <span>•</span>
                    <span>Google Pay</span>
                    <span>•</span>
                    <span>Visa / MC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout & Address Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartId={cart?._id || ""}
        totalPrice={total}
      />
    </div>
  );
}
