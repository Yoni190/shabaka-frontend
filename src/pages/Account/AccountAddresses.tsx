import PlaceholderPanel from "../../components/account/PlaceholderPanel";

export default function AccountAddresses() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Addresses</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage your saved shipping and billing addresses.
        </p>
      </header>

      <PlaceholderPanel
        icon={AddressIcon}
        title="Address management is coming soon"
        description="You'll be able to add, edit, and remove shipping and billing addresses here."
        note="Pending backend: GET/POST/PUT/DELETE /api/v1/addresses"
      />
    </div>
  );
}

function AddressIcon({ className }: { className?: string }) {
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
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}