import { api } from "../lib/axios";
import type { Address, AddressPayload } from "../types/address";

/** List all addresses for the authenticated business. */
export async function getAddresses(): Promise<Address[]> {
  const { data } = await api.get<{ data: Address[] }>("/addresses");
  return data.data;
}

/** Retrieve a single address. */
export async function getAddress(id: number): Promise<Address> {
  const { data } = await api.get<{ data: Address }>(`/addresses/${id}`);
  return data.data;
}

export async function createAddress(payload: AddressPayload): Promise<Address> {
  const { data } = await api.post<{ data: Address }>("/addresses", payload);
  return data.data;
}

export async function updateAddress(
  id: number,
  payload: AddressPayload,
): Promise<Address> {
  const { data } = await api.put<{ data: Address }>(
    `/addresses/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/addresses/${id}`);
}