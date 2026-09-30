import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FormField from "../../components/ui/FormField";
import { isUnauthorized, isValidationError } from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
import type { LoginFieldErrors, LoginPayload } from "../../types";

const emptyForm: LoginPayload = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginPayload>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const updateField = (field: keyof LoginPayload) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      await login(form);
      navigate("/");
    } catch (error) {
      if (isValidationError(error)) {
        const { errors, message } = error.response.data;
        const flattened: LoginFieldErrors = {};
        for (const [field, messages] of Object.entries(errors)) {
          flattened[field as keyof LoginPayload] = messages[0];
        }
        setFieldErrors(flattened);
        setFormError(message ?? "Please correct the highlighted fields.");
      } else if (isUnauthorized(error)) {
        setFormError(
          error.response.data.message ?? "Invalid email or password.",
        );
      } else {
        setFormError("We couldn't sign you in right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar cartCount={0} />

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Business account
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Access account pricing, orders and invoices.
            </p>

            {formError && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <FormField
                id="email"
                label="Work email"
                type="email"
                value={form.email}
                onChange={updateField("email")}
                error={fieldErrors.email}
                required
                autoComplete="email"
                placeholder="jane@company.com"
              />

              <div>
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={updateField("password")}
                  error={fieldErrors.password}
                  required
                  autoComplete="current-password"
                />
                <div className="mt-2 text-right">
                  <a
                    href="/forgot-password"
                    className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              New to Shabaka?{" "}
              <a
                href="/register"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Register your business
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}