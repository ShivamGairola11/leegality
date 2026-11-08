"use client";

import { useSyncExternalStore } from "react";
import { countItems } from "../lib/cart";
import { cartStore } from "../store";

const noopSubscribe = () => () => {};

export function useCart() {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const isReady = useSyncExternalStore(noopSubscribe, () => true, () => false);

  return {
    items,
    isReady,
    count: countItems(items),
    quantityOf: (id: number) => items.find((item) => item.id === id)?.quantity ?? 0,
    add: cartStore.add,
    setQuantity: cartStore.setQuantity,
    remove: cartStore.remove,
  };
}
