"use client";

import Image from "next/image";
import { useState, ViewTransition } from "react";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { productImageTransitionName } from "../product-card";

interface ProductGalleryProps {
  productId: number;
  images: string[];
  title: string;
}

export function ProductGallery({ productId, images, title }: ProductGalleryProps) {
  const [page, setPage] = useState(1);
  const src = images[page - 1];
  const hasMany = images.length > 1;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <ViewTransition name={productImageTransitionName(productId)} share="morph" default="none">
        <div className="relative mx-auto aspect-square w-full max-w-md xl:max-w-lg">
          {src && (
            <Image
              key={src}
              src={src}
              alt={hasMany ? `${title}, image ${page} of ${images.length}` : title}
              fill
              priority
              sizes="(min-width: 1280px) 512px, (min-width: 768px) 448px, 90vw"
              className="animate-fade-in object-contain"
            />
          )}
        </div>
      </ViewTransition>

      {hasMany && (
        <ul aria-label="Choose image" className="flex justify-center gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => {
            const active = page === index + 1;
            return (
              <li key={image} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setPage(index + 1)}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative block size-14 overflow-hidden rounded-md border-2 bg-white transition sm:size-16",
                    active ? "border-primary" : "border-gray-200 opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={image} alt="" fill sizes="64px" className="object-contain p-1" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Pagination
        label="Product images"
        currentPage={page}
        totalPages={images.length}
        onPageChange={setPage}
      />
    </div>
  );
}
