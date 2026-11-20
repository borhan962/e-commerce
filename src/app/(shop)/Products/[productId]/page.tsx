import React from "react";
import ProductDetailView from "@/components/Products/ProductDetailView";
import { getProductById } from "@/services/product.services";
import { notFound } from "next/navigation";

interface ProductDetailsPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
