/*
 * Asks the carts API to price the current cart whenever its lines change.
 * The previous result stays on screen (marked stale) while a new one loads,
 * and in-flight requests are aborted when the cart changes again.
 */
"use client";

import { useEffect, useState } from "react";
import { priceCart } from "../api/carts";
import type { CartItem, PricedCart } from "../types";

interface PricingState {
  key: string;
  data?: PricedCart;
  failed?: boolean;
}

function toKey(items: CartItem[]) {
  return items.map(({ id, quantity }) => `${id}:${quantity}`).join(",");
}

function fromKey(lines: string) {
  return lines.split(",").map((line) => {
    const [id, quantity] = line.split(":").map(Number);
    return { id, quantity };
  });
}

export function useCartPricing(items: CartItem[]) {
  const lines = toKey(items);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<PricingState>({ key: "" });
  const key = `${lines}#${attempt}`;

  useEffect(() => {
    if (!lines) return;
    const controller = new AbortController();
    const requestKey = `${lines}#${attempt}`;

    priceCart(fromKey(lines), controller.signal)
      .then((data) => setState({ key: requestKey, data }))
      .catch(() => {
        if (!controller.signal.aborted) {
          setState((previous) => ({ key: requestKey, data: previous.data, failed: true }));
        }
      });

    return () => controller.abort();
  }, [lines, attempt]);

  const isCurrent = state.key === key;

  return {
    data: state.data,
    isLoading: lines !== "" && !isCurrent,
    isError: isCurrent && state.failed === true,
    retry: () => setAttempt((value) => value + 1),
  };
}
