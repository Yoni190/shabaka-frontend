import Modal from "../ui/Modal";
import type { Address } from "../../types/address";

interface DeleteAddressDialogProps {
  isOpen: boolean;
  address: Address | null;
  isDeleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAddressDialog({
  isOpen,
  address,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeleteAddressDialogProps) {
  if (!address) return null;

  const displayName =
    address.label?.trim() || address.recipient_name || "this address";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete address">
      <p className="text-sm text-slate-700">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-slate-900">{displayName}</span>?
      </p>
      <p className="mt-2 text-sm text-slate-500">
        This action cannot be undone.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}