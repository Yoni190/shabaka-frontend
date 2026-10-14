import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Order } from "../../types/order";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export default function OrderConfirmationPage() {
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fromState = (location.state as { order?: Order } | null)?.order;
    if (fromState) {
      setOrder(fromState);
      setLoaded(true);
      return;
    }

    try {
      const raw = sessionStorage.getItem("last_order");
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      // Ignore malformed / blocked storage.
    }
    setLoaded(true);
  }, [location.state]);

  // Currency comes from the order itself; fall back to SAR if missing.
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: order?.currency || "SAR",
      }),
    [order?.currency],
  );

  if (!loaded) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          No order to display
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          We couldn't find the details of your recent order. If you placed an
          order, check your email for a confirmation.
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Success header */}
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Order confirmed
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Thank you. Your order has been received and is being processed.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm">
          <span className="text-slate-500">Order</span>
          <span className="font-mono font-semibold text-slate-900">
            {order.order_number}
          </span>
        </p>
      </div>

      {/* Status */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <SummaryCard label="Order status" value={order.status} />
        <SummaryCard label="Payment status" value={order.payment_status} />
      </section>

      {/* Items */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3.5">
          <h2 className="text-sm font-semibold text-slate-900">Items</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {item.product_name}
                </p>
                <p className="mt-0.5 font-mono text-xs text-slate-500">
                  {item.sku}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.quantity} ×{" "}
                  {priceFormatter.format(Number(item.unit_price))}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-slate-900">
                {priceFormatter.format(Number(item.subtotal))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Totals */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <dl className="space-y-2 text-sm">
          <Row label="Subtotal" value={order.subtotal} formatter={priceFormatter} />
          <Row label="Tax" value={order.tax_amount} formatter={priceFormatter} />
          <Row
            label="Shipping"
            value={order.shipping_amount}
            formatter={priceFormatter}
          />
          <Row
            label="Discount"
            value={order.discount_amount}
            formatter={priceFormatter}
          />
          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
            <dt className="text-base font-semibold text-slate-900">Total</dt>
            <dd className="text-base font-bold text-slate-900">
              {priceFormatter.format(Number(order.total_amount))}
            </dd>
          </div>
        </dl>
      </section>

      {/* Shipping snapshot */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Shipping address
        </h2>
        <address className="mt-3 not-italic text-sm leading-6 text-slate-600">
          <span className="block font-medium text-slate-900">
            {order.shipping_address.recipient_name}
          </span>
          {order.shipping_address.company_name && (
            <span className="block">
              {order.shipping_address.company_name}
            </span>
          )}
          <span className="block">
            {order.shipping_address.address_line_1}
          </span>
          {order.shipping_address.address_line_2 && (
            <span className="block">
              {order.shipping_address.address_line_2}
            </span>
          )}
          <span className="block">
            {[
              order.shipping_address.city,
              order.shipping_address.state_or_region,
              order.shipping_address.postal_code,
            ]
              .filter(Boolean)
              .join(", ")}
          </span>
          <span className="block">
            {order.shipping_address.country_code}
          </span>
          <span className="mt-1 block text-slate-500">
            {order.shipping_address.phone}
          </span>
        </address>
      </section>

      {order.notes && (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Order notes
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
            {order.notes}
          </p>
        </section>
      )}

      <p className="mt-6 text-center text-xs text-slate-500">
        Placed on {formatDate(order.created_at)}
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Continue shopping
        </Link>
        <Link
          to="/account/orders"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View my orders
        </Link>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  formatter,
}: {
  label: string;
  value: string;
  formatter: Intl.NumberFormat;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-600">{label}</dt>
      <dd className="text-slate-900">
        {formatter.format(Number(value))}
      </dd>
    </div>
  );
}