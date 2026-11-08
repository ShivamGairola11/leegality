"use client";

import Image from "next/image";
import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [page, setPage] = useState(1);
  const src = images[page - 1];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="relative mx-auto aspect-square w-full max-w-md xl:max-w-lg">
        {src && (
          <Image
            key={src}
            src={src}
            alt={images.length > 1 ? `${title}, image ${page} of ${images.length}` : title}
            fill
            priority
            sizes="(min-width: 1280px) 512px, (min-width: 768px) 448px, 90vw"
            className="object-contain"
          />
        )}
      </div>
      <Pagination
        label="Product images"
        currentPage={page}
        totalPages={images.length}
        onPageChange={setPage}
        className="mt-auto md:justify-start"
      />
    </div>
  );
}
