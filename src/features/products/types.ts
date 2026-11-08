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
}

export type ProductSummary = Pick<
  Product,
  "id" | "title" | "price" | "rating" | "thumbnail" | "brand" | "category"
>;

export interface ProductListResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductFilters {
  category: string | null;
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
  query: string;
  page: number;
}
