export type AddressType = "shipping" | "billing";

export interface Address {
  id: number;
  label: string | null;
  recipient_name: string;
  company_name: string | null;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state_or_region: string | null;
  postal_code: string;
  country_code: string;
  address_type: AddressType;
  created_at: string;
  updated_at: string;
}

/** Payload for create and update. Same shape — server derives ownership. */
export interface AddressPayload {
  label: string;
  recipient_name: string;
  company_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_or_region: string;
  postal_code: string;
  country_code: string;
  address_type: AddressType;
}

export type AddressFieldErrors = Partial<Record<keyof AddressPayload, string>>;