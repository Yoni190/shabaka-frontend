import { api } from "../lib/axios";
import type { Category, CategoryListResponse } from "../types";

/**
 * Homepage categories — the backend returns a maximum of 5.
 * Used only by the homepage.
 */
export async function getHomeCategories(): Promise<Category[]> {
  const { data } = await api.get<{ data: Category[] }>("/home/categories");
  return data.data;
}

export interface ListCategoriesParams {
  page?: number;
  per_page?: number;
}

/**
 * Full public categories catalogue — paginated.
 * Used only by the /categories page.
 */
export async function getCategories(
  params: ListCategoriesParams = {},
): Promise<CategoryListResponse> {
  const { data } = await api.get<CategoryListResponse>("/categories", {
    params,
  });
  return data;
}