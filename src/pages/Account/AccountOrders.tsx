import PlaceholderPanel from "../../components/account/PlaceholderPanel";

export default function AccountOrders() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review your previous and current orders.
        </p>
      </header>

      <PlaceholderPanel
        icon={OrdersIcon}
        title="No orders yet"
        description="Your order history will appear here once you place your first order."
        note="Pending backend: GET /api/v1/orders"
      />
    </div>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}