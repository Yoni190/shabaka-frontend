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