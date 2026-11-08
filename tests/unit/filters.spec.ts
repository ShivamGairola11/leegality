import { expect, test } from "@playwright/test";
import { DEFAULT_FILTERS } from "@/features/products/constants";
import {
  applyFilters,
  countActiveFilters,
  getBrands,
  parseFilters,
  serializeFilters,
  sortProducts,
} from "@/features/products/lib/filters";
import type { ProductFilters, ProductSummary } from "@/features/products/types";

const product = (overrides: Partial<ProductSummary>): ProductSummary => ({
  id: 1,
  title: "Item",
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock: 10,
  thumbnail: "",
  category: "misc",
  ...overrides,
});

const products = [
  product({ id: 1, title: "iPhone 6", brand: "Apple", price: 299, rating: 3.4, discountPercentage: 2 }),
  product({ id: 2, title: "iPhone X", brand: "Apple", price: 899, rating: 2.5, discountPercentage: 15 }),
  product({ id: 3, title: "Galaxy S8", brand: "Samsung", price: 499, rating: 4.4, discountPercentage: 8 }),
  product({ id: 4, title: "Plain Rice", price: 5, rating: 4.1 }),
];

test.describe("parseFilters / serializeFilters", () => {
  test("round-trips every filter through the URL", () => {
    const filters: ProductFilters = {
      category: "smartphones",
      brands: ["Apple", "Samsung"],
      minPrice: 100,
      maxPrice: 500,
      query: "phone",
      sort: "price-asc",
      page: 3,
    };
    const query = serializeFilters(filters);

    expect(query).toBe(
      "?category=smartphones&brand=Apple&brand=Samsung&minPrice=100&maxPrice=500&q=phone&sort=price-asc&page=3",
    );
    expect(parseFilters(new URLSearchParams(query))).toEqual(filters);
  });

  test("falls back to defaults for missing or invalid values", () => {
    const params = new URLSearchParams("minPrice=abc&maxPrice=-5&page=0&sort=cheapest");
    expect(parseFilters(params)).toEqual(DEFAULT_FILTERS);
    expect(serializeFilters(DEFAULT_FILTERS)).toBe("");
  });
});

test.describe("applyFilters", () => {
  test("combines brand, price and search", () => {
    const result = applyFilters(products, {
      ...DEFAULT_FILTERS,
      brands: ["Apple"],
      maxPrice: 500,
      query: " iphone ",
    });
    expect(result.map((p) => p.id)).toEqual([1]);
  });

  test("excludes products without a brand when a brand is selected", () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, brands: ["Samsung"] });
    expect(result.map((p) => p.id)).toEqual([3]);
  });

  test("keeps everything when no filters are set", () => {
    expect(applyFilters(products, DEFAULT_FILTERS)).toHaveLength(products.length);
  });
});

test.describe("sortProducts", () => {
  const ids = (sort: ProductFilters["sort"]) => sortProducts(products, sort).map((p) => p.id);

  test("sorts by each option", () => {
    expect(ids("price-asc")).toEqual([4, 1, 3, 2]);
    expect(ids("price-desc")).toEqual([2, 3, 1, 4]);
    expect(ids("rating")).toEqual([3, 4, 1, 2]);
    expect(ids("discount")).toEqual([2, 3, 1, 4]);
    expect(ids("title")).toEqual([3, 1, 2, 4]);
  });

  test("keeps the API order and doesn't mutate the input", () => {
    expect(ids(null)).toEqual([1, 2, 3, 4]);
    sortProducts(products, "price-asc");
    expect(products.map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });
});

test("getBrands returns unique, sorted brands and skips missing ones", () => {
  expect(getBrands(products)).toEqual(["Apple", "Samsung"]);
});

test("countActiveFilters counts the price range once", () => {
  expect(
    countActiveFilters({ ...DEFAULT_FILTERS, category: "x", brands: ["a", "b"], minPrice: 1, maxPrice: 9 }),
  ).toBe(4);
});
