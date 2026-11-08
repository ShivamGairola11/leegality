import type { Metadata } from "next";
import { CartView } from "@/features/cart/components/cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart",
};

export default function CartPage() {
  return <CartView />;
}
