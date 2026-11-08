import { expect, test } from "@playwright/test";
import { getPageRange, paginate } from "@/lib/pagination";

test.describe("getPageRange", () => {
  test("lists every page when there are few", () => {
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test("collapses the end when near the start", () => {
    expect(getPageRange(2, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
  });

  test("collapses both sides in the middle", () => {
    expect(getPageRange(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
  });

  test("collapses the start when near the end", () => {
    expect(getPageRange(19, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
  });
});

test.describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  test("returns the requested slice", () => {
    expect(paginate(items, 2, 10)).toEqual({
      items: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      currentPage: 2,
      totalPages: 3,
    });
  });

  test("clamps out-of-range pages", () => {
    expect(paginate(items, 99, 10).currentPage).toBe(3);
    expect(paginate([], 4, 10)).toEqual({ items: [], currentPage: 1, totalPages: 1 });
  });
});
