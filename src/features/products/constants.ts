import type { ProductFilters } from "./types";

export const PAGE_SIZE = 12;

export const DEFAULT_FILTERS: ProductFilters = {
  category: null,
  brands: [],
  minPrice: null,
  maxPrice: null,
  query: "",
  page: 1,
};

export const FILTER_PARAMS = {
  category: "category",
  brand: "brand",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  query: "q",
  page: "page",
} as const;
