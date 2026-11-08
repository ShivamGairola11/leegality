"use client";

import { useEffect, useMemo } from "react";
import { AlertIcon, SearchIcon } from "@/components/icons";
import { useSidebar } from "@/components/layout/sidebar-provider";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { paginate } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { PAGE_SIZE } from "../constants";
import { useProductFilters } from "../hooks/use-product-filters";
import { markCatalogVisited } from "../lib/catalog-history";
import { applyFilters, countActiveFilters, getBrands } from "../lib/filters";
import type { Category, ProductSummary } from "../types";
import { FilterPanel, type FilterPanelProps } from "./filters/filter-panel";
import { ProductGrid } from "./product-grid";
import { ProductGridSkeleton } from "./product-skeletons";

interface ProductBrowserProps {
  categories: Category[];
  products: ProductSummary[];
}

export function ProductBrowser({ categories, products }: ProductBrowserProps) {
  const { filters, isPending, setCategory, toggleBrand, setPriceRange, setPage, clearFilters } =
    useProductFilters();
  const { isDesktopOpen, isMobileOpen, toggle, closeMobile } = useSidebar();

  const brands = useMemo(() => getBrands(products), [products]);
  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);
  const { items, currentPage, totalPages } = paginate(filtered, filters.page, PAGE_SIZE);
  const activeCount = countActiveFilters(filters);

  useEffect(markCatalogVisited, []);

  const panelProps: FilterPanelProps = {
    categories,
    brands,
    filters,
    activeCount,
    disabled: isPending,
    onCategoryChange: setCategory,
    onBrandToggle: toggleBrand,
    onPriceApply: setPriceRange,
    onClear: clearFilters,
  };

  return (
    <div className="flex gap-6 px-4 py-4 sm:px-6 lg:py-6">
      <aside
        aria-label="Filters"
        className={cn("hidden w-60 shrink-0", isDesktopOpen && "lg:block")}
      >
        <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <FilterPanel {...panelProps} />
        </div>
      </aside>

      <Drawer open={isMobileOpen} onClose={closeMobile} title="Filters">
        <FilterPanel {...panelProps} />
      </Drawer>

      <section aria-labelledby="catalog-heading" className="min-w-0 flex-1">
        <h1 id="catalog-heading" className="sr-only">
          Products
        </h1>

        <div className="mb-4 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={toggle}
            aria-expanded={isDesktopOpen}
            className="-ml-3 font-semibold text-slate-800"
          >
            <SearchIcon width={18} height={18} />
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-xs leading-5 text-white">
                {activeCount}
              </span>
            )}
          </Button>
          <p aria-live="polite" className="text-sm text-slate-500">
            {isPending ? "Loading…" : `${filtered.length} products`}
          </p>
        </div>

        {isPending ? (
          <ProductGridSkeleton />
        ) : items.length > 0 ? (
          <>
            <ProductGrid products={items} />
            <Pagination
              className="mt-6"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            icon={<AlertIcon width={36} height={36} />}
            title="No products found"
            description="Try a different search, or loosen the price range and brand filters."
            action={
              activeCount > 0 && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )
            }
            className="rounded-lg border border-dashed border-gray-300 bg-white"
          />
        )}
      </section>
    </div>
  );
}
