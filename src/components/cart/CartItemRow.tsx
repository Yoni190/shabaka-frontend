import { useState } from "react";
import { Link } from "react-router-dom";
import type { CartItem } from "../../types/cart";

interface CartItemRowProps {
  item: CartItem;
  isPending: boolean;
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SAR",
});

export default function CartItemRow({
  item,
  isPending,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const [imageErrored, setImageErrored] = useState(false);

  const imageUrl = item.product.image?.url ?? null;
  const showImage = imageUrl && !imageErrored;

  const productUnavailable = !item.product.is_active;
  const insufficientStock =
    !productUnavailable && item.quantity > item.product.stock_quantity;

  const decrease = () => {
    if (item.quantity <= 1 || isPending) return;
    onQuantityChange(item.id, item.quantity - 1);
  };
  const increase = () => {
    if (isPending) return;
    if (item.quantity >= item.product.stock_quantity) return;
    onQuantityChange(item.id, item.quantity + 1);
  };

  return (
    <article className="flex flex-col gap-4 border-b border-slate-200 py-5 last:border-b-0 sm:flex-row sm:gap-6">
      {/* Image */}
      <Link
        to={`/products/${item.product_id}`}
        className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:h-28 sm:w-28"
      >
        {showImage ? (
          <img
            src={imageUrl}
            alt={item.product.name}
            onError={() => setImageErrored(true)}
            className="h-full w-full object-contain"
          />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-slate-300"
            aria-hidden="true"
          >
            <rect x="2" y="3" width="20" height="7" rx="2" />
            <rect x="2" y="14" width="20" height="7" rx="2" />
            <path d="M6 6.5h.01M6 17.5h.01" />
          </svg>
        )}
      </Link>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">
              <Link
                to={`/products/${item.product_id}`}
                className="transition hover:text-blue-600"
              >
                {item.product.name}
              </Link>
            </h3>
            <p className="mt-0.5 font-mono text-xs text-slate-500">
              SKU: {item.product.sku}
            </p>

            {productUnavailable && (
              <p className="mt-2 rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
                This product is no longer available.
              </p>
            )}
            {insufficientStock && (
              <p className="mt-2 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
                Only {item.product.stock_quantity} in stock.
              </p>
            )}
          </div>

          <p className="shrink-0 text-sm font-semibold text-slate-900">
            {priceFormatter.format(Number(item.subtotal))}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          {/* Unit price */}
          <p className="text-xs text-slate-500">
            {priceFormatter.format(Number(item.unit_price))} / unit
          </p>

          <div className="flex items-center gap-3">
            {/* Quantity controls */}
            <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white">
              <button
                type="button"
                onClick={decrease}
                disabled={isPending || item.quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span
                aria-live="polite"
                className="w-10 text-center text-sm font-semibold text-slate-900"
              >
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={increase}
                disabled={
                  isPending || item.quantity >= item.product.stock_quantity
                }
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={isPending}
              className="text-xs font-medium text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}