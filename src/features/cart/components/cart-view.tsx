"use client";

import Link from "next/link";
import { CartIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "../hooks/use-cart";
import { CartLine } from "./cart-line";
import { CartSummary } from "./cart-summary";

function CartSkeleton() {
  return (
    <div role="status" aria-label="Loading cart" className="space-y-5">
      {[0, 1].map((row) => (
        <div key={row} className="flex gap-4">
          <Skeleton className="size-24 sm:size-36" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartView() {
  const { items, count, isReady, setQuantity, remove } = useCart();

  return (
    <div className="flex-1 px-4 py-6 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Shopping Cart</h1>

      {!isReady ? (
        <CartSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<CartIcon width={44} height={44} strokeWidth={1.5} />}
          title="Your cart is empty"
          description="Browse the catalog and add something you like."
          action={
            <Link href="/" className={buttonStyles({ variant: "cta", shape: "pill", size: "lg" })}>
              Continue shopping
            </Link>
          }
          className="rounded-lg bg-surface-muted"
        />
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          <section aria-label="Cart items">
            <ul className="space-y-6">
              {items.map((item) => (
                <CartLine
                  key={item.id}
                  item={item}
                  onQuantityChange={(quantity) => setQuantity(item.id, quantity)}
                  onRemove={() => remove(item.id)}
                />
              ))}
            </ul>
          </section>
          <CartSummary items={items} count={count} />
        </div>
      )}
    </div>
  );
}
