import { Suspense } from "react";
import { ProductCatalog } from "@/features/products/components/product-catalog";
import { CatalogSkeleton } from "@/features/products/components/product-skeletons";

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <ProductCatalog searchParams={searchParams} />
    </Suspense>
  );
}
