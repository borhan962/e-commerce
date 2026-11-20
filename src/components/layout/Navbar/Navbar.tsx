"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  ArrowUpRight,
  LogOut,
  ChevronDown,
  Bookmark,
  Package,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/context/numberOfCart";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide Navbar on Login, Register, Forgot Password, and Verify Code pages
  const isAuthPage =
    pathname?.toLowerCase() === "/login" ||
    pathname?.toLowerCase() === "/register" ||
    pathname?.toLowerCase() === "/forgetpassword" ||
    pathname?.toLowerCase() === "/verifycode" ||
    pathname?.toLowerCase() === "/resetpassword";
  if (isAuthPage) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/Products" },
    { name: "Categories", href: "/#categories" },
    { name: "Deals", href: "/#featured" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      {/* Top micro banner */}
      <div className="bg-[#111827] text-white text-xs py-2 px-4 text-center font-medium">
        <span className="inline-flex items-center gap-1.5 justify-center">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          Complimentary express worldwide delivery on all orders over $150
          <Link href="/Products" className="underline font-semibold ml-1 hover:text-[#10B981] transition-colors inline-flex items-center">
            Shop Now <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </Link>
        </span>
      </div>

      {/* Main navigation container (1440px viewport grid) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
            V
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#111827]">
              VELOCE<span className="text-[#4F46E5]">.</span>
            </span>
            <span className="text-[10px] tracking-widest text-[#6B7280] uppercase -mt-1 font-semibold">
              Studio Store
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#4F46E5] relative py-1 ${
                  isActive ? "text-[#4F46E5] font-semibold" : "text-[#4B5563]"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5] rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Minimalist Search Input */}
        <div className="hidden lg:flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search minimal essentials, footwear, audio..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-[#FFFFFF] transition-all"
          />
        </div>

        {/* Right Action Icons & CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart Pill (ALWAYS visible on desktop and small screens!) */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#4F46E5] hover:bg-[#F9FAFB] text-[#111827] transition-all shadow-xs group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#111827] group-hover:text-[#4F46E5] transition-colors" />
            {session ? (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            ) : null}
          </Link>

          {/* Conditional based on session (Desktop) */}
          {session ? (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] border border-indigo-100 rounded-xl transition-all cursor-pointer"
                aria-haspopup="true"
                aria-expanded={userDropdownOpen}
              >
                <span>{session.user?.name || "Account"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-[#F3F4F6]">
                    <p className="text-[11px] text-[#6B7280]">Signed in as</p>
                    <p className="text-sm font-bold text-[#111827] truncate">
                      {session.user?.name || session.user?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-[#111827] hover:bg-[#F9FAFB] hover:text-[#4F46E5] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bookmark className="w-4 h-4 text-[#4F46E5]" />
                        <span>My Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] border border-indigo-100">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/allorders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#111827] hover:bg-[#F9FAFB] hover:text-[#4F46E5] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#4F46E5]" />
                      <span>My Orders</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#F3F4F6] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Sign In / Account Link */}
              <Link
                href="/Login"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#111827] hover:text-[#4F46E5] px-3.5 py-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
              >
                <User className="w-4 h-4 text-[#6B7280]" />
                <span>Sign In</span>
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-[#111827] hover:bg-[#F9FAFB] border border-[#E5E7EB] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-6 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-base font-medium text-[#111827] hover:text-[#4F46E5] border-b border-[#F3F4F6]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth actions */}
          <div className="pt-2 flex flex-col gap-2.5">
            {session ? (
              <>
                <div className="px-3.5 py-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-[#4B5563]">
                  Signed in as: <strong className="text-[#111827]">{session.user?.name || session.user?.email}</strong>
                </div>

                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 px-4 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between font-medium text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4 text-[#4F46E5]" />
                    <span>My Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] border border-indigo-100">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/allorders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 px-4 rounded-xl border border-[#E5E7EB] bg-white flex items-center gap-2.5 font-medium text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                >
                  <Package className="w-4 h-4 text-[#4F46E5]" />
                  <span>My Orders</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full h-11 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 flex items-center justify-center font-medium text-sm hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/Login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] flex items-center justify-center font-medium text-sm text-[#111827]"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
