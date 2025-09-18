import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { Link as RouterLink } from "react-router";

// ---------------- Mock & Utils ----------------
type Address = {
  id: string;
  label: string; // "Casa", "Trabalho", etc.
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
};

type Card = {
  id: string;
  brand: "Visa" | "Mastercard" | "Elo" | "Amex";
  last4: string;
  holder: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
};

type User = {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  birth?: string; // yyyy-mm-dd
  avatar?: string;
  newsletter?: boolean;
  twoFA?: boolean;
  marketingPush?: boolean;
  marketingEmail?: boolean;
  marketingSMS?: boolean;
};

const MOCK_USER: User = {
  name: "Letícia Andrade",
  email: "leticia@example.com",
  phone: "(83) 99999-9999",
  cpf: "000.111.222-33",
  birth: "2000-01-10",
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
  newsletter: true,
  twoFA: false,
  marketingPush: true,
  marketingEmail: true,
  marketingSMS: false,
};

const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Casa",
    line1: "Rua das Flores, 123",
    city: "Campina Grande",
    state: "PB",
    zip: "58400-000",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Trabalho",
    line1: "Av. Principal, 456 - Sala 201",
    city: "João Pessoa",
    state: "PB",
    zip: "58000-000",
  },
];

const MOCK_CARDS: Card[] = [
  {
    id: "card-1",
    brand: "Visa",
    last4: "8421",
    holder: "LETICIA A",
    expMonth: 9,
    expYear: 2027,
    isDefault: true,
  },
  {
    id: "card-2",
    brand: "Mastercard",
    last4: "1103",
    holder: "LETICIA A",
    expMonth: 2,
    expYear: 2026,
  },
];

function maskCard(c: Card) {
  return `${c.brand} •••• ${c.last4}`;
}

