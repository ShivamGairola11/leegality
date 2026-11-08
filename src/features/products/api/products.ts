/*
 * Server-side data access for DummyJSON. Each call is cached with `use cache`,
 * so switching categories or revisiting a product doesn't hit the API again.
 * The listing only asks for the fields a card needs to keep payloads small.
 */
import { cacheLife } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Category, Product, ProductListResponse, ProductSummary } from "../types";

const SUMMARY_FIELDS = "title,price,discountPercentage,rating,stock,thumbnail,brand,category";

export async function getCategories() {
  "use cache";
  cacheLife("days");

  return apiFetch<Category[]>("/products/categories");
}

export async function getProducts(category: string | null) {
  "use cache";
  cacheLife("hours");

  const path = category
    ? `/products/category/${encodeURIComponent(category)}`
    : "/products";
  const data = await apiFetch<ProductListResponse<ProductSummary>>(
    `${path}?limit=0&select=${SUMMARY_FIELDS}`,
  );

  return data.products;
}

export async function getProduct(id: string) {
  "use cache";
  cacheLife("hours");

  try {
    return await apiFetch<Product>(`/products/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      return null;
    }
    throw error;
  }
}
