import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../../api/payments";

type Status = "verifying" | "paid" | "failed" | "pending";

export default function CallbackPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const paymentId = searchParams.get("id");
    const orderId = searchParams.get("order_id");

    if (!paymentId || !orderId) {
      setStatus("failed");
      setMessage("Missing payment information. Please contact support.");
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyPayment(paymentId, Number(orderId));

        if (result.status === "paid") {
          setStatus("paid");
          setMessage(
            `Payment confirmed. Order ${result.order_number} has been paid.`,
          );
          sessionStorage.removeItem(`moyasar_payment_${orderId}`);
          sessionStorage.removeItem("last_order");
        } else if (result.status === "failed") {
          setStatus("failed");
          setMessage("Payment failed. Please try again.");
        } else {
          setStatus("pending");
          setMessage(
            "Your payment is being processed. You will receive a confirmation once it is verified.",
          );
        }
      } catch {
        setStatus("failed");
        setMessage(
          "We could not verify your payment. Please contact support.",
        );
      }
    };

    void verify();
  }, [searchParams]);

  const styles: Record<Status, { bg: string; text: string; icon: string }> = {
    verifying: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      icon: "⏳",
    },
    paid: {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      icon: "✅",
    },
    failed: {
      bg: "bg-rose-50",
      text: "text-rose-800",
      icon: "❌",
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      icon: "⏳",
    },
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div
        className={`rounded-xl border p-8 ${styles[status].bg} ${styles[status].text}`}
      >
        <p className="text-3xl">{styles[status].icon}</p>
        <h1 className="mt-3 text-xl font-bold">
          {status === "verifying" && "Verifying payment…"}
          {status === "paid" && "Payment confirmed"}
          {status === "failed" && "Payment failed"}
          {status === "pending" && "Payment pending"}
        </h1>
        <p className="mt-2 text-sm">{message}</p>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Continue shopping
        </Link>
        <Link
          to="/account/orders"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View my orders
        </Link>
      </div>
    </div>
  );
}