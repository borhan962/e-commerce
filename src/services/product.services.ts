import { IProduct } from "@/interfaces/product.interface";

// export const fallbackProducts: IProduct[] = [
//   {
//     _id: "prod_1",
//     id: "prod_1",
//     title: "Minimalist Studio Wireless Headphones",
//     slug: "minimalist-studio-wireless-headphones",
//     description:
//       "Engineered with active noise cancellation, premium titanium acoustic drivers, and 40-hour continuous playback. Ergonomic memory foam earcups ensure plush all-day comfort.",
//     price: 249,
//     originalPrice: 299,
//     ratingsAverage: 4.9,
//     ratingsQuantity: 128,
//     category: { _id: "cat_7", name: "Audio & Sound" },
//     imageCover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
//     images: [
//       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80",
//     ],
//     colors: ["#111827", "#4F46E5", "#E5E7EB", "#F59E0B"],
//     sizes: ["Standard", "Pro Cushioned"],
//     inStock: true,
//   },
//   {
//     _id: "prod_2",
//     id: "prod_2",
//     title: "Monochrome Minimalist Chronograph Watch",
//     slug: "monochrome-minimalist-chronograph-watch",
//     description:
//       "Crafted with surgical-grade 316L stainless steel, scratch-resistant sapphire crystal glass, and Japanese quartz movement. Water-resistant up to 5 ATM.",
//     price: 189,
//     originalPrice: 220,
//     ratingsAverage: 4.8,
//     ratingsQuantity: 84,
//     category: { _id: "cat_5", name: "Watches & Jewelry" },
//     imageCover: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
//     images: [
//       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1000&q=80",
//     ],
//     colors: ["#111827", "#9CA3AF", "#D97706"],
//     sizes: ["38mm", "42mm"],
//     inStock: true,
//   },
//   {
//     _id: "prod_3",
//     id: "prod_3",
//     title: "Urban Everyday Leather Backpack",
//     slug: "urban-everyday-leather-backpack",
//     description:
//       "Handcrafted from full-grain vegetable-tanned leather. Includes a dedicated padded 16-inch laptop compartment, weather-sealed YKK zips, and discreet luggage passthrough.",
//     price: 165,
//     originalPrice: 195,
//     ratingsAverage: 4.7,
//     ratingsQuantity: 96,
//     category: { _id: "cat_6", name: "Bags & Luggage" },
//     imageCover: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
//     images: [
//       "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=1000&q=80",
//     ],
//     colors: ["#78350F", "#111827", "#6B7280"],
//     sizes: ["18L", "24L"],
//     inStock: true,
//   },
//   {
//     _id: "prod_4",
//     id: "prod_4",
//     title: "SpeedFlow Lightweight Runner Sneakers",
//     slug: "speedflow-lightweight-runner-sneakers",
//     description:
//       "Ultra-responsive responsive foam midsole coupled with an engineered knit upper. Delivers featherlight breathability and superior propulsion on city roads.",
//     price: 135,
//     originalPrice: 160,
//     ratingsAverage: 4.9,
//     ratingsQuantity: 215,
//     category: { _id: "cat_4", name: "Footwear" },
//     imageCover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
//     images: [
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80",
//     ],
//     colors: ["#EF4444", "#111827", "#4F46E5", "#10B981"],
//     sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
//     inStock: true,
//   },
//   {
//     _id: "prod_5",
//     id: "prod_5",
//     title: "Aura Smart Ambient Speaker",
//     slug: "aura-smart-ambient-speaker",
//     description:
//       "High-fidelity 360-degree spatial sound with integrated voice intelligence and soothing ambient mood lighting. Multi-room sync via Wi-Fi 6.",
//     price: 219,
//     originalPrice: 250,
//     ratingsAverage: 4.8,
//     ratingsQuantity: 73,
//     category: { _id: "cat_3", name: "Electronics" },
//     imageCover: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=80",
//     images: [
//       "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1000&q=80",
//     ],
//     colors: ["#FFFFFF", "#111827", "#6366F1"],
//     sizes: ["Standard", "Max Pro"],
//     inStock: true,
//   },
//   {
//     _id: "prod_6",
//     id: "prod_6",
//     title: "Tailored Linen Blend Overshirt",
//     slug: "tailored-linen-blend-overshirt",
//     description:
//       "Relaxed contemporary silhouette tailored from premium European organic flax linen. Breathable natural texture suited for seamless seasonal layering.",
//     price: 95,
//     originalPrice: 120,
//     ratingsAverage: 4.6,
//     ratingsQuantity: 52,
//     category: { _id: "cat_2", name: "Men's Fashion" },
//     imageCover: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
//     images: [
//       "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
//     ],
//     colors: ["#D4D4D8", "#1E293B", "#10B981"],
//     sizes: ["S", "M", "L", "XL"],
//     inStock: true,
//   },
//   {
//     _id: "prod_7",
//     id: "prod_7",
//     title: "Ceramic Aroma Diffuser & Humidifier",
//     slug: "ceramic-aroma-diffuser-humidifier",
//     description:
//       "Matte stoneware ceramic exterior with whisper-quiet ultrasonic atomization. Features auto shut-off, warm LED ambient glow, and 12-hour continuous misting.",
//     price: 78,
//     originalPrice: 95,
//     ratingsAverage: 4.9,
//     ratingsQuantity: 110,
//     category: { _id: "cat_8", name: "Home & Decor" },
//     imageCover: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80",
//     images: [
//       "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
//     ],
//     colors: ["#F9FAFB", "#374151", "#F59E0B"],
//     sizes: ["300ml", "500ml"],
//     inStock: true,
//   },
//   {
//     _id: "prod_8",
//     id: "prod_8",
//     title: "Silk Touch Cashmere Scarf",
//     slug: "silk-touch-cashmere-scarf",
//     description:
//       "Woven from Grade-A Mongolian cashmere with delicate fringed edges. Luxuriously soft, lightweight yet impeccably insulating for any wardrobe.",
//     price: 110,
//     originalPrice: 140,
//     ratingsAverage: 4.7,
//     ratingsQuantity: 64,
//     category: { _id: "cat_1", name: "Women's Fashion" },
//     imageCover: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80",
//     images: [
//       "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
//       "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80",
//     ],
//     colors: ["#4F46E5", "#10B981", "#111827", "#F3F4F6"],
//     sizes: ["One Size"],
//     inStock: true,
//   },
// ];

