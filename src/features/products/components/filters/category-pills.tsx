"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "../../types";

interface CategoryPillsProps {
  categories: Category[];
  selected: string | null;
  disabled?: boolean;
  onSelect: (slug: string | null) => void;
  className?: string;
}

export function CategoryPills({
  categories,
  selected,
  disabled = false,
  onSelect,
  className,
}: CategoryPillsProps) {
  const pills = [{ slug: null, name: "All" }, ...categories];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const active = container?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (container && active) {
      container.scrollTo({ left: active.offsetLeft - container.offsetLeft - 16, behavior: "smooth" });
    }
  }, [selected]);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Categories"
      className={cn(
        "-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6",
        className,
      )}
    >
      {pills.map(({ slug, name }) => {
        const active = slug === selected;
        return (
          <button
            key={slug ?? "all"}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => onSelect(slug)}
            className={cn(
              "shrink-0 snap-start rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors disabled:opacity-60",
              active
                ? "border-primary bg-primary text-white"
                : "border-gray-200 bg-white text-slate-700 hover:border-gray-300",
            )}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
