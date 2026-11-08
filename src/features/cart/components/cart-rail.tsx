/*
 * Amazon-style cart rail: a narrow column on the right of large screens that
 * appears while the cart has items (and closes when it's emptied), showing the
 * subtotal and a stepper for each item. Hidden on the cart page itself.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonStyles } from "@/components/ui/button";
import { getSalePrice } from "@/features/products/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { useCart } from "../hooks/use-cart";
import { getMaxQuantity, getSubtotal } from "../lib/cart";
import { QuantityStepper } from "./quantity-stepper";

export function CartRail() {
  const pathname = usePathname();
  const { items, setQuantity } = useCart();

  if (items.length === 0 || pathname === "/cart") return null;

  return (
    <aside
      aria-label="Cart preview"
      className="hidden w-40 shrink-0 animate-fade-in border-l border-gray-200 lg:block"
    >
      <div className="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto px-3 py-4">
        <div className="text-center">
          <p className="text-sm text-slate-700">Subtotal</p>
          <p className="text-lg font-bold text-deal">{formatPrice(getSubtotal(items))}</p>
          <Link
            href="/cart"
            className={buttonStyles({ variant: "outline", shape: "pill", size: "sm", className: "mt-2 w-full" })}
          >
            Go to Cart
          </Link>
        </div>

        <ul className="mt-5 space-y-5">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col items-center gap-2">
              <Link
                href={`/product/${item.id}`}
                className="relative block size-24 overflow-hidden rounded-md bg-surface-muted"
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="96px"
                  className="object-contain p-2 mix-blend-multiply"
                />
              </Link>
              <p className="text-sm font-bold text-slate-900">
                {formatPrice(getSalePrice(item.price, item.discountPercentage))}
              </p>
              <QuantityStepper
                quantity={item.quantity}
                max={getMaxQuantity(item)}
                label={item.title}
                onChange={(quantity) => setQuantity(item.id, quantity)}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
