/*
 * The URL is the single source of truth for filters. These helpers convert
 * between query params and a typed ProductFilters object, and apply the
 * client-side filters (brand, price, search) to a list of products.
 */
import { DEFAULT_FILTERS, FILTER_PARAMS } from "../constants";
import type { ProductFilters, ProductSummary } from "../types";

interface ReadableParams {
  get(name: string): string | null;
  getAll(name: string): string[];
}

function toPrice(value: string | null) {
  if (value === null || value.trim() === "") return null;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

export function parseFilters(params: ReadableParams): ProductFilters {
  const page = Number(params.get(FILTER_PARAMS.page));

  return {
    category: params.get(FILTER_PARAMS.category) || null,
    brands: params.getAll(FILTER_PARAMS.brand).filter(Boolean),
    minPrice: toPrice(params.get(FILTER_PARAMS.minPrice)),
    maxPrice: toPrice(params.get(FILTER_PARAMS.maxPrice)),
    query: params.get(FILTER_PARAMS.query) ?? "",
    page: Number.isInteger(page) && page > 0 ? page : DEFAULT_FILTERS.page,
  };
}

export function serializeFilters(filters: ProductFilters) {
  const params = new URLSearchParams();

  if (filters.category) params.set(FILTER_PARAMS.category, filters.category);
  filters.brands.forEach((brand) => params.append(FILTER_PARAMS.brand, brand));
  if (filters.minPrice !== null) params.set(FILTER_PARAMS.minPrice, String(filters.minPrice));
  if (filters.maxPrice !== null) params.set(FILTER_PARAMS.maxPrice, String(filters.maxPrice));
  if (filters.query) params.set(FILTER_PARAMS.query, filters.query);
  if (filters.page > 1) params.set(FILTER_PARAMS.page, String(filters.page));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function applyFilters(
  products: ProductSummary[],
  { brands, minPrice, maxPrice, query }: ProductFilters,
) {
  const search = query.trim().toLowerCase();

  return products.filter((product) => {
    if (brands.length > 0 && !(product.brand && brands.includes(product.brand))) return false;
    if (minPrice !== null && product.price < minPrice) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;
    if (search) {
      const haystack = `${product.title} ${product.brand ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export function getBrands(products: ProductSummary[]) {
  const brands = new Set(products.flatMap((product) => (product.brand ? [product.brand] : [])));
  return [...brands].sort((a, b) => a.localeCompare(b));
}

export function countActiveFilters({ category, brands, minPrice, maxPrice }: ProductFilters) {
  return (category ? 1 : 0) + brands.length + (minPrice !== null || maxPrice !== null ? 1 : 0);
}
