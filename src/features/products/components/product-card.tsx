/*
 * Amazon-style card: no border or shadow, an off-white image well and plain
 * text below, with the cart control outside the link so buttons aren't nested
 * inside an anchor. The image is wrapped in a named ViewTransition that
 * matches the hero image on the detail page, so it morphs into place.
 */
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { Rating } from "@/components/ui/rating";
import { AddToCart } from "@/features/cart/components/add-to-cart";
import { TOP_RATED_THRESHOLD } from "../constants";
import type { ProductSummary } from "../types";
import { PriceTag } from "./price-tag";
import { StockStatus } from "./stock-status";

interface ProductCardProps {
  product: ProductSummary;
  eager?: boolean;
}

export function productImageTransitionName(id: number) {
  return `product-image-${id}`;
}

export function ProductCard({ product, eager = false }: ProductCardProps) {
  return (
    <div className="flex w-full flex-col">
      <Link
        href={`/product/${product.id}`}
        className="group flex flex-1 flex-col rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="relative overflow-hidden rounded-md bg-surface-muted">
          {product.rating >= TOP_RATED_THRESHOLD && (
            <span className="absolute top-2 left-2 z-10 rounded-sm bg-navbar px-1.5 py-0.5 text-[11px] font-medium text-white">
              Top rated
            </span>
          )}
          <ViewTransition name={productImageTransitionName(product.id)} share="morph" default="none">
            <div className="relative aspect-square">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                loading={eager ? "eager" : "lazy"}
                fetchPriority={eager ? "high" : "auto"}
                sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 640px) 30vw, 45vw"
                className="object-contain p-4 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </ViewTransition>
        </div>

        <div className="flex flex-1 flex-col gap-1 pt-3">
          <h3
            className="line-clamp-2 text-sm leading-snug text-slate-900 group-hover:text-primary sm:text-[15px]"
            title={product.title}
          >
            {product.title}
          </h3>
          <Rating value={product.rating} valuePosition="before" />
          <PriceTag
            price={product.price}
            discountPercentage={product.discountPercentage}
            className="mt-1"
          />
          <StockStatus stock={product.stock} variant="text" />
        </div>
      </Link>
      <AddToCart product={product} className="mt-3" />
    </div>
  );
}
