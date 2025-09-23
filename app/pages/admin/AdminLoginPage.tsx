import React from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { login, isAuthenticated } from "@services/api/AdminAuthService";
import { useNavigate } from "react-router";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState("admin@gmail.com");
  const [password, setPassword] = React.useState("admin");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated()) nav("/admin/catalog", { replace: true });
  }, [nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok) {
      nav("/admin/catalog", { replace: true });
    } else {
      setError(res.message || "Falha no login");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent>
          <Stack gap={2} component="form" onSubmit={submit}>
            <Typography variant="h5" textAlign="center">
              Login Administrativo
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Entrar
            </Button>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Dica: admin@gmail.com / admin
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

// SPA guard
export async function clientLoader() {
  // se já autenticado, redireciona para o dashboard
  if (isAuthenticated()) {
    // `redirect` não está disponível no clientLoader diretamente, então navegaremos via efeito no componente.
  }
  return null;
}
