import Image from "next/image";
import Link from "next/link";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils";
import type { ProductSummary } from "../types";

interface ProductCardProps {
  product: ProductSummary;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="mx-3 border-b border-gray-100 pt-3">
        <div className="relative aspect-square">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 220px, (min-width: 640px) 30vw, 45vw"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-slate-800" title={product.title}>
          {product.title}
        </h3>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-base font-semibold text-slate-900">{formatPrice(product.price)}</span>
          <Rating value={product.rating} />
        </div>
      </div>
    </Link>
  );
}
