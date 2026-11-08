import Link from "next/link";
import { formatLabel } from "@/lib/utils";
import { getProducts } from "../../api/products";
import { RELATED_PRODUCTS_LIMIT } from "../../constants";
import { ProductCard } from "../product-card";

interface RelatedProductsProps {
  category: string;
  excludeId: number;
}

export async function RelatedProducts({ category, excludeId }: RelatedProductsProps) {
  const products = (await getProducts(category))
    .filter((product) => product.id !== excludeId)
    .slice(0, RELATED_PRODUCTS_LIMIT);

  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="related-heading" className="text-lg font-semibold text-slate-900">
          More from {formatLabel(category)}
        </h2>
        <Link
          href={`/?category=${encodeURIComponent(category)}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 xl:grid-cols-6">
        {products.map((product) => (
          <li key={product.id} className="flex w-40 shrink-0 snap-start sm:w-auto">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
