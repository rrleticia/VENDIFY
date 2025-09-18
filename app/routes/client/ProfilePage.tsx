import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
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
import { useProfileContext } from "@common/contexts";
import ProfileSection from "@components/Pages/ProfileSection";
import { useProfileForm } from "@common/hooks/models/ProfileForm";
import type { AddressType } from "@common/types/UserType";
import { useAddressForm } from "@common/hooks/models/AddressForm";

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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <ProfileInfo></ProfileInfo>
      <Grid spacing={2} sx={{ width: 1 }}>
        {/* Coluna esquerda: Perfil, Endereços, Cartões */}
        <Grid sx={{ xs: 12, md: 6 }}>
          {/* Dados Pessoais */}
          <PersonalInfo></PersonalInfo>

          {/* Endereços */}
          <AddressInfo setSnack={setSnack}></AddressInfo>

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

interface IProfileInfoProps {}

function ProfileInfo({}: IProfileInfoProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { user, avatar, userOrdersInfo } = useProfileContext();

  if (!user || !avatar || !userOrdersInfo) {
    return;
  }

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
              src={avatar.imageUrl}
              alt={avatar.imageAlt}
              sx={{ width: 80, height: 80 }}
            />
            <IconButton
              size="small"
              onClick={() => {}}
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
              onChange={() => console.log("avatar change")}
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
                label={`${userOrdersInfo.ordersCount} pedidos`}
              />
              <Chip label={`${userOrdersInfo.points} pontos`} color="success" />
              <Chip
                label={`${userOrdersInfo.coupons} cupons`}
                color="primary"
              />
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

interface IPersonalInfoProps {}

function PersonalInfo({}: IPersonalInfoProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useProfileContext();

  const { formData, errors, handleInputChange, verifyErrors, resetForm } =
    useProfileForm();

  if (!user) {
    return;
  }

  useEffect(() => {}, []);

  const onSubmit = async (event: FormEvent) => {
    setLoading(true);
    event.preventDefault();
    if (verifyErrors()) {
      //   const result = await login(formData.email, formData.password);
      //   if (result) navigate("/home");
    } else {
    }
    setLoading(false);
  };

  const onCancel = async (_: FormEvent) => {
    resetForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      cpf: user.cpf,
      birthdate: user.birthdate,
    });
  };

  return (
    <ProfileSection title="Dados pessoais" icon={<EditRoundedIcon />}>
      <Grid container spacing={2}>
        <form onSubmit={onSubmit}>
          <Grid sx={{ xs: 12, md: 6 }}>
            <TextField
              label="Nome completo"
              fullWidth
              value={formData.name}
              error={Boolean(errors.email)}
              helperText={errors.email || ""}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 6 }}>
            <TextField
              label="E-mail"
              fullWidth
              value={formData.email}
              error={Boolean(errors.email)}
              helperText={errors.email || ""}
              onChange={handleInputChange}
              disabled={true}
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 6 }}>
            <TextField
              label="Telefone"
              fullWidth
              value={formData.phone}
              error={Boolean(errors.phone)}
              helperText={errors.phone || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 3 }}>
            <TextField
              label="CPF"
              fullWidth
              value={formData.cpf}
              error={Boolean(errors.cpf)}
              helperText={errors.cpf || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid sx={{ xs: 12, md: 3 }}>
            <TextField
              type="date"
              label="Nascimento"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              value={formData.birthdate}
              error={Boolean(errors.birthdate)}
              helperText={errors.birthdate || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </form>
      </Grid>
      <Stack direction="row" gap={1} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          onClick={onSubmit}
          disabled={loading}
        >
          Salvar
        </Button>
        <Button onClick={onCancel}>Desfazer</Button>
      </Stack>
    </ProfileSection>
  );
}

interface IAddressInfoProps {
  setSnack: (_: any) => void;
}

function AddressInfo({ setSnack }: IAddressInfoProps) {
  const {
    addresses,
    // deleteAddress
  } = useProfileContext();

  const { resetForm } = useAddressForm();

  if (!addresses) {
    return;
  }

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"EDIT" | "NEW">("NEW");

  // handlers - address
  const openNewAddress = () => {
    setDialogMode("NEW");
    setAddressDialogOpen(true);
  };

  const openEditAddress = (a: any) => {
    resetForm({ ...a });
    setDialogMode("EDIT");
    setAddressDialogOpen(true);
  };

  const setDefaultAddress = (id: string) => {
    // updateAddress(id);
  };

  const removeAddress = (id: string) => {
    // deleteAddress(id);
    setSnack({ open: true, msg: "Endereço removido.", severity: "warning" });
  };

  return (
    <ProfileSection title="Endereços" icon={<LocationOnRoundedIcon />}>
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
                  {a.street + " " + a.neighborhood}
                  {a.complement ? `, ${a.complement}` : ""} — {a.city}/{a.state}{" "}
                  • {a.zipCode}
                </Typography>
              </Stack>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {!a.isDefault && (
                  <Button size="small" onClick={() => setDefaultAddress(a.id)}>
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
      {/* Dialogs: Endereço */}
      <AddressDialog
        id={""}
        dialogMode={dialogMode}
        addressDialogOpen={addressDialogOpen}
        setAddressDialogOpen={setAddressDialogOpen}
      ></AddressDialog>
    </ProfileSection>
  );
}

interface IAddressDialogProps {
  id: string;
  dialogMode: "EDIT" | "NEW";
  addressDialogOpen: boolean;
  setAddressDialogOpen: (_: boolean) => void;
}

function AddressDialog({
  dialogMode,
  addressDialogOpen,
  setAddressDialogOpen,
}: IAddressDialogProps) {
  const { formData, handleInputChange } = useAddressForm();

  const onSubmit = () => {
    // dialogMode === "EDIT" ? upsertAddress() ;
  };

  return (
    <Dialog
      open={addressDialogOpen}
      onClose={() => setAddressDialogOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {dialogMode === "EDIT" ? "Editar endereço" : "Novo endereço"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack gap={1.5} sx={{ mt: 0.5 }}>
          <TextField
            label="Rótulo"
            value={formData.label}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Logradouro"
            value={formData.street}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="complemento"
            value={formData.complement}
            onChange={handleInputChange}
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid sx={{ xs: 12, md: 6 }}>
              <TextField
                label="Cidade"
                fullWidth
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid sx={{ xs: 6, md: 3 }}>
              <TextField
                label="UF"
                fullWidth
                value={formData.state}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid sx={{ xs: 6, md: 3 }}>
              <TextField
                label="CEP"
                fullWidth
                value={formData.zipCode}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Switch
                checked={!!formData.isDefault}
                onChange={handleInputChange}
              />
            }
            label="Definir como padrão"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAddressDialogOpen(false)}>Cancelar</Button>
        <Button variant="contained" onClick={onSubmit}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
