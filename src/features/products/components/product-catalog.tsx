import { getCategories, getProducts } from "../api/products";
import { FILTER_PARAMS } from "../constants";
import { ProductBrowser } from "./product-browser";

interface ProductCatalogProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function ProductCatalog({ searchParams }: ProductCatalogProps) {
  const category = (await searchParams)[FILTER_PARAMS.category];

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(typeof category === "string" && category ? category : null),
  ]);

  return <ProductBrowser categories={categories} products={products} />;
}
