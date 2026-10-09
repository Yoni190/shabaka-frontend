import { api } from "../lib/axios";
import type { Product, ProductListResponse } from "../types";

export interface ListProductsParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string | number;
  brand_id?: string | number;
  /** "1" for featured only, "0" for non-featured. */
  is_featured?: "0" | "1";
  sort?: "name" | "price" | "stock_quantity" | "created_at";
  direction?: "asc" | "desc";
}

/**
 * Homepage featured products — the backend limits this to a small set.
 * Used only by the homepage.
 */
export async function getHomeProducts(): Promise<Product[]> {
  const { data } = await api.get<{ data: Product[] }>("/home/products");
  return data.data;
}

/**
 * Full public product catalogue — paginated.
 * Used only by the /products page.
 */
export async function getProducts(
  params: ListProductsParams = {},
): Promise<ProductListResponse> {
  const { data } = await api.get<ProductListResponse>("/products", {
    params,
  });
  return data;
}

/**
 * Single product for the details page.
 * Laravel wraps the payload in `{ data: {...} }`.
 */
export async function getProductById(id: number): Promise<Product> {
  const { data } = await api.get<{ data: Product }>(`/products/${id}`);
  return data.data;
}