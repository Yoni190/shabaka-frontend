export interface CartProductImage {
  id: number;
  path: string;
  url: string;
  is_primary: boolean;
}

export interface CartProduct {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock_quantity: number;
  is_active: boolean;
  image: CartProductImage | null;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  product: CartProduct;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: string;
}