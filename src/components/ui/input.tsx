import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends ComponentProps<"input"> {
  icon?: ReactNode;
}

export function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
          {icon}
        </span>
      )}
      <input
        className={cn(
          "h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-slate-800 placeholder:text-gray-400",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          Boolean(icon) && "pl-9",
          className,
        )}
        {...props}
      />
    </div>
  );
}
