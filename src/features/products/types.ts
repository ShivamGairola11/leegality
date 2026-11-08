import type { SORT_OPTIONS } from "./constants";

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export type AvailabilityStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  reviews: Review[];
  availabilityStatus: AvailabilityStatus;
  shippingInformation: string;
  warrantyInformation: string;
  returnPolicy: string;
}

export type ProductSummary = Pick<
  Product,
  | "id"
  | "title"
  | "price"
  | "discountPercentage"
  | "rating"
  | "stock"
  | "thumbnail"
  | "brand"
  | "category"
>;

export interface ProductListResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export interface ProductFilters {
  category: string | null;
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
  query: string;
  sort: SortOption | null;
  page: number;
}
