import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AccountOverview() {
  const { user } = useAuth();

  if (!user) return null;

  const initial = user.name.charAt(0).toUpperCase();
  const roleLabel =
    user.role === "admin" ? "Administrator" : "Business customer";
    //Fix: only business customer can access this page

  return (
    <div className="space-y-8">
      {/* Identity card */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-slate-900">
              {user.name}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {user.email ?? "No email on file"}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {roleLabel}
          </span>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Contact information
          </h3>
          <Link
            to="/account/details"
            className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View all details →
          </Link>
        </div>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Phone" value={user.business.phone} />
        </dl>
      </section>

      {/* Business */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Business information
          </h3>
        </div>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Business name" value={user.business.name} />
          <Field label="VAT number" value={user.business.vat_number} />
          <Field
            label="Commercial registration"
            value={user.business.commercial_registration}
          />
        </dl>
      </section>

      {/* Quick actions */}
      <section className="grid gap-4 sm:grid-cols-2">
        <QuickAction
          to="/account/details"
          title="Edit account details"
          description="Review and update your personal and business information."
        />
        <QuickAction
          to="/account/addresses"
          title="Manage addresses"
          description="Add or update shipping and billing addresses."
        />
      </section>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm text-slate-900">
        {value?.trim() || <span className="text-slate-400">Not provided</span>}
      </dd>
    </div>
  );
}

function QuickAction({
  to,
  title,
  description,
}: {
  to: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
    >
      <p className="text-sm font-semibold text-slate-900 transition group-hover:text-blue-700">
        {title}
      </p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </Link>
  );
}