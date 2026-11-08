"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toaster";
import { cn, formatPrice } from "@/lib/utils";
import { useCartPricing } from "../hooks/use-cart-pricing";
import type { CartItem } from "../types";

interface CartSummaryProps {
  items: CartItem[];
  count: number;
}

export function CartSummary({ items, count }: CartSummaryProps) {
  const { data, isLoading, isError, retry } = useCartPricing(items);

  function handleCheckout() {
    toast({
      title: "Checkout is a demo",
      description: "Your cart was priced by the DummyJSON carts API. No order is placed.",
    });
  }

  return (
    <aside
      aria-label="Order summary"
      aria-busy={isLoading}
      className="space-y-4 rounded-lg bg-surface-muted p-5 lg:sticky lg:top-20"
    >
      {!data && isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : data ? (
        <dl className={cn("space-y-2 text-sm transition-opacity", isLoading && "opacity-50")}>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Items ({count})</dt>
            <dd className="text-slate-800">{formatPrice(data.total)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Discount</dt>
            <dd className="text-success">−{formatPrice(data.total - data.discountedTotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Delivery</dt>
            <dd className="text-success">FREE</dd>
          </div>
          <div className="flex justify-between gap-4 pt-2 text-lg font-bold text-slate-900">
            <dt>Order total</dt>
            <dd>{formatPrice(data.discountedTotal)}</dd>
          </div>
        </dl>
      ) : null}

      {isError && (
        <div role="alert" className="text-sm text-deal">
          Couldn&apos;t confirm prices right now.{" "}
          <button type="button" onClick={retry} className="font-medium underline">
            Try again
          </button>
        </div>
      )}

      <Button
        variant="cta"
        shape="pill"
        size="lg"
        className="w-full"
        onClick={handleCheckout}
        disabled={!data || isLoading}
      >
        Proceed to checkout
      </Button>
      <p className="text-center text-xs text-slate-500">Totals confirmed by the DummyJSON carts API.</p>
    </aside>
  );
}
