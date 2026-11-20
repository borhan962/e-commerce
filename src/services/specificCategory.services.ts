import { ICategory } from "@/interfaces/category.interface";
import { IProduct } from "@/interfaces/product.interface";

export async function getSpecificCategory(id: string): Promise<ICategory | null> {
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`Category API responded with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.warn("Could not connect to category service:", error);
    return null;
  }
}

// Alias for backward compatibility
export const getSpecificCategories = getSpecificCategory;

export async function getProductsByCategory(categoryId: string): Promise<IProduct[]> {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products?category[in]=${categoryId}`,
      {
        cache: "force-cache",
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    if (data?.data && Array.isArray(data.data)) {
      return data.data.map((p: any) => ({
        _id: p._id || p.id,
        id: p._id || p.id,
        title: p.title || "Product",
        slug: p.slug,
        description: p.description || "",
        price: p.price || 99,
        originalPrice: p.price ? Math.round(p.price * 1.25) : 129,
        ratingsAverage: p.ratingsAverage || 4.8,
        ratingsQuantity: p.ratingsQuantity || 50,
        category: p.category || { name: "Category" },
        imageCover: p.imageCover,
        images: p.images?.length ? p.images : [p.imageCover],
        colors: ["#111827", "#4F46E5", "#10B981"],
        sizes: ["S", "M", "L", "XL"],
        inStock: (p.quantity ?? 10) > 0,
      }));
    }

    return [];
  } catch (error) {
    console.warn("Could not fetch products for category:", error);
    return [];
  }
}
