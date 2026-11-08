import { expect, test } from "@playwright/test";
import { getDiscount, getSalePrice, getStockLevel } from "@/features/products/lib/pricing";

test("getSalePrice takes the discount off the list price, like the carts API", () => {
  expect(getSalePrice(9.99, 10.48)).toBe(8.94);
  expect(getSalePrice(199.99, 12.91)).toBe(174.17);
  expect(getSalePrice(100, 0)).toBe(100);
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
