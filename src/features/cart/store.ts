/*
 * Client-side cart store persisted to localStorage. It's read through
 * useSyncExternalStore, so the server render and hydration see an empty cart
 * and the saved cart appears right after, without hydration mismatches.
 * Changes made in another tab are picked up through the `storage` event.
 */
import { addItem, removeItem, setItemQuantity } from "./lib/cart";
import type { CartItem, CartProduct } from "./types";

const STORAGE_KEY = "cart:v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function write(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be full or blocked (private mode); the cart still works in memory.
  }
  emit();
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  items = read();
  emit();
}

function getSnapshot() {
  if (!hydrated) {
    hydrated = true;
    items = read();
  }
  return items;
}

export const cartStore = {
  subscribe(listener: () => void) {
    if (listeners.size === 0) window.addEventListener("storage", onStorage);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot,
  getServerSnapshot: () => EMPTY,
  add: (product: CartProduct, quantity = 1) => write(addItem(getSnapshot(), product, quantity)),
  setQuantity: (id: number, quantity: number) => write(setItemQuantity(getSnapshot(), id, quantity)),
  remove: (id: number) => write(removeItem(getSnapshot(), id)),
};
