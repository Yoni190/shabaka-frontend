import axios from "axios";

/**
 * Shared axios instance for the Laravel API.
 * Base URL comes from VITE_API_URL (see .env), never hardcoded.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/** Shape of Laravel's 422 validation error response. */
export interface LaravelValidationError {
  message: string;
  errors: Record<string, string[]>;
}

/** Type guard for axios errors with a Laravel validation body. */
export function isValidationError(
  error: unknown,
): error is { response: { status: number; data: LaravelValidationError } } {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 422 &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "errors" in error.response.data
  );
}