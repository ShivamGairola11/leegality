/*
 * Amazon-style price: small superscript currency and cents around a large
 * whole number, followed by the struck-through M.R.P and the saving.
 * `price` is the list price; the big number is the discounted sale price.
 */
import { cn, formatPrice } from "@/lib/utils";
import { getDiscount, getSalePrice } from "../lib/pricing";

const sizes = {
  sm: { whole: "text-2xl", meta: "text-xs", saving: "text-sm", discount: "" },
  lg: { whole: "text-4xl", meta: "text-sm", saving: "text-base", discount: "text-3xl" },
};

export function Amount({ value, className }: { value: number; className?: string }) {
  const [whole, cents] = value.toFixed(2).split(".");

  return (
    <span className="text-slate-900" data-price={value}>
      <span className="sr-only">{formatPrice(value)}</span>
      <span aria-hidden="true" className="relative top-[-0.6em] text-xs">
        $
      </span>
      <span aria-hidden="true" className={cn("font-medium", className)}>
        {Number(whole).toLocaleString("en-US")}
      </span>
      {cents !== "00" && (
        <span aria-hidden="true" className="relative top-[-0.6em] text-xs">
          {cents}
        </span>
      )}
    </span>
  );
}

interface PriceTagProps {
  price: number;
  discountPercentage: number;
  size?: keyof typeof sizes;
  className?: string;
}

export function PriceTag({ price, discountPercentage, size = "sm", className }: PriceTagProps) {
  const discount = getDiscount(discountPercentage);
  const styles = sizes[size];

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      {size === "lg" && discount > 0 && (
        <span className={cn("font-light text-deal", styles.discount)}>-{discount}%</span>
      )}
      <Amount value={getSalePrice(price, discountPercentage)} className={styles.whole} />
      {discount > 0 && (
        <>
          <span className={cn("text-slate-500", styles.meta)}>
            M.R.P: <span className="sr-only">original price</span>
            <s>{formatPrice(price)}</s>
          </span>
          {size === "sm" && (
            <span className={cn("text-slate-700", styles.saving)}>({discount}% off)</span>
          )}
        </>
      )}
    </div>
  );
}
