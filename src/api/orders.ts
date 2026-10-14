import { api } from "../lib/axios";
import type { CreateOrderPayload, Order } from "../types/order";

/**
 * Create an order from the authenticated business's current cart.
 * The backend validates stock, snapshots items, decrements inventory,
 * and clears the cart on success.
 */
export async function createOrder(
  payload: CreateOrderPayload,
): Promise<Order> {
  const { data } = await api.post<{ data: Order }>("/orders", payload);
  return data.data;
}