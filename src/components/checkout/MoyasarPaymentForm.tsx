import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Moyasar: {
      init: (config: MoyasarConfig) => void;
    };
  }
}

interface MoyasarConfig {
  element: string;
  amount: number; // halalas
  currency: string;
  description: string;
  publishable_api_key: string;
  callback_url: string;
  supported_networks?: string[];
  methods?: string[];
  on_completed?: (payment: { id: string }) => void | Promise<void>;
}

interface MoyasarPaymentFormProps {
  /** Amount in SAR, e.g. 249.90 */
  amount: number;
  description: string;
  orderId: number;
  onPaymentInitiated?: (paymentId: string) => void;
}

let scriptPromise: Promise<void> | null = null;

function loadMoyasarScript(): Promise<void> {
  if (window.Moyasar) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    // CSS
    if (!document.querySelector('link[data-moyasar-css]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.3.0/dist/moyasar.css";
      link.dataset.moyasarCss = "true";
      document.head.appendChild(link);
    }

    // JS
    if (document.querySelector('script[data-moyasar-js]')) {
      // Script tag exists but window.Moyasar might not be ready yet.
      const check = setInterval(() => {
        if (window.Moyasar) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      // Give up after 10 seconds
      setTimeout(() => {
        clearInterval(check);
        if (!window.Moyasar) {
          reject(new Error("Moyasar SDK did not initialise."));
        }
      }, 10000);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.3.0/dist/moyasar.umd.min.js";
    script.async = true;
    script.dataset.moyasarJs = "true";
    script.onload = () => {
      if (window.Moyasar) resolve();
      else reject(new Error("Moyasar SDK loaded but window.Moyasar is undefined."));
    };
    script.onerror = () => reject(new Error("Failed to load Moyasar SDK."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export default function MoyasarPaymentForm({
  amount,
  description,
  orderId,
  onPaymentInitiated,
}: MoyasarPaymentFormProps) {
  const containerId = useRef(`moyasar-form-${orderId}`).current;
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        await loadMoyasarScript();
        if (cancelled) return;

        const publishableKey = import.meta.env.VITE_MOYASAR_PK;
        if (!publishableKey) {
          throw new Error(
            "Payment is not configured. Missing VITE_MOYASAR_PK.",
          );
        }

        const amountInHalalas = Math.round(amount * 100);
        if (amountInHalalas < 100) {
          throw new Error("Amount is below the minimum allowed by Moyasar.");
        }

        // Clear any previous instance so re-init does not duplicate fields.
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = "";

        window.Moyasar.init({
          element: `#${containerId}`,
          amount: amountInHalalas,
          currency: "SAR",
          description,
          publishable_api_key: publishableKey,
          callback_url: `${window.location.origin}/checkout/callback?order_id=${orderId}`,
          supported_networks: ["visa", "mastercard", "mada"],
          methods: ["creditcard", "applepay"],
          on_completed: async (payment) => {
            // Keep the payment ID for resilience (e.g. 3-D Secure drop-off).
            // This is NOT proof of payment; the callback page must verify
            // server-side before the order is marked as paid.
            try {
              sessionStorage.setItem(
                `moyasar_payment_${orderId}`,
                payment.id,
              );
            } catch {
              // Storage may be unavailable — non-fatal.
            }
            onPaymentInitiated?.(payment.id);
          },
        });

        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(
            err instanceof Error
              ? err.message
              : "Failed to initialise payment form.",
          );
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = "";
    };
  }, [amount, description, orderId, containerId, onPaymentInitiated]);

  if (status === "error") {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      {status === "loading" && (
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
          Loading payment form…
        </div>
      )}
      <div id={containerId} className="mysr-form" />
    </div>
  );
}