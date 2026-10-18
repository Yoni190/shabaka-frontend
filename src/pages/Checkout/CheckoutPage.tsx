import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAddresses } from "../../api/addresses";
import { createOrder } from "../../api/orders";
import { getErrorMessage, isValidationError } from "../../lib/axios";
import { useCart } from "../../hooks/useCart";
import type { Address } from "../../types/address";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SAR",
});

const NOTES_MAX = 1000;

interface FieldErrors {
  shipping_address_id?: string;
  billing_address_id?: string;
  notes?: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, refresh: refreshCart } = useCart();

  /* ---------- Addresses ---------- */

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressesError, setAddressesError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setIsLoadingAddresses(true);
    setAddressesError(null);
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      setAddressesError(
        getErrorMessage(err, "Failed to load your addresses."),
      );
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    void fetchAddresses();
  }, [fetchAddresses]);

  /* ---------- Form state ---------- */

  const [shippingAddressId, setShippingAddressId] = useState<number | null>(
    null,
  );
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddressId, setBillingAddressId] = useState<number | null>(
    null,
  );
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Pre-select the first shipping address once addresses load.
  useEffect(() => {
    if (shippingAddressId !== null) return;
    const firstShipping = addresses.find(
      (address) => address.address_type === "shipping",
    );
    if (firstShipping) setShippingAddressId(firstShipping.id);
  }, [addresses, shippingAddressId]);

  // If the user clears "same as shipping", pre-select a billing address.
  useEffect(() => {
    if (billingSameAsShipping) {
      setBillingAddressId(null);
      return;
    }
    if (billingAddressId !== null) return;
    const firstBilling = addresses.find(
      (address) => address.address_type === "billing",
    );
    if (firstBilling) setBillingAddressId(firstBilling.id);
  }, [billingSameAsShipping, addresses, billingAddressId]);

  /* ---------- Submit ---------- */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!shippingAddressId) {
      setFieldErrors({
        shipping_address_id: "Please select a shipping address.",
      });
      return;
    }
    if (!cart || cart.items.length === 0) {
      setSubmitError(
        "Your cart is empty. Add products before checking out.",
      );
      return;
    }
    if (!billingSameAsShipping && !billingAddressId) {
      setFieldErrors({
        billing_address_id: "Please select a billing address.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      const order = await createOrder({
        shipping_address_id: shippingAddressId,
        billing_address_id: billingSameAsShipping ? null : billingAddressId,
        notes: notes.trim() || null,
      });

      // Persist for the confirmation page so a refresh doesn't lose the order.
      try {
        sessionStorage.setItem("last_order", JSON.stringify(order));
      } catch {
        // Quota or disabled storage — non-fatal.
      }

      // Backend clears the cart on success; sync our context.
      await refreshCart();

      navigate("/checkout/confirmation", {
        replace: true,
        state: { order },
      });
    } catch (err) {
      if (isValidationError(err)) {
        const errors = err.response.data.errors;
        setFieldErrors({
          shipping_address_id: errors.shipping_address_id?.[0],
          billing_address_id: errors.billing_address_id?.[0],
          notes: errors.notes?.[0],
        });
        // Empty-cart and stock errors often arrive as a top-level message
        // or under a non-field key (`cart`, `items`, `stock`).
        const topLevel =
          err.response.data.message ??
          errors.cart?.[0] ??
          errors.items?.[0] ??
          errors.stock?.[0];
        setSubmitError(topLevel ?? "Please correct the highlighted fields.");
      } else {
        setSubmitError(
          getErrorMessage(
            err,
            "We couldn't place your order. Please try again.",
          ),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Guards ---------- */

  const isEmptyCart = cart !== null && cart.items.length === 0;
  const hasNoAddresses =
    !isLoadingAddresses && !addressesError && addresses.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
        Checkout
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Complete your order
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Confirm your shipping details and review your order before placing it.
      </p>

      {/* Guards */}
      {isEmptyCart && (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-slate-900">
            Your cart is empty
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add products to your cart before proceeding to checkout.
          </p>
          <Link
            to="/products"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Continue shopping
          </Link>
        </div>
      )}

      {!isEmptyCart && hasNoAddresses && (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No saved addresses
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add a shipping address to your account before placing an order.
          </p>
          <Link
            to="/account/addresses"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Manage addresses
          </Link>
        </div>
      )}

      {!isEmptyCart && !hasNoAddresses && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="space-y-6">
            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                <p>{submitError}</p>
                {isEmptyCart && (
                  <Link
                    to="/cart"
                    className="mt-2 inline-block font-semibold text-rose-800 underline hover:text-rose-900"
                  >
                    Review your cart
                  </Link>
                )}
              </div>
            )}

            {/* Shipping address */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-900">
                Shipping address
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Select where you'd like this order delivered.
              </p>

              {isLoadingAddresses && (
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-lg bg-slate-100"
                    />
                  ))}
                </div>
              )}

              {!isLoadingAddresses && addressesError && (
                <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <p>{addressesError}</p>
                  <button
                    type="button"
                    onClick={fetchAddresses}
                    className="mt-2 text-xs font-semibold text-rose-800 underline hover:text-rose-900"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!isLoadingAddresses && !addressesError && (
                <div className="mt-4 space-y-2">
                  {addresses.map((address) => (
                    <AddressOption
                      key={address.id}
                      address={address}
                      name="shipping_address_id"
                      selected={shippingAddressId === address.id}
                      onSelect={() => setShippingAddressId(address.id)}
                    />
                  ))}
                </div>
              )}

              {fieldErrors.shipping_address_id && (
                <p className="mt-2 text-xs text-rose-600">
                  {fieldErrors.shipping_address_id}
                </p>
              )}

              <Link
                to="/account/addresses"
                className="mt-3 inline-block text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Manage addresses →
              </Link>
            </section>

            {/* Billing address */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-900">
                Billing address
              </h2>

              <label className="mt-4 flex items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(event) =>
                    setBillingSameAsShipping(event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
                />
                <span className="text-sm text-slate-700">
                  Use shipping address for billing
                </span>
              </label>

              {!billingSameAsShipping && (
                <div className="mt-4 space-y-2">
                  {addresses.map((address) => (
                    <AddressOption
                      key={address.id}
                      address={address}
                      name="billing_address_id"
                      selected={billingAddressId === address.id}
                      onSelect={() => setBillingAddressId(address.id)}
                    />
                  ))}
                </div>
              )}

              {fieldErrors.billing_address_id && (
                <p className="mt-2 text-xs text-rose-600">
                  {fieldErrors.billing_address_id}
                </p>
              )}
            </section>

            {/* Notes */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <label
                htmlFor="order-notes"
                className="text-sm font-semibold text-slate-900"
              >
                Order notes{" "}
                <span className="font-normal text-slate-500">
                  (optional)
                </span>
              </label>
              <textarea
                id="order-notes"
                rows={4}
                maxLength={NOTES_MAX}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Delivery instructions, PO number, special requirements…"
                className={`mt-3 block w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  fieldErrors.notes
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-rose-600">{fieldErrors.notes}</span>
                <span className="text-slate-400">
                  {notes.length} / {NOTES_MAX}
                </span>
              </div>
            </section>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900">
                Order summary
              </h2>

              <ul className="mt-4 divide-y divide-slate-100">
                {cart?.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 py-3 first:pt-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-slate-500">
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

              <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600">Subtotal</dt>
                  <dd className="font-semibold text-slate-900">
                    {priceFormatter.format(Number(cart?.subtotal ?? "0"))}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
                Taxes, shipping, and discounts are calculated by the backend
                when your order is placed. The final total may differ slightly
                from the subtotal above.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting && <Spinner />}
                {isSubmitting ? "Placing order…" : "Place order"}
              </button>

              <Link
                to="/cart"
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back to cart
              </Link>
            </div>
          </aside>
        </form>
      )}
    </div>
  );
}

/* ---------- Address option ---------- */

interface AddressOptionProps {
  address: Address;
  name: string;
  selected: boolean;
  onSelect: () => void;
}

function AddressOption({
  address,
  name,
  selected,
  onSelect,
}: AddressOptionProps) {
  const typeLabel = address.address_type === "billing" ? "Billing" : "Shipping";
  const typeStyles =
    address.address_type === "billing"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-blue-50 text-blue-700";

  return (
    <label
      className={`block cursor-pointer rounded-lg border p-4 transition ${
        selected
          ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name={name}
          checked={selected}
          onChange={onSelect}
          className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500/30"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              {address.label?.trim() || address.recipient_name}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${typeStyles}`}
            >
              {typeLabel}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-700">
            {address.recipient_name}
            {address.company_name?.trim() && (
              <span className="text-slate-500"> · {address.company_name}</span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {address.phone}
          </p>
          <address className="mt-1 not-italic text-xs leading-5 text-slate-500">
            {[
              address.address_line_1,
              address.address_line_2,
              [address.city, address.state_or_region, address.postal_code]
                .filter(Boolean)
                .join(", "),
              address.country_code,
            ]
              .filter((line): line is string => Boolean(line && line.trim()))
              .join(" · ")}
          </address>
        </div>
      </div>
    </label>
  );
}

/* ---------- Spinner ---------- */

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={2.5}
        opacity={0.25}
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}