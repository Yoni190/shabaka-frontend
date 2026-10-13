import { useCallback, useEffect, useState } from "react";
import AddressCard from "../../components/account/AddressCard";
import AddressFormDialog from "../../components/account/AddressFormDialog";
import DeleteAddressDialog from "../../components/account/DeleteAddressDialog";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../../api/addresses";
import { getErrorMessage, isValidationError } from "../../lib/axios";
import type {
  Address,
  AddressFieldErrors,
  AddressPayload,
} from "../../types/address";

export default function AccountAddresses() {
  /* ---------- List state ---------- */

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  /* ---------- Dialog state ---------- */

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

  /* ---------- Mutation state ---------- */

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<AddressFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ---------- Fetch list ---------- */

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setListError(null);
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      setListError(
        getErrorMessage(error, "Failed to load your addresses."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  // Auto-dismiss success banner.
  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  /* ---------- Error mapping ---------- */

  const applyValidationErrors = (error: unknown): boolean => {
    if (!isValidationError(error)) return false;
    const errors = error.response.data.errors;
    const mapped: AddressFieldErrors = {};
    for (const [key, messages] of Object.entries(errors)) {
      mapped[key as keyof AddressPayload] = messages[0];
    }
    setFieldErrors(mapped);
    setFormError(error.response.data.message ?? null);
    return true;
  };

  const resetFormState = () => {
    setFieldErrors({});
    setFormError(null);
  };

  /* ---------- Create ---------- */

  const openCreate = () => {
    resetFormState();
    setCreateOpen(true);
  };

  const handleCreateSubmit = async (payload: AddressPayload) => {
    setIsSubmitting(true);
    resetFormState();
    try {
      const created = await createAddress(payload);
      setAddresses((prev) => [...prev, created]);
      setCreateOpen(false);
      setSuccessMessage("Address added successfully.");
    } catch (error) {
      if (!applyValidationErrors(error)) {
        setFormError(
          getErrorMessage(error, "Failed to add address. Please try again."),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Edit ---------- */

  const openEdit = (address: Address) => {
    resetFormState();
    setEditTarget(address);
  };

  const handleEditSubmit = async (payload: AddressPayload) => {
    if (!editTarget) return;
    setIsSubmitting(true);
    resetFormState();
    try {
      const updated = await updateAddress(editTarget.id, payload);
      setAddresses((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      setEditTarget(null);
      setSuccessMessage("Address updated successfully.");
    } catch (error) {
      if (!applyValidationErrors(error)) {
        setFormError(
          getErrorMessage(error, "Failed to update address. Please try again."),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Delete ---------- */

  const openDelete = (address: Address) => {
    setDeleteError(null);
    setDeleteTarget(address);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAddress(deleteTarget.id);
      setAddresses((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      setSuccessMessage("Address deleted successfully.");
    } catch (error) {
      // Retain the address in the list; show the failure inside the dialog.
      setDeleteError(
        getErrorMessage(error, "Failed to delete address. Please try again."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /* ---------- Render ---------- */

  const isEmpty = !isLoading && !listError && addresses.length === 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Addresses</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage your saved shipping and billing addresses.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add address
        </button>
      </header>

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {successMessage}
        </div>
      )}

      {isLoading && <AddressListSkeleton />}

      {!isLoading && listError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-sm font-semibold text-rose-800">
            Couldn't load addresses
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-rose-700">
            {listError}
          </p>
          <button
            type="button"
            onClick={fetchList}
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !listError && isEmpty && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No saved addresses
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add a shipping or billing address to speed up future orders.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add address
          </button>
        </div>
      )}

      {!isLoading && !listError && addresses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      <AddressFormDialog
        isOpen={createOpen}
        mode="create"
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <AddressFormDialog
        isOpen={editTarget !== null}
        mode="edit"
        initial={editTarget}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEditSubmit}
      />

      <DeleteAddressDialog
        isOpen={deleteTarget !== null}
        address={deleteTarget}
        isDeleting={isDeleting}
        error={deleteError}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

/* ---------- Skeleton ---------- */

function AddressListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="h-4 w-32 rounded bg-slate-100" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-48 rounded bg-slate-100" />
            <div className="h-3 w-40 rounded bg-slate-100" />
            <div className="h-3 w-24 rounded bg-slate-100" />
          </div>
          <div className="mt-5 flex gap-4 border-t border-slate-100 pt-4">
            <div className="h-3 w-10 rounded bg-slate-100" />
            <div className="h-3 w-12 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}