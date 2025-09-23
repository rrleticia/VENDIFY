import { LogsAdminProvider, useLogsAdmin } from "@common/contexts";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

function Inner() {
  const { loading, logs, emails } = useLogsAdmin();
  if (loading) return <CircularProgress />;
  return (
    <Stack gap={2}>
      <Box>
        <Typography variant="h6" mb={1}>
          Atividade
        </Typography>
        <Stack gap={1}>
          {logs.map((l) => (
            <Card key={l.id}>
              <CardContent>
                <Typography variant="body2">
                  {new Date(l.at).toLocaleString()} · {l.userId} · {l.action}
                </Typography>
                <Typography variant="caption">{l.details}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography variant="h6" mb={1}>
          Fila de E-mails
        </Typography>
        <Stack gap={1}>
          {emails.map((m) => (
            <Card key={m.id}>
              <CardContent>
                <Typography variant="body2">
                  {new Date(m.at).toLocaleString()} · {m.to} · {m.subject} ·{" "}
                  {m.status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

export default function LogsAdminPage() {
  return (
    <LogsAdminProvider>
      <Box>
        <Typography variant="h5" mb={2}>
          Logs & Notificações
        </Typography>
        <Inner />
      </Box>
    </LogsAdminProvider>
  );
}

export async function clientLoader() {
  const mod = await import("./guards");
  return mod.requireRole("admin");
}
