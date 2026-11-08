/*
 * Navbar search. On the catalog it filters as you type, debounced, and only
 * once the query has at least SEARCH_MIN_LENGTH characters; Enter applies it
 * straight away. On any other page, Enter takes you back to the catalog with
 * the query applied.
 */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { DEFAULT_FILTERS, SEARCH_DEBOUNCE_MS } from "../constants";
import { useProductFilters } from "../hooks/use-product-filters";
import { serializeFilters, toSearchQuery } from "../lib/filters";

const inputClassName = "h-9 border-transparent bg-white";

export function ProductSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const { filters, setQuery } = useProductFilters();
  const isCatalog = pathname === "/";

  const [value, setValue] = useState(filters.query);
  const [syncedQuery, setSyncedQuery] = useState(filters.query);

  if (filters.query !== syncedQuery) {
    setSyncedQuery(filters.query);
    setValue(filters.query);
  }

  function commit(input: string) {
    const query = toSearchQuery(input);
    if (query === syncedQuery) return;
    setSyncedQuery(query);
    setQuery(query);
  }

  const commitLatest = useEffectEvent(commit);

  useEffect(() => {
    if (!isCatalog) return;
    const timer = setTimeout(() => commitLatest(value), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, isCatalog]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCatalog) {
      commit(value);
      return;
    }
    const query = toSearchQuery(value);
    router.push(`/${serializeFilters({ ...DEFAULT_FILTERS, query })}`);
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <Input
        type="search"
        aria-label="Search products"
        placeholder="Search products..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        icon={<SearchIcon width={16} height={16} />}
        className={inputClassName}
      />
    </form>
  );
}

export function ProductSearchFallback() {
  return (
    <Input
      type="search"
      aria-label="Search products"
      placeholder="Search products..."
      disabled
      icon={<SearchIcon width={16} height={16} />}
      className={inputClassName}
    />
  );
}
