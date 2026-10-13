import { useAuth } from "../../hooks/useAuth";

export default function AccountDetails() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Account details
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Your personal and business information on record.
        </p>
      </header>

      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Editing account details is not yet available. Contact support to
        update your information.
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Personal details
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Phone" value={user.phone} />
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Business details
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Business name" value={user.business_name} />
          <Field label="VAT number" value={user.vat_number} />
          <Field
            label="Commercial registration"
            value={user.commercial_registration}
          />
        </dl>
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
      <dd className="mt-0.5 break-words text-sm text-slate-900">
        {value?.trim() || <span className="text-slate-400">Not provided</span>}
      </dd>
    </div>
  );
}