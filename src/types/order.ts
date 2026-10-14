export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  /** Resource exposes this as `sku`, not `product_sku`. */
  sku: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface OrderAddress {
  id?: number;
  label: string | null;
  recipient_name: string;
  company_name: string | null;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state_or_region: string | null;
  postal_code: string;
  country_code: string;
  address_type?: "shipping" | "billing";
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: string;
  tax_amount: string;
  shipping_amount: string;
  discount_amount: string;
  /** Resource exposes this as `total_amount`, not `total`. */
  total_amount: string;
  /** ISO currency code, e.g. "SAR". */
  currency: string;
  notes: string | null;
  shipping_address: OrderAddress;
  billing_address: OrderAddress | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

/** POST /api/v1/orders payload. The backend derives prices, totals, stock. */
export interface CreateOrderPayload {
  shipping_address_id: number;
  billing_address_id: number | null;
  notes: string | null;
}