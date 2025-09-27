import { Chip } from "@mui/material";

type Color = "default"|"success"|"warning"|"info"|"error";
const map: Record<string, Color> = {
  PENDING: "warning",
  PAID: "info",
  PICKING: "warning",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELED: "error",
  AVAILABLE: "success", // Para ebooks disponíveis para download
};

export default function OrderStatusChip({ value }: { value: string }){
  const color = map[value] ?? "default";
  return <Chip size="small" color={color} label={value} />;
}
