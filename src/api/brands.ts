import { api } from "../lib/axios";
import type { Brand } from "../types";

/**
 * Public brands list. Used by the homepage carousel.
 * The endpoint returns a Laravel Resource collection wrapped in `data`.
 */
export async function getBrands(): Promise<Brand[]> {
  const { data } = await api.get<{ data: Brand[] }>("/brands");
  return data.data;
}