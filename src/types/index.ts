export type UserRole = "admin" | "business_customer";

export interface AuthUser {
  name: string;
  role: UserRole;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  sku: string;
  price: number;
  image: string;
  inStock: boolean;
  categoryId: number;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  business_name: string;
  phone: string;
  vat_number: string;
  commercial_registration: string;
}

/** Field name -> first error message. Used for inline form errors. */
export type FieldErrors = Partial<Record<keyof RegisterPayload, string>>;

export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginFieldErrors = Partial<Record<keyof LoginPayload, string>>;

export interface Category {
  id: number;
  name: string;
}

export interface CategoryPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface CategoryListResponse {
  data: Category[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: CategoryPaginationMeta;
}