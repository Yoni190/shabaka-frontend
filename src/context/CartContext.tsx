import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart";
import { getErrorMessage } from "../lib/axios";
import { useAuth } from "../hooks/useAuth";
import type { Cart } from "../types/cart";

export interface CartContextValue {
  cart: Cart | null;
  /** True only during the very first fetch so skeletons don't flicker. */
  isInitialLoading: boolean;
  error: string | null;
  /** Total quantity across all items. */
  itemCount: number;
  /** Item IDs with an in-flight mutation. */
  pendingItemIds: Set<number>;
  /** Product ID currently being added from a product page, or null. */
  isAddingProductId: number | null;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clear: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

interface Feedback {
  type: "success" | "error";
  text: string;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingItemIds, setPendingItemIds] = useState<Set<number>>(new Set());
  const [isAddingProductId, setIsAddingProductId] = useState<number | null>(
    null,
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // A ref mirror of pendingItemIds so callbacks can read the latest set
  // without depending on it (which would recreate them on every change).
  const pendingRef = useRef<Set<number>>(new Set());

  const addPending = (id: number) => {
    pendingRef.current.add(id);
    setPendingItemIds(new Set(pendingRef.current));
  };
  const removePending = (id: number) => {
    pendingRef.current.delete(id);
    setPendingItemIds(new Set(pendingRef.current));
  };

  const showFeedback = useCallback((next: Feedback) => {
    setFeedback(next);
    window.setTimeout(() => setFeedback(null), 3000);
  }, []);

  /* ---------- Fetch ---------- */

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load your cart."));
    }
  }, []);

  // Load / clear cart whenever auth state settles.
  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setCart(null);
      setError(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsInitialLoading(true);
      await refresh();
      if (!cancelled) setIsInitialLoading(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading, refresh]);

  /* ---------- Mutations ---------- */

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      if (isAddingProductId !== null) return;
      setIsAddingProductId(productId);
      try {
        const updated = await addCartItem(productId, quantity);
        if (updated) setCart(updated);
        else await refresh();
        showFeedback({ type: "success", text: "Added to cart." });
      } catch (err) {
        showFeedback({
          type: "error",
          text: getErrorMessage(err, "Failed to add to cart."),
        });
        throw err;
      } finally {
        setIsAddingProductId(null);
      }
    },
    [isAddingProductId, refresh, showFeedback],
  );

  const updateItem = useCallback(
    async (itemId: number, quantity: number) => {
      if (pendingRef.current.has(itemId)) return;
      if (quantity < 1) return;

      addPending(itemId);
      try {
        const updated = await updateCartItem(itemId, quantity);
        if (updated) setCart(updated);
        else await refresh();
      } catch (err) {
        showFeedback({
          type: "error",
          text: getErrorMessage(err, "Failed to update quantity."),
        });
        // Refetch to restore the last confirmed server state.
        await refresh();
      } finally {
        removePending(itemId);
      }
    },
    [refresh, showFeedback],
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      if (pendingRef.current.has(itemId)) return;

      addPending(itemId);
      try {
        const updated = await removeCartItem(itemId);
        if (updated) setCart(updated);
        else await refresh();
        showFeedback({ type: "success", text: "Item removed." });
      } catch (err) {
        showFeedback({
          type: "error",
          text: getErrorMessage(err, "Failed to remove item."),
        });
        throw err;
      } finally {
        removePending(itemId);
      }
    },
    [refresh, showFeedback],
  );

  const clear = useCallback(async () => {
    try {
      const updated = await clearCart();
      if (updated) setCart(updated);
      else setCart({ id: cart?.id ?? 0, items: [], subtotal: "0.00" });
      showFeedback({ type: "success", text: "Cart cleared." });
    } catch (err) {
      showFeedback({
        type: "error",
        text: getErrorMessage(err, "Failed to clear cart."),
      });
      throw err;
    }
  }, [cart?.id, showFeedback]);

  /* ---------- Derived ---------- */

  const itemCount = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isInitialLoading,
      error,
      itemCount,
      pendingItemIds,
      isAddingProductId,
      refresh,
      addItem,
      updateItem,
      removeItem,
      clear,
    }),
    [
      cart,
      isInitialLoading,
      error,
      itemCount,
      pendingItemIds,
      isAddingProductId,
      refresh,
      addItem,
      updateItem,
      removeItem,
      clear,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {feedback && (
        <div
          role="status"
          className={`fixed bottom-4 right-4 z-[60] max-w-xs rounded-lg px-4 py-3 text-sm shadow-lg ${
            feedback.type === "success"
              ? "bg-slate-900 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {feedback.text}
        </div>
      )}
    </CartContext.Provider>
  );
}