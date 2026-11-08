/*
 * Navbar search. On the catalog it filters live as you type; on any other
 * page, submitting takes you back to the catalog with the query applied.
 */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { DEFAULT_FILTERS } from "../constants";
import { useProductFilters } from "../hooks/use-product-filters";
import { serializeFilters } from "../lib/filters";

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

  function handleChange(next: string) {
    setValue(next);
    if (isCatalog) setQuery(next);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isCatalog) router.push(`/${serializeFilters({ ...DEFAULT_FILTERS, query: value.trim() })}`);
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <Input
        type="search"
        aria-label="Search products"
        placeholder="Search products..."
        value={value}
        onChange={(event) => handleChange(event.target.value)}
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
