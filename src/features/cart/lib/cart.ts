/*
 * Pure cart operations. Quantities are always kept between 1 and the lower of
 * the product's stock and MAX_QUANTITY_PER_ITEM; setting 0 removes the line.
 */
import { getSalePrice } from "@/features/products/lib/pricing";
import type { CartItem, CartProduct } from "../types";

export const MAX_QUANTITY_PER_ITEM = 10;

export function getMaxQuantity(product: Pick<CartProduct, "stock">) {
  return Math.max(0, Math.min(product.stock, MAX_QUANTITY_PER_ITEM));
}

function clamp(quantity: number, product: Pick<CartProduct, "stock">) {
  return Math.min(Math.max(0, Math.floor(quantity)), getMaxQuantity(product));
}

export function setItemQuantity(items: CartItem[], id: number, quantity: number) {
  return items.flatMap((item) => {
    if (item.id !== id) return [item];
    const next = clamp(quantity, item);
    return next > 0 ? [{ ...item, quantity: next }] : [];
  });
}

export function addItem(items: CartItem[], product: CartProduct, quantity = 1) {
  const existing = items.find((item) => item.id === product.id);
  if (existing) return setItemQuantity(items, product.id, existing.quantity + quantity);

  const next = clamp(quantity, product);
  if (next === 0) return items;

  const { id, title, price, discountPercentage, thumbnail, stock } = product;
  return [...items, { id, title, price, discountPercentage, thumbnail, stock, quantity: next }];
}

export function removeItem(items: CartItem[], id: number) {
  return items.filter((item) => item.id !== id);
}

export function countItems(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getSubtotal(items: CartItem[]) {
  const cents = items.reduce(
    (sum, item) => sum + Math.round(getSalePrice(item.price, item.discountPercentage) * 100) * item.quantity,
    0,
  );
  return cents / 100;
}
