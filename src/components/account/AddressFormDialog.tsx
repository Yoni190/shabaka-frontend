import { useEffect, useState, type FormEvent } from "react";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import SelectField from "../ui/SelectField";
import type {
  Address,
  AddressFieldErrors,
  AddressPayload,
  AddressType,
} from "../../types/address";

interface AddressFormDialogProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initial?: Address | null;
  isSubmitting: boolean;
  fieldErrors: AddressFieldErrors;
  formError: string | null;
  onClose: () => void;
  onSubmit: (payload: AddressPayload) => void;
}

const emptyPayload: AddressPayload = {
  label: "",
  recipient_name: "",
  company_name: "",
  phone: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state_or_region: "",
  postal_code: "",
  country_code: "SA",
  address_type: "shipping",
};

function toPayload(address: Address): AddressPayload {
  return {
    label: address.label ?? "",
    recipient_name: address.recipient_name,
    company_name: address.company_name ?? "",
    phone: address.phone,
    address_line_1: address.address_line_1,
    address_line_2: address.address_line_2 ?? "",
    city: address.city,
    state_or_region: address.state_or_region ?? "",
    postal_code: address.postal_code,
    country_code: address.country_code,
    address_type: address.address_type,
  };
}

export default function AddressFormDialog({
  isOpen,
  mode,
  initial,
  isSubmitting,
  fieldErrors,
  formError,
  onClose,
  onSubmit,
}: AddressFormDialogProps) {
  const [values, setValues] = useState<AddressPayload>(emptyPayload);

  // Load the initial values every time the dialog opens for a new target.
  useEffect(() => {
    if (!isOpen) return;
    setValues(initial ? toPayload(initial) : emptyPayload);
  }, [isOpen, initial]);

  const update = <K extends keyof AddressPayload>(
    field: K,
    value: AddressPayload[K],
  ) => setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add address" : "Edit address"}
      maxWidth="max-w-2xl"
    >
      {formError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Type + label */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="address_type"
            label="Address type"
            value={values.address_type}
            onChange={(value) =>
              update("address_type", value as AddressType)
            }
            options={[
              { value: "shipping", label: "Shipping" },
              { value: "billing", label: "Billing" },
            ]}
            error={fieldErrors.address_type}
            required
          />
          <FormField
            id="label"
            label="Label"
            value={values.label}
            onChange={(value) => update("label", value)}
            error={fieldErrors.label}
            placeholder="e.g. Head office"
          />
        </div>

        {/* Recipient */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="recipient_name"
            label="Recipient name"
            value={values.recipient_name}
            onChange={(value) => update("recipient_name", value)}
            error={fieldErrors.recipient_name}
            required
            autoComplete="name"
          />
          <FormField
            id="company_name"
            label="Company name"
            value={values.company_name}
            onChange={(value) => update("company_name", value)}
            error={fieldErrors.company_name}
            autoComplete="organization"
          />
        </div>

        <FormField
          id="phone"
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={(value) => update("phone", value)}
          error={fieldErrors.phone}
          required
          autoComplete="tel"
        />

        {/* Address */}
        <FormField
          id="address_line_1"
          label="Address line 1"
          value={values.address_line_1}
          onChange={(value) => update("address_line_1", value)}
          error={fieldErrors.address_line_1}
          required
          autoComplete="address-line1"
        />
        <FormField
          id="address_line_2"
          label="Address line 2"
          value={values.address_line_2}
          onChange={(value) => update("address_line_2", value)}
          error={fieldErrors.address_line_2}
          autoComplete="address-line2"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            id="city"
            label="City"
            value={values.city}
            onChange={(value) => update("city", value)}
            error={fieldErrors.city}
            required
            autoComplete="address-level2"
          />
          <FormField
            id="state_or_region"
            label="State / region"
            value={values.state_or_region}
            onChange={(value) => update("state_or_region", value)}
            error={fieldErrors.state_or_region}
            autoComplete="address-level1"
          />
          <FormField
            id="postal_code"
            label="Postal code"
            value={values.postal_code}
            onChange={(value) => update("postal_code", value)}
            error={fieldErrors.postal_code}
            required
            autoComplete="postal-code"
          />
        </div>

        <FormField
          id="country_code"
          label="Country code"
          value={values.country_code}
          onChange={(value) => update("country_code", value)}
          error={fieldErrors.country_code}
          required
          placeholder="SA"
          hint="Two-letter ISO code, e.g. SA, AE, US"
        />

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting
              ? "Saving…"
              : mode === "create"
                ? "Add address"
                : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}