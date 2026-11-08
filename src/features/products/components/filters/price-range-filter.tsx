"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PriceRangeFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  onApply: (minPrice: number | null, maxPrice: number | null) => void;
}

const toInput = (value: number | null) => (value === null ? "" : String(value));
const toPrice = (value: string) => (value.trim() === "" ? null : Number(value));

export function PriceRangeFilter({ minPrice, maxPrice, onApply }: PriceRangeFilterProps) {
  const [min, setMin] = useState(toInput(minPrice));
  const [max, setMax] = useState(toInput(maxPrice));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextMin = toPrice(min);
    const nextMax = toPrice(max);

    if ((nextMin !== null && nextMin < 0) || (nextMax !== null && nextMax < 0)) {
      setError("Prices can't be negative.");
      return;
    }
    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      setError("Min price can't be more than max price.");
      return;
    }

    setError(null);
    onApply(nextMin, nextMax);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="Min"
          aria-label="Minimum price"
          value={min}
          onChange={(event) => setMin(event.target.value)}
        />
        <Input
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="Max"
          aria-label="Maximum price"
          value={max}
          onChange={(event) => setMax(event.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full">
        Apply
      </Button>
    </form>
  );
}
