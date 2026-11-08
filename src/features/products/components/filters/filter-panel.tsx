/*
 * The search box at the top narrows the category and brand option lists,
 * which helps when a category has dozens of brands.
 */
"use client";

import { useState } from "react";
import { SearchIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import type { Category, ProductFilters } from "../../types";
import { FilterSection } from "./filter-section";
import { OptionList, type Option } from "./option-list";
import { PriceRangeFilter } from "./price-range-filter";

export interface FilterPanelProps {
  categories: Category[];
  brands: string[];
  filters: ProductFilters;
  activeCount: number;
  disabled?: boolean;
  onCategoryChange: (category: string | null) => void;
  onBrandToggle: (brand: string) => void;
  onPriceApply: (minPrice: number | null, maxPrice: number | null) => void;
  onClear: () => void;
}

function matches(options: Option[], query: string) {
  const search = query.trim().toLowerCase();
  return search ? options.filter((option) => option.label.toLowerCase().includes(search)) : options;
}

export function FilterPanel({
  categories,
  brands,
  filters,
  activeCount,
  disabled = false,
  onCategoryChange,
  onBrandToggle,
  onPriceApply,
  onClear,
}: FilterPanelProps) {
  const [optionQuery, setOptionQuery] = useState("");

  const categoryOptions = matches(
    categories.map(({ slug, name }) => ({ value: slug, label: name })),
    optionQuery,
  );
  const brandOptions = matches(
    brands.map((brand) => ({ value: brand, label: brand })),
    optionQuery,
  );

  return (
    <fieldset
      disabled={disabled}
      aria-busy={disabled}
      className="min-w-0 space-y-4 transition-opacity disabled:opacity-60"
    >
      <legend className="sr-only">Product filters</legend>
      <Input
        type="search"
        aria-label="Search filters"
        placeholder="Search..."
        value={optionQuery}
        onChange={(event) => setOptionQuery(event.target.value)}
        icon={<SearchIcon width={16} height={16} />}
      />

      <FilterSection title="Categories">
        <OptionList
          options={categoryOptions}
          selected={filters.category ? [filters.category] : []}
          onToggle={(slug) => onCategoryChange(slug === filters.category ? null : slug)}
          emptyMessage="No matching categories"
        />
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceRangeFilter
          key={`${filters.minPrice}-${filters.maxPrice}`}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onApply={onPriceApply}
        />
      </FilterSection>

      <FilterSection title="Brands">
        <OptionList
          options={brandOptions}
          selected={filters.brands}
          onToggle={onBrandToggle}
          emptyMessage={brands.length ? "No matching brands" : "No brands in this category"}
        />
      </FilterSection>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="w-full border-t border-gray-200 pt-3 text-left text-sm font-medium text-primary hover:underline"
        >
          Clear all filters ({activeCount})
        </button>
      )}
    </fieldset>
  );
}
