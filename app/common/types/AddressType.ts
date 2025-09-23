export type AddressType = {
  id?: string;
  name?: string; // usado em Orders
  label?: string; // usado em Profile
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
};
