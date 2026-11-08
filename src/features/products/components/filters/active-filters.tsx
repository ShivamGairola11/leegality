import { CloseIcon } from "@/components/icons";
import { formatPrice } from "@/lib/utils";
import type { Category, ProductFilters } from "../../types";

interface ActiveFiltersProps {
  filters: ProductFilters;
  categories: Category[];
  onCategoryClear: () => void;
  onBrandRemove: (brand: string) => void;
  onPriceClear: () => void;
  onQueryClear: () => void;
  onClearAll: () => void;
}

function priceLabel(min: number | null, max: number | null) {
  if (min !== null && max !== null) return `${formatPrice(min)} – ${formatPrice(max)}`;
  if (min !== null) return `Over ${formatPrice(min)}`;
  return `Under ${formatPrice(max ?? 0)}`;
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 py-1 pr-2 pl-3 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
      >
        {label}
        <CloseIcon width={12} height={12} />
      </button>
    </li>
  );
}

export function ActiveFilters({
  filters,
  categories,
  onCategoryClear,
  onBrandRemove,
  onPriceClear,
  onQueryClear,
  onClearAll,
}: ActiveFiltersProps) {
  const { category, brands, minPrice, maxPrice, query } = filters;
  const hasPrice = minPrice !== null || maxPrice !== null;
  const chipCount = (category ? 1 : 0) + brands.length + (hasPrice ? 1 : 0) + (query ? 1 : 0);

  if (chipCount === 0) return null;

  const categoryName = categories.find((c) => c.slug === category)?.name ?? category;

  return (
    <ul aria-label="Active filters" className="mb-4 flex flex-wrap items-center gap-2">
      {category && <Chip label={categoryName ?? category} onRemove={onCategoryClear} />}
      {brands.map((brand) => (
        <Chip key={brand} label={brand} onRemove={() => onBrandRemove(brand)} />
      ))}
      {hasPrice && <Chip label={priceLabel(minPrice, maxPrice)} onRemove={onPriceClear} />}
      {query && <Chip label={`“${query}”`} onRemove={onQueryClear} />}
      {chipCount > 1 && (
        <li>
          <button
            type="button"
            onClick={onClearAll}
            className="px-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:underline"
          >
            Clear all
          </button>
        </li>
      )}
    </ul>
  );
}
