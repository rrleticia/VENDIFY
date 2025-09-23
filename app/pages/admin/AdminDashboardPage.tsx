import { Suspense } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import OrderTable from "../components/OrderTable";
import { OrdersProvider } from "../contexts/OrdersContext";

export default function AdminDashboardPage() {
  return (
    <OrdersProvider>
      <Suspense fallback={null}>
        <Grid container spacing={2}>
          <Grid sx={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Pedidos recentes</Typography>
                <OrderTable />
              </CardContent>
            </Card>
          </Grid>
          <Grid sx={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Resumo</Typography>
                <Box sx={{ color: "text.secondary" }}>
                  Coloque gráficos e KPIs aqui depois.
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Suspense>
    </OrdersProvider>
  );
}
