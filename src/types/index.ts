export type UserRole = "admin" | "business_customer";

export interface AuthUser {
  name: string;
  role: UserRole;
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

export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductCategoryRef {
  id: number;
  name: string;
}

export interface ProductBrandRef {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  /** Laravel returns this as a decimal string, e.g. "1250.00". */
  price: string;
  stock_quantity: number;
  is_active: boolean;
  category: ProductCategoryRef;
  brand: ProductBrandRef;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface ProductListResponse {
  data: Product[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: ProductPaginationMeta;
}

export interface Brand {
  id: number;
  name: string;
  brand_image: string | null;
  brand_image_url: string | null;
}