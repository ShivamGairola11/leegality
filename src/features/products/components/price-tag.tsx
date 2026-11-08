/*
 * Amazon-style price: small superscript currency and cents around a large
 * whole number, followed by the struck-through M.R.P and the saving.
 */
import { cn, formatPrice } from "@/lib/utils";
import { getDiscount, getOriginalPrice } from "../lib/pricing";

const sizes = {
  sm: { whole: "text-2xl", meta: "text-xs", saving: "text-sm", discount: "" },
  lg: { whole: "text-4xl", meta: "text-sm", saving: "text-base", discount: "text-3xl" },
};

interface PriceTagProps {
  price: number;
  discountPercentage: number;
  size?: keyof typeof sizes;
  className?: string;
}

export function PriceTag({ price, discountPercentage, size = "sm", className }: PriceTagProps) {
  const discount = getDiscount(discountPercentage);
  const styles = sizes[size];
  const [whole, cents] = price.toFixed(2).split(".");

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      {size === "lg" && discount > 0 && (
        <span className={cn("font-light text-deal", styles.discount)}>-{discount}%</span>
      )}
      <span className="text-slate-900" data-price={price}>
        <span className="sr-only">{formatPrice(price)}</span>
        <span aria-hidden="true" className="relative top-[-0.6em] text-xs">
          $
        </span>
        <span aria-hidden="true" className={cn("font-medium", styles.whole)}>
          {Number(whole).toLocaleString("en-US")}
        </span>
        {cents !== "00" && (
          <span aria-hidden="true" className="relative top-[-0.6em] text-xs">
            {cents}
          </span>
        )}
      </span>
      {discount > 0 && (
        <>
          <span className={cn("text-slate-500", styles.meta)}>
            M.R.P: <span className="sr-only">original price</span>
            <s>{formatPrice(getOriginalPrice(price, discountPercentage))}</s>
          </span>
          {size === "sm" && <span className={cn("text-slate-700", styles.saving)}>({discount}% off)</span>}
        </>
      )}
    </div>
  );
}
