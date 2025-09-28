export type CardType = {
  id: string;
  brand: "Visa" | "Mastercard" | "Elo" | "Amex";
  last4: string;
  holder: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
};
