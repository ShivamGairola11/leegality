import type { ProductSummary } from "../types";
import { ProductCard } from "./product-card";

export const productGridClassName =
  "grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <ul className={productGridClassName}>
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} eager={index < 4} />
        </li>
      ))}
    </ul>
  );
}
