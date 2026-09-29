import type { ChangeEvent } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "tel";
  error?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
}

export default function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  error,
  required,
  placeholder,
  autoComplete,
  hint,
}: FormFieldProps) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={`mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
        }`}
      />

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}