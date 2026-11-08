import { Select } from "@/components/ui/select";
import { SORT_OPTIONS } from "../constants";
import type { SortOption } from "../types";

interface SortSelectProps {
  value: SortOption | null;
  onChange: (value: SortOption | null) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-500">
      <span className="max-sm:sr-only">Sort by</span>
      <Select
        value={value ?? ""}
        onChange={(event) => onChange((event.target.value || null) as SortOption | null)}
        aria-label="Sort products"
      >
        <option value="">Featured</option>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
