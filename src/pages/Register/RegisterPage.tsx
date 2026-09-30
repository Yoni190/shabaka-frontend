import { useState, type FormEvent } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FormField from "../../components/ui/FormField";
import { api, isValidationError } from "../../lib/axios";
import type { FieldErrors, RegisterPayload } from "../../types";

const emptyForm: RegisterPayload = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  business_name: "",
  phone: "",
  vat_number: "",
  commercial_registration: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterPayload>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof RegisterPayload) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear the field's error as soon as the user edits it.
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await api.post("/register", form);
      setSuccess(true);
      setForm(emptyForm);
    } catch (error) {
      if (isValidationError(error)) {
        const { errors, message } = error.response.data;

        // Keep only the first message per field for display.
        const flattened: FieldErrors = {};
        for (const [field, messages] of Object.entries(errors)) {
          flattened[field as keyof RegisterPayload] = messages[0];
        }

        setFieldErrors(flattened);
        setFormError(message ?? "Please correct the highlighted fields.");
      } else {
        setFormError(
          "We couldn't create your account right now. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar cartCount={0} />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Registered Successfully
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Welcome aboard! Your account is ready. Feel free to start browsing our products right away.
            </p>
            <a
              href="/login"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Login
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar cartCount={0} />

      <main className="flex-1">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:px-8 lg:py-16">
          {/* Form */}
          <div className="mx-auto w-full max-w-2xl lg:mx-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Business account
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Register your business
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Get access to account pricing, invoices and full order history.
            </p>

            {formError && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
              {/* Contact */}
              <fieldset className="space-y-5">
                <legend className="text-sm font-semibold text-slate-900">
                  Contact details
                </legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="name"
                    label="Full name"
                    value={form.name}
                    onChange={updateField("name")}
                    error={fieldErrors.name}
                    required
                    autoComplete="name"
                    placeholder="John Doe"
                  />
                  <FormField
                    id="email"
                    label="Work email"
                    type="email"
                    value={form.email}
                    onChange={updateField("email")}
                    error={fieldErrors.email}
                    required
                    autoComplete="email"
                    placeholder="john@company.com"
                  />
                  <FormField
                    id="phone"
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField("phone")}
                    error={fieldErrors.phone}
                    required
                    autoComplete="tel"
                    placeholder="+966 555 010 2030"
                  />
                  <FormField
                    id="business_name"
                    label="Business name"
                    value={form.business_name}
                    onChange={updateField("business_name")}
                    error={fieldErrors.business_name}
                    required
                    autoComplete="organization"
                    placeholder="Acme Networks Ltd"
                  />
                </div>
              </fieldset>

              {/* Business identifiers */}
              <fieldset className="space-y-5">
                <legend className="text-sm font-semibold text-slate-900">
                  Business identifiers
                </legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="vat_number"
                    label="VAT number"
                    value={form.vat_number}
                    onChange={updateField("vat_number")}
                    error={fieldErrors.vat_number}
                    required
                    placeholder="3000000000003"
                  />
                  <FormField
                    id="commercial_registration"
                    label="Commercial registration"
                    value={form.commercial_registration}
                    onChange={updateField("commercial_registration")}
                    error={fieldErrors.commercial_registration}
                    required
                    placeholder="1010123456"
                  />
                </div>
              </fieldset>

              {/* Password */}
              <fieldset className="space-y-5">
                <legend className="text-sm font-semibold text-slate-900">
                  Password
                </legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="password"
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={updateField("password")}
                    error={fieldErrors.password}
                    required
                    autoComplete="new-password"
                    hint="At least 8 characters."
                  />
                  <FormField
                    id="password_confirmation"
                    label="Confirm password"
                    type="password"
                    value={form.password_confirmation}
                    onChange={updateField("password_confirmation")}
                    error={fieldErrors.password_confirmation}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </fieldset>

              <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  By registering you agree to our{" "}
                  <a href="/terms" className="underline hover:text-slate-700">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline hover:text-slate-700">
                    Privacy Policy
                  </a>
                  .
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSubmitting ? "Creating account…" : "Create account"}
                </button>
              </div>
            </form>

            <p className="mt-8 text-sm text-slate-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Log in
              </a>
            </p>
          </div>

          {/* Side panel — hidden on mobile */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                What you get with a business account
              </h2>
              <ul className="mt-4 space-y-4">
                {[
                  {
                    title: "Account pricing",
                    body: "Volume tiers applied automatically at checkout.",
                  },
                  {
                    title: "Invoice-based ordering",
                    body: "Net 30 terms once your account is approved.",
                  },
                  {
                    title: "Order history",
                    body: "Track, reorder and download past invoices.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-xs leading-5 text-slate-500">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}