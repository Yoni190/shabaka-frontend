import { useState } from "react";
import { Link } from "react-router-dom";
import CartItemRow from "../../components/cart/CartItemRow";
import CartSummary from "../../components/cart/CartSummary";
import ClearCartDialog from "../../components/cart/ClearCartDialog";
import { useCart } from "../../hooks/useCart";

export default function CartPage() {
  const {
    cart,
    isInitialLoading,
    error,
    itemCount,
    pendingItemIds,
    refresh,
    updateItem,
    removeItem,
    clear,
  } = useCart();

  const [clearOpen, setClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);

  const handleClear = async () => {
    setIsClearing(true);
    setClearError(null);
    try {
      await clear();
      setClearOpen(false);
    } catch (err) {
      // Message already surfaced via toast; keep the dialog open with an
      // inline reason so the user can retry.
      setClearError(
        err instanceof Error ? err.message : "Failed to clear cart.",
      );
    } finally {
      setIsClearing(false);
    }
  };

  /* ---------- Loading ---------- */

  if (isInitialLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-8 w-48 animate-pulse rounded bg-slate-100" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-24 w-24 animate-pulse rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="h-8 w-40 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */

  if (error && !cart) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-sm font-semibold text-rose-800">
            Couldn't load your cart
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-rose-700">
            {error}
          </p>
          <button
            type="button"
            onClick={refresh}
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Empty ---------- */

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
          </svg>
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Browse our catalogue to add networking equipment to your cart.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  /* ---------- Populated ---------- */

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Cart
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setClearError(null);
            setClearOpen(true);
          }}
          className="text-xs font-medium text-rose-600 transition hover:text-rose-700"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-5 sm:px-6">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              isPending={pendingItemIds.has(item.id)}
              onQuantityChange={updateItem}
              onRemove={removeItem}
            />
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CartSummary subtotal={cart.subtotal} />
        </aside>
      </div>

      <ClearCartDialog
        isOpen={clearOpen}
        isClearing={isClearing}
        error={clearError}
        onClose={() => setClearOpen(false)}
        onConfirm={handleClear}
      />
    </div>
  );
}