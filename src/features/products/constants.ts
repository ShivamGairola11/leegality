import type { ProductFilters } from "./types";

export const PAGE_SIZE = 25;

export const LOW_STOCK_THRESHOLD = 5;

export const TOP_RATED_THRESHOLD = 4.5;

export const SEARCH_MIN_LENGTH = 3;

export const SEARCH_DEBOUNCE_MS = 300;

export const RELATED_PRODUCTS_LIMIT = 6;

export const PRERENDERED_PRODUCTS = 24;

export const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
  { value: "title", label: "Name: A to Z" },
] as const;

export const DEFAULT_FILTERS: ProductFilters = {
  category: null,
  brands: [],
  minPrice: null,
  maxPrice: null,
  query: "",
  sort: null,
  page: 1,
};

export const FILTER_PARAMS = {
  category: "category",
  brand: "brand",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  query: "q",
  sort: "sort",
  page: "page",
} as const;
