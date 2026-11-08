import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/features/products/api/products";
import { ProductDetail } from "@/features/products/components/detail/product-detail";

export async function generateMetadata({ params }: PageProps<"/product/[id]">): Promise<Metadata> {
  const product = await getProduct((await params).id);
  return product
    ? { title: product.title, description: product.description }
    : { title: "Product not found" };
}

export default async function ProductPage({ params }: PageProps<"/product/[id]">) {
  const product = await getProduct((await params).id);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
