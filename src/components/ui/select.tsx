import type { ComponentProps } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-9 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white pr-8 pl-3 text-sm text-slate-700 shadow-sm",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        width={16}
        height={16}
        className="pointer-events-none absolute inset-y-0 right-2.5 my-auto text-slate-400"
      />
    </div>
  );
}
