import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import SessionProvider from "@/sessionProvider/SessionProvider";
import { CartProvider } from "@/context/numberOfCart";
import { WishlistProvider } from "@/context/WishlistContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Modern E-Commerce Store",
  description: "Minimalist high-end e-commerce store with clean Figma interface design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-[#111827] font-sans selection:bg-[#4F46E5] selection:text-white">
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
