import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {
  label: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded py-1 text-sm text-slate-700 hover:text-slate-900",
        className,
      )}
    >
      <input
        type="checkbox"
        className="size-4 shrink-0 cursor-pointer rounded border-gray-300 accent-primary"
        {...props}
      />
      <span className="truncate">{label}</span>
    </label>
  );
}
