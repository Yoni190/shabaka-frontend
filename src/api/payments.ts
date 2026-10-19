import { api } from "../lib/axios";

export type PaymentVerificationStatus =
  | "paid"
  | "failed"
  | "pending"
  | "authorized"
  | "initiated";

export interface PaymentVerificationResult {
  status: PaymentVerificationStatus;
  order_id: number;
  order_number: string;
}

/**
 * Ask the backend to verify a Moyasar payment against the order.
 *
 * The backend MUST:
 *  1. Fetch the payment from Moyasar using the secret key.
 *  2. Confirm status === 'paid'.
 *  3. Confirm amount and currency match the order total.
 *  4. Mark the order as paid only when all checks pass.
 *
 * This endpoint is required for a secure integration and is not
 * part of the current documented API.
 */
export async function verifyPayment(
  paymentId: string,
  orderId: number,
): Promise<PaymentVerificationResult> {
  const { data } = await api.post<{ data: PaymentVerificationResult }>(
    "/payments/verify",
    { payment_id: paymentId, order_id: orderId },
  );
  return data.data;
}