"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface Option {
  value: string;
  label: string;
}

interface OptionListProps {
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
  emptyMessage: string;
  visibleCount?: number;
}

export function OptionList({
  options,
  selected,
  onToggle,
  emptyMessage,
  visibleCount = 6,
}: OptionListProps) {
  const [expanded, setExpanded] = useState(false);

  if (options.length === 0) {
    return <p className="py-1 text-sm text-slate-400">{emptyMessage}</p>;
  }

  const canCollapse = options.length > visibleCount;
  const visible =
    expanded || !canCollapse
      ? options
      : options.filter((option, i) => i < visibleCount || selected.includes(option.value));

  return (
    <div>
      <ul>
        {visible.map((option) => (
          <li key={option.value}>
            <Checkbox
              label={option.label}
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
          </li>
        ))}
      </ul>
      {canCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-1 text-xs font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : `Show all (${options.length})`}
        </button>
      )}
    </div>
  );
}
