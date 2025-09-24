import React from "react";
import { UsersAdminProvider, useUsersAdmin } from "@common/contexts";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function Inner() {
  const { loading, users, create, updateRoles, remove } = useUsersAdmin();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [roles, setRoles] = React.useState<
    Array<"admin" | "editor" | "seller">
  >(["seller"]);

  const toggle = (r: "admin" | "editor" | "seller") => {
    setRoles((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const save = async () => {
    await create({ name, email, roles });
    setOpen(false);
    setName("");
    setEmail("");
    setRoles(["seller"]);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Usuários (Admin/Editor/Seller)</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Cadastrar usuário
        </Button>
      </Stack>
      <Stack gap={1}>
        {users.map((u) => (
          <Card key={u.id}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
              >
                <Box>
                  <Typography variant="subtitle1">{u.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {u.email}
                  </Typography>
                </Box>
                <Stack direction="row" gap={1}>
                  {["admin", "editor", "seller"].map((r) => (
                    <Chip
                      key={r}
                      label={r}
                      variant={
                        u.roles.includes(r as any) ? "filled" : "outlined"
                      }
                      onClick={() =>
                        updateRoles(
                          u.id,
                          u.roles.includes(r as any)
                            ? (u.roles.filter((x) => x !== r) as any)
                            : ([...u.roles, r] as any)
                        )
                      }
                    />
                  ))}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => remove(u.id)}
                  >
                    Remover
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Novo usuário</DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={1}>
            <TextField
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Stack direction="row" gap={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={roles.includes("admin")}
                    onChange={() => toggle("admin")}
                  />
                }
                label="admin"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={roles.includes("editor")}
                    onChange={() => toggle("editor")}
                  />
                }
                label="editor"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={roles.includes("seller")}
                    onChange={() => toggle("seller")}
                  />
                }
                label="seller"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={save} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function UsersAdminPage() {
  return (
    <UsersAdminProvider>
      <Inner />
    </UsersAdminProvider>
  );
}

export async function clientLoader() {
  const mod = await import("./guards");
  return mod.requireRole("admin");
}