export async function getProducts() {
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    // if (!response.ok) {
    //   return fallbackProducts;
    // }

    const data = await response.json();
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      // Map and supplement with fallback attributes if missing
      return data.data.map((p: any) => ({
        _id: p._id || p.id,
        id: p._id || p.id,
        title: p.title || "Modern Product",
        slug: p.slug,
        description: p.description || "High quality product crafted with precision.",
        price: p.price || 99,
        originalPrice: p.price ? Math.round(p.price * 1.25) : 129,
        ratingsAverage: p.ratingsAverage || 4.8,
        ratingsQuantity: p.ratingsQuantity || 50,
        category: p.category || { name: "Category" },
        imageCover: p.imageCover,
        images: p.images,
        colors: ["#111827", "#4F46E5", "#10B981", "#E5E7EB"],
        sizes: ["S", "M", "L", "XL"],
        inStock: (p.quantity ?? 10) > 0,
      }));
    }

    // return fallbackProducts;
  } catch (error) {
    // console.warn("Could not connect to products API, using fallback catalog:", error);
    // return fallbackProducts;
  }
}

export async function getProductById(id: string) {
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
    if (response.ok) {
      const data = await response.json();
      if (data?.data) {
        const p = data.data;
        return {
          _id: p._id || p.id,
          id: p._id || p.id,
          title: p.title || "Modern Product",
          slug: p.slug,
          description: p.description || "High quality product crafted with precision.",
          price: p.price || 99,
          originalPrice: p.price ? Math.round(p.price * 1.25) : 129,
          ratingsAverage: p.ratingsAverage || 4.8,
          ratingsQuantity: p.ratingsQuantity || 50,
          category: p.category || { name: "General" },
          imageCover: p.imageCover,
          images: p.images && p.images.length > 0 ? p.images : [p.imageCover],
          colors: ["#111827", "#4F46E5", "#10B981", "#E5E7EB"],
          sizes: ["Standard", "Pro", "Max"],
          inStock: (p.quantity ?? 10) > 0,
        };
      }
    }
  } catch (error) {
    // fallback below
  }



}

