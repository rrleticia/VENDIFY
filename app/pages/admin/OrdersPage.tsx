import { OrdersProvider } from "../contexts/OrdersContext";
import OrderTable from "../components/OrderTable";
import { Card, CardContent, Typography } from "@mui/material";

export default function OrdersPage() {
  return (
    <OrdersProvider>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Gestão de Pedidos
          </Typography>
          <OrderTable />
        </CardContent>
      </Card>
    </OrdersProvider>
  );
}
