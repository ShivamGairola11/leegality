import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { getDiscount, getOriginalPrice } from "../lib/pricing";

const sizes = {
  sm: { price: "text-base", original: "text-xs" },
  lg: { price: "text-3xl", original: "text-sm" },
};

interface PriceTagProps {
  price: number;
  discountPercentage: number;
  size?: keyof typeof sizes;
  showBadge?: boolean;
  className?: string;
}

export function PriceTag({
  price,
  discountPercentage,
  size = "sm",
  showBadge = false,
  className,
}: PriceTagProps) {
  const discount = getDiscount(discountPercentage);
  const styles = sizes[size];

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      {showBadge && discount > 0 && (
        <Badge tone="danger" className="self-center">
          -{discount}%
        </Badge>
      )}
      <span className={cn("font-semibold text-slate-900", styles.price)}>{formatPrice(price)}</span>
      {discount > 0 && (
        <span className={cn("text-slate-400 line-through", styles.original)}>
          <span className="sr-only">Original price </span>
          {formatPrice(getOriginalPrice(price, discountPercentage))}
        </span>
      )}
    </span>
  );
}
