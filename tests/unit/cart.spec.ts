import { expect, test } from "@playwright/test";
import {
  MAX_QUANTITY_PER_ITEM,
  addItem,
  countItems,
  getMaxQuantity,
  removeItem,
  setItemQuantity,
} from "@/features/cart/lib/cart";
import type { CartProduct } from "@/features/cart/types";

const product = (overrides: Partial<CartProduct> = {}): CartProduct => ({
  id: 1,
  title: "Item",
  price: 10,
  discountPercentage: 0,
  thumbnail: "",
  stock: 50,
  ...overrides,
});

test("addItem adds a new line, then increases its quantity", () => {
  let items = addItem([], product());
  expect(items).toEqual([{ ...product(), quantity: 1 }]);

  items = addItem(items, product(), 2);
  expect(items[0].quantity).toBe(3);
});

test("addItem only keeps the fields the cart needs", () => {
  const items = addItem([], { ...product(), rating: 5, brand: "X" } as CartProduct);
  expect(Object.keys(items[0]).sort()).toEqual(
    ["discountPercentage", "id", "price", "quantity", "stock", "thumbnail", "title"].sort(),
  );
});

test("quantities are capped by stock and the per-item limit", () => {
  expect(getMaxQuantity(product({ stock: 3 }))).toBe(3);
  expect(getMaxQuantity(product({ stock: 500 }))).toBe(MAX_QUANTITY_PER_ITEM);

  const items = addItem([], product({ stock: 3 }), 5);
  expect(items[0].quantity).toBe(3);
  expect(addItem([], product({ stock: 0 }))).toEqual([]);
});

test("setItemQuantity updates, clamps and removes at zero", () => {
  const items = addItem([], product());
  expect(setItemQuantity(items, 1, 4)[0].quantity).toBe(4);
  expect(setItemQuantity(items, 1, 99)[0].quantity).toBe(MAX_QUANTITY_PER_ITEM);
  expect(setItemQuantity(items, 1, 0)).toEqual([]);
});

test("removeItem and countItems", () => {
  const items = addItem(addItem([], product({ id: 1 }), 2), product({ id: 2 }), 3);
  expect(countItems(items)).toBe(5);
  expect(removeItem(items, 1).map((item) => item.id)).toEqual([2]);
});
