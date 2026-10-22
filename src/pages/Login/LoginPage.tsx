import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FormField from "../../components/ui/FormField";
import { isUnauthorized, isValidationError } from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
import type { LoginFieldErrors, LoginPayload } from "../../types";

const emptyForm: LoginPayload = {
  email: "",
  password: "",
};

const DEMO_CREDENTIALS: LoginPayload = {
  email: "test@gmail.com",
  password: "Aa123456",
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

  const performLogin = async (credentials: LoginPayload) => {
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await login(credentials);
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
        setFormError(error.response.data.message ?? "Invalid email or password.");
      } else {
        setFormError("We couldn't sign you in right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performLogin(form);
  };

  const handleDemoLogin = () => {
    setForm(DEMO_CREDENTIALS);   // keep the visual fill-in
    performLogin(DEMO_CREDENTIALS);
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
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

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>Use Demo Account</span>
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
    </div>
  );
}