/*
 * DummyJSON's `price` is the list price (M.R.P) and `discountPercentage` is
 * taken off it, which is also how its carts API charges. Every price shown,
 * filtered or sorted in the app goes through getSalePrice so they all agree.
 */
import { LOW_STOCK_THRESHOLD } from "../constants";

export function getDiscount(discountPercentage: number) {
  return Math.round(discountPercentage);
}

export function getSalePrice(price: number, discountPercentage: number) {
  return Math.round(price * (1 - discountPercentage / 100) * 100) / 100;
}

export type StockLevel = "out" | "low" | "in";

export function getStockLevel(stock: number): StockLevel {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}
