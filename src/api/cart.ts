import { api } from "../lib/axios";
import type { Cart } from "../types/cart";

/**
 * Laravel wraps the cart in `{ data: {...} }`. Mutation endpoints may
 * return the updated cart or an empty body — we return `null` when the
 * backend omits the payload so the caller can fall back to a refetch.
 */
async function unwrapCart(promise: Promise<{ data: unknown }>): Promise<Cart | null> {
  const response = await promise;
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: Cart }).data;
  }
  return null;
}

export async function getCart(): Promise<Cart> {
  const { data } = await api.get<{ data: Cart }>("/cart");
  return data.data;
}

export async function addCartItem(
  productId: number,
  quantity: number,
): Promise<Cart | null> {
  return unwrapCart(
    api.post("/cart/items", { product_id: productId, quantity }),
  );
}

export async function updateCartItem(
  itemId: number,
  quantity: number,
): Promise<Cart | null> {
  return unwrapCart(api.patch(`/cart/items/${itemId}`, { quantity }));
}

export async function removeCartItem(itemId: number): Promise<Cart | null> {
  return unwrapCart(api.delete(`/cart/items/${itemId}`));
}

export async function clearCart(): Promise<Cart | null> {
  return unwrapCart(api.delete("/cart/items"));
}