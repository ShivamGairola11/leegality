/*
 * Partial stars are drawn by layering a clipped row of filled stars over a
 * grey row, so 4.3 shows exactly 4.3 stars instead of rounding.
 */
import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const MAX_RATING = 5;

const sizes = {
  sm: { star: 14, text: "text-xs" },
  md: { star: 16, text: "text-sm" },
};

interface RatingProps {
  value: number;
  size?: keyof typeof sizes;
  showValue?: boolean;
  className?: string;
}

function Stars({ size }: { size: number }) {
  return Array.from({ length: MAX_RATING }, (_, i) => (
    <StarIcon key={i} width={size} height={size} className="shrink-0" />
  ));
}

export function Rating({ value, size = "sm", showValue = true, className }: RatingProps) {
  const { star, text } = sizes[size];
  const fill = Math.min(Math.max(value / MAX_RATING, 0), 1) * 100;

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span
        role="img"
        aria-label={`Rated ${value.toFixed(1)} out of ${MAX_RATING}`}
        className="relative inline-flex"
      >
        <span className="flex text-gray-300">
          <Stars size={star} />
        </span>
        <span className="absolute inset-0 flex overflow-hidden text-star" style={{ width: `${fill}%` }}>
          <Stars size={star} />
        </span>
      </span>
      {showValue && <span className={cn("text-slate-500", text)}>({value.toFixed(1)})</span>}
    </span>
  );
}
