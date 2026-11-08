import { expect, test } from "@playwright/test";
import { DEFAULT_FILTERS } from "@/features/products/constants";
import {
  applyFilters,
  countActiveFilters,
  getBrands,
  parseFilters,
  serializeFilters,
} from "@/features/products/lib/filters";
import type { ProductSummary } from "@/features/products/types";

const product = (overrides: Partial<ProductSummary>): ProductSummary => ({
  id: 1,
  title: "Item",
  price: 10,
  rating: 4,
  thumbnail: "",
  category: "misc",
  ...overrides,
});

const products = [
  product({ id: 1, title: "iPhone 6", brand: "Apple", price: 299 }),
  product({ id: 2, title: "iPhone X", brand: "Apple", price: 899 }),
  product({ id: 3, title: "Galaxy S8", brand: "Samsung", price: 499 }),
  product({ id: 4, title: "Plain Rice", price: 5 }),
];

test.describe("parseFilters / serializeFilters", () => {
  test("round-trips every filter through the URL", () => {
    const filters = {
      category: "smartphones",
      brands: ["Apple", "Samsung"],
      minPrice: 100,
      maxPrice: 500,
      query: "phone",
      page: 3,
    };
    const query = serializeFilters(filters);

    expect(query).toBe(
      "?category=smartphones&brand=Apple&brand=Samsung&minPrice=100&maxPrice=500&q=phone&page=3",
    );
    expect(parseFilters(new URLSearchParams(query))).toEqual(filters);
  });

  test("falls back to defaults for missing or invalid values", () => {
    const params = new URLSearchParams("minPrice=abc&maxPrice=-5&page=0");
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

test("getBrands returns unique, sorted brands and skips missing ones", () => {
  expect(getBrands(products)).toEqual(["Apple", "Samsung"]);
});

test("countActiveFilters counts the price range once", () => {
  expect(
    countActiveFilters({ ...DEFAULT_FILTERS, category: "x", brands: ["a", "b"], minPrice: 1, maxPrice: 9 }),
  ).toBe(4);
});
