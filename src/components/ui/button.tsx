import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover disabled:opacity-60",
  outline:
    "border border-gray-200 bg-white text-slate-700 shadow-sm hover:bg-gray-50 disabled:opacity-50",
  ghost: "text-slate-600 hover:bg-gray-100",
  icon: "text-white/85 hover:bg-white/10 hover:text-white",
  cta: "bg-cta text-slate-900 shadow-sm hover:bg-cta-hover disabled:bg-gray-200 disabled:text-slate-500",
  buy: "bg-buy text-slate-900 shadow-sm hover:bg-buy-hover",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
  icon: "size-9",
  page: "size-8 text-xs",
};

const shapes = {
  rounded: "rounded-md",
  pill: "rounded-full",
};

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  shape?: keyof typeof shapes;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  shape = "rounded",
  className,
}: Pick<ButtonProps, "variant" | "size" | "shape" | "className"> = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-1.5 font-medium transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    shapes[shape],
    className,
  );
}

export function Button({ variant, size, shape, className, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonStyles({ variant, size, shape, className })} {...props} />
  );
}
