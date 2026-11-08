"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "../hooks/use-cart";
import { getMaxQuantity } from "../lib/cart";
import type { CartProduct } from "../types";
import { AddToCart } from "./add-to-cart";

export function BuyBox({ product }: { product: CartProduct }) {
  const router = useRouter();
  const { quantityOf, add } = useCart();

  function handleBuyNow() {
    if (quantityOf(product.id) === 0) add(product);
    router.push("/cart");
  }

  return (
    <div className="flex max-w-sm flex-col gap-2">
      <AddToCart product={product} size="md" />
      {getMaxQuantity(product) > 0 && (
        <Button variant="buy" shape="pill" size="lg" onClick={handleBuyNow} className="w-full">
          Buy now
        </Button>
      )}
    </div>
  );
}
