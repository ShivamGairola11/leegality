import Image from "next/image";
import Link from "next/link";
import { Amount } from "@/features/products/components/price-tag";
import { StockStatus } from "@/features/products/components/stock-status";
import { getDiscount, getSalePrice, getStockLevel } from "@/features/products/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { getMaxQuantity } from "../lib/cart";
import type { CartItem } from "../types";
import { QuantityStepper } from "./quantity-stepper";

interface CartLineProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartLine({ item, onQuantityChange, onRemove }: CartLineProps) {
  const href = `/product/${item.id}`;
  const discount = getDiscount(item.discountPercentage);

  return (
    <li className="flex gap-4">
      <Link
        href={href}
        className="relative size-24 shrink-0 overflow-hidden rounded-md bg-surface-muted sm:size-36"
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          sizes="144px"
          className="object-contain p-2 mix-blend-multiply"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
        <div className="min-w-0 space-y-1">
          <Link
            href={href}
            className="line-clamp-2 text-sm text-slate-900 hover:text-primary sm:text-base"
          >
            {item.title}
          </Link>
          {getStockLevel(item.stock) === "in" ? (
            <p className="text-xs font-medium text-success">In stock</p>
          ) : (
            <StockStatus stock={item.stock} variant="text" />
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
            <QuantityStepper
              quantity={item.quantity}
              max={getMaxQuantity(item)}
              label={item.title}
              onChange={onQuantityChange}
            />
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-primary hover:underline"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="shrink-0 sm:text-right">
          {discount > 0 && (
            <span className="mb-1 inline-block rounded-sm bg-deal px-1.5 py-0.5 text-xs font-semibold text-white">
              {discount}% off
            </span>
          )}
          <p>
            <Amount value={getSalePrice(item.price, item.discountPercentage)} className="text-lg" />
          </p>
          {discount > 0 && (
            <p className="text-xs text-slate-500">
              M.R.P: <s>{formatPrice(item.price)}</s>
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
