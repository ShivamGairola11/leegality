/*
 * Reads and updates catalog filters stored in the URL.
 *
 * Category changes go through the router because they need new data from the
 * server. Brand, price, search and page are filtered on the client, so they
 * update the URL with history.replaceState, which is instant and has no
 * server round trip. Next.js keeps useSearchParams in sync either way.
 * useOptimistic makes the controls respond instantly while the URL catches up.
 */
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useOptimistic, useTransition } from "react";
import { DEFAULT_FILTERS } from "../constants";
import { parseFilters, serializeFilters } from "../lib/filters";
import type { ProductFilters, SortOption } from "../types";

export function useProductFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [, startClientTransition] = useTransition();

  const urlFilters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const [filters, setOptimisticFilters] = useOptimistic(urlFilters);

  function navigate(next: ProductFilters) {
    startTransition(() => {
      setOptimisticFilters(next);
      router.push(`${pathname}${serializeFilters(next)}`, { scroll: false });
    });
  }

  function replace(next: ProductFilters) {
    startClientTransition(() => {
      setOptimisticFilters(next);
      window.history.replaceState(null, "", `${pathname}${serializeFilters(next)}`);
    });
  }

  return {
    filters,
    isPending,
    setCategory: (category: string | null) =>
      navigate({ ...filters, category, brands: [], page: 1 }),
    toggleBrand: (brand: string) =>
      replace({
        ...filters,
        brands: filters.brands.includes(brand)
          ? filters.brands.filter((b) => b !== brand)
          : [...filters.brands, brand],
        page: 1,
      }),
    setPriceRange: (minPrice: number | null, maxPrice: number | null) =>
      replace({ ...filters, minPrice, maxPrice, page: 1 }),
    setQuery: (query: string) => replace({ ...filters, query, page: 1 }),
    setSort: (sort: SortOption | null) => replace({ ...filters, sort, page: 1 }),
    setPage: (page: number) => {
      replace({ ...filters, page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    clearFilters: ({ keepQuery = true } = {}) => {
      const next = { ...DEFAULT_FILTERS, query: keepQuery ? filters.query : "", sort: filters.sort };
      if (filters.category) navigate(next);
      else replace(next);
    },
  };
}
