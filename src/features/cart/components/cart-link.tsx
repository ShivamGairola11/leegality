"use client";

import Link from "next/link";
import { CartIcon } from "@/components/icons";
import { useCart } from "../hooks/use-cart";

export function CartLink() {
  const { count } = useCart();
  const label = count > 99 ? "99+" : String(count);

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="flex h-11 items-end gap-0.5 rounded-md px-2 pb-1 text-white hover:outline hover:outline-1 hover:outline-white/70 focus-visible:outline-2 focus-visible:outline-white"
    >
      <span className="relative">
        <CartIcon width={30} height={30} strokeWidth={1.75} />
        <span
          aria-hidden="true"
          className="absolute -top-1.5 left-[55%] -translate-x-1/2 text-base leading-none font-bold text-cart-count"
        >
          {label}
        </span>
      </span>
      <span aria-hidden="true" className="text-sm font-bold max-sm:hidden">
        Cart
      </span>
    </Link>
  );
}
