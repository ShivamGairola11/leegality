/*
 * The image is wrapped in a named ViewTransition that matches the hero image
 * on the detail page, so it morphs into place when the card is opened.
 */
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { getDiscount } from "../lib/pricing";
import type { ProductSummary } from "../types";
import { PriceTag } from "./price-tag";
import { StockStatus } from "./stock-status";

interface ProductCardProps {
  product: ProductSummary;
  priority?: boolean;
}

export function productImageTransitionName(id: number) {
  return `product-image-${id}`;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const discount = getDiscount(product.discountPercentage);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="relative mx-3 border-b border-gray-100 pt-3">
        {discount > 0 && (
          <Badge tone="deal" className="absolute top-3 left-0 z-10">
            -{discount}%
          </Badge>
        )}
        <ViewTransition name={productImageTransitionName(product.id)} share="morph" default="none">
          <div className="relative aspect-square">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              priority={priority}
              sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 640px) 30vw, 45vw"
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </ViewTransition>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-slate-800" title={product.title}>
          {product.title}
        </h3>
        <PriceTag price={product.price} discountPercentage={product.discountPercentage} />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <Rating value={product.rating} />
          <StockStatus stock={product.stock} hideWhenInStock />
        </div>
      </div>
    </Link>
  );
}
