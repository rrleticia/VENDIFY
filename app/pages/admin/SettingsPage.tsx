import { ActivityLogsProvider } from "../contexts/ActivityLogsContext";
import ActivityLogTable from "../components/ActivityLogTable";
import { Card, CardContent, Typography, Stack, Button } from "@mui/material";
import { useAdminAuth } from "../contexts/AdminAuthContext";

export default function SettingsPage() {
  const { signInAs } = useAdminAuth();
  return (
    <ActivityLogsProvider>
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Perfis e Acesso
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => signInAs("admin")}>
                Entrar como Admin
              </Button>
              <Button variant="outlined" onClick={() => signInAs("editor")}>
                Entrar como Editor
              </Button>
              <Button variant="outlined" onClick={() => signInAs("vendedor")}>
                Entrar como Vendedor
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Logs de Atividade
            </Typography>
            <ActivityLogTable />
          </CardContent>
        </Card>
      </Stack>
    </ActivityLogsProvider>
  );
}
