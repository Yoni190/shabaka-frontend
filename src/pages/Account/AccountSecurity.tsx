import PlaceholderPanel from "../../components/account/PlaceholderPanel";

export default function AccountSecurity() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Security</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage your password and account security.
        </p>
      </header>

      <PlaceholderPanel
        icon={ShieldIcon}
        title="Password management is coming soon"
        description="You'll be able to change your password and review your account security from this page."
        note="Pending backend: PUT /api/v1/user/password"
      />
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}