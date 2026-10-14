import { Link } from "react-router-dom";

interface CartSummaryProps {
  subtotal: string;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SAR",
});

export default function CartSummary({ subtotal }: CartSummaryProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-slate-900">Order summary</h2>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-600">Subtotal</dt>
          <dd className="font-semibold text-slate-900">
            {priceFormatter.format(Number(subtotal))}
          </dd>
        </div>
      </dl>

      <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
        Taxes, shipping, discounts, and checkout costs are calculated at the
        next step and are not included in this subtotal.
      </p>

      <div className="mt-6 space-y-3">
        <Link
          to="/checkout"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Proceed to checkout
        </Link>
        <Link
          to="/products"
          className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}