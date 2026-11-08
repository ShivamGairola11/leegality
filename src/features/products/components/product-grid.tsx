import type { ProductSummary } from "../types";
import { ProductCard } from "./product-card";

export const productGridClassName =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <ul className={productGridClassName}>
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} priority={index < 4} />
        </li>
      ))}
    </ul>
  );
}
