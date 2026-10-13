import type { Address } from "../../types/address";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
}

const typeLabels: Record<Address["address_type"], string> = {
  shipping: "Shipping",
  billing: "Billing",
};

const typeStyles: Record<Address["address_type"], string> = {
  shipping: "bg-blue-50 text-blue-700",
  billing: "bg-emerald-50 text-emerald-700",
};

export default function AddressCard({
  address,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const lines = [
    address.address_line_1,
    address.address_line_2,
    [address.city, address.state_or_region, address.postal_code]
      .filter(Boolean)
      .join(", "),
    address.country_code,
  ].filter((line): line is string => Boolean(line && line.trim()));

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {address.label?.trim() || address.recipient_name}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                typeStyles[address.address_type]
              }`}
            >
              {typeLabels[address.address_type]}
            </span>
          </div>
          {address.label?.trim() && (
            <p className="mt-1 text-sm text-slate-600">
              {address.recipient_name}
            </p>
          )}
          {address.company_name?.trim() && (
            <p className="text-xs text-slate-500">{address.company_name}</p>
          )}
        </div>
      </header>

      <address className="mt-3 not-italic text-sm leading-6 text-slate-600">
        {lines.map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))}
        {address.phone?.trim() && (
          <span className="mt-1 block text-slate-500">{address.phone}</span>
        )}
      </address>

      <footer className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-xs font-medium">
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="text-blue-600 transition hover:text-blue-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(address)}
          className="text-rose-600 transition hover:text-rose-700"
        >
          Delete
        </button>
      </footer>
    </article>
  );
}