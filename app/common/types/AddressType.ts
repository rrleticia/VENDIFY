export type AddressType = {
  id?: string;
  name?: string; // usado em Orders
  label?: string; // usado em Profile
  rua: string;
  numero: string | number;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string; // UF
  cep: string;
  referencia?: string;
  isDefault?: boolean;
};
