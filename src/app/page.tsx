import HeroSection from "@/components/Home/HeroSection";
import CategorySlider from "@/components/Home/categorySlider/CategorySlider";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import { getCategories } from "@/services/category.services";
import { getProducts } from "@/services/product.services";

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* 1. Full-width Hero Section */}
      <HeroSection />

      {/* 2. Horizontal Carousel of Circular Category Icons */}
      <CategorySlider categories={categories} />

      {/* 3. 4-Column Featured Product Grid */}
      <FeaturedProducts products={products.slice(0, 8)} />
    </div>
  );
}