// ---------------- Page ----------------
export default function ProfilePage() {
  // user
  const [user, setUser] = useState<User>(MOCK_USER);
  const [savingUser, setSavingUser] = useState(false);

  // avatar
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user.avatar
  );

  // addresses
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // cards
  const [cards, setCards] = useState<Card[]>(MOCK_CARDS);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  // password & privacy
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // notifications
  const ordersCount = 12; // mock
  const points = 380; // mock de pontos/fidelidade
  const coupons = 2; // mock

  // feedback
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    msg: "",
    severity: "success",
  });

  // derived
  const defaultAddressId = useMemo(
    () => addresses.find((a) => a.isDefault)?.id,
    [addresses]
  );
  const defaultCardId = useMemo(
    () => cards.find((c) => c.isDefault)?.id,
    [cards]
  );

  // handlers - user
  const onSaveUser = () => {
    setSavingUser(true);
    setTimeout(() => {
      setSavingUser(false);
      setSnack({
        open: true,
        msg: "Perfil atualizado com sucesso.",
        severity: "success",
      });
    }, 500);
  };

  const onAvatarClick = () => fileRef.current?.click();
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(String(reader.result));
      setUser((u) => ({ ...u, avatar: String(reader.result) }));
      setSnack({
        open: true,
        msg: "Foto atualizada (mock).",
        severity: "info",
      });
    };
    reader.readAsDataURL(f);
  };

  // handlers - address
  const openNewAddress = () => {
    setEditingAddress({
      id: `addr-${Date.now()}`,
      label: "Novo",
      line1: "",
      city: "",
      state: "PB",
      zip: "",
    });
    setAddressDialogOpen(true);
  };

  const openEditAddress = (a: Address) => {
    setEditingAddress({ ...a });
    setAddressDialogOpen(true);
  };

  const saveAddress = () => {
    if (!editingAddress) return;
    setAddresses((prev) => {
      const exists = prev.some((a) => a.id === editingAddress.id);
      const next = exists
        ? prev.map((a) => (a.id === editingAddress.id ? editingAddress : a))
        : [...prev, editingAddress];
      // se marcou como padrão, desmarca os outros
      if (editingAddress.isDefault) {
        next.forEach((a) => (a.isDefault = a.id === editingAddress.id));
      }
      return next;
    });
    setAddressDialogOpen(false);
    setSnack({ open: true, msg: "Endereço salvo.", severity: "success" });
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setSnack({ open: true, msg: "Endereço removido.", severity: "warning" });
  };

  // handlers - cards
  const openNewCard = () => {
    setEditingCard({
      id: `card-${Date.now()}`,
      brand: "Visa",
      last4: "",
      holder: user.name.toUpperCase(),
      expMonth: 1,
      expYear: new Date().getFullYear() + 3,
    });
    setCardDialogOpen(true);
  };

  const openEditCard = (c: Card) => {
    setEditingCard({ ...c });
    setCardDialogOpen(true);
  };

  const saveCard = () => {
    if (!editingCard || editingCard.last4.length < 3) {
      setSnack({
        open: true,
        msg: "Informe os dados do cartão.",
        severity: "error",
      });
      return;
    }
    setCards((prev) => {
      const exists = prev.some((c) => c.id === editingCard.id);
      const next = exists
        ? prev.map((c) => (c.id === editingCard.id ? editingCard : c))
        : [...prev, editingCard];
      if (editingCard.isDefault) {
        next.forEach((c) => (c.isDefault = c.id === editingCard.id));
      }
      return next;
    });
    setCardDialogOpen(false);
    setSnack({ open: true, msg: "Cartão salvo.", severity: "success" });
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setSnack({ open: true, msg: "Cartão removido.", severity: "warning" });
  };

  // handlers - password
  const changePassword = () => {
    if (!oldPass || newPass.length < 6 || newPass !== confirmPass) {
      setSnack({
        open: true,
        msg: "Verifique a senha (mín. 6 caracteres e confirmação igual).",
        severity: "error",
      });
      return;
    }
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    setSnack({
      open: true,
      msg: "Senha alterada (mock).",
      severity: "success",
    });
  };

  // handlers - danger zone
  const deleteAccount = () => {
    // mock
    setSnack({
      open: true,
      msg: "Conta excluída (mock).",
      severity: "warning",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid spacing={2} sx={{ width: 1 }}>
        {/* Coluna esquerda: Perfil, Endereços, Cartões */}
        <Grid sx={{ xs: 12, md: 6 }}>
          {/* Dados Pessoais */}
          <Section title="Dados pessoais" icon={<EditRoundedIcon />}>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12, md: 6 }}>
                <TextField
                  label="Nome completo"
                  fullWidth
                  value={user.name}
                  onChange={(e) =>
                    setUser((u) => ({ ...u, name: e.target.value }))
                  }
                />
              </Grid>
              <Grid sx={{ xs: 12, md: 6 }}>
                <TextField
                  label="E-mail"
                  fullWidth
                  value={user.email}
                  disabled
                />
              </Grid>
              <Grid sx={{ xs: 12, md: 6 }}>
                <TextField
                  label="Telefone"
                  fullWidth
                  value={user.phone ?? ""}
                  onChange={(e) =>
                    setUser((u) => ({ ...u, phone: e.target.value }))
                  }
                />
              </Grid>
              <Grid sx={{ xs: 12, md: 3 }}>
                <TextField
                  label="CPF"
                  fullWidth
                  value={user.cpf ?? ""}
                  onChange={(e) =>
                    setUser((u) => ({ ...u, cpf: e.target.value }))
                  }
                />
              </Grid>
              <Grid sx={{ xs: 12, md: 3 }}>
                <TextField
                  type="date"
                  label="Nascimento"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={user.birth ?? ""}
                  onChange={(e) =>
                    setUser((u) => ({ ...u, birth: e.target.value }))
                  }
                />
              </Grid>
            </Grid>
            <Stack direction="row" gap={1} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                onClick={onSaveUser}
                disabled={savingUser}
              >
                Salvar
              </Button>
              <Button onClick={() => setUser(MOCK_USER)}>Desfazer</Button>
            </Stack>
          </Section>

          {/* Endereços */}
          <Section title="Endereços" icon={<LocationOnRoundedIcon />}>
            <Stack gap={1.5} sx={{ width: 1 }}>
              {addresses.map((a) => (
                <Paper
                  key={a.id}
                  variant="outlined"
                  sx={{ p: 1.5, borderRadius: 2, width: 1 }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "start", sm: "center" }}
                    justifyContent="space-between"
                    gap={1}
                  >
                    <Stack gap={0.5}>
                      <Typography fontWeight={700}>
                        {a.label} {a.isDefault ? "• padrão" : ""}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {a.line1}
                        {a.line2 ? `, ${a.line2}` : ""} — {a.city}/{a.state} •{" "}
                        {a.zip}
                      </Typography>
                    </Stack>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {!a.isDefault && (
                        <Button
                          size="small"
                          onClick={() =>
                            setAddresses((prev) =>
                              prev.map((x) => ({
                                ...x,
                                isDefault: x.id === a.id,
                              }))
                            )
                          }
                        >
                          Definir como padrão
                        </Button>
                      )}
                      <Button size="small" onClick={() => openEditAddress(a)}>
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeAddress(a.id)}
                      >
                        Remover
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
              <Button
                startIcon={<AddRoundedIcon />}
                onClick={openNewAddress}
                variant="outlined"
              >
                Adicionar endereço
              </Button>
            </Stack>
          </Section>

          {/* Pagamentos */}
          <Section title="Pagamentos" icon={<CreditCardRoundedIcon />}>
            <Stack gap={1.5} sx={{ width: 1 }}>
              {cards.map((c) => (
                <Paper
                  key={c.id}
                  variant="outlined"
                  sx={{ p: 1.5, borderRadius: 2, width: 1 }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "start", sm: "center" }}
                    justifyContent="space-between"
                    gap={1}
                  >
                    <Stack>
                      <Typography fontWeight={700}>
                        {maskCard(c)} {c.isDefault ? "• padrão" : ""}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Titular: {c.holder} • Validade{" "}
                        {String(c.expMonth).padStart(2, "0")}/
                        {String(c.expYear).slice(-2)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {!c.isDefault && (
                        <Button
                          size="small"
                          onClick={() =>
                            setCards((prev) =>
                              prev.map((x) => ({
                                ...x,
                                isDefault: x.id === c.id,
                              }))
                            )
                          }
                        >
                          Definir como padrão
                        </Button>
                      )}
                      <Button size="small" onClick={() => openEditCard(c)}>
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeCard(c.id)}
                      >
                        Remover
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
              <Button
                startIcon={<AddRoundedIcon />}
                onClick={openNewCard}
                variant="outlined"
              >
                Adicionar cartão
              </Button>
            </Stack>
          </Section>
        </Grid>

        {/* Coluna direita: Segurança, Notificações, Danger */}
        <Grid sx={{ xs: 12, md: 6 }}>
          {/* Segurança & Privacidade */}
          <Section
            title="Segurança & privacidade"
            icon={<SecurityRoundedIcon />}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={!!user.twoFA}
                  onChange={(_, v) => setUser((u) => ({ ...u, twoFA: v }))}
                />
              }
              label="Ativar verificação em duas etapas (mock)"
            />
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Alterar senha
            </Typography>
            <Stack gap={1}>
              <TextField
                type="password"
                label="Senha atual"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                fullWidth
              />
              <TextField
                type="password"
                label="Nova senha"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                helperText="Mínimo 6 caracteres"
                fullWidth
              />
              <TextField
                type="password"
                label="Confirmar nova senha"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={changePassword}>
                Atualizar senha
              </Button>
            </Stack>
          </Section>

          {/* Notificações */}
          <Section title="Notificações" icon={<NotificationsRoundedIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!user.marketingEmail}
                  onChange={(_, v) =>
                    setUser((u) => ({ ...u, marketingEmail: v }))
                  }
                />
              }
              label="Receber promoções por e-mail"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={!!user.marketingSMS}
                  onChange={(_, v) =>
                    setUser((u) => ({ ...u, marketingSMS: v }))
                  }
                />
              }
              label="Receber SMS de ofertas"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={!!user.marketingPush}
                  onChange={(_, v) =>
                    setUser((u) => ({ ...u, marketingPush: v }))
                  }
                />
              }
              label="Ativar notificações push (mock)"
            />
            <Divider sx={{ my: 1.5 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={!!user.newsletter}
                  onChange={(_, v) => setUser((u) => ({ ...u, newsletter: v }))}
                />
              }
              label="Assinar newsletter"
            />
          </Section>

          {/* Danger Zone */}
          <Section title="Zona de perigo" icon={<DeleteRoundedIcon />}>
            <Typography variant="body2" color="text.secondary">
              Excluir sua conta apagará seus dados (mock). Esta ação não pode
              ser desfeita.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteRoundedIcon />}
              sx={{ mt: 1 }}
              onClick={deleteAccount}
            >
              Excluir conta
            </Button>
          </Section>
        </Grid>
      </Grid>
      <ProfileInfo></ProfileInfo>
      {/* Dialogs: Endereço */}
      <Dialog
        open={addressDialogOpen}
        onClose={() => setAddressDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingAddress &&
          MOCK_ADDRESSES.some((a) => a.id === editingAddress.id)
            ? "Editar endereço"
            : "Novo endereço"}
        </DialogTitle>
        <DialogContent dividers>
          {editingAddress && (
            <Stack gap={1.5} sx={{ mt: 0.5 }}>
              <TextField
                label="Rótulo"
                value={editingAddress.label}
                onChange={(e) =>
                  setEditingAddress({
                    ...editingAddress,
                    label: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                label="Linha 1"
                value={editingAddress.line1}
                onChange={(e) =>
                  setEditingAddress({
                    ...editingAddress,
                    line1: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                label="Linha 2"
                value={editingAddress.line2 ?? ""}
                onChange={(e) =>
                  setEditingAddress({
                    ...editingAddress,
                    line2: e.target.value,
                  })
                }
                fullWidth
              />
              <Grid container spacing={2}>
                <Grid sx={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Cidade"
                    fullWidth
                    value={editingAddress.city}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        city: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid sx={{ xs: 6, md: 3 }}>
                  <TextField
                    label="UF"
                    fullWidth
                    value={editingAddress.state}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        state: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid sx={{ xs: 6, md: 3 }}>
                  <TextField
                    label="CEP"
                    fullWidth
                    value={editingAddress.zip}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        zip: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!editingAddress.isDefault}
                    onChange={(_, v) =>
                      setEditingAddress({ ...editingAddress, isDefault: v })
                    }
                  />
                }
                label="Definir como padrão"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveAddress}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialogs: Cartão */}
      <Dialog
        open={cardDialogOpen}
        onClose={() => setCardDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingCard && MOCK_CARDS.some((c) => c.id === editingCard.id)
            ? "Editar cartão"
            : "Novo cartão"}
        </DialogTitle>
        <DialogContent dividers>
          {editingCard && (
            <Stack gap={1.5} sx={{ mt: 0.5 }}>
              <TextField
                label="Titular"
                fullWidth
                value={editingCard.holder}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, holder: e.target.value })
                }
              />
              <Grid container spacing={2}>
                <Grid sx={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Bandeira"
                    select
                    fullWidth
                    value={editingCard.brand}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        brand: e.target.value as Card["brand"],
                      })
                    }
                  >
                    {["Visa", "Mastercard", "Elo", "Amex"].map((b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid sx={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Final do cartão (últimos 4)"
                    fullWidth
                    value={editingCard.last4}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        last4: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid sx={{ xs: 6 }}>
                  <TextField
                    label="Mês"
                    type="number"
                    fullWidth
                    value={editingCard.expMonth}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        expMonth: Math.max(
                          1,
                          Math.min(12, Number(e.target.value))
                        ),
                      })
                    }
                  />
                </Grid>
                <Grid sx={{ xs: 6 }}>
                  <TextField
                    label="Ano"
                    type="number"
                    fullWidth
                    value={editingCard.expYear}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        expYear: Number(e.target.value),
                      })
                    }
                  />
                </Grid>
              </Grid>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!editingCard.isDefault}
                    onChange={(_, v) =>
                      setEditingCard({ ...editingCard, isDefault: v })
                    }
                  />
                }
                label="Definir como padrão"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCardDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveCard}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}

function ProfileInfo() {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2, width: 1 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <Box position="relative">
            <Avatar
              src={avatarPreview}
              alt={user.name}
              sx={{ width: 80, height: 80 }}
            />
            <IconButton
              size="small"
              onClick={onAvatarClick}
              sx={{
                position: "absolute",
                right: -6,
                bottom: -6,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <CameraAltRoundedIcon fontSize="small" />
            </IconButton>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onAvatarChange}
            />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {user.name}
            </Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Stack direction="row" gap={1} sx={{ mt: 1 }} flexWrap="wrap">
              <Chip
                icon={<ReceiptLongRoundedIcon />}
                label={`${ordersCount} pedidos`}
              />
              <Chip label={`${points} pontos`} color="success" />
              <Chip label={`${coupons} cupons`} color="primary" />
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" gap={1}>
          <Button component={RouterLink} to="/orders">
            Meus pedidos
          </Button>
          <Button color="inherit" startIcon={<LogoutRoundedIcon />}>
            Sair
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
