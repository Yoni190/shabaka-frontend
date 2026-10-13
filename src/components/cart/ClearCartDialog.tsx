import Modal from "../ui/Modal";

interface ClearCartDialogProps {
  isOpen: boolean;
  isClearing: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClearCartDialog({
  isOpen,
  isClearing,
  error,
  onClose,
  onConfirm,
}: ClearCartDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Clear cart">
      <p className="text-sm text-slate-700">
        Are you sure you want to remove all items from your cart?
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
          disabled={isClearing}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isClearing}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isClearing ? "Clearing…" : "Clear cart"}
        </button>
      </div>
    </Modal>
  );
}