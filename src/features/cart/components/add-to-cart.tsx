/*
 * Yellow "Add to cart" pill that turns into a quantity stepper once the
 * product is in the cart, the way Amazon's listing cards behave. On desktop
 * the cart rail confirms the add, so the toast only shows on smaller screens.
 */
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { isDesktop } from "@/lib/breakpoints";
import { cn } from "@/lib/utils";
import { useCart } from "../hooks/use-cart";
import { getMaxQuantity } from "../lib/cart";
import type { CartProduct } from "../types";
import { QuantityStepper } from "./quantity-stepper";

interface AddToCartProps {
  product: CartProduct;
  size?: "sm" | "md";
  className?: string;
}

export function AddToCart({ product, size = "sm", className }: AddToCartProps) {
  const { quantityOf, add, setQuantity } = useCart();
  const quantity = quantityOf(product.id);
  const max = getMaxQuantity(product);

  if (max === 0) {
    return (
      <Button variant="cta" shape="pill" size={size === "sm" ? "sm" : "lg"} disabled className={cn("w-full", className)}>
        Currently unavailable
      </Button>
    );
  }

  if (quantity > 0) {
    return (
      <QuantityStepper
        quantity={quantity}
        max={max}
        label={product.title}
        size={size}
        onChange={(next) => setQuantity(product.id, next)}
        className={cn("w-full", className)}
      />
    );
  }

  function handleAdd() {
    add(product);
    if (isDesktop()) return;
    toast({
      tone: "success",
      title: "Added to cart",
      description: product.title,
      action: { label: "Go to cart", href: "/cart" },
    });
  }

  return (
    <Button
      variant="cta"
      shape="pill"
      size={size === "sm" ? "sm" : "lg"}
      onClick={handleAdd}
      className={cn("w-full", className)}
    >
      Add to cart
    </Button>
  );
}
