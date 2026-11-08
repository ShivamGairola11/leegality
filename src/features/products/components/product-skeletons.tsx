import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SIZE } from "../constants";
import { productGridClassName } from "./product-grid";

export function ProductGridSkeleton({ count = PAGE_SIZE }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading products" className={productGridClassName}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/3" />
          <Skeleton className="mt-2 h-6 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function FilterPanelSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-full" />
      {[6, 2, 5].map((rows, section) => (
        <div key={section} className="space-y-2.5">
          <Skeleton className="h-4 w-24" />
          {Array.from({ length: rows }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="flex gap-6 px-4 py-4 sm:px-6 lg:py-6">
      <aside className="hidden w-60 shrink-0 lg:block">
        <FilterPanelSkeleton />
      </aside>
      <div className="min-w-0 flex-1 space-y-4">
        <Skeleton className="h-6 w-24" />
        <ProductGridSkeleton />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="flex-1 px-4 py-4 sm:px-6 lg:py-6">
      <Skeleton className="mb-6 h-5 w-64" />
      <div
        role="status"
        aria-label="Loading product"
        className="grid gap-8 md:grid-cols-2 lg:gap-12"
      >
        <div className="space-y-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="mx-auto aspect-square w-full max-w-md" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="mt-6 h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}
