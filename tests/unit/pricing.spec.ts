import { expect, test } from "@playwright/test";
import { getDiscount, getOriginalPrice, getStockLevel } from "@/features/products/lib/pricing";

test("getOriginalPrice reverses the discount", () => {
  expect(getOriginalPrice(9.99, 10.48)).toBe(11.16);
  expect(getOriginalPrice(100, 0)).toBe(100);
});

test("getDiscount rounds to a whole percent", () => {
  expect(getDiscount(10.48)).toBe(10);
  expect(getDiscount(0.04)).toBe(0);
});

test("getStockLevel buckets stock counts", () => {
  expect(getStockLevel(0)).toBe("out");
  expect(getStockLevel(5)).toBe("low");
  expect(getStockLevel(6)).toBe("in");
});
