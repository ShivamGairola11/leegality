/*
 * Amazon-style quantity pill. At quantity 1 the minus becomes a trash icon,
 * so the same control removes the item.
 */
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { root: "h-8", button: "w-9", icon: 14, value: "text-sm" },
  md: { root: "h-10", button: "w-11", icon: 16, value: "text-base" },
};

interface QuantityStepperProps {
  quantity: number;
  max: number;
  label: string;
  onChange: (quantity: number) => void;
  size?: keyof typeof sizes;
  className?: string;
}

export function QuantityStepper({
  quantity,
  max,
  label,
  onChange,
  size = "sm",
  className,
}: QuantityStepperProps) {
  const styles = sizes[size];
  const buttonClass = cn(
    "flex h-full items-center justify-center text-slate-800 transition-colors hover:bg-cta/40 disabled:text-slate-300 disabled:hover:bg-transparent",
    styles.button,
  );

  return (
    <div
      role="group"
      aria-label={`Quantity for ${label}`}
      className={cn(
        "inline-flex items-center justify-between overflow-hidden rounded-full border-[3px] border-cta bg-white",
        styles.root,
        className,
      )}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(quantity - 1)}
        aria-label={quantity === 1 ? `Remove ${label} from cart` : "Decrease quantity"}
      >
        {quantity === 1 ? (
          <TrashIcon width={styles.icon} height={styles.icon} />
        ) : (
          <MinusIcon width={styles.icon} height={styles.icon} />
        )}
      </button>
      <span aria-live="polite" className={cn("min-w-6 text-center font-semibold", styles.value)}>
        {quantity}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon width={styles.icon} height={styles.icon} />
      </button>
    </div>
  );
}
