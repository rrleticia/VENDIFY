import { SecurityAdminProvider, useSecurityAdmin } from "@common/contexts";
import { Box, Chip, Stack, Typography } from "@mui/material";

function Inner() {
  const { userId, roles } = useSecurityAdmin();
  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Segurança e Perfis
      </Typography>
      <Typography variant="body2">Usuário atual: {userId}</Typography>
      <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
        {roles.map((r) => (
          <Chip key={r} label={r} />
        ))}
      </Stack>
      <Typography
        variant="caption"
        sx={{ opacity: 0.7, display: "block", mt: 2 }}
      >
        Controle de acesso aplicado nas páginas Admin (Catálogo: editor/admin ·
        Pedidos: seller/admin).
      </Typography>
    </Box>
  );
}

export default function SecurityAdminPage() {
  return (
    <SecurityAdminProvider>
      <Inner />
    </SecurityAdminProvider>
  );
}

export async function clientLoader() {
  const mod = await import("./guards");
  return mod.requireRole("admin");
}
