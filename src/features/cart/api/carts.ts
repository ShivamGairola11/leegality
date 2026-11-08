/*
 * DummyJSON's POST /carts/add prices a cart server-side (list total and
 * discounted total) without saving it, so it's used to confirm totals for
 * whatever is in the local cart.
 */
import { apiFetch } from "@/lib/api-client";
import type { PricedCart } from "../types";

export const DEMO_USER_ID = 1;

export interface CartLineInput {
  id: number;
  quantity: number;
}

export function priceCart(products: CartLineInput[], signal?: AbortSignal) {
  return apiFetch<PricedCart>("/carts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: DEMO_USER_ID, products }),
    signal,
  });
}
