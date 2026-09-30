export type UserRole = "admin" | "business_customer";

export interface AuthUser {
  name: string;
  role: UserRole;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image: string;
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