import type { Product } from "@/features/products/types";

export type CartProduct = Pick<
  Product,
  "id" | "title" | "price" | "discountPercentage" | "thumbnail" | "stock"
>;

export interface CartItem extends CartProduct {
  quantity: number;
}

export interface PricedCartLine {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice: number;
  thumbnail: string;
}

export interface PricedCart {
  products: PricedCartLine[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}
