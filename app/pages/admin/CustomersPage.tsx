import { CustomersProvider } from "../contexts/CustomersContext";
import CustomerTable from "../components/CustomerTable";
import { Card, CardContent, Typography } from "@mui/material";

export default function CustomersPage() {
  return (
    <CustomersProvider>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Clientes
          </Typography>
          <CustomerTable />
        </CardContent>
      </Card>
    </CustomersProvider>
  );
}
